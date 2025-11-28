# Claude Code Best Practices: Skills, Agents, and Configuration Management

**Updated: 2025-11-16** | A comprehensive guide to organizing Claude Code configuration, choosing between skills and agents, and managing global vs project-specific settings.

## Table of Contents

1. [Configuration Hierarchy](#configuration-hierarchy)
2. [Global vs Project Configuration](#global-vs-project-configuration)
3. [Skills vs Agents Decision Framework](#skills-vs-agents-decision-framework)
4. [File Size and Quality Standards](#file-size-and-quality-standards)
5. [Progressive Disclosure Strategy](#progressive-disclosure-strategy)
6. [Skill Authoring Guidelines](#skill-authoring-guidelines)
7. [Agent Design Patterns](#agent-design-patterns)
8. [Converting Agents to Skills](#converting-agents-to-skills)
9. [Skills and Agents Working Together](#skills-and-agents-working-together)

---

## Configuration Hierarchy

Claude Code uses a hierarchical settings system where configurations cascade from broad to specific:

```
~/.claude.json                          (main global configuration)
    ↓
~/.claude/settings.json                 (user-specific global settings)
    ↓
~/.claude/settings.local.json           (user-specific local settings)
    ↓
<project>/.claude/settings.json         (project settings, version controlled)
    ↓
<project>/.claude/settings.local.json   (project-local, not version controlled)
```

**Priority Rule**: More specific settings override broader ones (project → user local → user global → main global).

### Directory Structure

```
~/.claude/                          # Global configuration
├── CLAUDE.md                       # Global instructions (< 200 lines)
├── settings.json                   # User settings
├── commands/                       # Global slash commands
│   ├── analysis/
│   ├── core/
│   └── documentation/
└── skills/                         # Global skills (rare)
    └── [skill-name]/
        └── SKILL.md

<project>/.claude/                  # Project configuration
├── CLAUDE.md                       # Project instructions (< 200 lines)
├── settings.json                   # Team settings (version controlled)
├── settings.local.json             # Personal overrides (gitignored)
├── commands/                       # Project slash commands
│   ├── ai/
│   ├── database/
│   └── docs/
├── skills/                         # Project skills (preferred)
│   ├── [skill-name]/
│   │   ├── SKILL.md               # Core workflow (< 500 lines)
│   │   ├── REFERENCE.md           # Detailed docs (< 600 lines)
│   │   └── templates/             # Reusable templates
└── agents/                         # Project agents
    └── [agent-name].md
```

---

## Global vs Project Configuration

### When to Use Global (`~/.claude`)

**✅ Use global configuration for:**

1. **Personal Development Preferences**
   - Tool preferences (e.g., "Use `uv` for Python", "Use `pnpm` over `npm`")
   - Shell preferences and PATH configurations
   - Editor/IDE integrations

2. **Universal Development Principles**
   - Development philosophy (TDD, security-first, progressive disclosure)
   - Quality standards (file size limits, documentation standards)
   - Code style preferences

3. **Generic Utility Commands**
   - Environment scanning (`/scan-env`)
   - Generic troubleshooting (`/env-troubleshoot`)
   - Universal analysis tools (`/search-code`)

4. **Cross-Project Patterns** (Rare)
   - Only if you have **explicit organizational standards** that apply to *all* projects
   - Generic workflows that have no project-specific dependencies

**Example `~/.claude/CLAUDE.md`:**

```markdown
# Claude Code Global Instructions

## General Best Practices
- Use `uv` and `uvx` for Python package management
- Don't work around failures with placeholders, ask the user first
- Always use absolute paths in subshell commands

## Development Philosophy
- Prefer explicit over implicit
- Test-driven development for all features
- Progressive disclosure in documentation
- Security-first approach (tenant isolation, auth)

## Quality Standards
- CLAUDE.md files: < 200 lines
- SKILL.md files: < 500 lines
- REFERENCE.md files: < 600 lines
- Use progressive disclosure pattern
```

### When to Use Project (`.claude`)

**✅ Use project configuration for:**

1. **Project-Specific Architecture**
   - Tech stack specifics (FastAPI, Next.js, React patterns)
   - Database schemas and migration workflows
   - API patterns and authentication flows

2. **Domain-Specific Workflows**
   - Deployment pipelines specific to your infrastructure
   - Testing strategies for your stack
   - AI/LLM integration patterns unique to your application

3. **Team Collaboration**
   - Shared skills that reference project architecture
   - Agents that understand project modules/boundaries
   - Commands that orchestrate project-specific operations

4. **Module and Boundary Specifications**
   - References to `specs/` directory
   - Project-specific validation workflows
   - Documentation structures unique to your project

**Key Principle**: **"Keep Skills project-local and under version control unless your organization has explicit internal standards."**

### Decision Matrix

| Aspect | Global (`~/.claude`) | Project (`.claude`) |
|--------|---------------------|---------------------|
| **Scope** | Personal preferences, universal principles | Team-shared, project-specific |
| **Version Control** | Not shared (personal) | Committed to git (team) |
| **Examples** | Tool preferences, generic utilities | Skills, agents, project workflows |
| **Discoverability** | Only you | Entire team via git clone |
| **Maintenance** | Personal responsibility | Team collaboration |
| **Context** | Works across all projects | Requires project knowledge |

---

## Skills vs Agents Decision Framework

### What Are Skills?

**Skills are model-invoked** - Claude decides when to use them based on trigger keywords and context.

**Characteristics:**
- Auto-discovered based on description keywords
- Progressive disclosure (metadata → SKILL.md → REFERENCE.md)
- Procedural workflows with clear steps
- Context-efficient through on-demand loading
- Can restrict tools via `allowed-tools`

### What Are Agents?

**Agents are user-invoked** - Explicit delegation for complex, multi-step workflows.

**Characteristics:**
- Isolated context window
- Full prompt loaded upfront
- Domain expertise requiring judgment
- Complex multi-file changes
- Can coordinate multiple skills/tools

### When to Use Skills

**✅ Use Skills for:**

1. **Procedural Workflows with Strict Steps**
   - Database migrations (model → migration → apply)
   - Documentation updates (search → update → validate)
   - Deployment validation (quality → types → tests → infra)

2. **Auto-Discoverable Patterns**
   - Triggered by keywords ("database", "schema", "migration")
   - Claude should activate without user intervention
   - Repeatable patterns with clear decision trees

3. **Context Efficiency via Progressive Disclosure**
   - Core instructions (~500 lines in SKILL.md)
   - Reference materials loaded only when needed (REFERENCE.md)
   - Unbounded detail without context overhead

4. **Reusable Patterns Across Many Contexts**
   - Standard procedures that apply broadly
   - Best practices and checklists
   - Validation workflows

**Example Skill Use Cases:**
- Database schema manager (model-first workflow)
- Documentation maintainer (search, edit, validate)
- Deployment validator (multi-layer health checks)
- AI integration orchestrator (schema → prompt → test)

### When to Use Agents

**✅ Use Agents for:**

1. **Complex Multi-Step Workflows Needing Isolation**
   - Implementing new backend features across multiple files
   - Frontend UI/UX development requiring design judgment
   - Comprehensive test coverage creation

2. **Explicit Control Over Invocation**
   - User explicitly requests "use the backend-developer agent"
   - Coordinating multiple skills/tools
   - Domain expertise requiring full context

3. **Long-Running Tasks with State Management**
   - Feature development across multiple files
   - Refactoring large codebases
   - Integration testing workflows

4. **Domain Expertise with Full Context**
   - Security-critical operations
   - Complex business logic implementation
   - Architectural decisions

**Example Agent Use Cases:**
- Backend developer (FastAPI endpoints, business logic, security)
- Frontend developer (React components, state management, API integration)
- DevOps engineer (infrastructure orchestration, incident response)
- QA engineer (comprehensive test coverage across layers)

### Decision Table

| Criteria | Use Skill | Use Agent |
|----------|-----------|-----------|
| **Invocation** | Auto (keyword triggers) | Manual (user requests) |
| **Context** | Shared with main conversation | Isolated context window |
| **Steps** | Procedural, repeatable | Complex, requires judgment |
| **Token Cost** | Minimal (progressive disclosure) | Full prompt loaded upfront |
| **Duration** | Single workflow execution | Long-running, stateful |
| **Coordination** | Orchestrates commands/agents | Delegates to skills/agents |
| **Examples** | Migrations, validation, docs | Feature dev, refactoring, architecture |

---

## File Size and Quality Standards

### Official Guidelines (2025)

| File Type | Max Lines | Purpose | Loading Strategy |
|-----------|-----------|---------|------------------|
| **CLAUDE.md** | 200 | Quick reference, links to docs | Always loaded |
| **SKILL.md** | 500 | Core workflow, procedures | Loaded when triggered |
| **REFERENCE.md** | 600 | Detailed specs, examples | Loaded on-demand |
| **Agent.md** | Varies | Comprehensive domain guidance | Loaded when invoked |
| **Commands** | 300 | Single responsibility workflow | Loaded when called |
| **docs/*.md** | 1000 | User-facing documentation | Linked from CLAUDE.md |

### Why These Limits Matter

1. **Context Window Management**
   - Claude has a finite context window
   - Every loaded file consumes tokens
   - Smaller files = more room for code and analysis

2. **Progressive Disclosure Pattern**
   ```
   Metadata (always) → SKILL.md (triggered) → REFERENCE.md (needed)
      ~100 bytes            ~500 lines            ~600 lines
   ```

3. **Cognitive Load**
   - Shorter files are easier to maintain
   - Forces clear, focused documentation
   - Encourages linking over duplication

### Enforcement Strategy

**Pre-commit validation:**
```bash
# Check file sizes
find .claude -name "*.md" -type f | while read file; do
  lines=$(wc -l < "$file")
  case "$file" in
    */CLAUDE.md)
      [ $lines -gt 100 ] && echo "❌ $file exceeds 100 lines ($lines)"
      ;;
    */SKILL.md)
      [ $lines -gt 500 ] && echo "❌ $file exceeds 500 lines ($lines)"
      ;;
    */REFERENCE.md)
      [ $lines -gt 600 ] && echo "❌ $file exceeds 600 lines ($lines)"
      ;;
  esac
done
```

---

## Progressive Disclosure Strategy

### Three-Tier Loading Model

Skills use a graduated loading strategy to minimize token usage:

#### **Tier 1: Metadata** (Always Loaded)

```yaml
---
name: database-schema-manager
description: Use this skill when making database schema changes, adding tables, modifying columns, creating indexes, or handling database structure modifications. Triggers on "database", "schema", "migration", "add column", "create table".
allowed-tools: Read, Edit, Write, Bash, Glob, Grep
---
```

**Token cost**: ~100 bytes per skill
**Purpose**: Enable Claude to discover when to use the skill

#### **Tier 2: SKILL.md** (Loaded When Triggered)

```markdown
# Database Schema Manager

## Workflow

1. Clarify requirements using `/database/clarify-requirements`
2. Update SQLAlchemy models using `/database/update-models`
3. Generate migration using `/database/autogenerate-migration`
4. Verify migration using `/database/verify-migration`
5. Document follow-up using `/database/document-followup`

## Common Scenarios

### Adding a New Column
[Step-by-step instructions...]

### Creating a New Table
[Step-by-step instructions...]

See [REFERENCE.md](./REFERENCE.md) for complete specifications.
```

**Token cost**: ~500-1000 lines
**Purpose**: Provide workflow instructions and common patterns
**Target**: Keep under 500 lines

#### **Tier 3: REFERENCE.md** (Loaded On-Demand)

```markdown
# Database Schema Manager Reference

## Complete SQLAlchemy Model Patterns

### Column Types
[Extensive examples...]

### Relationship Patterns
[Detailed specifications...]

### Migration Best Practices
[Comprehensive guide...]

## Troubleshooting

### Common Errors
[Extensive troubleshooting...]
```

**Token cost**: Unbounded, loaded only when Claude needs details
**Purpose**: Comprehensive technical reference
**Critical rule**: Keep references one level deep from SKILL.md

### Linking Strategy

**SKILL.md should link to REFERENCE.md:**
```markdown
For complete column type specifications, see [REFERENCE.md](./REFERENCE.md#column-types).
```

**REFERENCE.md should NOT link to other files** (keep depth = 1)

---

## Skill Authoring Guidelines

### Structure Template

```
.claude/skills/[skill-name]/
├── SKILL.md                    # Core workflow (< 500 lines)
├── REFERENCE.md                # Detailed specs (< 600 lines)
├── templates/                  # Reusable templates
│   └── [template-name].md
└── examples/                   # Example implementations
    └── [example-name].md
```

### SKILL.md Content Guidelines

```markdown
---
name: skill-name
description: Brief description including what it does and trigger keywords. Max 1024 characters.
allowed-tools: Read, Edit, Write, Bash, Glob, Grep
---

# Skill Name

## Purpose
[1-2 sentences explaining the skill's role]

## Trigger Cues
- Keyword: "pattern1", "pattern2", "pattern3"
- User request: "example request"

## Workflow

### Step 1: [Action]
[Brief instructions, link to REFERENCE.md for details]

### Step 2: [Action]
[Brief instructions, link to REFERENCE.md for details]

## Common Scenarios

### Scenario 1
[Concise example, link to REFERENCE.md]

### Scenario 2
[Concise example, link to REFERENCE.md]

## Success Checklist
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Reference
See [REFERENCE.md](./REFERENCE.md) for:
- Complete specifications
- Detailed examples
- Troubleshooting guide
```

### REFERENCE.md Content Guidelines

```markdown
# [Skill Name] Reference

## Complete Technical Specifications

### Pattern 1
[Extensive examples and details]

### Pattern 2
[Extensive examples and details]

## API Reference
[Complete API documentation]

## Troubleshooting

### Error 1: [Description]
**Symptoms**: [...]
**Cause**: [...]
**Solution**: [...]

### Error 2: [Description]
[...]

## Examples

### Example 1: [Scenario]
[Complete implementation example]

### Example 2: [Scenario]
[Complete implementation example]
```

### Content Principles

1. **Conciseness is Essential**
   - Context window is shared across all files
   - Every word counts toward token limits
   - Link to details rather than duplicating

2. **Match Specificity to Task Fragility**
   - Error-prone tasks need strict, detailed steps
   - Simple tasks can be more concise
   - Include validation steps for critical operations

3. **Use Gerund Form for Naming**
   - ✅ `processing-pdfs`, `managing-database`
   - ❌ `process-pdfs`, `manage-database`

4. **Write Descriptions in Third Person**
   - ✅ "Processes PDF files and extracts text"
   - ❌ "I process PDF files"

5. **Provide Concrete Examples**
   - Show input/output, not abstract concepts
   - Include actual code snippets
   - Reference project-specific patterns

### Tool Restrictions

Use `allowed-tools` to restrict access and enforce focus:

```yaml
---
name: docs-maintainer
allowed-tools: Read, Edit, Write, Glob, Grep
---
```

**Benefits:**
- Prevents scope creep (can't accidentally run Bash commands)
- Forces focused workflows
- Improves security for sensitive operations
- Reduces cognitive load

**Common Tool Sets:**
- **Read-only**: `Read, Glob, Grep`
- **Documentation**: `Read, Edit, Write, Glob, Grep`
- **Full-stack**: `Read, Edit, Write, Bash, Glob, Grep`
- **Analysis**: `Read, Bash, Glob, Grep`

---

## Agent Design Patterns

### Agent File Structure

```markdown
---
name: backend-developer
description: Use this agent when implementing FastAPI endpoints, business logic, API services, or Python backend code. Examples: [concrete examples]
model: sonnet
color: green
allowed-tools: All
---

# [Agent Name]

## Purpose
[1-2 paragraphs explaining the agent's role and when to invoke it]

## Core Responsibilities
- Responsibility 1
- Responsibility 2
- Responsibility 3

## Technical Standards
- Standard 1
- Standard 2
- Standard 3

## Workflow Patterns

### Pattern 1: [Common Task]
1. Step 1
2. Step 2
3. Step 3

### Pattern 2: [Common Task]
[...]

## Integration Points

### Skills Used
- `/database/clarify-requirements` - When backend work implies schema changes
- `/docs/define-update` - Document API changes
- `/validate/run-validation` - Pre-commit validation

### Agents Coordinated
- `database-schema-manager` - For complex schema design
- `qa-and-test-engineer` - For comprehensive test coverage

## Reference Materials
- [Project Specs](../../../specs/MODULES_QUICK_REFERENCE.md)
- [Architecture Docs](../../../docs/architecture.md)

## Success Criteria
- [ ] All endpoints have tests
- [ ] Security patterns followed
- [ ] Documentation updated
```

### Agent Best Practices

1. **Clear Invocation Criteria**
   - Provide concrete examples of when to use the agent
   - Distinguish from similar agents or skills

2. **Integration Documentation**
   - List skills the agent commonly uses
   - Document coordination with other agents
   - Reference project-specific resources

3. **Domain Expertise**
   - Include technical standards specific to the domain
   - Provide common patterns and anti-patterns
   - Link to external resources when appropriate

4. **Model Selection**
   - Use `sonnet` for most agents (balance of speed and capability)
   - Use `opus` only for complex architectural decisions
   - Use `haiku` for simple, repetitive tasks

---

## Converting Agents to Skills

### Decision Criteria

**Convert an agent to a skill when:**

✅ **Highly procedural workflow** - Clear, repeatable steps
✅ **Auto-discoverable trigger keywords** - Easy to identify when to activate
✅ **Context-heavy reference material** - Benefits from progressive disclosure
✅ **Self-contained operations** - Doesn't need constant coordination
✅ **Frequent usage patterns** - Benefits from automatic activation
✅ **Workflow captured in slash command** - Execution logic externalized

**Keep as an agent when:**

❌ **Complex multi-file changes** - Requires orchestrating many changes
❌ **Subjective decision-making** - Needs domain expertise and judgment
❌ **Long-running workflows** - Takes many steps with state management
❌ **Coordination with other agents** - Frequently delegates to other agents
❌ **Security-critical operations** - Requires human oversight
❌ **Command not yet defined** - Slash command doesn't exist yet

### Conversion Process

1. **Analyze Agent Workflow**
   - Identify procedural vs. creative parts
   - Extract step-by-step patterns
   - Identify decision points requiring judgment

2. **Extract Procedural Core**
   - Move strict workflows to SKILL.md
   - Create slash commands for each step
   - Document decision trees

3. **Create Progressive Structure**
   - SKILL.md: Core workflow (< 500 lines)
   - REFERENCE.md: Detailed specs (< 600 lines)
   - Slash commands: Individual operations

4. **Define Clear Triggers**
   - List keywords that indicate skill usage
   - Provide example user requests
   - Test auto-activation

5. **Test Auto-Activation**
   - Use general requests without mentioning skill name
   - Verify Claude discovers and uses skill appropriately
   - Validate progressive disclosure works

6. **Keep Agent for Complex Cases**
   - Agent can still handle edge cases requiring judgment
   - Agent delegates to skill for procedural parts
   - Clear division of responsibility

### Example: Database Agent → Skill

**Before (Agent):**
```markdown
You are a database expert. When the user mentions schema changes,
follow the model-first workflow: update models, generate migrations,
verify, and apply. Check for common errors. Use best practices...
[500 lines of detailed instructions]
```

**After (Skill):**
```markdown
# SKILL.md (300 lines)
---
name: database-schema-manager
description: Auto-activates on "database", "schema", "migration" keywords
---

## Workflow
1. `/database/clarify-requirements`
2. `/database/update-models`
3. `/database/autogenerate-migration`
4. `/database/verify-migration`

See [REFERENCE.md](./REFERENCE.md) for detailed specifications.

# REFERENCE.md (500 lines)
[Complete SQLAlchemy patterns, troubleshooting, examples]
```

**Result:**
- Auto-activation based on keywords
- Progressive disclosure reduces token usage
- Slash commands capture deterministic steps
- Reference material loaded only when needed
- Agent still available for complex schema design

---

## Skills and Agents Working Together

### Pattern 1: Skill → Command Execution

1. User request triggers skill (e.g., "Add a column to students")
2. Skill confirms scope and instructs Claude to run matching `/command`
3. Command executes full checklist
4. Main Claude reports outcomes

**Benefits:**
- Procedural logic centralized in command files
- Skill provides context and validation
- Main Claude maintains conversation flow

### Pattern 2: Skill → Agent Escalation

1. User makes general request
2. Skill auto-activates based on keywords
3. Skill encounters complexity beyond its scope
4. Claude delegates to appropriate agent

**Example:**
```
User: "Add a conferences table with complex relationships"
  ↓
database-schema-manager skill activates
  ↓
Skill detects complex many-to-many relationships
  ↓
Claude suggests: "This requires complex schema design.
Should I use the database-schema-manager agent?"
  ↓
Agent handles comprehensive modeling
```

### Pattern 3: Agent → Skill Utilization

1. User explicitly invokes agent
2. Agent performs complex task
3. Agent uses skills for specific subtasks

**Example:**
```
User: "Use backend-developer agent to implement conference scheduling"
  ↓
backend-developer agent activated
  ↓
Agent implements FastAPI endpoints
  ↓
Agent triggers database-schema-manager skill for migrations
  ↓
Agent triggers docs-maintainer skill to update API docs
  ↓
Agent reports completion
```

### Pattern 4: Coordinated Workflow

Main Claude coordinates both skills and agents for multi-faceted tasks.

**Example: Adding New Feature**
```
User: "Add student grade tracking feature"
  ↓
Claude uses database-schema-manager skill
  ↓
Claude delegates to backend-developer agent for API
  ↓
Claude delegates to frontend-developer agent for UI
  ↓
Claude uses docs-maintainer skill to update docs
  ↓
Claude delegates to qa-and-test-engineer for tests
```

### Coordination Best Practices

1. **Clear Handoff Points**
   - Skills should know when to escalate to agents
   - Agents should know which skills to use for subtasks
   - Document integration points in both skills and agents

2. **Avoid Circular Dependencies**
   - Skills should not invoke agents that invoke the same skill
   - Keep delegation hierarchy clear and unidirectional

3. **Success Criteria Alignment**
   - Skills and agents should have compatible success checklists
   - Validate that subtask completion satisfies parent requirements

4. **Context Preservation**
   - Skills share main conversation context
   - Agents have isolated context (intentional for complex tasks)
   - Pass necessary context explicitly when delegating

---

## Summary: Quick Decision Guide

### Choose Global Configuration When:
- ✅ Personal tool preferences
- ✅ Universal development principles
- ✅ Cross-project quality standards

### Choose Project Configuration When:
- ✅ Team-shared workflows
- ✅ Project-specific architecture
- ✅ Domain-specific patterns

### Choose Skills When:
- ✅ Procedural, repeatable workflows
- ✅ Auto-discoverable patterns
- ✅ Context efficiency matters
- ✅ Frequent usage across conversations

### Choose Agents When:
- ✅ Complex, multi-step workflows
- ✅ Domain expertise required
- ✅ Subjective judgment needed
- ✅ Long-running, stateful tasks

### File Size Targets:
- CLAUDE.md: < 200 lines
- SKILL.md: < 500 lines
- REFERENCE.md: < 600 lines
- Commands: < 300 lines

### Progressive Disclosure Pattern:
```
Always Load → Triggered → On-Demand
  Metadata  →  SKILL.md → REFERENCE.md
  ~100 bytes   ~500 lines  ~600 lines
```

---

## Additional Resources

- [Claude Code Official Docs](https://docs.claude.com/en/docs/claude-code)
- [Skills Documentation](https://docs.claude.com/en/docs/claude-code/skills)
- [Subagents Guide](https://docs.claude.com/en/docs/claude-code/sub-agents)
- [Slash Commands](https://docs.claude.com/en/docs/claude-code/slash-commands)
- [Claude Code Feature Protocol](./claude-code-features.md) - Compositional hierarchy
- [Documentation Governance](./documentation-governance.md) - Quality standards

---

**License**: MIT
**Last Updated**: 2025-11-16
**Version**: 1.0
