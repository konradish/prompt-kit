# Email App - Boundary Decomposition Example

**Project**: Simple email management web application
**Boundaries**: 7 total (4 backend, 2 frontend, 1 infra)
**Purpose**: Demonstrates Boundary Decomposition v2.6 protocol in practice

---

## System Overview

**Email App** is a simplified email management system that allows users to:
- Receive and ingest emails
- Search through their inbox
- Compose and send emails
- Process background jobs for email operations

### Architecture

```
┌─────────────────┐      ┌──────────────────┐
│  Frontend       │      │  Backend API     │
│  ─────────      │─────▶│  ──────────      │
│  • inbox-view   │      │  • email-ingest  │
│  • compose-view │      │  • email-search  │
└─────────────────┘      │  • email-send    │
                         └──────────────────┘
                                   │
                         ┌─────────┴─────────┐
                         │                   │
                    ┌────▼────┐      ┌──────▼─────┐
                    │ Worker  │      │ PostgreSQL │
                    │ ─────   │      │ Database   │
                    │ • email-│      └────────────┘
                    │   worker│
                    └─────────┘

                    ┌────────────────┐
                    │ Infrastructure │
                    │ ────────────── │
                    │ • k8s-email-   │
                    │   api          │
                    └────────────────┘
```

---

## Boundaries Breakdown

### Backend Layer (4 boundaries)

**1. email-ingest**
- **Intent**: Ingest incoming emails into the system
- **Identity**: `message_id` (globally unique email identifier)
- **Effects**:
  - Inserts email record (exactly once per message_id)
  - Publishes `email.ingested.v1` event
- **Invariants**:
  - No duplicate emails per message_id
  - Email stored before event emitted
- **Criticality**: HIGH (PII data, audit trail required)
- **Owner**: platform-team

**2. email-search**
- **Intent**: Search user's emails by query
- **Identity**: `user_id + query_hash`
- **Effects**:
  - Reads from emails table
  - Caches search results
- **Invariants**:
  - Results match query
  - No emails from other users visible (tenant isolation)
- **Criticality**: MED (read-only, cached)
- **Owner**: platform-team

**3. email-send**
- **Intent**: Send outgoing emails via SMTP
- **Identity**: `draft_id` (email being sent)
- **Effects**:
  - Inserts sent_emails record (exactly once)
  - Calls SMTP API (exactly once via idempotency)
  - Publishes `email.sent.v1` event
- **Invariants**:
  - Draft exists before send
  - Email sent via SMTP
  - Sent record created
  - Event emitted
- **Criticality**: HIGH (external API, user-facing, costly retries)
- **Owner**: platform-team

**4. email-worker**
- **Intent**: Process background jobs from queue
- **Identity**: `job.id`
- **Effects**:
  - Dequeues job (exactly once)
  - Updates job status
- **Invariants**:
  - Job processed exactly once
  - Job status updated
  - Retries respect backoff policy
- **Criticality**: MED (background, retriable)
- **Owner**: infra-team
- **Consumes**: `email.ingested.v1`, `email.sent.v1`

### Frontend Layer (2 boundaries)

**5. inbox-view**
- **Intent**: Render user's inbox with emails
- **Identity**: `user_id`
- **Effects**:
  - Calls `/api/emails` endpoint
- **Invariants**:
  - Shows user's emails only (tenant isolation)
  - Handles pagination
  - Displays loading/error states
- **Criticality**: MED (user-facing, cached on backend)
- **Owner**: frontend-team

**6. compose-view**
- **Intent**: Compose and send new emails
- **Identity**: `draft_id`
- **Effects**:
  - Calls `/api/emails/send` endpoint (exactly once)
  - Writes draft to localStorage
- **Invariants**:
  - Validates email format
  - Shows send confirmation
  - Clears draft on success
  - Handles offline mode
- **Criticality**: HIGH (user action, external effect)
- **Owner**: frontend-team

### Infrastructure Layer (1 boundary)

**7. k8s-email-api**
- **Intent**: Deploy email API service to Kubernetes
- **Identity**: `deployment.name + deployment.version`
- **Effects**:
  - Applies Kubernetes deployment (exactly once per version)
  - Applies Kubernetes service
- **Invariants**:
  - Deployment exists with correct replicas
  - Service routes to deployment
  - Health checks pass
  - Zero-downtime rollout
- **Criticality**: HIGH (production infrastructure)
- **Owner**: devops-team
- **Emits**: `deployment.applied.v1`

---

## Event Flow

### Event Catalog

Three events connect the system:

**1. email.ingested.v1**
- **Producer**: `email-ingest`
- **Consumer**: `email-worker`
- **Key**: `message_id`
- **Purpose**: Trigger background processing after email ingestion

**2. email.sent.v1**
- **Producer**: `email-send`
- **Consumer**: `email-worker`
- **Key**: `draft_id`
- **Purpose**: Trigger post-send operations (logging, analytics)

**3. deployment.applied.v1**
- **Producer**: `k8s-email-api`
- **Consumer**: _none_ (orphaned - for audit trail only)
- **Key**: `deployment_name`
- **Purpose**: Audit trail of infrastructure changes

---

## Key Patterns Demonstrated

### 1. Idempotency Contracts

**email-ingest**:
```
subject_id: email.message_id
dedupe_key: email.message_id + received_at
idempotency_scope: GLOBAL
```
→ Same message_id received multiple times = one database record, one event

**email-send**:
```
subject_id: email.draft_id
dedupe_key: email.draft_id + send_attempt
idempotency_scope: SUBJECT:draft_id
```
→ Retrying send for same draft_id = no duplicate emails sent

### 2. Dependency Classification

**email-search**:
```
dependencies: emails:READONLY
```
→ Read-only, safe for caching and parallel execution

**email-ingest**:
```
dependencies: emails:MUTATES, idempotency_ledger:MUTATES
```
→ Mutates data, requires careful transaction handling

### 3. Tenancy Isolation

**email-search** and **inbox-view**:
```
tenancy_scope: USER
invariants: "No emails from other users visible"
```
→ User-scoped queries enforced at boundary level

### 4. Security Surface

**email-ingest** and **email-send**:
```
pii_surface: HIGH
redaction_rules: redact:body, redact:subject
```
→ Email content contains PII, redact in logs/monitoring

**compose-view**:
```
pii_surface: HIGH
redaction_rules: redact:compose_body
```
→ Frontend also handles PII, redact from analytics

### 5. Operational Envelopes

**email-send**:
```
retry_policy: max:5, retryable:[HTTP_5xx, SMTP_TEMP_FAIL], backoff:EXP
timeout_s: 30
sla_p95_ms: 1000
```
→ Detailed retry strategy for external SMTP calls

**email-search**:
```
timeout_s: (not set - synchronous)
sla_p95_ms: 100
```
→ Fast synchronous query, tight SLA

### 6. Test-on-Demand Policy

**HIGH criticality boundaries** (email-ingest, email-send, k8s-email-api):
- ✅ Generate full test suite (happy path + idempotency + failures)
- Reason: External coupling, PII, costly errors

**MED criticality boundaries** (email-search, inbox-view, email-worker):
- ⏭️ Tests optional unless incident occurs
- Reason: Read-only or retriable, lower risk

**Rationale**: Focus testing effort where risk is highest

---

## How to Use This Example

### 1. Load Boundaries into LLM Context

```bash
# Give Claude the boundary catalog
cat BOUNDARY_INDEX.csv

# Query specific layers
grep "layer=backend" BOUNDARY_INDEX.csv
grep "layer=frontend" BOUNDARY_INDEX.csv
```

### 2. Validate Implementation Against Contracts

**Prompt**:
> "Here's the BOUNDARY_INDEX.csv for email-app. I have code in `src/api/ingest.py` that implements `email-ingest`. Does my implementation satisfy the contract?"

**Claude validates**:
- ✅ Accepts all required inputs?
- ✅ Produces declared effects?
- ✅ Checks invariants?
- ✅ Implements retry policy?
- ✅ Redacts PII in logs?

### 3. Generate Tests from Contracts

**Prompt**:
> "Generate pytest tests for `email-send` boundary using the contract from BOUNDARY_INDEX.csv"

**Claude generates**:
```python
def test_email_send_happy_path():
    # Validates invariants hold

def test_email_send_idempotency():
    # Same draft_id sent twice = one email

def test_email_send_smtp_failure():
    # HTTP_5xx retried with exponential backoff
```

### 4. Extract Boundaries from Existing Code

**Prompt**:
> "Analyze `src/api/search.py` and propose a boundary entry for BOUNDARY_INDEX.csv"

**Claude proposes**:
```csv
email-search,backend,search_emails,user_id + query_hash,...
```

### 5. Visualize Architecture

**Prompt**:
> "Generate a Mermaid sequence diagram showing the flow from `inbox-view` through `email-search` based on BOUNDARY_INDEX.csv and BOUNDARY_EVENTS.csv"

---

## Files in This Example

- **BOUNDARY_INDEX.csv** — 7 boundaries across 3 layers (unified CSV)
- **BOUNDARY_EVENTS.csv** — 3 events (ingested, sent, deployment)
- **README.md** — This walkthrough (you are here)

**Future additions** (optional):
- `boundaries/email-ingest/SKILL.md` — Detailed skill spec for high-criticality boundary
- `STATE_MODELS/email.state.md` — State machine for email lifecycle
- `runbooks/*.md` — Incident response procedures
- `tests/` — Generated tests for HIGH criticality boundaries

---

## Lessons Learned

### What Works Well

✅ **Single CSV**: Much easier to query and load into LLM context
✅ **Idempotency contracts**: Prevents duplicate emails, explicit retry safety
✅ **Event catalog**: Clear producer/consumer relationships
✅ **Tenancy scope**: Enforces user isolation at contract level
✅ **PII surface**: Security considerations explicit, not implicit
✅ **Test-on-demand**: Rational testing strategy based on risk

### Challenges

⚠️ **CSV formatting**: Long lines, hard to edit manually (use tools/LLM)
⚠️ **Initial overhead**: Takes time to define contracts upfront
⚠️ **Enforcement**: Contracts are documentation unless validated (need linters)

### Recommended Next Steps

1. **Create validation tool**: `boundary-lint BOUNDARY_INDEX.csv`
2. **Automate extraction**: Generate boundaries from existing code
3. **Integrate with CI**: Validate contracts on every PR
4. **Generate docs**: Auto-create API docs from boundaries
5. **Visualize**: Generate C4 diagrams from CSV

---

## Questions?

This example demonstrates the Boundary Decomposition v2.6 protocol. For:
- **Methodology**: See `docs/boundary-decomposition-guide.md`
- **Industry comparison**: See `experiments/boundary-protocol-industry-comparison.md`
- **Other examples**: (coming soon - API service, monorepo)

**Try it yourself**:
1. Copy this example
2. Modify for your project
3. Ask Claude to validate your implementation
4. Share learnings with the community
