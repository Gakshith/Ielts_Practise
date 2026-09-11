/* ===========================================================================
   Domain contract for IELTS Practise.

   Everything else in the app is written against these types. `lib/` consumes
   them and stays pure; `app/` and `components/` render them. Adding a new test
   means adding data that satisfies `TestPaper` — never editing a component.
   =========================================================================== */

export type ModuleId = "listening" | "reading" | "writing" | "speaking";
export type TestKind = "academic" | "general";

/** Exam measures, Coach teaches. Threaded through the engine, never branched
 *  on inside a component. */
export type Mode = "exam" | "coach";

export type ContrastTheme = "black-on-white" | "white-on-black" | "yellow-on-black";
export type TextSize = "normal" | "large" | "xlarge";

/* ---------------------------------------------------------------- questions */

export type QuestionType =
  | "multiple-choice"          // pick one
  | "multiple-select"          // pick two or three
  | "true-false-notgiven"
  | "yes-no-notgiven"
  | "matching-headings"
  | "matching-information"
  | "matching-features"
  | "sentence-endings"
  | "sentence-completion"
  | "summary-completion"
  | "note-completion"
  | "table-completion"
  | "flowchart-completion"
  | "diagram-labelling"
  | "map-labelling"
  | "form-completion"
  | "short-answer";

/** "Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer."
 *  Violating this is an automatic zero in the real test, which is why Exam Mode
 *  stays silent about it and Coach Mode warns. */
export interface WordLimit {
  maxWords: number;
  allowNumber: boolean;
  /** verbatim instruction text, so the UI never has to reconstruct it */
  label: string;
}

export interface Option {
  key: string;      // "A", "B", "i", "ii"
  text: string;
}

/** Why a wrong answer was wrong. The whole point of the results report. */
export type MistakeCause =
  // reading
  | "notgiven-vs-false"
  | "paraphrase-missed"
  | "keyword-trap"
  | "outside-knowledge"
  // listening
  | "distractor"
  | "lost-thread"
  // both
  | "spelling"
  | "number-agreement"
  | "format"
  | "word-limit"
  | "out-of-time"
  | "blank";

/** Where the answer actually lived, for the review screen. */
export interface Evidence {
  /** paragraph label or index in a reading passage */
  paragraph?: string;
  /** the sentence in the source that contains the answer */
  quote?: string;
  /** the wording in the question that paraphrases it — the mapping candidates miss */
  paraphraseOf?: string;
  /** seconds into the audio where it is spoken */
  audioAt?: number;
}

export interface Item {
  /** 1..40, unique within its module */
  n: number;
  prompt?: string;
  /** per-item options; for matching groups the bank sits on the group instead */
  options?: Option[];
  /** every accepted spelling/form, already lower-cased and trimmed */
  accept: string[];
  /** how many answers this item expects (2 for "choose TWO letters") */
  expects?: number;
  explanation?: string;
  evidence?: Evidence;
  /** The cause this item traps for, when the author knows it. Always beats the
   *  cause the marker infers — the person who wrote the distractor knows best. */
  cause?: MistakeCause;
}

/** Note/table/form completion renders text with numbered blanks inline.
 *  Blanks are written as {{n}} in the text. */
export interface CompletionLayout {
  kind: "note" | "form" | "table" | "flowchart";
  title?: string;
  /** note/form: a list of lines. table: rows of cells. */
  lines?: string[];
  rows?: string[][];
  headers?: string[];
}

export interface QuestionGroup {
  id: string;
  type: QuestionType;
  /** "Choose TRUE if the statement agrees with the information given..." */
  instructions: string;
  heading?: string;
  wordLimit?: WordLimit;
  /** shared option bank for matching-type groups */
  options?: Option[];
  layout?: CompletionLayout;
  /** image for diagram/map labelling */
  image?: { src: string; alt: string };
  items: Item[];
}

/* -------------------------------------------------------------- test papers */

export interface ListeningPart {
  index: 1 | 2 | 3 | 4;
  /** "A phone call about second-hand furniture" */
  context: string;
  /** null until real audio is supplied — the UI must say so rather than pretend */
  audioSrc: string | null;
  durationSec?: number;
  transcript?: TranscriptCue[];
  groups: QuestionGroup[];
}

export interface TranscriptCue {
  /** seconds from the start of this part's audio */
  t: number;
  speaker?: string;
  text: string;
  /** question numbers whose answer is spoken in this cue */
  answers?: number[];
}

export interface ReadingParagraph {
  /** "A".."H" when the passage is used for matching-headings */
  label?: string;
  text: string;
}

export interface ReadingPassage {
  index: 1 | 2 | 3;
  title: string;
  subtitle?: string;
  /** "You should spend about 20 minutes on Questions 1-13" */
  blurb?: string;
  paragraphs: ReadingParagraph[];
  groups: QuestionGroup[];
}

export interface WritingTask {
  index: 1 | 2;
  minWords: number;
  suggestedMinutes: number;
  prompt: string;
  /** chart/diagram for Academic Task 1 */
  image?: { src: string; alt: string };
  /** what a strong answer must do — used by the report, shown only after */
  criteriaHints?: string[];
}

export interface SpeakingPart {
  index: 1 | 2 | 3;
  /** part 1 and 3: the examiner's questions. part 2: the cue card. */
  questions?: string[];
  cueCard?: {
    topic: string;
    bullets: string[];
    /** the examiner's rounding-off question after the 2 minutes */
    followUp?: string;
  };
  prepSec?: number;
  speakSec?: number;
  durationSec: number;
}

export interface TestPaper {
  id: string;
  title: string;
  kind: TestKind;
  /** true when passages/audio are stand-ins, so the UI can label it honestly */
  placeholder: boolean;
  listening: { parts: ListeningPart[] };
  reading: { passages: ReadingPassage[] };
  writing: { tasks: WritingTask[] };
  speaking: { parts: SpeakingPart[] };
}

/* ----------------------------------------------------------------- attempts */

export type ResponseValue = string | string[] | null;

/** Keyed `${module}:${n}` so a full mock can hold all four modules at once. */
export type ResponseKey = string;

export interface Response {
  value: ResponseValue;
  flagged?: boolean;
  /** ms from the start of the module — feeds the Listening lag map */
  firstAnsweredAt?: number;
  lastChangedAt?: number;
  /** how many times the candidate changed their mind */
  revisions?: number;
}

export type AttemptScope = "full" | ModuleId;

export type AttemptStatus = "in-progress" | "submitted" | "abandoned";

export interface Attempt {
  id: string;
  paperId: string;
  scope: AttemptScope;
  mode: Mode;
  kind: TestKind;
  status: AttemptStatus;
  startedAt: number;
  finishedAt?: number;
  /** which module the candidate is in, for a full mock */
  currentModule?: ModuleId;
  /** listening parts already played — gates forward-only navigation */
  listeningPartsPlayed: number[];
  responses: Record<ResponseKey, Response>;
  /** per-module seconds actually spent */
  timeSpent: Partial<Record<ModuleId, number>>;
  /** Exam Mode honesty record: times the window lost focus */
  focusLosses: number;
  /** free-text notes from the notes drawer, keyed by module */
  notes: Partial<Record<ModuleId, string>>;
  /** text highlights, for the vocabulary harvest */
  highlights: Highlight[];
  speaking?: SpeakingRecord;
}

export interface Highlight {
  module: ModuleId;
  /** passage index or listening part */
  sourceIndex: number;
  text: string;
  note?: string;
  createdAt: number;
}

export interface SpeakingTurn {
  role: "examiner" | "candidate";
  text: string;
  startedAt: number;
  endedAt?: number;
}

export interface SpeakingRecord {
  turns: SpeakingTurn[];
  /** measured, not guessed — these ground the AI report */
  metrics?: SpeakingMetrics;
}

export interface SpeakingMetrics {
  wordsPerMinute: number;
  totalWords: number;
  distinctWords: number;
  fillerCount: number;
  longestPauseSec: number;
  pauseCount: number;
  speakingSec: number;
}

/* ------------------------------------------------------------------ results */

export interface ItemResult {
  n: number;
  given: ResponseValue;
  accept: string[];
  correct: boolean;
  cause?: MistakeCause;
  groupType: QuestionType;
  evidence?: Evidence;
  explanation?: string;
  /** ms from module start when first answered — for the lag map */
  answeredAt?: number;
}

export interface ModuleResult {
  module: ModuleId;
  /** /40 for listening and reading; absent for writing and speaking */
  raw?: number;
  total?: number;
  band: number;
  /** true when the band is an AI estimate rather than a computed conversion */
  estimated: boolean;
  items: ItemResult[];
  byCause: Partial<Record<MistakeCause, number>>;
  /** per-criterion sub-bands for writing and speaking */
  criteria?: CriterionScore[];
}

export interface CriterionScore {
  name: string;
  band: number;
  comment: string;
}

export interface AttemptResult {
  attemptId: string;
  paperId: string;
  scope: AttemptScope;
  mode: Mode;
  finishedAt: number;
  modules: ModuleResult[];
  /** absent for single-section attempts */
  overallBand?: number;
  report?: Report;
}

export interface Report {
  /** the one sentence that should be the page heading */
  headline: string;
  strengths: string[];
  /** ranked, most costly first */
  priorities: ReportPriority[];
  /** which module buys the most overall band for the least work */
  leverage?: LeverageHint[];
}

export interface ReportPriority {
  title: string;
  detail: string;
  module: ModuleId;
  cause?: MistakeCause;
  /** how many marks this pattern cost */
  marksLost?: number;
}

export interface LeverageHint {
  module: ModuleId;
  from: number;
  to: number;
  overallFrom: number;
  overallTo: number;
  /** true when raising this module does not move the overall at all */
  wasted: boolean;
}

/* ------------------------------------------------------------------ profile */

export interface Profile {
  name: string;
  email?: string;
  target: number;
  kind: TestKind;
  /** ISO date of the real exam, for the countdown */
  testDate?: string;
  createdAt: number;
}
