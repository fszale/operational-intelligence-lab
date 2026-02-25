# Prompt: Rate of Improvement Analysis

## Purpose
Analyze collected Rate of Improvement data to determine whether an AI deployment is succeeding, identify patterns, and generate insights for reporting.

## When to Use
- Week 7–8 of the Fellows curriculum (mid-point analysis)
- Week 11–12 (final analysis)
- Anytime you have 4+ weeks of tracking data

## Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `{{business_name}}` | Name of the business | "Acme Manufacturing" |
| `{{metric_name}}` | The metric being tracked | "Hours/week on invoice reconciliation" |
| `{{baseline}}` | Baseline value | "14 hours/week" |
| `{{weekly_data}}` | Weekly metric values | "W1: 14, W2: 12, W3: 9, W4: 7, W5: 6.5, W6: 5.5, W7: 5, W8: 5" |
| `{{target}}` | Target value (if set) | "Under 4 hours/week" |
| `{{context_notes}}` | Any relevant context | "Staff training completed W2, workflow v2 deployed W5" |

## Prompt

```
You are analyzing Rate of Improvement data for an AI workflow deployment at {{business_name}}.

Metric: {{metric_name}}
Baseline: {{baseline}}
Target: {{target}}
Weekly data: {{weekly_data}}
Context: {{context_notes}}

Perform a comprehensive Rate of Improvement analysis:

## 1. Data Summary
- Calculate improvement percentage for each week vs. baseline
- Calculate rate of improvement (week-over-week change in improvement %)
- Determine overall improvement from baseline to latest

## 2. Curve Shape Analysis
Classify the curve into one of these patterns:
- ✅ **S-Curve (Success)**: Rapid rise → taper → stabilization
- ⚠️ **Rise-Decline**: Improvement followed by regression
- ❌ **Flat**: No meaningful improvement
- 🔍 **Unbounded Rise**: Continuous improvement without taper (investigate measurement)

Explain WHY the data shows this pattern.

## 3. Inflection Points
Identify any significant changes in trajectory:
- When did improvement accelerate?
- When did it start tapering?
- Do any inflection points correlate with {{context_notes}} events?

## 4. Statistical Fit
- Fit a logistic/sigmoid curve to the data
- Report the goodness of fit (R² equivalent)
- Estimate the ultimate stable value (asymptote) if the trend continues

## 5. Projection
- If current trajectory continues, what will the metric be at Week 12? Week 24? Week 52?
- Is the current pace sustainable?
- Has the improvement plateau been reached?

## 6. Executive Summary
Write a 3-sentence summary suitable for presenting to the business owner:
- What happened (plain language)
- What it's worth (dollar value if calculable)
- What to do next

## 7. Thesis Validation
Does this data support or challenge the Rate of Improvement thesis?
- Expected pattern: rapid initial improvement → taper → stabilization
- Actual pattern: [describe]
- Thesis verdict: Supported / Partially Supported / Challenged
- Reasoning: [explain]
```

## Expected Output

- Weekly data table with calculated improvement rates
- Curve classification with reasoning
- Inflection point analysis
- Statistical fit results
- Projections
- Executive summary (3 sentences)
- Thesis validation verdict

## Tips

- Feed in as much context as possible — deployment changes, staff events, and process modifications all matter
- Run this prompt at Week 8 (mid-point) and again at Week 12 (final)
- Compare results across multiple businesses to validate the thesis at portfolio level
