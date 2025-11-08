# Agent Delegation Pattern

Structure multi-agent workflows for token-efficient context management and specialized execution.

## Pattern Overview

Instead of one agent loading all knowledge, use a **primary architect** that delegates to specialized sub-agents, each loading only what they need.

## Architecture

```
User Intent
    ↓
Primary Architect Agent
    ├→ Sub-Agent A (loads Skills A1, A2)
    ├→ Sub-Agent B (loads Skills B1, B2)
    └→ Sub-Agent C (loads Skills C1, C2)
         ↓
Deterministic Slash Commands (/pr, /fix-lint, /doc-sync)
         ↓
   Human Audit Point
```

## Five-Step Operating Pattern

### 1. Primary Architect Receives Intent

**User**: "Update org-hierarchy model for billing + ops"

**Architect**:
- Parses intent into concrete tasks
- Identifies which specialized agents to delegate to
- Frames context for each delegation

### 2. Delegate to Specialized Sub-Agents

Each sub-agent has:
- **Specific responsibility** (ArchitectCoach, IntegrationEngineer, DataModelReviewer)
- **Limited tool scope** (only what they need)
- **Focused prompt** (role-specific instructions)

```markdown
# .claude/agents/data-model-reviewer.md
---
name: data-model-reviewer
description: Review database models for integrity and performance
tools: Read, Grep
model: sonnet
---

You are a data modeling expert. Review the org-hierarchy model for:
- Foreign key relationships
- Index coverage
- Migration safety
```

### 3. Each Sub-Agent Loads Only Required Skills

**Token efficiency through selective loading:**

```
DataModelReviewer
├─ Loads: skills/org-hierarchy/SKILL.md (200 tokens)
└─ Skips: skills/provider-ingestion/SKILL.md (not needed)

IntegrationEngineer
├─ Loads: skills/provider-ingestion/SKILL.md (300 tokens)
└─ Skips: skills/org-hierarchy/SKILL.md (not needed)
```

**Traditional approach**: All agents load everything (500+ tokens)
**Delegation pattern**: Each loads 200-300 tokens

### 4. Deterministic Slash Commands Close the Loop

Once sub-agents complete work, predefined commands execute:

- `/pr` — Create pull request with standard template
- `/fix-lint` — Run linter and auto-fix issues
- `/doc-sync` — Update documentation from code changes
- `/test-boundary` — Run tests for affected boundaries

**Benefits:**
- Removes decision-making from agents (deterministic)
- Provides human audit points
- Ensures consistent quality gates

### 5. Observability Feeds Back to Curator

Results from each delegation inform future context selection:

```
Task: "Update org-hierarchy model"
├─ Sub-agents used: DataModelReviewer, IntegrationEngineer
├─ Skills loaded: org-hierarchy/SKILL.md, provider-ingestion/SKILL.md
├─ Outcome: Success
└─ Store pattern: "model updates" → [these agents + skills]

Next time: "Update billing model"
├─ Retrieve pattern: "model updates"
└─ Suggest: DataModelReviewer + org-hierarchy/SKILL.md
```

## Implementation Example

### Project Structure

```
.claude/
├── agents/
│   ├── architect-coach.md
│   ├── integration-engineer.md
│   └── data-model-reviewer.md
├── skills/
│   ├── org-hierarchy/
│   │   └── SKILL.md
│   ├── provider-ingestion/
│   │   └── SKILL.md
│   └── billing-logic/
│       └── SKILL.md
└── commands/
    ├── pr.md
    ├── fix-lint.md
    └── test-boundary.md
```

### Primary Architect Agent

```markdown
# CLAUDE.md

You are the primary architect for this codebase.

## Delegation Strategy

When receiving a user request:

1. **Parse intent** into concrete tasks
2. **Select sub-agents** based on task domain:
   - Data model changes → data-model-reviewer
   - API integration → integration-engineer
   - Architecture decisions → architect-coach
3. **Frame context** for each sub-agent (what to focus on)
4. **Monitor results** and synthesize findings
5. **Execute slash commands** to close the loop

## Available Sub-Agents

- **data-model-reviewer**: Database schema, migrations, relationships
- **integration-engineer**: External API connections, data pipelines
- **architect-coach**: System design, patterns, trade-offs

## Workflow Example

User: "Add Stripe billing to org-hierarchy"

1. Delegate to **data-model-reviewer**: Review org-hierarchy schema
2. Delegate to **integration-engineer**: Design Stripe webhook handler
3. Synthesize: Confirm changes don't conflict
4. Execute: `/test-boundary org-hierarchy`, `/pr`
```

### Sub-Agent Example

```markdown
# .claude/agents/integration-engineer.md
---
name: integration-engineer
description: Design and implement external integrations
tools: Read, Write, Bash(npm:*, curl:*)
model: sonnet
---

You are an integration specialist. When delegated a task:

1. **Load relevant Skills** from .claude/skills/
2. **Review existing patterns** in similar integrations
3. **Design the integration** (auth, webhooks, retry logic)
4. **Implement** following project patterns
5. **Return summary** of changes and considerations

## Skills You May Load

- skills/provider-ingestion/SKILL.md (if building data pipelines)
- skills/webhook-handling/SKILL.md (if receiving webhooks)
- skills/auth-patterns/SKILL.md (if handling OAuth/API keys)

Only load what's needed for the current task.
```

## Benefits

**Token efficiency**: 60-80% reduction through selective loading
**Parallel execution**: Multiple sub-agents work simultaneously
**Specialization**: Each agent excels in narrow domain
**Determinism**: Slash commands provide consistent quality gates
**Learning**: Patterns improve over time via observability

## When to Use This Pattern

**Use when:**
- Working on large codebases with multiple domains
- Context grows beyond 2000 tokens
- Tasks require specialized knowledge
- Team has established patterns/skills

**Don't use when:**
- Small projects (< 10 files)
- Single-domain tasks
- Ad-hoc exploration
- Rapid prototyping

## Related Patterns

See also:
- claude-code-features.md (compositional hierarchy)
- smart-claude-context-template.md (selective loading)
- boundary-decomposition-guide.md (skill contracts)
