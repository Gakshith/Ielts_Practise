# The real exam UI — observed, not guessed

First-hand notes from driving the three official Inspera IELTS demo players
(2026-09-10, Chromium 1440x900). Screenshots live in the project's
`artifacts/reference-inspera/`. Everything below was seen on screen or read out of
the live DOM — nothing here is inferred from documentation.

Demos used:

| Module    | assessmentRunId | Page title    |
|-----------|-----------------|---------------|
| Listening | 131012334       | Listening demo|
| Reading   | 131013388       | Reading demo  |
| Writing   | 131013741       | Writing demo  |

## Chrome that is identical across all three modules

**Header**, left to right: IELTS wordmark (red `#E31B23`-ish on white), `Test taker ID`
in bold, then a right-aligned icon cluster of four:

| Icon      | DOM name   | Purpose                                  |
|-----------|------------|------------------------------------------|
| wifi      | —          | connection status indicator, not a button |
| bell      | `Messages` | invigilator messages                     |
| hamburger | `Options`  | opens the Options screen                 |
| pencil    | `Show notes` | opens the Notes drawer                 |

The header is a thin white bar with a hairline bottom border. No timer is visible in
these demos — the demos run untimed.

**Footer**, a fixed bottom bar carrying the whole question map. The pattern is the
interesting part and it is not obvious:

- The **current part expands** to individual numbered buttons (`27 28 29 … 40`).
- **Every other part collapses** to a label plus a progress count — `Part 2  0 of 13`.

That is how 40 questions fit in one row without scrolling. Each number is a real
button whose accessible text is `Question 27 / 27 / Not attempted`, so the state
machine per item is at minimum `Not attempted | Attempted | Active`. The active item
gets a blue outlined box; everything else is plain text.

Bottom-right sits a check-mark button (go to submission). Floating above the footer on
the right are the `Previous` (grey, disabled at the start) and `Next` (black, promoted)
arrows — they float over the content, they are not in the footer bar.

**Options screen** — full-page takeover, three rows:

1. `Go to submission page` — the only red-filled row, i.e. the single promoted action
2. `Contrast` → `Black on white` (default) · `White on black` · `Yellow on black`
3. `Text size`

**Notes drawer** — right-hand panel, header `Notes` with an X. Empty state reads
*"Your private notes will show here / Select text to highlight or create a note."*
So highlight and note are one feature driven by text selection, and the drawer is
where the notes accumulate.

## Listening — the part that constrains the build

Before any audio plays, a **full-screen gate** appears over the questions: headphone
glyph, then

> You will be listening to an audio clip during this test. You will not be permitted to
> pause or rewind the audio while answering the questions.
>
> To continue, click Play.

with a single black `Play` button. Once playing, the header subtitle switches from
nothing to `🔊 Audio is Playing`. **There is no scrubber, no pause, no volume slider in
the player itself.** The audio is a one-way trip.

Crucially, while on Part 1 the footer shows `Part 2  0 of 10`, `Part 3  0 of 10`,
`Part 4  0 of 10` and those parts are **not reachable** — the gate-per-part model the
project needs is exactly what the real test does.

Question format seen: note completion with inline input boxes rendered *in the flow of
the text* (`Dining table:  -  [ 1 ]  shape`), not a separate answer column. The number
inside the box is the question number, and it is replaced by the candidate's typed
answer.

## Reading — split pane

Passage left, questions right, divided by a **draggable vertical splitter** with a `↔`
grab handle at its midpoint. Each pane scrolls independently (two scrollbars).

Unlike Listening, the other parts *are* reachable from the footer — reading is free
navigation across all three passages, which is why the real test gives one 60-minute
budget rather than three part budgets.

Question format seen: TRUE / FALSE / NOT GIVEN radio groups, question number in the
same blue outlined box when active.

## Writing — split pane, plain textarea

Prompt and stimulus image left, answer box right. The answer box is a plain bordered
rectangle with **no formatting toolbar at all** — no bold, no italic, no spellcheck
affordance. Below it, right-aligned: `Words: 0`.

The absence of a toolbar is deliberate and worth copying: it is the single most
commonly reported surprise on test day.

## What this means for our player

1. Listening gating is per-part and hard. Build it as a state machine, not a UI hint.
2. The footer question map is the primary navigation. It must carry per-item state.
3. Highlight + note is one selection-driven feature with a shared drawer.
4. Three contrast themes are a real exam feature, not an accessibility nicety we invent.
5. The writing editor must be deliberately featureless.
