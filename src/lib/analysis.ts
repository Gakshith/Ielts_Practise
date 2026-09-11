/* ===========================================================================
   Turning marked results into something a candidate can act on.

   Rule for everything in this file: state only what is computable from the
   attempt. No cohort averages, no "most students", no benchmarks we do not
   have. If there is nothing notable, say that plainly instead of padding.
   =========================================================================== */

import type {
  ItemResult,
  MistakeCause,
  ModuleId,
  ModuleResult,
  Profile,
  Report,
  ReportPriority,
  SpeakingMetrics,
  SpeakingTurn,
  TranscriptCue,
} from "@/types";
import { computeLeverage } from "./leverage";
import { countWords, overallBand, wordsOf } from "./scoring";

/* ------------------------------------------------------------ cause labels */

/** Short UI labels, one per cause. */
export const MISTAKE_CAUSE_LABELS: Readonly<Record<MistakeCause, string>> = {
  "notgiven-vs-false": "NOT GIVEN vs FALSE",
  "paraphrase-missed": "Paraphrase missed",
  "keyword-trap": "Keyword trap",
  "outside-knowledge": "Outside knowledge",
  distractor: "Distractor",
  "lost-thread": "Lost the thread",
  spelling: "Spelling",
  "number-agreement": "Singular / plural",
  format: "Answer format",
  "word-limit": "Word limit",
  "out-of-time": "Ran out of time",
  blank: "Left blank",
};

/** The same causes as a sentence fragment, for report prose. */
const CAUSE_PHRASES: Readonly<Record<MistakeCause, string>> = {
  "notgiven-vs-false": "confusing NOT GIVEN with FALSE",
  "paraphrase-missed": "missing the paraphrase",
  "keyword-trap": "keyword traps",
  "outside-knowledge": "answering from outside knowledge",
  distractor: "distractors in the audio",
  "lost-thread": "losing the thread in the audio",
  spelling: "spelling",
  "number-agreement": "singular / plural agreement",
  format: "writing the answer in the wrong format",
  "word-limit": "going over the word limit",
  "out-of-time": "running out of time",
  blank: "leaving answers blank",
};

const MODULE_LABELS: Readonly<Record<ModuleId, string>> = {
  listening: "Listening",
  reading: "Reading",
  writing: "Writing",
  speaking: "Speaking",
};

/* ---------------------------------------------------------- cause summary */

export interface CauseCount {
  readonly cause: MistakeCause;
  readonly count: number;
}

/**
 * Counts per mistake cause, ranked by frequency (ties keep a stable
 * alphabetical order so the UI does not shuffle between renders).
 * Correct items and wrong items with no attributed cause are not counted.
 */
export function summariseCauses(items: readonly ItemResult[]): CauseCount[] {
  const counts = new Map<MistakeCause, number>();
  for (const item of items) {
    if (item.correct || item.cause === undefined) continue;
    counts.set(item.cause, (counts.get(item.cause) ?? 0) + 1);
  }
  return Array.from(counts, ([cause, count]) => ({ cause, count })).sort(
    (a, b) => b.count - a.count || a.cause.localeCompare(b.cause),
  );
}

/** Wrong answers that carry no cause — honest about what we could not explain. */
export function unexplainedCount(items: readonly ItemResult[]): number {
  return items.filter((i) => !i.correct && i.cause === undefined).length;
}

/* ----------------------------------------------------------------- report */

function plural(n: number, one: string, many: string): string {
  return n === 1 ? one : many;
}

function marksWord(n: number): string {
  return plural(n, "mark", "marks");
}

function buildPriorities(modules: readonly ModuleResult[]): ReportPriority[] {
  const priorities: ReportPriority[] = [];

  for (const result of modules) {
    const wrong = result.items.filter((i) => !i.correct).length;
    for (const { cause, count } of summariseCauses(result.items)) {
      const label = MISTAKE_CAUSE_LABELS[cause];
      const detail =
        cause === "word-limit"
          ? `${count} ${plural(count, "answer was", "answers were")} right in substance but over the stated word limit. In the real test that scores zero, so this threw away ${count} ${marksWord(count)}.`
          : `${count} of your ${wrong} wrong ${plural(wrong, "answer", "answers")} in ${MODULE_LABELS[result.module].toLowerCase()} came from ${CAUSE_PHRASES[cause]}.`;
      priorities.push({
        title: `${label} — ${MODULE_LABELS[result.module]}`,
        detail,
        module: result.module,
        cause,
        marksLost: count,
      });
    }

    const unexplained = unexplainedCount(result.items);
    if (unexplained > 0) {
      priorities.push({
        title: `No clear pattern — ${MODULE_LABELS[result.module]}`,
        detail: `${unexplained} wrong ${plural(unexplained, "answer", "answers")} in ${MODULE_LABELS[result.module].toLowerCase()} ${plural(unexplained, "does", "do")} not fit a pattern we can detect. Review ${plural(unexplained, "it", "them")} against the evidence.`,
        module: result.module,
        marksLost: unexplained,
      });
    }
  }

  return priorities.sort((a, b) => (b.marksLost ?? 0) - (a.marksLost ?? 0));
}

function buildStrengths(modules: readonly ModuleResult[]): string[] {
  const strengths: string[] = [];
  const scored = modules.filter((m) => Number.isFinite(m.band));
  const ranked = [...scored].sort((a, b) => b.band - a.band);
  const best = ranked[0];

  if (best && best.band >= 6 && ranked.length > 1 && best.band > ranked[ranked.length - 1].band) {
    strengths.push(
      `${MODULE_LABELS[best.module]} is your strongest module at band ${best.band.toFixed(1)}.`,
    );
  }

  for (const result of modules) {
    if (typeof result.raw !== "number" || typeof result.total !== "number" || result.total === 0) {
      continue;
    }
    const accuracy = result.raw / result.total;
    if (accuracy >= 0.8) {
      strengths.push(
        `You answered ${result.raw} of ${result.total} correctly in ${MODULE_LABELS[result.module].toLowerCase()}.`,
      );
    }
    const blanks = result.items.filter((i) => i.cause === "blank").length;
    if (blanks === 0 && result.items.length > 0) {
      strengths.push(
        `You attempted every question in ${MODULE_LABELS[result.module].toLowerCase()}.`,
      );
    }
  }

  return strengths.slice(0, 3);
}

/** "half a band", "a full band", "2.5 bands" — never "0.5 bands". */
function gapPhrase(gap: number): string {
  if (gap === 0.5) return "half a band";
  if (gap === 1) return "a full band";
  return `${gap} bands`;
}

function buildHeadline(
  modules: readonly ModuleResult[],
  priorities: readonly ReportPriority[],
  overall: number | undefined,
  profile?: Profile,
): string {
  if (modules.length === 0) return "Nothing was scored in this attempt.";

  const top = priorities[0];
  if (top && (top.marksLost ?? 0) >= 2 && top.cause !== undefined) {
    const n = top.marksLost ?? 0;
    return `You lost ${n} ${marksWord(n)} to ${CAUSE_PHRASES[top.cause]}.`;
  }

  if (overall !== undefined && profile && Number.isFinite(profile.target)) {
    const gap = Math.round((profile.target - overall) * 2) / 2;
    if (gap > 0) {
      return `You are ${gapPhrase(gap)} below your target of ${profile.target.toFixed(1)}.`;
    }
    return `You hit your target: overall band ${overall.toFixed(1)} against a target of ${profile.target.toFixed(1)}.`;
  }

  if (overall !== undefined) return `Your overall band is ${overall.toFixed(1)}.`;

  const perfect = modules.every(
    (m) => typeof m.raw === "number" && typeof m.total === "number" && m.raw === m.total,
  );
  if (perfect) return "You answered everything correctly in this attempt.";

  const single = modules[0];
  if (modules.length === 1) {
    return `You scored band ${single.band.toFixed(1)} in ${MODULE_LABELS[single.module]}.`;
  }
  return "Nothing in this attempt stands out beyond the scores themselves.";
}

/**
 * The results report. The headline is a CLAIM about what happened, never a
 * label like "Your Results". Priorities are ranked by marks lost. Leverage is
 * attached only when all four modules are present, because an overall band
 * needs all four.
 */
export function buildReport(modules: readonly ModuleResult[], profile?: Profile): Report {
  const priorities = buildPriorities(modules);
  const overall = overallBand(modules.map((m) => ({ module: m.module, band: m.band })));
  const leverage = computeLeverage(modules.map((m) => ({ module: m.module, band: m.band })));
  return {
    headline: buildHeadline(modules, priorities, overall, profile),
    strengths: buildStrengths(modules),
    priorities,
    leverage: leverage.length > 0 ? leverage : undefined,
  };
}

/* -------------------------------------------------------- speaking metrics */

/**
 * A silence of this many seconds or more between two of the candidate's own
 * turns counts as a pause. This is OUR threshold, not an IELTS rule — the test
 * has no published pause metric.
 */
export const PAUSE_THRESHOLD_SEC = 2;

/** Single-word fillers, matched as whole words, case-insensitive. */
const FILLER_WORDS: readonly string[] = ["um", "uh", "er", "like", "actually", "basically"];
/** Multi-word fillers, matched as consecutive whole words. */
const FILLER_PHRASES: readonly (readonly string[])[] = [
  ["you", "know"],
  ["i", "mean"],
];

function countFillers(tokens: readonly string[]): number {
  let count = 0;
  for (let i = 0; i < tokens.length; i += 1) {
    const phrase = FILLER_PHRASES.find((p) => p.every((word, k) => tokens[i + k] === word));
    if (phrase) {
      count += 1;
      i += phrase.length - 1;
      continue;
    }
    if (FILLER_WORDS.includes(tokens[i])) count += 1;
  }
  return count;
}

const round1 = (n: number): number => Math.round(n * 10) / 10;

/**
 * Measured speaking metrics — measured, never guessed, so an AI report has
 * something factual to stand on. Only the candidate's turns are counted; the
 * examiner's words are not the candidate's fluency.
 *
 * A turn with no `endedAt` borrows the next turn's start as its end; if there
 * is no next turn it contributes words but no seconds, which is the honest
 * reading of an unterminated recording.
 */
export function speakingMetrics(turns: readonly SpeakingTurn[]): SpeakingMetrics {
  const ordered = [...turns].sort((a, b) => a.startedAt - b.startedAt);
  const endOf = (index: number): number | undefined => {
    const turn = ordered[index];
    if (typeof turn.endedAt === "number" && Number.isFinite(turn.endedAt)) return turn.endedAt;
    const next = ordered[index + 1];
    return next ? next.startedAt : undefined;
  };

  const tokens: string[] = [];
  let speakingMs = 0;
  let pauseCount = 0;
  let longestPauseMs = 0;
  let previousCandidateEnd: number | null = null;

  ordered.forEach((turn, index) => {
    if (turn.role !== "candidate") {
      // an examiner turn breaks the candidate's silence: it is not a pause
      previousCandidateEnd = null;
      return;
    }
    tokens.push(...wordsOf(turn.text));

    const end = endOf(index);
    if (end !== undefined && end > turn.startedAt) speakingMs += end - turn.startedAt;

    if (previousCandidateEnd !== null) {
      const gap = turn.startedAt - previousCandidateEnd;
      if (gap > longestPauseMs) longestPauseMs = gap;
      if (gap >= PAUSE_THRESHOLD_SEC * 1000) pauseCount += 1;
    }
    previousCandidateEnd = end ?? turn.startedAt;
  });

  const speakingSec = speakingMs / 1000;
  return {
    wordsPerMinute: speakingSec > 0 ? round1(tokens.length / (speakingSec / 60)) : 0,
    totalWords: tokens.length,
    distinctWords: new Set(tokens).size,
    fillerCount: countFillers(tokens),
    longestPauseSec: round1(Math.max(0, longestPauseMs) / 1000),
    pauseCount,
    speakingSec: round1(speakingSec),
  };
}

/** Word count for the writing box, re-exported so the UI has one import site. */
export { countWords };

/* ----------------------------------------------------------- listening lag */

export interface ListeningLagPoint {
  readonly n: number;
  /** seconds into the audio where the answer is spoken */
  readonly spokenAtSec: number;
  /** seconds from module start when the candidate first typed an answer */
  readonly answeredAtSec: number;
  /** answeredAt - spokenAt; negative means they answered before it was said */
  readonly lagSec: number;
  readonly correct: boolean;
}

/**
 * The lag map: for each answered item, when the answer was spoken against when
 * the candidate first typed it. A large positive lag is the candidate still
 * writing question 12 while the tape is on question 14 — the classic way a
 * listening section collapses.
 *
 * `cues` must already be offset to module-start seconds when a module spans
 * several parts; this function does not know part boundaries. Items with no
 * cue or no typing timestamp are omitted rather than guessed at.
 */
export function listeningLag(
  items: readonly ItemResult[],
  cues: readonly TranscriptCue[],
): ListeningLagPoint[] {
  const spokenAt = new Map<number, number>();
  for (const cue of cues) {
    for (const n of cue.answers ?? []) {
      const existing = spokenAt.get(n);
      if (existing === undefined || cue.t < existing) spokenAt.set(n, cue.t);
    }
  }

  const points: ListeningLagPoint[] = [];
  for (const item of items) {
    const spoken = spokenAt.get(item.n);
    if (spoken === undefined) continue;
    if (typeof item.answeredAt !== "number" || !Number.isFinite(item.answeredAt)) continue;
    const answeredAtSec = item.answeredAt / 1000;
    points.push({
      n: item.n,
      spokenAtSec: round1(spoken),
      answeredAtSec: round1(answeredAtSec),
      lagSec: round1(answeredAtSec - spoken),
      correct: item.correct,
    });
  }
  return points.sort((a, b) => a.n - b.n);
}
