# Claude Code Feature Protocol

This document explains the architectural components of Claude Code and when to use each feature. This is universal documentation that applies across all projects.

## The Compositional Hierarchy

All operations derive from the **prompt**. The Custom Slash Command is the most direct expression of this primitive. Higher-order functions—Skills, Subagents, and MCP Servers—are compositions built upon this foundation. Do not default to a complex structure when a primitive will suffice.

---

## 1. Custom Slash Commands: The Manual Primitives

- **Function:** Reusable shortcuts for single-purpose, manually triggered tasks. The foundational unit of work.
- **When to Use:**
  - For simple, one-step operations requiring explicit invocation
  - As the base building block for more complex compositions (Skills, Subagents)
- **Examples:**
  - Generating a standardized git commit message (`/generate_commit`)
  - Creating a new React component from template (`/create_component --name=MyComponent`)
- **Implementation:**
  ```bash
  mkdir -p .claude/commands
  echo "Analyze this code for performance issues and suggest optimizations:" \
    > .claude/commands/optimize.md
  ```
  Once the file exists, trigger with `/optimize`; use `$1`, `$ARGUMENTS`, or `allowed-tools` frontmatter for richer commands.

  [Official Docs](https://docs.claude.com/en/docs/claude-code/slash-commands)

---

## 2. Subagents: The Parallel Task Force

- **Function:** Delegate isolatable, specialized tasks that can execute in parallel. Each operates in separate, ephemeral context.
- **When to Use:**
  - When tasks break into multiple independent sub-tasks (e.g., parallel code quality analysis, debugging multiple test suites)
  - When operation shouldn't pollute primary agent's context (subagent context discarded on completion)
- **Trigger:** Invoked by higher-level Skill or directly via slash command
- **Implementation:**
  ```bash
  mkdir -p .claude/agents
  cat <<'EOF' > .claude/agents/test-runner.md
  ---
  name: test-runner
  description: Run project tests and debug failures before handing results back.
  tools: Read, Bash
  model: sonnet
  ---
  You are a test automation expert. Identify the right test command, run it,
  and fix straightforward failures.
  EOF
  ```
  Claude can delegate to `/agents` → `test-runner` or user can request "Have the test-runner subagent handle this".

  [Official Docs](https://docs.claude.com/en/docs/claude-code/sub-agents)

---

## 3. MCP Servers: The External Connectors

- **Function:** Connect Claude to external tools, APIs, and data sources.
- **When to Use:**
  - Interacting with third-party services (e.g., Jira tickets, weather API)
  - Querying external databases for reports/data
- **Note:** Can have low context efficiency (may load significant data on startup). For bridging internal environment with outside world.
- **Implementation:**
  ```bash
  # Add Notion's remote MCP server
  claude mcp add --transport http notion https://mcp.notion.com/mcp
  ```
  Swap name/URL for other providers (`asana`, `stripe`, etc.) or use `--env` / `--header` for credentials.

  [Official Docs](https://docs.claude.com/en/docs/claude-code/mcp)

---

## 4. Agent Skills: The Autonomous Brain

- **Function:** Package custom, domain-specific expertise that agents apply **autonomously**. Complete, modular, reusable solution to recurring problems.
- **When to Use:**
  - Codify automatic behaviors (repeatable workflows trigger without explicit command)
  - Manage complex problem domains with multiple steps, commands, or subagents (e.g., git worktree management)
  - Need high context efficiency through progressive disclosure
- **Composition:** Highest level of abstraction. Orchestrates Slash Commands, Subagents, and MCP Servers for complex goals.
  - **Do not build a Skill for single Slash Command tasks**
  - Skills solve *problems*, not just single steps
- **Implementation:**
  ```bash
  mkdir -p .claude/skills/worktree-manager
  cat <<'EOF' > .claude/skills/worktree-manager/SKILL.md
  ---
  name: worktree-manager
  description: Manage git worktrees—create, list, prune, and sync branches.
  allowed-tools: Bash(git worktree:*), Read
  ---
  # Worktree Manager

  ## Instructions
  - Inspect current worktrees and branches
  - Create or prune worktrees as appropriate for requested branch
  - Summarize changes and next steps for user
  EOF
  ```
  Claude autonomously loads this Skill when requests mention managing worktrees.

  [Official Docs](https://docs.claude.com/en/docs/claude-code/skills)

---

## 5. Hooks: The Deterministic Triggers

- **Function:** Execute commands at specific, predetermined lifecycle events. Enforce deterministic automation.
- **When to Use:**
  - Critical actions that must *always* occur at certain points (e.g., on startup, before commit, on task completion)
  - Remove reliance on agent decision-making
- **Implementation:**
  ```bash
  # Log every Bash tool call before it runs
  jq -r '"\\(.tool_input.command) - \\(.tool_input.description // \"No description\")"' \
    >> ~/.claude/bash-command-log.txt
  ```
  Register under `PreToolUse` event via `/hooks` so command fires before each Bash tool invocation.

  [Official Docs](https://docs.claude.com/en/docs/claude-code/hooks-guide)

---

## Mental Model and Best Practices

1. **Start with the Primitive:** Always begin by encapsulating a single unit of work in a **Custom Slash Command**. This is your fundamental tool.

2. **Evaluate the Need for Abstraction:**
   - **Need for Parallelism?** If task involves running multiple instances of your command/workflow in isolated contexts, compose slash command within a **Subagent**.
   - **Need for External Data?** If task requires data from outside repository, integrate an **MCP Server**.
   - **Need for Automation and Management?** If solving a recurring, multi-step problem agent should handle autonomously (e.g., "manage my worktrees" vs just "create a worktree"), build a **Skill**. This Skill orchestrates underlying slash commands, subagents, and MCP servers for the entire problem domain.

By adhering to this compositional logic, we ensure agentic architecture remains modular, efficient, and scalable. The prompt is the fundamental unit. Master it, then build upon it with intention.

---

## Progressive Disclosure Strategy

Skills use three-tier loading to minimize token usage:

### Tier 1: Metadata (Always Loaded)
```yaml
---
name: database-schema-manager
description: Use this skill when making database schema changes...
---
```
**Token cost:** ~100 bytes per skill

### Tier 2: SKILL.md (Loaded When Triggered)
- Core workflow instructions
- Step-by-step procedures
- Common scenarios
- Links to reference materials

**Token cost:** ~500-1000 lines
**Target:** Keep under 500 lines

### Tier 3: REFERENCE.md (Loaded On-Demand)
- Detailed technical reference
- Complete API documentation
- Extensive examples
- Troubleshooting guides

**Token cost:** Unbounded, loaded only when Claude needs it
**Critical rule:** Keep references one level deep from SKILL.md

---

## File Size Guidelines

| File Type | Max Lines | Reasoning |
|-----------|-----------|-----------|
| **SKILL.md** | 500 | Core workflow only; link to REFERENCE.md for details |
| **REFERENCE.md** | 600 | Detailed specs; loaded on-demand via progressive disclosure |
| **CLAUDE.md** | 200 | Quick reference only; link to docs/ for details |
| **Commands (/.claude/commands/)** | 300 | Single responsibility per command |

**Progressive Disclosure Pattern:**
1. Metadata (always loaded) - ~100 bytes
2. SKILL.md (loaded when triggered) - ~500 lines
3. REFERENCE.md (loaded when needed) - ~600 lines

This minimizes token usage while maintaining comprehensive coverage.

---

## Skill Authoring Best Practices

### Structure Guidelines

**SKILL.md should include:**
1. Purpose and trigger conditions
2. Step-by-step workflow
3. Common scenarios with examples
4. Links to REFERENCE.md for details
5. Success criteria checklist

**REFERENCE.md should include:**
- Complete technical specifications
- Extensive examples and patterns
- Troubleshooting procedures
- API references and command lists

### Content Principles

1. **Conciseness is essential** - Context window is shared
2. **Match specificity to task fragility** - Strict steps for error-prone tasks
3. **Use gerund form for naming** - `processing-pdfs`, not `process-pdfs`
4. **Write descriptions in third person** - "Processes files" not "I process files"
5. **Provide concrete examples** - Show input/output, not abstract concepts

### Tool Restrictions

Use `allowed-tools` to restrict access:

```yaml
---
name: docs-maintainer
allowed-tools: Read, Edit, Write, Glob, Grep
---
```

**Benefits:**
- Prevents scope creep
- Forces focused workflows
- Improves security for sensitive tasks
- Reduces cognitive load
