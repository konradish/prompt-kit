# HTK Scope

Set north star and stop rules for HTK work: **$ARGUMENTS**

## Purpose

Define WHERE you're headed and WHEN to stop—but NOT the path. The path emerges from learnings. Each HTK informs the next; pre-planned sequences violate the spirit of hypothesis-driven development.

## Philosophy

**No pipelines. Ever.**

A "plan" of hypotheses assumes you know what you'll need to test before you've learned from the first test. This is a contradiction. Instead:

- Set the destination (north star)
- Set the exit criteria (stop rules)
- Run ONE HTK
- Learn from it
- Decide the next HTK based on what you learned
- Repeat until stop rules met

## Execution

### 1. Define North Star

Parse `$ARGUMENTS` to extract:
- Desired outcome (one sentence)
- Constraints (time, budget, quality)
- Success criteria (measurable)

### 2. Set Stop Rules

Define concrete exit criteria:
- **Metric threshold**: Target achieved (e.g., p95 < 200ms)
- **Timebox**: Maximum duration (e.g., 10 business days)
- **Budget**: Resource limit (e.g., $500 infra spend)
- **Learning gate**: "Stop if we discover X"

Format: "Stop when: <metric> OR <timebox> OR <budget>"

### 3. Assess Architectural Certainty

Before detailed HTKs, ask: **"Do we know the path exists?"**

**High uncertainty** (new system, unproven integration, novel architecture):
→ First HTK should be a **Tracer Bullet**: thin end-to-end skeleton proving the path is viable

**Low uncertainty** (known architecture, optimizing existing system):
→ First HTK targets the highest-impact hypothesis directly

### 4. Define First HTK Only

Generate ONE HTK—the immediate next experiment. Use `/htk-create` format.

For tracer bullets, the HTK structure is:
- **Hypothesis**: "If we build thin e2e skeleton, we prove the architectural path is viable"
- **Change**: Minimal implementation touching all layers
- **Metric**: Request completes successfully through full stack
- **Pass**: Architecture validated → proceed to optimization HTKs
- **Fail**: Hard blocker discovered early → pivot or stop

### 5. Output Format

```
# NORTH STAR

Outcome: <one-sentence result + constraints>

Stop when: <metric threshold> OR <timebox> OR <budget>

# ARCHITECTURAL ASSESSMENT

Certainty: <HIGH/LOW>
Reasoning: <1-2 sentences why>

# FIRST HTK

<Full HTK structure from /htk-create>

# WHAT'S NEXT

Next HTK will be determined AFTER this one completes, based on:
- What we learned (pass or fail)
- What the metrics revealed
- What new questions emerged
```

## Examples

### Example 1: Low Certainty → Tracer Bullet First

**Input:** `$ARGUMENTS: "Build real-time notifications for enterprise customers"`

**Output:**
```
# NORTH STAR

Outcome: Ship WebSocket-based real-time notifications handling 1000 concurrent connections

Stop when: Feature live in production OR 3 weeks OR architectural blocker discovered

# ARCHITECTURAL ASSESSMENT

Certainty: LOW
Reasoning: Never built WebSocket infrastructure; unknown if current hosting supports it; no experience with connection scaling

# FIRST HTK: tracer-ws-path

Goal: Prove WebSocket data can flow from event source → server → client

Hypothesis: If we build minimal WebSocket POC, a message sent from server reaches connected client in <500ms

Test:
* Change: Create experiments/ws-tracer/ with Socket.io server + test client
* Method: Local server, single browser client, send 10 test messages, measure delivery
* Rollback: rm -rf experiments/ws-tracer/

Verify:
* Metric: 10/10 messages delivered, p95 latency < 500ms
* Evidence: experiments/ws-tracer/delivery-log.json

Decision:
* Pass → HTK on connection scaling (can we handle 100? 1000?)
* Fail → Identify blocker (infra? library? network?) → Evaluate alternatives (SSE, polling)

Why first: Unproven architecture; must validate path exists before optimizing any piece.

# WHAT'S NEXT

Next HTK determined after tracer completes. Likely directions:
- If PASS: Scale testing (connections, message throughput)
- If FAIL: Alternative architecture exploration
```

### Example 2: High Certainty → Direct HTK

**Input:** `$ARGUMENTS: "Reduce API latency to under 200ms"`

**Output:**
```
# NORTH STAR

Outcome: API p95 latency < 200ms under 500 RPS load

Stop when: p95 < 200ms OR 10 business days OR $500 infrastructure spend

# ARCHITECTURAL ASSESSMENT

Certainty: HIGH
Reasoning: Existing production API; known stack (Node/Express/PostgreSQL); optimizing, not building new

# FIRST HTK: profile-bottleneck

Goal: Identify the actual bottleneck before optimizing

Hypothesis: If we profile production traffic, we identify which component (DB, serialization, network) consumes >50% of latency

Test:
* Change: Add APM instrumentation to /users endpoints
* Method: Deploy to staging, replay production traffic sample (1hr), analyze trace breakdown
* Rollback: Remove APM middleware

Verify:
* Metric: Clear breakdown showing one component >50% of total latency
* Evidence: experiments/profile-bottleneck/apm-report.pdf

Decision:
* Pass (DB >50%) → HTK on query optimization or caching
* Pass (Serialization >50%) → HTK on serializer replacement
* Pass (Network >50%) → HTK on payload reduction or CDN
* Fail (no clear bottleneck) → HTK on distributed tracing for deeper analysis

Why first: Optimizing without profiling is guessing. Find the real problem before solving assumed problems.

# WHAT'S NEXT

Next HTK determined by profiling results. We don't know which optimization to try until we know where the time goes.
```

### Example 3: Explicit No-Pipeline Reasoning

**Input:** `$ARGUMENTS: "Improve test coverage for payment module to 90%"`

**Output:**
```
# NORTH STAR

Outcome: Payment module test coverage ≥ 90% with critical paths verified

Stop when: Coverage ≥ 90% OR 5 business days

# ARCHITECTURAL ASSESSMENT

Certainty: HIGH
Reasoning: Existing module; known code structure; coverage tooling in place

# FIRST HTK: coverage-baseline

Goal: Establish accurate baseline and identify largest gaps

Hypothesis: If we run coverage analysis, we identify the specific functions with 0% coverage that represent >50% of uncovered lines

Test:
* Change: None (analysis only)
* Method: Run jest --coverage, generate HTML report, identify top 5 uncovered functions
* Rollback: N/A

Verify:
* Metric: Coverage report generated; top 5 gaps identified by line count
* Evidence: experiments/coverage-baseline/report.html

Decision:
* Pass → HTK on highest-impact uncovered function
* Fail (tooling issue) → Fix coverage tooling first

Why first: Can't improve what we haven't measured. Baseline reveals where effort has highest impact.

# WHAT'S NEXT

The coverage report will reveal which function to test first. We do NOT pre-plan "test function A, then B, then C" because:
- Some functions may be trivial once we look at them
- Some may require refactoring before they're testable
- Some may be dead code we should delete instead of test

Each HTK teaches us something that informs the next.
```

## Anti-Patterns

❌ **Pre-planned pipelines**: "Do A, then B, then C, then D"
- Assumes you know outcomes before experimenting
- Locks you into a path that may become irrelevant

❌ **Skipping tracer bullets**: Jumping to optimization on unproven architecture
- Risk: Building detailed work on sand

❌ **Vague stop rules**: "When it feels fast enough"
- Must be measurable and unambiguous

❌ **Multiple HTKs in scope**: "First HTK is X, second is Y"
- Only define ONE. Next emerges from learnings.

## Validation Rules

Before outputting scope:
- [ ] North star is one sentence with constraints
- [ ] Stop rules are concrete and measurable
- [ ] Architectural certainty assessed
- [ ] Only ONE HTK defined (the first one)
- [ ] "What's Next" acknowledges uncertainty

## Integration

Called by `htk-workflow` skill when:
- User has a goal requiring experimentation
- Need to establish scope before starting work

After scope set, use `/htk-run-next` to execute, then decide next HTK based on learnings.
