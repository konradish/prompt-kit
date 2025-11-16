# HTK Run Next

Execute the next HTK from an active pipeline with version hygiene: **$ARGUMENTS**

## Purpose

When working with a multi-HTK pipeline, present the next HTK for execution with proper git branching and version management.

## Execution

### 1. Verify Prerequisites

Check:
- [ ] Active pipeline exists (from `/htk-plan`)
- [ ] WIP=1 (no active HTKs currently running)
- [ ] Working tree is clean (`git status`)
- [ ] Previous HTK is resolved (PASS/FAIL committed)

If any check fails, report and ask user to resolve.

### 2. Select Next HTK

From pipeline:
- Get next pending HTK (first non-completed)
- Verify inputs available (from "Inputs to unblock")
- Check stop rules not triggered

### 3. Generate Full HTK

Call `/htk-create` with next HTK label and context to generate complete structure.

### 4. Add Version Steps

Include git workflow for pipeline execution:

```
# VERSION STEPS

Before: working tree clean ✓
Branch: `htk/<short-label>/<YYYYMMDD>-v1`
After test: commit scoped files only
Commit msg: `"HTK:<short-label> — <PASS/FAIL> — <metric summary>"`
Tag on merge: `htk/<short-label>/<YYYYMMDD>-v1/<PASS|FAIL>`
Artifacts: experiments/<short-label>/{report.md,trace/*}
```

### 5. Present to User

Output:
1. **Context**: Which HTK in pipeline (e.g., "2 of 5")
2. **Full HTK**: Complete HTK structure
3. **Version Steps**: Git workflow commands
4. **Ready Check**: Confirm inputs available

### 6. Post-Execution

After user reports results:
- Update pipeline status
- Call `/htk-summarize` if significant learning
- Present next HTK if continuing

## Output Format

```
# PIPELINE STATUS

Current: HTK <n> of <total>
Completed: <list of PASS/FAIL HTKs>
Remaining: <list of pending HTKs>

---

<Full HTK structure from /htk-create>

---

# VERSION STEPS

Before:
```bash
git status  # Ensure clean
```

Create branch:
```bash
git checkout -b htk/<short-label>/$(date +%Y%m%d)-v1
```

After execution (PASS):
```bash
git add <code-files> experiments/<short-label>/
git commit -m "HTK:<short-label> — PASS — <metric summary>

Updated:
- <documentation files>
- experiments/<short-label>/report.md"

git checkout main
git merge htk/<short-label>/$(date +%Y%m%d)-v1
git tag htk/<short-label>/$(date +%Y%m%d)-v1/PASS
```

After execution (FAIL):
```bash
# Save patch
git diff > experiments/<short-label>/attempt.patch

# Commit artifacts only
git add experiments/<short-label>/
git commit -m "HTK:<short-label> — FAIL — <metric summary>

Analysis: <brief finding>"

# Revert code
git checkout main
git branch -D htk/<short-label>/$(date +%Y%m%d)-v1
git tag htk/<short-label>/$(date +%Y%m%d)-v1/FAIL
```

---

# READY CHECK

Inputs required:
- [ ] <input 1>
- [ ] <input 2>

All ready? Proceed with test execution.
```

## Example

**Input:** `$ARGUMENTS: (continuing API performance pipeline)`

**Output:**
```
# PIPELINE STATUS

Current: HTK 2 of 5
Completed:
- redis-cache: PASS — p95 dropped to 180ms (was 250ms)
Remaining:
- db-index (current)
- n+1-elimination
- connection-pool
- cdn-static

Stop rule: p95 < 200ms ✓ (achieved! May stop after this HTK)

---

# HTK: db-index

Goal: Further reduce query latency with targeted indexes

Hypothesis: If we add composite index on events(user_id, created_at), avg query time drops below 30ms as shown by pgbench measurements

Test:
* Change: CREATE INDEX idx_events_user_created ON events(user_id, created_at DESC)
* Method: Apply to staging DB, run pgbench with 10k queries, measure avg latency
* Rollback: DROP INDEX idx_events_user_created

Verify:
* Metric: avg query time < 30ms (pgbench avg latency output)
* Evidence: experiments/db-index/pgbench-output.log

Decision:
* Pass → Stop (already under 200ms target) OR optimize next-slowest query
* Fail → EXPLAIN ANALYZE slow queries → Consider table partitioning → Retest

Why first: Redis cache helped but p95 still at 180ms; DB queries still taking 80-120ms. This targets the slowest remaining query.

---

# VERSION STEPS

Before:
```bash
git status  # Ensure clean
```

Create branch:
```bash
git checkout -b htk/db-index/$(date +%Y%m%d)-v1
```

After execution (PASS):
```bash
git add migrations/add_events_index.sql experiments/db-index/
git commit -m "HTK:db-index — PASS — avg query 25ms (was 90ms)

Updated:
- specs/database-schema.md (new index documented)
- experiments/db-index/report.md
- experiments/db-index/pgbench-output.log"

git checkout main
git merge htk/db-index/$(date +%Y%m%d)-v1
git tag htk/db-index/$(date +%Y%m%d)-v1/PASS
```

After execution (FAIL):
```bash
# Save patch
git diff > experiments/db-index/attempt.patch

# Commit artifacts only
git add experiments/db-index/
git commit -m "HTK:db-index — FAIL — avg query 85ms (threshold: 30ms)

Analysis: Index created but query planner not using it. Need to update table statistics."

# Revert code
git checkout main
git branch -D htk/db-index/$(date +%Y%m%d)-v1
git tag htk/db-index/$(date +%Y%m%d)-v1/FAIL
```

---

# READY CHECK

Inputs required:
- [x] Staging database access
- [x] pgbench installed
- [x] Slow query identified (events table user_id + created_at lookup)
- [ ] Database backup (recommended before schema change)

Create backup first? (y/n)
```

## Validation Rules

Before presenting HTK:
- [ ] Pipeline exists and is valid
- [ ] WIP=1 confirmed
- [ ] Git working tree clean
- [ ] Next HTK is unambiguous
- [ ] Stop rules checked (don't continue if met)
- [ ] Version steps include both PASS and FAIL paths
- [ ] Artifacts directory specified

## Integration

Called by `htk-workflow` skill when:
- Active pipeline exists (from `/htk-plan`)
- User ready to execute next HTK
- Previous HTK completed

Coordinates with:
- `/htk-create` - Generate HTK structure
- `/htk-summarize` - Replan if needed
