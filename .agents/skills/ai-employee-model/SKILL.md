---
name: ai-employee-model
description: How to scope, frame, and onboard an AI capability as if it were an employee — with a job description, an onboarding plan, and a performance review tied to a tracker metric. Use when the operator says "we want to use AI for X" and the X isn't yet a job.
---

# Skill: The AI Employee Model

The OI Lab's framing for any AI capability — agent, copilot, automation,
classifier, RAG search, anything — is: **treat it like an employee**.
Not because it is one (it isn't), but because the operating discipline
that makes humans productive is the same discipline that makes AI
productive.

A "feature" gets shipped and forgotten. An "employee" gets a job
description, a manager, a 30/60/90, and a performance review. We want
the second posture, every time.

---

## The four artifacts

For every AI capability, you produce four artifacts before any code is
written:

1. **Job description** — what this capability owns, what it does not own.
2. **Onboarding plan** — the 30/60/90 of going from launch to "fully
   ramped".
3. **Manager** — the named human accountable for its output.
4. **Performance review** — the metric in the tracker, plus the
   trajectory label that triggers a review.

If you can't write all four, the capability isn't ready to be built.
You're still in research.

---

## Artifact 1: The Job Description

A one-page document. Sections:

- **Title.** "Inbound triage agent." "Refund policy reviewer." Use a
  noun a hiring manager would post. Not "AI assistant".
- **Reports to.** The named human manager (see Artifact 3).
- **Owns.** A bulleted list of decisions, in active voice. ("Decides
  whether an inbound message is a sales lead." "Drafts the first reply
  for tier-1 support tickets.")
- **Does not own.** Equally important. ("Does not approve refunds over
  $500." "Does not contact the customer directly without human review.")
- **Inputs.** What the capability sees. ("Slack `#inbound` messages,
  CRM contact record, last 90 days of email history.")
- **Outputs.** What the capability produces. ("A draft reply in
  Notion, a label on the CRM record, a Slack ping to the manager.")
- **Failure modes.** The top 3 ways this capability is expected to be
  wrong, and what to do when it is. ("Misclassifies a partner as a
  lead → manager re-tags, agent learns from the correction.")
- **The metric it moves.** A reference to the tracker metric (e.g.
  "tracker metric: `Time-to-first-response`, decrease, baseline 4.5h,
  target 1.0h"). This is the link between the AI employee and the OI
  Lab thesis.

A job description that doesn't name a metric is a wishlist. Reject it.

---

## Artifact 2: The Onboarding Plan (30 / 60 / 90)

Treat the AI employee like a new hire. Most fail in the same way human
hires fail: thrown into the deep end, no feedback loop, no shadow
period.

**Days 0–30 — Shadow mode.**
- The capability runs but its output is not user-facing.
- All outputs go to the manager for review.
- Expected accuracy at end of period: documented.
- The tracker metric is being logged, baseline is locked.

**Days 31–60 — Suggest mode.**
- The output is user-facing as a suggestion the human can accept,
  reject, or edit.
- Acceptance rate is logged separately from the tracker metric.
- The trajectory should be `stable` or `accelerating` by day 60. If
  it's `tapering` or `stalled`, the deployment is paused for review.

**Days 61–90 — Operate mode.**
- The output ships without review on the agreed scope.
- Manager spot-checks weekly.
- The tracker metric must show meaningful improvement vs. baseline.
- If the trajectory is `stalled` or `tapering` at day 90, the
  capability is rolled back to suggest mode.

This is the loop. It is boring on purpose. Boring loops compound.

---

## Artifact 3: The Manager

A **named human**. Not a team. Not a "process". Not "the org".

The manager:

- Owns the metric in the tracker.
- Logs the check-ins (or delegates the logging — but owns the
  schedule).
- Has the authority to roll back to suggest mode, or to kill the
  capability entirely.
- Does the weekly read of the trajectory label and writes a one-line
  decision: "keep / double down / inspect / kill".

If no human will take this job, the capability does not deploy.

---

## Artifact 4: The Performance Review

The performance review is the tracker, run for at least one full
projection window (typically 90 days). At the end of the window:

- **Trajectory was `accelerating` for ≥4 of the last 8 weeks** →
  Promote: expand scope, raise the target, document the recipe.
- **Trajectory was `stable`** → Hold: the capability is paying its
  cost. Don't break it. Look for adjacent metrics it could move.
- **Trajectory was `tapering`** → Inspect: identify the bottleneck.
  Often the input distribution has shifted; sometimes the manager has
  stopped reviewing.
- **Trajectory was `stalled`** → Performance manage: 30 more days in
  suggest mode with a fresh baseline. If still stalled, kill.

This is the single most underused discipline in AI deployments. Most
capabilities ship and never get reviewed. The OI Lab's promise is that
they will.

---

## The capacity-not-features framing

Operators are sold "AI features". The OI Lab reframes those as **AI
capacity**. The question stops being "what does this product do?" and
becomes "what work does this hire off-load, and at what rate?"

This reframing has three practical effects:

1. **Budget conversations get easier.** A "refund policy reviewer"
   that off-loads 40 hours/week of senior CX time has a defensible
   value. A "GPT-4 integration" does not.
2. **Scope gets smaller.** Hiring philosophy says: hire for one job
   well, not five jobs poorly. So does this skill. Resist the urge to
   ship a capability that does five things.
3. **Failure becomes legible.** When a human hire underperforms, you
   know how to manage them. When an AI capability does, you usually
   shrug. The four artifacts above remove the shrug.

---

## What this skill is NOT about

- **Replacement of humans.** The framing is about discipline, not
  headcount. Capacity-add, almost always; replacement, rarely and
  only with a conscious decision.
- **Anthropomorphizing the model.** The "employee" framing is
  operating discipline, not philosophy. Don't put a face on it. Don't
  give it a name unless the team really wants to.
- **Generic AI strategy.** This skill applies once a *specific*
  capability is being scoped. For "should we even be doing AI?", read
  `.agents/skills/roi-modeling/SKILL.md` after you have at least one
  candidate metric in the tracker.
