---
description: Surface due lessons from spaced repetition index for review
---

You are about to review lessons that are due for resurfacing based on spaced repetition scheduling. This helps reinforce valuable learnings and prevent repeated mistakes.

## Pre-Flight Check

1. **Verify lesson-index.yaml exists**
   ```bash
   ls .claude-sessions/lesson-index.yaml
   ```
   If not found: "No lessons indexed yet. Run `/session:park` to capture lessons."

2. **Get today's date** for comparison with `surface_after` dates

## Find Due Lessons

Read `.claude-sessions/lesson-index.yaml` and find lessons where:
- `surface_after <= today`
- Sort by: impact (high first), then oldest surface_after

## Context Matching (Optional)

If user provided arguments (`$ARGUMENTS`), filter lessons by keyword match:

```
/session:remind oauth
→ Filter to lessons where keywords include "oauth"

/session:remind
→ Show all due lessons
```

### Keyword Matching Rules

1. Match against `keywords` array (case-insensitive)
2. Match against `lesson` text (partial match)
3. Match against `category` name
4. Rank by number of matches

## Present Lessons

Show 2-3 most relevant due lessons:

```markdown
## Lessons Due for Review

### 1. [High Impact] Security
**Source:** 2025-11-15-oauth-flow-compressed.md
**Lesson:** Always verify OAuth state param matches before redirect to prevent CSRF
**Keywords:** oauth, state, csrf, redirect, security
**Last reviewed:** 2025-11-15 (11 days ago)
**Times applied:** 0

---

### 2. [Medium Impact] Efficiency
**Source:** 2025-11-18-refactor-compressed.md
**Lesson:** Run ruff+mypy+pytest in parallel for 3x faster validation
**Keywords:** parallel, validation, ruff, mypy, pytest
**Last reviewed:** 2025-11-18 (8 days ago)
**Times applied:** 1

---

### 3. [Medium Impact] Debugging
**Source:** 2025-11-20-api-fix-compressed.md
**Lesson:** Check CloudWatch logs before assuming code bug - often infrastructure issue
**Keywords:** debugging, cloudwatch, logs, infrastructure
**Last reviewed:** 2025-11-20 (6 days ago)
**Times applied:** 0

---

**Did any of these help with your current task?**
Reply with lesson numbers (e.g., "1, 3") or "none"
```

## Process User Response

### If user confirms lessons were helpful (e.g., "1, 3")

For each confirmed lesson:

1. **Double the interval** (FSRS-style progression)
   - Current 7 days → 14 days
   - Current 14 days → 28 days
   - Current 28 days → 56 days
   - Current 56 days → 112 days
   - Max interval: 112 days

2. **Update lesson entry**
   ```yaml
   last_surfaced: [today]
   surface_after: [today + new_interval]
   interval_days: [new_interval]
   times_surfaced: +1
   times_applied: +1
   ```

3. **Report:**
   ```markdown
   ✅ Lesson 1 interval extended: 7 → 14 days (next review: 2025-12-10)
   ✅ Lesson 3 interval extended: 7 → 14 days (next review: 2025-12-10)
   ```

### If user says "none" or doesn't confirm

For unconfirmed lessons that were shown:

1. **Reset interval to 7 days** (needs more reinforcement)
   ```yaml
   last_surfaced: [today]
   surface_after: [today + 7]
   interval_days: 7
   times_surfaced: +1
   # times_applied stays same
   ```

2. **Report:**
   ```markdown
   Lesson intervals reset to 7 days for more frequent review.
   ```

## Update Metrics

After processing, update `.claude-sessions/metrics.yaml`:

```yaml
effectiveness:
  lessons_resurfaced: +N    # Number shown this session
  lessons_applied: +M       # Number user confirmed helpful

history:
  - date: YYYY-MM-DD
    event: reminded
    details: "Showed N lessons, M applied"
```

## Edge Cases

### No lessons due
```markdown
## No Lessons Due for Review

All lessons are scheduled for future dates. Great job staying on top of reviews!

**Next lesson due:** 2025-12-01 (in 5 days)
**Topic:** OAuth state parameter validation

Run `/session:remind` again after that date, or use `/session:health` to see full lesson index.
```

### No lessons match context
```markdown
## No Lessons Match "kubernetes"

No indexed lessons contain keywords related to "kubernetes".

**Suggestion:** After working on this topic, run `/session:park` to capture new lessons.

**Alternative:** Run `/session:remind` without arguments to see all due lessons.
```

### Lesson index empty
```markdown
## No Lessons Indexed

The lesson index is empty. Start capturing lessons by:

1. Complete a coding session
2. Run `/session:park` to create a park document
3. Lessons will be automatically extracted

The spaced repetition system helps you retain valuable learnings over time.
```

## Proactive Reminder (Session Start)

When starting a new session, consider checking for due lessons:

```markdown
## Quick Check: Lessons Due

You have 3 lessons due for review. Would you like to see them before starting?

Run `/session:remind` to review, or continue with your task.
```

## Success Criteria

- [ ] Due lessons identified correctly (surface_after <= today)
- [ ] Lessons sorted by impact and age
- [ ] Context filtering works when arguments provided
- [ ] Intervals updated based on user response
- [ ] Metrics updated accurately
- [ ] Edge cases handled gracefully

## Quick Reference

### Interval Progression Table

| Times Applied | Next Interval |
|---------------|---------------|
| 0 → 1 | 7 → 14 days |
| 1 → 2 | 14 → 28 days |
| 2 → 3 | 28 → 56 days |
| 3 → 4 | 56 → 112 days |
| 4+ | 112 days (max) |
| Not applied | Reset to 7 days |

### Category Icons

| Category | Icon |
|----------|------|
| security | 🔒 |
| efficiency | ⚡ |
| architecture | 🏗️ |
| debugging | 🔍 |
| workflow | 🔄 |
| testing | 🧪 |
