"use client";

import { useRouter } from "next/navigation";
import type { AttemptScope, Mode, TestPaper } from "@/types";
import { newAttempt } from "@/lib/attempt";
import { saveAttempt } from "@/lib/storage";
import { Button } from "@/components/ui/Button";

/* Two buttons, never more. Exam is promoted because it is the one that produces a
   score worth anything; Coach sits beside it as the deliberate alternative. */
export function StartButtons({
  paper,
  scope,
  size = "md",
  examLabel = "Start in exam mode",
  coachLabel = "Coach mode",
}: {
  paper: TestPaper;
  scope: AttemptScope;
  size?: "sm" | "md" | "lg";
  examLabel?: string;
  coachLabel?: string;
}) {
  const router = useRouter();

  function start(mode: Mode) {
    const attempt = newAttempt({ paperId: paper.id, scope, mode, kind: paper.kind });
    saveAttempt(attempt);
    router.push(`/test/${attempt.id}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="accent" size={size} onClick={() => start("exam")}>
        {examLabel}
      </Button>
      <Button variant="outline" size={size} onClick={() => start("coach")}>
        {coachLabel}
      </Button>
    </div>
  );
}
