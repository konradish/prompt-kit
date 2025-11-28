# Prompt Kit Library

Ready-to-use LLM documents and Claude Code configuration patterns.

## Quick Start Templates

### Starter Templates
- **[templates/fullstack-starter/](../templates/fullstack-starter/)** – **NEW**: Minimal Claude Code config for fullstack projects with Day-0 pre-flight checklist. Prevents common rework patterns.

### Workflows & Planning
- **[focus-htk.md](./focus-htk.md)** – FOCUS + Hypothesis→Test Kernel methodology. Works across software, troubleshooting, and life logistics.
- **[project-kickoff.md](./project-kickoff.md)** – Frame new tasks with goals, constraints, and Day-0 pre-flight checklist. **Updated**: Now includes fullstack pre-flight checklist.
- **[solution-outline.md](./solution-outline.md)** – Summarize approach to a known problem before writing detailed output.
- **[debugging-playbook.md](./debugging-playbook.md)** – Walk through reproducing, isolating, and fixing issues. **Updated**: Now includes defensive coding patterns and infrastructure verification commands.

## Claude Code Architecture

- **[claude-code-best-practices.md](./claude-code-best-practices.md)** – Skills vs agents, global vs project config, progressive disclosure, file size standards. **Trimmed to ~280 lines**.
- **[claude-code-features.md](./claude-code-features.md)** – Choose between slash commands, skills, subagents, MCP servers, and hooks.
- **[agent-delegation-pattern.md](./agent-delegation-pattern.md)** – Multi-agent workflows for specialized, token-efficient execution.

## Documentation & Diagramming

- **[mermaid-diagram-guide.md](./mermaid-diagram-guide.md)** – Generate complex Mermaid visuals with working samples.
- **[writing-style-guide.md](./writing-style-guide.md)** – Keep prose consistent and user-friendly.
- **[boundary-decomposition-guide.md](./boundary-decomposition-guide.md)** – Universal boundary decomposition for any project type.

---

## File Size Standards

| File Type | Max Lines | Purpose |
|-----------|-----------|---------|
| CLAUDE.md | 200 | Quick reference, always loaded |
| SKILL.md | 500 | Core workflow, triggered on keywords |
| REFERENCE.md | 600 | Detailed specs, loaded on-demand |

---

## Usage Notes

- **Quick Templates** (~100-300 lines): Most workflow docs are concise for easy reuse
- **Reference Docs** (~300-600 lines): Architecture guides provide more detail
- **Starter Templates**: Copy to your project and customize

Add new documents as standalone Markdown files. Keep workflow templates concise. Use progressive disclosure for detailed content.
