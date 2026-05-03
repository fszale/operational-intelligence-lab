# Workflow: Onboard an Operator into the OI Lab Cohort

> Use this playbook the first time an operator joins the Operational
> Intelligence Lab cohort. The output is a working tracker, a defined
> AI initiative, a named manager, and a calendar review cadence — all
> in under one week.

---

## Prerequisites

- Operator has read `CONTEXT.md` and accepts the thesis ("rate of
  improvement is everything").
- Operator can name **one** business metric they own and want to move.
  If they can't, the cohort isn't the right fit yet — recommend they
  spend two weeks on metric selection before joining.
- A scheduled 60-minute kick-off call.

---

## Day 0 — Kick-off call (60 min)

### First 15 min: thesis and posture

- Walk the operator through the thesis: rate-of-improvement is the
  honest measure, snapshots lie.
- Show the tracker live. Demo the four trajectory labels. Show the
  share link.
- Set the cadence expectation: one weekly check-in, one weekly
  five-minute read of the dashboard, one monthly memo.

### Middle 30 min: metric selection

Run a structured selection — not a brainstorm.

Ask, in this exact order:

1. "What's a P&L line you own that you've been told to improve this
   quarter?"
2. "What's the metric your team already reports against it?"
3. "Is higher better, or lower better?"
4. "What's today's number?"
5. "What number would make you raise a glass at the end of the
   quarter?"
6. "Could you log this number once a week without asking anyone for
   permission?"

If any answer is fuzzy, do not move on. Park the metric, pick a
different one. The wrong metric burns the whole engagement.

### Last 15 min: setup

- Open the tracker. Create the metric live, in the operator's
  presence. Log the first check-in (today's number).
- Backfill 4+ historical check-ins if the data exists.
- Save the share link in the operator's calendar invite for the
  weekly review.

**Outcome of Day 0:** The operator leaves with a live tracker, one
metric, one historical baseline, and a recurring calendar invite.

---

## Day 1–2 — AI initiative scoping

### Job description

Schedule a 45-minute working session with the operator. Together,
write the AI capability's **job description** per
`.agents/skills/ai-employee-model/SKILL.md` § "Artifact 1".

The job description must reference the tracker metric created on
Day 0. If the capability does not credibly move that metric, you have
the wrong capability or the wrong metric. Do not paper over the gap.

### Manager assignment

Identify the named human manager (see SKILL § "Artifact 3"). Get them
on a 15-minute call. Confirm:

- They own the tracker metric.
- They will log (or supervise the logging of) check-ins on cadence.
- They have authority to roll back the capability or kill it.

If no manager will sign up, **stop**. Do not proceed to building.

---

## Day 3–5 — Onboarding plan and shadow mode

### Write the 30/60/90

Per `.agents/skills/ai-employee-model/SKILL.md` § "Artifact 2":

- Days 0–30: Shadow mode. Output goes to manager only. Tracker
  baseline is locked.
- Days 31–60: Suggest mode. User-facing as suggestions.
- Days 61–90: Operate mode. Ships without review on the agreed scope.

Put each transition on the manager's calendar. Each transition is
gated on the trajectory label — if the curve doesn't behave, the
transition is delayed.

### Start shadow mode

Whatever it takes to get the capability running with output going to
the manager. Often this is a Zapier + spreadsheet on day one and a
real integration by day 30. Ship the cheap version first.

---

## Day 6 — First weekly review (templated)

Five minutes. Same five questions every week:

1. What's the trailing slope?
2. What's the trajectory label?
3. What changed this week (the check-in note)?
4. Does the projected date still hit the deadline?
5. What's the next decision?

If the operator can run this five-minute review without you by week 4,
the onboarding has worked. If they can't, double the cadence of your
own check-ins until they can.

---

## Day 7 — Cohort artifact

Add the operator to the cohort by sharing:

- The tracker URL (state-encoded share link).
- The job description.
- The 30/60/90.
- The named manager's contact.
- The first weekly review note.

The cohort sees these. Cross-pollination across operators is one of
the highest-leverage parts of the OI Lab — peer feedback on a
trajectory is often more useful than vendor feedback on a model.

---

## What "successful onboarding" looks like at day 30

- The metric has 4+ in-initiative check-ins.
- The trajectory label is `stable` or `accelerating` (or
  `insufficient_data` with a clear data plan).
- The manager owns the weekly review without prompting.
- The shadow→suggest transition has happened or has a clear ship
  date.
- A first one-page memo has been written and shared.

If any of these is missing at day 30, the onboarding is not done —
extend it by two weeks rather than declaring victory.

---

## Anti-patterns to refuse

- **"Let's track three metrics to be safe."** No. One metric per
  initiative. The discipline is the deliverable.
- **"The manager will be the team."** No. Pick a name.
- **"We'll backfill the baseline next week."** No, today. Without a
  baseline, the slope is meaningless.
- **"Let's skip shadow mode and ship to users."** Almost never. Shadow
  mode is the cheapest insurance you'll ever buy.
- **"We'll review monthly."** Monthly is fine for the memo. The
  read of the dashboard is weekly. This is non-negotiable.
