# Prompt Kit Library

This folder collects ready-to-use LLM documents. Copy the template you need, fill in the blanks, and paste it into your preferred chat interface.

## Available Documents

### Workflows & Planning
- **focus-htk.md** – Extract the best next action from broad inputs using FOCUS + Hypothesis→Test Kernel. Works across software, troubleshooting, and life logistics.
- **project-kickoff.md** – Frame new tasks with goals, constraints, and communication plans.
- **solution-outline.md** – Summarize how to approach a known problem before writing detailed output.
- **debugging-playbook.md** – Walk through reproducing, isolating, and fixing issues methodically.

### Claude Code Architecture
- **claude-code-features.md** – Choose between slash commands, skills, subagents, MCP servers, and hooks using a compositional playbook.
- **claude-knowledge-architecture.md** – Structure modular .claude/ knowledge systems for token efficiency.
- **smart-claude-context-template.md** – Build CLAUDE.md with selective context loading.
- **knowledge-module-template.md** – Template for individual knowledge modules in .claude/.
- **agent-delegation-pattern.md** – Multi-agent workflows for specialized, token-efficient execution.

### Documentation & Diagramming
- **mermaid-diagram-guide.md** – Generate complex Mermaid visuals with working samples and syntax guardrails.
- **writing-style-guide.md** – Keep prose consistent and user-friendly across deliverables.
- **boundary-decomposition-guide.md** – Universal boundary decomposition for any project type.

## Architecture References

Longer guides for complex patterns and system design:
- **../architectures/claude-intelligence-system.md** – Complete system for scalable Claude Code knowledge management (includes project plan, both modular and intelligent context selection approaches, implementation phases, and success metrics).

---

Add new documents as standalone Markdown files. Keep most under ~400 words so they stay easy to reuse, and note when a longer reference is needed.
