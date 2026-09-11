"use client";

import { countWords } from "@/lib/scoring";
import type { Mode, WritingTask } from "@/types";
import { SplitPane } from "./SplitPane";

/* The real writing box has no toolbar, no spellcheck, no autocorrect. That absence is
   the most commonly reported surprise on test day, so we reproduce it exactly. */
export function WritingView({
  task,
  value,
  onChange,
  mode,
}: {
  task: WritingTask;
  value: string;
  onChange: (v: string) => void;
  mode: Mode;
}) {
  const words = countWords(value);
  const short = words > 0 && words < task.minWords;

  return (
    <SplitPane
      left={
        <div className="px-6 py-6 lg:px-10">
          <div className="mb-5 rounded-md border border-border bg-bg-sunken px-4 py-3 text-sm">
            <strong>Task {task.index}.</strong> You should spend about{" "}
            {task.suggestedMinutes} minutes on this task. Write at least {task.minWords}{" "}
            words.
          </div>

          <div className="prose-exam max-w-[62ch] font-bold">{task.prompt}</div>

          {task.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={task.image.src}
              alt={task.image.alt}
              className="mt-6 w-full rounded-md border border-border"
            />
          )}
        </div>
      }
      right={
        <div className="flex h-full flex-col px-6 py-6 lg:px-8">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
            aria-label={`Your answer for Task ${task.index}`}
            placeholder="Type your answer here."
            className="min-h-[22rem] flex-1 resize-none rounded-sm border border-border-strong bg-bg-raised p-4 font-sans text-[0.98rem] leading-relaxed outline-none placeholder:text-text-subtle focus-visible:border-primary"
          />
          <div className="mt-2 flex items-baseline justify-between gap-4 text-sm">
            <span className="tabular font-bold">Words: {words}</span>
            {mode === "coach" && short && (
              <span className="text-amber-700">
                Under {task.minWords} words is penalised — {task.minWords - words} to go.
              </span>
            )}
          </div>
        </div>
      }
    />
  );
}
