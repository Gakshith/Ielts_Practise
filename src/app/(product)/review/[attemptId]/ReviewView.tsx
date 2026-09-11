"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Attempt, ItemResult, ModuleId, ModuleResult, TestPaper } from "@/types";
import { getAttempt } from "@/lib/storage";
import { getPaper } from "@/data/papers";
import { computeResult, readSelfBands } from "@/lib/results";
import { CAUSE_LABEL } from "@/components/results/CauseBreakdown";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { IconCheck, IconClose } from "@/components/ui/icons";
import { MODULE_LABEL } from "@/config/exam";

type Filter = "all" | "wrong";

export function ReviewView({ attemptId }: { attemptId: string }) {
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [paper, setPaper] = useState<TestPaper | null>(null);
  const [ready, setReady] = useState(false);
  const [filter, setFilter] = useState<Filter>("wrong");
  const [active, setActive] = useState<ModuleId | null>(null);

  useEffect(() => {
    const a = getAttempt(attemptId);
    setAttempt(a);
    setPaper(a ? getPaper(a.paperId) ?? null : null);
    setReady(true);
  }, [attemptId]);

  const result = useMemo(
    () => (attempt && paper ? computeResult(attempt, paper, readSelfBands(attemptId)) : null),
    [attempt, paper, attemptId],
  );

  const marked = useMemo(
    () => result?.modules.filter((m) => m.items.length > 0) ?? [],
    [result],
  );

  useEffect(() => {
    if (!active && marked.length > 0) setActive(marked[0].module);
  }, [marked, active]);

  if (!ready) return <Shell><p className="text-text-muted">Loading…</p></Shell>;

  if (!attempt || !result || marked.length === 0) {
    return (
      <Shell>
        <h1 className="font-serif text-3xl font-bold">Nothing to review.</h1>
        <p className="mt-3 text-text-muted">
          Only Listening and Reading are marked question by question.{" "}
          <Link href="/tests" className="font-bold text-primary underline">
            Back to the tests
          </Link>
          .
        </p>
      </Shell>
    );
  }

  const current = marked.find((m) => m.module === active) ?? marked[0];
  const shown = current.items.filter((i) => (filter === "wrong" ? !i.correct : true));

  return (
    <Shell>
      <Link
        href={`/results/${attemptId}`}
        className="text-sm font-bold text-text-muted underline hover:text-text"
      >
        ← Back to your results
      </Link>

      <h1 className="mt-4 font-serif text-4xl font-bold">Every question, and why</h1>
      <p className="mt-3 max-w-2xl text-lg leading-relaxed text-text-muted">
        For each one: where the answer actually was, and the wording in the question that
        pointed at it. Recognising that mapping is the skill being tested.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <div className="flex gap-1 rounded-md border border-border bg-bg-raised p-1">
          {marked.map((m) => (
            <button
              key={m.module}
              type="button"
              onClick={() => setActive(m.module)}
              className={`cursor-pointer rounded-sm px-4 py-2 text-sm font-bold transition-colors ${
                m.module === current.module
                  ? "bg-primary text-primary-text"
                  : "text-text-muted hover:bg-bg-sunken"
              }`}
            >
              {MODULE_LABEL[m.module]}
              <span className="tabular ml-2 font-normal opacity-80">
                {m.raw}/{m.total}
              </span>
            </button>
          ))}
        </div>

        <div className="flex gap-1 rounded-md border border-border bg-bg-raised p-1">
          {(["wrong", "all"] as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`cursor-pointer rounded-sm px-4 py-2 text-sm font-bold transition-colors ${
                filter === f ? "bg-bg-sunken text-text" : "text-text-muted hover:bg-bg-sunken"
              }`}
            >
              {f === "wrong" ? "Only what I got wrong" : "Everything"}
            </button>
          ))}
        </div>
      </div>

      <ItemList module={current} items={shown} />

      <div className="mt-10">
        <ButtonLink href="/tests" variant="outline" size="lg">
          Take another test
        </ButtonLink>
      </div>
    </Shell>
  );
}

function ItemList({ module, items }: { module: ModuleResult; items: ItemResult[] }) {
  if (items.length === 0) {
    return (
      <p className="mt-8 rounded-lg border border-dashed border-border p-10 text-center text-text-muted">
        Nothing wrong in {MODULE_LABEL[module.module]}. Switch to “Everything” to see them all.
      </p>
    );
  }

  return (
    <ul className="mt-8 flex flex-col gap-4">
      {items.map((item) => (
        <Card key={item.n} as="li" className="p-6">
          <div className="flex flex-wrap items-start gap-4">
            <span
              className={`tabular flex h-9 w-9 shrink-0 items-center justify-center rounded-md border text-sm font-bold ${
                item.correct
                  ? "border-success bg-success-soft text-success"
                  : "border-danger bg-danger-soft text-danger"
              }`}
            >
              {item.n}
            </span>

            <div className="min-w-0 flex-1">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                {/* Icon plus word, never colour alone — red and green sit far too
                    close together for deuteranopia to separate them. */}
                <span
                  className={`flex items-center gap-1.5 text-sm font-bold ${
                    item.correct ? "text-success" : "text-danger"
                  }`}
                >
                  {item.correct ? <IconCheck width={16} height={16} /> : <IconClose width={16} height={16} />}
                  {item.correct ? "Correct" : "Wrong"}
                </span>
                {item.cause && !item.correct && (
                  <Badge tone="accent">{CAUSE_LABEL[item.cause]}</Badge>
                )}
                <Badge tone="neutral">{item.groupType.replace(/-/g, " ")}</Badge>
              </div>

              <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wide text-text-subtle">
                    You wrote
                  </dt>
                  <dd className="mt-1 font-bold">
                    {formatGiven(item.given) || <span className="text-text-muted">nothing</span>}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wide text-text-subtle">
                    Accepted
                  </dt>
                  <dd className="mt-1 font-bold">{item.accept.join(" / ")}</dd>
                </div>
              </dl>

              {item.explanation && (
                <p className="mt-4 leading-relaxed">{item.explanation}</p>
              )}

              {item.evidence?.quote && (
                <figure className="mt-4 border-l-4 border-accent bg-accent-soft/40 py-3 pl-4 pr-3">
                  <blockquote className="prose-exam text-[0.95rem]">
                    “{item.evidence.quote}”
                  </blockquote>
                  <figcaption className="mt-2 text-xs text-text-muted">
                    {item.evidence.paragraph && <>Paragraph {item.evidence.paragraph}</>}
                    {item.evidence.audioAt !== undefined && (
                      <>Heard at {formatTime(item.evidence.audioAt)}</>
                    )}
                  </figcaption>
                </figure>
              )}

              {item.evidence?.paraphraseOf && (
                <p className="mt-3 text-sm leading-relaxed text-text-muted">
                  The question said <strong className="text-text">“{item.evidence.paraphraseOf}”</strong>.
                  The source said it a different way — that swap is the whole test.
                </p>
              )}
            </div>
          </div>
        </Card>
      ))}
    </ul>
  );
}

function formatGiven(v: ItemResult["given"]): string {
  if (v === null || v === undefined) return "";
  return Array.isArray(v) ? v.join(", ") : v;
}

function formatTime(sec: number): string {
  return `${Math.floor(sec / 60)}:${String(Math.round(sec % 60)).padStart(2, "0")}`;
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-4xl px-4 py-12">{children}</div>;
}
