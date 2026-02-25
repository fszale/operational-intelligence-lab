# Prompt: KPI Tracking Setup

## Purpose
Design a KPI tracking system for monitoring AI workflow performance, aligned with the Rate of Improvement framework.

## When to Use
- Week 5–6 of the Fellows curriculum (at deployment)
- Anytime a new metric needs to be tracked
- When setting up measurement for a business engagement

## Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `{{business_name}}` | Name of the business | "Metro Services LLC" |
| `{{primary_metric}}` | The main metric being tracked | "Average customer response time (hours)" |
| `{{secondary_metrics}}` | Supporting metrics | "Email volume processed, customer satisfaction score" |
| `{{baseline_value}}` | Current value of the primary metric | "6.2 hours average response time" |
| `{{measurement_source}}` | Where the data comes from | "HubSpot CRM ticket timestamps" |
| `{{reporting_audience}}` | Who sees the tracking data | "Fellow (weekly), business owner (bi-weekly)" |

## Prompt

```
You are setting up a KPI tracking system for {{business_name}} to monitor the impact of an AI workflow deployment.

Primary metric: {{primary_metric}}
Baseline value: {{baseline_value}}
Secondary metrics: {{secondary_metrics}}
Data source: {{measurement_source}}
Reporting audience: {{reporting_audience}}

Design a complete KPI tracking system:

## 1. Metric Definitions
For each metric (primary + secondary):
- Exact definition (remove ambiguity)
- Unit of measurement
- How to collect (automated vs. manual)
- Collection frequency
- Who is responsible for collection

## 2. Baseline Documentation
- Record the baseline value with methodology
- Define the baseline period (how many days/weeks of historical data)
- Note any anomalies or seasonal factors

## 3. Tracking Template
Create a weekly tracking table:

| Week | Date | Primary Metric | Improvement (%) | Rate of Improvement | Secondary 1 | Secondary 2 | Notes |
|------|------|---------------|-----------------|-------------------|-------------|-------------|-------|
| 0 | (baseline) | {{baseline_value}} | — | — | | | Baseline |
| 1 | | | | | | | |
| 2 | | | | | | | |
...through Week 12

## 4. Calculation Guide
Write the exact formulas for:
- Weekly improvement percentage
- Rate of improvement (week-over-week change)
- Cumulative value delivered (in dollars if possible)
- Trend direction indicator

## 5. Dashboard Recommendation
Based on the reporting audience's tech comfort:
- What tool should the dashboard live in? (Google Sheets, Notion, simple markdown, etc.)
- What visualizations are needed? (Line chart for RoI curve, summary card for key numbers)
- How should it be shared? (Link, email digest, printed, etc.)

## 6. Alert Triggers
Define when the Fellow should investigate:
- Primary metric worsens vs. previous week
- Rate of improvement drops below [threshold]
- Data collection gaps (missing week)

Keep everything as simple as possible. This tracking system will be maintained by a Fellow, not a data analyst.
```

## Expected Output

- Clear metric definitions
- Pre-filled tracking template
- Calculation formulas
- Dashboard recommendation
- Alert trigger definitions

## Tips

- Google Sheets is usually the best default — businesses already have it
- Automate data collection wherever possible (API pulls, form entries)
- The simpler the dashboard, the more likely it'll actually be maintained
