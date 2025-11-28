# HTK Workflow Reference

Comprehensive guide to HTK patterns, pipelines, version management, and troubleshooting.

---

## HTK Patterns

### Pattern 1: Performance Optimization

```
Goal: Validate [optimization] improves [metric]

Hypothesis: If we [change], [metric] reaches [threshold] as shown by [test]

Test:
* Change: [Single optimization - cache/index/algorithm]
* Method: [Implementation, test harness, duration]
* Rollback: git revert <commit> OR feature flag flip

Verify:
* Metric: [Quantitative threshold - latency/throughput/resource]
* Evidence: experiments/<slug>/results.json

Decision:
* Pass → Optimize [next bottleneck] OR roll out
* Fail → Profile [component] → [Alternative] → Retest

Why first: [User impact ≤2 sentences]
```

**Example:**
```
Goal: Reduce database query latency for user dashboard

Hypothesis: If we add composite index on (user_id, created_at), avg query time drops below 50ms

Test:
* Change: CREATE INDEX idx_events_user_created ON events(user_id, created_at)
* Method: Apply to staging, run pgbench for 5 minutes
* Rollback: DROP INDEX idx_events_user_created

Verify:
* Metric: avg query time < 50ms (pgbench output)
* Evidence: experiments/composite-index/pgbench.log

Decision:
* Pass → Add similar indexes to related tables
* Fail → Analyze EXPLAIN plans → Consider partitioning → Retest

Why first: Dashboard loads in 3.2s; 80% of time is this query.
```

### Pattern 2: Feature Viability

```
Goal: Prove [feature] is technically feasible with [constraint]

Hypothesis: If we build [minimal version], [success criterion] within [timebox]

Test:
* Change: Implement [smallest feature slice]
* Method: Proof-of-concept, no production code
* Rollback: Delete POC directory

Verify:
* Metric: [Capability demonstrated + quality bar]
* Evidence: experiments/<slug>/demo.mp4 OR test-output.txt

Decision:
* Pass → Design production implementation
* Fail → [Blocking issue] → [Alternative] → Retest

Why first: [Customer request or strategic value]
```

### Pattern 3: Refactoring

```
Goal: Refactor [component] without changing behavior

Hypothesis: If we refactor [code], all tests pass and [quality metric] improves

Test:
* Change: Refactor [specific component]
* Method: Run full test suite + quality tool
* Rollback: git revert <commit>

Verify:
* Metric: 100% tests pass + [quality improvement]
* Evidence: test-output.txt + coverage-report.html

Decision:
* Pass → Refactor [next component]
* Fail → Fix broken tests → Identify missed edge case → Retest

Why first: [Technical debt impact]
```

---

## Multi-HTK Pipelines

### Pipeline Format

```
# NORTH STAR

Outcome: [One-sentence result + constraints]

# PIPELINE (ranked HTKs, 3–7 items; WIP=1)

1. <short-label> — What it proves (≤1 sentence). Why-first (≤2).
2. <short-label> — What it proves. Why-first.
3. ...

Stop Rules: <metric floor, timebox, budget>
Inputs to unblock first 1–2 HTKs: <bullets>
```

### Example Pipeline

```
# NORTH STAR

Outcome: Reduce API p95 latency to < 200ms under 500 RPS within 2 weeks

# PIPELINE (WIP=1)

1. redis-cache — Prove caching reduces DB load 70%. Why: Quick win, low risk.
2. db-index — Prove composite indexes cut query time 50%. Why: Root cause.
3. query-optimization — Prove N+1 elimination reduces queries 80%. Why: Systematic.
4. connection-pooling — Prove pool tuning handles 500 RPS. Why: Scales under load.

Stop Rules: p95 < 200ms, 10 business days, $500 infrastructure budget
Inputs: Staging with production data, k6 scripts, Redis instance
```

### Pipeline Execution

1. **Plan** (`/htk/plan`): Define north star, rank HTKs, set stop rules
2. **Run Next** (`/htk/run-next`): Execute next HTK, branch, commit, tag
3. **Summarize** (`/htk/summarize`): Roll up completed, document learnings

### Replan Format

```
# REPLAN

Keep: <HTKs still valuable>
Drop: <HTKs no longer relevant>
Add: <new HTKs discovered>

Reason: [1-2 sentences]
Next HTK proposed: <label> — Why-next (≤2)
```

---

## Version Management

### Branch Strategy

**Single HTK** (simple hygiene):
- Work on main
- Pass → commit code + artifacts
- Fail → save patch, commit artifacts, revert code

**Pipeline HTKs** (branch per HTK):
```
htk/<short-label>/<YYYYMMDD>-v<n>
```

### Commit Format

```
HTK:<short-label> — <PASS/FAIL> — <metric summary>

Updated:
- [documentation files if PASS]
- experiments/<label>/[artifacts]
```

### Tagging

```bash
git tag htk/<short-label>/<YYYYMMDD>-v<n>/<PASS|FAIL>

# Search tags
git tag -l "htk/*"           # All HTKs
git tag -l "htk/*/PASS"      # Passed only
```

### Artifacts Structure

```
experiments/<short-label>/
├── hypothesis.md          # Original HTK
├── attempt.patch          # Code changes (if FAIL)
├── report.md              # Findings
└── trace/                 # Evidence
    ├── benchmark.log
    └── results.json
```

---

## Troubleshooting

### Issue 1: HTK Scope Too Large

**Symptoms**: Multiple changes, unclear causation, takes > 1 day

**Fix**: Decompose into smaller HTKs, each testing ONE variable

```
❌ Too Large:
Hypothesis: If we add caching, indexing, and query optimization, latency drops

✅ Decomposed:
HTK1: If we add Redis cache, DB queries drop 70%
HTK2: If we add composite index, query time < 50ms
HTK3: If we optimize N+1 queries, query count drops 80%
```

### Issue 2: Unclear Pass/Fail

**Symptoms**: Debate about results, subjective interpretation

**Fix**: Define numeric threshold with measurement method

```
❌ Unclear: Performance improves
✅ Clear: p95 latency < 100ms (k6 test, 100 RPS, 1min duration)
```

### Issue 3: Failed HTK, Unclear Next Step

**Fix**: Include diagnostic step and alternative in decision tree

```
Decision:
* Pass → Roll out
* Fail →
  1. Check cache hit rate < 50%? → Improve cache keys
  2. Otherwise → Profile for real bottleneck
  3. Alternative: Try query optimization
```

### Issue 4: Documentation Drift

**Fix**: Add documentation checklist before marking PASS

```
Before marking PASS:
- [ ] specs/ updated if architecture changed
- [ ] docs/ updated if behavior changed
- [ ] .claude/skills/ updated if workflows changed
```

---

## Anti-Patterns

### ❌ Multiple Changes
Can't isolate which change caused result. **Fix**: One HTK per change.

### ❌ No Metric
"Feels faster" is subjective. **Fix**: Quantitative threshold.

### ❌ No Rollback Plan
Can't safely experiment. **Fix**: Always define exact rollback step.

### ❌ Building on Unproven Foundation
Compounds risk if dependency fails. **Fix**: Wait for HTK1 PASS before HTK2.

### ❌ WIP > 1
Context switching, merge conflicts. **Fix**: Complete current HTK before next.

---

## Quick Reference

### HTK Checklist

- [ ] Goal is one sentence
- [ ] Hypothesis has if/then/shown-by structure
- [ ] Change is ONE thing
- [ ] Method includes timebox
- [ ] Rollback is explicit
- [ ] Metric is quantitative with threshold
- [ ] Evidence location specified
- [ ] Decision tree covers pass and fail
- [ ] Why-first explains reasoning (≤2 sentences)
- [ ] Working tree is clean

### Version Hygiene

- [ ] Working tree clean before starting
- [ ] Branch created (if pipeline)
- [ ] Changes scoped to HTK only
- [ ] Artifacts in experiments/<label>/
- [ ] Commit message follows format
- [ ] Tag added (if pipeline)
- [ ] Documentation updated (if PASS)

### Documentation Sync

- [ ] specs/ updated if architecture changed
- [ ] docs/ updated if behavior changed
- [ ] .claude/skills/ updated if workflows changed
- [ ] Updated files listed in commit message
