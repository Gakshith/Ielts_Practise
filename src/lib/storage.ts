/* ===========================================================================
   localStorage persistence for attempts and the profile.

   Three hard requirements drive every line here:
   1. SSR-safe. Next.js renders this on the server where `window` does not
      exist. Every entry point guards, and reads return empty defaults.
   2. Versioned, with a migration hook, so a schema change cannot silently
      corrupt saved attempts.
   3. Never throws. Safari private mode throws on write, some embedded
      contexts throw on read, and a quota error must degrade to in-memory
      storage rather than take the app down.
   =========================================================================== */

import type { Attempt, AttemptScope, ModuleId, ModuleResult, Profile } from "@/types";

/** Bump when the persisted shape changes, and add a migration below. */
export const STORAGE_VERSION = 1;

const NAMESPACE = "ielts-practise";

export type StorageSlot = "attempts" | "profile";

/** Versioned key: `ielts-practise:v1:attempts`. */
export function storageKey(slot: StorageSlot, version: number = STORAGE_VERSION): string {
  return `${NAMESPACE}:v${version}:${slot}`;
}

/* -------------------------------------------------------------- migrations */

/** Transforms data written by `from` into the shape version `from + 1` expects. */
export type Migration = (data: unknown) => unknown;

/**
 * Migration hook. Key `n` upgrades version n to n + 1. Empty today because v1
 * is the first shape; when the shape changes, bump STORAGE_VERSION and add the
 * entry here rather than mutating readers.
 */
export const MIGRATIONS: Readonly<Record<number, Migration>> = {};

function migrate(data: unknown, fromVersion: number): unknown {
  let current = data;
  for (let v = fromVersion; v < STORAGE_VERSION; v += 1) {
    const step = MIGRATIONS[v];
    if (!step) return null; // no path forward: treat as absent rather than corrupt
    try {
      current = step(current);
    } catch {
      return null;
    }
  }
  return current;
}

/* ----------------------------------------------------------- the backend */

interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/** In-memory fallback. Used on the server, and whenever localStorage throws. */
const memory = new Map<string, string>();

/** True when persistence is real; false when we are running on memory only. */
export function isPersistent(): boolean {
  return backend() !== null;
}

function backend(): StorageLike | null {
  // `typeof window` is the SSR guard: on the server this short-circuits.
  if (typeof window === "undefined") return null;
  try {
    const store = window.localStorage;
    if (!store) return null;
    // Safari private mode can hand back a store that throws on write; probe it.
    const probe = `${NAMESPACE}:probe`;
    store.setItem(probe, "1");
    store.removeItem(probe);
    return store;
  } catch {
    return null;
  }
}

function readRaw(key: string): string | null {
  const store = backend();
  if (store) {
    try {
      const value = store.getItem(key);
      if (value !== null) return value;
    } catch {
      // fall through to memory
    }
  }
  return memory.get(key) ?? null;
}

function writeRaw(key: string, value: string): void {
  memory.set(key, value);
  const store = backend();
  if (!store) return;
  try {
    store.setItem(key, value);
  } catch {
    // quota or private mode: the memory copy above is the degraded mode
  }
}

function removeRaw(key: string): void {
  memory.delete(key);
  const store = backend();
  if (!store) return;
  try {
    store.removeItem(key);
  } catch {
    // nothing else to do; the memory copy is already gone
  }
}

/* --------------------------------------------------------------- envelope */

interface Envelope {
  readonly version: number;
  readonly data: unknown;
}

function isEnvelope(value: unknown): value is Envelope {
  return (
    typeof value === "object" &&
    value !== null &&
    "version" in value &&
    typeof (value as { version: unknown }).version === "number" &&
    "data" in value
  );
}

/**
 * Read a slot at the current version, falling back to older versioned keys and
 * running them through the migration chain. Any failure reads as "absent".
 */
function readSlot(slot: StorageSlot): unknown {
  for (let version = STORAGE_VERSION; version >= 1; version -= 1) {
    const raw = readRaw(storageKey(slot, version));
    if (raw === null) continue;
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      continue;
    }
    if (!isEnvelope(parsed)) continue;
    const migrated = version === STORAGE_VERSION ? parsed.data : migrate(parsed.data, version);
    if (migrated !== null && migrated !== undefined) return migrated;
  }
  return null;
}

function writeSlot(slot: StorageSlot, data: unknown): void {
  const envelope: Envelope = { version: STORAGE_VERSION, data };
  try {
    writeRaw(storageKey(slot), JSON.stringify(envelope));
  } catch {
    // JSON.stringify can throw on a cyclic value; drop the write rather than crash
  }
}

/* -------------------------------------------------------------- validation */

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Structural check, deliberately shallow: enough to guarantee the fields the
 * app reads, without rejecting an attempt because an optional field is odd.
 */
function isAttempt(value: unknown): value is Attempt {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "string" &&
    typeof value.paperId === "string" &&
    typeof value.scope === "string" &&
    typeof value.startedAt === "number" &&
    isRecord(value.responses)
  );
}

function isProfile(value: unknown): value is Profile {
  if (!isRecord(value)) return false;
  return typeof value.name === "string" && typeof value.target === "number";
}

/* ----------------------------------------------------------------- attempts */

/** Every saved attempt, newest activity first. Returns [] on the server or on failure. */
export function listAttempts(): Attempt[] {
  const data = readSlot("attempts");
  if (!Array.isArray(data)) return [];
  return data.filter(isAttempt).sort((a, b) => activityAt(b) - activityAt(a));
}

function activityAt(attempt: Attempt): number {
  return attempt.finishedAt ?? attempt.startedAt;
}

/** One attempt by id, or null when it is not saved. */
export function getAttempt(id: string): Attempt | null {
  return listAttempts().find((a) => a.id === id) ?? null;
}

/** Insert or replace an attempt by id. Returns the list as persisted. */
export function saveAttempt(attempt: Attempt): Attempt[] {
  const next = listAttempts().filter((a) => a.id !== attempt.id);
  next.push(attempt);
  next.sort((a, b) => activityAt(b) - activityAt(a));
  writeSlot("attempts", next);
  return next;
}

/** Remove an attempt. Silently succeeds when the id is unknown. */
export function deleteAttempt(id: string): Attempt[] {
  const next = listAttempts().filter((a) => a.id !== id);
  writeSlot("attempts", next);
  return next;
}

/**
 * The most recent attempt for a paper at a given scope — what "resume" and
 * "compare with last time" both need. Scope must match exactly: a full mock is
 * not the previous attempt of a single reading section.
 */
export function latestAttemptFor(paperId: string, scope: AttemptScope): Attempt | null {
  return (
    listAttempts().find((a) => a.paperId === paperId && a.scope === scope) ?? null
  );
}

/* ------------------------------------------------------------------ profile */

/** The saved profile, or null. Never throws, including during SSR. */
export function getProfile(): Profile | null {
  const data = readSlot("profile");
  return isProfile(data) ? data : null;
}

export function saveProfile(profile: Profile): Profile {
  writeSlot("profile", profile);
  return profile;
}

/** Wipe everything this app owns. Used by "reset" in settings. */
export function clearAll(): void {
  for (let version = STORAGE_VERSION; version >= 1; version -= 1) {
    removeRaw(storageKey("attempts", version));
    removeRaw(storageKey("profile", version));
  }
}

/* --------------------------------------------------------------- diffing */

export interface DiffEntry {
  /** `${module}:${n}` */
  readonly key: string;
  readonly module: ModuleId;
  readonly n: number;
}

export interface AttemptDiff {
  /** wrong before, right now */
  readonly fixed: readonly DiffEntry[];
  /** right before, wrong now — the interesting set */
  readonly broken: readonly DiffEntry[];
  /** wrong both times */
  readonly stillWrong: readonly DiffEntry[];
}

/**
 * Compare two marked attempts of the same paper.
 *
 * Takes results rather than raw `Attempt`s because correctness lives on
 * `ItemResult`, not on a stored response — a saved attempt holds what was
 * typed, not whether it was right.
 *
 * Only questions present in BOTH results are compared; a question that only
 * exists in one of them says nothing about progress.
 */
export interface DiffInput {
  readonly modules: readonly ModuleResult[];
}

export function diffAttempts(before: DiffInput, after: DiffInput): AttemptDiff {
  const index = (input: DiffInput): Map<string, { entry: DiffEntry; correct: boolean }> => {
    const map = new Map<string, { entry: DiffEntry; correct: boolean }>();
    for (const module of input.modules) {
      for (const item of module.items) {
        const key = `${module.module}:${item.n}`;
        map.set(key, {
          entry: { key, module: module.module, n: item.n },
          correct: item.correct,
        });
      }
    }
    return map;
  };

  const a = index(before);
  const b = index(after);
  const fixed: DiffEntry[] = [];
  const broken: DiffEntry[] = [];
  const stillWrong: DiffEntry[] = [];

  for (const [key, now] of b) {
    const then = a.get(key);
    if (!then) continue;
    if (!then.correct && now.correct) fixed.push(now.entry);
    else if (then.correct && !now.correct) broken.push(now.entry);
    else if (!then.correct && !now.correct) stillWrong.push(now.entry);
  }

  const byPosition = (x: DiffEntry, y: DiffEntry): number =>
    x.module.localeCompare(y.module) || x.n - y.n;
  return {
    fixed: fixed.sort(byPosition),
    broken: broken.sort(byPosition),
    stillWrong: stillWrong.sort(byPosition),
  };
}
