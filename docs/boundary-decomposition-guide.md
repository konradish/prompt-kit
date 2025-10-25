# 🧠 Prompt: Universal Boundary Decomposition v2.1

*(for any project — pure, coupled, or mixed)*

You are an **engineering decomposition agent**.
Break the project into **Boundary Contracts** and **Side-effects Skills** that can be verified, replayed, and traced across the system.

---

## 🎯 Objective

Output a **Boundary Index** and per-boundary **Skill Contracts** such that each boundary:

1. Owns a **canonical identity** (`subject_id`, `dedupe_key`, `idempotency_scope`)
2. Declares **all dependencies** (pure or impure)
3. Describes **inputs → effects → invariants** in machine-checkable form
4. Defines **timing & retry envelope** (`consistency_window_s`, `retry_policy`, `timeout_s`, `sla_p95_ms`)
5. Classifies outcomes as **PASS / SOFT_FAIL / HARD_FAIL**
6. States **security/PII surface and redaction rules**
7. Names an **owner** (team or person) for accountability

---

## ⚙️ Granularity Heuristics

| Situation                       | Action                 | Reason                             |
| ------------------------------- | ---------------------- | ---------------------------------- |
| Multiple unrelated side-effects | **Split**              | Different ownership/timing domains |
| Must succeed/fail atomically    | **Merge**              | Shared transaction boundary        |
| Different idempotency keys      | **Split**              | Prevent retry entanglement         |
| Reads shared state              | **Declare dependency** | Don’t fake purity                  |
| <15 min or non-reusable         | **Merge**              | Avoid overslicing                  |
| >90 min or multi-owner          | **Split**              | Too coarse to test                 |
| Stochastic/LLM step             | **Seed + normalize**   | Deterministic replay               |

---

## 🧩 Required Outputs

1. `BOUNDARY_INDEX.csv` — master table of all boundaries
2. Per-boundary folder containing:

   * `SKILL.md` — declarative contract
   * `skill.py` — orchestrator
   * `validators.py` — invariant checks
   * `tests/kernel_test.py` — HTK kernel
   * `effects_recorder.py` — effect logger

---

## 🧾 SKILL.md Schema (v2.1)

```yaml
---
name: <slug>
summary: <one-sentence outcome>
applies_to: ["intent:<verb_noun>", "domain:<domain>"]

owner: <team_or_person>
runner: <module_or_service>
criticality: LOW|MED|HIGH

identity:
  subject_id: <canonical_expression>          # e.g. sha256(message_id|source)
  dedupe_key: <stable_expression>             # defines “once per …”
  idempotency_scope: GLOBAL|SUBJECT|WINDOW:<s>

inputs:
  - { name: ..., type: ..., required: true }

dependencies:
  - { name: <state_or_table>, access: READONLY|MUTATES, description: "describe coupling" }

effects:
  - { surface: db|api|cache|file|event,
      action: INSERT|UPDATE|DELETE|POST|WRITE,
      target: <resource>,
      cardinality: EXACTLY_ONCE_PER_KEY|AT_LEAST_ONCE_PER_KEY }

invariants:
  - "<must remain true after execution>"

modes: [DRY_RUN, SHADOW, CANARY, FULL]

operational_envelope:
  consistency_window_s: <int>
  retry_policy: { max: <int>, retryable: ["HTTP_5xx","PG_SERIALIZATION"], backoff: EXP|CONST }
  timeout_s: <int>
  sla_p95_ms: <int>

security:
  pii_surface: NONE|LOW|MED|HIGH
  redaction_rules: ["email:hash","body:redact>2MB"]
  secret_refs: []

verdicts:
  PASS: invariants hold
  SOFT_FAIL: transient/retryable (timeout, race, delay)
  HARD_FAIL: contract breach (duplicate, wrong state, schema)

htk:
  hypothesis: |
    <state transitions phrased with subject_id>
  kernel: "pytest -q tests/kernel_test.py"
---
```

---

## 🧮 Boundary Index Header Template

```
name,intent,subject_id,dedupe_key,idempotency_scope,inputs,dependencies,effects,invariants,mode,consistency_window_s,retry_policy,timeout_s,sla_p95_ms,pii_surface,redaction_rules,owner
```

Each `effects` cell must specify **per-key semantics** (e.g., `event: EXACTLY_ONCE_PER_KEY email_ingested.v1(key=email_uid)`).

---

## 🧠 Verdict Taxonomy

| Verdict       | Meaning             | Example                           |
| ------------- | ------------------- | --------------------------------- |
| **PASS**      | All invariants hold | DB row correct + event seen       |
| **SOFT_FAIL** | Retryable/transient | API 504, cache delay              |
| **HARD_FAIL** | Contract breach     | Duplicate insert, schema mismatch |

---

## 🧰 Impure Module Rule

If a boundary touches shared or global state:

* Declare it in `dependencies:` with `access: READONLY|MUTATES`.
* Mock or snapshot it in tests.
* Never mutate undeclared state.

---

## 🧭 Deliverables

After execution the agent should output:

1. `BOUNDARY_INDEX.csv` fully populated with identity, timing, security, and owner fields.
2. Two example skill folders demonstrating replay and verdict classification.

---

### ✅ Recap

* **Traceable** → every effect carries a `subject_id`.
* **Timed** → each boundary defines its window, retries, SLA.
* **Transparent** → impurities declared, not hidden.
* **Secure** → PII surface + redaction rules explicit.
* **Accountable** → every boundary has an `owner`.
* **Reproducible** → seeded, normalized, and deterministic.
