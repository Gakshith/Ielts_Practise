"use client";

import { useEffect, useRef } from "react";
import type { ListeningPart, Mode } from "@/types";
import { QuestionGroupView, type AnswerApi } from "@/components/questions/QuestionGroupView";
import { IconVolume } from "@/components/ui/icons";

export function ListeningView({
  part,
  api,
  mode,
  playing,
  onEnded,
  onTime,
}: {
  part: ListeningPart;
  api: AnswerApi;
  mode: Mode;
  playing: boolean;
  onEnded: () => void;
  onTime: (t: number) => void;
}) {
  const audio = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const el = audio.current;
    if (!el || !playing) return;
    // Autoplay can be refused; the gate required a click, so this should be allowed.
    void el.play().catch(() => undefined);
  }, [playing]);

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-6 lg:px-8">
      <div className="mb-6 rounded-md border border-border bg-bg-sunken px-4 py-3">
        <p className="text-sm font-bold">Part {part.index}</p>
        <p className="text-sm text-text-muted">{part.context}</p>
      </div>

      {part.audioSrc ? (
        <>
          <audio
            ref={audio}
            src={part.audioSrc}
            onEnded={onEnded}
            onTimeUpdate={(e) => onTime(e.currentTarget.currentTime)}
            /* Exam mode exposes no controls at all — no scrubber, no pause.
               Coach mode gives the candidate everything the real test denies. */
            controls={mode === "coach"}
            controlsList="nodownload"
            className={mode === "coach" ? "mb-6 w-full" : "sr-only"}
          />
          {mode === "exam" && (
            <p className="mb-6 flex items-center gap-2 text-sm font-bold text-text-muted">
              <IconVolume width={16} height={16} />
              Audio is playing. It will not be repeated.
            </p>
          )}
        </>
      ) : (
        <p className="mb-6 rounded-md border border-dashed border-border bg-bg-sunken px-4 py-3 text-sm text-text-muted">
          No audio file is loaded for this part yet. Answer from the questions; the
          transcript is available in the review after you submit.
        </p>
      )}

      {part.groups.map((g) => (
        <QuestionGroupView key={g.id} group={g} api={api} />
      ))}
    </div>
  );
}
