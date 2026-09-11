"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Attempt } from "@/types";
import { getAttempt } from "@/lib/storage";
import { getPaper } from "@/data/papers";
import { Player } from "@/components/exam/Player";

/* Attempts live in the browser, so the player can only resolve one after mount.
   A server render would have nothing to render. */
export function TestRoute({ attemptId }: { attemptId: string }) {
  const [state, setState] = useState<"loading" | "missing" | "ready">("loading");
  const [attempt, setAttempt] = useState<Attempt | null>(null);

  useEffect(() => {
    const found = getAttempt(attemptId);
    if (!found || !getPaper(found.paperId)) return setState("missing");
    setAttempt(found);
    setState("ready");
  }, [attemptId]);

  if (state === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-bg text-text-muted">
        Loading your test…
      </div>
    );
  }

  if (state === "missing" || !attempt) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-bg px-6 text-center">
        <h1 className="font-serif text-2xl font-bold">That test is not on this device.</h1>
        <p className="max-w-md text-text-muted">
          Attempts are stored in this browser. If you started it somewhere else, or cleared
          your site data, it is gone.
        </p>
        <Link href="/tests" className="font-bold text-primary underline">
          Back to the test library
        </Link>
      </div>
    );
  }

  const paper = getPaper(attempt.paperId)!;
  return <Player paper={paper} attempt={attempt} />;
}
