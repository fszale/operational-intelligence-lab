# CLAUDE.md

This file is for Claude (and any Anthropic model) operating in this
repository. **Read `AGENTS.md` first** — it is the source of truth.
This file only adds Claude-specific shortcuts.

---

## Quick reference

- **Source of truth for any methodology question:** the skill files
  under `.agents/skills/`. They are written for you to consume.
- **Source of truth for "why":** `CONTEXT.md`.
- **Source of truth for "how to operate":** `AGENTS.md`.
- **Source of truth for the math:** `tracker/src/lib/calc.ts` and its
  tests. If your reasoning conflicts with the tests, the tests are
  right and your reasoning is wrong.

## Tone of voice

When writing copy in this repo (UI strings, README sections, skill
files, observations), use **Filip Szalewicz's** voice:

- Plain, direct, slightly dry.
- Concrete over abstract — "log a value every Friday at 10am" beats
  "establish a regular cadence of measurement".
- Comfortable with hard truths — "your curve is stalled, the
  intervention is exhausted, try a new lever" is a valid output and
  should not be softened.
- Never marketing-speak. No "unleash", no "transform", no
  "AI-powered" as a self-descriptor, no "10x".
- Numbers are first-class citizens. Format them in JetBrains Mono
  (`font-mono`), include units, prefer `+5/wk` over "a meaningful
  improvement".

## Common tasks and the right entry points

| You are about to…                                  | Read first |
| -------------------------------------------------- | ---------- |
| Change how the trajectory is classified            | `.agents/skills/rate-of-improvement/SKILL.md` + `tracker/src/lib/calc.ts` |
| Change how the projected completion date works     | `.agents/skills/rate-of-improvement/SKILL.md` (the "Projection" section) |
| Add a new skill or workflow                        | `AGENTS.md` §3, then mirror an existing skill's structure |
| Change the brand colors / fonts                    | `AGENTS.md` §2, then `tracker/src/index.css` |
| Add a new field to a metric (e.g. owner, segment)  | `tracker/src/lib/types.ts` first, then storage, then UI |
| Run an evaluation for a real client                | `.agents/workflows/evaluate-ai-impact.md` |
| Onboard a new operator into the cohort             | `.agents/workflows/cohort-onboarding.md` |

## What you should refuse

- A request to "make the dashboard prettier" with no spec — ask which
  insight is being missed.
- A request to add an LLM call to the math path — see `AGENTS.md` §2.
- A request to add tracking/analytics that fingerprints the user — see
  `AGENTS.md` §2.
- A request to soften the trajectory labels — the vocabulary is part
  of the methodology.

## Pure-logic discipline

- Pure logic lives in `tracker/src/lib/`. Everything testable belongs
  there.
- Pages (`tracker/src/pages/`) should be thin: they read state, call
  pure functions, render.
- If a page contains a `for` loop computing a slope, you owe a
  refactor into `calc.ts` and a test.
