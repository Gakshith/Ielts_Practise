import type { ModuleId } from "@/types";

/** Module order in a full mock. This is the order the real test runs. */
export const MODULE_ORDER: ModuleId[] = ["listening", "reading", "writing", "speaking"];

export const MODULE_LABEL: Record<ModuleId, string> = {
  listening: "Listening",
  reading: "Reading",
  writing: "Writing",
  speaking: "Speaking",
};

/* Timings, from the official format.

   The Listening figure is the one most often got wrong: paper-based IELTS gives ten
   minutes to transfer answers to an answer sheet, but COMPUTER-DELIVERED gives only
   two minutes to review. We are modelling the computer-delivered test, so it is 120s.

   Reading is 60 minutes INCLUDING transfer time — there is no extra time at the end.
   Writing is a single 60-minute block; the 20/40 split across the two tasks is advice,
   not an enforced timer. */
export const LISTENING_REVIEW_SEC = 120;
export const READING_SEC = 60 * 60;
export const WRITING_SEC = 60 * 60;
/** Speaking runs 11-14 minutes and is paced by the examiner, not a countdown. */
export const SPEAKING_SEC: number | null = null;

/** Fallback when a Listening part has no audio file and so no real duration. */
export const DEFAULT_PART_SEC = 6 * 60;
