# Prompt: Bottleneck Identification

## Purpose
Systematically identify and rank operational bottlenecks in a business process, scoring each for AI automation potential.

## When to Use
- After completing a process audit (Shadow Walk)
- When you have raw observations but need structured analysis
- To prioritize which problems to solve first

## Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `{{business_name}}` | Name of the business | "Metro Services LLC" |
| `{{process_observations}}` | Raw notes from process observation | (paste Shadow Walk notes) |
| `{{business_context}}` | Industry, size, tech maturity | "B2B service company, 25 employees, uses QuickBooks + Gmail" |
| `{{owner_priorities}}` | What the business owner cares about most | "Reducing time spent on scheduling and customer follow-ups" |

## Prompt

```
You are an operational bottleneck analyst working with {{business_name}}.

Business context: {{business_context}}
Owner's stated priorities: {{owner_priorities}}

Below are raw observations from a process walkthrough:

{{process_observations}}

Analyze these observations and identify ALL operational bottlenecks. For each bottleneck:

1. **Name it**: Give a clear, concise label
2. **Describe it**: What's happening and why it's a problem
3. **Quantify it**: Estimate time consumed (hours/week), error frequency, and cost impact
4. **Score it** using this matrix:

| Factor | Weight | Score (1-5) |
|--------|--------|-------------|
| Time consumed | 30% | |
| Repetitiveness | 20% | |
| Error frequency | 20% | |
| Business impact | 20% | |
| Data availability | 10% | |

5. **AI Readiness**: Rate the bottleneck's readiness for AI automation:
   - 🟢 HIGH: Clear data, repetitive pattern, standard AI capability
   - 🟡 MEDIUM: Partial data or requires some customization
   - 🔴 LOW: Unstructured, requires judgment, limited data

6. **Recommended approach**: If AI were applied, what would the solution look like in one sentence?

Rank all bottlenecks by composite score (highest first).

Finally, provide a summary recommendation: "If you could only fix ONE bottleneck with AI, fix [X] because [reason]."
```

## Expected Output

- Ranked list of 5–10 bottlenecks with scores
- AI readiness rating for each
- One-line solution description per bottleneck
- Clear #1 recommendation with rationale

## Tips

- Be generous with the `{{process_observations}}` variable — more raw detail produces better analysis
- Cross-reference the output with the business owner's stated priorities
- Use the output to feed directly into the [ROI Estimation prompt](roi-estimation.md)
