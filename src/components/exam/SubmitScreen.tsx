"use client";

import { Button } from "@/components/ui/Button";
import { IconArrowLeft } from "@/components/ui/icons";

export function SubmitScreen({
  moduleLabel,
  answered,
  total,
  flagged,
  isLastModule,
  nextLabel,
  onBack,
  onConfirm,
}: {
  moduleLabel: string;
  answered: number;
  total: number;
  flagged: number[];
  isLastModule: boolean;
  nextLabel?: string;
  onBack: () => void;
  onConfirm: () => void;
}) {
  const missing = total - answered;

  return (
    <div className="absolute inset-0 z-40 overflow-y-auto bg-bg">
      <div className="mx-auto w-full max-w-xl px-5 py-12">
        <button
          type="button"
          onClick={onBack}
          className="mb-8 flex cursor-pointer items-center gap-1.5 text-sm font-bold text-text-muted hover:text-text"
        >
          <IconArrowLeft width={16} height={16} /> Back to the questions
        </button>

        <h1 className="font-serif text-3xl font-bold">Finish {moduleLabel}?</h1>

        <dl className="mt-8 divide-y divide-border overflow-hidden rounded-lg border border-border bg-bg-raised">
          <Row label="Answered" value={`${answered} of ${total}`} />
          <Row
            label="Left blank"
            value={missing === 0 ? "None" : String(missing)}
            tone={missing > 0 ? "warn" : undefined}
          />
          <Row
            label="Flagged for review"
            value={flagged.length === 0 ? "None" : flagged.join(", ")}
            tone={flagged.length > 0 ? "warn" : undefined}
          />
        </dl>

        {missing > 0 && (
          <p className="mt-5 rounded-md border border-accent bg-accent-soft px-4 py-3 text-sm text-amber-700">
            A blank answer scores zero, and a guess costs nothing. There is no penalty for
            a wrong answer in IELTS.
          </p>
        )}

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Button variant="accent" size="lg" onClick={onConfirm}>
            {isLastModule ? "Submit the test" : `Continue to ${nextLabel}`}
          </Button>
          <Button variant="outline" size="lg" onClick={onBack}>
            Keep working
          </Button>
        </div>

        {!isLastModule && (
          <p className="mt-4 text-sm text-text-muted">
            You cannot come back to {moduleLabel} once you continue.
          </p>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, tone }: { label: string; value: string; tone?: "warn" }) {
  return (
    <div className="flex items-baseline justify-between gap-4 px-5 py-4">
      <dt className="font-bold">{label}</dt>
      <dd className={`tabular text-right ${tone === "warn" ? "text-amber-700" : "text-text-muted"}`}>
        {value}
      </dd>
    </div>
  );
}
