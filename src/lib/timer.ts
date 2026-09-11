/* ===========================================================================
   Countdown model. Pure data in, pure data out — no hook, no interval, no
   Date.now(). The caller owns the clock and passes `now` in, which is what
   makes the whole thing testable and replayable from a saved attempt.

   All timestamps are epoch milliseconds (matching `Attempt.startedAt`).
   All durations are seconds (matching `SpeakingPart.durationSec` et al).
   =========================================================================== */

/** One pause window. `resumedAt` absent means the timer is still paused. */
export interface PauseWindow {
  readonly pausedAt: number;
  readonly resumedAt?: number;
}

export interface TimerState {
  /** epoch ms when the module started */
  readonly startedAt: number;
  /** total allowance in seconds, e.g. 3600 for Academic Reading */
  readonly durationSec: number;
  /** every pause window, in any order; overlapping windows are merged */
  readonly pauses: readonly PauseWindow[];
}

/**
 * Seconds at which the UI should warn. These are the real test's warnings for
 * Reading and Writing (10 minutes and 5 minutes remaining) — a spec rule, not
 * our choice. Ordered widest-first.
 */
export const WARNING_THRESHOLDS_SEC = [600, 300] as const;
export type WarningThreshold = (typeof WARNING_THRESHOLDS_SEC)[number];

const MS = 1000;

/** Merge overlapping pause windows so double-logged pauses cannot double-count. */
function mergedPauses(
  pauses: readonly PauseWindow[],
  now: number,
): readonly { start: number; end: number }[] {
  const spans = pauses
    .filter((p) => Number.isFinite(p.pausedAt))
    .map((p) => ({
      start: p.pausedAt,
      // an open pause runs up to `now`
      end: typeof p.resumedAt === "number" && Number.isFinite(p.resumedAt) ? p.resumedAt : now,
    }))
    .filter((s) => s.end > s.start)
    .sort((a, b) => a.start - b.start);

  const merged: { start: number; end: number }[] = [];
  for (const span of spans) {
    const last = merged[merged.length - 1];
    if (last && span.start <= last.end) {
      last.end = Math.max(last.end, span.end);
    } else {
      merged.push({ start: span.start, end: span.end });
    }
  }
  return merged;
}

/** Total paused milliseconds between `startedAt` and `now`, clamped to that window. */
export function pausedMs(state: TimerState, now: number): number {
  const windowEnd = Math.max(state.startedAt, now);
  let total = 0;
  for (const span of mergedPauses(state.pauses, now)) {
    const start = Math.max(span.start, state.startedAt);
    const end = Math.min(span.end, windowEnd);
    if (end > start) total += end - start;
  }
  return total;
}

/** Seconds of *running* time consumed so far, pauses excluded. Never negative. */
export function elapsedSec(state: TimerState, now: number): number {
  const wall = Math.max(0, now - state.startedAt);
  return Math.max(0, (wall - pausedMs(state, now)) / MS);
}

/** Seconds left on the clock, clamped to [0, durationSec]. */
export function remainingSec(state: TimerState, now: number): number {
  const left = state.durationSec - elapsedSec(state, now);
  return Math.max(0, Math.min(state.durationSec, left));
}

/** True when the timer has an open pause window at `now`. */
export function isPaused(state: TimerState, now: number): boolean {
  return state.pauses.some(
    (p) => p.pausedAt <= now && (p.resumedAt === undefined || p.resumedAt > now),
  );
}

export function isExpired(state: TimerState, now: number): boolean {
  return remainingSec(state, now) <= 0;
}

/**
 * The tightest warning threshold already crossed, or null. 450s remaining
 * returns 600 (the 10-minute warning has fired, the 5-minute one has not);
 * 200s remaining returns 300.
 */
export function activeWarning(remaining: number): WarningThreshold | null {
  if (remaining <= 0) return null;
  let hit: WarningThreshold | null = null;
  for (const threshold of WARNING_THRESHOLDS_SEC) {
    if (remaining <= threshold) hit = threshold;
  }
  return hit;
}

export interface TimerSnapshot {
  readonly elapsedSec: number;
  readonly remainingSec: number;
  /** whole seconds for display, so the clock never shows 9:59.4 as 9:59 twice */
  readonly remainingWholeSec: number;
  readonly durationSec: number;
  /** 0..1, useful for a progress ring */
  readonly fractionElapsed: number;
  readonly paused: boolean;
  readonly expired: boolean;
  readonly warning: WarningThreshold | null;
}

/** Everything the UI needs for one tick, computed once. */
export function timerSnapshot(state: TimerState, now: number): TimerSnapshot {
  const elapsed = elapsedSec(state, now);
  const remaining = remainingSec(state, now);
  return {
    elapsedSec: elapsed,
    remainingSec: remaining,
    remainingWholeSec: Math.ceil(remaining),
    durationSec: state.durationSec,
    fractionElapsed:
      state.durationSec > 0 ? Math.max(0, Math.min(1, elapsed / state.durationSec)) : 1,
    paused: isPaused(state, now),
    expired: remaining <= 0,
    warning: activeWarning(remaining),
  };
}

/** mm:ss, or h:mm:ss past an hour. Pure formatting, no locale dependency. */
export function formatClock(seconds: number): string {
  const total = Number.isFinite(seconds) ? Math.max(0, Math.ceil(seconds)) : 0;
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number): string => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

/** Append a pause at `now`, ignoring the call if a pause is already open. */
export function pause(state: TimerState, now: number): TimerState {
  if (isPaused(state, now)) return state;
  return { ...state, pauses: [...state.pauses, { pausedAt: now }] };
}

/** Close the open pause window at `now`. No-op when nothing is paused. */
export function resume(state: TimerState, now: number): TimerState {
  if (!isPaused(state, now)) return state;
  return {
    ...state,
    pauses: state.pauses.map((p) =>
      p.resumedAt === undefined && p.pausedAt <= now ? { ...p, resumedAt: now } : p,
    ),
  };
}
