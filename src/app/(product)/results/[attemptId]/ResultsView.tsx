"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Attempt, AttemptResult, Profile, TestPaper } from "@/types";
import { getAttempt, getProfile } from "@/lib/storage";
import { getPaper } from "@/data/papers";
import { computeResult, lagPoints, readSelfBands, writeSelfBands, type SelfBands } from "@/lib/results";
import { descriptorFor } from "@/lib/bands";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { BandBars } from "@/components/results/BandBars";
import { CauseBreakdown } from "@/components/results/CauseBreakdown";
import { LagMap } from "@/components/results/LagMap";
import { MODULE_LABEL } from "@/config/exam";

const BAND_OPTIONS = [4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9];

export function ResultsView({ attemptId }: { attemptId: string }) {
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [paper, setPaper] = useState<TestPaper | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [self, setSelf] = useState<SelfBands>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const a = getAttempt(attemptId);
    setAttempt(a);
    setPaper(a ? getPaper(a.paperId) ?? null : null);
    setProfile(getProfile());
    setSelf(readSelfBands(attemptId));
    setReady(true);
  }, [attemptId]);

  const result: AttemptResult | null = useMemo(
    () => (attempt && paper ? computeResult(attempt, paper, self) : null),
    [attempt, paper, self],
  );

  if (!ready) return <Shell><p className="text-text-muted">Working out your score…</p></Shell>;

  if (!attempt || !paper || !result) {
    return (
      <Shell>
        <h1 className="font-serif text-3xl font-bold">That result is not on this device.</h1>
        <p className="mt-3 text-text-muted">
          Attempts are stored in this browser only.{" "}
          <Link href="/tests" className="font-bold text-primary underline">
            Back to the tests
          </Link>
          .
        </p>
      </Shell>
    );
  }

  const marked = result.modules.filter((m) => !m.estimated);
  const needsSelf =
    attempt.scope === "full" &&
    (["writing", "speaking"] as const).filter((m) => self[m] === undefined);
  const lag = lagPoints(result, paper);
  const listening = result.modules.find((m) => m.module === "listening");

  function setBand(module: "writing" | "speaking", band: number | undefined) {
    const next = { ...self, [module]: band };
    if (band === undefined) delete next[module];
    setSelf(next);
    writeSelfBands(attemptId, next);
  }

  return (
    <Shell>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <Badge tone={attempt.mode === "exam" ? "info" : "neutral"}>
          {attempt.mode === "exam" ? "Exam mode" : "Coach mode"}
        </Badge>
        <Badge tone="neutral">
          {attempt.scope === "full" ? "Full mock test" : MODULE_LABEL[attempt.scope]}
        </Badge>
        <span className="text-sm text-text-muted">
          {new Date(result.finishedAt).toLocaleString()}
        </span>
      </div>

      {/* The heading is the conclusion, not a label. */}
      <h1 className="max-w-3xl font-serif text-[2.1rem] font-bold leading-tight sm:text-4xl">
        {result.report?.headline ?? "Your result"}
      </h1>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        {/* ------------------------------------------------------- overall band */}
        <Card className="p-8">
          {result.overallBand !== undefined ? (
            <>
              <p className="text-sm font-bold uppercase tracking-wide text-text-subtle">
                Overall band
              </p>
              <p className="tabular mt-2 font-serif text-7xl font-bold leading-none">
                {result.overallBand.toFixed(1)}
              </p>
              <p className="mt-3 font-bold">{descriptorFor(result.overallBand).label}</p>
              <p className="mt-1 leading-relaxed text-text-muted">
                {descriptorFor(result.overallBand).summary}
              </p>
              {profile?.target !== undefined && (
                <p className="mt-5 border-t border-border pt-4 text-sm">
                  {result.overallBand >= profile.target ? (
                    <span className="font-bold text-success">
                      At or above your target of {profile.target.toFixed(1)}.
                    </span>
                  ) : (
                    <>
                      <span className="tabular font-bold">
                        {(profile.target - result.overallBand).toFixed(1)}
                      </span>{" "}
                      below your target of {profile.target.toFixed(1)}.
                    </>
                  )}
                </p>
              )}
            </>
          ) : (
            <>
              <p className="text-sm font-bold uppercase tracking-wide text-text-subtle">
                Overall band
              </p>
              <p className="mt-2 font-serif text-5xl font-bold leading-none text-text-subtle">—</p>
              <p className="mt-4 leading-relaxed text-text-muted">
                {attempt.scope === "full"
                  ? "An overall band is the mean of all four modules. Writing and Speaking have not been marked, so there is nothing honest to average yet."
                  : "A single section does not produce an overall band. Take a full mock for that."}
              </p>
            </>
          )}
        </Card>

        {/* ---------------------------------------------------------- the bands */}
        <Card className="p-8">
          <h2 className="mb-6 font-bold">Band by module</h2>
          <BandBars
            rows={result.modules.map((m) => ({
              module: m.module,
              band: m.band,
              estimated: m.estimated,
            }))}
            target={profile?.target}
          />

          {marked.length > 0 && (
            <p className="mt-6 border-t border-border pt-4 text-sm leading-relaxed text-text-muted">
              Raw scores convert through an <strong>indicative</strong> table. IELTS does not
              publish an official one, and real tests are equated version by version.
            </p>
          )}
        </Card>
      </div>

      {/* -------------------------------------------- writing / speaking entry */}
      {attempt.scope === "full" && needsSelf !== false && needsSelf.length > 0 && (
        <Card className="mt-6">
          <CardHeader
            title="Writing and Speaking are not marked automatically"
            hint="Enter a band from a teacher, or your own honest estimate, and the overall band and the leverage below will compute."
          />
          <div className="flex flex-wrap gap-6 p-6">
            {(["writing", "speaking"] as const).map((m) => (
              <label key={m} className="block">
                <span className="mb-1.5 block text-sm font-bold">{MODULE_LABEL[m]} band</span>
                <select
                  value={self[m] ?? ""}
                  onChange={(e) =>
                    setBand(m, e.target.value === "" ? undefined : Number(e.target.value))
                  }
                  className="h-11 w-44 cursor-pointer rounded-md border border-border bg-bg px-3 outline-none focus-visible:border-primary"
                >
                  <option value="">Not marked</option>
                  {BAND_OPTIONS.map((b) => (
                    <option key={b} value={b}>
                      {b.toFixed(1)}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        </Card>
      )}

      {/* ------------------------------------------------------------ leverage */}
      {result.report?.leverage && result.report.leverage.length > 0 && (
        <Card className="mt-6">
          <CardHeader
            title="Where half a band is worth most"
            hint="The overall band is rounded, so the same improvement in different modules does not buy the same result."
          />
          <ul className="divide-y divide-border">
            {result.report.leverage.map((l) => (
              <li key={`${l.module}-${l.to}`} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-6 py-4">
                <span className="font-bold">{MODULE_LABEL[l.module]}</span>
                <span className="tabular text-text-muted">
                  {l.from.toFixed(1)} → {l.to.toFixed(1)}
                </span>
                <span className="ml-auto tabular">
                  {l.wasted ? (
                    <span className="text-text-muted">
                      overall stays {l.overallTo.toFixed(1)}
                    </span>
                  ) : (
                    <span className="font-bold text-success">
                      overall {l.overallFrom.toFixed(1)} → {l.overallTo.toFixed(1)}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* --------------------------------------------------------- what to fix */}
      {result.report && result.report.priorities.length > 0 && (
        <Card className="mt-6">
          <CardHeader title="What to fix, in order of what it cost you" />
          <ol className="divide-y divide-border">
            {result.report.priorities.map((p, i) => (
              <li key={i} className="flex gap-5 px-6 py-5">
                <span className="tabular flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft font-bold text-amber-700">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <h3 className="font-bold leading-snug">{p.title}</h3>
                  <p className="mt-1.5 leading-relaxed text-text-muted">{p.detail}</p>
                  {p.marksLost !== undefined && p.marksLost > 0 && (
                    <p className="mt-2 text-sm font-bold">
                      {p.marksLost} mark{p.marksLost === 1 ? "" : "s"} · {MODULE_LABEL[p.module]}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </Card>
      )}

      {/* ------------------------------------------------------------- causes */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {marked.map((m) => (
          <Card key={m.module} className="p-6">
            <h2 className="font-bold">
              {MODULE_LABEL[m.module]} — why you lost marks
            </h2>
            <p className="mb-5 mt-1 text-sm text-text-muted">
              {m.raw} of {m.total} correct
            </p>
            <CauseBreakdown counts={m.byCause} total={(m.total ?? 0) - (m.raw ?? 0)} />
          </Card>
        ))}
      </div>

      {/* ------------------------------------------------------------ lag map */}
      {listening && lag.points.length > 0 && (
        <Card className="mt-6">
          <CardHeader
            title="Where you were in the audio"
            hint="The recording runs once. If your answers trail the speaker, the problem is recovery, not vocabulary."
          />
          <div className="p-6">
            <LagMap points={lag.points} durationSec={lag.durationSec} />
          </div>
        </Card>
      )}

      {/* ------------------------------------------------------------ honesty */}
      {attempt.mode === "exam" && attempt.focusLosses > 0 && (
        <p className="mt-6 rounded-md border border-border bg-bg-raised px-5 py-4 text-sm leading-relaxed text-text-muted">
          You left the test window{" "}
          <strong className="tabular text-text">{attempt.focusLosses}</strong> time
          {attempt.focusLosses === 1 ? "" : "s"}. Not a penalty — just the condition this
          score was produced under.
        </p>
      )}

      <div className="mt-10 flex flex-wrap gap-3">
        <ButtonLink href={`/review/${attempt.id}`} variant="accent" size="lg">
          Review every question
        </ButtonLink>
        <ButtonLink href="/tests" variant="outline" size="lg">
          Take it again
        </ButtonLink>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-5xl px-4 py-12">{children}</div>;
}
