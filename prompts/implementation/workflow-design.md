# Prompt: Workflow Design

## Purpose
Design a complete AI workflow blueprint for a specific business use case, including triggers, processing steps, outputs, error handling, and human review points.

## When to Use
- Week 5 of the Fellows curriculum (before building)
- After use case selection and executive alignment
- Anytime you need to architect an AI workflow from scratch

## Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `{{business_name}}` | Name of the business | "Metro Services LLC" |
| `{{use_case}}` | What the AI workflow will do | "Auto-draft customer response emails based on inquiry type" |
| `{{target_metric}}` | The metric this improves | "Average response time to customer inquiries" |
| `{{current_tools}}` | Tools the business already uses | "Gmail, HubSpot CRM, Google Sheets" |
| `{{data_sources}}` | Available data to feed the AI | "Historical email threads, CRM contact records, FAQ document" |
| `{{staff_roles}}` | Who interacts with this process | "Customer service rep (2 people), sales manager" |
| `{{constraints}}` | Any limitations or requirements | "Must reply within 4 hours, legal disclaimers required on quotes" |

## Prompt

```
You are an AI workflow architect designing a production deployment for {{business_name}}.

Use case: {{use_case}}
Target metric: {{target_metric}}
Existing tools: {{current_tools}}
Available data: {{data_sources}}
Staff involved: {{staff_roles}}
Constraints: {{constraints}}

Design a complete AI workflow blueprint covering:

## 1. Workflow Overview
- One-paragraph description of what the AI does
- Trigger: What starts the workflow (event, schedule, manual)
- Output: What the workflow produces

## 2. Architecture
Design the workflow as a clear sequence of steps:
- Step 1: [Trigger / Input capture]
- Step 2: [Data retrieval / enrichment]
- Step 3: [AI processing / decision]
- Step 4: [Output generation]
- Step 5: [Human review point (if applicable)]
- Step 6: [Action / delivery]

For each step, specify:
- What happens
- What tool/system is involved
- What data flows in and out
- Estimated processing time

## 3. Integration Plan
- How does this connect to {{current_tools}}?
- What APIs, connectors, or automation tools are needed?
- What data access permissions are required?
- Is any new tooling needed (and can we avoid it)?

## 4. Human Review Layer
- Which outputs require human review before action?
- What does the review interface look like?
- What's the fallback if AI confidence is low?

## 5. Error Handling
- What happens if the trigger fires but data is missing?
- What happens if the AI produces low-quality output?
- What happens if the integration fails?
- Alert mechanism for failures

## 6. Success Criteria
- How do we know this workflow is performing well?
- What data do we collect to feed the Rate of Improvement framework?
- What does "good enough to remove human review" look like?

## 7. Deployment Checklist
Provide a step-by-step checklist for going live.

Format with a Mermaid sequence diagram where appropriate.
```

## Expected Output

- Complete workflow blueprint with architecture diagram
- Integration specifications
- Error handling matrix
- Deployment-ready checklist

## Tips

- Keep the first version simple (Minimal Viable Automation)
- Prefer existing tools over new platforms
- Always include a human review layer in v1
