"use client";

import { IconBell, IconMenu, IconNote, IconVolume, IconWifi } from "@/components/ui/icons";
import type { Mode } from "@/types";

function formatRemaining(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  // The real player stops showing seconds in the final minute, so a candidate
  // watching the clock tick does not panic over each second.
  if (s < 60) return "less than 1 minute";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} minute${m === 1 ? "" : "s"}`;
  const h = Math.floor(m / 60);
  return `${h}:${String(m % 60).padStart(2, "0")}`;
}

export function ExamHeader({
  moduleLabel,
  remainingSec,
  mode,
  audioPlaying,
  notesOpen,
  onOptions,
  onNotes,
}: {
  moduleLabel: string;
  remainingSec: number | null;
  mode: Mode;
  audioPlaying?: boolean;
  notesOpen?: boolean;
  onOptions: () => void;
  onNotes: () => void;
}) {
  // 10 and 5 minutes are the two warnings the real test gives in Reading and Writing.
  const warn = remainingSec !== null && remainingSec <= 600;
  const urgent = remainingSec !== null && remainingSec <= 300;

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border bg-bg-raised px-4">
      <div className="flex min-w-0 items-center gap-3">
        <span className="font-serif text-lg font-bold leading-none tracking-tight text-primary">
          IELTS<span className="text-accent">·</span>Practise
        </span>
        <span className="hidden h-5 w-px bg-border sm:block" />
        <div className="hidden min-w-0 sm:block">
          <p className="truncate text-sm font-bold leading-tight">{moduleLabel}</p>
          {audioPlaying ? (
            <p className="flex items-center gap-1 text-xs leading-tight text-text-muted">
              <IconVolume width={12} height={12} />
              Audio is playing
            </p>
          ) : (
            <p className="text-xs leading-tight text-text-muted">
              {mode === "exam" ? "Exam mode" : "Coach mode"}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-1 justify-center">
        {remainingSec !== null ? (
          <div
            role="timer"
            aria-live={urgent ? "assertive" : "off"}
            className={[
              "tabular rounded-md border px-3 py-1.5 text-sm font-bold transition-colors",
              urgent
                ? "border-danger bg-danger-soft text-danger"
                : warn
                  ? "border-accent bg-accent-soft text-amber-700"
                  : "border-border bg-bg-sunken text-text",
            ].join(" ")}
          >
            {formatRemaining(remainingSec)} left
          </div>
        ) : (
          <span className="rounded-md border border-border bg-bg-sunken px-3 py-1.5 text-xs font-bold text-text-muted">
            Untimed
          </span>
        )}
      </div>

      <div className="flex items-center gap-1 text-text-muted">
        <span className="hidden p-2 sm:block" title="Connected">
          <IconWifi />
        </span>
        <span className="hidden p-2 sm:block" title="No messages">
          <IconBell />
        </span>
        <button
          type="button"
          onClick={onNotes}
          aria-label="Show notes"
          aria-pressed={notesOpen}
          className={`cursor-pointer rounded-md p-2 transition-colors hover:bg-bg-sunken hover:text-text ${
            notesOpen ? "bg-bg-sunken text-text" : ""
          }`}
        >
          <IconNote />
        </button>
        <button
          type="button"
          onClick={onOptions}
          aria-label="Options"
          className="cursor-pointer rounded-md p-2 transition-colors hover:bg-bg-sunken hover:text-text"
        >
          <IconMenu />
        </button>
      </div>
    </header>
  );
}
