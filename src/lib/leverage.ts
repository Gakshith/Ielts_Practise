/* ===========================================================================
   "Where is your cheapest half-band?"

   For each module, what the OVERALL band would become if that module rose by
   0.5 and by 1.0, everything else held fixed. Because the overall band is
   rounded (`roundToBand`), a half-band gain in the wrong module can buy
   nothing at all — that is exactly what `wasted` names.
   =========================================================================== */

import type { LeverageHint, ModuleId } from "@/types";
import { ALL_MODULES, overallBand, toBandMap, type ModuleBandInput } from "./scoring";

/** The rises we model. Half a band is one practice cycle; a full band is a term's work. */
export const LEVERAGE_STEPS = [0.5, 1.0] as const;
export type LeverageStep = (typeof LEVERAGE_STEPS)[number];

const MAX_BAND = 9;

/**
 * Leverage hints for every module that has a band, ranked by how much overall
 * band the rise buys (biggest gain first, cheapest step first within a tie).
 *
 * Returns [] when the overall band is not computable — an overall band needs
 * all four modules, and comparing against a fabricated partial mean would make
 * every hint meaningless.
 */
export function computeLeverage(modules: ModuleBandInput): LeverageHint[] {
  const map = toBandMap(modules);
  const overallFrom = overallBand(map);
  if (overallFrom === undefined) return [];

  const hints: LeverageHint[] = [];
  for (const moduleId of ALL_MODULES) {
    const from = map[moduleId];
    if (typeof from !== "number" || !Number.isFinite(from)) continue;
    for (const step of LEVERAGE_STEPS) {
      const to = Math.min(MAX_BAND, from + step);
      if (to <= from) continue; // already at band 9: no rise to model
      const overallTo = overallBand({ ...map, [moduleId]: to });
      if (overallTo === undefined) continue;
      hints.push({
        module: moduleId,
        from,
        to,
        overallFrom,
        overallTo,
        wasted: overallTo <= overallFrom,
      });
    }
  }

  const moduleOrder = (m: ModuleId): number => ALL_MODULES.indexOf(m);
  return hints.sort((a, b) => {
    const gain = b.overallTo - b.overallFrom - (a.overallTo - a.overallFrom);
    if (gain !== 0) return gain;
    const step = a.to - a.from - (b.to - b.from);
    if (step !== 0) return step;
    return moduleOrder(a.module) - moduleOrder(b.module);
  });
}

/**
 * The single cheapest hint that actually moves the overall band, or null when
 * no half- or full-band rise in any one module would move it.
 */
export function cheapestGain(hints: readonly LeverageHint[]): LeverageHint | null {
  const useful = hints.filter((h) => !h.wasted);
  if (useful.length === 0) return null;
  return useful.reduce((best, hint) =>
    hint.to - hint.from < best.to - best.from ? hint : best,
  );
}

/** Modules where a half-band rise buys nothing at all — worth saying out loud. */
export function wastedModules(hints: readonly LeverageHint[]): readonly ModuleId[] {
  const wasted = new Set<ModuleId>();
  for (const hint of hints) {
    if (hint.wasted && hint.to - hint.from === 0.5) wasted.add(hint.module);
  }
  return Array.from(wasted);
}
