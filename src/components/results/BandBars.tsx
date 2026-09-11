import type { ModuleId } from "@/types";

const LABEL: Record<ModuleId, string> = {
  listening: "Listening",
  reading: "Reading",
  writing: "Writing",
  speaking: "Speaking",
};

export interface BandRow {
  module: ModuleId;
  band: number;
  estimated: boolean;
}

/* One measure (band) across four categories, so this is magnitude, not identity:
   a SINGLE hue with direct value labels, never four cycled hues. The target is a
   reference line, not a second series.

   Every bar carries its number, because the accent used for the target marker
   fails 3:1 against the surface and may not carry meaning on its own. */
export function BandBars({
  rows,
  target,
  max = 9,
}: {
  rows: BandRow[];
  target?: number;
  max?: number;
}) {
  if (rows.length === 0) return null;
  const lowest = rows.reduce((a, b) => (b.band < a.band ? b : a));

  return (
    <figure className="m-0">
      <ul className="flex flex-col gap-4">
        {rows.map((r) => {
          const pct = Math.max(0, Math.min(100, (r.band / max) * 100));
          const isLowest = r.module === lowest.module && rows.length > 1;
          return (
            <li key={r.module}>
              <div className="mb-1.5 flex items-baseline justify-between gap-3">
                <span className="text-sm font-bold">
                  {LABEL[r.module]}
                  {r.estimated && (
                    <span className="ml-2 font-normal text-text-muted">estimated</span>
                  )}
                  {isLowest && (
                    <span className="ml-2 font-normal text-text-muted">· lowest</span>
                  )}
                </span>
                <span className="tabular text-lg font-bold">{r.band.toFixed(1)}</span>
              </div>

              <div className="relative h-3 w-full rounded-full bg-bg-sunken">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-primary"
                  style={{ width: `${pct}%` }}
                />
                {target !== undefined && (
                  <span
                    aria-hidden="true"
                    className="absolute -top-1 bottom-[-0.25rem] w-0.5 rounded bg-accent-strong"
                    style={{ left: `calc(${(target / max) * 100}% - 1px)` }}
                  />
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {target !== undefined && (
        <figcaption className="mt-4 flex items-center gap-2 text-sm text-text-muted">
          <span aria-hidden="true" className="inline-block h-3.5 w-0.5 rounded bg-accent-strong" />
          Target band {target.toFixed(1)}
        </figcaption>
      )}
    </figure>
  );
}
