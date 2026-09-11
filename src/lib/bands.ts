/* ===========================================================================
   Raw score -> band conversion tables.

   HONESTY NOTE — READ BEFORE USING THESE NUMBERS.
   IELTS does not publish a per-raw-score conversion table. ielts.org publishes
   only anchor points. The tables below are the widely reproduced *indicative*
   scale from Cambridge IELTS practice books, cross-checked across two
   independent sources and consistent with the official anchors.

   Every table therefore carries `indicative: true`, and every lookup result
   carries it too, so the UI can never render a band without being able to
   label it honestly. Do not present these as official. Do not add rows the
   sources do not cover — see `lowestCoveredRaw` / `belowScale`.
   =========================================================================== */

import type { ModuleId, TestKind } from "@/types";

/** Bump when a row changes, so a cached result can be invalidated. */
export const BAND_SCALE_VERSION = "indicative-2024.1";

/** Modules that convert a raw /40 score into a band. Writing and speaking do not. */
export type ObjectiveModule = Extract<ModuleId, "listening" | "reading">;

export type BandTableId = "listening" | "reading-academic" | "reading-general";

/** One inclusive raw-score span mapping to one band. */
export interface BandRow {
  readonly minRaw: number;
  readonly maxRaw: number;
  readonly band: number;
}

export interface BandTable {
  readonly id: BandTableId;
  /** human label for the UI, e.g. "Reading (General Training)" */
  readonly label: string;
  readonly module: ObjectiveModule;
  /** which test kinds this table applies to */
  readonly appliesTo: readonly TestKind[];
  readonly maxRaw: number;
  /** always true — see the file header. The UI must surface this. */
  readonly indicative: true;
  readonly sourceNote: string;
  /**
   * The lowest raw score the sources actually cover. Anything below this is
   * NOT in the published scale, so we refuse to invent a threshold for it.
   */
  readonly lowestCoveredRaw: number;
  /** descending by band */
  readonly rows: readonly BandRow[];
}

/* ------------------------------------------------------------------ tables */

const LISTENING: BandTable = {
  id: "listening",
  label: "Listening",
  module: "listening",
  appliesTo: ["academic", "general"],
  maxRaw: 40,
  indicative: true,
  sourceNote:
    "Indicative Cambridge practice-book scale. Identical for Academic and General Training.",
  lowestCoveredRaw: 10,
  rows: [
    { minRaw: 39, maxRaw: 40, band: 9.0 },
    { minRaw: 37, maxRaw: 38, band: 8.5 },
    { minRaw: 35, maxRaw: 36, band: 8.0 },
    { minRaw: 32, maxRaw: 34, band: 7.5 },
    { minRaw: 30, maxRaw: 31, band: 7.0 },
    { minRaw: 26, maxRaw: 29, band: 6.5 },
    { minRaw: 23, maxRaw: 25, band: 6.0 },
    { minRaw: 18, maxRaw: 22, band: 5.5 },
    { minRaw: 16, maxRaw: 17, band: 5.0 },
    { minRaw: 13, maxRaw: 15, band: 4.5 },
    { minRaw: 10, maxRaw: 12, band: 4.0 },
    // Below 10: the sources we cross-checked do not cover it. We clamp to the
    // lowest covered band (4.0) and flag `belowScale: true` on the lookup so
    // the UI can say "below the published scale" instead of showing a number
    // we made up. Do not add invented rows here.
  ],
};

const READING_ACADEMIC: BandTable = {
  id: "reading-academic",
  label: "Reading (Academic)",
  module: "reading",
  appliesTo: ["academic"],
  maxRaw: 40,
  indicative: true,
  sourceNote: "Indicative Cambridge practice-book scale for Academic Reading.",
  lowestCoveredRaw: 10,
  rows: [
    { minRaw: 39, maxRaw: 40, band: 9.0 },
    { minRaw: 37, maxRaw: 38, band: 8.5 },
    { minRaw: 35, maxRaw: 36, band: 8.0 },
    { minRaw: 33, maxRaw: 34, band: 7.5 },
    { minRaw: 30, maxRaw: 32, band: 7.0 },
    { minRaw: 27, maxRaw: 29, band: 6.5 },
    { minRaw: 23, maxRaw: 26, band: 6.0 },
    { minRaw: 19, maxRaw: 22, band: 5.5 },
    { minRaw: 15, maxRaw: 18, band: 5.0 },
    { minRaw: 13, maxRaw: 14, band: 4.5 },
    { minRaw: 10, maxRaw: 12, band: 4.0 },
    // Below 10: not covered by the sources. See the listening comment above.
  ],
};

/**
 * General Training Reading is a materially harsher scale — a separate table,
 * not a variant of the Academic one. The headline contrast worth surfacing:
 * 30 correct answers is band 7.0 on Academic Reading but band 6.0 on GT
 * Reading. `readingBandContrast()` below exposes that for the UI.
 */
const READING_GENERAL: BandTable = {
  id: "reading-general",
  label: "Reading (General Training)",
  module: "reading",
  appliesTo: ["general"],
  maxRaw: 40,
  indicative: true,
  sourceNote:
    "Indicative Cambridge practice-book scale for General Training Reading. Harsher than Academic at every comparable raw score.",
  lowestCoveredRaw: 9,
  rows: [
    { minRaw: 40, maxRaw: 40, band: 9.0 },
    { minRaw: 39, maxRaw: 39, band: 8.5 },
    { minRaw: 37, maxRaw: 38, band: 8.0 },
    { minRaw: 36, maxRaw: 36, band: 7.5 },
    { minRaw: 34, maxRaw: 35, band: 7.0 },
    { minRaw: 32, maxRaw: 33, band: 6.5 },
    { minRaw: 30, maxRaw: 31, band: 6.0 },
    { minRaw: 27, maxRaw: 29, band: 5.5 },
    { minRaw: 23, maxRaw: 26, band: 5.0 },
    { minRaw: 19, maxRaw: 22, band: 4.5 },
    { minRaw: 15, maxRaw: 18, band: 4.0 },
    { minRaw: 12, maxRaw: 14, band: 3.5 },
    { minRaw: 9, maxRaw: 11, band: 3.0 },
    // Below 9: not covered by the sources.
  ],
};

/** Every conversion table, keyed by id. The single source of truth. */
export const BAND_TABLES: Readonly<Record<BandTableId, BandTable>> = {
  listening: LISTENING,
  "reading-academic": READING_ACADEMIC,
  "reading-general": READING_GENERAL,
};

export const BAND_TABLE_LIST: readonly BandTable[] = [
  LISTENING,
  READING_ACADEMIC,
  READING_GENERAL,
];

/* ----------------------------------------------------------------- lookups */

export interface BandLookup {
  readonly table: BandTableId;
  /** the raw score as used for the lookup (clamped into 0..maxRaw) */
  readonly raw: number;
  readonly band: number;
  /** always true: this scale is indicative, never official */
  readonly indicative: true;
  /**
   * true when the raw score sits below the lowest score our sources cover.
   * `band` is then clamped to the lowest covered band and must be shown as
   * "below the published scale", not as a precise result.
   */
  readonly belowScale: boolean;
  readonly scaleVersion: string;
}

/** Which table a module + test kind uses. Spec rule: GT Reading has its own scale. */
export function tableFor(module: ObjectiveModule, kind: TestKind): BandTable {
  if (module === "listening") return LISTENING;
  return kind === "general" ? READING_GENERAL : READING_ACADEMIC;
}

/**
 * Convert a raw /40 score to an indicative band using one table.
 * Scores above `maxRaw` clamp to the top band; scores below the covered range
 * clamp to the lowest covered band with `belowScale: true`.
 */
export function bandForRaw(table: BandTable, raw: number): BandLookup {
  const safe = Number.isFinite(raw) ? Math.max(0, Math.min(table.maxRaw, Math.round(raw))) : 0;
  const row = table.rows.find((r) => safe >= r.minRaw && safe <= r.maxRaw);
  if (row) {
    return {
      table: table.id,
      raw: safe,
      band: row.band,
      indicative: true,
      belowScale: false,
      scaleVersion: BAND_SCALE_VERSION,
    };
  }
  // Only reachable below `lowestCoveredRaw` — the rows cover everything above it.
  const lowest = table.rows[table.rows.length - 1];
  return {
    table: table.id,
    raw: safe,
    band: lowest ? lowest.band : 0,
    indicative: true,
    belowScale: true,
    scaleVersion: BAND_SCALE_VERSION,
  };
}

/** Convenience: pick the table from module + kind, then look the raw score up. */
export function bandFor(module: ObjectiveModule, kind: TestKind, raw: number): BandLookup {
  return bandForRaw(tableFor(module, kind), raw);
}

/**
 * The Academic vs General Training Reading gap at one raw score, so the UI can
 * show it rather than asserting it. At raw 30 this returns academic 7.0 /
 * general 6.0 — a full band for the same number of correct answers.
 */
export interface ReadingContrast {
  readonly raw: number;
  readonly academic: number;
  readonly general: number;
  /** academic band minus general band; 0 when the two tables agree */
  readonly gap: number;
  readonly indicative: true;
}

export function readingBandContrast(raw: number): ReadingContrast {
  const academic = bandForRaw(READING_ACADEMIC, raw);
  const general = bandForRaw(READING_GENERAL, raw);
  return {
    raw: academic.raw,
    academic: academic.band,
    general: general.band,
    gap: Math.round((academic.band - general.band) * 10) / 10,
    indicative: true,
  };
}

/* ------------------------------------------------------- descriptor scale */

export interface BandDescriptor {
  readonly band: number;
  /** "Expert user" */
  readonly label: string;
  /** condensed official descriptor text */
  readonly summary: string;
}

/**
 * The 9-band descriptor scale. Unlike the conversion tables above, these
 * descriptors ARE published by IELTS — the wording here is condensed, the
 * labels are verbatim.
 */
export const BAND_DESCRIPTORS: readonly BandDescriptor[] = [
  {
    band: 9,
    label: "Expert user",
    summary:
      "Full operational command of the language: appropriate, accurate and fluent with complete understanding.",
  },
  {
    band: 8,
    label: "Very good user",
    summary:
      "Fully operational command with only occasional unsystematic inaccuracies. May misunderstand some things in unfamiliar situations.",
  },
  {
    band: 7,
    label: "Good user",
    summary:
      "Operational command, though with occasional inaccuracies and misunderstandings. Generally handles complex language well.",
  },
  {
    band: 6,
    label: "Competent user",
    summary:
      "Generally effective command despite some inaccuracies and misunderstandings. Can use fairly complex language in familiar situations.",
  },
  {
    band: 5,
    label: "Modest user",
    summary:
      "Partial command, coping with overall meaning in most situations, though likely to make many mistakes. Can handle basic communication in their own field.",
  },
  {
    band: 4,
    label: "Limited user",
    summary:
      "Basic competence limited to familiar situations. Frequent problems in understanding and expression. Cannot use complex language.",
  },
  {
    band: 3,
    label: "Extremely limited user",
    summary:
      "Conveys and understands only general meaning in very familiar situations. Frequent breakdowns in communication.",
  },
  {
    band: 2,
    label: "Intermittent user",
    summary:
      "No real communication except the most basic information using isolated words or short formulae in familiar situations.",
  },
  {
    band: 1,
    label: "Non-user",
    summary: "Essentially no ability to use the language beyond a few isolated words.",
  },
  {
    band: 0,
    label: "Did not attempt",
    summary: "No assessable information was provided.",
  },
];

/**
 * The descriptor for a band. Half bands take the descriptor of the whole band
 * below them (band 6.5 is described by band 6), which is how IELTS presents
 * the scale.
 */
export function descriptorFor(band: number): BandDescriptor {
  const whole = Number.isFinite(band) ? Math.max(0, Math.min(9, Math.floor(band))) : 0;
  const found = BAND_DESCRIPTORS.find((d) => d.band === whole);
  // BAND_DESCRIPTORS covers every whole band 0..9, so `found` is always set;
  // the fallback exists only to keep the return type non-optional.
  return found ?? BAND_DESCRIPTORS[BAND_DESCRIPTORS.length - 1];
}
