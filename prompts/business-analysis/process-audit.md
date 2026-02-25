# Prompt: Process Audit

## Purpose
Analyze a business process end-to-end to identify automation opportunities, inefficiencies, and data flow patterns.

## When to Use
- Week 1–2 of the Fellows curriculum
- Phase 1 of the Business track
- Anytime you need to map and understand a business process before designing an AI solution

## Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `{{business_name}}` | Name of the business | "Acme Manufacturing" |
| `{{process_name}}` | The process being audited | "Invoice reconciliation" |
| `{{process_description}}` | Brief description of what the process does | "Matching purchase orders to invoices and verifying amounts" |
| `{{staff_involved}}` | Roles involved in this process | "AP clerk, department managers, CFO" |
| `{{frequency}}` | How often this process runs | "200 invoices/week" |
| `{{known_pain_points}}` | Any issues the business has already identified | "Takes 14 hours/week, frequent errors cause payment delays" |

## Prompt

```
You are an operational analyst conducting a process audit for {{business_name}}.

The process being audited is: {{process_name}}
Description: {{process_description}}
Staff involved: {{staff_involved}}
Frequency: {{frequency}}
Known pain points: {{known_pain_points}}

Perform a comprehensive process audit by analyzing the following dimensions:

1. **Process Map**: Break down the process into sequential steps. For each step, identify:
   - What happens
   - Who does it
   - Estimated time per occurrence
   - Tools/systems used
   - Data inputs and outputs

2. **Bottleneck Analysis**: Identify steps where:
   - Time accumulates disproportionately
   - Errors are most likely
   - Manual effort is highest relative to value
   - Handoffs between people/systems occur

3. **Automation Opportunity Assessment**: For each bottleneck, evaluate:
   - Could AI handle this step? (Yes/Partial/No)
   - What type of AI capability is needed? (Classification, generation, extraction, prediction, etc.)
   - What data would the AI need access to?
   - What is the estimated time savings?

4. **Risk Factors**: Identify any risks or concerns:
   - Data quality issues
   - Regulatory/compliance constraints
   - Staff resistance potential
   - Integration complexity

5. **Recommendation**: Rank the top 3 automation opportunities by impact and feasibility.

Format your response as a structured report with clear sections and tables where appropriate.
```

## Expected Output

A structured report containing:
- Step-by-step process map with time and role annotations
- Bottleneck heat map (table format)
- Ranked automation opportunities with feasibility scores
- Risk register
- Top 3 recommendations with rationale

## Tips

- Run this prompt with the Fellow's Shadow Walk notes as additional context
- Feed in any existing process documentation the business provides
- Re-run after deployment to compare before/after process maps
