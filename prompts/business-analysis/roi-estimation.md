# Prompt: ROI Estimation

## Purpose
Generate a 3-scenario ROI estimate for a proposed AI workflow deployment, suitable for presenting to business stakeholders.

## When to Use
- Week 3–4 of the Fellows curriculum
- Before the executive alignment meeting
- To justify investment in the pilot

## Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `{{business_name}}` | Name of the business | "Acme Manufacturing" |
| `{{use_case}}` | The specific AI deployment | "Automated invoice reconciliation" |
| `{{current_metric}}` | Current state of the target metric | "14 hours/week on invoice matching" |
| `{{error_rate}}` | Current error rate (if applicable) | "8 errors per 100 invoices" |
| `{{labor_cost}}` | Hourly labor cost for the process | "$35/hour fully loaded" |
| `{{error_cost}}` | Cost per error (if applicable) | "$50 per error (rework + delay)" |
| `{{pilot_cost}}` | Cost of the pilot | "$10,000" |
| `{{deployment_timeline}}` | Weeks to deployment | "2 weeks" |

## Prompt

```
You are a business analyst preparing an ROI estimate for {{business_name}}.

Proposed AI deployment: {{use_case}}

Current state:
- Target metric: {{current_metric}}
- Error rate: {{error_rate}}
- Labor cost: {{labor_cost}}
- Error cost: {{error_cost}}
- Pilot investment: {{pilot_cost}}
- Expected deployment timeline: {{deployment_timeline}}

Generate a comprehensive ROI estimate with THREE scenarios:

### 1. Conservative Scenario (High Confidence)
- Assume 30% improvement in time/efficiency
- Assume 40% reduction in errors
- Use minimum reasonable estimates

### 2. Expected Scenario (Medium Confidence)
- Assume 50% improvement in time/efficiency
- Assume 60% reduction in errors
- Based on typical AI deployment results in similar use cases

### 3. Optimistic Scenario (Lower Confidence)
- Assume 70% improvement in time/efficiency
- Assume 80% reduction in errors
- Best case based on ideal adoption and clean data

For each scenario, calculate:
1. **Weekly value**: (Hours saved × hourly rate) + (Errors prevented × error cost)
2. **12-week pilot value**: Weekly value × 12
3. **Annualized value**: Weekly value × 52
4. **ROI multiple**: Annualized value ÷ pilot cost
5. **Payback period**: Pilot cost ÷ weekly value (in weeks)

Present results in a clear comparison table.

Then provide a **recommendation paragraph** written for a non-technical business owner explaining which scenario is most likely and why the investment is or isn't justified.

End with a **risk statement**: what could cause results to fall below the conservative scenario.
```

## Expected Output

- 3-scenario comparison table with all calculated values
- Clear recommendation paragraph in plain language
- Risk statement with specific concerns
- Payback period analysis

## Tips

- Always lead with the conservative scenario in presentations
- If conservative scenario shows positive ROI, the pitch is strong
- Use actual business data wherever possible — estimates weaken credibility
