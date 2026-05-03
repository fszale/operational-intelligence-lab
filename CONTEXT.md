# CONTEXT.md — why this project exists

## The problem

Most "AI value" conversations happen at the wrong altitude.

Vendors talk about model accuracy, dashboards, and prompt cleverness.
Operators talk about cycle time, cost-to-serve, conversion, error rate,
NPS, churn. These are not the same currency. So the conversation goes
in circles, the operator hires the vendor, six months later there's a
beautiful demo and no movement on the metric the operator was actually
hired to improve.

The Operational Intelligence Lab exists to break that loop, in the
plainest possible way:

> The only honest measure of AI value is whether the operator's chosen
> business metric is improving, and **at what rate**.

Not the model metric. The operator's metric. And not "did it improve
once" — at what rate is it improving, week over week, and is that rate
accelerating, stable, tapering, or stalled?

The thesis is one sentence: **rate of improvement is everything.**

## The audience

The OI Lab and this tracker are built for one of three personas:

1. **The operator-VP / department head.** Owns a P&L line or a process,
   has been told to "have an AI plan", needs a way to know whether the
   plan is working that doesn't depend on the vendor's slide deck.
2. **The internal champion / staff engineer.** Has prototyped something,
   needs a defensible week-over-week record of impact to bring to the
   next steering committee.
3. **The fractional-CTO / advisor.** Runs short engagements, wants a
   shared vocabulary and a free tool they can hand a client without
   asking them to create an account.

All three want the same thing: a deterministic, opinionated reading of
"is it working, and how fast".

## The brand promise

- **No signup. Ever.** The moment a visitor sees an email gate, the
  tool has failed.
- **No bullshit.** "Stalled" is a valid label. "Tapering" is a valid
  label. The tool refuses to tell you you're winning when you're not.
- **Auditable.** Every threshold, weight, and classifier rule is in the
  repo, in `tracker/src/lib/calc.ts`, with a test next to it. If you
  disagree with the methodology, you can point at the line.
- **Operator-first vocabulary.** Slope is "rate". Linear regression is
  "trailing 4-period fit". The labels are English: Accelerating,
  Stable, Tapering, Stalled.
- **Five minutes to the first reading.** Set up a metric in two
  minutes. Log a value in thirty seconds. The dashboard is one click
  from either.

## The voice

Filip Szalewicz's voice. Plain, direct, slightly dry. The OI Lab is
not in the business of impressing anyone with adjectives.

- ✅ "Your curve is tapering. The intervention is losing its edge.
  Inspect the bottleneck or change the lever."
- ❌ "We're seeing some really exciting deceleration patterns that
  represent a transformative opportunity to leverage next-gen AI
  synergies."

If a sentence sounds like it could appear in a vendor's keynote, delete
it.

## Why "rate of improvement" specifically

Two reasons.

**Reason one: it survives the noise.** A single weekly reading is noisy
— promo this week, holiday next week, a single big customer churning.
The rate (the slope across the trailing window) integrates the noise.
You can be fooled by a snapshot. You can't be fooled, for long, by a
trend.

**Reason two: it forces the right next move.** Each label has a
prescribed action:

- **Accelerating** → find what changed in the last cycle and protect
  it. Document the intervention. Don't break what's working.
- **Stable** → ask whether stable-improving is enough to hit the
  target by the deadline. If yes, hold. If no, find a new lever.
- **Tapering** → the intervention is losing its edge. Inspect the
  bottleneck. Diminishing returns is a real signal.
- **Stalled** → the intervention is exhausted. Ship a new one. Stop
  pretending the dashboard is "stabilizing".

A snapshot answers "are we winning?". A rate answers "what should we
do next?". The OI Lab is in the business of the second question.

## What this project is not

- It is **not** a generic analytics tool. There is no segmentation, no
  cohort splits, no SQL. The whole point is the operator picks **one
  metric per AI initiative** and reads the curve.
- It is **not** an AI product. There is no LLM in the math path. The
  methodology is the product; the tracker makes the methodology
  visible.
- It is **not** a CRM, a project tracker, or a roadmap tool. If the
  operator already has those, great. The tracker sits next to them and
  answers a different question.
- It is **not** a sales funnel for solidcage.com. It is a tool. The
  CTA exists because the lab is funded, but the tool works fully
  without ever clicking it.
