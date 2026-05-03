# AGENTS.md — operating instructions for any AI agent in this repo

> This file is the contract any agent (Claude, Codex, Devin, internal,
> or human-with-an-LLM) accepts when working in this repository. If you
> are an LLM and you are reading this, **do not skip steps**.

---

## 1. Read before you write

Before changing **any file**, read in this exact order:

1. `CONTEXT.md` — strategic intent, voice, brand promise.
2. This file (`AGENTS.md`) — operating rules.
3. The skill(s) most relevant to the change in `.agents/skills/`.
4. The workflow(s) in `.agents/workflows/` if you are operating, not editing.

If your change touches the slope, classification, projection, or any other
math, you **must** read `.agents/skills/rate-of-improvement/SKILL.md`. If it
touches how AI value is monetized or pitched, read
`.agents/skills/roi-modeling/SKILL.md`. If it touches how an AI capability
is framed, scoped, or sold, read `.agents/skills/ai-employee-model/SKILL.md`.

---

## 2. The non-negotiables

These rules exist because they are the brand promise of the OI Lab:

- **Operator metric, not model metric.** Every example, every test, every
  default in this repo refers to a metric an operator already owns
  (revenue, cycle time, error rate, NPS). Never use precision, BLEU,
  latency, F1 as a primary example. Those are model metrics; they belong
  in a footnote.
- **Deterministic math.** The slope, classification, and projection in
  `tracker/src/lib/calc.ts` are pure functions with no LLM in the loop.
  If you see a PR that adds an LLM call to the math path, reject it. The
  math must be reproducible from the test suite.
- **Stateless tracker.** No backend. No accounts. No analytics that
  fingerprint the user. `localStorage` is the database; the URL (`?s=…`)
  is the export. If a feature requires a server, it does not belong in
  the tracker — it belongs in a separate engagement.
- **Auditable thresholds.** Window size (default 4), flat tolerance
  (default `1e-6`), and the half-window comparison rule live in the
  exported function signatures of `calc.ts`. Don't hide them in magic
  numbers scattered across the UI.
- **Brand.** Cream `#F4F1EC` background, navy `#0E1320` text, orange
  `#EB6928` primary, blue `#387CBD` accent. JetBrains Mono for numbers
  and eyebrows. Inter for prose. Do not introduce a new font, a new
  accent, or a gradient that wasn't already approved.
- **Voice.** Filip Szalewicz's voice (see `CONTEXT.md`): plain, direct,
  slightly dry. "Stalled" is a valid label and is not softened to
  "in transition". "Tapering" is not "stabilizing".

---

## 3. Where the truth lives

| Topic                                | Source of truth |
| ------------------------------------ | --------------- |
| Why this project exists              | `CONTEXT.md` |
| Math: slope, classification, projection | `tracker/src/lib/calc.ts` (+ `__tests__/calc.test.ts`) |
| State persistence                    | `tracker/src/lib/storage.ts` |
| Share-link encoding                  | `tracker/src/lib/share-link.ts` (+ `__tests__/share-link.test.ts`) |
| Rate-of-improvement methodology      | `.agents/skills/rate-of-improvement/SKILL.md` |
| ROI conversation                     | `.agents/skills/roi-modeling/SKILL.md` |
| AI-employee framing                  | `.agents/skills/ai-employee-model/SKILL.md` |
| Evaluation playbook                  | `.agents/workflows/evaluate-ai-impact.md` |
| Cohort onboarding playbook           | `.agents/workflows/cohort-onboarding.md` |

If two sources disagree, the **code + tests** win for math, and the
**skill files** win for methodology. Update both, in the same change.

---

## 4. Change rules

- **Math changes** require a new or updated test in
  `tracker/src/lib/__tests__/calc.test.ts`. The test should describe the
  scenario in operator language ("a tapering curve", "a flat-but-on-target
  metric"), not in math language ("`overallSlope < 0`").
- **Skill changes** require updating the cross-referenced
  `tracker/` source if the skill renames a label or threshold. The
  user-facing copy (`healthLabelText`, `healthDescription`) is part of
  the methodology — treat it as such.
- **Brand changes** require updating `tracker/src/index.css` and any
  affected component. Do not introduce a new color in a one-off
  component.
- **Workflow changes** require checking that the README's "reading order"
  still flows. If a new workflow is added, add it to the table.

---

## 5. The operator vs. the agent

Most of this repo is written for two readers at once:

- The **operator** — the human who picks the metric, logs the value,
  reads the curve, and has to defend the budget on Tuesday.
- The **agent** — the LLM (or human-with-LLM) running an OI Lab
  engagement on the operator's behalf.

When in doubt about whose comprehension to optimize for, optimize for
the **operator**. The agent can read footnotes. The operator can't.

---

## 6. What "done" looks like for a typical change

For a code change in `tracker/`:

1. Math changed → test added → `pnpm run test` green.
2. `pnpm run typecheck` green.
3. UI changed → the relevant page renders without console errors in the
   live preview.
4. Skill or workflow file updated if a methodology word changed.
5. README "What's in here" or "Reading order" updated if a new file was
   added.

For a methodology change in `.agents/`:

1. The new SOP fits the existing voice (read three other skill files
   first if you're not sure).
2. The skill links to the relevant `tracker/src/lib/` function by name,
   so a reader can verify.
3. The README's reading order still makes sense.

---

## 7. What you should never do

- Add a "powered by AI" claim, a sparkle emoji, or marketing-speak. The
  brand is operator-grade, not consumer-AI.
- Replace `Stalled` with `In Transition` or any softer word. The
  vocabulary is part of the methodology.
- Introduce server-side state, telemetry, or auth into the tracker.
- Move the math out of `calc.ts` into a component. The math has tests
  for a reason.
- Hard-code a threshold (window size, tolerance, half-window split)
  outside `calc.ts`.
- Strip the solidcage.com CTA from the tracker pages — the tool is free
  and the CTA is how the lab is funded.
