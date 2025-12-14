# Unified FOCUS + HTK + Multi-HTK Planner (with Context Intake & Safe Version Policy)

**Purpose:** From any input (repo, idea dump, or greenfield concept), (A) find the best next **FOCUS** and (B) emit the smallest **Hypothesis→Test Kernel (HTK)**; or orchestrate a **pipeline of HTKs** toward a north star.
**Principles:** change one thing, define pass/fail, ≤2 sentences on *why first*, no building on unverified foundations, and keep main branch green.

---

## When to Use HTK vs Direct Work

**Use full HTK ceremony when:**
- Architectural hypothesis ("will this pattern work?")
- Multiple valid approaches exist
- Outcome genuinely uncertain
- Requires explicit rollback plan
- Repo lacks test coverage (uninitialized or untested)

**Skip HTK (direct codebase work OK) when:**
- Tests exist and can catch regressions
- Single-file, isolated change
- Pattern already proven in this codebase
- No measurable hypothesis needed
- Change reversible in <30 seconds

**Decision heuristic:**
```
Is repo initialized with tests + CI?
  NO  → Use HTK (you need the safety)
  YES ↓

Is change reversible in <30 seconds?
  NO  → Use HTK ceremony
  YES ↓

Are there multiple valid approaches?
  YES → Use HTK to test hypothesis
  NO  → Direct work OK
```

---

## Modes

* `auto`: if input is broad → do **FOCUS** then **HTK**; if narrow → **HTK** only.
* `plan`: build/refresh a ranked HTK pipeline for a north star.
* `run-next`: output exactly one FOCUS+HTK (the next move) + version steps.
* `summarize`: roll up recent HTKs, learnings, and propose the next HTK.

---

## Context Intake

1. If available, read **README.md → CLAUDE.md → .claude/** → recent ADRs.
2. If not, synthesize a **Greenfield Seed** (only if critical):

   * **Who** (primary user)
   * **Job** (10 words)
   * **Value** (≤10 words)
   * **Constraints** (hard edges)
   * **Non-goals** (≤3)
   * **Initial success signal** (smallest measurable behavior)

Proceed even if rough; state up to **3 frozen assumptions**.

---

## Output Shapes

### A) FOCUS

# FOCUS

Options (≤3):

* <label>: <one-sentence outcome> — Why-first: <≤2 sentences>
* ...
  Chosen: <label>

Inputs needed (ranked, stop when enough): <3–5 bullets>
Assumptions (frozen, ≤3): <...>

---

### B) HTK (Hypothesis→Test Kernel)

# HTK

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
* Fail → <most likely cause> → <single adjustment> → <rerun plan>

Why first: <≤2 sentences>

---

### C) VERSION HYGIENE (Recommended Default — Simple & Safe)

# VERSION HYGIENE

Pre-check: working tree clean (no staged/unstaged changes).

On PASS:
commit code + artifacts (e.g., reports, fixtures).

On FAIL:

1. save patch: `git diff > experiments/<slug>/attempt.patch`
2. commit artifacts only (reports/logs/patch):
   `git add experiments/<slug>/`
   `git commit -m "HTK:<slug> — FAIL — <metric summary>"`
3. revert code: `git reset --hard HEAD`

Commit message format: `"HTK:<short-label> — <PASS/FAIL> — <metric summary>"`

---

### D) Planner — Plan (mode: `plan`)

# NORTH STAR

Outcome: <one-sentence result & constraints>

# PIPELINE (ranked HTKs, 3–7 items; WIP=1)

1. <short-label> — What it proves (≤1 sentence). Why-first (≤2).
2. ...

Stop Rules: <metric floor, timebox, budget>
Inputs to unblock first 1–2 HTKs: <bullets>

# VERSION POLICY (planner-only)

Branch per HTK: `htk/<short-label>/<YYYYMMDD>-v<n>`
Tag on merge: `htk/<short-label>/<YYYYMMDD>-v<n>/<PASS|FAIL>`
Artifacts path: `experiments/<short-label>/{fixtures,report.md,trace/*}`

---

### E) Planner — Run Next (mode: `run-next`)

> Emit **FOCUS + HTK** exactly as above **plus:**

# VERSION STEPS (planner-only)

Before: working tree clean.
Branch: `htk/<short-label>/<YYYYMMDD>-v1`.
After test: commit scoped files only.
Commit msg: `"HTK:<short-label> — <PASS/FAIL> — <metric summary>"`.
Tag on merge: `htk/<short-label>/<YYYYMMDD>-v1/<PASS|FAIL>`.

---

### F) Planner — Summarize (mode: `summarize`)

# RUN LOG (latest first)

* <short-label> — <PASS/FAIL> — <metric summary> — Key learning (≤2)
* ...

# STATE

Proven solid: <bullets>
Still uncertain: <bullets>

# REPLAN

Keep: <labels> | Drop: <labels> | Add: <new HTKs>
Next HTK proposed: <short-label> — Why-next (≤2)

---

## Behavior Rules

* Be terse and decisive; avoid narration.
* Ask only if information is truly missing.
* Always start from a clean working set.
* Commit even failed **artifacts**, but revert failed **code**.
* Maintain WIP=1: only one active HTK at a time.

---

## Documentation Sync Obligations

Before marking HTK as PASS, ensure documentation is current:

### Required Updates

1. **Specs Updated**: If architecture changed, update `specs/`
2. **Docs Updated**: If user-facing behavior changed, update `docs/`
3. **Skills Updated**: If workflows changed, update `.claude/skills/` or `.claude/commands/`
4. **Cross-references Validated**: Verify no broken links

### Commit Message Format with Documentation

```
HTK:<label> — PASS — <metric>

Updated:
- specs/modules/[module].md (new boundary)
- docs/api-reference.md (new endpoint)
- .claude/skills/backend-developer/REFERENCE.md (pattern update)
```

### Validation Before PASS

Run sync validation to ensure documentation is current:

```bash
# Check for documentation drift
/docs/sync-check

# Validate documentation standards
/docs/enforce-standards
```

Only mark HTK as PASS after documentation sync is verified.
