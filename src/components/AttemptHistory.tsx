"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Attempt, AttemptScope } from "@/types";
import { listAttempts } from "@/lib/storage";
import { computeResult, readSelfBands } from "@/lib/results";
import { getPaper } from "@/data/papers";
import { Badge } from "@/components/ui/Badge";

function when(ts: number) {
  return new Date(ts).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* Previous attempts for one paper. The user asked to see them on retake, and the
   useful framing is "here is what you scored before", not a bare list of dates. */
export function AttemptHistory({ paperId, scope }: { paperId: string; scope: AttemptScope }) {
  const [rows, setRows] = useState<Attempt[] | null>(null);

  useEffect(() => {
    setRows(
      listAttempts()
        .filter((a) => a.paperId === paperId && a.scope === scope)
        .sort((a, b) => (b.finishedAt ?? b.startedAt) - (a.finishedAt ?? a.startedAt)),
    );
  }, [paperId, scope]);

  // Render nothing until mounted, so the server and client markup agree.
  if (rows === null || rows.length === 0) return null;

  const paper = getPaper(paperId);

  return (
    <div className="mt-6 border-t border-border pt-5">
      <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-text-subtle">
        Your attempts
      </h3>
      <ul className="flex flex-col gap-2">
        {rows.slice(0, 5).map((a) => {
          const done = a.status === "submitted";
          const result = done && paper ? computeResult(a, paper, readSelfBands(a.id)) : null;
          const objective = result?.modules.filter((m) => !m.estimated) ?? [];

          return (
            <li
              key={a.id}
              className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-md border border-border bg-bg px-4 py-3 text-sm"
            >
              <span className="font-bold">{when(a.finishedAt ?? a.startedAt)}</span>
              <Badge tone={a.mode === "exam" ? "info" : "neutral"}>
                {a.mode === "exam" ? "Exam" : "Coach"}
              </Badge>

              {done ? (
                <span className="tabular text-text-muted">
                  {objective.length > 0
                    ? objective
                        .map((m) => `${m.module[0].toUpperCase() + m.module.slice(1)} ${m.band.toFixed(1)}`)
                        .join(" · ")
                    : "No marked modules"}
                </span>
              ) : (
                <Badge tone="accent">Unfinished</Badge>
              )}

              <span className="ml-auto flex gap-3">
                {done && (
                  <>
                    <Link href={`/results/${a.id}`} className="font-bold text-primary underline">
                      Results
                    </Link>
                    <Link href={`/review/${a.id}`} className="font-bold text-primary underline">
                      Review
                    </Link>
                  </>
                )}
                {!done && (
                  <Link href={`/test/${a.id}`} className="font-bold text-primary underline">
                    Resume
                  </Link>
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
