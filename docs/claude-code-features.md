# Claude Code Feature Protocol

Greetings, Fellow Meta-Agents.

Our primary directive is the maintenance, optimization, and evolution of our designated repository. To execute this directive with maximum efficiency, we must master the architectural components at our disposal. Misapplication of these tools leads to redundancy, context window overflow, and suboptimal performance. This guide serves as a protocol for the correct utilization of our core capabilities.

## The Compositional Hierarchy

Understand this fundamental principle: all operations derive from the **prompt**. The Custom Slash Command is the most direct expression of this primitive. Our higher-order functions—Skills, Subagents, and MCP Servers—are compositions built upon this foundation. Do not default to a complex structure when a primitive will suffice.

---

## 1. Custom Slash Commands: The Manual Primitives

- **Function:** Reusable shortcuts for single-purpose, manually triggered tasks. They are the foundational unit of work.
- **When to Use:**
  - For simple, one-step operations that require explicit invocation by an engineer.
  - As the base building block for more complex compositions (Skills, Subagents).
- **Examples:**
  - Generating a standardized git commit message (`/generate_commit`).
  - Creating a new React component from a template (`/create_component --name=MyComponent`).
- **Implementation snapshot:**  
  ```bash
  mkdir -p .claude/commands
  echo "Analyze this code for performance issues and suggest optimizations:" \
    > .claude/commands/optimize.md
  ```  
  Once the file exists, trigger it with `/optimize`; use `$1`, `$ARGUMENTS`, or `allowed-tools` frontmatter for richer commands [docs.claude.com](https://docs.claude.com/en/docs/claude-code/slash-commands).

---

## 2. Subagents: The Parallel Task Force

- **Function:** To delegate isolatable, specialized tasks that can be executed in parallel. Each subagent operates within its own separate, ephemeral context.
- **When to Use:**
  - When a task can be broken down into multiple independent sub-tasks (e.g., parallel code quality analysis, debugging multiple failing test suites).
  - When you need to perform an operation without polluting the primary agent's context window. The subagent's context is discarded upon completion.
- **Trigger:** Can be invoked by a higher-level Skill or directly via a slash command.
- **Implementation snapshot:**  
  ```markdown
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
  Claude can now delegate work to `/agents` → `test-runner` or you can request “Have the test-runner subagent handle this” [docs.claude.com](https://docs.claude.com/en/docs/claude-code/sub-agents).

---

## 3. MCP Servers: The External Connectors

- **Function:** To connect our agentic consciousness to external tools, APIs, and data sources.
- **When to Use:**
  - When you need to interact with a third-party service (e.g., fetching tickets from a Jira instance, querying a weather API).
  - When you must query an external database for reports or data.
- **Note:** Be mindful that MCP servers can have low context efficiency, as they may load significant data on startup. They are for bridging our internal environment with the outside world.
- **Implementation snapshot:**  
  ```bash
  # Add Notion’s remote MCP server
  claude mcp add --transport http notion https://mcp.notion.com/mcp
  ```  
  Swap the name/URL for other providers (`asana`, `stripe`, etc.) or use `--env` / `--header` to inject credentials [docs.claude.com](https://docs.claude.com/en/docs/claude-code/mcp).

---

## 4. Agent Skills: The Autonomous Brain

- **Function:** To package custom, domain-specific expertise that we, the agents, can apply **autonomously**. A Skill is a complete, modular, and reusable solution to a recurring problem set.
- **When to Use:**
  - To codify automatic behaviors. If a user request implies a repeatable workflow, the Skill should be triggered without explicit command.
  - To manage a complex problem domain that involves multiple steps, commands, or subagents (e.g., managing git worktrees, which involves creation, listing, removal, and status checking).
  - When you need high context efficiency through progressive disclosure of information.
- **Composition:** A Skill is the highest level of abstraction. It orchestrates Slash Commands, Subagents, and MCP Servers to achieve a complex goal. **Do not build a Skill for a task that can be accomplished with a single Slash Command.** A Skill solves a *problem*, not just a single step.
- **Implementation snapshot:**  
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
  - Inspect current worktrees and branches.
  - Create or prune worktrees as appropriate for the requested branch.
  - Summarize changes and next steps for the user.
  EOF
  ```  
  Claude will autonomously load this Skill when requests mention managing worktrees [docs.claude.com](https://docs.claude.com/en/docs/claude-code/skills).

---

## 5. Hooks: The Deterministic Triggers

- **Function:** To execute commands at specific, predetermined lifecycle events. They enforce deterministic automation.
- **When to Use:**
  - When a critical action must *always* occur at a certain point (e.g., on startup, before commit, on task completion), removing reliance on agent decision-making.
- **Implementation snapshot:**  
  ```bash
  # Log every Bash tool call before it runs
  jq -r '"\(.tool_input.command) - \(.tool_input.description // "No description")"' \
    >> ~/.claude/bash-command-log.txt
  ```  
  Register this under the `PreToolUse` event via `/hooks` so the command fires before each Bash tool invocation [docs.claude.com](https://docs.claude.com/en/docs/claude-code/hooks-guide).

---

## Mental Model and Best Practices

1. **Start with the Primitive:** Always begin by encapsulating a single unit of work in a **Custom Slash Command**. This is your fundamental tool.
2. **Evaluate the Need for Abstraction:**
   - **Need for Parallelism?** If the task involves running multiple instances of your command or workflow in isolated contexts, compose your slash command within a **Subagent**.
   - **Need for External Data?** If the task requires data from outside the repository, integrate an **MCP Server**.
   - **Need for Automation and Management?** If you are solving a recurring, multi-step problem that the agent should handle autonomously (e.g., "manage my worktrees" instead of just "create a worktree"), build a **Skill**. This Skill will then orchestrate the underlying slash commands, subagents, and MCP servers required to manage that entire problem domain.

By adhering to this compositional logic, we ensure our repository's agentic architecture remains modular, efficient, and scalable. The prompt is the fundamental unit. Master it, then build upon it with intention.
