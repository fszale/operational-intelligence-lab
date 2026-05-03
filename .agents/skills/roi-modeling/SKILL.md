---
name: roi-modeling
description: How to translate a rate-of-improvement curve into a defensible dollar number for a budget meeting. Use when an operator asks "what is this AI initiative worth?" and you have at least 4 weeks of tracker data.
---

# Skill: ROI Modeling

This skill is for the moment the operator turns to you and says
"the curve looks good — what do I tell the CFO?". This is not a
spreadsheet template. It's the **discipline** that turns a slope into
a number you'd be willing to defend in a board meeting.

---

## The model in one paragraph

For each tracked metric, compute the **per-period improvement
attributable to the initiative**, multiply by the **dollar value of one
unit of improvement**, multiply by the **periods over the projection
window**, then subtract the **initiative cost**. The result is a
**defensible band**, not a point estimate. Always present a low / mid /
high.

---

## The five inputs

You need exactly five inputs to model ROI. If you can't get all five,
you don't have an ROI model — you have a wish.

| Input                          | What it is | Where it comes from |
| ------------------------------ | ---------- | ------------------- |
| **Slope**                      | Trailing slope from `calc.trailingSlope`, in units/day. | The tracker. |
| **Counterfactual slope**       | What the slope would have been without the initiative. | Pre-initiative period in the same metric, OR a control period from history, OR a peer benchmark. |
| **Unit value**                 | Dollar value of one unit of the metric (one extra lead, one fewer hour of cycle time). | The operator's finance team — never make this up. |
| **Window**                     | The horizon over which you're claiming impact, in days. | Usually 90 or 365. Match the budget cycle. |
| **All-in cost**                | Vendor + internal time + tooling, summed over the window. | The operator's procurement / time tracking. |

---

## The math

```
attributable_slope_per_day  = slope − counterfactual_slope
attributable_units          = attributable_slope_per_day × window_days
gross_value                 = attributable_units × unit_value
roi                         = (gross_value − all_in_cost) / all_in_cost
payback_days                = all_in_cost / (attributable_slope_per_day × unit_value)
```

All quantities are signed. A negative `attributable_slope` means the
initiative is *underperforming the counterfactual* — and the ROI
conversation should reflect that.

---

## The low / mid / high band

Never present a single number. The slope has noise; the unit value has
finance-team uncertainty; the counterfactual is an opinion. Present:

| Scenario | How |
| -------- | --- |
| **Low**  | Use the slope from the *earlier half* of the trailing window (slower fit). Use the most conservative unit value (often "fully loaded" cost savings rather than "marginal" revenue). |
| **Mid**  | Use the trailing slope. Use the most-cited unit value. |
| **High** | Use the slope from the *later half* of the trailing window IF the trajectory is `accelerating`. Use the optimistic unit value. |

If the trajectory is `tapering` or `stalled`, the **high** scenario
should *not* exceed the **mid** scenario — you don't get to claim
upside on a curve that's losing momentum. This is non-negotiable. It is
the OI Lab's commitment to honest math.

---

## Reading the trajectory into the model

The trajectory label from `calc.classifyHealth` directly conditions
the model:

| Trajectory       | What the model does |
| ---------------- | ------------------- |
| `accelerating`   | Use the late-half slope for the High scenario. Project across the full window. |
| `stable`         | Use the trailing slope. High = mid. |
| `tapering`       | Use the trailing slope. **Apply a 30% haircut** to the projected impact across the window — the curve is losing momentum and a flat extrapolation overstates value. |
| `stalled`        | Project zero attributable value past today. Document the cumulative value to date. Recommend killing or changing the initiative. |
| `insufficient_data` | **Do not present an ROI number.** Present a hypothesis with a re-evaluation date. |

The "30% haircut" is a heuristic, not a derivation. It exists to make
the model behave honestly when the slope is decelerating but the
operator hasn't realized it yet. If you have a better-grounded haircut
for a specific industry, document it in this skill before applying it.

---

## The counterfactual problem

The counterfactual slope is the single hardest input. Pick the best
available source in this order:

1. **Pre-initiative slope, same metric.** Compute the slope from a
   trailing window of the same metric *before* the initiative started.
   Best when you have at least 4 pre-initiative check-ins.
2. **Same metric, prior comparable period.** Same quarter last year,
   same season. Useful for highly seasonal metrics.
3. **Peer benchmark.** A defensible industry rate-of-change. Cite the
   source.
4. **Zero (default).** Assume the metric would have stayed flat. This
   is the most generous-to-the-initiative counterfactual; flag it
   explicitly when you use it.

Always tell the operator which counterfactual you used. The choice
moves the model materially.

---

## What a defensible output looks like

A one-page ROI memo, in this order:

1. **The metric** — name, baseline, target, direction, cadence.
2. **The curve** — a screenshot of the tracker dashboard with the
   trajectory label visible.
3. **The five inputs** — table form, each with its source.
4. **The three scenarios** — low / mid / high, with attributable
   units, gross value, ROI, and payback days.
5. **The trajectory caveat** — one sentence explaining how the
   trajectory label conditioned the model.
6. **The next decision** — keep, double down, change the lever, or
   kill. Tied to the trajectory label.

If any of these six sections is missing, the memo is not a memo, it's
a vibe.

---

## What this skill is NOT about

- **Vendor selection.** ROI modeling is the *output* of the
  evaluation, not the input. Use this skill on an initiative that's
  already running.
- **NPV / DCF.** If the operator's CFO needs net present value, hand
  the band to them — they'll discount it. Don't pretend you know their
  WACC.
- **Soft value.** Brand lift, employee satisfaction, "strategic
  optionality" — all real, all out of scope here. Tracker metrics are
  hard numbers. Soft value is a separate conversation.
