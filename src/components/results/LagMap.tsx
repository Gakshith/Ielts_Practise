import type { ListeningLagPoint } from "@/lib/analysis";

/* Consumes the engine's ListeningLagPoint directly. The engine omits items it
   cannot place - no cue, or never typed - rather than guessing a position, so
   every point drawn here is real. */
export type LagPoint = ListeningLagPoint;

/* The Listening lag map. The recording runs once, so the question that decides the
   score is not "did you know the word" but "where did you lose the thread, and how
   long did it take to get back".

   The two rows are separated by SHAPE and by row label, never by colour alone —
   red/green sit only ΔE 7.7 apart for deuteranopia. */
export function LagMap({ points, durationSec }: { points: LagPoint[]; durationSec: number }) {
  if (points.length === 0 || durationSec <= 0) return null;

  const W = 640;
  const padL = 78;
  const padR = 16;
  const plotW = W - padL - padR;
  const yAudio = 42;
  const yYou = 104;
  const H = 150;

  const x = (t: number) => padL + Math.max(0, Math.min(1, t / durationSec)) * plotW;
  const worst = points.length ? Math.max(...points.map((p) => p.lagSec)) : 0;

  return (
    <figure className="m-0">
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full min-w-[34rem]" role="img"
          aria-label="When each answer was spoken in the audio, against when you typed it">
          <text x={0} y={yAudio + 4} fontSize={12} fontWeight={700} fill="var(--text-muted)">
            Said at
          </text>
          <text x={0} y={yYou + 4} fontSize={12} fontWeight={700} fill="var(--text-muted)">
            You typed
          </text>

          <line x1={padL} x2={W - padR} y1={yAudio} y2={yAudio} stroke="var(--border-strong)" strokeWidth={2} />
          <line x1={padL} x2={W - padR} y1={yYou} y2={yYou} stroke="var(--border)" strokeWidth={2} />

          {points.map((p) => {
            const ax = x(p.spokenAtSec);
            const yx = x(p.answeredAtSec);
            return (
              <g key={p.n}>
                {(
                  <line
                    x1={ax}
                    y1={yAudio + 7}
                    x2={yx}
                    y2={yYou - 7}
                    stroke="var(--border-strong)"
                    strokeWidth={1}
                    strokeDasharray="3 3"
                  />
                )}

                {/* audio: a tick on the rule */}
                <line x1={ax} y1={yAudio - 7} x2={ax} y2={yAudio + 7} stroke="var(--primary)" strokeWidth={2.5} />
                <text x={ax} y={yAudio - 13} textAnchor="middle" fontSize={10} fill="var(--text-subtle)">
                  {p.n}
                </text>

                {/* candidate: filled dot when right, hollow ring with a bar when wrong */}
                {p.correct ? (
                  <circle cx={yx} cy={yYou} r={5} fill="var(--primary)" stroke="var(--bg-raised)" strokeWidth={2}>
                    <title>{`Q${p.n} correct — typed ${Math.round(p.lagSec)}s after it was said`}</title>
                  </circle>
                ) : (
                  <g>
                    <circle cx={yx} cy={yYou} r={5} fill="var(--bg-raised)" stroke="var(--text)" strokeWidth={2} />
                    <line x1={yx - 3} y1={yYou} x2={yx + 3} y2={yYou} stroke="var(--text)" strokeWidth={2} />
                    <title>{`Q${p.n} wrong — typed ${Math.round(p.lagSec)}s after it was said`}</title>
                  </g>
                )}
              </g>
            );
          })}

          <text x={padL} y={H - 6} fontSize={11} fill="var(--text-subtle)">0:00</text>
          <text x={W - padR} y={H - 6} textAnchor="end" fontSize={11} fill="var(--text-subtle)">
            {Math.floor(durationSec / 60)}:{String(Math.round(durationSec % 60)).padStart(2, "0")}
          </text>
        </svg>
      </div>

      <figcaption className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-text-muted">
        <span className="flex items-center gap-2">
          <svg width="12" height="14" aria-hidden="true"><line x1="6" y1="0" x2="6" y2="14" stroke="var(--primary)" strokeWidth="2.5" /></svg>
          answer spoken
        </span>
        <span className="flex items-center gap-2">
          <svg width="12" height="12" aria-hidden="true"><circle cx="6" cy="6" r="5" fill="var(--primary)" /></svg>
          you answered, correct
        </span>
        <span className="flex items-center gap-2">
          <svg width="12" height="12" aria-hidden="true">
            <circle cx="6" cy="6" r="5" fill="none" stroke="var(--text)" strokeWidth="2" />
            <line x1="3" y1="6" x2="9" y2="6" stroke="var(--text)" strokeWidth="2" />
          </svg>
          you answered, wrong
        </span>
        {worst > 0 && (
          <span className="tabular">
            longest gap <strong>{Math.round(worst)}s</strong>
          </span>
        )}
      </figcaption>
    </figure>
  );
}
