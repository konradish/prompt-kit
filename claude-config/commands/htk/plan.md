# HTK Plan

Build ranked HTK pipeline (3-7 HTKs) toward north star goal: **$ARGUMENTS**

## Purpose

Create a multi-HTK roadmap when achieving a goal requires multiple validated steps. Maintains WIP=1 discipline.

## Execution

### 1. Define North Star

Parse `$ARGUMENTS` to extract:
- Desired outcome (one sentence)
- Constraints (time, budget, quality)
- Success criteria

Format:
```
Outcome: <one-sentence result + constraints>
```

### 2. Decompose into HTKs

Generate 3-7 HTKs ranked by:
1. **Dependency order** - Must do A before B
2. **Risk/impact** - High impact, low risk first
3. **Learning value** - Quick validation of assumptions

Each HTK:
- Short label (e.g., `cache-layer`, `db-index`)
- What it proves (≤1 sentence)
- Why-first (≤2 sentences)

### 3. Set Stop Rules

Define when to stop the pipeline:
- **Metric floor**: Minimum acceptable result
- **Timebox**: Maximum duration
- **Budget**: Resource constraints

Example: "p95 < 200ms OR 10 business days OR $500 infra spend"

### 4. Identify Blockers

List inputs needed to unblock first 1-2 HTKs:
- Data or access requirements
- Infrastructure needs
- Knowledge gaps

### 5. Output Format

```
# NORTH STAR

Outcome: <one-sentence result + constraints>

# PIPELINE (ranked HTKs, 3–7 items; WIP=1)

1. <short-label> — What it proves (≤1 sentence). Why-first (≤2).
2. <short-label> — What it proves. Why-first.
3. <short-label> — What it proves. Why-first.
...

Stop Rules: <metric floor, timebox, budget>

Inputs to unblock first 1–2 HTKs:
- <critical input 1>
- <critical input 2>
- <nice-to-have input 3>

# VERSION POLICY

Branch per HTK: `htk/<short-label>/<YYYYMMDD>-v<n>`
Tag on merge: `htk/<short-label>/<YYYYMMDD>-v<n>/<PASS|FAIL>`
Artifacts path: `experiments/<short-label>/{fixtures,report.md,trace/*}`
```

## Examples

### Example 1: API Performance Pipeline

**Input:** `$ARGUMENTS: "Reduce API latency to under 200ms within 2 weeks"`

**Output:**
```
# NORTH STAR

Outcome: Reduce API p95 latency to < 200ms under 500 RPS load within 2 weeks

# PIPELINE (WIP=1)

1. redis-cache — Prove caching reduces DB load by 70%. Why: Quick win, low risk. DB CPU at 85%.
2. db-index — Prove composite indexes cut query time 50%. Why: Addresses most expensive queries directly.
3. n+1-elimination — Prove eager loading reduces query count 80%. Why: Systematic fix for multiple endpoints.
4. connection-pool — Prove tuned pool handles 500 RPS without errors. Why: Scales under target load.
5. cdn-static — Prove CDN offloads 60% of traffic. Why: Reduces server load for assets.

Stop Rules: p95 < 200ms OR 10 business days OR $500 infrastructure budget

Inputs to unblock first 2 HTKs:
- Staging environment with production data subset
- k6 load testing scripts configured
- Redis instance provisioned (ElastiCache or local)
- Database query analysis (slow query log)

# VERSION POLICY

Branch per HTK: `htk/<short-label>/YYYYMMDD-v<n>`
Tag on merge: `htk/<short-label>/YYYYMMDD-v<n>/<PASS|FAIL>`
Artifacts path: `experiments/<short-label>/{fixtures,report.md,trace/*}`
```

### Example 2: Feature Launch Pipeline

**Input:** `$ARGUMENTS: "Ship user dashboard with core features in 3 weeks"`

**Output:**
```
# NORTH STAR

Outcome: Launch user dashboard with activity feed, stats widget, and export within 3 weeks

# PIPELINE (WIP=1)

1. data-access — Prove API endpoints return dashboard data < 500ms. Why: Foundation; blocks UI work.
2. activity-feed — Prove feed component renders 100 items smoothly. Why: Most complex UI; highest risk.
3. stats-widget — Prove charts render with mock data. Why: Independent, can parallelize later.
4. export-csv — Prove CSV generation works for 10k rows. Why: Simple; nice-to-have if time permits.
5. integration-test — Prove E2E flow completes without errors. Why: Validates all pieces work together.

Stop Rules: All core features working OR 15 business days

Inputs to unblock first 2 HTKs:
- Dashboard API spec finalized
- Design mockups for activity feed
- Staging environment access
- Sample datasets for testing

# VERSION POLICY

Branch per HTK: `htk/<short-label>/YYYYMMDD-v<n>`
Tag on merge: `htk/<short-label>/YYYYMMDD-v<n>/<PASS|FAIL>`
Artifacts path: `experiments/<short-label>/{fixtures,report.md,trace/*}`
```

### Example 3: Refactoring Pipeline

**Input:** `$ARGUMENTS: "Improve test coverage for payment module to 90%"`

**Output:**
```
# NORTH STAR

Outcome: Payment module test coverage ≥ 90% with all edge cases covered

# PIPELINE (WIP=1)

1. extract-validation — Prove validation logic can be tested in isolation. Why: Currently 0% coverage; most critical path.
2. mock-stripe — Prove Stripe API calls can be mocked reliably. Why: Blocks testing payment flow.
3. edge-cases — Prove retry logic handles network failures correctly. Why: Production bugs from untested failures.
4. integration-suite — Prove full payment flow passes with test Stripe account. Why: Validates real integration.

Stop Rules: Coverage ≥ 90% OR 5 business days

Inputs to unblock first 2 HTKs:
- Stripe test account credentials
- List of production payment bugs (edge cases)
- Current coverage report baseline

# VERSION POLICY

Branch per HTK: `htk/<short-label>/YYYYMMDD-v<n>`
Tag on merge: `htk/<short-label>/YYYYMMDD-v<n>/<PASS|FAIL>`
Artifacts path: `experiments/<short-label>/{fixtures,report.md,trace/*}`
```

## WIP=1 Discipline

**Rule**: Only one HTK active at a time

**Benefits**:
- Clear focus
- No context switching
- Easy to isolate results
- Cleaner git history

**Process**:
1. Complete or fail current HTK
2. Commit artifacts
3. Update pipeline (replan if needed)
4. Start next HTK

## Pipeline Adaptation

Pipelines are living documents. Update when:
- HTK reveals unexpected insights
- Dependencies change
- Priorities shift
- Better approach discovered

Use `/htk-summarize` to replan after significant learnings.

## Validation Rules

Before outputting plan:
- [ ] North star is one sentence with constraints
- [ ] 3-7 HTKs (not too few, not too many)
- [ ] HTKs ranked by dependency and impact
- [ ] Each HTK has label + proof + why-first
- [ ] Stop rules are concrete and measurable
- [ ] Inputs identify blockers for first 1-2 HTKs
- [ ] Version policy specified

## Integration

Called by `htk-workflow` skill when:
- User has multi-step goal
- Single HTK insufficient
- Needs roadmap/planning

After plan created, use `/htk-run-next` to execute HTKs sequentially.
