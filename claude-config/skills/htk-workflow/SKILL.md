# HTK Workflow Skill

---
name: htk-workflow
description: Activates on "hypothesis", "HTK", "test kernel", "experiment", "focus", "test if", "prove that", "tracer bullet" keywords. Guides systematic hypothesis-driven development with minimal changes, clear pass/fail criteria, and git version hygiene.
allowed-tools: Read, Edit, Write, Bash, Grep, Glob
---

## Purpose

Guide developers through hypothesis-driven development using the FOCUS + HTK methodology:
- **FOCUS**: Find the best next move when input is broad
- **HTK**: Emit smallest testable change with clear pass/fail criteria
- **Tracer Bullet**: Thin end-to-end skeleton when architecture is unproven
- **Version Hygiene**: Keep main branch green, commit artifacts even on failure

## Core Principles

1. **Change one thing** - Single variable per test
2. **Define pass/fail** - Concrete metrics, no ambiguity
3. **Why-first** - ≤2 sentences explaining reasoning
4. **No unverified foundations** - Build only on proven ground (tracer bullets first)
5. **Keep main green** - Failed code reverts, artifacts commit
6. **No pipelines** - Next HTK decided AFTER current one completes

## Philosophy: No Pipelines

**A "plan" of hypotheses assumes you know what you'll test before you've learned from the first test.** This violates the spirit of hypothesis-driven development.

Instead:
- Set destination (north star) and exit criteria (stop rules)
- Run ONE HTK
- Learn from it
- Decide next HTK based on learnings
- Repeat until stop rules met

## Workflow Modes

Detect mode from user request or ask:

### Mode: `auto` (Default)
- **Broad input** → Run FOCUS then HTK
- **Narrow input** → HTK only
- **Architectural uncertainty** → Tracer Bullet HTK first

### Mode: `scope`
Set north star + stop rules + assess architectural certainty + define FIRST HTK only

### Mode: `run-next`
Execute current HTK with version steps, then decide next based on learnings

### Mode: `summarize`
Roll up recent HTKs, learnings, propose next single HTK

## Execution Flow

### Step 1: Context Intake
Read available context (priority order):
1. README.md - Project overview
2. CLAUDE.md - Development guidelines
3. .claude/ - Skills, commands, agents
4. Recent ADRs/decisions
5. experiments/ - Previous HTK artifacts

**If greenfield (no context):**
Create minimal seed (only if critical):
- Who (primary user)
- Job (10 words)
- Value (≤10 words)
- Constraints (hard edges)
- Non-goals (≤3)
- Initial success signal

State up to 3 frozen assumptions and proceed.

### Step 2: Assess Architectural Certainty

Before any HTK, ask: **"Do we know the path exists?"**

**Low certainty** (new system, unproven integration):
→ First HTK = Tracer Bullet (thin e2e skeleton)

**High certainty** (known architecture, optimizing):
→ First HTK targets highest-impact hypothesis

### Step 3: Execute Mode

#### For `auto` or FOCUS:
Call `/htk-focus` to generate FOCUS options (≤3):
```
Options:
* <label>: <one-sentence outcome> — Why-first: <≤2 sentences>

Chosen: <label>
Inputs needed (ranked, stop when enough): <3–5 bullets>
Assumptions (frozen, ≤3): <...>
```

#### For HTK creation:
Call `/htk-create` to generate HTK structure:
```
Goal: <one sentence>

Hypothesis: <if we do X, Y happens as shown by Z>

Test:
* Change: <the one change>
* Method: <where/how; minimal steps; timebox>
* Rollback: <exact step>

Verify:
* Metric: <metric + threshold>
* Evidence: <where it will live>

Decision:
* Pass → <what we learned; likely next direction>
* Fail → <diagnostic step> → <alternative> → <rerun>

Why first: <≤2 sentences>
```

#### For Tracer Bullet HTK:
Same structure, but:
- **Hypothesis**: "If we build thin e2e skeleton, we prove the path is viable"
- **Change**: Minimal implementation touching ALL layers
- **Metric**: Request completes through full stack
- **Pass**: Architecture validated → proceed to optimization
- **Fail**: Hard blocker discovered early → pivot or stop

#### For scope:
Call `/htk-plan` (now `/htk-scope`) to set north star + stop rules + first HTK

#### For execution:
Call `/htk-run-next` with version hygiene steps

#### For rollup:
Call `/htk-summarize` to aggregate learnings and propose next single HTK

### Step 4: Version Hygiene

**Pre-check**: Ensure working tree is clean

**On PASS:**
```bash
git add <code> <artifacts>
git commit -m "HTK:<label> — PASS — <metric summary>"
```

**On FAIL:**
```bash
# 1. Save patch
git diff > experiments/<slug>/attempt.patch

# 2. Commit artifacts only
git add experiments/<slug>/
git commit -m "HTK:<label> — FAIL — <metric summary>"

# 3. Revert code
git reset --hard HEAD
```

**Format**: `HTK:<short-label> — <PASS/FAIL> — <metric summary>`

### Step 5: Decide Next HTK

After each HTK completes:
1. Review what we learned (pass or fail)
2. Consider what the metrics revealed
3. Identify new questions that emerged
4. Propose NEXT single HTK based on learnings
5. Repeat until stop rules met

**Never pre-plan sequences.** Each HTK informs the next.

## Integration with Commands

| Command | Purpose | When |
|---------|---------|------|
| `/htk-focus` | Generate FOCUS options | Broad/unclear input |
| `/htk-create` | Create single HTK | Clear hypothesis |
| `/htk-plan` | Set scope (north star + stop rules + first HTK) | Starting new initiative |
| `/htk-run-next` | Execute current HTK | Ready to test |
| `/htk-summarize` | Rollup learnings, propose next HTK | After HTK completes |

## Behavior Rules

1. **Be terse and decisive** - No narration
2. **Ask only if missing critical info** - Proceed with assumptions
3. **Always start clean** - Check working tree
4. **Commit failed artifacts** - Never lose learnings
5. **WIP=1** - One active HTK at a time
6. **Why-first** - Explain reasoning before action
7. **Tracer first** - When architecture unproven, validate path before details
8. **No sequences** - Never output "then do X, then Y, then Z"

## Auto-Activation Triggers

This skill auto-activates when user request contains:
- "hypothesis" or "test if"
- "HTK" or "test kernel"
- "experiment" or "prove that"
- "tracer bullet" or "prove the path"
- "focus" with development context
- "what should we test" or "what's next"

## Anti-Patterns

❌ **Pre-planned pipelines**: "Do A, then B, then C"
- Violates hypothesis-driven learning

❌ **Skipping tracer bullets**: Optimizing unproven architecture
- Risk: Building on sand

❌ **Multiple HTKs at once**: Defining HTK #2 before HTK #1 completes
- You don't know what #1 will teach you

## Examples

### Example 1: Tracer Bullet First (Low Certainty)
```
User: "Build real-time notifications"

Skill activates → assess certainty: LOW (never built WebSocket infra)
→ First HTK is tracer bullet

HTK: tracer-ws-path
Goal: Prove WebSocket data can flow server → client

Hypothesis: If we build minimal Socket.io POC, message reaches client in <500ms

Test:
* Change: Create experiments/ws-tracer/ with server + test client
* Method: Local server, single browser, 10 test messages
* Rollback: rm -rf experiments/ws-tracer/

Verify:
* Metric: 10/10 delivered, p95 < 500ms
* Evidence: experiments/ws-tracer/delivery-log.json

Decision:
* Pass → HTK on scaling (100 connections? 1000?)
* Fail → Identify blocker → Evaluate alternatives (SSE, polling)

Why first: Unproven architecture; validate path before optimizing.
```

### Example 2: Direct HTK (High Certainty)
```
User: "Reduce API latency"

Skill activates → assess certainty: HIGH (existing production API)
→ Direct HTK (no tracer needed)

HTK: profile-bottleneck
Goal: Identify actual bottleneck before optimizing

Hypothesis: If we profile traffic, we identify component consuming >50% latency

...

Decision:
* Pass (DB >50%) → HTK on caching or query optimization
* Pass (Serialization >50%) → HTK on faster serializer
* Fail → HTK on distributed tracing

Why first: Optimizing without profiling is guessing.
```

### Example 3: FOCUS → HTK
```
User: "We need to improve the onboarding experience"

Skill activates → mode: auto (broad) → calls /htk-focus

FOCUS:
Options:
* reduce-friction: Cut signup steps 50% — Why: Analytics show 60% drop-off
* add-guidance: Interactive tutorial — Why: Support tickets cite confusion
* improve-perf: Speed up initial load — Why: 5s load correlates with abandonment

Chosen: reduce-friction

Then calls /htk-create for first hypothesis...

After that HTK completes, decide next based on what we learned.
```

See [REFERENCE.md](./REFERENCE.md) for comprehensive examples and patterns.
