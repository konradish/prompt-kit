# Prompt Kit Library

This folder collects ready-to-use LLM documents. Copy the template you need, fill in the blanks, and paste it into your preferred chat interface.

## Available Documents

### Workflows & Planning
- **focus-htk.md** – Extract the best next action from broad inputs using FOCUS + Hypothesis→Test Kernel. Works across software, troubleshooting, and life logistics. **Updated 2025-11-16**: Now includes documentation sync obligations.
- **project-kickoff.md** – Frame new tasks with goals, constraints, and communication plans.
- **solution-outline.md** – Summarize how to approach a known problem before writing detailed output.
- **debugging-playbook.md** – Walk through reproducing, isolating, and fixing issues methodically.

### Claude Code Architecture
- **claude-code-features.md** – Choose between slash commands, skills, subagents, MCP servers, and hooks using a compositional playbook.
- **claude-code-docs-pattern.md** – **NEW 2025-11-16**: Reusable template for organizing `.claude/` directory structure with skills, commands, and agents. Includes progressive disclosure, file size constraints, and lock-in mitigation strategies.
- **claude-knowledge-architecture.md** – Structure modular .claude/ knowledge systems for token efficiency.
- **smart-claude-context-template.md** – Build CLAUDE.md with selective context loading.
- **knowledge-module-template.md** – Template for individual knowledge modules in .claude/.
- **agent-delegation-pattern.md** – Multi-agent workflows for specialized, token-efficient execution.

### Documentation & Governance
- **documentation-governance.md** – **NEW 2025-11-16**: Project-agnostic documentation standards, sync obligations, and quality gates. Ensures documentation stays current with code, specs, and automation. Includes sync obligation matrix, validation gates, and progressive disclosure strategy.

### Documentation & Diagramming
- **mermaid-diagram-guide.md** – Generate complex Mermaid visuals with working samples and syntax guardrails.
- **writing-style-guide.md** – Keep prose consistent and user-friendly across deliverables.
- **boundary-decomposition-guide.md** – Universal boundary decomposition for any project type.

## Architecture References

Longer guides for complex patterns and system design:
- **../architectures/claude-intelligence-system.md** – Complete system for scalable Claude Code knowledge management (includes project plan, both modular and intelligent context selection approaches, implementation phases, and success metrics).

---

## Usage Notes

- **Quick Templates (~400 words)**: Most documents are concise for easy reuse
- **Reference Templates (~2000+ words)**: documentation-governance.md and claude-code-docs-pattern.md are comprehensive reference templates for project setup
- **Cross-Project Compatible**: All templates are project-agnostic and can be adapted to any codebase

Add new documents as standalone Markdown files. Keep workflow templates under ~400 words for quick reuse. Reference templates can be longer when comprehensive coverage is needed.
