# FOCUS + HTK (Hypothesis→Test Kernel) — Simple Version Hygiene

**Purpose:** From any input (brief, repo, idea dump, task list), (A) choose the best next **FOCUS** and (B) emit one smallest **Hypothesis→Test Kernel** (HTK). Change one thing, define pass/fail, say *why first* in ≤2 sentences. No building on unverified foundations.

**LLM behavior**

* Broad input → produce **FOCUS** (≤3 options), pick one, then **HTK**.
* Narrow input → go straight to **HTK**.
* Terse, executable. Don’t assume unverified results.

---

## Output format (always this shape)

```
# FOCUS
Options (≤3):
- <label>: <one-sentence outcome> — Why-first: <≤2 sentences>
- ...
Chosen: <label>

Inputs needed (ranked, stop when enough): <3–5 bullets>
Assumptions (frozen, ≤3): <...>

# HTK
Goal: <one sentence>

Hypothesis: <if we do X, Y happens as shown by Z>

Test:
- Change: <the one change>
- Method: <where/how; minimal steps; timebox>
- Rollback: <exact step>

Verify:
- Metric: <metric + threshold>
- Evidence: <where it will live>

Decision:
- Pass → <next smallest module/test>
- Fail → <most likely cause> → <single adjustment> → <rerun plan>

Why first: <≤2 sentences>

# VERSION HYGIENE (simple)
Pre-check: working tree clean (no staged/unstaged changes)
Post-check: commit ONLY files touched by this HTK
Commit message: "HTK:<short-label> — <PASS/FAIL> — <metric summary>"
```

---

## Minimal git checklist (optional)

```bash
# before starting (ensure no loose ends)
git status --porcelain  # must be empty
# ...run the HTK work...
git add <scoped paths only>
git commit -m "HTK:<short-label> — PASS — e.g., precision 92% (≥90%)"
```

---

### Example (software)

```
# FOCUS
Options (≤3):
- Contract harness for onboarding routes — Why-first: removes auth friction; enables quick, safe iteration.
- Actionable-email gate — Why-first: downstream depends on signal quality.
- Minimal event model — Why-first: backbone for calendar output.
Chosen: Contract harness

Inputs needed: route→component map; API shapes; two fixtures; test runner; MSW availability
Assumptions: auth bypass OK; routes mountable from fixtures; network stubbable

# HTK
Goal: Open any onboarding page instantly with deterministic fixtures.

Hypothesis: If we add Contract Mode (route+fixture) with MSW stubs, pages render deterministically and pass field/CTA checks.

Test:
- Change: add ContractShell + `?route=&fixture=` + MSW handlers
- Method: local dev; two fixtures; one Playwright spec; timebox 2–3h
- Rollback: disable ContractShell via env flag

Verify:
- Metric: load <1s; required labels present; CTA state matches fixture
- Evidence: contracts/report.md + Playwright trace

Decision:
- Pass → add contract for next page
- Fail → inject fake session provider → rerun

Why first: kills main friction; creates a solid seam to simplify safely.

# VERSION HYGIENE
Pre-check: `git status` empty
Post-check: commit scoped files only
Commit message: "HTK:contract-harness — PASS — load 0.6s; fields/CTA OK"
```