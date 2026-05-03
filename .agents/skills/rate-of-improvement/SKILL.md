---
name: rate-of-improvement
description: How the trailing slope, trajectory classification, and projected completion are computed. Read this before changing tracker/src/lib/calc.ts or any UI label that names a trajectory state.
---

# Skill: Rate of Improvement

This skill documents **how the curve is read**. It is the heart of the
OI Lab thesis. The math here must stay reproducible from
`tracker/src/lib/__tests__/calc.test.ts` — if a number on the dashboard
does not match the test, the dashboard is wrong.

---

## Vocabulary

| Term                  | Meaning |
| --------------------- | ------- |
| **Direction**         | Either `increase` (higher is better) or `decrease` (lower is better). Set per metric. |
| **Improvement**       | Signed distance from baseline, normalized to direction. For increase metrics: `value − baseline`. For decrease: `baseline − value`. Always positive when "moving toward target". |
| **Distance**          | `target − baseline` for increase, `baseline − target` for decrease. The total ground to cover. |
| **% to target**       | `improvement(last) / distance × 100`. Can exceed 100 (overshot) or go negative (regressed). |
| **Trailing slope**    | Linear-regression slope across the last `windowSize` (default 4) check-ins, in **signed-improvement units per day**. Positive = improving. |
| **Trajectory label**  | One of: `accelerating`, `stable`, `tapering`, `stalled`, `insufficient_data`. |
| **Projected date**    | The ISO date when the metric is expected to hit `target` if the current slope holds. `null` when not projectable. |

All of the above are exported from `tracker/src/lib/calc.ts`.

---

## The trailing slope

Implementation: `trailingSlope(metric, window = 4)`.

- We take the last `window` check-ins (minimum 2).
- We compute days-since-first-point on the x-axis (so cadence doesn't
  matter — a daily metric and a weekly metric both yield "units/day").
- We fit a least-squares line to `(daysSinceFirst, signed-improvement)`.
- We return the slope.

### Why units/day, not units/period?

Two reasons.

1. **Cadence flexibility.** An operator may switch from weekly to
   bi-weekly partway through. The slope stays comparable.
2. **Honest projection.** The projected completion date needs days, not
   periods. Computing the slope in days/unit avoids a conversion step.

### Edge cases (and what to return)

| Situation                             | Return |
| ------------------------------------- | ------ |
| Fewer than 2 check-ins                | `null` |
| All check-ins on the same date        | `null` (zero variance in x) |
| Perfectly flat series                 | `0` (technically `~0`) |
| Negative trend                        | A negative number — do NOT clamp |

The classifier handles these cases — `trailingSlope` should be
mechanical and honest.

---

## The trajectory classifier

Implementation: `classifyHealth(metric, windowSize = 4, flatTolerance = 1e-6)`.

```
if checkIns.length < 3                                  → "insufficient_data"
overall = trailingSlope(metric, windowSize)
if overall is null                                      → "insufficient_data"
if |overall| ≤ flatTolerance:
    if last value reaches target                        → "stable"
    else                                                → "stalled"
if overall < 0                                          → "tapering"
# overall > flatTolerance: improving — accelerating or tapering?
split window into two halves (overlapping by 1)
earlySlope = trailingSlope(earlier_half)
lateSlope  = trailingSlope(later_half)
if either is null                                       → "stable"
delta = lateSlope − earlySlope
if |delta| ≤ flatTolerance                              → "stable"
if delta > 0                                            → "accelerating"
else                                                    → "tapering"
```

### Why a half-window comparison?

Because "is the rate improving?" needs *two* rates to compare. A single
trailing slope tells you whether you're going up. Comparing the early
half to the late half tells you whether the *rate of going up* is
itself going up.

### Why `1e-6` for tolerance?

It's a numerical sanity guard, not a business knob. At the scales
operators use (revenue in dollars, cycle time in hours, percent
conversion), `1e-6` is "indistinguishable from zero". If you find a
plausible operator metric where this matters, write a test before
changing the constant.

### Why the `accelerating` branch requires the *overall* slope to be positive

Because "the rate is accelerating downward" is a regression, not an
improvement. We classify net regression as `tapering` — the operator
needs to act, regardless of whether the regression is steepening.

### What `insufficient_data` means

Fewer than 3 check-ins, or the math returned `null`. This is a real
state and it's labeled honestly. Do **not** return `stable` as a
default — silently classifying noise as success is exactly what the OI
Lab refuses to do.

---

## The projection

Implementation: `projectedCompletionDate(metric, windowSize = 4)`.

- Slope must be `> 0` (positive improvement).
- Remaining distance must be `> 0` (not yet at target).
- `daysToGo = remaining / slope`
- `projectedDate = lastCheckInDate + daysToGo`
- Returned as `YYYY-MM-DD`.

### Why we don't project a regression

Because "you'll regress to zero in 47 days" is not a useful operator
output. If the slope is non-positive or the target has been passed, we
return `null` and the UI shows `—`.

### Why we use the last check-in date as the anchor, not "today"

So that a weekend without check-ins doesn't quietly push the projection
out. The projection answers: "at the current rate, from your last
known reading, when do you cross the target?".

---

## Reading the dashboard

The dashboard shows four summary numbers, in this order:

1. **% to target** — where you are along the journey.
2. **Trailing slope** — how fast you're moving (signed, units/day).
3. **Projected to hit target** — the ETA, or `—`.
4. **Trajectory label** — what the rate of the rate is doing.

The chart shows two series:

- The **value** as a filled area on the left axis, with `target` and
  `baseline` reference lines.
- The **period rate** (per-checkin delta of signed improvement) as a
  line on the right axis, with a faint shaded "acceleration band" in
  the same color.

If the line on the right axis is rising, the rate is accelerating.
If it's falling but above zero, you're tapering. If it's at zero,
you're stalled. The picture matches the label.

---

## Operator next-moves per label

Pin this to the dashboard in the operator's mind:

- **Accelerating** → find what changed in the last cycle. Protect it.
  Document it. Don't break what's working.
- **Stable** → check whether the projected date hits the deadline. If
  yes, hold. If no, find a new lever — stable isn't enough.
- **Tapering** → the intervention is losing its edge. Inspect the
  bottleneck. Diminishing returns is a real signal.
- **Stalled** → the intervention is exhausted. Ship a new one. Stop
  pretending the dashboard is "stabilizing".
- **Need more data** → log three more weeks before drawing
  conclusions.

---

## Things this skill is NOT about

- Anomaly detection. A single bad week is not a "tapering" event by
  itself; the trailing-window math handles it.
- Forecasting beyond linear extrapolation. We are not running ARIMA.
  Operators want "by Friday or not", not "with 95% confidence
  intervals".
- Multi-metric correlation. Each metric is read independently. If you
  need cross-metric reasoning, that's an OI Lab engagement, not a
  tracker feature.
