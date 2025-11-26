---
name: session-management
description: Auto-activates on "park", "session", "remind", "link", "health" keywords. Manages conversation sessions for institutional knowledge capture through park documents, spaced repetition, and knowledge graphs.
allowed-tools: Read, Write, Glob, Bash, Grep
---

# Session Management Skill

Manages conversation sessions for institutional knowledge capture through compressed park documents, spaced repetition lessons, and semantic knowledge graphs.

## Purpose

This skill helps maintain institutional memory by:
1. Detecting when context is growing large → Suggest parking
2. Capturing lessons with spaced repetition scheduling
3. Building knowledge graph of related sessions
4. Tracking action items with SLO deadlines
5. Surfacing relevant past work for current tasks

## Auto-Activation Triggers

### Keyword Triggers
- **Parking:** "park", "wrap up", "save session", "compress"
- **Review:** "remind", "lessons", "what did I learn"
- **Search:** "link", "related sessions", "find past"
- **Health:** "health", "metrics", "flywheel status"
- **Notes:** "note", "capture this", "remember"

### Context-Aware Triggers (Smart Auto-Park)

**Suggest parking when 2+ conditions met:**

| Condition | Threshold | Detection |
|-----------|-----------|-----------|
| Message count | >= 40 | Count user/assistant turns |
| Task completion | Detected | See signals below |
| Topic drift | 3+ | Unrelated tool calls in sequence |
| Context usage | >= 80% | Approaching window limit |
| Time elapsed | >= 2 hours | Session duration |
| Decision count | >= 5 | Architectural choices made |

**Task Completion Signals:**
- "done", "working now", "that's it", "ship it"
- "looks good", "perfect", "that works"
- "moving on", "next task", "what's next"
- "let's commit", "ready to merge"

**Force Triggers (Always Suggest):**
- "ready to park"
- "let's wrap up"
- "save this session"
- "park and commit"

## Core Workflows

### Workflow 1: Proactive Park Suggestion

**When 2+ auto-park conditions detected:**

```markdown
📦 This session has grown substantial:
- Messages: 45
- Decisions made: 3
- Time elapsed: 1.5 hours

Would you like to park before continuing?

**Captured so far:**
- 3 architectural decisions
- 2 bug fixes
- 1 efficiency improvement

Run `/session:park` to capture, or continue working.
```

### Workflow 2: Session Start Check

**At session start, proactively check:**

1. **Overdue action items:**
   ```markdown
   ⚠️ You have 2 overdue action items:
   - Add OAuth skill (4 days overdue)
   - Update CLAUDE.md (1 day overdue)

   Address these first? Or continue with new task?
   ```

2. **Lessons due for review:**
   ```markdown
   📚 3 lessons due for review. Quick refresher?
   Run `/session:remind` or skip to your task.
   ```

3. **Related past sessions:**
   ```markdown
   🔗 Found related sessions for "[current topic]":
   - 2025-11-15-oauth-flow
   - 2025-11-12-jwt-tokens

   Load context? Run `/session:link [topic]`
   ```

### Workflow 3: Context-Aware Linking

**When user starts task similar to past session:**

1. Detect topic from user's description
2. Search knowledge graph for related entities
3. Present 2-3 most relevant sessions
4. Offer to load context

```markdown
🔗 This looks related to past work on "authentication":

- 2025-11-15-oauth-flow: OAuth redirect handling
- 2025-11-12-jwt-tokens: Token refresh logic

Load any of these for context?
```

### Workflow 4: Lesson Reinforcement

**When user encounters similar situation to past lesson:**

1. Match current task keywords against lesson-index
2. Surface relevant lesson proactively
3. Ask if it was helpful (updates spaced repetition)

```markdown
💡 Relevant lesson from 2025-11-15:
"Always verify OAuth state param matches before redirect"

Keep this in mind for the current task.
```

## Command Integration

This skill coordinates these commands:

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `/session:park` | Create park document | End of session, milestone |
| `/session:apply` | Process improvements | Weekly, or when prompted |
| `/session:note` | Quick timestamped note | Capture insight mid-session |
| `/session:remind` | Review due lessons | Start of session, new task |
| `/session:health` | View metrics dashboard | Weekly review, debugging |
| `/session:link <query>` | Search knowledge graph | Starting related work |

## Data Files (Per-Project)

All data stored in `.claude-sessions/`:

| File | Purpose | Updated By |
|------|---------|------------|
| `action-items.yaml` | SLO-tracked improvements | `/session:apply` |
| `lesson-index.yaml` | Spaced repetition lessons | `/session:park` |
| `knowledge-graph.yaml` | Entity relationships | `/session:park` |
| `metrics.yaml` | Flywheel health metrics | All commands |
| `current-session-notes.md` | Running notes | `/session:note` |
| `*-compressed.md` | Park documents | `/session:park` |

## Behavior Rules

1. **Be proactive but not annoying** - Suggest, don't insist
2. **Prioritize overdue items** - Surface blockers first
3. **Link related work** - Help avoid repeated mistakes
4. **Track everything** - Update metrics consistently
5. **Respect user focus** - Don't interrupt deep work unnecessarily

## Smart Trigger Detection

### Detecting Topic Drift

Track last 5 tool calls. If 3+ are unrelated to initial task:
- Different file paths (not in same directory tree)
- Different entity types (switching from backend to frontend)
- Unrelated grep patterns

→ Suggest: "Looks like you're switching topics. Park the previous work?"

### Detecting Task Completion

Monitor for completion signals in user messages:
- Direct statements: "done", "finished", "complete"
- Satisfaction: "perfect", "that works", "great"
- Transition: "now let's", "next", "moving on"
- Commit intent: "commit", "push", "merge", "deploy"

→ Suggest: "Task complete! Park this session to capture learnings?"

### Detecting Decision Density

Count statements that indicate architectural choices:
- "let's use X instead of Y"
- "we should go with"
- "decided to"
- "the approach will be"
- Trade-off discussions

→ At 5+ decisions: "Several important decisions made. Good time to park?"

## Proactive Suggestions Format

Keep suggestions brief and actionable:

```markdown
[Icon] [Brief observation]

[1-2 bullet summary]

[Single action suggestion with command]
```

**Icons:**
- 📦 Park suggestion
- ⚠️ Overdue items
- 📚 Lessons due
- 🔗 Related sessions
- 💡 Relevant lesson
- ✅ Task complete

## Progressive Disclosure

**This file (SKILL.md):** Core workflows, triggers, commands

**REFERENCE.md:** Detailed schemas, patterns, troubleshooting
- Load when user asks about data formats
- Load when debugging issues
- Load for implementation details

## Success Metrics

**Good session management:**
- Park suggestion accepted > 60% of time
- Overdue items < 2 at any time
- Lessons reviewed on schedule
- Related sessions discovered proactively
- Repeated mistakes decreasing month-over-month

**Poor signals:**
- User dismisses suggestions repeatedly
- Large backlog of overdue items
- Same mistakes appearing in multiple sessions
- Knowledge graph not growing

## Integration with "Park and Commit"

When user says "park and commit":

1. Run `/session:park` workflow
2. Stage park document: `git add .claude-sessions/*.md`
3. Stage related YAML files if changed
4. Include in commit message:
   ```
   feat: [main changes]

   Session parked: [topic]
   - Decisions: N
   - Lessons: M
   - Action items: K
   ```

## Common Scenarios

### Scenario 1: Natural Breakpoint
**User:** "That's working now, what's next?"

**Response:**
```markdown
📦 Great milestone! This session captured:
- 2 architectural decisions
- 3 lessons learned
- 1 efficiency improvement

Park before moving on? `/session:park`
Or continue with your next task.
```

### Scenario 2: Starting Related Work
**User:** "I need to add another OAuth provider"

**Response:**
```markdown
🔗 Found related sessions on OAuth:
- 2025-11-15-oauth-flow: Google OAuth implementation
- 2025-11-12-jwt-tokens: Token handling patterns

Key lesson: "Always verify state param before redirect"

Load context? `/session:link oauth`
```

### Scenario 3: Long Session Warning
**Detected:** 50+ messages, 2+ hours elapsed

**Response:**
```markdown
📦 Long session detected (55 messages, 2.5 hours)

Consider parking to:
- Preserve detailed context before it fades
- Extract lessons while fresh
- Free up context window

Run `/session:park` when ready.
```
