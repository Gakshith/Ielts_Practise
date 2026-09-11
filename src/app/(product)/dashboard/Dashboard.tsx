"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Attempt, Profile } from "@/types";
import { getProfile, listAttempts } from "@/lib/storage";
import { getPaper, papers } from "@/data/papers";
import { computeResult, readSelfBands } from "@/lib/results";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { BandBars } from "@/components/results/BandBars";
import { TrendLine } from "@/components/results/TrendLine";
import { IconTarget } from "@/components/ui/icons";
import { MODULE_LABEL } from "@/config/exam";

function daysUntil(iso: string): number | null {
  const t = new Date(`${iso}T00:00:00`).getTime();
  return Number.isNaN(t) ? null : Math.ceil((t - Date.now()) / 86_400_000);
}

export function Dashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [attempts, setAttempts] = useState<Attempt[] | null>(null);

  useEffect(() => {
    setProfile(getProfile());
    setAttempts(listAttempts());
  }, []);

  const finished = useMemo(
    () =>
      (attempts ?? [])
        .filter((a) => a.status === "submitted")
        .sort((a, b) => (a.finishedAt ?? 0) - (b.finishedAt ?? 0)),
    [attempts],
  );

  const results = useMemo(
    () =>
      finished
        .map((a) => {
          const paper = getPaper(a.paperId);
          return paper ? { attempt: a, result: computeResult(a, paper, readSelfBands(a.id)) } : null;
        })
        .filter((x): x is NonNullable<typeof x> => x !== null),
    [finished],
  );

  const latest = results[results.length - 1];
  const trend = results
    .filter((r) => r.result.overallBand !== undefined)
    .map((r, i) => ({ label: `#${i + 1}`, band: r.result.overallBand as number }));

  const left = profile?.testDate ? daysUntil(profile.testDate) : null;

  if (attempts === null) {
    return <Shell><p className="text-text-muted">Loading…</p></Shell>;
  }

  return (
    <Shell>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="font-serif text-4xl font-bold">
            {profile?.name ? `Hello, ${profile.name}.` : "Your dashboard"}
          </h1>
          <p className="mt-2 text-lg text-text-muted">
            {finished.length === 0
              ? "Nothing taken yet. One test tells you more than a week of reading about the test."
              : `${finished.length} attempt${finished.length === 1 ? "" : "s"} so far.`}
          </p>
        </div>

        {left !== null && left >= 0 && (
          <Card className="px-6 py-4 text-right">
            <p className="text-xs font-bold uppercase tracking-wide text-text-subtle">
              Until your test
            </p>
            <p className="tabular font-serif text-4xl font-bold leading-tight">{left}</p>
            <p className="text-sm text-text-muted">day{left === 1 ? "" : "s"}</p>
          </Card>
        )}
      </div>

      {/* Two actions, and only two. */}
      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        <Card className="flex flex-col p-7">
          <h2 className="font-serif text-2xl font-bold">Full mock test</h2>
          <p className="mt-2 mb-6 flex-1 leading-relaxed text-text-muted">
            All four modules in order, under real timing. Two hours forty-five minutes.
          </p>
          <ButtonLink href="/tests" variant="accent" size="lg">
            Start a full mock
          </ButtonLink>
        </Card>

        <Card className="flex flex-col p-7">
          <h2 className="font-serif text-2xl font-bold">One section</h2>
          <p className="mt-2 mb-6 flex-1 leading-relaxed text-text-muted">
            Drill Listening or Reading on its own, with the module&rsquo;s real rules intact.
          </p>
          <ButtonLink href="/practice" variant="outline" size="lg">
            Practise a section
          </ButtonLink>
        </Card>
      </div>

      {latest && (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card className="p-7">
            <CardTitle>Your most recent bands</CardTitle>
            <div className="mt-6">
              <BandBars
                rows={latest.result.modules.map((m) => ({
                  module: m.module,
                  band: m.band,
                  estimated: m.estimated,
                }))}
                target={profile?.target}
              />
            </div>
            <Link
              href={`/results/${latest.attempt.id}`}
              className="mt-6 inline-block font-bold text-primary underline"
            >
              See the full result
            </Link>
          </Card>

          <Card className="p-7">
            <CardTitle>Overall band across attempts</CardTitle>
            <div className="mt-6">
              <TrendLine points={trend} target={profile?.target} />
            </div>
          </Card>
        </div>
      )}

      {!profile?.testDate && (
        <Card className="mt-6 flex flex-wrap items-center gap-4 p-6">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-accent-soft text-amber-700">
            <IconTarget />
          </span>
          <p className="min-w-0 flex-1 leading-relaxed">
            <strong>Add your real test date.</strong> The countdown is more use than any
            streak badge when there is a visa riding on the result.
          </p>
          <Link href="/profile" className="font-bold text-primary underline">
            Set it
          </Link>
        </Card>
      )}

      {finished.length > 0 && (
        <Card className="mt-6">
          <CardHeader title="Recent attempts" />
          <ul className="divide-y divide-border">
            {results
              .slice()
              .reverse()
              .slice(0, 6)
              .map(({ attempt, result }) => (
                <li key={attempt.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-6 py-4 text-sm">
                  <span className="font-bold">
                    {new Date(result.finishedAt).toLocaleDateString()}
                  </span>
                  <Badge tone="neutral">
                    {attempt.scope === "full" ? "Full mock" : MODULE_LABEL[attempt.scope]}
                  </Badge>
                  <Badge tone={attempt.mode === "exam" ? "info" : "neutral"}>
                    {attempt.mode === "exam" ? "Exam" : "Coach"}
                  </Badge>
                  <span className="tabular text-text-muted">
                    {result.overallBand !== undefined
                      ? `Overall ${result.overallBand.toFixed(1)}`
                      : result.modules
                          .filter((m) => !m.estimated)
                          .map((m) => `${m.module.slice(0, 1).toUpperCase()} ${m.band.toFixed(1)}`)
                          .join(" · ")}
                  </span>
                  <Link
                    href={`/review/${attempt.id}`}
                    className="ml-auto font-bold text-primary underline"
                  >
                    Review
                  </Link>
                </li>
              ))}
          </ul>
        </Card>
      )}

      {finished.length === 0 && papers.length > 0 && (
        <p className="mt-8 text-text-muted">
          Start with{" "}
          <Link href="/tests" className="font-bold text-primary underline">
            {papers[0].title}
          </Link>
          .
        </p>
      )}
    </Shell>
  );
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="font-bold">{children}</h2>;
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-5xl px-4 py-12">{children}</div>;
}
