# HTK Workflow Skill

---
name: htk-workflow
description: Activates on "hypothesis", "HTK", "test kernel", "experiment", "focus", "test if", "prove that" keywords. Guides systematic hypothesis-driven development with minimal changes, clear pass/fail criteria, and git version hygiene.
allowed-tools: Read, Edit, Write, Bash, Grep, Glob
---

## Purpose

Guide developers through hypothesis-driven development using the FOCUS + HTK methodology:
- **FOCUS**: Find the best next move when input is broad
- **HTK**: Emit smallest testable change with clear pass/fail criteria
- **Version Hygiene**: Keep main branch green, commit artifacts even on failure

## Core Principles

1. **Change one thing** - Single variable per test
2. **Define pass/fail** - Concrete metrics, no ambiguity
3. **Why-first** - ≤2 sentences explaining reasoning
4. **No unverified foundations** - Build only on proven ground
5. **Keep main green** - Failed code reverts, artifacts commit

## Workflow Modes

Detect mode from user request or ask:

### Mode: `auto` (Default)
- **Broad input** → Run FOCUS then HTK
- **Narrow input** → HTK only

### Mode: `plan`
Build HTK pipeline (3-7 HTKs) toward north star with WIP=1

### Mode: `run-next`
Execute next HTK from pipeline with version steps

### Mode: `summarize`
Roll up recent HTKs, learnings, propose next HTK

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

### Step 2: Execute Mode

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
* Pass → <next smallest module/test>
* Fail → <most likely cause> → <adjustment> → <rerun>

Why first: <≤2 sentences>
```

#### For pipeline:
Call `/htk-plan` to build ranked HTK pipeline

#### For execution:
Call `/htk-run-next` with version hygiene steps

#### For rollup:
Call `/htk-summarize` to aggregate learnings

### Step 3: Version Hygiene

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

### Step 4: Documentation Sync

Before marking HTK as PASS, verify:
- [ ] specs/ updated if architecture changed
- [ ] docs/ updated if user-facing behavior changed
- [ ] .claude/skills/ updated if workflows changed
- [ ] Cross-references validated (no broken links)

Add to commit message:
```
Updated:
- specs/modules/[module].md (new boundary)
- docs/[doc].md (new content)
- .claude/skills/[skill]/REFERENCE.md (pattern update)
```

## Integration with Commands

This skill coordinates specialized commands:

| Command | Purpose | When |
|---------|---------|------|
| `/htk-focus` | Generate FOCUS options | Broad/unclear input |
| `/htk-create` | Create single HTK | Clear hypothesis |
| `/htk-plan` | Build HTK pipeline | Multi-step initiative |
| `/htk-run-next` | Execute next from plan | Active pipeline |
| `/htk-summarize` | Rollup and replan | After HTK runs |

## Behavior Rules

1. **Be terse and decisive** - No narration
2. **Ask only if missing critical info** - Proceed with assumptions
3. **Always start clean** - Check working tree
4. **Commit failed artifacts** - Never lose learnings
5. **WIP=1** - One active HTK at a time
6. **Why-first** - Explain reasoning before action

## Auto-Activation Triggers

This skill auto-activates when user request contains:
- "hypothesis" or "test if"
- "HTK" or "test kernel"
- "experiment" or "prove that"
- "focus" with development context
- "what should we test" or "what's next"

## Progressive Disclosure

**This file (SKILL.md)**: Core workflow and principles

**REFERENCE.md**: Detailed patterns, examples, troubleshooting
- Load when user asks for examples
- Load when encountering errors
- Load for complex multi-HTK scenarios

## Examples

### Example 1: Simple HTK
```
User: "Let's test if Redis caching improves API performance"

Skill activates → mode: auto (narrow) → calls /htk-create

HTK:
Goal: Validate Redis caching impact on GET /users/:id latency

Hypothesis: If we add Redis cache layer, p95 latency drops below 100ms

Test:
* Change: Add Redis cache to user endpoint only
* Method: Update endpoint, add cache middleware, deploy to staging
* Rollback: git revert <commit>

Verify:
* Metric: p95 latency < 100ms (k6 load test, 100 RPS, 1min)
* Evidence: experiments/redis-cache/k6-results.json

Decision:
* Pass → Add cache to remaining GET endpoints
* Fail → Profile slow queries → Optimize DB first → Retest cache

Why first: Users report slow response times; caching is low-risk, high-impact win.
```

### Example 2: FOCUS → HTK
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
```

See [REFERENCE.md](./REFERENCE.md) for comprehensive examples and patterns.
