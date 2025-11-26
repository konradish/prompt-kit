# Session Management Reference

Comprehensive schemas, patterns, and technical details for the park flywheel system.

## Table of Contents

1. [Data Schemas](#data-schemas)
2. [File Locations](#file-locations)
3. [Workflow Patterns](#workflow-patterns)
4. [Troubleshooting](#troubleshooting)

---

## Data Schemas

### action-items.yaml

Tracks `.claude` improvements with SLO-based deadlines.

```yaml
# .claude-sessions/action-items.yaml
# Generated/updated by /session:apply

version: 1
items:
  - id: ai-YYYY-MM-DD-NNN        # Unique identifier
    description: string          # Actionable improvement (imperative form)
    source: string               # Park doc filename (without path)
    priority: P0|P1|P2           # P0=critical, P1=high, P2=medium
    category: skill|command|claude-md|reference-md|other
    slo_days: 14|30              # P0/P1=14 days, P2=30 days
    created: YYYY-MM-DD          # Date extracted from park doc
    due: YYYY-MM-DD              # created + slo_days
    status: pending|in_progress|completed|deferred
    completed_date: YYYY-MM-DD   # Set when status=completed
    defer_reason: string         # Required when status=deferred
```

**Priority Assignment Rules:**
- **P0 (Critical)**: Security issues, data loss risks, blocking bugs
- **P1 (High)**: Repeated 3+ times across sessions, significant efficiency gains
- **P2 (Medium)**: Nice-to-have improvements, minor conveniences

**Example:**
```yaml
version: 1
items:
  - id: ai-2025-11-15-001
    description: "Add OAuth validation skill with auto-activation on 'oauth', 'redirect'"
    source: 2025-11-15-oauth-flow-compressed.md
    priority: P1
    category: skill
    slo_days: 14
    created: 2025-11-15
    due: 2025-11-29
    status: pending

  - id: ai-2025-11-18-001
    description: "Update CLAUDE.md with parallel validation pattern"
    source: 2025-11-18-refactor-compressed.md
    priority: P2
    category: claude-md
    slo_days: 30
    created: 2025-11-18
    due: 2025-12-18
    status: completed
    completed_date: 2025-11-20
```

---

### metrics.yaml

Tracks flywheel health and effectiveness over time.

```yaml
# .claude-sessions/metrics.yaml
# Updated by /session:apply and /session:park

version: 1
period_start: YYYY-MM-DD         # Start of tracking period
period_end: YYYY-MM-DD           # Current date (updated each run)

capture:
  sessions_parked: 0             # Total sessions parked
  avg_compression_ratio: 0.0     # Avg (park_doc_lines / conversation_messages)
  lessons_captured: 0            # Total lessons in lesson-index.yaml
  action_items_created: 0        # Total items created
  mistakes_documented: 0         # Total mistakes across all park docs

application:
  action_items_completed: 0      # Items with status=completed
  action_items_overdue: 0        # Items past due date
  skills_created: 0              # Skills created from action items
  commands_created: 0            # Commands created from action items
  claude_md_updates: 0           # CLAUDE.md updates from action items

effectiveness:
  repeated_mistakes: 0           # Same mistake in multiple sessions
  lessons_resurfaced: 0          # Lessons shown via /session:remind
  lessons_applied: 0             # User confirmed lesson was useful
  related_sessions_linked: 0     # Sessions connected via knowledge graph

history:
  - date: YYYY-MM-DD
    event: parked|applied|reminded|linked
    details: string              # Brief description of what happened
```

**Example:**
```yaml
version: 1
period_start: 2025-11-01
period_end: 2025-11-26

capture:
  sessions_parked: 12
  avg_compression_ratio: 0.15
  lessons_captured: 34
  action_items_created: 18
  mistakes_documented: 23

application:
  action_items_completed: 14
  action_items_overdue: 2
  skills_created: 3
  commands_created: 5
  claude_md_updates: 4

effectiveness:
  repeated_mistakes: 2
  lessons_resurfaced: 8
  lessons_applied: 6
  related_sessions_linked: 15

history:
  - date: 2025-11-26
    event: applied
    details: "Processed 3 park docs, created 2 action items"
  - date: 2025-11-25
    event: parked
    details: "oauth-refresh-token-flow: 3 decisions, 2 lessons"
```

---

### lesson-index.yaml

Spaced repetition index for high-value lessons.

```yaml
# .claude-sessions/lesson-index.yaml
# Extracted during /session:park, surfaced by /session:remind

version: 1
lessons:
  - id: lesson-YYYY-MM-DD-NNN    # Unique identifier
    source: string               # Park doc filename
    lesson: string               # One-sentence lesson (actionable)
    category: security|efficiency|architecture|debugging|workflow|testing
    impact: high|medium|low      # How significant is this lesson
    keywords: [string]           # For semantic matching to current work

    # FSRS-inspired spaced repetition scheduling
    last_surfaced: YYYY-MM-DD    # When lesson was last shown
    surface_after: YYYY-MM-DD    # Don't show before this date
    interval_days: 7             # Current interval (doubles on apply)
    times_surfaced: 0            # How many times shown to user
    times_applied: 0             # How many times user confirmed useful
```

**Interval Progression (FSRS-inspired):**
- Initial: 7 days
- After 1st apply: 14 days
- After 2nd apply: 28 days
- After 3rd apply: 56 days
- After 4th apply: 112 days
- If not applied: Reset to 7 days

**Category Definitions:**
- **security**: Auth, validation, injection prevention, CSRF, secrets
- **efficiency**: Parallel execution, caching, tool selection, shortcuts
- **architecture**: Design patterns, file structure, module boundaries
- **debugging**: Root cause analysis, logging, error handling
- **workflow**: Git practices, CI/CD, deployment, testing strategies
- **testing**: Test patterns, coverage, mocking, fixtures

**Example:**
```yaml
version: 1
lessons:
  - id: lesson-2025-11-15-001
    source: 2025-11-15-oauth-flow-compressed.md
    lesson: "Always verify OAuth state param matches before redirect to prevent CSRF"
    category: security
    impact: high
    keywords: [oauth, state, csrf, redirect, security, authentication]
    last_surfaced: 2025-11-15
    surface_after: 2025-11-22
    interval_days: 7
    times_surfaced: 1
    times_applied: 0

  - id: lesson-2025-11-18-001
    source: 2025-11-18-refactor-compressed.md
    lesson: "Run ruff+mypy+pytest in parallel for 3x faster validation"
    category: efficiency
    impact: medium
    keywords: [parallel, validation, ruff, mypy, pytest, linting]
    last_surfaced: 2025-11-18
    surface_after: 2025-12-02
    interval_days: 14
    times_surfaced: 2
    times_applied: 1
```

---

### knowledge-graph.yaml

Semantic relationships between sessions, entities, and concepts.

```yaml
# .claude-sessions/knowledge-graph.yaml
# Built during /session:park, queried by /session:link

version: 1

entities:
  - name: string                 # Entity name (lowercase, hyphenated)
    type: feature|domain|component|pattern|bug|file
    sessions: [string]           # Park doc filenames mentioning this entity
    keywords: [string]           # Related terms for fuzzy matching
    first_seen: YYYY-MM-DD       # When entity first appeared
    last_updated: YYYY-MM-DD     # Most recent session mentioning it

relationships:
  - from: string                 # Entity name or session filename
    to: string                   # Entity name or session filename
    type: builds_on|caused_by|related_to|implements|fixes|uses
    strength: high|medium|low    # How strong is the connection
    context: string              # Brief explanation (1 sentence)
```

**Entity Types:**
- **feature**: User-facing functionality (oauth, dark-mode, export)
- **domain**: Business/technical domain (authentication, payments, api)
- **component**: Code component (user-service, database, cache)
- **pattern**: Design pattern (retry-logic, circuit-breaker, cqrs)
- **bug**: Known issue or fix (memory-leak, race-condition)
- **file**: Specific file path (src/auth/oauth.py)

**Relationship Types:**
- **builds_on**: Session extends work from another session
- **caused_by**: Bug/issue was caused by something
- **related_to**: General topical relationship
- **implements**: Session implements a feature/pattern
- **fixes**: Session fixes a bug
- **uses**: Entity uses another entity

**Example:**
```yaml
version: 1

entities:
  - name: oauth
    type: feature
    sessions: [2025-11-15-oauth-flow, 2025-11-12-jwt-tokens]
    keywords: [authentication, redirect, state-param, google-oauth, sso]
    first_seen: 2025-11-12
    last_updated: 2025-11-15

  - name: authentication
    type: domain
    sessions: [2025-11-15-oauth-flow, 2025-11-12-jwt-tokens, 2025-11-10-auth-testing]
    keywords: [login, logout, session, token, auth, security]
    first_seen: 2025-11-10
    last_updated: 2025-11-15

  - name: src/auth/oauth.py
    type: file
    sessions: [2025-11-15-oauth-flow]
    keywords: [oauth, redirect, callback, google]
    first_seen: 2025-11-15
    last_updated: 2025-11-15

relationships:
  - from: 2025-11-15-oauth-flow
    to: 2025-11-12-jwt-tokens
    type: builds_on
    strength: high
    context: "OAuth flow uses JWT tokens for session management"

  - from: oauth
    to: authentication
    type: related_to
    strength: high
    context: "OAuth is an authentication mechanism"

  - from: 2025-11-15-oauth-flow
    to: state-param-csrf-bug
    type: fixes
    strength: high
    context: "Fixed CSRF vulnerability in OAuth state parameter handling"
```

---

## File Locations

### Global (all projects)

```
~/.claude/
├── skills/
│   └── session-management/
│       ├── SKILL.md              # Core workflows, triggers
│       └── REFERENCE.md          # This file - schemas, patterns
├── commands/
│   └── session/
│       ├── park.md               # Create park document
│       ├── apply.md              # Apply improvements
│       ├── note.md               # Quick session note
│       ├── remind.md             # Spaced repetition
│       ├── health.md             # Metrics dashboard
│       └── link.md               # Knowledge graph query
```

### Per-Project

```
<project>/
└── .claude-sessions/
    ├── action-items.yaml         # SLO-tracked improvements
    ├── lesson-index.yaml         # Spaced repetition lessons
    ├── knowledge-graph.yaml      # Entity relationships
    ├── metrics.yaml              # Flywheel health metrics
    ├── current-session-notes.md  # Running notes for active session
    ├── YYYY-MM-DD-*-compressed.md # Park documents
    └── archive/                  # Park docs > 30 days old
```

---

## Workflow Patterns

### Pattern 1: End-of-Session Park

**Trigger:** User says "park", "wrap up", "done for now"

**Flow:**
1. Analyze conversation for decisions, mistakes, lessons
2. Extract entities and relationships for knowledge graph
3. Generate compressed park document
4. Update metrics.yaml capture stats
5. Append lessons to lesson-index.yaml
6. Update knowledge-graph.yaml
7. Report summary to user

### Pattern 2: Weekly Apply Cycle

**Trigger:** User runs `/session:apply` or "apply improvements"

**Flow:**
1. Scan park docs from last 7 days
2. Extract `.claude Improvements` sections
3. Deduplicate and prioritize by frequency
4. Create/update action-items.yaml entries
5. Report overdue items prominently
6. Update metrics.yaml application stats
7. Suggest which items to tackle first

### Pattern 3: Contextual Remind

**Trigger:** User runs `/session:remind` or starts related task

**Flow:**
1. Read lesson-index.yaml
2. Find lessons where surface_after <= today
3. If user provided context, filter by keyword match
4. Present 2-3 most relevant lessons
5. Ask "Applied this? [y/n]"
6. Update intervals based on response
7. Update metrics.yaml effectiveness stats

### Pattern 4: Knowledge Graph Query

**Trigger:** User runs `/session:link <query>`

**Flow:**
1. Search entities by name and keywords
2. Find sessions containing matched entities
3. Traverse relationships for related sessions
4. Present results grouped by relevance
5. Offer to load full park document
6. Update metrics.yaml linking stats

### Pattern 5: Proactive Park Suggestion

**Trigger:** 2+ auto-park conditions met

**Conditions:**
- Message count >= 40
- Task completion signal detected
- Topic drift (3+ unrelated tool calls)
- Context usage >= 80%
- Time elapsed >= 2 hours
- Decision count >= 5

**Flow:**
1. Detect conditions during normal operation
2. When 2+ conditions met, suggest parking
3. Show summary of what would be captured
4. User decides to park or continue

---

## Troubleshooting

### Issue: Action items not being created

**Symptoms:** `/session:apply` runs but action-items.yaml stays empty

**Causes:**
1. Park docs missing `.claude Improvements` section
2. Improvements not in checklist format `- [ ]`
3. No park docs in last 7 days

**Solution:**
1. Ensure park docs have `.claude Improvements` section
2. Use format: `- [ ] Add skill: [name] - [purpose]`
3. Check date range: `find .claude-sessions/ -name "*-compressed.md" -mtime -7`

### Issue: Lessons not resurfacing

**Symptoms:** `/session:remind` shows no lessons

**Causes:**
1. No lessons in lesson-index.yaml
2. All lessons have future surface_after dates
3. lesson-index.yaml not being updated by park

**Solution:**
1. Check lesson-index.yaml exists and has entries
2. Verify surface_after dates: some should be <= today
3. Re-run `/session:park` to extract lessons from recent park doc

### Issue: Knowledge graph too sparse

**Symptoms:** `/session:link` returns few results

**Causes:**
1. Not enough park documents yet
2. Entity extraction not capturing terms
3. Keywords too narrow

**Solution:**
1. Park more sessions to build up graph
2. Manually add entities via knowledge-graph.yaml
3. Broaden keywords in entity definitions

### Issue: Metrics not updating

**Symptoms:** metrics.yaml shows zeros or stale data

**Causes:**
1. Commands not updating metrics.yaml
2. File permissions issue
3. Wrong file path

**Solution:**
1. Ensure /session:park and /session:apply update metrics
2. Check file permissions: `ls -la .claude-sessions/`
3. Verify path: should be `.claude-sessions/metrics.yaml` (not absolute)

---

## Quick Reference

### Command Cheat Sheet

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `/session:park` | Create park document | End of session, major milestone |
| `/session:apply` | Process improvements | Weekly, or when prompted |
| `/session:note` | Quick timestamped note | Capture insight mid-session |
| `/session:remind` | Review due lessons | Start of session, new task |
| `/session:health` | View metrics dashboard | Weekly review, debugging |
| `/session:link <query>` | Search knowledge graph | Starting related work |

### Priority SLO Reference

| Priority | SLO | Use For |
|----------|-----|---------|
| P0 | 7 days | Security issues, data loss, blockers |
| P1 | 14 days | Repeated issues, significant gains |
| P2 | 30 days | Nice-to-haves, minor improvements |

### Interval Progression

| Times Applied | Next Interval |
|---------------|---------------|
| 0 | 7 days |
| 1 | 14 days |
| 2 | 28 days |
| 3 | 56 days |
| 4+ | 112 days |
| Not applied | Reset to 7 days |
