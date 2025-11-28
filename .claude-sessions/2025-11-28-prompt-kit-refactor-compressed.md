# Prompt-Kit Refactor & Fullstack Starter - 2025-11-28

## Context
User shared SchoolBrain project retrospective showing 36% of commits were preventable fixes. Goal: integrate high-value patterns into prompt-kit while addressing documentation sprawl. User preference: "focused and simple over complicated and sprawling."

## Mistakes Are Learnings (Read This First)

**Key insight**: The existing `experiments/repository-restructure-recommendations.md` (644 lines) was itself documentation sprawl - a comprehensive plan that was never implemented. The solution was to delete it, not implement it.

**No significant mistakes this session** - clean execution with parallel tool calls where appropriate.

## Decisions

- **Delete over archive**: Sprawl files deleted entirely rather than archived. Cleaner, no dead weight.
- **Enhance existing docs over creating new ones**: Pre-flight checklist added to `project-kickoff.md`, defensive patterns to `debugging-playbook.md`. No new files needed.
- **Minimal boilerplate**: `templates/fullstack-starter/` contains only a CLAUDE.md template (112 lines), not full code templates. prompt-kit is a docs library, not a code boilerplate repo.
- **Aggressive trimming**: Best-practices file cut from 862→283 lines by removing verbose templates and the entire "Converting Agents to Skills" section (edge case).

## Implementation

### Deleted (9 files, ~3,400 lines)
- `architectures/claude-intelligence-system.md` - Abandoned experiment
- `docs/claude-code-docs-pattern.md` (741 lines) - Overlapped with best-practices
- `docs/documentation-governance.md` (473 lines) - Overlapped with best-practices
- `docs/smart-claude-context-template.md` - Superseded
- `docs/knowledge-module-template.md` (245 lines) - Superseded
- `experiments/*.md` (3 files, 1,635 lines) - Research artifacts never acted on
- `claude-config/prompt-packs/` - Duplicated commands/

### Trimmed
- `docs/claude-code-best-practices.md`: 862 → 283 lines (removed TOC, verbose templates, "Converting Agents to Skills" section)
- `claude-config/skills/htk-workflow/REFERENCE.md`: 692 → 312 lines (condensed examples, removed redundant patterns)

### Enhanced
- `docs/project-kickoff.md`: Added Day-0 pre-flight checklist (auth, API contract, frontend patterns, infrastructure locks), common rework triggers
- `docs/debugging-playbook.md`: Added defensive coding patterns (API unwrapping, mock mode coverage, env var propagation), infrastructure verification commands, common issue patterns

### Created
- `templates/fullstack-starter/README.md` - Usage instructions
- `templates/fullstack-starter/.claude/CLAUDE.md` - 112-line template with pre-flight checklist

### Updated
- `docs/index.md` - Reflects changes, links to new template

## Lessons
- ✅ Deleting sprawl is better than reorganizing it
- ✅ High-value patterns from retro fit naturally into existing docs (no new files needed)
- ✅ Minimal template more useful than comprehensive boilerplate
- 💡 Documentation sprawl accumulates when plans aren't executed - better to delete stale plans

## Mistakes & Efficiency Improvements

### Tool Call Analysis
| Tool | Issue | Resolution |
|------|-------|------------|
| Bash find | Syntax error with escaped `!` | Non-critical, results still obtained via separate wc command |

**Wasted tool calls:** 0 - All reads/writes successful
**Sequential→Parallel opportunities:** Used parallel writes for trim operations ✅
**Wrong tool selections:** None

### AI Agent Mistakes
None significant. Correctly:
- Proposed deletion over the never-implemented 4-phase restructure
- Kept boilerplate minimal (CLAUDE.md only, not code templates)
- Integrated patterns into existing docs rather than creating sprawl

### Times AI Correctly Pushed Back
- **Questioned creating new skills**: Retro proposed auth-flow-tracer, api-contract-validator, infrastructure-checker skills. Pushed back: "These are project-specific. prompt-kit is a documentation library, not a fullstack boilerplate."

## Knowledge Gaps
- None identified this session

## .claude Improvements

### Routing Decision
No CLAUDE.md changes needed - patterns were integrated into existing docs.

### Skills
- None needed

### Commands
- None needed

### REFERENCE.md
- None needed

## Artifacts
- Files deleted: 9 (architectures/, docs/4 files, experiments/3 files, prompt-packs/)
- Files modified: 6 (claude-code-best-practices.md, htk-workflow/REFERENCE.md, project-kickoff.md, debugging-playbook.md, index.md)
- Files created: 2 (templates/fullstack-starter/README.md, templates/fullstack-starter/.claude/CLAUDE.md)
- Net change: ~-3,000 lines (deleted ~3,400, added ~400)
