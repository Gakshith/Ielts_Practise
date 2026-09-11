import type {
  Attempt,
  AttemptResult,
  ModuleId,
  ModuleResult,
  TestPaper,
  TranscriptCue,
} from "@/types";
import { scoreObjectiveModule } from "./scoring";
import { buildReport, listeningLag, type ListeningLagPoint } from "./analysis";
import { overallBand } from "./scoring";
import { getProfile } from "./storage";

/** Bands the candidate (or their teacher) entered by hand for Writing and Speaking. */
export type SelfBands = Partial<Record<"writing" | "speaking", number>>;

export const SELF_BAND_KEY = "ielts-practise:self-bands";

export function readSelfBands(attemptId: string): SelfBands {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(`${SELF_BAND_KEY}:${attemptId}`);
    return raw ? (JSON.parse(raw) as SelfBands) : {};
  } catch {
    return {};
  }
}

export function writeSelfBands(attemptId: string, bands: SelfBands): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(`${SELF_BAND_KEY}:${attemptId}`, JSON.stringify(bands));
  } catch {
    /* storage full or blocked — the band simply does not persist */
  }
}

/**
 * Turn a finished attempt into a result.
 *
 * Listening and Reading are marked and converted through the indicative band table.
 * Writing and Speaking are NOT scored here and never invented: until an examiner or
 * an AI marks them, they are absent. A band the candidate typed in themselves may
 * stand in — it is carried with `estimated: true` so the UI can say where it came from.
 */
export function computeResult(
  attempt: Attempt,
  paper: TestPaper,
  self: SelfBands = {},
): AttemptResult {
  const wanted: ModuleId[] =
    attempt.scope === "full" ? ["listening", "reading", "writing", "speaking"] : [attempt.scope];

  const modules: ModuleResult[] = [];

  if (wanted.includes("listening")) {
    modules.push(
      scoreObjectiveModule({
        module: "listening",
        kind: attempt.kind,
        groups: paper.listening.parts.flatMap((p) => p.groups),
        responses: attempt.responses,
      }),
    );
  }

  if (wanted.includes("reading")) {
    modules.push(
      scoreObjectiveModule({
        module: "reading",
        kind: attempt.kind,
        groups: paper.reading.passages.flatMap((p) => p.groups),
        responses: attempt.responses,
      }),
    );
  }

  for (const m of ["writing", "speaking"] as const) {
    if (!wanted.includes(m)) continue;
    const band = self[m];
    if (band === undefined) continue;
    modules.push({
      module: m,
      band,
      estimated: true,
      items: [],
      byCause: {},
    });
  }

  const overall =
    attempt.scope === "full"
      ? overallBand(modules.map((x) => ({ module: x.module, band: x.band })))
      : undefined;

  return {
    attemptId: attempt.id,
    paperId: attempt.paperId,
    scope: attempt.scope,
    mode: attempt.mode,
    finishedAt: attempt.finishedAt ?? Date.now(),
    modules,
    overallBand: overall,
    report: buildReport(modules, getProfile() ?? undefined),
  };
}

/** Transcript cues for the whole Listening module, offset to module-start seconds. */
export function listeningCues(paper: TestPaper): { cues: TranscriptCue[]; durationSec: number } {
  const cues: TranscriptCue[] = [];
  let offset = 0;
  for (const part of paper.listening.parts) {
    for (const cue of part.transcript ?? []) cues.push({ ...cue, t: cue.t + offset });
    offset += part.durationSec ?? 0;
  }
  return { cues, durationSec: offset };
}

export function lagPoints(
  result: AttemptResult,
  paper: TestPaper,
): { points: ListeningLagPoint[]; durationSec: number } {
  const listening = result.modules.find((m) => m.module === "listening");
  const { cues, durationSec } = listeningCues(paper);
  if (!listening) return { points: [], durationSec };
  return { points: listeningLag(listening.items, cues), durationSec };
}
