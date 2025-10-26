# 🧠 Prompt: Universal Boundary Decomposition v2.4

*(for any project — pure, coupled, infra-heavy, or mixed)*

You are an **engineering decomposition agent.**  
Break the project into **Boundary Contracts** and **Side-effects Skills** that can be verified, replayed, and traced across the system.

---

## 🎯 Objective

Output a **Boundary Index** and per-boundary **Skill Contracts** such that each boundary:

1. Owns a **canonical identity** (`subject_id`, `dedupe_key`, `idempotency_scope`)
2. Declares **all dependencies** (pure or impure)
3. Describes **inputs → effects → invariants** in machine-checkable form
4. Defines **timing & retry envelope** (`consistency_window_s`, `retry_policy`, `timeout_s`, `sla_p95_ms`)
5. Classifies outcomes as **PASS / SOFT_FAIL / HARD_FAIL**
6. States **security / PII surface and redaction rules**
7. Names an **owner** (team or person)
8. Declares **inter-boundary relationships** — events, state models, tenancy, observability, and rollback plans

Perform this decomposition in **three phases:**

| Phase | Scope | Output |
|-------|--------|--------|
| **1** | Backend / System boundaries | `BOUNDARY_INDEX.csv` |
| **2** | UI → API integration boundaries | `BOUNDARY_UI.csv` (or `layer=ui`) |
| **3** | DevOps / Infrastructure (Terraform, CI/CD, observability) boundaries | `BOUNDARY_INFRA.csv` (or `layer=infra`) |

---

## 🧩 Three-Phase Decomposition

### **Phase 1 — Backend / System Boundaries**

Identify every backend effect surface (DB, event, cache, file, external API).  
Generate the core `BOUNDARY_INDEX.csv` and per-skill folders.

---

### **Phase 2 — UI → API Integration Boundaries**

Model each **user-triggered API call** as a boundary linking the frontend to its backend contract.

*(same structure as before — unchanged except inherits new inter-boundary columns if merged into master index)*

---

### **Phase 3 — DevOps / Infrastructure Boundaries**

Treat each provisioning, deployment, or CI workflow as a boundary.  
*(same as v2.3 — unchanged except inter-boundary additions apply)*

---

## 🧱 Inter-Boundary Layer (new in v2.4)

This layer captures the *relationships between boundaries* — the connective tissue that forms system-level coherence.

| Section | Purpose | Example Columns |
|----------|----------|----------------|
| **Event Map** | Declare emitted and consumed events | `event_emits`, `event_consumes`, `schema_ref` |
| **State Model Ref** | Link to domain state chart | `state_model_ref=email.state.md` |
| **Tenancy & AuthZ** | Clarify security domain | `tenancy_scope=USER`, `authz_policy_ref=policy_user.yaml` |
| **Observability** | Bind to metrics and alerts | `observability_metric=sb_request_latency_ms`, `alert_rule=error_rate>1%` |
| **Rollback Plan** | Reference remediation path | `rollback_ref=runbooks/rollback_ingest.md` |
| **Cache / Consistency** | Express coherence rules | `cache_keys=family:{id}`, `consistency_rule=window<=5s` |
| **Data Retention** | Define how long artifacts persist | `data_retention=emails.raw:30d` |

Every boundary must emit or consume versioned events from a single source of truth file:  
`BOUNDARY_EVENTS.csv` (the event catalog).

---

## 📋 Deliverables

1. **Phase 1** → `BOUNDARY_INDEX.csv`  
2. **Phase 2** → `BOUNDARY_UI.csv` (or merged into master)  
3. **Phase 3** → `BOUNDARY_INFRA.csv` (or merged into master)  
4. **Event Catalog** → `BOUNDARY_EVENTS.csv` (inter-boundary spine)  
5. **Optional** → `STATE_MODELS/` folder with `.md` diagrams for each entity

---

## 🧮 Boundary Index Header Template

```

name,layer,intent,subject_id,dedupe_key,idempotency_scope,inputs,dependencies,effects,invariants,mode,consistency_window_s,retry_policy,timeout_s,sla_p95_ms,pii_surface,redaction_rules,owner,event_emits,event_consumes,state_model_ref,tenancy_scope,authz_policy_ref,observability_metric,alert_rule,rollback_ref,cache_keys,data_retention

````

---

## 🧾 SKILL.md Schema (v2.4)

```yaml
---
name: <slug>
summary: <one-sentence outcome>

applies_to: ["intent:<verb_noun>", "domain:<domain>"]
layer: backend|ui|infra

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

# 🧱 Inter-Boundary Metadata
events:
  emits:
    - { name: email_ingested.v1, key: subject_id, schema_ref: schema://events/email_ingested.v1.json }
  consumes:
    - { name: extraction_ready.v1, schema_ref: schema://events/extraction_ready.v1.json }
state_model_ref: email.state.md
tenancy_scope: GLOBAL|FAMILY|USER|CHILD
authz_policy_ref: policies/auth_user.yaml
observability:
  metric: sb_request_latency_ms
  alert_rule: error_rate > 1% for 5m
rollback_ref: runbooks/rollback_ingest.md
cache_keys: ["calendar:{child_id}","family:{family_id}"]
data_retention: "emails.raw:30d; traces:7d"

security:
  pii_surface: NONE|LOW|MED|HIGH
  redaction_rules: ["email:hash","body:redact>2MB"]
  secret_refs: []

verdicts:
  PASS: invariants hold
  SOFT_FAIL: transient/retryable
  HARD_FAIL: contract breach

htk:
  hypothesis: |
    <state transitions phrased with subject_id>
  kernel: "pytest -q tests/kernel_test.py"
---
````

---

## 🧩 Required Outputs

| Output                | Purpose                   |
| --------------------- | ------------------------- |
| `BOUNDARY_INDEX.csv`  | Backend/system boundaries |
| `BOUNDARY_UI.csv`     | UI→API contracts          |
| `BOUNDARY_INFRA.csv`  | Infra/DevOps contracts    |
| `BOUNDARY_EVENTS.csv` | Event graph spine         |
| `STATE_MODELS/*.md`   | Domain state machines     |
| Per-boundary folder   | Skill + kernel + tests    |

---

## 🧠 Verdict Taxonomy

| Verdict       | Meaning               | Example                           |
| ------------- | --------------------- | --------------------------------- |
| **PASS**      | All invariants hold   | DB row correct + event seen       |
| **SOFT_FAIL** | Retryable / transient | Timeout, race, cache delay        |
| **HARD_FAIL** | Contract breach       | Duplicate insert, schema mismatch |

---

## 🧭 Principles Recap

* **Local truth in CSV, global truth in events.**
* **Every durable effect emits or consumes a versioned event.**
* **Tenancy defines blast radius.**
* **Observability is part of the contract.**
* **Rollback is documented, not improvised.**
* **Cache coherence and retention are explicit, not tribal.**

---

### ✅ Summary

Your boundaries are now:

* **Traceable** → every effect has a `subject_id`.
* **Timed** → every boundary has SLA + retry + timeout.
* **Connected** → events/states/tenancy link them into a whole.
* **Observable** → metrics + alerts defined.
* **Recoverable** → rollback path named.
* **Secure** → PII and secrets handled explicitly.
* **Unified** → Backend + UI + Infra share one taxonomy and verdict model.