"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  Attempt,
  ContrastTheme,
  Item,
  ModuleId,
  QuestionGroup,
  ResponseValue,
  SpeakingTurn,
  TestPaper,
  TextSize,
} from "@/types";
import { responseKey, violatesWordLimit, normaliseAnswer } from "@/lib/scoring";
import { saveAttempt } from "@/lib/storage";
import {
  DEFAULT_PART_SEC,
  LISTENING_REVIEW_SEC,
  MODULE_LABEL,
  MODULE_ORDER,
  READING_SEC,
  WRITING_SEC,
} from "@/config/exam";
import { ExamHeader } from "./ExamHeader";
import { QuestionMap, type MapPart } from "./QuestionMap";
import { OptionsScreen } from "./OptionsScreen";
import { NotesDrawer } from "./NotesDrawer";
import { AudioGate } from "./AudioGate";
import { SubmitScreen } from "./SubmitScreen";
import { ListeningView } from "./ListeningView";
import { ReadingView } from "./ReadingView";
import { WritingView } from "./WritingView";
import { SpeakingView } from "./SpeakingView";
import type { AnswerApi } from "@/components/questions/QuestionGroupView";
import type { Verdict } from "@/components/questions/Blank";

interface Section {
  label: string;
  groups: QuestionGroup[];
  items: number[];
}

function sectionsFor(paper: TestPaper, activeModule: ModuleId): Section[] {
  const fromGroups = (label: string, groups: QuestionGroup[]): Section => ({
    label,
    groups,
    items: groups.flatMap((g) => g.items.map((i) => i.n)),
  });

  switch (activeModule) {
    case "listening":
      return paper.listening.parts.map((p) => fromGroups(`Part ${p.index}`, p.groups));
    case "reading":
      return paper.reading.passages.map((p) => fromGroups(`Passage ${p.index}`, p.groups));
    case "writing":
      return paper.writing.tasks.map((t) => ({
        label: `Task ${t.index}`,
        groups: [],
        items: [t.index],
      }));
    case "speaking":
      return paper.speaking.parts.map((p) => ({
        label: `Part ${p.index}`,
        groups: [],
        items: [],
      }));
  }
}

function durationFor(paper: TestPaper, activeModule: ModuleId): number | null {
  switch (activeModule) {
    case "listening": {
      const audio = paper.listening.parts.reduce(
        (sum, p) => sum + (p.durationSec ?? DEFAULT_PART_SEC),
        0,
      );
      // Computer-delivered gives 2 minutes to review, not the 10-minute transfer
      // window that paper-based IELTS allows.
      return audio + LISTENING_REVIEW_SEC;
    }
    case "reading":
      return READING_SEC;
    case "writing":
      return WRITING_SEC;
    case "speaking":
      return null;
  }
}

export function Player({ paper, attempt: initial }: { paper: TestPaper; attempt: Attempt }) {
  const router = useRouter();
  const [attempt, setAttempt] = useState<Attempt>(initial);

  const modules = useMemo<ModuleId[]>(
    () => (attempt.scope === "full" ? MODULE_ORDER : [attempt.scope]),
    [attempt.scope],
  );
  const [moduleIdx, setModuleIdx] = useState(0);
  const activeModule = modules[moduleIdx];

  const sections = useMemo(() => sectionsFor(paper, activeModule), [paper, activeModule]);
  const [sectionIdx, setSectionIdx] = useState(0);
  const [activeN, setActiveN] = useState(() => sections[0]?.items[0] ?? 1);

  const [overlay, setOverlay] = useState<"options" | "submit" | null>(null);
  const [notesOpen, setNotesOpen] = useState(false);
  const [contrast, setContrast] = useState<ContrastTheme>("black-on-white");
  const [textSize, setTextSize] = useState<TextSize>("normal");

  const [playing, setPlaying] = useState(false);
  const [gateOpen, setGateOpen] = useState(activeModule === "listening");

  const [moduleStart, setModuleStart] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());

  const duration = durationFor(paper, activeModule);
  const remaining =
    duration === null || attempt.mode === "coach"
      ? null
      : Math.max(0, duration - Math.floor((now - moduleStart) / 1000));

  /* ------------------------------------------------------------- side effects */

  useEffect(() => {
    document.documentElement.setAttribute("data-contrast", contrast);
  }, [contrast]);

  useEffect(() => {
    document.documentElement.setAttribute("data-textsize", textSize);
  }, [textSize]);

  // Restore the product's default theme when the player unmounts, so the rest of
  // the app is never left in yellow-on-black.
  useEffect(
    () => () => {
      document.documentElement.setAttribute("data-contrast", "black-on-white");
      document.documentElement.setAttribute("data-textsize", "normal");
    },
    [],
  );

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  /* Exam mode records how often the window lost focus. Stated in the report, never
     punished — it is the condition the score was produced under. */
  useEffect(() => {
    if (attempt.mode !== "exam") return;
    const onBlur = () => setAttempt((a) => ({ ...a, focusLosses: a.focusLosses + 1 }));
    window.addEventListener("blur", onBlur);
    return () => window.removeEventListener("blur", onBlur);
  }, [attempt.mode]);

  const persist = useRef<number | undefined>(undefined);
  useEffect(() => {
    window.clearTimeout(persist.current);
    persist.current = window.setTimeout(() => saveAttempt(attempt), 400);
    return () => window.clearTimeout(persist.current);
  }, [attempt]);

  /* -------------------------------------------------------------- answer wiring */

  const allItems = useMemo(() => {
    const map = new Map<number, { item: Item; group: QuestionGroup }>();
    for (const s of sections)
      for (const g of s.groups) for (const item of g.items) map.set(item.n, { item, group: g });
    return map;
  }, [sections]);

  const setValue = useCallback(
    (n: number, value: ResponseValue) => {
      setAttempt((a) => {
        const key = responseKey(activeModule, n);
        const prev = a.responses[key];
        const elapsed = Date.now() - moduleStart;
        return {
          ...a,
          responses: {
            ...a.responses,
            [key]: {
              value,
              flagged: prev?.flagged,
              firstAnsweredAt: prev?.firstAnsweredAt ?? elapsed,
              lastChangedAt: elapsed,
              revisions: (prev?.revisions ?? 0) + 1,
            },
          },
        };
      });
    },
    [activeModule, moduleStart],
  );

  const verdict = useCallback(
    (n: number): Verdict => {
      if (attempt.mode !== "coach") return undefined;
      const entry = allItems.get(n);
      const raw = attempt.responses[responseKey(activeModule, n)]?.value;
      if (!entry || raw === undefined || raw === null || raw === "") return undefined;
      const given = Array.isArray(raw) ? raw.join(" ") : raw;
      return entry.item.accept.some((a) => normaliseAnswer(a) === normaliseAnswer(given))
        ? "correct"
        : "incorrect";
    },
    [attempt.mode, attempt.responses, allItems, activeModule],
  );

  const api: AnswerApi = useMemo(
    () => ({
      get: (n) => attempt.responses[responseKey(activeModule, n)]?.value ?? null,
      set: setValue,
      activeN,
      setActive: (n) => {
        setActiveN(n);
        const idx = sections.findIndex((s) => s.items.includes(n));
        if (idx >= 0) setSectionIdx(idx);
      },
      isFlagged: (n) => Boolean(attempt.responses[responseKey(activeModule, n)]?.flagged),
      toggleFlag: (n) =>
        setAttempt((a) => {
          const key = responseKey(activeModule, n);
          const prev = a.responses[key];
          return {
            ...a,
            responses: {
              ...a.responses,
              [key]: { ...prev, value: prev?.value ?? null, flagged: !prev?.flagged },
            },
          };
        }),
      mode: attempt.mode,
      verdict,
      overLimit: (n) => {
        if (attempt.mode !== "coach") return false;
        const entry = allItems.get(n);
        const limit = entry?.group.wordLimit;
        const raw = attempt.responses[responseKey(activeModule, n)]?.value;
        if (!limit || typeof raw !== "string" || raw.trim() === "") return false;
        return violatesWordLimit(raw, limit);
      },
    }),
    [attempt.responses, attempt.mode, activeModule, activeN, sections, setValue, verdict, allItems],
  );

  /* --------------------------------------------------------------- question map */

  const mapParts: MapPart[] = useMemo(
    () =>
      sections.map((s) => ({
        label: s.label,
        items: s.items.map((n) => {
          const r = attempt.responses[responseKey(activeModule, n)];
          const v = r?.value;
          return {
            n,
            answered: Array.isArray(v) ? v.length > 0 : typeof v === "string" ? v.trim() !== "" : false,
            flagged: Boolean(r?.flagged),
          };
        }),
      })),
    [sections, attempt.responses, activeModule],
  );

  const answered = mapParts.flatMap((p) => p.items).filter((i) => i.answered).length;
  const totalItems = mapParts.flatMap((p) => p.items).length;
  const flagged = mapParts.flatMap((p) => p.items).filter((i) => i.flagged).map((i) => i.n);

  /* ------------------------------------------------------------------ progress */

  const goToModule = useCallback(
    (idx: number) => {
      const next = modules[idx];
      setModuleIdx(idx);
      setSectionIdx(0);
      setModuleStart(Date.now());
      setOverlay(null);
      setPlaying(false);
      setGateOpen(next === "listening");
      const first = sectionsFor(paper, next)[0]?.items[0] ?? 1;
      setActiveN(first);
      setAttempt((a) => ({ ...a, currentModule: next }));
    },
    [modules, paper],
  );

  const finish = useCallback(() => {
    const done: Attempt = {
      ...attempt,
      status: "submitted",
      finishedAt: Date.now(),
      currentModule: undefined,
    };
    saveAttempt(done);
    router.push(`/results/${done.id}`);
  }, [attempt, router]);

  const confirmSubmit = useCallback(() => {
    if (moduleIdx < modules.length - 1) goToModule(moduleIdx + 1);
    else finish();
  }, [moduleIdx, modules.length, goToModule, finish]);

  // Time up in exam mode ends the activeModule, exactly as the real test does.
  useEffect(() => {
    if (remaining === 0) confirmSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining === 0]);

  /* --------------------------------------------------------------- listening audio */

  const onAudioEnded = useCallback(() => {
    setPlaying(false);
    setAttempt((a) => ({
      ...a,
      listeningPartsPlayed: Array.from(new Set([...a.listeningPartsPlayed, sectionIdx + 1])),
    }));
    // The recording runs on to the next part on its own; the candidate does not
    // choose when. Only the last part leaves the gate closed.
    if (sectionIdx < sections.length - 1) {
      const next = sectionIdx + 1;
      setSectionIdx(next);
      setActiveN(sections[next].items[0] ?? activeN);
      setGateOpen(true);
    }
  }, [sectionIdx, sections, activeN]);

  /* ------------------------------------------------------------------- render */

  const section = sections[sectionIdx];
  const moduleLabel =
    attempt.scope === "full"
      ? `${MODULE_LABEL[activeModule]} · ${moduleIdx + 1} of ${modules.length}`
      : MODULE_LABEL[activeModule];

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-bg text-text">
      <ExamHeader
        moduleLabel={moduleLabel}
        remainingSec={remaining}
        mode={attempt.mode}
        audioPlaying={playing}
        notesOpen={notesOpen}
        onOptions={() => setOverlay("options")}
        onNotes={() => setNotesOpen((v) => !v)}
      />

      <div className="relative flex min-h-0 flex-1">
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          {activeModule === "listening" && (
            <ListeningView
              part={paper.listening.parts[sectionIdx]}
              api={api}
              mode={attempt.mode}
              playing={playing}
              onEnded={onAudioEnded}
              onTime={() => undefined}
            />
          )}

          {activeModule === "reading" && (
            <ReadingView
              passage={paper.reading.passages[sectionIdx]}
              api={api}
              highlights={attempt.highlights.filter((h) => h.module === "reading").map((h) => h.text)}
              onHighlight={(text) =>
                setAttempt((a) => ({
                  ...a,
                  highlights: [
                    ...a.highlights,
                    { module: "reading", sourceIndex: sectionIdx, text, createdAt: Date.now() },
                  ],
                }))
              }
            />
          )}

          {activeModule === "writing" && (
            <WritingView
              task={paper.writing.tasks[sectionIdx]}
              mode={attempt.mode}
              value={(() => {
                const v = attempt.responses[responseKey("writing", sectionIdx + 1)]?.value;
                return typeof v === "string" ? v : "";
              })()}
              onChange={(v) => setValue(sectionIdx + 1, v)}
            />
          )}

          {activeModule === "speaking" && (
            <SpeakingView
              part={paper.speaking.parts[sectionIdx]}
              turns={attempt.speaking?.turns ?? []}
              onTurn={(t: SpeakingTurn) =>
                setAttempt((a) => ({
                  ...a,
                  speaking: { turns: [...(a.speaking?.turns ?? []), t] },
                }))
              }
            />
          )}
        </div>

        <NotesDrawer
          open={notesOpen}
          notes={attempt.notes[activeModule] ?? ""}
          highlights={attempt.highlights.filter((h) => h.module === activeModule)}
          onNotes={(v) => setAttempt((a) => ({ ...a, notes: { ...a.notes, [activeModule]: v } }))}
          onClose={() => setNotesOpen(false)}
          onRemoveHighlight={(createdAt) =>
            setAttempt((a) => ({
              ...a,
              highlights: a.highlights.filter((h) => h.createdAt !== createdAt),
            }))
          }
        />

        {activeModule === "listening" && gateOpen && (
          <AudioGate
            partLabel={`Part ${paper.listening.parts[sectionIdx].index}`}
            context={paper.listening.parts[sectionIdx].context}
            mode={attempt.mode}
            hasAudio={paper.listening.parts[sectionIdx].audioSrc !== null}
            onPlay={() => {
              setGateOpen(false);
              setPlaying(true);
              if (paper.listening.parts[sectionIdx].audioSrc === null) onAudioEndedNoAudio();
            }}
          />
        )}

        {overlay === "options" && (
          <OptionsScreen
            contrast={contrast}
            textSize={textSize}
            onContrast={setContrast}
            onTextSize={setTextSize}
            onSubmit={() => setOverlay("submit")}
            onClose={() => setOverlay(null)}
          />
        )}

        {overlay === "submit" && (
          <SubmitScreen
            moduleLabel={MODULE_LABEL[activeModule]}
            answered={answered}
            total={totalItems}
            flagged={flagged}
            isLastModule={moduleIdx === modules.length - 1}
            nextLabel={modules[moduleIdx + 1] ? MODULE_LABEL[modules[moduleIdx + 1]] : undefined}
            onBack={() => setOverlay(null)}
            onConfirm={confirmSubmit}
          />
        )}
      </div>

      {section && section.items.length > 0 && activeModule !== "speaking" && (
        <QuestionMap
          parts={mapParts}
          activePart={sectionIdx}
          activeN={activeN}
          onSelect={api.setActive}
          onSelectPart={(i) => {
            setSectionIdx(i);
            setActiveN(sections[i].items[0] ?? activeN);
          }}
          onSubmit={() => setOverlay("submit")}
        />
      )}

      {activeModule === "speaking" && (
        <div className="flex shrink-0 items-center justify-between gap-4 border-t border-border bg-bg-raised px-4 py-3">
          <div className="flex gap-1">
            {sections.map((s, i) => (
              <button
                key={s.label}
                type="button"
                onClick={() => setSectionIdx(i)}
                className={`cursor-pointer rounded-md px-3 py-2 text-sm font-bold transition-colors ${
                  i === sectionIdx ? "bg-primary text-primary-text" : "text-text-muted hover:bg-bg-sunken"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setOverlay("submit")}
            className="cursor-pointer rounded-md border border-border-strong px-4 py-2 text-sm font-bold hover:bg-bg-sunken"
          >
            Finish speaking
          </button>
        </div>
      )}
    </div>
  );

  /* When a part has no audio file, "Continue" behaves as if the recording had just
     finished, so the gating logic has exactly one path. */
  function onAudioEndedNoAudio() {
    window.setTimeout(onAudioEnded, 0);
  }
}
