"use client";

import { useEffect, useState } from "react";
import type { SpeakingPart, SpeakingTurn } from "@/types";
import { Button } from "@/components/ui/Button";
import { IconMic, IconUser } from "@/components/ui/icons";
import { useSpeechTranscript } from "./useSpeechTranscript";

function mmss(s: number) {
  const m = Math.floor(Math.max(0, s) / 60);
  return `${m}:${String(Math.floor(Math.max(0, s) % 60)).padStart(2, "0")}`;
}

/* The examiner is scripted for now. When a voice API lands it drives `prompt` and
   speaks it aloud; nothing else in this component has to change. */
export function SpeakingView({
  part,
  turns,
  onTurn,
}: {
  part: SpeakingPart;
  turns: SpeakingTurn[];
  onTurn: (t: SpeakingTurn) => void;
}) {
  const [qi, setQi] = useState(0);
  const [phase, setPhase] = useState<"idle" | "prep" | "speaking">("idle");
  const [left, setLeft] = useState(0);
  const t = useSpeechTranscript();

  const questions = part.questions ?? [];
  const isCue = part.index === 2 && part.cueCard;
  const prompt = isCue ? part.cueCard!.topic : questions[qi];

  useEffect(() => {
    if (phase === "idle") return;
    const id = window.setInterval(() => setLeft((v) => Math.max(0, v - 1)), 1000);
    return () => window.clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== "idle" || left !== 0) return;
  }, [phase, left]);

  useEffect(() => {
    if (left === 0 && phase === "prep") {
      setPhase("speaking");
      setLeft(part.speakSec ?? 120);
      t.start();
    }
    if (left === 0 && phase === "speaking") {
      setPhase("idle");
      t.stop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left, phase]);

  function commit() {
    const text = [t.final, t.interim].filter(Boolean).join(" ").trim();
    if (text) {
      onTurn({ role: "examiner", text: prompt ?? "", startedAt: Date.now() - 1 });
      onTurn({ role: "candidate", text, startedAt: Date.now(), endedAt: Date.now() });
    }
    t.reset();
    t.stop();
    setPhase("idle");
    if (!isCue && qi < questions.length - 1) setQi((i) => i + 1);
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 px-6 py-6 lg:grid-cols-2 lg:px-8">
      {/* ------------------------------------------------------------ examiner */}
      <div>
        <div className="rounded-lg border border-border bg-bg-raised p-6 shadow-card">
          <div className="mb-4 flex items-center gap-2 text-sm font-bold text-text-muted">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-text">
              <IconUser width={16} height={16} />
            </span>
            Examiner
          </div>

          {isCue ? (
            <>
              <p className="font-serif text-xl font-bold leading-snug">
                {part.cueCard!.topic}
              </p>
              <ul className="mt-4 space-y-1.5 font-serif text-lg leading-relaxed">
                {part.cueCard!.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span aria-hidden="true">·</span>
                    {b}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="font-serif text-xl leading-snug">{prompt ?? "—"}</p>
          )}

          {!isCue && questions.length > 0 && (
            <p className="mt-4 text-sm text-text-muted">
              Question {qi + 1} of {questions.length}
            </p>
          )}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          {phase === "idle" && (
            <Button
              onClick={() => {
                if (isCue) {
                  setPhase("prep");
                  setLeft(part.prepSec ?? 60);
                } else {
                  setPhase("speaking");
                  setLeft(part.speakSec ?? 60);
                  t.start();
                }
              }}
            >
              <IconMic width={18} height={18} />
              {isCue ? "Start 1 minute preparation" : "Answer"}
            </Button>
          )}

          {phase !== "idle" && (
            <>
              <span
                className={`tabular rounded-md border px-4 py-2.5 font-bold ${
                  phase === "prep"
                    ? "border-accent bg-accent-soft text-amber-700"
                    : "border-primary bg-navy-100 text-navy-700"
                }`}
              >
                {phase === "prep" ? "Preparation" : "Speaking"} · {mmss(left)}
              </span>
              <Button variant="outline" onClick={commit}>
                Done
              </Button>
            </>
          )}
        </div>

        {isCue && phase === "prep" && (
          <p className="mt-3 text-sm text-text-muted">
            You have one minute to prepare. You may make notes in the notes drawer.
          </p>
        )}
      </div>

      {/* ---------------------------------------------------------- transcript */}
      <div className="flex min-h-[24rem] flex-col rounded-lg border border-border bg-bg-raised shadow-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <h3 className="font-bold">Your transcript</h3>
          {t.listening && (
            <span className="flex items-center gap-2 text-sm font-bold text-danger">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-danger opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-danger" />
              </span>
              Recording
            </span>
          )}
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {turns.length === 0 && !t.final && !t.interim && (
            <p className="text-sm leading-relaxed text-text-muted">
              What you say appears here as you speak, so you can see exactly what the
              examiner heard.
              {!t.supported && (
                <>
                  {" "}
                  This browser does not support live transcription — type your answer
                  below instead.
                </>
              )}
            </p>
          )}

          {turns.map((turn, i) => (
            <div key={i}>
              <p className="mb-1 text-xs font-bold uppercase tracking-wide text-text-subtle">
                {turn.role === "examiner" ? "Examiner" : "You"}
              </p>
              <p className={turn.role === "examiner" ? "text-text-muted" : "leading-relaxed"}>
                {turn.text}
              </p>
            </div>
          ))}

          {(t.final || t.interim) && (
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-wide text-text-subtle">
                You · now
              </p>
              <p className="leading-relaxed">
                {t.final}{" "}
                <span className="text-text-subtle">{t.interim}</span>
              </p>
            </div>
          )}
        </div>

        {!t.supported && (
          <div className="border-t border-border p-4">
            <label htmlFor="typed" className="sr-only">
              Type your answer
            </label>
            <textarea
              id="typed"
              value={t.final}
              onChange={(e) => {
                t.reset();
                t.append(e.target.value);
              }}
              placeholder="Type what you would say."
              className="h-24 w-full resize-none rounded-md border border-border bg-bg p-3 text-sm outline-none focus-visible:border-primary"
            />
          </div>
        )}
      </div>
    </div>
  );
}
