"use client";

import { IconHeadphones, IconPlay } from "@/components/ui/icons";
import type { Mode } from "@/types";

/* The real test gates every Listening part behind this screen, and the wording matters:
   the candidate is told BEFORE they commit that the audio will not come back.
   In Coach mode we say the opposite, plainly, so the difference is never ambiguous. */
export function AudioGate({
  partLabel,
  context,
  mode,
  hasAudio,
  onPlay,
}: {
  partLabel: string;
  context: string;
  mode: Mode;
  hasAudio: boolean;
  onPlay: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${partLabel} audio`}
      className="absolute inset-0 z-30 flex items-center justify-center bg-navy-900/92 px-6 text-center"
    >
      <div className="max-w-lg text-white">
        <IconHeadphones width={72} height={72} className="mx-auto mb-6 opacity-90" strokeWidth={1.2} />
        <p className="mb-1 text-sm font-bold uppercase tracking-widest text-navy-300">
          {partLabel}
        </p>
        <h2 className="mb-5 font-serif text-2xl leading-snug">{context}</h2>

        {mode === "exam" ? (
          <p className="mb-7 leading-relaxed text-navy-200">
            You will be listening to an audio clip during this test. You will not be
            permitted to pause or rewind the audio while answering the questions.
          </p>
        ) : (
          <p className="mb-7 leading-relaxed text-navy-200">
            Coach mode: you can pause, rewind and replay this part as often as you like.
            The real test allows none of that.
          </p>
        )}

        {hasAudio ? (
          <button
            type="button"
            onClick={onPlay}
            className="inline-flex h-14 cursor-pointer items-center gap-3 rounded-md bg-white px-8 font-bold text-navy-900 transition-transform hover:scale-[1.02]"
          >
            <IconPlay /> Play
          </button>
        ) : (
          <div>
            <button
              type="button"
              onClick={onPlay}
              className="inline-flex h-14 cursor-pointer items-center gap-3 rounded-md bg-white px-8 font-bold text-navy-900 transition-transform hover:scale-[1.02]"
            >
              <IconPlay /> Continue without audio
            </button>
            <p className="mt-4 text-sm text-navy-300">
              No audio file is loaded for this part yet. The questions and the transcript
              still work.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
