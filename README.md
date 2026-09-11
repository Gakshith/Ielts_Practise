# IELTS Practise

A practice platform for the computer-delivered IELTS test.

Two things you can do with it:

- **Take a full mock test** — Listening, Reading, Writing and Speaking back to back,
  in order, under real timing, the way the actual test runs.
- **Practise one section** — just Listening, or just Reading, when you want to drill a
  single skill.

Afterwards you get a band score for each module, an overall band computed with the real
IELTS rounding rule, and a written report on what to fix.

## Why it looks the way it does

The test player deliberately imitates the real computer-delivered IELTS interface —
the same footer question map, the same split-pane reading layout, the same
featureless writing box, the same three contrast themes, and the same rule that
Listening audio plays once and cannot be paused or rewound.

That is the point. Practising in a friendlier interface teaches habits that fail on
test day. Everything *around* the test — the dashboard, your profile, the results — is
a normal, modern product.

`docs/exam-ui-reference.md` records what the real interface does, observed directly
from the official demo players rather than from memory.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
```

## Status

Front end only. There is no backend yet: attempts and profiles live in the browser.
Reading passages and Listening audio are placeholders pending real content, and the
Speaking examiner is stubbed pending a voice API.
