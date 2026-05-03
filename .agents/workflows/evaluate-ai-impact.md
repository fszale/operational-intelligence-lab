# Workflow: Evaluate the Impact of an AI Initiative

> Use this playbook when an operator has an AI initiative running (or
> about to run) and wants a defensible read on whether it's working.
> The output is a one-page memo and a clear next decision.

---

## Prerequisites

- The operator can name the initiative in one sentence ("the inbound
  triage agent", "the cycle-time reducer in Ops").
- The operator can name **one** metric the initiative is supposed to
  move. If they can't, you're not ready for this workflow — go run
  `.agents/skills/ai-employee-model/SKILL.md` § "Job Description"
  first.
- A tracker URL (live preview or a local instance of `tracker/`).

## Step 1 — Lock the metric

**Inputs:** metric name, unit, direction (`increase` / `decrease`),
baseline, target, cadence.

Sit with the operator and fill in the **New metric** form in the
tracker. Insist on:

- A **single** metric per initiative. Multi-metric ROI conversations
  fail; pick the one that, if it moves, the operator wins.
- A **specific unit**. "Better customer experience" is not a unit.
  "Hours to first response" is.
- A **realistic target**. The target is what the operator commits to
  the CFO. Not the moonshot.
- A **cadence that matches reality**. Weekly is the default. Daily
  generates noise. Monthly is too slow to course-correct.

Save the metric. The tracker URL now has a stable `id` you can revisit.

## Step 2 — Backfill the baseline window

Before the AI initiative gets any check-ins, log **at least 4
pre-initiative check-ins** with the right historical dates. This is
your counterfactual data.

If the operator can't reconstruct 4 historical points:

- For weekly metrics, this is a small lift — pull from the BI tool, log
  the past 4 Fridays.
- For daily metrics, log the past 14 days.
- If they truly can't, document `counterfactual = 0 (assumed flat)`
  and proceed with caution.

## Step 3 — Log the initiative period

Log every cadence check-in **on schedule**. The discipline is the
deliverable.

A check-in is one number plus one sentence:

- The number: this period's reading.
- The sentence: what changed this period (intervention, anomaly,
  context, nothing).

The sentence is the most undervalued field in the tracker. It is the
diff. When the trajectory label changes, the sentences explain why.

Continue until you have at least **4 in-initiative check-ins**. Below
that, the trailing slope is too noisy to act on.

## Step 4 — Read the dashboard

After 4+ in-initiative check-ins, open the dashboard. Capture:

- **% to target.** Where on the journey.
- **Trailing slope.** How fast (signed, units/day).
- **Projected completion date.** ETA.
- **Trajectory label.** The four-state classifier.

The trajectory label drives the next step. Read
`.agents/skills/rate-of-improvement/SKILL.md` if any of the labels
isn't crystal clear.

## Step 5 — Build the ROI band

Run `.agents/skills/roi-modeling/SKILL.md` end to end. Produce the
low / mid / high band.

Use the trajectory label to condition the model:

- `accelerating` → high scenario uses the late-half slope.
- `stable` → high = mid.
- `tapering` → apply the 30% haircut.
- `stalled` → present cumulative value to date; do not project forward.
- `insufficient_data` → present a hypothesis and a re-eval date. Do
  not present a number.

## Step 6 — Write the one-page memo

The memo is short on purpose. Six sections, in this order:

1. **Initiative.** Name, owner, one-sentence description.
2. **Metric.** Tracker URL + metric name, baseline, target.
3. **Curve.** Screenshot of the dashboard, trajectory label visible.
4. **ROI band.** Low / mid / high, with the five inputs and their
   sources.
5. **Caveat.** One sentence on how the trajectory label conditioned
   the model. ("Tapering trajectory; high scenario reflects a 30%
   haircut on projected impact.")
6. **Next decision.** Keep / double down / inspect bottleneck / change
   the lever / kill. Tied to the trajectory.

A memo without a "next decision" line is not a memo. The whole point
of the workflow is to produce a decision.

## Step 7 — Schedule the next review

The trajectory label tells you when to come back:

| Label             | Next review |
| ----------------- | ----------- |
| `accelerating`    | 4 weeks. Document the recipe; protect what's working. |
| `stable`          | 4 weeks. Same dashboard. Watch for drift. |
| `tapering`        | 1–2 weeks. Inspect bottleneck. May need a new lever. |
| `stalled`         | 1 week. The next decision is usually "ship a new lever or kill". |
| `insufficient_data` | After 3 more check-ins. Don't draw conclusions yet. |

Put the review on the calendar before you leave the meeting. If the
review isn't on a calendar, it isn't happening.

---

## Anti-patterns to refuse

- **Backdating the baseline to make the curve look better.** Ship
  honest dates or don't ship the memo.
- **Reading a 2-check-in slope.** The classifier returns
  `insufficient_data` for a reason.
- **Calling a stalled trajectory "stable".** "Stable" requires a
  positive slope. The vocabulary is the methodology.
- **Promising a single ROI number instead of a band.** Models without
  bands are wrong with confidence.
- **Skipping the "next decision" line.** Without it, the memo is a
  diary entry, not an artifact.
