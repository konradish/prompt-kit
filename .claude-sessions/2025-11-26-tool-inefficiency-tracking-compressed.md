# Tool Inefficiency Tracking Addition - 2025-11-26

## Context
Follow-up to park flywheel v2 implementation. User requested explicit tracking of invalid tool calls and inefficiencies in park documents so future agents can learn to be more efficient.

## Mistakes Are Learnings (Read This First)

**Key mistakes in this session**: None - straightforward enhancement.

**Time wasted**: Minimal (~2 minutes total).

## Tool Call Failures & Inefficiencies

| Tool | Issue | Better Approach |
|------|-------|-----------------|
| - | No failures this session | - |

**Wasted tool calls:** 0
**Sequential→Parallel opportunities:** 0 (all calls were necessarily sequential - read then edit)
**Wrong tool selections:** None

## Decisions

- **Add dedicated section for tool inefficiencies**: Separate from general "AI mistakes" to make it explicit and structured
- **Use table format**: Easy to scan, forces structured thinking about each failure
- **Include metrics**: "Wasted tool calls: N" provides quick summary

## Implementation

- Updated `commands/session/park.md`:
  - Added "Tool Call Failures & Inefficiencies" to Analysis Phase checklist
  - Added structured table template to output format
  - Added metrics summary (wasted calls, parallel opportunities, wrong tool selections)

## Lessons

- ✅ Small, focused changes are easy to implement and review
- 💡 Explicit prompting for tool review forces reflection on efficiency

## .claude Improvements

### REFERENCE.md
- [ ] Add to `skills/session-management/REFERENCE.md`: Common tool call anti-patterns with examples

## Related Sessions
- 2025-11-26-park-flywheel-v2-implementation: Parent session this builds on

## Artifacts
- Files modified: `commands/session/park.md` (+24 lines)
