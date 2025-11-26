---
description: Display flywheel health metrics and recommendations
---

You are about to display a comprehensive health dashboard for the park flywheel system, showing capture, application, and effectiveness metrics.

## Pre-Flight Check

1. **Check for required files**
   ```bash
   ls .claude-sessions/metrics.yaml
   ls .claude-sessions/action-items.yaml
   ls .claude-sessions/lesson-index.yaml
   ls .claude-sessions/knowledge-graph.yaml
   ```

2. **Initialize missing files** if needed (with empty/default values)

## Gather Metrics

### From metrics.yaml
- Capture stats (sessions_parked, lessons_captured, etc.)
- Application stats (items completed, overdue, etc.)
- Effectiveness stats (repeated mistakes, lessons applied, etc.)
- History entries

### From action-items.yaml
- Count by status: pending, in_progress, completed, deferred
- Count by priority: P0, P1, P2
- Overdue items (due < today AND status = pending)
- Calculate completion rate: completed / (completed + pending + in_progress)

### From lesson-index.yaml
- Total lessons
- Lessons due for review (surface_after <= today)
- Average interval (indicates retention strength)
- Application rate: sum(times_applied) / sum(times_surfaced)

### From knowledge-graph.yaml
- Entity count
- Relationship count
- Session count
- Most connected entities

## Calculate Health Scores

### Capture Health (0-100)
```
Base: 50
+ 10 if sessions_parked >= 1 this week
+ 10 if avg lessons per session >= 2
+ 10 if mistakes_documented > 0
+ 10 if compression_ratio < 0.20
+ 10 if action_items_created > 0
```

### Application Health (0-100)
```
Base: 50
+ 20 if completion_rate >= 80%
+ 20 if overdue_rate <= 10%
- 10 for each P0 item overdue
- 5 for each P1 item overdue
+ 10 if skills/commands created this month
```

### Effectiveness Health (0-100)
```
Base: 50
+ 20 if repeated_mistakes decreased from last month
+ 15 if lesson_application_rate >= 50%
+ 15 if knowledge_graph has >= 10 entities
- 20 if repeated_mistakes increased
```

### Overall Health
```
(Capture + Application + Effectiveness) / 3
```

## Present Dashboard

```markdown
## Park Flywheel Health Dashboard

**Period:** 2025-11-01 to 2025-11-26
**Overall Health:** 78/100 🟢

---

### Capture Metrics

| Metric | Value | Trend |
|--------|-------|-------|
| Sessions Parked | 12 | ↑ +3 from last month |
| Avg Compression | 15% | ✓ Good |
| Lessons Captured | 34 | ↑ +12 from last month |
| Mistakes Documented | 23 | - |
| Action Items Created | 18 | - |

**Capture Health:** 85/100 🟢
✅ Consistent parking (1.7 sessions/week)
✅ Good compression ratio
✅ Lessons being extracted

---

### Application Metrics

| Metric | Value | Status |
|--------|-------|--------|
| Items Completed | 14/18 | 78% |
| Items Pending | 4 | - |
| Items Overdue | 2 | ⚠️ |
| Skills Created | 3 | ✓ |
| Commands Created | 5 | ✓ |

**Application Health:** 72/100 🟡

⚠️ **2 Overdue Action Items:**

| ID | Description | Due | Priority | Overdue |
|----|-------------|-----|----------|---------|
| ai-2025-11-15-001 | Add OAuth skill | 2025-11-22 | P1 | 4 days |
| ai-2025-11-18-002 | Update CLAUDE.md | 2025-11-25 | P2 | 1 day |

**Recommendation:** Address overdue items before creating new work.

---

### Effectiveness Metrics

| Metric | Value | Trend |
|--------|-------|-------|
| Repeated Mistakes | 2 | ↓ -3 from last month |
| Lessons Resurfaced | 8 | - |
| Lessons Applied | 6 | 75% application rate |
| Knowledge Graph Entities | 45 | ↑ +15 |
| Knowledge Graph Relationships | 67 | ↑ +23 |

**Effectiveness Health:** 82/100 🟢
✅ Repeated mistakes decreasing
✅ High lesson application rate
✅ Knowledge graph growing

---

### Spaced Repetition Status

| Status | Count |
|--------|-------|
| Due for Review | 3 |
| Reviewed This Week | 5 |
| Total Lessons | 34 |

**Lessons Due:**
1. OAuth state param validation (security, high impact)
2. Parallel validation pattern (efficiency, medium impact)
3. CloudWatch before code debug (debugging, medium impact)

**Action:** Run `/session:remind` to review due lessons.

---

### Knowledge Graph Summary

**Top 5 Entities:**

| Entity | Type | Sessions | Connections |
|--------|------|----------|-------------|
| authentication | domain | 8 | 12 |
| api | domain | 7 | 10 |
| database | component | 6 | 8 |
| caching | pattern | 5 | 7 |
| oauth | feature | 4 | 6 |

**Recent Additions:**
- rate-limiting (2025-11-25)
- refresh-tokens (2025-11-24)
- circuit-breaker (2025-11-23)

---

### Recommendations

1. **🔴 High Priority:** Complete 2 overdue action items
   - ai-2025-11-15-001: Add OAuth skill (4 days overdue)
   - ai-2025-11-18-002: Update CLAUDE.md (1 day overdue)

2. **🟡 Medium Priority:** Review 3 lessons due for resurfacing
   - Run `/session:remind` to reinforce learnings

3. **🟢 Keep Doing:** Consistent parking frequency
   - 1.7 sessions/week is good cadence

4. **💡 Suggestion:** Current session has 45 messages
   - Consider parking soon to capture learnings

---

### Historical Trend

```
Sessions Parked (last 4 weeks):
Week 1: ████░░░░░░ 4
Week 2: ███░░░░░░░ 3
Week 3: ██░░░░░░░░ 2
Week 4: ███░░░░░░░ 3

Completion Rate Trend:
Week 1: 65%
Week 2: 70%
Week 3: 75%
Week 4: 78% ↑
```

---

### Quick Actions

| Action | Command |
|--------|---------|
| Park this session | `/session:park` |
| Apply improvements | `/session:apply` |
| Review due lessons | `/session:remind` |
| Search knowledge | `/session:link <query>` |
```

## Health Score Indicators

| Score Range | Indicator | Meaning |
|-------------|-----------|---------|
| 80-100 | 🟢 | Healthy - keep it up |
| 60-79 | 🟡 | Needs attention - some issues |
| 40-59 | 🟠 | Warning - multiple issues |
| 0-39 | 🔴 | Critical - requires immediate action |

## Edge Cases

### No metrics yet
```markdown
## Park Flywheel Health Dashboard

**Status:** Just Getting Started

No metrics recorded yet. Here's how to build your flywheel:

1. **Start capturing:** Run `/session:park` at the end of coding sessions
2. **Apply learnings:** Run `/session:apply` weekly to process improvements
3. **Reinforce lessons:** Run `/session:remind` to review due lessons
4. **Build knowledge:** Use `/session:link` to find related past work

After a few sessions, you'll see metrics here tracking your progress.
```

### Partial data
Fill in zeros for missing metrics and note:
```markdown
*Some metrics unavailable - will populate as you use the system*
```

## Update Metrics

After displaying dashboard, add history entry:

```yaml
history:
  - date: YYYY-MM-DD
    event: health_check
    details: "Overall health: 78/100, 2 overdue items"
```

## Success Criteria

- [ ] All metric sources read correctly
- [ ] Health scores calculated accurately
- [ ] Overdue items highlighted prominently
- [ ] Recommendations are actionable
- [ ] Historical trends shown when available
- [ ] Quick actions provided
- [ ] Edge cases handled gracefully
