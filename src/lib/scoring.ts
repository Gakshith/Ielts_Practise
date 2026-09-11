/* ===========================================================================
   Band arithmetic and answer marking. Pure, deterministic, no clock.

   `roundToBand` is the single most load-bearing function in the app: it is the
   real IELTS overall rounding rule and lives in exactly one place.
   =========================================================================== */

import type {
  CriterionScore,
  Item,
  ItemResult,
  MistakeCause,
  ModuleId,
  ModuleResult,
  QuestionGroup,
  QuestionType,
  Response,
  ResponseKey,
  ResponseValue,
  TestKind,
  WordLimit,
} from "@/types";
import { bandFor, type ObjectiveModule } from "./bands";

/**
 * Floating-point slack. Band arithmetic works in halves and quarters, which are
 * exact in binary, but a mean like 20/3 is not — so every threshold comparison
 * is made with this tolerance. Without it 6.25 can land on the wrong side of
 * the .25 boundary.
 */
const EPS = 1e-9;

const clampBand = (band: number): number => Math.max(0, Math.min(9, band));

/* --------------------------------------------------------------- rounding */

/**
 * The real IELTS overall rounding rule (spec rule, not our choice):
 *   fractional part  < .25          -> round DOWN to the whole band
 *   fractional part >= .25 and < .75 -> round to the .5
 *   fractional part >= .75          -> round UP to the next whole band
 *
 * Verified cases, all covered by the tolerance above:
 *   6.25   -> 6.5      3.875 -> 4.0      6.75 -> 7.0
 *   6.125  -> 6.0      7.0   -> 7.0      6.1  -> 6.0
 *   6.85   -> 7.0
 *
 * Note the asymmetry people get wrong: 6.25 rounds UP to 6.5, while 6.1 rounds
 * DOWN to 6.0. Result is always clamped to 0..9.
 */
export function roundToBand(mean: number): number {
  if (!Number.isFinite(mean)) {
    throw new RangeError(`roundToBand: expected a finite mean, received ${String(mean)}`);
  }
  const value = clampBand(mean);
  // + EPS so a value that is a hair under a whole band (6.9999999996) is not
  // floored into the band below.
  const whole = Math.floor(value + EPS);
  const frac = value - whole;
  if (frac < 0.25 - EPS) return clampBand(whole);
  if (frac < 0.75 - EPS) return clampBand(whole + 0.5);
  return clampBand(whole + 1);
}

/**
 * Round to the nearest HALF band, .25 going up. This is the writing/speaking
 * rounding, and it is NOT the same rule as `roundToBand` — 6.2 is 6.0 under
 * `roundToBand` but 6.0 here too, while 6.3 is 6.0 under `roundToBand` and 6.5
 * here. Keep the two apart.
 */
export function roundToHalfBand(value: number): number {
  if (!Number.isFinite(value)) {
    throw new RangeError(`roundToHalfBand: expected a finite value, received ${String(value)}`);
  }
  return clampBand(Math.round(clampBand(value) * 2 + EPS) / 2);
}

/* ------------------------------------------------------------ module bands */

export type ModuleBandMap = Partial<Record<ModuleId, number>>;
export interface ModuleBandEntry {
  readonly module: ModuleId;
  readonly band: number;
}
export type ModuleBandInput = ModuleBandMap | readonly ModuleBandEntry[];

export const ALL_MODULES: readonly ModuleId[] = ["listening", "reading", "writing", "speaking"];

function isBandList(input: ModuleBandInput): input is readonly ModuleBandEntry[] {
  return Array.isArray(input);
}

/** Normalise either shape (map, or `ModuleResult[]`) into a plain map. */
export function toBandMap(input: ModuleBandInput): ModuleBandMap {
  if (!isBandList(input)) return { ...input };
  const map: ModuleBandMap = {};
  for (const entry of input) {
    if (Number.isFinite(entry.band)) map[entry.module] = entry.band;
  }
  return map;
}

/**
 * Overall band: the arithmetic mean of the four module bands, put through
 * `roundToBand` (spec rule).
 *
 * Returns `undefined` unless all four modules are present. A single-section or
 * three-module attempt has no overall band in the real test, and inventing one
 * from a partial mean would be a fabricated number.
 */
export function overallBand(modules: ModuleBandInput): number | undefined {
  const map = toBandMap(modules);
  const bands = ALL_MODULES.map((m) => map[m]);
  if (bands.some((b) => typeof b !== "number" || !Number.isFinite(b))) return undefined;
  const total = bands.reduce<number>((sum, b) => sum + (b ?? 0), 0);
  return roundToBand(total / ALL_MODULES.length);
}

/**
 * Writing band from the two task bands. Task 2 counts twice (spec rule):
 *   (task1 + 2 * task2) / 3, rounded to the nearest half band.
 * Worked: T1=6, T2=7 -> 6.67 -> 6.5.  T1=9, T2=5 -> 6.33 -> 6.5.
 */
export function writingBand(task1: number, task2: number): number {
  return roundToHalfBand((clampBand(task1) + 2 * clampBand(task2)) / 3);
}

/**
 * The four Writing/Speaking criteria are equally weighted at 25% each (spec
 * rule) and each is scored in whole bands 0-9, so the task band is their plain
 * average. Returned UNROUNDED — pass it through `criterionBand` for a reported
 * score. Zero criteria returns 0.
 */
export function criterionAverage(criteria: readonly CriterionScore[]): number {
  if (criteria.length === 0) return 0;
  const total = criteria.reduce<number>((sum, c) => sum + clampBand(c.band), 0);
  return total / criteria.length;
}

/** `criterionAverage` reported as a half band, which is how a task band is shown. */
export function criterionBand(criteria: readonly CriterionScore[]): number {
  return roundToHalfBand(criterionAverage(criteria));
}

/* ---------------------------------------------------- text normalisation */

const DASHES = /[‐‑‒–—―−]/g;
const APOSTROPHES = /[‘’ʼ]/g;
const DOUBLE_QUOTES = /[“”]/g;
/** Punctuation stripped from the EDGES of a token. Currency and % are kept. */
const EDGE_PUNCTUATION = /^[.,;:!?"'`()[\]{}…]+|[.,;:!?"'`()[\]{}…]+$/g;
const HAS_ALPHANUMERIC = /[0-9a-zÀ-ɏ]/i;

/**
 * Canonical form for marking gap-fill answers: trim, collapse internal
 * whitespace, lower-case, strip punctuation from the edges of each token, and
 * unify curly quotes and dash variants. A hyphenated word keeps its hyphen and
 * therefore stays ONE word.
 */
export function normaliseAnswer(input: string | null | undefined): string {
  if (input === null || input === undefined) return "";
  return input
    .normalize("NFKC")
    .replace(DASHES, "-")
    .replace(APOSTROPHES, "'")
    .replace(DOUBLE_QUOTES, '"')
    .split(/\s+/)
    .map((token) => token.replace(EDGE_PUNCTUATION, ""))
    .filter((token) => token.length > 0)
    .join(" ")
    .toLowerCase();
}

/** The tokens `countWords` counts. Exported for the word-limit check. */
export function wordsOf(input: string | null | undefined): readonly string[] {
  const normalised = normaliseAnswer(input);
  if (normalised.length === 0) return [];
  return normalised.split(" ").filter((token) => HAS_ALPHANUMERIC.test(token));
}

/**
 * The word counter used by both the writing box and the word-limit check.
 * A hyphenated word ("well-known") counts as one. A number ("5,000") counts as
 * one. Tokens with no letter or digit are not words.
 */
export function countWords(input: string | null | undefined): number {
  return wordsOf(input).length;
}

const NUMERIC_TOKEN = /^[0-9][0-9.,:/–-]*[0-9%]?$/;

/** True when a token reads as a number rather than a word ("5,000", "3.30", "12"). */
export function isNumericToken(token: string): boolean {
  return NUMERIC_TOKEN.test(token);
}

/**
 * "Write NO MORE THAN TWO WORDS AND/OR A NUMBER" — exceeding the stated limit
 * scores ZERO in the real test even when the content is right (spec rule).
 * When `allowNumber` is set, one numeric token is free and does not count
 * toward `maxWords`. A blank answer never violates a word limit; it is blank.
 */
export function violatesWordLimit(
  answer: string | null | undefined,
  limit: WordLimit | undefined,
): boolean {
  if (!limit) return false;
  const tokens = wordsOf(answer);
  if (tokens.length === 0) return false;
  let counted = tokens.length;
  if (limit.allowNumber && tokens.some(isNumericToken)) counted -= 1;
  return counted > limit.maxWords;
}

/* ------------------------------------------------- mistake-cause inference */

/** Levenshtein distance, abandoned once it exceeds `cutoff`. */
export function editDistance(a: string, b: string, cutoff = Number.POSITIVE_INFINITY): number {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > cutoff) return cutoff + 1;
  let previous: number[] = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i += 1) {
    const current: number[] = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j += 1) {
      const substitution = previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1);
      const value = Math.min(current[j - 1] + 1, previous[j] + 1, substitution);
      current.push(value);
      if (value < rowMin) rowMin = value;
    }
    if (rowMin > cutoff) return cutoff + 1;
    previous = current;
  }
  return previous[b.length];
}

/** Crude English singulariser — enough to spot a plural/singular slip. */
function singularise(word: string): string {
  if (word.length > 4 && word.endsWith("ies")) return `${word.slice(0, -3)}y`;
  if (word.length > 4 && /(?:ss|sh|ch|x|z)es$/.test(word)) return word.slice(0, -2);
  if (word.length > 3 && word.endsWith("s") && !word.endsWith("ss")) return word.slice(0, -1);
  return word;
}

/** Same words apart from singular/plural on at least one of them. */
function differsOnlyByNumber(given: string, accepted: string): boolean {
  if (given === accepted) return false;
  const a = given.split(" ");
  const b = accepted.split(" ");
  if (a.length !== b.length || a.length === 0) return false;
  let sawDifference = false;
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] === b[i]) continue;
    if (singularise(a[i]) !== singularise(b[i])) return false;
    sawDifference = true;
  }
  return sawDifference;
}

const NUMBER_WORDS: Readonly<Record<string, string>> = {
  zero: "0", one: "1", two: "2", three: "3", four: "4", five: "5", six: "6",
  seven: "7", eight: "8", nine: "9", ten: "10", eleven: "11", twelve: "12",
  thirteen: "13", fourteen: "14", fifteen: "15", sixteen: "16", seventeen: "17",
  eighteen: "18", nineteen: "19", twenty: "20", thirty: "30", forty: "40",
  fifty: "50", sixty: "60", seventy: "70", eighty: "80", ninety: "90",
  hundred: "100", thousand: "1000", million: "1000000",
};

const MONTHS = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];

/** Digits, number words spelled out, and separators reduced to one string. */
function canonicalNumeric(value: string): string {
  return value
    .split(" ")
    .map((token) => NUMBER_WORDS[token] ?? token)
    .join("")
    .replace(/[^0-9a-z]/g, "");
}

/** Digit groups plus any month, as a sorted signature, so "12 May" == "May 12". */
function dateSignature(value: string): string | null {
  const digits = value.match(/\d+/g) ?? [];
  const month = MONTHS.find((m) => value.includes(m.slice(0, 3)));
  if (digits.length === 0) return null;
  if (digits.length < 2 && !month) return null;
  const parts = [...digits.map((d) => String(Number(d)))].sort();
  return `${month ? MONTHS.indexOf(month) + 1 : ""}|${parts.join("-")}`;
}

/**
 * Same value, different notation: "5,000" vs "5000", "twenty" vs "20",
 * "12 May" vs "May 12". A format slip scores zero in the real test when the
 * instruction asked for a specific form, so it is worth naming separately.
 */
function differsOnlyByFormat(given: string, accepted: string): boolean {
  if (given === accepted) return false;
  if (!/\d/.test(given) && !/\d/.test(accepted)) {
    // both spelled out: only treat as format when one maps to a number word
    const g = canonicalNumeric(given);
    const a = canonicalNumeric(accepted);
    return /\d/.test(g) && g === a;
  }
  if (canonicalNumeric(given) === canonicalNumeric(accepted)) return true;
  const gs = dateSignature(given);
  const as = dateSignature(accepted);
  return gs !== null && gs === as;
}

const TFNG_TYPES: readonly QuestionType[] = ["true-false-notgiven", "yes-no-notgiven"];
const NEGATIVE_KEYS = new Set(["false", "f", "no", "n"]);
const NOT_GIVEN_KEYS = new Set(["not given", "notgiven", "ng", "not-given"]);

function tfngConfusion(given: string, accepted: readonly string[]): boolean {
  const gaveNegative = NEGATIVE_KEYS.has(given);
  const gaveNotGiven = NOT_GIVEN_KEYS.has(given);
  if (!gaveNegative && !gaveNotGiven) return false;
  const keyIsNegative = accepted.some((a) => NEGATIVE_KEYS.has(a));
  const keyIsNotGiven = accepted.some((a) => NOT_GIVEN_KEYS.has(a));
  return (gaveNegative && keyIsNotGiven) || (gaveNotGiven && keyIsNegative);
}

/* ------------------------------------------------------------- marking */

export interface MarkOptions {
  /** the group's word limit, when it has one */
  readonly limit?: WordLimit;
  /** needed for the not-given vs false rule; harmless elsewhere */
  readonly groupType?: QuestionType;
  /**
   * A cause supplied by the content author. ALWAYS wins over inference.
   * `Item` in the frozen contract has no `cause` field, so authored causes are
   * threaded in here — see the report note.
   */
  readonly authoredCause?: MistakeCause;
}

export interface MarkOutcome {
  readonly correct: boolean;
  /** best guess at why it was wrong; undefined when the answer was right or we cannot tell */
  readonly cause?: MistakeCause;
  /** the normalised candidate answer(s), useful for the review screen */
  readonly normalised: readonly string[];
  readonly blank: boolean;
  readonly wordLimitExceeded: boolean;
}

function responseValueOf(input: Response | ResponseValue | null | undefined): ResponseValue {
  if (input === null || input === undefined) return null;
  if (typeof input === "string" || Array.isArray(input)) return input;
  return input.value;
}

function acceptedForms(item: Item): readonly string[] {
  return item.accept.map(normaliseAnswer).filter((a) => a.length > 0);
}

/**
 * Mark one item and, when wrong, infer why. Inference order (first match wins):
 *   word limit exceeded -> "word-limit"
 *   empty / null        -> "blank"
 *   singular/plural     -> "number-agreement"
 *   edit distance 1-2   -> "spelling"
 *   different notation  -> "format"
 *   TFNG/YNNG false<->not given -> "notgiven-vs-false"
 *   otherwise undefined, so an authored cause or a human can fill it in.
 *
 * An authored cause always takes precedence over inference.
 */
export function markItem(
  item: Item,
  response: Response | ResponseValue | null | undefined,
  options: MarkOptions = {},
): MarkOutcome {
  const value = responseValueOf(response);
  const accepted = acceptedForms(item);
  const expects = item.expects ?? 1;

  // multi-answer items ("choose TWO letters"): set comparison, no inference
  if (Array.isArray(value)) {
    const given = Array.from(new Set(value.map(normaliseAnswer).filter((v) => v.length > 0)));
    const blank = given.length === 0;
    const correct =
      !blank && given.length === expects && given.every((g) => accepted.includes(g));
    const cause: MistakeCause | undefined = correct
      ? undefined
      : options.authoredCause ?? (blank ? "blank" : undefined);
    return { correct, cause, normalised: given, blank, wordLimitExceeded: false };
  }

  const given = normaliseAnswer(value);
  const blank = given.length === 0;
  const wordLimitExceeded = violatesWordLimit(given, options.limit);
  const matches = accepted.includes(given);

  // A word-limit breach is wrong even when the content matches (spec rule).
  const correct = matches && !blank && !wordLimitExceeded;
  if (correct) {
    return { correct: true, normalised: [given], blank: false, wordLimitExceeded: false };
  }

  const inferred = ((): MistakeCause | undefined => {
    if (wordLimitExceeded) return "word-limit";
    if (blank) return "blank";
    if (accepted.some((a) => differsOnlyByNumber(given, a))) return "number-agreement";
    for (const a of accepted) {
      const distance = editDistance(given, a, 2);
      // distance 2 on a short word is noise, not a misspelling
      if (distance === 1 && a.length >= 3) return "spelling";
      if (distance === 2 && a.length >= 5) return "spelling";
    }
    if (accepted.some((a) => differsOnlyByFormat(given, a))) return "format";
    if (
      options.groupType !== undefined &&
      TFNG_TYPES.includes(options.groupType) &&
      tfngConfusion(given, accepted)
    ) {
      return "notgiven-vs-false";
    }
    return undefined;
  })();

  return {
    correct: false,
    cause: options.authoredCause ?? inferred,
    normalised: blank ? [] : [given],
    blank,
    wordLimitExceeded,
  };
}

/** `${module}:${n}` — the key shape used by `Attempt.responses`. */
export function responseKey(module: ModuleId, n: number): ResponseKey {
  return `${module}:${n}`;
}

export interface MarkGroupOptions {
  /** authored causes keyed by item number, when the content supplies them */
  readonly authoredCauses?: Readonly<Record<number, MistakeCause | undefined>>;
}

/** Mark every item in a group, producing review-ready `ItemResult`s. */
export function markGroup(
  group: QuestionGroup,
  module: ModuleId,
  responses: Readonly<Record<ResponseKey, Response>>,
  options: MarkGroupOptions = {},
): ItemResult[] {
  return group.items.map((item) => {
    const response = responses[responseKey(module, item.n)];
    const outcome = markItem(item, response, {
      limit: group.wordLimit,
      groupType: group.type,
      authoredCause: options.authoredCauses?.[item.n],
    });
    return {
      n: item.n,
      given: response?.value ?? null,
      accept: item.accept,
      correct: outcome.correct,
      cause: outcome.cause,
      groupType: group.type,
      evidence: item.evidence,
      explanation: item.explanation,
      answeredAt: response?.firstAnsweredAt,
    };
  });
}

/** Tally of mistake causes for one set of results. */
export function tallyCauses(items: readonly ItemResult[]): Partial<Record<MistakeCause, number>> {
  const byCause: Partial<Record<MistakeCause, number>> = {};
  for (const item of items) {
    if (item.correct || item.cause === undefined) continue;
    byCause[item.cause] = (byCause[item.cause] ?? 0) + 1;
  }
  return byCause;
}

export interface ScoreModuleInput {
  readonly module: ObjectiveModule;
  readonly kind: TestKind;
  readonly groups: readonly QuestionGroup[];
  readonly responses: Readonly<Record<ResponseKey, Response>>;
  readonly authoredCauses?: Readonly<Record<number, MistakeCause | undefined>>;
}

/**
 * Score a listening or reading module: mark every group, convert the raw score
 * through the indicative band table, tally the causes.
 *
 * Degenerate cases: a module with no questions scores raw 0 / total 0 and band
 * 0 ("Did not attempt" on the descriptor scale) rather than a fabricated band.
 * Each `Item` is worth one mark, including multi-answer items.
 */
export function scoreObjectiveModule(input: ScoreModuleInput): ModuleResult {
  const items = input.groups.flatMap((group) =>
    markGroup(group, input.module, input.responses, { authoredCauses: input.authoredCauses }),
  );
  const total = items.length;
  const raw = items.filter((i) => i.correct).length;
  const band = total === 0 ? 0 : bandFor(input.module, input.kind, raw).band;
  return {
    module: input.module,
    raw,
    total,
    band,
    estimated: false,
    items,
    byCause: tallyCauses(items),
  };
}
