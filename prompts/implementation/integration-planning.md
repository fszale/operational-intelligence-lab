# Prompt: Integration Planning

## Purpose
Plan the technical integration of an AI workflow into a business's existing tool ecosystem, minimizing disruption and avoiding unnecessary new platforms.

## When to Use
- Week 5 of the Fellows curriculum (pre-deployment)
- After the workflow blueprint is designed
- When evaluating how to connect AI to existing business tools

## Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `{{business_name}}` | Name of the business | "Acme Manufacturing" |
| `{{workflow_name}}` | The AI workflow being integrated | "Automated invoice reconciliation" |
| `{{current_tools}}` | Complete list of tools the business uses | "QuickBooks, Gmail, Google Sheets, Dropbox" |
| `{{workflow_blueprint}}` | Summary of the workflow design | (paste from workflow design prompt output) |
| `{{tech_maturity}}` | Business's technical sophistication | "Low — no IT staff, basic tool usage" |
| `{{budget_for_tools}}` | Budget for any new integrations | "$0–50/month for automation tools" |

## Prompt

```
You are a systems integrator planning the connection between an AI workflow and a small business's existing tool ecosystem.

Business: {{business_name}}
AI Workflow: {{workflow_name}}
Current tools: {{current_tools}}
Technical maturity: {{tech_maturity}}
Tool budget: {{budget_for_tools}}

Workflow summary:
{{workflow_blueprint}}

Create a detailed integration plan:

## 1. Integration Map
For each connection point between the AI workflow and existing tools:
- Source system → Data/event → Destination system
- Connection method (API, webhook, Zapier, manual, email parsing, etc.)
- Data format and any transformation needed

## 2. Tool Assessment
For each existing tool, evaluate:
| Tool | Has API? | Automation Support | Integration Complexity | Notes |
|------|----------|-------------------|----------------------|-------|

## 3. Recommended Integration Stack
Based on the business's tech maturity and budget:
- What automation platform (if any) should be used? (Zapier, Make, n8n, custom scripts, none)
- What's the simplest path to get data in and out?
- Can we avoid any new tools entirely?

## 4. Data Flow Diagram
Describe (or diagram) the complete data flow:
- Where data originates
- How it reaches the AI
- How AI output returns to the business workflow
- Where results are stored/visible

## 5. Permission & Access Requirements
- What accounts/permissions does the Fellow need?
- What data access is required?
- Are there security or privacy considerations?

## 6. Failure Modes
- What happens if an integration breaks?
- How will the business know something failed?
- What's the manual fallback for each connection?

## 7. Staff Impact Assessment
- Does any staff member need to change their daily routine?
- What's the minimum training needed?
- How do we make this feel seamless, not disruptive?

Prioritize simplicity and reliability over sophistication.
```

## Expected Output

- Integration map with connection methods
- Tool assessment table
- Recommended integration stack with rationale
- Data flow description
- Permission checklist
- Failure mode analysis

## Tips

- For low-tech-maturity businesses, prefer email-based triggers and spreadsheet outputs
- Zapier/Make are good bridges when direct API integration is overkill
- The goal is "invisible AI" — staff shouldn't feel like they're using a new system
