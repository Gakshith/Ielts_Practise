import type { Attempt, AttemptScope, Mode, TestKind } from "@/types";

function id(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `a_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/** A fresh attempt. Everything else in the app reads state from here. */
export function newAttempt({
  paperId,
  scope,
  mode,
  kind,
}: {
  paperId: string;
  scope: AttemptScope;
  mode: Mode;
  kind: TestKind;
}): Attempt {
  return {
    id: id(),
    paperId,
    scope,
    mode,
    kind,
    status: "in-progress",
    startedAt: Date.now(),
    currentModule: scope === "full" ? "listening" : scope,
    listeningPartsPlayed: [],
    responses: {},
    timeSpent: {},
    focusLosses: 0,
    notes: {},
    highlights: [],
  };
}
