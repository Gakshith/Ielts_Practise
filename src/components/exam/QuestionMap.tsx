"use client";

import { IconCheck } from "@/components/ui/icons";

export interface MapItem {
  n: number;
  answered: boolean;
  flagged: boolean;
}

export interface MapPart {
  label: string;
  items: MapItem[];
}

/* The footer question map, copied in behaviour from the real player:
   the CURRENT part expands to individual numbers, every other part collapses to a
   label plus "x of y". That is how forty questions fit one row without scrolling.

   Flag semantics follow the real test too — flagging changes the marker's SHAPE
   (square to circle), so flagged items are scannable without relying on colour. */
export function QuestionMap({
  parts,
  activePart,
  activeN,
  onSelect,
  onSelectPart,
  onSubmit,
  submitLabel = "Go to submission page",
}: {
  parts: MapPart[];
  activePart: number;
  activeN: number;
  onSelect: (n: number) => void;
  onSelectPart: (partIndex: number) => void;
  onSubmit: () => void;
  submitLabel?: string;
}) {
  return (
    <div className="flex shrink-0 items-stretch border-t border-border bg-bg-raised">
      <div className="flex flex-1 items-center gap-1 overflow-x-auto px-3 py-2">
        {parts.map((part, i) => {
          const answered = part.items.filter((x) => x.answered).length;
          const isActive = i === activePart;

          if (!isActive) {
            return (
              <button
                key={part.label}
                type="button"
                onClick={() => onSelectPart(i)}
                className="flex shrink-0 cursor-pointer items-baseline gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-bg-sunken"
              >
                <span className="font-bold text-text">{part.label}</span>
                <span className="tabular text-text-muted">
                  {answered} of {part.items.length}
                </span>
              </button>
            );
          }

          return (
            <div key={part.label} className="flex shrink-0 items-center gap-2 px-2">
              <span className="text-sm font-bold text-text">{part.label}</span>
              <div className="flex items-center gap-1">
                {part.items.map((item) => {
                  const current = item.n === activeN;
                  return (
                    <button
                      key={item.n}
                      type="button"
                      onClick={() => onSelect(item.n)}
                      aria-current={current ? "true" : undefined}
                      aria-label={`Question ${item.n}${
                        item.answered ? ", answered" : ", not answered"
                      }${item.flagged ? ", flagged for review" : ""}`}
                      className={[
                        "tabular flex h-8 min-w-8 cursor-pointer items-center justify-center border px-1.5 text-[0.8rem] font-bold transition-all duration-150",
                        item.flagged ? "rounded-full" : "rounded-sm",
                        item.answered
                          ? "border-primary bg-primary text-primary-text"
                          : "border-border bg-bg-raised text-text-muted hover:border-border-strong hover:text-text",
                        current ? "ring-2 ring-accent ring-offset-1 ring-offset-bg-raised" : "",
                      ].join(" ")}
                    >
                      {item.n}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onSubmit}
        aria-label={submitLabel}
        title={submitLabel}
        className="flex w-16 shrink-0 cursor-pointer items-center justify-center border-l border-border bg-bg-sunken text-text-muted transition-colors hover:bg-primary hover:text-primary-text"
      >
        <IconCheck width={22} height={22} />
      </button>
    </div>
  );
}
