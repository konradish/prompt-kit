# HTK Create

Generate a complete HTK (Hypothesis → Test Kernel) structure: **$ARGUMENTS**

## Purpose

Create a well-formed HTK with clear hypothesis, single change, measurable outcome, and decision tree.

## HTK Types

### Standard HTK
Test a specific hypothesis about implementation, performance, or behavior.

### Tracer Bullet HTK
**When**: Architecture is unproven, building something new, or integration path is uncertain.

A tracer bullet HTK validates that the end-to-end path exists before optimizing any piece. It's a thin slice through ALL layers—just enough to prove data can flow from start to finish.

**Tracer Bullet Characteristics**:
- Change touches multiple layers (but minimally)
- Metric is "path works" not "path is optimal"
- Pass enables detailed HTKs on individual components
- Fail reveals hard blockers early (before wasted effort)

## Execution

### 1. Parse Input

Extract from `$ARGUMENTS`:
- Goal or desired outcome
- Proposed change or approach
- Success criteria (if mentioned)
- Constraints or context

### 2. Formulate Hypothesis

Structure: **"If we do X, Y happens as shown by Z"**

Requirements:
- X = ONE specific change
- Y = Measurable outcome
- Z = Concrete evidence/metric

### 3. Define Test

**Change**: The single variable to modify
- Must be atomic (one thing)
- Must be reversible
- Should be timboxed (hours or days, not weeks)

**Method**: How to execute
- Where to make change (file/service/config)
- Steps to implement (minimal)
- Time limit

**Rollback**: Exact reversion step
- Should be one command
- Should be tested/verified
- Failsafe if test goes wrong

### 4. Define Verification

**Metric**: Quantitative threshold
- Numeric value (latency < 100ms, coverage > 80%)
- Measurement method (tool/command)
- Baseline for comparison

**Evidence**: Where proof lives
- File path in experiments/<slug>/
- Specify format (JSON, screenshot, log)

### 5. Build Decision Tree

**Pass path**:
- What's the next logical step?
- What builds on this success?

**Fail path**:
- Most likely cause of failure
- Diagnostic step to confirm
- Alternative approach
- How to replan

### 6. Why-First Reasoning

≤2 sentences explaining:
- Why this HTK now?
- What's the user/business impact?
- Why this approach over alternatives?

### 7. Output Format

```
# HTK: <short-label>

Goal: <one sentence>

Hypothesis: <if we do X, Y happens as shown by Z>

Test:
* Change: <the one change>
* Method: <where/how; minimal steps; timebox>
* Rollback: <exact step>

Verify:
* Metric: <metric + threshold>
* Evidence: <experiments/<slug>/file.ext>

Decision:
* Pass → <next smallest module/test>
* Fail → <diagnostic step> → <alternative> → <rerun plan>

Why first: <≤2 sentences>
```

## Examples

### Example 1: Performance HTK

**Input:** `$ARGUMENTS: "Test if Redis caching reduces database load"`

**Output:**
```
# HTK: redis-cache

Goal: Validate Redis caching reduces database query load

Hypothesis: If we add Redis cache to GET /users/:id (1hr TTL), DB queries drop below 30% of baseline as shown by query count metrics

Test:
* Change: Add Redis middleware to user lookup endpoint only
* Method: Deploy to staging, run k6 load test (100 RPS, 5 min), monitor DB query count
* Rollback: git revert <commit> && redeploy

Verify:
* Metric: DB queries < 30% of baseline (CloudWatch RDS metrics)
* Evidence: experiments/redis-cache/cloudwatch-before-after.png

Decision:
* Pass → Implement cache invalidation on user updates, then expand to other GET endpoints
* Fail → Check cache hit rate in Redis metrics → If < 50%, analyze cache key strategy → If ≥ 50%, profile application to find real bottleneck → Retest with adjusted hypothesis

Why first: DB CPU consistently > 85%; users report 3s page loads; 70% of queries are user lookups that change infrequently.
```

### Example 2: Feature Viability HTK

**Input:** `$ARGUMENTS: "Prove we can implement real-time notifications"`

**Output:**
```
# HTK: realtime-notifications

Goal: Prove WebSocket-based notifications are feasible with current infrastructure

Hypothesis: If we build WebSocket POC with Socket.io, 100 concurrent connections receive notifications within 200ms as shown by latency measurements

Test:
* Change: Create experiments/websocket-poc/ with Socket.io server and test client
* Method: Run local server, connect 100 browser tabs, send test notifications, measure delivery latency
* Rollback: rm -rf experiments/websocket-poc/

Verify:
* Metric: 100 concurrent clients, p95 delivery latency < 200ms
* Evidence: experiments/websocket-poc/latency-results.json

Decision:
* Pass → Research production WebSocket hosting (AWS API Gateway WebSocket vs self-hosted)
* Fail → Identify bottleneck (CPU/memory/network) → If infrastructure limited, try polling alternative → If Socket.io issue, try native WebSocket → Retest

Why first: Enterprise customers request real-time updates; competitor launched this feature; sales team needs it for next quarter.
```

### Example 3: Refactoring HTK

**Input:** `$ARGUMENTS: "Refactor authentication middleware for testability"`

**Output:**
```
# HTK: auth-refactor

Goal: Refactor auth middleware without changing behavior

Hypothesis: If we extract JWT validation into pure function, test coverage reaches 90% and all existing tests pass

Test:
* Change: Extract validateJWT() pure function from auth middleware
* Method: Refactor in auth.ts, run full test suite with coverage
* Rollback: git revert <commit>

Verify:
* Metric: coverage ≥ 90% for auth module AND all 47 existing tests pass
* Evidence: experiments/auth-refactor/coverage-report.html

Decision:
* Pass → Refactor authorization logic next (permission checks)
* Fail → Identify which tests broke → Add missing test cases → Ensure pure function handles all edge cases → Retest

Why first: Auth bugs in production last month; current middleware has 45% coverage and is hard to test due to tight coupling.
```

### Example 4: Tracer Bullet HTK

**Input:** `$ARGUMENTS: "Prove we can build a data pipeline from Kafka to dashboard"`

**Output:**
```
# HTK: tracer-kafka-dashboard

Goal: Prove data can flow from Kafka event → processing → storage → API → dashboard

Hypothesis: If we build minimal e2e path, a test event appears on dashboard within 5 seconds

Test:
* Change: Create thin path: Kafka consumer → write to DB → API endpoint → React component
* Method:
  - Kafka consumer: read from test topic, write raw JSON to Postgres
  - API: single GET endpoint returning latest 10 events
  - Dashboard: simple list component showing events
  - Send 10 test events, verify all appear
* Rollback: git revert <commit> (all in one branch)

Verify:
* Metric: 10/10 events visible on dashboard within 5s of send
* Evidence: experiments/tracer-kafka-dashboard/screenshot.png + timing-log.json

Decision:
* Pass → HTK on each layer: Kafka throughput, DB schema, API performance, dashboard UX
* Fail → Identify which layer blocked (Kafka auth? DB connection? API routing? CORS?)
  → Fix blocker → Rerun tracer before detailed work

Why first: Three teams will build pieces of this pipeline; tracer proves integration works before parallel development begins.
```

**Note**: This tracer bullet deliberately does NOT optimize any layer. It's a thin slice proving the path exists. Once PASS, each team can HTK their layer knowing the integration works.

## Validation Rules

Before outputting HTK, verify:
- [ ] Hypothesis has clear if/then/shown-by structure
- [ ] Change is ONE thing (atomic)
- [ ] Method includes timebox
- [ ] Rollback is explicit and safe
- [ ] Metric is quantitative with threshold
- [ ] Evidence path specified in experiments/
- [ ] Decision tree covers both pass and fail
- [ ] Why-first ≤ 2 sentences
- [ ] No placeholders or TBDs

## Integration

Called by `htk-workflow` skill when:
- User has clear hypothesis to test
- FOCUS has been chosen
- Ready to execute experiment
- Architectural certainty is LOW (create tracer bullet HTK)

**Decision flow**:
1. Assess architectural certainty
2. If LOW → Create tracer bullet HTK first
3. If HIGH → Create standard HTK targeting specific hypothesis
4. After HTK completes → Decide next HTK based on learnings (never pre-plan)

Often followed by `/htk-run-next` for execution with git hygiene.
