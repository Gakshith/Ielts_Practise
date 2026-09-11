import type { MistakeCause } from "@/types";

export const CAUSE_LABEL: Record<MistakeCause, string> = {
  "notgiven-vs-false": "Chose FALSE where the text was simply silent",
  "paraphrase-missed": "Did not recognise the paraphrase",
  "keyword-trap": "Matched a word, not the meaning",
  "outside-knowledge": "Answered from knowledge, not the text",
  distractor: "Took the value the speaker then corrected",
  "lost-thread": "Lost the thread in the audio",
  spelling: "Spelling",
  "number-agreement": "Singular or plural",
  format: "Number or date format",
  "word-limit": "Over the word limit — scores zero even when right",
  "out-of-time": "Ran out of time",
  blank: "Left blank",
};

/* Ranked horizontal bars, one hue. Sorted descending because the ranking IS the
   insight, and every bar carries its count so the chart never depends on length alone. */
export function CauseBreakdown({
  counts,
  total,
}: {
  counts: Partial<Record<MistakeCause, number>>;
  total: number;
}) {
  const rows = (Object.entries(counts) as [MistakeCause, number][])
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1]);

  if (rows.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-border p-6 text-center text-sm text-text-muted">
        Nothing wrong to break down.
      </p>
    );
  }

  const top = rows[0][1];

  return (
    <ul className="flex flex-col gap-3">
      {rows.map(([cause, count]) => (
        <li key={cause}>
          <div className="mb-1 flex items-baseline justify-between gap-3">
            <span className="text-sm leading-snug">{CAUSE_LABEL[cause]}</span>
            <span className="tabular shrink-0 text-sm font-bold">
              {count}
              <span className="font-normal text-text-muted">
                {" "}
                of {total}
              </span>
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-bg-sunken">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${(count / top) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
