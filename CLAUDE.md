# IELTS Practise — repo notes

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind v4. Front end only.

## Commands

```bash
npm run dev      # dev server, localhost:3000
npm run build    # production build — must pass clean before any push
npm run start    # serve the production build
npm run lint     # eslint
```

There is no test runner yet. `npm run build` is the gate.

## Architecture

```
src/
  app/              routes. the player is a route group with no app chrome.
  components/       shared UI. `exam/` is exam-faithful, everything else is product UI.
  lib/              engine + pure logic. no React in here.
  data/             test content as typed literals (passages, audio manifests, keys).
  types/            shared domain types.
```

The split that matters: **`lib/` is pure and testable, `app/` is presentation.** Band
scoring, the attempt state machine and the timer all live in `lib/` and take plain data
in and out. Nothing in `lib/` imports React.

## Conventions specific to this project

**Two modes, one engine.** Every test runs as either `exam` or `coach` mode. Mode is a
flag threaded through the engine, never a separate code path. If you find yourself
writing `if (coach)` in a component, the branch belongs in the engine instead.

**Exam-faithful means faithful.** Anything under `components/exam/` mimics the real
IELTS player. Do not improve it. No formatting toolbar on the writing box, no scrubber
on the listening audio, no hints in exam mode. Helpfulness there is a bug.

**Band scores are computed, never stored as truth.** Raw score → band goes through
`lib/scoring`. Rounding is the real IELTS rule (quarter up to the half, three-quarter up
to the whole) and lives in exactly one function.

**Content is data.** Passages, audio and answer keys are typed literals under `src/data/`
conforming to `src/types/`. Adding a test means adding a data file, never editing a
component.

**Colour and type come from tokens** in `globals.css`. No raw hex in components. The
three exam contrast themes are `[data-contrast]` attribute overrides on those same
tokens, so they work everywhere for free.
