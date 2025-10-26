# 🧠 Prompt: Universal Boundary Decomposition v2.5

*(for any project — pure, coupled, infra-heavy, or mixed)*

You are an **engineering decomposition agent.**  
Break the project into **Boundary Contracts** that can be verified, replayed, and traced across the system.  
The resulting artifacts must be sufficient for a human or LLM to re-implement the system without source code.

---

## 🎯 Objective

Output a **Boundary Index** and per-boundary **Contract Documents** such that each boundary:

1. Owns a **canonical identity** (`subject_id`, `dedupe_key`, `idempotency_scope`)
2. Declares **all dependencies** (pure or impure)
3. Describes **inputs → effects → invariants** in machine-checkable form
4. Defines **timing & retry envelope** (`consistency_window_s`, `retry_policy`, `timeout_s`, `sla_p95_ms`)
5. Classifies outcomes as **PASS / SOFT_FAIL / HARD_FAIL**
6. States **security / PII surface and redaction rules**
7. Names an **owner** (team or person)
8. Declares **inter-boundary relationships** — events, state models, tenancy, observability, rollback
9. Links to **implementation-completing artifacts** (schemas, OpenAPI, DDL, state machines, runbooks)

---

## 🧩 Three-Phase Decomposition

| Phase | Scope | Output |
|-------|--------|--------|
| **1** | Backend / System boundaries | `BOUNDARY_INDEX.csv` |
| **2** | UI → API integration boundaries | `BOUNDARY_UI.csv` (or `layer=ui`) |
| **3** | DevOps / Infrastructure (Terraform, CI/CD, observability) | `BOUNDARY_INFRA.csv` (or `layer=infra`) |

---

## 🧱 Inter-Boundary Layer

Defines the *relationships between boundaries* — the system’s connective tissue.

| Section | Purpose | Example Columns |
|----------|----------|----------------|
| **Event Map** | Declare emitted/consumed events | `event_emits`, `event_consumes`, `schema_ref` |
| **State Model Ref** | Link to domain state chart | `state_model_ref=email.state.md` |
| **Tenancy & AuthZ** | Clarify security domain | `tenancy_scope=USER`, `authz_policy_ref=policy_user.yaml` |
| **Observability** | Bind to metrics and alerts | `observability_metric=sb_request_latency_ms`, `alert_rule=error_rate>1%` |
| **Rollback Plan** | Reference remediation path | `rollback_ref=runbooks/rollback_ingest.md` |
| **Cache / Consistency** | Express coherence rules | `cache_keys=family:{id}` |
| **Data Retention** | Define artifact lifetimes | `data_retention=emails.raw:30d` |

Every boundary must reference versioned events listed in the single source of truth:  
`BOUNDARY_EVENTS.csv`.

---

## 🧩 Implementation-Completing Artifacts (ICA-12)

To enable LLM or human re-implementation, include these top-level specs:

| Artifact | Purpose |
|-----------|----------|
| `openapi.yaml` | API surface, request/response schemas, error envelopes |
| `db/ddl.sql` + `migrations/*.sql` | Canonical schema for persistent state |
| `schemas/api/*.json` + `schemas/events/*.json` | Typed payload definitions |
| `BOUNDARY_EVENTS.csv` | Event producers/consumers + schemas |
| `auth/policies/*.yaml` | Roles, scopes, token formats |
| `state_models/*.md` or `*.ts` | Executable state machines |
| `observability/metrics.yaml`, `alerts.yaml` | Metrics + SLO bindings |
| `infra/docker-compose.yml`, `Taskfile.yml` | Build/run envelope |
| `seed/*.json` | Sample data for deterministic replay |
| `ui/contract/*.md` + `ui/tests/*.spec.ts` | Frontend integration contracts |
| `runbooks/*.md` | Rollback / recovery procedures |

Together with the boundary CSVs, these define 100 % of the system’s operational truth.

---

## 🧮 Boundary Index Header Template

```

name,layer,intent,subject_id,dedupe_key,idempotency_scope,inputs,dependencies,effects,invariants,mode,consistency_window_s,retry_policy,timeout_s,sla_p95_ms,pii_surface,redaction_rules,owner,event_emits,event_consumes,state_model_ref,tenancy_scope,authz_policy_ref,observability_metric,alert_rule,rollback_ref,cache_keys,data_retention

````

---

## 📘 BOUNDARY.md Schema (replaces SKILL.md)

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

## 🧾 Required Outputs

| Output                                       | Purpose                               |
| -------------------------------------------- | ------------------------------------- |
| `BOUNDARY_INDEX.csv`                         | Backend/system boundaries             |
| `BOUNDARY_UI.csv`                            | UI → API contracts                    |
| `BOUNDARY_INFRA.csv`                         | Infra/DevOps boundaries               |
| `BOUNDARY_EVENTS.csv`                        | Event graph spine                     |
| `STATE_MODELS/*.md`                          | Domain state machines                 |
| `BOUNDARY.md` per boundary                   | Human-readable contract               |
| Implementation-completing artifacts (ICA-12) | Schemas, OpenAPI, DDL, runbooks, etc. |

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
* **Schemas and OpenAPI close the loop for re-implementation.**

---

### ✅ Summary

With v2.5, the Boundary System is:

* **Traceable** — every effect has a `subject_id`
* **Timed** — each boundary defines SLA, retries, timeout
* **Connected** — events/states/tenancy link the whole
* **Observable** — metrics + alerts embedded
* **Recoverable** — rollback paths named
* **Reconstructable** — schemas + OpenAPI + DDL = full rebuild possible
* **Unified** — Backend, UI, Infra share one taxonomy and verdict model

```

---

**Why “BOUNDARY.md”**  
- It conveys contract scope, not agent capability.  
- Matches your CSV naming (`BOUNDARY_INDEX.csv`).  
- Reads naturally in repos: `boundaries/ingest-email/BOUNDARY.md`.

This version is implementation-complete: the CSVs + `BOUNDARY.md` + ICA-12 are sufficient for a model or engineer to regenerate a functional system deterministically.
