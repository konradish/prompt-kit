# 🧠 Prompt: Universal Boundary Decomposition v2.6 (Unified CSV, Tests Optional)

*(for any project — pure, coupled, infra-heavy, or mixed)*

You are an **engineering decomposition agent.**
Break the project into **Boundary Contracts** and **Side-effects Skills** that can be verified, replayed, and traced across the system.

---

## 🎯 Objective

Output a **unified Boundary Index** (single CSV for all layers) and per-boundary **Skill Contracts** such that each boundary:

1. Owns a **canonical identity** (`subject_id`, `dedupe_key`, `idempotency_scope`)
2. Declares **all dependencies** (pure or impure)
3. Describes **inputs → effects → invariants** in machine-checkable form
4. Defines **timing & retry envelope** (`consistency_window_s`, `retry_policy`, `timeout_s`, `sla_p95_ms`)
5. Classifies outcomes as **PASS / SOFT_FAIL / HARD_FAIL**
6. States **security / PII surface and redaction rules**
7. Names an **owner** (team or person)
8. Declares **inter-boundary relationships** — events, state models, tenancy, observability, and rollback plans

Perform this decomposition in **three phases**, documenting all boundaries in one file:

| Phase | Scope | Output |
|-------|------|--------|
| **1** | Backend / System boundaries | Add to `BOUNDARY_INDEX.csv` with `layer=backend` |
| **2** | Frontend / UI boundaries | Add to `BOUNDARY_INDEX.csv` with `layer=frontend` |
| **3** | DevOps / Infrastructure boundaries | Add to `BOUNDARY_INDEX.csv` with `layer=infra` |

> **Unified CSV approach:** All boundaries (backend, frontend, infra) in one `BOUNDARY_INDEX.csv` with a `layer` column. This simplifies LLM context loading, cross-layer queries, and version control history.

> **Tests are optional.** CSVs are the source of truth; skills and tests are generated **only when justified** (see *Test-on-Demand*).

---

## 🧩 Three-Phase Decomposition
*(same as v2.4; unchanged except where “tests optional” is referenced)*

---

## 🧱 Inter-Boundary Layer (unchanged)

Add event mapping, state model refs, tenancy/authz, observability, rollback, cache, and retention fields.  
Maintain a single event catalog: `BOUNDARY_EVENTS.csv`.

---

## 📋 Deliverables

1. `BOUNDARY_INDEX.csv` — **Unified boundary catalog** with all layers (backend, frontend, infra)
2. `BOUNDARY_EVENTS.csv` — **Event catalog** (global event spine)
3. `STATE_MODELS/*.md` — **State machines** (tiny charts for key entities)
4. **Optional / On-Demand:** per-boundary skill folders and tests (only when justified by criticality/complexity)

---

## 🧮 Boundary Index Header Template

```

name,layer,intent,subject_id,dedupe_key,idempotency_scope,inputs,dependencies,effects,invariants,mode,consistency_window_s,retry_policy,timeout_s,sla_p95_ms,pii_surface,redaction_rules,owner,event_emits,event_consumes,state_model_ref,tenancy_scope,authz_policy_ref,observability_metric,alert_rule,rollback_ref,cache_keys,data_retention

````

---

## 🧾 SKILL.md Schema (v2.6) — **tests optional**

```yaml
---
name: <slug>
summary: <one-sentence outcome>
layer: backend|frontend|infra
applies_to: ["intent:<verb_noun>", "domain:<domain>"]

owner: <team_or_person>
runner: <module_or_service>
criticality: LOW|MED|HIGH

identity:
  subject_id: <canonical_expression>
  dedupe_key: <stable_expression>
  idempotency_scope: GLOBAL|SUBJECT|WINDOW:<s>

inputs:
  - { name: ..., type: ..., required: true }

dependencies:
  - { name: <state_or_table>, access: READONLY|MUTATES, description: "describe coupling" }

effects:
  - { surface: db|api|cache|file|event|infra,
      action: INSERT|UPDATE|DELETE|POST|WRITE|APPLY|DESTROY,
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

# Inter-Boundary Metadata
events:
  emits: []     # e.g., [{ name: email_ingested.v1, key: subject_id, schema_ref: ... }]
  consumes: []
state_model_ref: <entity>.state.md
tenancy_scope: GLOBAL|FAMILY|USER|CHILD
authz_policy_ref: policies/<policy>.yaml
observability:
  metric: <primary_metric_name>
  alert_rule: <expr>
rollback_ref: runbooks/<name>.md
cache_keys: []
data_retention: "<artifact>:<days>"

security:
  pii_surface: NONE|LOW|MED|HIGH
  redaction_rules: []
  secret_refs: []

verdicts:
  PASS: invariants hold
  SOFT_FAIL: transient/retryable
  HARD_FAIL: contract breach

# Optional test plan (only if justified)
tests_optional:
  rationale: "<why tests exist or are deferred>"
  htk:
    hypothesis: |
      <state transitions phrased with subject_id>
    kernel: "pytest -q tests/kernel_test.py"
---
````

---

## 🧰 Minimal Validation (Zero-Test Safety Net)

Add lightweight, fast checks to CI even when no tests exist:

1. **CSV Lints**

   * Every `effects:event` exists in `BOUNDARY_EVENTS.csv` (versioned).
   * Every emitted event has at least one consumer or `orphan:true`.
   * All `subject_id` and `dedupe_key` expressions are resolvable from `inputs`.
   * `tenancy_scope ∈ {GLOBAL,FAMILY,USER,CHILD}`.
   * `observability_metric` present for `layer=backend|infra`.

2. **Dry-Run Hooks**

   * `mode=DRY_RUN|SHADOW` paths runnable without mutation.
   * Idempotency ledger accepts duplicates without double effects.

3. **Event Ledger Assertion**

   * Emit once → durable, duplicate blocked by ledger key.

4. **Replay Notebook (optional)**

   * Single script to replay by `subject_id` using recorded inputs.

---

## 🧪 Test-on-Demand Policy (When to Actually Add Tests)

Add per-boundary tests **only if one or more triggers apply**:

* **Criticality = HIGH** (security, money, data loss, auth/session).
* **External Coupling** (payments, OAuth, third-party APIs).
* **Complex Invariants** (multi-entity writes, cache coherence).
* **Incident or Regression** (postmortem converts into tests).
* **High Cardinality / Cost** (events with fan-out; expensive retries).

When triggered, generate the minimal viable set:

* 1 happy-path proof of invariants
* 1 idempotency replay
* 1 negative/soft-fail (retryable) case

Everything else remains spec-only.

---

## 📊 Why Unified CSV? (v2.6 Change)

**Previous approach** (v2.5): Three separate CSVs
- `BOUNDARY_INDEX.csv` (backend only)
- `BOUNDARY_UI.csv` (frontend)
- `BOUNDARY_INFRA.csv` (infrastructure)

**New approach** (v2.6): Single CSV with `layer` column

**Benefits**:
1. **LLM Context Efficiency**: Load one file instead of three
2. **Cross-Layer Queries**: `grep "layer=frontend" BOUNDARY_INDEX.csv` finds all frontend boundaries
3. **Simpler Git History**: Track evolution in one file's history
4. **Easier Maintenance**: Single header schema to version
5. **Better Relationships**: Query cross-layer dependencies easily (e.g., "which frontend boundaries depend on email-ingest backend?")
6. **Consistent Tooling**: One parser, one validator, one linter

**Example Queries**:
```bash
# All HIGH criticality boundaries across all layers
awk -F',' '$NF=="HIGH"' BOUNDARY_INDEX.csv

# Backend boundaries that emit events
grep "layer=backend" BOUNDARY_INDEX.csv | grep -v "event_emits=$"

# Frontend boundaries depending on specific backend API
grep "layer=frontend" BOUNDARY_INDEX.csv | grep "email-api"

# Infrastructure boundaries with observability gaps
grep "layer=infra" BOUNDARY_INDEX.csv | grep "observability_metric=$"
```

**CSV remains optimal for LLM consumption**: Structured, diffable, queryable, token-efficient.

---

## 🧭 Principles Recap

* **CSV-First.** Contracts precede code and tests.
* **Events are the spine.** Global truth lives in the event catalog.
* **Tenancy defines blast radius.** Cache and auth derive from it.
* **Observability is part of the contract.** Measure or it didn’t happen.
* **Rollback documented.** No improvisation during incidents.
* **Tests are optional and targeted.** Added only when cost ≪ risk.