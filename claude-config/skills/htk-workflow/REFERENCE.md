# HTK Workflow Reference

Comprehensive guide to HTK patterns, multi-HTK pipelines, version management, and troubleshooting.

## Table of Contents

1. [HTK Patterns](#htk-patterns)
2. [Multi-HTK Pipelines](#multi-htk-pipelines)
3. [Version Management](#version-management)
4. [Troubleshooting](#troubleshooting)
5. [Examples by Domain](#examples-by-domain)

---

## HTK Patterns

### Pattern 1: Performance Optimization HTK

**Structure:**
```
Goal: Validate [optimization] improves [metric]

Hypothesis: If we [change], [metric] reaches [threshold] as shown by [test]

Test:
* Change: [Single optimization - cache/index/algorithm]
* Method: [Implementation location, test harness, duration]
* Rollback: git revert <commit> OR feature flag flip

Verify:
* Metric: [Quantitative threshold - latency/throughput/resource]
* Evidence: experiments/<slug>/[benchmark-tool]-results.json

Decision:
* Pass → Optimize [next bottleneck] OR roll out to production
* Fail → Profile [component] → [Alternative approach] → Retest

Why first: [User impact or business constraint in ≤2 sentences]
```

**Example:**
```
Goal: Reduce database query latency for user dashboard

Hypothesis: If we add composite index on (user_id, created_at), avg query time drops below 50ms

Test:
* Change: CREATE INDEX idx_events_user_created ON events(user_id, created_at)
* Method: Apply migration to staging, run pgbench for 5 minutes
* Rollback: DROP INDEX idx_events_user_created

Verify:
* Metric: avg query time < 50ms (pgbench output)
* Evidence: experiments/composite-index/pgbench.log

Decision:
* Pass → Add similar indexes to related tables
* Fail → Analyze EXPLAIN plans → Consider partitioning → Retest

Why first: Dashboard loads in 3.2s; 80% of time is this query. Users complain daily.
```

### Pattern 2: Feature Viability HTK

**Structure:**
```
Goal: Prove [feature] is technically feasible with [constraint]

Hypothesis: If we build [minimal version], [success criterion] within [timebox]

Test:
* Change: Implement [smallest feature slice]
* Method: [Proof-of-concept approach, no production code]
* Rollback: Delete POC directory

Verify:
* Metric: [Capability demonstrated + quality bar]
* Evidence: experiments/<slug>/demo.mp4 OR test-output.txt

Decision:
* Pass → Design production implementation
* Fail → [Blocking issue] → [Alternative technology] → Retest

Why first: [Customer request or strategic value]
```

**Example:**
```
Goal: Prove real-time collaboration is feasible with current infrastructure

Hypothesis: If we use WebSockets + operational transforms, 10 concurrent editors sync within 200ms

Test:
* Change: Build POC with Socket.io + OT.js in experiments/realtime-collab/
* Method: Run local demo with 10 browser tabs, measure sync latency
* Rollback: rm -rf experiments/realtime-collab/

Verify:
* Metric: 10 concurrent editors, all changes sync < 200ms
* Evidence: experiments/realtime-collab/latency-test.json

Decision:
* Pass → Evaluate production Socket.io hosting options
* Fail → Identify bottleneck → Try CRDT alternative → Retest

Why first: Enterprise customers request collaborative editing; competitor launched it.
```

### Pattern 3: Integration HTK

**Structure:**
```
Goal: Validate integration with [external service] meets [requirements]

Hypothesis: If we integrate [service], [capability] works with [success criteria]

Test:
* Change: Add [service] SDK and auth flow
* Method: Integration test against [service staging/sandbox]
* Rollback: git revert <commit> + remove credentials

Verify:
* Metric: [Success rate + latency + error handling]
* Evidence: experiments/<slug>/integration-test-results.json

Decision:
* Pass → Implement production auth and error handling
* Fail → [API limitation] → Contact vendor OR choose alternative → Retest

Why first: [Business dependency or compliance requirement]
```

### Pattern 4: Refactoring HTK

**Structure:**
```
Goal: Refactor [component] without changing behavior

Hypothesis: If we refactor [code], all tests pass and [quality metric] improves

Test:
* Change: Refactor [specific component/module]
* Method: Run full test suite + [quality tool - coverage/complexity]
* Rollback: git revert <commit>

Verify:
* Metric: 100% tests pass + [quality improvement - e.g., cyclomatic complexity < 10]
* Evidence: test-output.txt + coverage-report.html

Decision:
* Pass → Refactor [next component]
* Fail → Fix broken tests → Identify missed edge case → Retest

Why first: [Technical debt impact or maintainability concern]
```

---

## Multi-HTK Pipelines

### Pipeline Structure

**North Star Format:**
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

### Example Pipeline: API Performance

```
# NORTH STAR

Outcome: Reduce API p95 latency to < 200ms under 500 RPS load within 2 weeks

# PIPELINE (WIP=1)

1. redis-cache — Prove caching reduces DB load by 70%. Why: Quick win, low risk.
2. db-index — Prove composite indexes cut query time 50%. Why: Addresses root cause.
3. query-optimization — Prove N+1 elimination reduces queries 80%. Why: Systematic fix.
4. connection-pooling — Prove pool tuning handles 500 RPS. Why: Scales under load.
5. cdn-static — Prove CDN offloads 60% traffic. Why: Reduces server load.

Stop Rules: p95 < 200ms, 10 business days, $500 infrastructure budget
Inputs to unblock first 2 HTKs:
- Staging environment with production data subset
- k6 load testing scripts
- Redis instance provisioned
```

### Pipeline Execution Flow

**Step 1: Plan** (`/htk-plan`)
- Define north star outcome
- Rank HTKs by impact and risk
- Set stop rules
- Identify blockers

**Step 2: Run Next** (`/htk-run-next`)
- Check WIP=1 (no active HTKs)
- Present next HTK from pipeline
- Create branch: `htk/<label>/YYYYMMDD-v1`
- Execute test
- Commit with result
- Tag: `htk/<label>/YYYYMMDD-v1/<PASS|FAIL>`

**Step 3: Summarize** (`/htk-summarize`)
- Roll up completed HTKs
- Document learnings
- Update pipeline (keep/drop/add)
- Propose next HTK

### Pipeline Adaptation

**When to Replan:**
- HTK reveals unexpected blocker
- External priority changes
- Stop rule triggered early
- Discovered better approach

**Replan Format:**
```
# REPLAN

Keep: <labels of HTKs still valuable>
Drop: <labels of HTKs no longer relevant>
Add: <new HTKs discovered during execution>

Reason: [1-2 sentences explaining why]

Next HTK proposed: <label> — Why-next (≤2)
```

---

## Version Management

### Branch Strategy

**Single HTK:**
Simple hygiene (no branches):
- Work on main
- Pass → commit code + artifacts
- Fail → save patch, commit artifacts, revert code

**Pipeline HTKs:**
Branch per HTK:
```
htk/<short-label>/<YYYYMMDD>-v<n>
```

**Examples:**
```
htk/redis-cache/20250116-v1
htk/redis-cache/20250116-v2  (if v1 failed and retrying)
htk/db-index/20250117-v1
```

### Commit Message Format

```
HTK:<short-label> — <PASS/FAIL> — <metric summary>

[Optional details]

Updated:
- [documentation files if PASS]
- experiments/<label>/[artifacts]
```

**Examples:**
```
HTK:redis-cache — PASS — p95 dropped to 85ms (was 250ms)

Updated:
- specs/modules/caching.md (new Redis layer)
- experiments/redis-cache/k6-results.json
```

```
HTK:db-index — FAIL — avg query time 120ms (threshold: 50ms)

Index helped but insufficient. Need to denormalize data.

Updated:
- experiments/db-index/pgbench.log
- experiments/db-index/attempt.patch
```

### Tagging Strategy

**On Pipeline Merge:**
```
htk/<short-label>/<YYYYMMDD>-v<n>/<PASS|FAIL>
```

**Examples:**
```bash
git tag htk/redis-cache/20250116-v1/PASS
git tag htk/db-index/20250117-v1/FAIL
```

**Benefits:**
- Quick history search: `git tag -l "htk/*"`
- Filter by outcome: `git tag -l "htk/*/PASS"`
- Chronological view: `git tag -l "htk/*/202501*"`

### Artifacts Directory Structure

```
experiments/
├── <short-label>/
│   ├── hypothesis.md          # Original HTK
│   ├── attempt.patch          # Code changes (if FAIL)
│   ├── report.md              # Findings and learnings
│   ├── fixtures/              # Test data
│   │   ├── input.json
│   │   └── expected.json
│   └── trace/                 # Evidence
│       ├── benchmark.log
│       ├── screenshot.png
│       └── results.json
```

**Example:**
```
experiments/
├── redis-cache/
│   ├── hypothesis.md
│   ├── report.md              # Documented 66% latency reduction
│   └── trace/
│       ├── k6-baseline.json   # Before cache
│       └── k6-cached.json     # After cache
├── db-index/
│   ├── hypothesis.md
│   ├── attempt.patch          # Failed attempt
│   ├── report.md              # Analysis of why it failed
│   └── trace/
│       └── pgbench.log
```

---

## Troubleshooting

### Issue 1: HTK Scope Too Large

**Symptoms:**
- Multiple changes required
- Unclear which change caused result
- Takes > 1 day to execute

**Cause:** Hypothesis tests multiple variables

**Solution:**
1. Decompose into smaller HTKs
2. Each HTK tests ONE variable
3. Create pipeline if needed

**Example:**
```
❌ Too Large:
Hypothesis: If we add caching, indexing, and query optimization,
API latency drops below 100ms

✅ Decomposed:
HTK1: If we add Redis cache, DB queries drop 70%
HTK2: If we add composite index, query time < 50ms
HTK3: If we optimize N+1 queries, query count drops 80%
```

### Issue 2: Unclear Pass/Fail Criteria

**Symptoms:**
- Debate about whether HTK passed
- Subjective interpretation of results
- No clear threshold

**Cause:** Metric not quantitative or threshold missing

**Solution:**
1. Define numeric threshold
2. Specify measurement method
3. Include baseline for comparison

**Example:**
```
❌ Unclear:
Metric: Performance improves

✅ Clear:
Metric: p95 latency < 100ms (k6 test, 100 RPS, 1min duration)
Baseline: Currently 250ms
```

### Issue 3: Failed HTK, Unclear Next Step

**Symptoms:**
- HTK fails but no clear alternative
- Decision tree doesn't help
- Uncertain how to proceed

**Cause:** Insufficient failure analysis in HTK design

**Solution:**
1. Identify most likely failure cause upfront
2. Define diagnostic step
3. Specify alternative approach

**Example:**
```
Decision:
* Pass → Roll out to production
* Fail →
  1. Check if cache hit rate < 50% (diagnostic)
     → If yes: Improve cache key strategy
     → If no: Profile to find real bottleneck
  2. Alternative: Try query optimization instead
  3. Retest with adjusted hypothesis
```

### Issue 4: Documentation Drift

**Symptoms:**
- HTK passes but docs outdated
- Team unaware of new patterns
- Skills reference old approach

**Cause:** Forgot documentation sync step

**Solution:**
1. Add documentation checklist to HTK template
2. Update before marking PASS
3. Include in commit message

**Example:**
```
Before marking PASS, verify:
- [ ] specs/caching.md updated with Redis patterns
- [ ] .claude/skills/backend-developer/REFERENCE.md includes cache examples
- [ ] docs/api-reference.md reflects new latency SLAs
```

### Issue 5: Working Tree Not Clean

**Symptoms:**
- Git operations fail
- Unclear what's uncommitted
- Version hygiene breaks

**Cause:** Started HTK with uncommitted changes

**Solution:**
```bash
# Pre-check before every HTK
git status

# If unclean:
git stash push -m "Pre-HTK: <description>"

# After HTK:
git stash pop  # Only if PASS and compatible
```

---

## Examples by Domain

### Backend Development

#### HTK: Add Database Index
```
Goal: Reduce query latency for event lookup

Hypothesis: If we add index on (user_id, created_at), query time < 50ms

Test:
* Change: CREATE INDEX idx_events_user_created ON events(user_id, created_at)
* Method: Apply to staging, run 10k queries via pgbench
* Rollback: DROP INDEX idx_events_user_created

Verify:
* Metric: avg query time < 50ms (pgbench avg latency)
* Evidence: experiments/db-index/pgbench.log

Decision:
* Pass → Add to remaining temporal queries
* Fail → EXPLAIN ANALYZE → Consider partitioning → Retest

Why first: Dashboard shows 3s load; 80% is this query.
```

#### HTK: API Caching
```
Goal: Validate Redis caching reduces DB load

Hypothesis: If we cache GET /users/:id (1hr TTL), DB queries drop 70%

Test:
* Change: Add Redis middleware to user endpoint
* Method: Deploy to staging, monitor for 1 hour under load
* Rollback: Remove cache middleware

Verify:
* Metric: DB queries < 30% of baseline (DataDog)
* Evidence: experiments/redis-cache/datadog-screenshot.png

Decision:
* Pass → Implement cache invalidation strategy
* Fail → Check cache hit rate → Adjust TTL → Retest

Why first: DB CPU at 85%; most queries are user lookups.
```

### Frontend Development

#### HTK: Code Splitting
```
Goal: Reduce initial bundle size

Hypothesis: If we lazy-load admin routes, main bundle < 200KB

Test:
* Change: Convert admin routes to lazy imports
* Method: Build and measure bundle with webpack-bundle-analyzer
* Rollback: git revert <commit>

Verify:
* Metric: main.js < 200KB gzipped
* Evidence: experiments/code-splitting/bundle-analysis.html

Decision:
* Pass → Lazy-load dashboard module
* Fail → Identify large dependencies → Move to chunks → Retest

Why first: Users report slow initial load (5s on 3G).
```

### Infrastructure

#### HTK: Auto-Scaling
```
Goal: Prove auto-scaling handles traffic spikes

Hypothesis: If we enable horizontal pod autoscaling, service handles 1000 RPS without errors

Test:
* Change: Add HPA config with CPU threshold 70%
* Method: k6 load test ramping to 1000 RPS
* Rollback: kubectl delete hpa <name>

Verify:
* Metric: 0% error rate at 1000 RPS (k6 output)
* Evidence: experiments/autoscaling/k6-results.json

Decision:
* Pass → Configure production HPA
* Fail → Review pod resource limits → Adjust threshold → Retest

Why first: Black Friday upcoming; expect 10x traffic.
```

### Testing

#### HTK: E2E Test Coverage
```
Goal: Increase critical path coverage

Hypothesis: If we add checkout flow E2E test, critical path coverage > 80%

Test:
* Change: Add Playwright test for cart → payment → confirmation
* Method: Run test suite, measure coverage
* Rollback: git revert <commit>

Verify:
* Metric: coverage report shows > 80% critical path coverage
* Evidence: experiments/e2e-coverage/coverage-report.html

Decision:
* Pass → Add tests for account management flow
* Fail → Identify gaps in test → Refine assertions → Retest

Why first: Production bugs in checkout; no automated tests.
```

---

## HTK Anti-Patterns

### ❌ Anti-Pattern 1: Multiple Changes

**Problem:**
```
Hypothesis: If we add caching, fix the N+1 queries, and upgrade the DB,
performance improves
```

**Why it fails:** Can't isolate which change caused improvement

**Fix:** One HTK per change

### ❌ Anti-Pattern 2: No Metric

**Problem:**
```
Verify: The application feels faster
```

**Why it fails:** Subjective, not reproducible

**Fix:** Define quantitative threshold

### ❌ Anti-Pattern 3: No Rollback Plan

**Problem:**
```
Test: Deploy to production and monitor
Rollback: ???
```

**Why it fails:** Can't safely experiment

**Fix:** Always define exact rollback step

### ❌ Anti-Pattern 4: Building on Unproven Foundation

**Problem:**
```
HTK1: Add feature X (not tested yet)
HTK2: Add feature Y that depends on X
```

**Why it fails:** Compounds risk if X fails

**Fix:** Wait for HTK1 PASS before starting HTK2

### ❌ Anti-Pattern 5: WIP > 1

**Problem:** Running 3 HTKs simultaneously

**Why it fails:**
- Context switching overhead
- Difficult to isolate results
- Merge conflicts

**Fix:** Complete or fail current HTK before starting next

---

## Quick Reference

### HTK Checklist

- [ ] Goal is one sentence
- [ ] Hypothesis has clear if/then/shown-by structure
- [ ] Change is ONE thing
- [ ] Method includes timebox
- [ ] Rollback is explicit and tested
- [ ] Metric is quantitative with threshold
- [ ] Evidence location specified
- [ ] Decision tree covers pass and fail
- [ ] Why-first explains reasoning (≤2 sentences)
- [ ] Working tree is clean

### Version Hygiene Checklist

- [ ] Working tree clean before starting
- [ ] Branch created (if pipeline): `htk/<label>/YYYYMMDD-v1`
- [ ] Changes scoped to HTK only
- [ ] Artifacts generated in experiments/<label>/
- [ ] Commit message follows format
- [ ] Tag added (if pipeline): `htk/<label>/YYYYMMDD-v1/<PASS|FAIL>`
- [ ] Documentation updated (if PASS)

### Documentation Sync Checklist

- [ ] specs/ updated if architecture changed
- [ ] docs/ updated if user-facing behavior changed
- [ ] .claude/skills/ updated if workflows changed
- [ ] Cross-references validated
- [ ] Updated files listed in commit message
