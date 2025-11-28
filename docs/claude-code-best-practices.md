# Claude Code Best Practices

**Updated: 2025-11-28** | Configuration, skills vs agents, and progressive disclosure.

---

## Configuration Hierarchy

```
~/.claude/settings.json                 (global user settings)
    ↓
<project>/.claude/settings.json         (team settings, version controlled)
    ↓
<project>/.claude/settings.local.json   (personal, gitignored)
```

**Priority**: More specific overrides broader (project → user global).

### Directory Structure

```
~/.claude/                          # Global configuration
├── CLAUDE.md                       # Global instructions (< 200 lines)
├── commands/                       # Global slash commands
└── skills/                         # Global skills (rare)

<project>/.claude/                  # Project configuration
├── CLAUDE.md                       # Project instructions (< 200 lines)
├── commands/                       # Project slash commands
├── skills/                         # Project skills (preferred)
│   └── [skill-name]/
│       ├── SKILL.md               # Core workflow (< 500 lines)
│       └── REFERENCE.md           # Detailed docs (< 600 lines)
└── agents/                         # Project agents
```

---

## Global vs Project Configuration

### Use Global (`~/.claude`) For:

1. **Personal preferences**: Tool choices (`uv` for Python, `pnpm` over `npm`)
2. **Universal principles**: TDD, security-first, progressive disclosure
3. **Generic utilities**: `/scan-env`, `/env-troubleshoot`, `/search-code`

### Use Project (`.claude`) For:

1. **Tech stack specifics**: FastAPI patterns, Next.js conventions
2. **Team workflows**: Deployment, testing, documentation
3. **Domain knowledge**: Module boundaries, API contracts

**Key Principle**: Keep skills project-local and version controlled unless you have explicit cross-project standards.

---

## Skills vs Agents

### Skills (Model-Invoked)

Claude decides when to use based on trigger keywords.

**Characteristics:**
- Auto-discovered via description keywords
- Progressive disclosure (metadata → SKILL.md → REFERENCE.md)
- Procedural workflows with clear steps
- Context-efficient through on-demand loading

**Use For:**
- Procedural workflows (migrations, validation, docs updates)
- Auto-discoverable patterns (keyword triggers)
- Repeatable operations with checklists

### Agents (User-Invoked)

Explicit delegation for complex, judgment-heavy tasks.

**Characteristics:**
- Isolated context window
- Full prompt loaded upfront
- Domain expertise requiring judgment
- Long-running, stateful operations

**Use For:**
- Complex multi-file changes
- Subjective decision-making
- Feature development across layers
- Security-critical operations

### Decision Table

| Criteria | Skill | Agent |
|----------|-------|-------|
| **Invocation** | Auto (keywords) | Manual (user requests) |
| **Context** | Shared | Isolated |
| **Steps** | Procedural | Requires judgment |
| **Token cost** | Minimal | Full prompt upfront |

---

## File Size Standards

| File | Max Lines | Purpose |
|------|-----------|---------|
| CLAUDE.md | 200 | Quick reference, always loaded |
| SKILL.md | 500 | Core workflow, loaded when triggered |
| REFERENCE.md | 600 | Detailed specs, loaded on-demand |
| Commands | 300 | Single responsibility |

### Why Limits Matter

1. **Context window**: Every loaded file consumes tokens
2. **Cognitive load**: Shorter files are easier to maintain
3. **Progressive disclosure**: Load only what's needed

---

## Progressive Disclosure

### Three-Tier Loading

```
Always Load → Triggered → On-Demand
  Metadata  →  SKILL.md → REFERENCE.md
  ~100 bytes   ~500 lines  ~600 lines
```

**Tier 1: Metadata** (Always loaded)
```yaml
---
name: database-schema-manager
description: Use for database schema changes. Triggers on "database", "schema", "migration".
allowed-tools: Read, Edit, Write, Bash, Glob, Grep
---
```

**Tier 2: SKILL.md** (Loaded when triggered)
- Core workflow steps
- Common scenarios
- Links to REFERENCE.md for details

**Tier 3: REFERENCE.md** (Loaded on-demand)
- Complete specifications
- Extensive examples
- Troubleshooting guides

**Rule**: REFERENCE.md should NOT link to other files (keep depth = 1).

---

## Skill Authoring

### Structure
```
.claude/skills/[skill-name]/
├── SKILL.md                    # Core workflow (< 500 lines)
├── REFERENCE.md                # Detailed specs (< 600 lines)
└── templates/                  # Reusable templates
```

### SKILL.md Template
```markdown
---
name: skill-name
description: Brief description with trigger keywords. Max 1024 chars.
allowed-tools: Read, Edit, Write, Bash, Glob, Grep
---

# Skill Name

## Purpose
[1-2 sentences]

## Trigger Cues
- Keywords: "pattern1", "pattern2"

## Workflow
1. [Step with brief instructions]
2. [Step, link to REFERENCE.md for details]

## Success Checklist
- [ ] Criterion 1
- [ ] Criterion 2

See [REFERENCE.md](./REFERENCE.md) for complete specifications.
```

### Tool Restrictions

Use `allowed-tools` to enforce focus:
- **Read-only**: `Read, Glob, Grep`
- **Documentation**: `Read, Edit, Write, Glob, Grep`
- **Full-stack**: `Read, Edit, Write, Bash, Glob, Grep`

---

## Agent Design

### Template
```markdown
---
name: backend-developer
description: Use for FastAPI endpoints, business logic, Python backend code.
model: sonnet
allowed-tools: All
---

# Agent Name

## Purpose
[1-2 paragraphs]

## Core Responsibilities
- Responsibility 1
- Responsibility 2

## Technical Standards
- Standard 1
- Standard 2

## Skills Used
- `/database/clarify-requirements` - Schema changes
- `/validate/run-validation` - Pre-commit checks

## Success Criteria
- [ ] All endpoints tested
- [ ] Documentation updated
```

### Model Selection
- **sonnet**: Most agents (balance of speed and capability)
- **opus**: Complex architectural decisions
- **haiku**: Simple, repetitive tasks

---

## Skills + Agents Coordination

### Pattern 1: Skill → Command Execution
1. User request triggers skill
2. Skill runs matching `/command`
3. Command executes checklist

### Pattern 2: Skill → Agent Escalation
1. Skill auto-activates
2. Skill encounters complexity beyond scope
3. Claude suggests delegating to agent

### Pattern 3: Agent → Skill Utilization
1. User invokes agent
2. Agent uses skills for subtasks (migrations, docs)

### Best Practices
- Skills should know when to escalate to agents
- Agents should know which skills to use
- Avoid circular dependencies
- Pass context explicitly when delegating

---

## Quick Decision Guide

**Global config**: Personal preferences, universal principles, generic utilities

**Project config**: Team workflows, tech stack specifics, domain knowledge

**Skills**: Procedural, auto-discoverable, context-efficient

**Agents**: Complex, judgment-heavy, long-running

**File sizes**: CLAUDE.md < 200, SKILL.md < 500, REFERENCE.md < 600

---

## Resources

- [Claude Code Docs](https://docs.claude.com/en/docs/claude-code)
- [Skills Documentation](https://docs.claude.com/en/docs/claude-code/skills)
- [Subagents Guide](https://docs.claude.com/en/docs/claude-code/sub-agents)

---

*Last Updated: 2025-11-28*
