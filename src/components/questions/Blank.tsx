"use client";

import type { Mode } from "@/types";

export type Verdict = "correct" | "incorrect" | undefined;

/* The inline numbered box used by every completion question type. In the real player
   the box shows the question number until the candidate types over it. */
export function Blank({
  n,
  value,
  onChange,
  onFocus,
  active,
  verdict,
  mode,
  overLimit,
  width = "9ch",
}: {
  n: number;
  value: string;
  onChange: (v: string) => void;
  onFocus: () => void;
  active: boolean;
  verdict?: Verdict;
  mode: Mode;
  overLimit?: boolean;
  width?: string;
}) {
  const state =
    verdict === "correct"
      ? "border-success bg-success-soft text-success"
      : verdict === "incorrect"
        ? "border-danger bg-danger-soft text-danger"
        : overLimit && mode === "coach"
          ? "border-accent bg-accent-soft"
          : active
            ? "border-primary ring-2 ring-primary/25"
            : "border-border-strong";

  return (
    <span className="relative inline-flex items-baseline align-baseline">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        aria-label={`Question ${n}`}
        autoComplete="off"
        spellCheck={false}
        className={`tabular mx-1 inline-block rounded-sm border bg-bg-raised px-2 py-0.5 text-center font-sans text-[0.95em] font-bold outline-none transition-colors ${state}`}
        style={{ width }}
        placeholder={String(n)}
      />
      {overLimit && mode === "coach" && (
        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[0.7rem] font-bold text-amber-700">
          over the word limit
        </span>
      )}
    </span>
  );
}
