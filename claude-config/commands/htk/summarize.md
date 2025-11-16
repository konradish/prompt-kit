# HTK Summarize

Roll up completed HTKs, document learnings, and replan pipeline: **$ARGUMENTS**

## Purpose

After executing one or more HTKs, aggregate results, extract insights, and update the pipeline based on what was learned.

## Execution

### 1. Collect HTK History

Scan for completed HTKs from:
- Git tags: `git tag -l "htk/*"`
- Commits: `git log --grep="HTK:" --oneline -n 20`
- Artifacts: `experiments/*/report.md`

Parse:
- Label
- PASS/FAIL status
- Metric summary
- Key learnings

### 2. Analyze Results

**For PASS HTKs:**
- What capability is now proven?
- What assumptions validated?
- What new possibilities unlocked?

**For FAIL HTKs:**
- What was learned about the problem?
- What assumptions invalidated?
- What alternative approaches revealed?

### 3. Update State

**Proven solid:**
- What can we rely on going forward?
- What patterns are validated?
- What infrastructure is ready?

**Still uncertain:**
- What questions remain?
- What needs more investigation?
- What assumptions still untested?

### 4. Replan Pipeline

Based on learnings:

**Keep**: HTKs still valuable and relevant
**Drop**: HTKs no longer needed or invalidated
**Add**: New HTKs discovered during execution

### 5. Propose Next HTK

Recommend which HTK to run next with:
- Why this one now?
- What changed from original plan?
- What new information influenced decision?

## Output Format

```
# HTK SUMMARIZE

## RUN LOG (latest first)

* <short-label> — <PASS/FAIL> — <metric summary> — <key learning in ≤2 sentences>
* <short-label> — <PASS/FAIL> — <metric summary> — <key learning>
...

## STATE

### Proven Solid
- <capability or assumption now validated>
- <capability or assumption now validated>
...

### Still Uncertain
- <question or assumption still untested>
- <question or assumption still untested>
...

## REPLAN

### Keep
- <label>: <why still relevant>

### Drop
- <label>: <why no longer needed>

### Add
- <label>: <new HTK discovered> — <what it would prove>

## NEXT HTK PROPOSED

**Label**: <short-label>

**Why next**: <≤2 sentences explaining why this HTK now, given what we learned>

**Changed from plan**: <what's different from original pipeline and why>
```

## Examples

### Example 1: Performance Pipeline Rollup

**Input:** `$ARGUMENTS: (after completing 2 of 5 HTKs in API performance pipeline)`

**Output:**
```
# HTK SUMMARIZE

## RUN LOG (latest first)

* db-index — PASS — avg query 25ms (was 90ms) — Composite index on events table cut query time 72%. Query planner uses it effectively when both columns in WHERE clause.

* redis-cache — PASS — p95 latency 180ms (was 250ms) — Cache hit rate 85% after warmup. Biggest win on user lookups. Reduced DB CPU from 85% to 40%.

## STATE

### Proven Solid
- Redis caching effective for read-heavy endpoints (85% hit rate achievable)
- User lookup is dominant query pattern (70% of traffic)
- Composite indexes significantly improve temporal queries
- Current infrastructure can handle caching layer without issues

### Still Uncertain
- Will connection pool tuning help beyond current improvements?
- Is CDN necessary given 180ms is close to target?
- Are there other N+1 query patterns we haven't identified?

## REPLAN

### Keep
- n+1-elimination: Still likely valuable; haven't analyzed all endpoints yet

### Drop
- connection-pool: No longer bottleneck; DB CPU at 40% and connection count low
- cdn-static: 180ms already close to 200ms target; CDN optimization not worth effort

### Add
- query-monitoring: Add slow query monitoring to catch future regressions — Prevents backsliding; gives ongoing visibility

## NEXT HTK PROPOSED

**Label**: n+1-elimination

**Why next**: With caching and indexes in place, remaining latency likely from remaining endpoints that haven't been optimized. One spike in APM traces suggests product catalog endpoint has N+1 pattern.

**Changed from plan**: Originally planned to do all 5 HTKs, but performance already near target (180ms vs 200ms). After n+1 check, may stop early if we hit target. Dropped connection-pool and cdn-static as no longer necessary.
```

### Example 2: Feature Viability Assessment

**Input:** `$ARGUMENTS: (after testing real-time features)`

**Output:**
```
# HTK SUMMARIZE

## RUN LOG (latest first)

* scaling-test — FAIL — p95 latency 850ms at 500 connections (target: 200ms) — WebSocket infrastructure can't scale horizontally; sticky sessions required but not configured. Would need major infrastructure changes.

* websocket-poc — PASS — 100 connections, p95 latency 150ms — Basic WebSocket works fine at small scale. Socket.io library is solid choice.

## STATE

### Proven Solid
- Socket.io is reliable for WebSocket management
- Real-time notifications work at small scale (< 100 users)
- Message delivery is reliable with acknowledgments

### Still Uncertain
- Can we make WebSockets scale horizontally?
- Is polling a better alternative for our use case?
- What's customer tolerance for "near real-time" vs true real-time?

## REPLAN

### Keep
- (no remaining HTKs in original plan)

### Drop
- production-deployment: Can't deploy until scaling solved

### Add
- polling-alternative — Test if 5s polling meets user needs — Simpler architecture, easier to scale
- sticky-session-config — Prove ALB sticky sessions enable horizontal scaling — Addresses scaling issue if we need true real-time
- user-research — Prove users tolerate 5s update delay — Validates if polling sufficient

## NEXT HTK PROPOSED

**Label**: user-research

**Why next**: Before investing in complex WebSocket scaling or building polling fallback, validate whether users actually need real-time. Sales team might have over-promised.

**Changed from plan**: Original plan assumed WebSocket was the right solution. Scaling issues revealed complexity we didn't anticipate. Pivoting to validate requirements before committing to either solution.
```

### Example 3: Refactoring Progress

**Input:** `$ARGUMENTS: (after completing testing improvements)`

**Output:**
```
# HTK SUMMARIZE

## RUN LOG (latest first)

* integration-suite — PASS — 12 integration tests passing — Full payment flow validated with Stripe test account. Caught 2 bugs that unit tests missed.

* edge-cases — PASS — coverage 88% (was 65%) — Retry logic now tested for network failures, timeout, and rate limiting. Found bug in exponential backoff.

* mock-stripe — PASS — 15 unit tests passing — Successfully mocked Stripe SDK. Tests run in 200ms vs 3s with real API.

* extract-validation — PASS — coverage 92% for validation (was 0%) — Validation logic now pure functions. Easy to test. Found 3 bugs in edge cases.

## STATE

### Proven Solid
- Pure function extraction makes validation highly testable
- Stripe SDK can be reliably mocked for unit tests
- Integration tests with test Stripe account catch real issues
- All discovered bugs fixed and covered by tests

### Still Uncertain
- Are there production edge cases we haven't tested?
- How will this handle Stripe API changes?

## REPLAN

### Keep
- (all HTKs completed)

### Drop
- (none)

### Add
- webhook-testing — Prove webhook handling is robust — Production uses webhooks; not yet tested
- monitoring-integration — Add observability to payment flow — Want to catch issues in production

## NEXT HTK PROPOSED

**Label**: webhook-testing

**Why next**: Payment module is now 88% covered and solid, but production relies heavily on Stripe webhooks for charge.succeeded, payment_intent.failed, etc. This is critical path that's completely untested.

**Changed from plan**: Original plan achieved 90% coverage goal (88% is close enough). But during integration testing, realized webhooks are single point of failure. Adding this as new HTK before declaring victory.
```

## When to Summarize

Run this command when:
- Completed 2+ HTKs and need to replan
- HTK result significantly changed assumptions
- Pipeline midpoint review (e.g., 3 of 6 complete)
- Stop rule triggered (success or time/budget limit)
- Major learning requires rethinking approach

## Integration

Called by `htk-workflow` skill when:
- Multiple HTKs completed
- User requests progress review
- Significant learning requires replan
- Stop rule check needed

Can lead to:
- `/htk-plan` - Create new pipeline
- `/htk-run-next` - Continue with updated plan
- Completion - Goal achieved, stop

## Validation Rules

Before outputting summary:
- [ ] Run log includes all completed HTKs
- [ ] Learnings are concrete (not generic)
- [ ] State clearly separates proven vs uncertain
- [ ] Replan has clear keep/drop/add with rationale
- [ ] Next HTK proposed with reasoning
- [ ] Changed from plan explains pivots
