# CLAUDE.md Line Limit Update - 2025-11-28

## Context
Updated CLAUDE.md line limit from 100 to 200 lines across all documentation and tooling. Also committed prior change adding "Plan Grounding Requirements" section to global CLAUDE.md.

## Mistakes Are Learnings (Read This First)

**Key mistakes in this session**:
1. **Tried editing without reading first**: Attempted to edit `docs/claude-code-best-practices.md` before reading it → Edit tool rejected → Had to read file first then retry edits. Prevention: Always read files before editing (system enforces this anyway).

**Time wasted**: ~30 seconds on rejected edit calls - minimal impact, quick recovery.

## Decisions
- **Line limit 100→200**: User requested more flexibility for CLAUDE.md files. 200 lines allows richer project context while maintaining progressive disclosure principles.
- **Comprehensive update**: Changed all 10 files referencing the limit to maintain consistency.

## Implementation
- Changed `claude-config/CLAUDE.md`: Quality Standards section 100→200
- Changed `.claude/CLAUDE.md`: Documentation Standards section 100→200
- Changed `docs/claude-code-best-practices.md`: 5 occurrences updated (directory structure comments, quality standards, file size table, summary)
- Changed `docs/claude-code-docs-pattern.md`: File size constraints table updated target and max
- Changed `docs/documentation-governance.md`: File size guidelines table updated
- Changed `claude-config/claude-code-features.md`: File size guidelines table
- Changed `.claude/commands/docs/validate-structure.md`: Validation limits
- Changed `.claude/skills/docs-curator/SKILL.md`: 2 occurrences (validation text and standards table)
- Changed `claude-config/commands/session/park.md`: Routing decision table
- Changed `claude-config/commands/session/apply.md`: 4 occurrences (status table thresholds, overflow warning, important notes)

## Lessons
- ✅ Grep with pattern `CLAUDE\.md.*100` efficiently found all occurrences
- ✅ Parallel edits for independent files worked well
- ✅ Reading files before editing is enforced - good safety net
- 💡 When changing a standard/limit, search comprehensively - it's often referenced in many places

## Mistakes & Efficiency Improvements

### Tool Call Failures & Inefficiencies

| Tool | Issue | Better Approach |
|------|-------|-----------------|
| Edit | Failed on `docs/claude-code-best-practices.md` - not read yet | Read file first (did this on retry) |

**Wasted tool calls:** 2 (both Edit calls on best-practices file before reading)
**Sequential→Parallel opportunities:** None missed - used parallel effectively
**Wrong tool selections:** None

### AI Agent Mistakes
1. **Batch edit without read**: Tried to edit best-practices file in same parallel batch as other files without reading it first. Should have read all target files before editing.

### User Mistakes
None - request was clear and straightforward.

## Knowledge Gaps
- None identified - documentation standards are well-documented

## .claude Improvements

### Routing Decision
No improvements needed - this was a simple config update, not a workflow discovery.

### CLAUDE.md
- ✅ Already updated with new 200-line limit

## Related Sessions
- [2025-11-26-park-flywheel-v2-implementation]: Established the park document workflow being used here

## Artifacts
- Files modified: 10 files (listed in Implementation)
- Commits:
  - `9ca6455`: Add plan grounding requirements to global CLAUDE.md
  - `97b7a7b`: Increase CLAUDE.md line limit from 100 to 200 lines
