# Park Flywheel V2 Implementation Plan

## Overview

Enhance the park flywheel with 6 improvements based on industry best practices:
1. Spaced Repetition for High-Value Lessons
2. Semantic Linking via Knowledge Graph
3. Automated Action Item Tracking with SLOs
4. Context-Aware Auto-Park Triggers
5. Multi-Agent Park Document Generation
6. Feedback Loop Metrics Dashboard

## File Structure (New/Modified)

```
claude-config/
├── skills/
│   └── session-management/
│       ├── SKILL.md                    # UPDATE: Add new triggers, workflows
│       └── REFERENCE.md                # NEW: Detailed patterns, schemas
├── commands/
│   └── session/
│       ├── park.md                     # UPDATE: Multi-agent generation
│       ├── apply.md                    # UPDATE: Action item SLOs, metrics
│       ├── note.md                     # KEEP AS-IS
│       ├── remind.md                   # NEW: Spaced repetition resurfacing
│       ├── health.md                   # NEW: Metrics dashboard
│       └── link.md                     # NEW: Manual knowledge graph query
└── .claude-sessions/                   # Per-project (created on first use)
    ├── lesson-index.yaml               # Spaced repetition lessons
    ├── knowledge-graph.yaml            # Entity relationships
    ├── action-items.yaml               # SLO-tracked improvements
    ├── metrics.yaml                    # Flywheel health metrics
    ├── current-session-notes.md        # Existing
    ├── YYYY-MM-DD-*-compressed.md      # Existing park docs
    └── archive/                        # Existing
```

---

## Implementation Phases

### Phase 1: Foundation (Action Items + Metrics)
**Priority: P0 | Effort: Low | Impact: High**

These provide immediate value and establish data structures other features depend on.

#### 1.1 Create `action-items.yaml` Schema

**File:** `.claude-sessions/action-items.yaml`
```yaml
# Action Items with SLO Tracking
# Generated/updated by /session:apply

version: 1
items:
  - id: ai-YYYY-MM-DD-NNN
    description: string          # Actionable improvement
    source: string               # Park doc filename
    priority: P0|P1|P2           # P0=critical, P1=high, P2=medium
    category: skill|command|claude-md|reference-md|other
    slo_days: 14|30              # P0/P1=14d, P2=30d
    created: YYYY-MM-DD
    due: YYYY-MM-DD
    status: pending|in_progress|completed|deferred
    completed_date: YYYY-MM-DD   # If completed
    defer_reason: string         # If deferred

  # Example:
  - id: ai-2025-11-26-001
    description: "Add OAuth validation skill with auto-activation on 'oauth', 'redirect'"
    source: 2025-11-15-oauth-flow-compressed.md
    priority: P1
    category: skill
    slo_days: 14
    created: 2025-11-15
    due: 2025-11-29
    status: pending
```

#### 1.2 Create `metrics.yaml` Schema

**File:** `.claude-sessions/metrics.yaml`
```yaml
# Flywheel Health Metrics
# Updated by /session:apply and /session:park

version: 1
period_start: YYYY-MM-DD
period_end: YYYY-MM-DD

capture:
  sessions_parked: 0
  avg_compression_ratio: 0.0      # Park doc size / conversation size
  lessons_captured: 0
  action_items_created: 0
  mistakes_documented: 0

application:
  action_items_completed: 0
  action_items_overdue: 0
  skills_created: 0
  commands_created: 0
  claude_md_updates: 0

effectiveness:
  repeated_mistakes: 0            # Same mistake across sessions
  lessons_resurfaced: 0           # Via /session:remind
  related_sessions_linked: 0      # Via knowledge graph

history:
  - date: YYYY-MM-DD
    event: parked|applied|reminded
    details: string
```

#### 1.3 Update `/session:apply` Command

**File:** `commands/session/apply.md`

Add sections:
- Parse `.claude Improvements` into `action-items.yaml`
- Assign priorities based on frequency (3+ mentions = P1)
- Calculate SLO due dates
- Report overdue items prominently at top
- Update `metrics.yaml` on each run
- Track completion rates

#### 1.4 Update `/session:park` Command

**File:** `commands/session/park.md`

Add sections:
- Increment `metrics.yaml` capture stats
- Calculate compression ratio
- Count mistakes documented
- Check for repeated mistakes (grep lesson-index for similar)

---

### Phase 2: Spaced Repetition
**Priority: P1 | Effort: Medium | Impact: High**

#### 2.1 Create `lesson-index.yaml` Schema

**File:** `.claude-sessions/lesson-index.yaml`
```yaml
# Spaced Repetition Lesson Index
# Extracted during /session:park, surfaced by /session:remind

version: 1
lessons:
  - id: lesson-YYYY-MM-DD-NNN
    source: string               # Park doc filename
    lesson: string               # One-sentence lesson learned
    category: security|efficiency|architecture|debugging|workflow
    impact: high|medium|low
    keywords: [string]           # For semantic matching

    # FSRS-inspired scheduling
    last_surfaced: YYYY-MM-DD
    surface_after: YYYY-MM-DD    # Next review date
    interval_days: 7             # Current interval (doubles on success)
    times_surfaced: 0
    times_applied: 0             # User confirmed useful

  # Example:
  - id: lesson-2025-11-15-001
    source: 2025-11-15-oauth-flow-compressed.md
    lesson: "Always verify OAuth state param matches before redirect to prevent CSRF"
    category: security
    impact: high
    keywords: [oauth, state, csrf, redirect, security]
    last_surfaced: 2025-11-15
    surface_after: 2025-11-22
    interval_days: 7
    times_surfaced: 1
    times_applied: 0
```

#### 2.2 Create `/session:remind` Command

**File:** `commands/session/remind.md`

Functionality:
1. Read `lesson-index.yaml`
2. Find lessons where `surface_after <= today`
3. Match lessons to current task context (if provided via `$ARGUMENTS`)
4. Present 2-3 most relevant lessons
5. Ask user: "Applied this? [y/n]"
   - If yes: Double interval (7→14→28→56 days), increment `times_applied`
   - If no: Reset interval to 7 days
6. Update `metrics.yaml` with resurfacing count

#### 2.3 Update `/session:park` to Extract Lessons

Add to park.md:
- Extract lessons from "Lessons" and "Mistakes" sections
- Generate unique IDs
- Auto-categorize based on keywords
- Set initial interval to 7 days
- Append to `lesson-index.yaml`

---

### Phase 3: Knowledge Graph
**Priority: P2 | Effort: High | Impact: High**

#### 3.1 Create `knowledge-graph.yaml` Schema

**File:** `.claude-sessions/knowledge-graph.yaml`
```yaml
# Semantic Knowledge Graph
# Built during /session:park, queried by /session:link

version: 1

entities:
  - name: string                 # Entity name (e.g., "oauth", "user-dashboard")
    type: feature|domain|component|pattern|bug
    sessions: [string]           # Park doc filenames
    keywords: [string]           # Related terms
    first_seen: YYYY-MM-DD
    last_updated: YYYY-MM-DD

relationships:
  - from: string                 # Entity or session name
    to: string
    type: builds_on|caused_by|related_to|implements|fixes
    strength: high|medium|low
    context: string              # Brief explanation

# Example:
entities:
  - name: oauth
    type: feature
    sessions: [2025-11-15-oauth-flow, 2025-11-12-jwt-tokens]
    keywords: [authentication, redirect, state-param, google-oauth]
    first_seen: 2025-11-12
    last_updated: 2025-11-15

relationships:
  - from: 2025-11-15-oauth-flow
    to: 2025-11-12-jwt-tokens
    type: builds_on
    strength: high
    context: "OAuth flow uses JWT tokens for session management"
```

#### 3.2 Create `/session:link` Command

**File:** `commands/session/link.md`

Functionality:
1. Accept query: `/session:link oauth` or `/session:link "error handling"`
2. Search entities by name and keywords
3. Traverse relationships to find connected sessions
4. Present results:
   ```
   Found 3 sessions related to "oauth":

   Direct matches:
   - 2025-11-15-oauth-flow: Implemented Google OAuth with redirect handling
   - 2025-11-12-jwt-tokens: Fixed token expiration issue

   Related via "authentication":
   - 2025-11-10-auth-testing: Added Claude test user

   Load any of these? [1/2/3/n]
   ```
5. If user selects, read and summarize park doc

#### 3.3 Update `/session:park` to Build Graph

Add to park.md:
- Extract entities from:
  - File paths mentioned
  - Technical terms (capitalized, hyphenated)
  - Section headers
- Infer relationships:
  - Same file touched = `related_to`
  - Bug fix = `fixes`
  - New feature = `implements`
- Find existing related sessions via keyword overlap
- Append to `knowledge-graph.yaml`

---

### Phase 4: Smart Auto-Triggers
**Priority: P1 | Effort: Low | Impact: Medium**

#### 4.1 Update `session-management` SKILL.md

Add multi-signal trigger detection:

```yaml
auto_park_triggers:
  # Suggest parking when 2+ conditions met
  conditions:
    message_count: 40            # Lower from 50
    task_completion_signals:
      - "done"
      - "working now"
      - "that's it"
      - "ship it"
      - "looks good"
    topic_drift: 3               # Unrelated tool calls in sequence
    context_usage: 80%           # Window utilization
    time_elapsed_hours: 2
    decision_count: 5            # Architectural decisions made

  # Always suggest after:
  force_triggers:
    - "ready to park"
    - "let's wrap up"
    - "save this session"
```

#### 4.2 Add Proactive Suggestions

In SKILL.md, add workflow for proactive park suggestion:
- Track message count internally
- Detect task completion phrases
- Monitor for topic switches
- Present suggestion:
  ```
  This session has [40 messages / 2 hours / 5 decisions].
  Would you like to park before continuing?

  Captured so far:
  - 3 architectural decisions
  - 2 bug fixes
  - 1 performance optimization

  Run `/session:park` or continue working.
  ```

---

### Phase 5: Multi-Agent Park Generation
**Priority: P3 | Effort: High | Impact: Medium**

#### 5.1 Update `/session:park` for Multi-Agent Flow

Replace single-pass compression with coordinated extraction:

```markdown
## Multi-Agent Extraction

### Agent 1: Decision Extractor
Focus: Architectural decisions, rationale, trade-offs
Output: decisions.yaml (temporary)

### Agent 2: Mistake Analyzer
Focus: AI mistakes, user mistakes, process gaps
Output: mistakes.yaml (temporary)

### Agent 3: Lesson Synthesizer
Focus: What worked, what didn't, key insights
Output: lessons.yaml (temporary)

### Agent 4: Linker
Focus: Related sessions, entity extraction, graph updates
Output: links.yaml (temporary)

### Agent 5: Compressor
Input: All temporary yamls + conversation
Output: Final compressed park document

### Orchestration
1. Launch Agents 1-4 in parallel (no dependencies)
2. Wait for all to complete
3. Launch Agent 5 with combined context
4. Merge outputs into final document
5. Clean up temporary files
```

#### 5.2 Add Validation Step

Before finalizing park document:
- Cross-check: Do decisions reference actual code changes?
- Cross-check: Are all mentioned files real?
- Cross-check: Do lessons follow from mistakes?
- Report discrepancies for human review

---

### Phase 6: Health Dashboard
**Priority: P2 | Effort: Medium | Impact: Medium**

#### 6.1 Create `/session:health` Command

**File:** `commands/session/health.md`

Functionality:
1. Read `metrics.yaml`, `action-items.yaml`, `lesson-index.yaml`
2. Calculate health scores:
   - Capture rate: sessions parked / sessions started
   - Completion rate: action items completed / created
   - Resurfacing rate: lessons applied / surfaced
   - Repetition rate: repeated mistakes / total mistakes (lower = better)
3. Present dashboard:
   ```
   ## Park Flywheel Health - November 2025

   ### Capture
   Sessions parked: 12 (avg 1.7/week)
   Lessons captured: 34
   Avg compression: 15%

   ### Application
   Action items: 14/18 completed (78%)
   ⚠️ 2 overdue:
     - ai-2025-11-15-001: Add OAuth skill (3 days overdue)
     - ai-2025-11-18-002: Update CLAUDE.md (1 day overdue)

   ### Effectiveness
   Repeated mistakes: 2 (down from 5 last month)
   Lessons resurfaced: 8 (6 applied)
   Knowledge graph: 15 entities, 23 relationships

   ### Recommendations
   1. Complete overdue action items
   2. Review lessons due for resurfacing (3 pending)
   3. Consider parking current session (45 messages)
   ```

---

## Implementation Order

```
Week 1: Foundation (Phase 1)
├── Create action-items.yaml schema
├── Create metrics.yaml schema
├── Update /session:apply with SLO tracking
└── Update /session:park with metrics

Week 2: Spaced Repetition (Phase 2)
├── Create lesson-index.yaml schema
├── Create /session:remind command
└── Update /session:park to extract lessons

Week 3: Smart Triggers + Health (Phases 4 & 6)
├── Update session-management SKILL.md
├── Create /session:health command
└── Add proactive park suggestions

Week 4: Knowledge Graph (Phase 3)
├── Create knowledge-graph.yaml schema
├── Create /session:link command
└── Update /session:park for entity extraction

Future: Multi-Agent (Phase 5)
├── Design agent coordination protocol
├── Implement parallel extraction
└── Add validation layer
```

---

## Success Criteria

### Quantitative
- [ ] Action item completion rate > 80%
- [ ] Repeated mistakes reduced 50% month-over-month
- [ ] Average park document < 500 lines
- [ ] Lessons resurfaced at appropriate intervals

### Qualitative
- [ ] Park documents preserve actionable technical details
- [ ] Related sessions discoverable via knowledge graph
- [ ] Auto-park triggers feel helpful, not annoying
- [ ] Health dashboard provides actionable insights

---

## Rollback Plan

Each phase is independent. If any causes issues:
1. Revert command/skill files via git
2. YAML data files are additive (won't break existing park docs)
3. Multi-agent flow (Phase 5) has feature flag: `multi_agent: false` in SKILL.md

---

## Notes

- All YAML files use version field for future schema migrations
- Progressive disclosure maintained: SKILL.md for workflows, REFERENCE.md for schemas
- Commands are idempotent (safe to run multiple times)
- Knowledge graph queries use simple keyword matching (no vector DB required)
