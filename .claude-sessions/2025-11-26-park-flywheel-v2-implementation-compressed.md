# Park Flywheel V2 Implementation - 2025-11-26

## Context
User requested improvements to the park flywheel system. Researched industry best practices (spaced repetition, knowledge graphs, DevOps feedback loops, blameless postmortems) and implemented 6 major enhancements. Then identified and fixed a critical routing bug where improvements were being dumped into CLAUDE.md instead of appropriate REFERENCE.md files.

## Mistakes Are Learnings (Read This First)

**Key mistakes in this session**:

1. **Initial implementation had routing flaw**: The park.md template defaulted to "Update CLAUDE.md" for all improvements, causing CLAUDE.md bloat (234 lines in schoolbrain-next vs 100-line limit).
   - Impact: Users accumulate detailed reference material in CLAUDE.md instead of skills
   - Prevention: Added routing decision tree and CLAUDE.md overflow protection

2. **Plan file naming confusion**: System auto-generated "swift-crafting-mitten.md" as plan file name, causing user confusion.
   - Impact: Minor - just funny
   - Prevention: None needed - it's a system behavior for temp files

**Time wasted**: Minimal - caught routing issue during real-world test run review.

## Decisions

- **Spaced repetition for lessons**: FSRS-inspired intervals (7→14→28→56→112 days) with user feedback loop
- **Knowledge graph over grep search**: Entity/relationship model for semantic linking vs keyword grep
- **SLO-based action items**: P0=7d, P1=14d, P2=30d with overdue tracking
- **Multi-signal auto-park triggers**: 2+ conditions (40 msgs, topic drift, decisions, time) vs arbitrary 50-message threshold
- **REFERENCE.md over CLAUDE.md**: Detailed content routes to skill REFERENCE.md, CLAUDE.md only for one-liners

## Implementation

### New Files Created
- `skills/session-management/REFERENCE.md` (508 lines): All YAML schemas for action-items, metrics, lesson-index, knowledge-graph
- `commands/session/remind.md` (222 lines): Spaced repetition lesson surfacing
- `commands/session/link.md` (255 lines): Knowledge graph queries
- `commands/session/health.md` (281 lines): Flywheel metrics dashboard

### Files Updated
- `skills/session-management/SKILL.md` (307 lines): Smart auto-triggers, proactive suggestions, context-aware workflows
- `commands/session/park.md` (372 lines): Lesson extraction, entity extraction, metrics capture, **categorized improvements with routing decision**
- `commands/session/apply.md` (381 lines): SLO tracking, **routing decision tree, CLAUDE.md overflow protection, skill discovery**

## Lessons

- ✅ Web research provided solid foundation (Anthropic context engineering, FSRS algorithm, Google SRE postmortems)
- ✅ Plan mode helped organize complex 6-phase implementation
- ❌ Initial template encouraged CLAUDE.md dumping - needed explicit routing guidance
- 💡 Real-world test run (schoolbrain-next /session:apply) revealed routing flaw that wouldn't have been caught otherwise

## .claude Improvements

### Skills (none needed - this IS the session-management skill)

### Commands (none needed - implemented all planned commands)

### REFERENCE.md
- [x] Created comprehensive REFERENCE.md with all 4 YAML schemas
- [x] Added workflow patterns and troubleshooting sections

### CLAUDE.md
- [ ] Consider adding to global CLAUDE.md: "Route detailed content to REFERENCE.md, not CLAUDE.md"

## Related Sessions
- First implementation of park flywheel v2
- Builds on existing session-management skill

## Artifacts

**Files modified:**
- `skills/session-management/SKILL.md`
- `skills/session-management/REFERENCE.md` (new)
- `commands/session/park.md`
- `commands/session/apply.md`
- `commands/session/remind.md` (new)
- `commands/session/link.md` (new)
- `commands/session/health.md` (new)
- `plans/park-flywheel-v2-plan.md` (new)

**Key features implemented:**
1. Spaced repetition (`lesson-index.yaml` + `/session:remind`)
2. Knowledge graph (`knowledge-graph.yaml` + `/session:link`)
3. SLO action items (`action-items.yaml` with P0/P1/P2)
4. Smart auto-triggers (multi-condition detection)
5. Multi-agent park extraction (optional for complex sessions)
6. Health dashboard (`/session:health`)
7. **Routing intelligence** (CLAUDE.md overflow protection)

**Research sources:**
- Anthropic: Context engineering for AI agents
- Gwern: Spaced repetition guide
- Google SRE: Blameless postmortem culture
- Neo4j: Knowledge graph semantic search
