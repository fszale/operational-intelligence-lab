# Operational Intelligence Lab

> A working repository — methodology, tools, and source — by **Filip Szalewicz** at [solidcage.com](https://solidcage.com).
> The thesis: **rate of improvement is everything.**

**Live demo:** `<DEPLOY_URL>/oi-tracker/` (Replit Deployment — replace `<DEPLOY_URL>` with the live `*.replit.app` host from the project's Publishing tool, or a configured custom domain such as `solidcage.com`). The OI Tracker ships alongside the [Digital Twin Factory Demo Portal](https://github.com/fszale/digital-twin-factory) at `<DEPLOY_URL>/twin-portal/` and the [Agent ROI Generator](https://github.com/fszale/agent-roi-generator) at `<DEPLOY_URL>/agent-roi-generator/`.

**Production landing:** [solidcage.com](https://solidcage.com) — for the people who hire the OI Lab.

This repository is two things at once:

1. The **methodology** of the Operational Intelligence Lab — how I think about
   AI deployment when the goal is operator-owned business improvement, not
   model leaderboards.
2. The **source** for the public Rate-of-Improvement Tracker, the tool I use
   to make that methodology measurable.

Everything in here is auditable: the math, the heuristics, the brand voice,
the prompts, the SOPs. If you disagree with any of it, you can point at the
line.

---

## What's in here

| Path                              | Purpose |
| --------------------------------- | ------- |
| `tracker/`                        | The React + Vite source for the live Rate-of-Improvement Tracker (mirror of `artifacts/oi-tracker/`). |
| `AGENTS.md`                       | Top-level operating instructions for any AI agent (Claude, Codex, Devin, internal) working in this repo. |
| `CLAUDE.md`                       | Claude-specific shortcuts, redirecting to `AGENTS.md`. |
| `CONTEXT.md`                      | The "why" — the thesis, the audience, the brand promise. |
| `.agents/skills/`                 | Reusable skills (markdown SOPs) for the three core ideas: rate-of-improvement, ROI modeling, the AI-employee model. |
| `.agents/workflows/`              | Step-by-step playbooks: evaluating AI impact on a metric, onboarding a new operator cohort. |

---

## The thesis in 60 seconds

Most "AI value" conversations happen at the wrong altitude. Vendors talk about
model accuracy, dashboards, and prompt cleverness. Operators talk about cycle
time, cost-to-serve, conversion, error rate. These are not the same currency.

The OI Lab's operating belief is this:

> The **only** honest measure of AI value is whether the operator's chosen
> business metric is improving, and at what rate.

Not the model's metric. The operator's. And not "did it improve once" — at
what rate is it improving, week over week, and is that rate accelerating,
stable, tapering, or stalled?

Everything in this repo serves that thesis:

- The **rate-of-improvement skill** describes the math (slope, half-window
  comparison, classification thresholds).
- The **ROI modeling skill** describes how I translate a rate-of-improvement
  curve into a defensible dollar number for a budget meeting.
- The **AI-employee model skill** describes how I think about AI as a
  capacity-add — an "employee" with a job description, an onboarding plan,
  and a performance review — rather than a tool to be installed.
- The **tracker** makes it operational. Pick a metric. Log it weekly. Read
  the curve.

---

## The Rate-of-Improvement Tracker

A free, no-login, browser-only tool. The data lives in `localStorage`. The
share link lives in the URL.

### What it does

- Define a metric: name, baseline, target, direction (higher- or
  lower-is-better), cadence.
- Log a value on the cadence — past dates accepted, late check-ins won't
  corrupt the curve.
- Read the dashboard:
  - Cumulative value plotted with target + baseline reference lines.
  - Period-over-period rate of change as a secondary axis.
  - **% to target**, **trailing slope** (linear regression over last 4
    check-ins, in units/day), **projected completion date**, and a
    **trajectory label**: Accelerating / Stable / Tapering / Stalled / Need
    more data.
- Copy a shareable URL — the entire state is encoded into the URL via
  base64-url + pako gzip. No backend involved.

### How it's built

- React + Vite, TypeScript strict.
- shadcn/ui components, Tailwind v4, brand-matched (`#F4F1EC` / `#0E1320` /
  `#EB6928` / `#387CBD`, Inter + JetBrains Mono).
- Recharts for the dual-series curve.
- All math in `tracker/src/lib/calc.ts`. All state I/O in
  `tracker/src/lib/storage.ts`. All sharing in
  `tracker/src/lib/share-link.ts`.
- 34 vitest unit tests covering slope, classification, projection, and
  encode/decode round-trips.

### Run it locally

```bash
cd tracker
pnpm install
pnpm run dev
```

Open the URL printed by Vite. To run the tests:

```bash
pnpm run test
```

To typecheck:

```bash
pnpm run typecheck
```

---

## Reading order for new contributors (and agents)

1. `CONTEXT.md` — why this project exists, what voice it speaks in.
2. `AGENTS.md` — the operating contract for anyone making changes.
3. `.agents/skills/rate-of-improvement/SKILL.md` — the math.
4. `.agents/skills/roi-modeling/SKILL.md` — how to translate that math into
   a budget conversation.
5. `.agents/skills/ai-employee-model/SKILL.md` — how to think about
   capacity, not features.
6. `.agents/workflows/evaluate-ai-impact.md` — the SOP for an evaluation
   engagement.
7. `.agents/workflows/cohort-onboarding.md` — the SOP for onboarding a
   new operator into the OI Lab cohort.
8. `tracker/src/lib/calc.ts` — the source of truth for the math.

---

## Talk to Filip

If your team needs help bending the curve — defining the right metric,
running the evaluation, picking the first AI capacity to add — that's
what the Operational Intelligence Lab does.

→ **[solidcage.com](https://solidcage.com)** — start your AI improvement
journey.

---

## License + posture

The tracker source is published as-is for inspection and learning. The
methodology is an operating practice, not a product — copy what's useful,
attribute what's borrowed.
