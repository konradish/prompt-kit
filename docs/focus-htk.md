# FOCUS + HTK (Hypothesis→Test Kernel)

Use this prompt to extract a clear next action from any input—whether a messy repo, vague idea, or multi-task list—by finding the best **focus** and emitting a minimal **Hypothesis→Test Kernel (HTK)**. Works for software, troubleshooting, or life logistics without ceremony or scoring tables.

## Core Principle
One prompt, many contexts. Change one thing, define pass/fail, explain *why first* in ≤2 sentences, and never build on unverified foundations.

## LLM Behavior
* If input is broad → produce **FOCUS** first (≤3 options), pick one, then emit **HTK**.
* If already narrow → skip straight to **HTK**.
* Stay terse. Don't assume unverified results.
# Locked: FOCUS + HTK (Hypothesis→Test Kernel)

Locked: one prompt, many contexts. Here’s a compact, reusable kernel that works for software, troubleshooting, or life logistics—without getting fluffy or prescriptive.

Purpose: From any input (brief, repo, idea dump, task list), (A) find the best next focus and (B) emit the smallest Hypothesis→Test Kernel (HTK). No scoring tables, no workflow ceremony.

LLM behavior:
- If the input is broad, produce FOCUS first (≤3 options), pick one, then emit HTK.
- If already narrow, skip straight to HTK.
- Keep it terse. Don’t assume unverified results.

Rules: change one thing; define pass/fail; explain why first in ≤2 sentences; no building on unverified foundations.

---

Output format (always this shape):

```
# FOCUS
Options (≤3):
- <label>: <one-sentence outcome> — Why-first: <≤2 sentences>
- ...
Chosen: <label>

Inputs needed (ranked, stop when enough): <bulleted list, 3–5 items max>
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
```

---

Micro-examples

1) Software (general)

```
# FOCUS
Options (≤3):
- Onboarding contract harness: Render any onboarding route without auth — Why-first: unblocks fast iteration and trims surface area safely.
- Email "actionable?" gate: Prevent junk before parsing — Why-first: downstream depends on signal quality.
- Minimal event model: Normalize dates/recurrences — Why-first: backbone for all calendar output.

Chosen: Onboarding contract harness

Inputs needed (ranked): route list → component file, API calls + shapes, one happy/one edge fixture JSON, test runner, MSW availability
Assumptions (frozen, ≤3): local auth bypass OK; routes mountable from fixtures; network stubbable

# HTK
Goal: Open any onboarding page instantly (≤1s) with deterministic fixtures.

Hypothesis: If we add a Contract Mode (route+fixture) with MSW stubs, pages render deterministically and pass basic field/CTA checks.

Test:
- Change: add ContractShell + `?route=&fixture=` + MSW handlers
- Method: local dev; two fixtures; one Playwright spec; timebox 2–3h
- Rollback: guard behind env flag; remove route to revert

Verify:
- Metric: load <1s; required labels present; CTA state matches fixture
- Evidence: `contracts/reports/onboarding_contract.md` + trace

Decision:
- Pass → add contracts for next screen
- Fail → inject fake session provider → rerun

Why first: kills the main friction; creates a rock-solid seam to simplify safely.
```

2) Non-software (house projects)

```
# FOCUS
Options (≤3):
- Fix leaking faucet: stop water loss + cabinet damage — Why-first: high cost-of-delay; small, reversible.
- Clear garage zone A: create workspace — Why-first: unlocks later tasks.
- Replace HVAC filter: air quality + system load — Why-first: 5-minute win; prevents downstream issues.

Chosen: Fix leaking faucet

Inputs needed (ranked): valve access, gasket type, tool list, photo of assembly
Assumptions (frozen): supply valves work; no pipe corrosion

# HTK
Goal: Stop under-sink leak for 7 consecutive days.

Hypothesis: If we replace the cartridge + gasket, the cabinet base stays dry (moisture card shows ≤5% change).

Test:
- Change: swap cartridge/gasket
- Method: shutoff → swap → paper towel + moisture card; check daily; 20 min + 7-day watch
- Rollback: reinstall old part, schedule plumber

Verify:
- Metric: zero visible drips; moisture card stable ≤5%
- Evidence: dated photo log

Decision:
- Pass → seal cabinet edge; Next: garage zone A
- Fail → likely supply line/valve → replace line → rerun

Why first: highest risk/cost if ignored; smallest decisive fix.
```

---

Minimal "input pack" (optional, domain-agnostic)

* Inventory snapshot: list of candidate areas (3–7 bullets).
* Constraints: timebox, tools/resources, don’t-break rules.
* One happy + one edge case (or photo) for the chosen area.
