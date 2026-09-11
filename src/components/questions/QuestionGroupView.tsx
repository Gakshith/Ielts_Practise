"use client";

import { Fragment, type ReactNode } from "react";
import type { Item, Mode, QuestionGroup, ResponseValue } from "@/types";
import { Blank, type Verdict } from "./Blank";

export interface AnswerApi {
  get: (n: number) => ResponseValue;
  set: (n: number, v: ResponseValue) => void;
  activeN: number;
  setActive: (n: number) => void;
  isFlagged: (n: number) => boolean;
  toggleFlag: (n: number) => void;
  mode: Mode;
  /** Coach mode only: instant per-question verdict. Undefined in exam mode. */
  verdict: (n: number) => Verdict;
  /** Coach mode only: the word-limit warning the real test never gives. */
  overLimit: (n: number) => boolean;
}

const TFNG = ["TRUE", "FALSE", "NOT GIVEN"];
const YNNG = ["YES", "NO", "NOT GIVEN"];

export function QuestionGroupView({ group, api }: { group: QuestionGroup; api: AnswerApi }) {
  const range =
    group.items.length > 1
      ? `Questions ${group.items[0].n}–${group.items[group.items.length - 1].n}`
      : `Question ${group.items[0].n}`;

  return (
    <section className="mb-10" aria-label={range}>
      <h3 className="mb-2 font-bold">{range}</h3>
      <p className="mb-1 leading-relaxed">{group.instructions}</p>
      {group.wordLimit && (
        <p className="mb-4 font-bold uppercase tracking-wide text-[0.8rem]">
          {group.wordLimit.label}
        </p>
      )}
      {group.heading && <h4 className="mb-3 mt-5 font-bold">{group.heading}</h4>}

      {group.options && group.options.length > 0 && needsBank(group) && (
        <ul className="mb-6 rounded-md border border-border bg-bg-sunken p-4">
          {group.options.map((o) => (
            <li key={o.key} className="flex gap-3 py-0.5 leading-relaxed">
              <span className="w-6 shrink-0 font-bold">{o.key}</span>
              <span>{o.text}</span>
            </li>
          ))}
        </ul>
      )}

      <Body group={group} api={api} />
    </section>
  );
}

function needsBank(g: QuestionGroup) {
  return (
    g.type === "matching-headings" ||
    g.type === "matching-information" ||
    g.type === "matching-features" ||
    g.type === "sentence-endings"
  );
}

function Body({ group, api }: { group: QuestionGroup; api: AnswerApi }) {
  switch (group.type) {
    case "true-false-notgiven":
      return <ChoiceList group={group} api={api} choices={TFNG} />;
    case "yes-no-notgiven":
      return <ChoiceList group={group} api={api} choices={YNNG} />;
    case "multiple-choice":
    case "multiple-select":
      return <MultipleChoice group={group} api={api} />;
    case "matching-headings":
    case "matching-information":
    case "matching-features":
    case "sentence-endings":
      return <Matching group={group} api={api} />;
    case "note-completion":
    case "form-completion":
    case "table-completion":
    case "flowchart-completion":
    case "summary-completion":
      return <Completion group={group} api={api} />;
    case "diagram-labelling":
    case "map-labelling":
      return <Labelling group={group} api={api} />;
    case "sentence-completion":
    case "short-answer":
    default:
      return <PromptedBlanks group={group} api={api} />;
  }
}

/* ---------------------------------------------------------------- shared bits */

function QuestionNumber({ n, api }: { n: number; api: AnswerApi }) {
  const active = api.activeN === n;
  return (
    <button
      type="button"
      onClick={() => {
        api.setActive(n);
        api.toggleFlag(n);
      }}
      aria-label={`Question ${n}${api.isFlagged(n) ? ", flagged. Click to unflag" : ". Click to flag for review"}`}
      className={[
        "tabular mt-0.5 flex h-7 min-w-7 shrink-0 cursor-pointer items-center justify-center border px-1 text-sm font-bold transition-all",
        api.isFlagged(n) ? "rounded-full border-accent bg-accent-soft" : "rounded-sm",
        active ? "border-primary text-primary ring-2 ring-primary/20" : "border-border text-text-muted",
      ].join(" ")}
    >
      {n}
    </button>
  );
}

function VerdictNote({ item, api }: { item: Item; api: AnswerApi }) {
  const v = api.verdict(item.n);
  if (!v) return null;
  return (
    <div
      className={`mt-2 rounded-md border p-3 text-sm leading-relaxed ${
        v === "correct" ? "border-success bg-success-soft" : "border-danger bg-danger-soft"
      }`}
    >
      <p className="font-bold">
        {v === "correct" ? "Correct" : `Not quite — the answer is “${item.accept[0]}”`}
      </p>
      {item.explanation && <p className="mt-1">{item.explanation}</p>}
    </div>
  );
}

function Row({ n, api, children }: { n: number; api: AnswerApi; children: ReactNode }) {
  return (
    <li className="mb-6 flex gap-3">
      <QuestionNumber n={n} api={api} />
      <div className="min-w-0 flex-1">{children}</div>
    </li>
  );
}

/* ------------------------------------------------------------------ renderers */

function ChoiceList({
  group,
  api,
  choices,
}: {
  group: QuestionGroup;
  api: AnswerApi;
  choices: string[];
}) {
  return (
    <ul>
      {group.items.map((item) => {
        const current = api.get(item.n);
        return (
          <Row key={item.n} n={item.n} api={api}>
            <p className="mb-2 leading-relaxed">{item.prompt}</p>
            <div className="flex flex-col gap-1">
              {choices.map((c) => (
                <label
                  key={c}
                  className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-bg-sunken"
                >
                  <input
                    type="radio"
                    name={`q${item.n}`}
                    checked={current === c}
                    onChange={() => {
                      api.setActive(item.n);
                      api.set(item.n, c);
                    }}
                    className="h-4 w-4 accent-[var(--primary)]"
                  />
                  <span className="text-[0.95rem] font-bold tracking-wide">{c}</span>
                </label>
              ))}
            </div>
            <VerdictNote item={item} api={api} />
          </Row>
        );
      })}
    </ul>
  );
}

function MultipleChoice({ group, api }: { group: QuestionGroup; api: AnswerApi }) {
  const multi = group.type === "multiple-select";
  return (
    <ul>
      {group.items.map((item) => {
        const raw = api.get(item.n);
        const picked = Array.isArray(raw) ? raw : raw ? [raw] : [];
        const limit = item.expects ?? 1;
        return (
          <Row key={item.n} n={item.n} api={api}>
            <p className="mb-2 leading-relaxed">{item.prompt}</p>
            {multi && (
              <p className="mb-2 text-sm font-bold text-text-muted">
                Choose {limit} — {picked.length} selected
              </p>
            )}
            <div className="flex flex-col gap-1">
              {(item.options ?? group.options ?? []).map((o) => {
                const on = picked.includes(o.key);
                return (
                  <label
                    key={o.key}
                    className="flex cursor-pointer items-start gap-2.5 rounded-md px-2 py-1.5 hover:bg-bg-sunken"
                  >
                    <input
                      type={multi ? "checkbox" : "radio"}
                      name={`q${item.n}`}
                      checked={on}
                      onChange={() => {
                        api.setActive(item.n);
                        if (!multi) return api.set(item.n, o.key);
                        const next = on
                          ? picked.filter((k) => k !== o.key)
                          : picked.length >= limit
                            ? picked
                            : [...picked, o.key];
                        api.set(item.n, next);
                      }}
                      className="mt-1 h-4 w-4 accent-[var(--primary)]"
                    />
                    <span className="leading-relaxed">
                      <strong className="mr-2">{o.key}</strong>
                      {o.text}
                    </span>
                  </label>
                );
              })}
            </div>
            <VerdictNote item={item} api={api} />
          </Row>
        );
      })}
    </ul>
  );
}

function Matching({ group, api }: { group: QuestionGroup; api: AnswerApi }) {
  const options = group.options ?? [];
  return (
    <ul>
      {group.items.map((item) => {
        const v = api.get(item.n);
        return (
          <Row key={item.n} n={item.n} api={api}>
            <div className="flex flex-wrap items-center gap-3">
              <p className="min-w-0 flex-1 leading-relaxed">{item.prompt}</p>
              <select
                value={typeof v === "string" ? v : ""}
                onChange={(e) => {
                  api.setActive(item.n);
                  api.set(item.n, e.target.value || null);
                }}
                aria-label={`Answer for question ${item.n}`}
                className="h-10 shrink-0 cursor-pointer rounded-md border border-border-strong bg-bg-raised px-3 font-bold outline-none"
              >
                <option value="">—</option>
                {options.map((o) => (
                  <option key={o.key} value={o.key}>
                    {o.key}
                  </option>
                ))}
              </select>
            </div>
            <VerdictNote item={item} api={api} />
          </Row>
        );
      })}
    </ul>
  );
}

/** Splits "Price: {{3}} per week" into text and blanks. */
function renderWithBlanks(text: string, group: QuestionGroup, api: AnswerApi): ReactNode[] {
  return text.split(/(\{\{\d+\}\})/g).map((chunk, i) => {
    const m = chunk.match(/^\{\{(\d+)\}\}$/);
    if (!m) return <Fragment key={i}>{chunk}</Fragment>;
    const n = Number(m[1]);
    const item = group.items.find((x) => x.n === n);
    if (!item) return <Fragment key={i}>{chunk}</Fragment>;
    const v = api.get(n);
    return (
      <Blank
        key={i}
        n={n}
        value={typeof v === "string" ? v : ""}
        onChange={(val) => api.set(n, val)}
        onFocus={() => api.setActive(n)}
        active={api.activeN === n}
        verdict={api.verdict(n)}
        mode={api.mode}
        overLimit={api.overLimit(n)}
      />
    );
  });
}

function Completion({ group, api }: { group: QuestionGroup; api: AnswerApi }) {
  const layout = group.layout;

  if (layout?.kind === "table" && layout.rows) {
    return (
      <>
        {layout.title && <h4 className="mb-3 text-center font-bold">{layout.title}</h4>}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            {layout.headers && (
              <thead>
                <tr>
                  {layout.headers.map((h) => (
                    <th key={h} className="border border-border bg-bg-sunken p-2.5 font-bold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {layout.rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="border border-border p-2.5 align-top leading-relaxed">
                      {renderWithBlanks(cell, group, api)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <CoachNotes group={group} api={api} />
      </>
    );
  }

  const lines = layout?.lines ?? group.items.map((i) => i.prompt ?? `{{${i.n}}}`);
  return (
    <>
      {layout?.title && <h4 className="mb-3 font-bold">{layout.title}</h4>}
      <div className="leading-loose">
        {lines.map((line, i) =>
          line.trim() === "" ? (
            <div key={i} className="h-3" />
          ) : (
            <p key={i} className="my-1">
              {renderWithBlanks(line, group, api)}
            </p>
          ),
        )}
      </div>
      <CoachNotes group={group} api={api} />
    </>
  );
}

function Labelling({ group, api }: { group: QuestionGroup; api: AnswerApi }) {
  return (
    <>
      {group.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={group.image.src}
          alt={group.image.alt}
          className="mb-5 w-full rounded-md border border-border"
        />
      ) : (
        <p className="mb-5 rounded-md border border-dashed border-border bg-bg-sunken p-4 text-sm text-text-muted">
          The diagram for this group has not been added yet. The labels below still work.
        </p>
      )}
      <PromptedBlanks group={group} api={api} />
    </>
  );
}

function PromptedBlanks({ group, api }: { group: QuestionGroup; api: AnswerApi }) {
  return (
    <ul>
      {group.items.map((item) => {
        const v = api.get(item.n);
        const text = item.prompt ?? "";
        const hasSlot = /\{\{\d+\}\}/.test(text);
        return (
          <Row key={item.n} n={item.n} api={api}>
            <div className="leading-loose">
              {hasSlot ? (
                renderWithBlanks(text, group, api)
              ) : (
                <>
                  {text}{" "}
                  <Blank
                    n={item.n}
                    value={typeof v === "string" ? v : ""}
                    onChange={(val) => api.set(item.n, val)}
                    onFocus={() => api.setActive(item.n)}
                    active={api.activeN === item.n}
                    verdict={api.verdict(item.n)}
                    mode={api.mode}
                    overLimit={api.overLimit(item.n)}
                    width="14ch"
                  />
                </>
              )}
            </div>
            <VerdictNote item={item} api={api} />
          </Row>
        );
      })}
    </ul>
  );
}

/** Completion layouts render blanks inline, so coach feedback needs its own pass. */
function CoachNotes({ group, api }: { group: QuestionGroup; api: AnswerApi }) {
  if (api.mode !== "coach") return null;
  const shown = group.items.filter((i) => api.verdict(i.n));
  if (shown.length === 0) return null;
  return (
    <div className="mt-5 flex flex-col gap-2">
      {shown.map((item) => (
        <VerdictNote key={item.n} item={item} api={api} />
      ))}
    </div>
  );
}
