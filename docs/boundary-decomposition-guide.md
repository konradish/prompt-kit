# 🧠 Prompt: Universal Boundary Decomposition v2.3

*(for any project — pure, coupled, infra-heavy, or mixed)*

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
6. States **security / PII surface and redaction rules**
7. Names an **owner** (team or person) for accountability

Perform this decomposition in **three phases:**

| Phase | Scope | Output |
|-------|--------|--------|
| **1** | Backend / System boundaries | `BOUNDARY_INDEX.csv` |
| **2** | UI → API integration boundaries | `BOUNDARY_UI.csv` (or `layer=ui` in master index) |
| **3** | DevOps / Infrastructure (Terraform, CI/CD, observability) boundaries | `BOUNDARY_INFRA.csv` (or `layer=infra`) |

---

## 🧩 Three-Phase Decomposition

### **Phase 1 — Backend / System Boundaries**

Identify every backend effect surface (DB, event, cache, file, external API).  
Generate the core `BOUNDARY_INDEX.csv` and per-skill folders.

---

### **Phase 2 — UI → API Integration Boundaries**

Model each **user-triggered API call** as a boundary linking the frontend to its backend contract.

| Field | Meaning | Example |
|-------|----------|---------|
| **name** | `ui_<action>` | `ui_create_todo` |
| **ui_trigger** | What causes the call | `button:AddTodo` or `form:Register` |
| **api_endpoint / method** | Target endpoint | `/api/v1/todos/`, `POST` |
| **depends_on** | Backend boundary it exercises | `create_todos` |
| **inputs** | Data sent from UI to API | `{child_id,title,priority}` |
| **response** | Expected status + schema | `201 JSON(todo_id)` |
| **invariants** | UI and backend truths | `"UI list +1; DB insert 1"` |
| **subject_id / dedupe_key / idempotency_scope** | Deterministic replay key | `sha256(user_id|title)` |
| **timing envelope** | `consistency_window_s`, `retry_policy`, `timeout_s` | `5`, `max=2`, `EXP` |
| **security** | PII surface & redaction | `"payload:redact>64 KB"` |
| **mode** | DRY_RUN / SHADOW / CANARY / FULL | `SHADOW` |
| **owner** | UI store or feature team | `useTodosStore` |

Output either to a dedicated `ui/BOUNDARY_UI.csv` or merge into the master index with `layer=ui`.

**Invariant scope for UI boundaries**

* **UI state** – store/DOM reflects success (e.g. list +1, redirect works).  
* **Backend state** – backend invariant passes within `consistency_window_s`.  
* **Security** – secrets redacted; no PII leakage in recorder.

**Testing**

* Record each call’s request/response (`effects_recorder.py`).  
* Re-run same action with identical keys → must be idempotent.  
* Comparator cross-checks UI state vs backend observables.

---

### **Phase 3 — DevOps / Infrastructure Boundaries (Terraform / CI / Ops)**

Model infrastructure changes and operational workflows as boundaries too.  
Each resource-provisioning or deployment step is a **mutable effect surface**.

| Field | Meaning | Example |
|-------|----------|---------|
| **name** | infra_<action> | `infra_apply_database`, `infra_deploy_frontend` |
| **tool** | Provisioning or pipeline tool | Terraform, Pulumi, GitHub Actions |
| **resource_target** | What changes | `aws_db_instance.schoolbrain`, `k8s_deployment.api` |
| **inputs** | Config variables / plan files | `tfvars`, `env vars` |
| **effects** | State changes or outputs | `terraform apply → plan_id`, `apply → ARN` |
| **invariants** | What must hold true after apply | `"no drift; status=healthy; cost budget < X"` |
| **subject_id** | Deterministic key | `sha256(module|resource|env)` |
| **dedupe_key** | Prevent re-apply loops | `plan_id|env` |
| **mode** | DRY_RUN (plan), CANARY (one env), FULL (all envs) |
| **owner** | Team responsible | `DevOps`, `Platform` |
| **security** | Secrets & PII in state | `"tfstate:encrypt; output:redact"` |
| **verdicts** | PASS = healthy; SOFT_FAIL = drift within budget; HARD_FAIL = apply error |
| **dependencies** | Downstream infra modules or services | `depends_on: network_core` |

Each Terraform module or CI pipeline step is a skill folder with tests (e.g., `terraform plan --detailed-exitcode` in kernel).  
Effects recorders capture state hash and cost output; comparators detect drift or configuration regressions.

---

### 📋 Deliverables

1. **Phase 1** → `BOUNDARY_INDEX.csv` (backend)  
2. **Phase 2** → `BOUNDARY_UI.csv` (UI integration) or merged with `layer=ui`  
3. **Phase 3** → `BOUNDARY_INFRA.csv` (infra/devops) or merged with `layer=infra`  
4. Two example pairs (`create_todo` ↔ `ui_create_todo`, `terraform_apply_network` ↔ `infra_validate_network`).

---

## ⚙️ Granularity Heuristics

| Situation | Action | Reason |
|------------|---------|--------|
| Multiple unrelated side-effects | **Split** | Different ownership/timing domains |
| Must succeed/fail atomically | **Merge** | Shared transaction boundary |
| Different idempotency keys | **Split** | Prevent retry entanglement |
| Reads shared state | **Declare dependency** | Don’t fake purity |
| < 15 min or non-reusable | **Merge** | Avoid overslicing |
| > 90 min or multi-owner | **Split** | Too coarse to test |
| Stochastic / LLM step | **Seed + normalize** | Deterministic replay |
| Infrastructure mutation | **Treat as boundary** | Enables plan/verify/drift tests |

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

## 🧾 SKILL.md Schema (v2.3)

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
````

---

## 🧮 Boundary Index Header Template

```
name,layer,intent,subject_id,dedupe_key,idempotency_scope,inputs,dependencies,effects,invariants,mode,consistency_window_s,retry_policy,timeout_s,sla_p95_ms,pii_surface,redaction_rules,owner
```

Each `effects` cell must specify **per-key semantics** (e.g. `event: EXACTLY_ONCE_PER_KEY email_ingested.v1(key=email_uid)`).

---

## 🧠 Verdict Taxonomy

| Verdict       | Meaning               | Example                           |
| ------------- | --------------------- | --------------------------------- |
| **PASS**      | All invariants hold   | DB row correct + event seen       |
| **SOFT_FAIL** | Retryable / transient | API 504, cache delay              |
| **HARD_FAIL** | Contract breach       | Duplicate insert, schema mismatch |

---

## 🧰 Impure Module Rule

If a boundary touches shared or global state:

* Declare it in `dependencies:` with `access: READONLY | MUTATES`.
* Mock or snapshot it in tests.
* Never mutate undeclared state.

---

## 🧭 Deliverables (Summary)

| Phase                  | Output                                | Purpose                       |
| ---------------------- | ------------------------------------- | ----------------------------- |
| **1 – Backend/System** | `BOUNDARY_INDEX.csv` + Skill folders  | Core effect surfaces          |
| **2 – UI→API**         | `BOUNDARY_UI.csv` or `layer=ui`       | Integration verification      |
| **3 – Infra/DevOps**   | `BOUNDARY_INFRA.csv` or `layer=infra` | Provisioning and drift safety |

---

### ✅ Recap

* **Traceable** → every effect carries a `subject_id`.
* **Timed** → each boundary defines its window, retries, SLA.
* **Transparent** → impurities declared, not hidden.
* **Secure** → PII surface + redaction rules explicit.
* **Accountable** → each boundary has an owner.
* **Reproducible** → seeded, normalized, deterministic.
* **Unified** → Backend + UI + Infra boundaries use one taxonomy and verdict system.