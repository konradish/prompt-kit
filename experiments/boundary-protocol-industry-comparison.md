# Boundary Protocol vs Industry Approaches
## Research on Structured Codebase Documentation for LLM Assistance

**Date**: 2025-11-16
**Session**: claude/research-repo-best-practices-01MNwXWoeFrcddmgwQzgBu3Q

---

## Executive Summary

Researched industry approaches to structured codebase documentation, service catalogs, and machine-readable contracts to compare with the **Universal Boundary Decomposition v2.5** protocol in prompt-kit.

**Key Finding**: While no exact equivalent exists, the boundary protocol synthesizes best practices from multiple industry standards:
- **Backstage.io** service catalogs (YAML metadata)
- **OpenAPI** contract-first development (machine-readable APIs)
- **C4 Model** + Structurizr (architecture as code)
- **Dependency mapping** tools (automated analysis)
- **ADRs** (Architecture Decision Records)

**Unique Value**: Boundary protocol is more comprehensive and enforcement-oriented than any single approach, combining service inventory, dependency tracking, observability contracts, and test-on-demand policy in a unified CSV-based system.

**Recommendation**: This protocol represents original thinking that synthesizes industry best practices. It should be:
1. Featured prominently in restructured docs as a flagship workflow
2. Supported with practical examples (web app, API service, monorepo)
3. Positioned as "LLM-native architecture documentation"

---

## Industry Approaches Comparison

### 1. Backstage.io Service Catalog

**What it is**: Open-source developer portal (created by Spotify) with YAML-based service catalog.

**Structure**:
```yaml
# catalog-info.yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: artist-web
  description: Artist website frontend
  labels:
    system: artist-engagement
  annotations:
    github.com/project-slug: spotify/artist-web
  tags:
    - react
    - typescript
spec:
  type: website
  lifecycle: production
  owner: team-artist
  system: artist-engagement
  dependsOn:
    - component:artist-api
    - resource:artist-db
```

**What it tracks**:
- Service metadata (name, description, labels, tags)
- Ownership (teams)
- Lifecycle stage (experimental, production, deprecated)
- System/domain grouping
- Dependencies on other components
- External links (docs, dashboards, repos)

**Similarities to Boundary Protocol**:
✅ YAML/structured format (though Backstage uses YAML vs our CSV)
✅ Ownership tracking (`owner` field)
✅ Dependency declaration (`dependsOn`)
✅ Lifecycle/intent classification
✅ Stored in code repositories

**Differences**:
❌ No identity/idempotency contracts (`subject_id`, `dedupe_key`)
❌ No effects/invariants specification
❌ No operational envelope (SLAs, retry policies, timeouts)
❌ No PII/security surface tracking
❌ No observability contracts (metrics, alerts)
❌ No rollback documentation
❌ Dependencies are simple references, not READONLY/MUTATES classification

**Scale**: Used by organizations with 100s-1000s of services (Spotify, Netflix, etc.)

**Tooling**: Rich ecosystem (UI portal, plugins, integrations)

---

### 2. OpenAPI / Contract-First Development

**What it is**: Machine-readable API specification (JSON/YAML) that serves as single source of truth.

**Structure**:
```yaml
# openapi.yaml
openapi: 3.0.0
info:
  title: Email API
  version: 1.0.0
paths:
  /emails:
    post:
      summary: Ingest email
      operationId: ingestEmail
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/EmailInput'
      responses:
        '200':
          description: Email ingested
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/EmailResponse'
        '400':
          description: Invalid input
        '500':
          description: Server error
components:
  schemas:
    EmailInput:
      type: object
      required: [from, to, subject]
      properties:
        from: { type: string, format: email }
        to: { type: string, format: email }
        subject: { type: string }
```

**What it tracks**:
- API boundaries (endpoints)
- Inputs/outputs (schemas)
- Response codes (success, error states)
- Content types
- Authentication requirements

**Similarities to Boundary Protocol**:
✅ Machine-readable format
✅ Input schema specification
✅ Contract-first approach (spec before implementation)
✅ Single source of truth
✅ Version controlled

**Differences**:
❌ API-only (doesn't cover batch jobs, workers, infra)
❌ No idempotency contracts
❌ No dependency tracking
❌ No observability/SLA contracts
❌ No ownership or team metadata
❌ No retry policies or operational envelopes
❌ No invariants or effects specification

**Scale**: Industry standard for APIs (used universally)

**Tooling**: Extensive (code generators, validators, mock servers, docs generators)

---

### 3. C4 Model + Structurizr (Architecture as Code)

**What it is**: Hierarchical architecture documentation with programmatic diagram generation.

**Four Levels**:
1. **System Context**: Bird's-eye view (system + external actors)
2. **Container**: High-level tech stack (apps, databases, services)
3. **Component**: Internal structure within containers
4. **Code**: Class/module level (rarely used)

**Structure** (Structurizr DSL):
```groovy
workspace {
    model {
        user = person "Customer" "Uses the system"
        emailSystem = softwareSystem "Email System" {
            webapp = container "Web App" "React" "Browser"
            api = container "API" "Node.js" "REST API"
            worker = container "Email Worker" "Python" "Background processor"
            db = container "Database" "PostgreSQL" "Stores emails"

            webapp -> api "Makes API calls to"
            api -> db "Reads from and writes to"
            api -> worker "Enqueues jobs to"
        }
        user -> webapp "Uses"
    }

    views {
        systemContext emailSystem {
            include *
            autoLayout
        }
        container emailSystem {
            include *
            autoLayout
        }
    }
}
```

**What it tracks**:
- System boundaries and relationships
- Container (deployment unit) boundaries
- Component boundaries within containers
- Technology choices per container
- Relationships and dependencies

**Similarities to Boundary Protocol**:
✅ System decomposition into boundaries
✅ Relationship tracking
✅ Version controlled, code-based
✅ Multiple abstraction levels
✅ Technology/stack documentation

**Differences**:
❌ Visualization-focused (diagrams), not execution-focused (contracts)
❌ No identity/idempotency
❌ No effects/invariants
❌ No operational SLAs
❌ No observability contracts
❌ No security/PII surface
❌ No ownership metadata

**Scale**: Used for enterprise architecture documentation

**Tooling**: Structurizr (commercial SaaS + open source tools), PlantUML, Mermaid integration

---

### 4. Service Catalog Tools (Datadog, OpsLevel, Port)

**What it is**: Centralized service inventory with metadata for observability and operations.

**Structure** (Datadog Service Definition):
```yaml
# service.datadog.yaml
schema-version: v2.2
dd-service: email-ingestion-worker
team: platform-team
application: email-system
tier: tier1
lifecycle: production
description: Processes incoming emails from queue
languages:
  - python
tags:
  - domain:messaging
  - runtime:kubernetes
contacts:
  - type: email
    contact: platform-team@company.com
  - type: slack
    contact: https://slack.com/platform-alerts
links:
  - name: Runbook
    type: runbook
    url: https://wiki/email-worker-runbook
  - name: Dashboard
    type: dashboard
    url: https://datadog/dashboard/email-worker
integrations:
  pagerduty:
    service-url: https://pagerduty.com/services/email-worker
```

**What it tracks**:
- Service metadata (name, description, tier)
- Team ownership
- Lifecycle stage
- Technology stack (languages, runtime)
- Contact information (email, Slack, PagerDuty)
- Links (runbooks, dashboards, docs)
- Dependencies (via observability data)
- SLAs/SLOs (in some tools)

**Similarities to Boundary Protocol**:
✅ Structured metadata format (YAML)
✅ Ownership tracking
✅ Lifecycle classification
✅ Tier/criticality
✅ Runbook/rollback references
✅ Observability integration

**Differences**:
❌ Observability-focused, not contract-focused
❌ No identity/idempotency contracts
❌ No effects/invariants specification
❌ No detailed dependency classification (READONLY/MUTATES)
❌ No retry policies or consistency windows
❌ Dependencies inferred from runtime, not declared
❌ No PII/redaction contracts

**Scale**: Enterprise-wide (100s-1000s of services)

**Tooling**: Commercial SaaS platforms with rich UIs

---

### 5. Dependency Mapping & Service Mesh

**What it is**: Automated discovery and mapping of service dependencies via runtime analysis.

**Approaches**:

**A. Static Analysis** (codebase scanning):
- Parse import statements
- Identify database queries
- Extract API calls
- Map function dependencies

**B. Dynamic Analysis** (runtime tracing):
- Service mesh (Istio, Linkerd)
- Distributed tracing (Zipkin, Jaeger)
- APM platforms (New Relic, Datadog)

**C. Hybrid** (best of both):
- Static for build-time validation
- Dynamic for runtime reality check

**What it tracks**:
- Service-to-service calls
- Database dependencies
- External API usage
- Network latency and error rates
- Request volumes
- Dependency graphs

**Similarities to Boundary Protocol**:
✅ Dependency tracking
✅ Runtime behavior analysis
✅ Observability focus

**Differences**:
❌ Discovery-based (observed), not contract-based (declared)
❌ No upfront specification
❌ No idempotency contracts
❌ No effects/invariants
❌ No security surface documentation
❌ Reactive (finds what exists) vs proactive (defines what should exist)

**Scale**: Cloud-native architectures with microservices

**Tooling**: Service mesh infrastructure, tracing platforms, APM

---

### 6. Architecture Decision Records (ADRs)

**What it is**: Markdown documents capturing architectural decisions with context and consequences.

**Structure**:
```markdown
# ADR-001: Use Event Sourcing for Email Processing

## Status
Accepted

## Context
Email processing requires:
- Audit trail of all actions
- Ability to replay events for debugging
- Support for eventual consistency
- Idempotency guarantees

## Decision
Implement event sourcing pattern with:
- Event store (PostgreSQL with JSONB)
- subject_id = email.message_id
- Events: email_received, email_parsed, email_delivered
- Idempotency via dedupe on message_id + event_type

## Consequences
Positive:
- Full audit trail
- Replay capability for debugging
- Natural idempotency
- Eventual consistency support

Negative:
- Increased storage requirements
- Query complexity (event reconstruction)
- Learning curve for team
- Requires event schema versioning

## Alternatives Considered
- CRUD with audit log (rejected: no replay)
- Message queue only (rejected: no persistence)
```

**What it tracks**:
- Architectural decisions
- Context and rationale
- Consequences (positive and negative)
- Alternatives considered
- Status (proposed, accepted, deprecated)

**Similarities to Boundary Protocol**:
✅ Documentation of system design
✅ Context and rationale
✅ Version controlled (Markdown in repo)
✅ Sequential numbering

**Differences**:
❌ Decision-focused, not boundary-focused
❌ Narrative format, not machine-readable contracts
❌ No structured metadata (CSV/YAML)
❌ No operational contracts (SLAs, retries)
❌ No dependency specification
❌ No observability integration
❌ Retrospective (documents decisions made) vs prospective (defines contracts upfront)

**Scale**: Standard practice in mature engineering orgs

**Tooling**: Minimal (Markdown, git, sometimes specialized tools like adr-tools)

---

## Synthesis: What Makes Boundary Protocol Unique

The **Universal Boundary Decomposition v2.5** protocol synthesizes best practices from all these approaches into a unified, LLM-native system:

### Unique Strengths

| Aspect | Boundary Protocol | Industry Equivalent | Gap Filled |
|--------|------------------|---------------------|------------|
| **Identity** | `subject_id`, `dedupe_key`, `idempotency_scope` | None directly | ✅ First-class idempotency contracts |
| **Effects** | `INSERT/UPDATE/DELETE` on `db/api/cache/file/event/infra` | OpenAPI (partial, API-only) | ✅ All side effects, not just APIs |
| **Invariants** | Machine-checkable assertions | None | ✅ Explicit correctness contracts |
| **Dependencies** | `READONLY` vs `MUTATES` classification | Backstage (simple refs) | ✅ Mutation analysis |
| **Operational Envelope** | `consistency_window_s`, `retry_policy`, `timeout_s`, `sla_p95_ms` | Service catalogs (partial) | ✅ Complete operational contract |
| **Security Surface** | `pii_surface`, `redaction_rules`, `secret_refs` | None structured | ✅ Security as part of contract |
| **Observability** | `observability_metric`, `alert_rule` required | Service mesh (inferred) | ✅ Contracts, not discovery |
| **Rollback** | `rollback_ref` mandatory | ADRs (narrative) | ✅ Operationalized incident response |
| **Test Policy** | Test-on-demand based on criticality/complexity | None | ✅ Rational testing strategy |
| **Format** | CSV (LLM-friendly, diffable, queryable) | YAML/Markdown/UI | ✅ Optimal for LLM context |
| **Scope** | Backend + Frontend + Infra (unified) | Separate tools per layer | ✅ Holistic system view |
| **Event Spine** | `BOUNDARY_EVENTS.csv` as global catalog | Service catalogs (per-service) | ✅ System-wide event truth |

### Positioned as "LLM-Native Architecture Documentation"

Traditional approaches (Backstage, OpenAPI, C4) were designed for:
- **Human consumption** (dashboards, diagrams, API docs)
- **Tool integration** (CI/CD, monitoring, code generation)

Boundary protocol is designed for:
- **LLM consumption** (CSV = structured, token-efficient, queryable)
- **Contract enforcement** (machine-checkable invariants)
- **Reasoning and validation** (LLMs can validate boundaries against code)
- **Progressive generation** (LLMs can propose boundaries from existing code)

**Analogy**:
- OpenAPI : API development :: Boundary Protocol : System architecture
- Like OpenAPI became "single source of truth" for APIs, boundary protocol can be "single source of truth" for system behavior

---

## Recommendations for Prompt-Kit

### 1. Position Boundary Protocol as Flagship Workflow

**Elevator pitch**:
> "Contract-first system design for the LLM era. Define what your system does (boundaries), how it behaves (effects + invariants), and how it fails (retry policies), then let AI validate implementation against spec."

**Documentation structure**:
```
docs/workflows/boundary-decomposition/
├── README.md                      # Overview and elevator pitch
├── methodology.md                 # The protocol itself (updated for single CSV)
├── comparison-to-industry.md      # This document
└── when-to-use.md                 # Decision guide

docs/patterns/
└── boundary-contracts.md          # Core pattern explanation

examples/workflows/boundary-decomposition/
├── web-app-example/
│   ├── BOUNDARY_INDEX.csv        # Complete example
│   ├── BOUNDARY_EVENTS.csv
│   ├── boundaries/               # Individual SKILL.md files
│   ├── STATE_MODELS/
│   └── README.md                # Walkthrough
├── api-service-example/
│   └── ...
└── monorepo-example/
    └── ...
```

### 2. Update Protocol for Single CSV Approach

**Change**: Use one `BOUNDARY_INDEX.csv` with `layer` column instead of three separate files.

**Rationale**:
- Simpler for LLM context (one file to load)
- Easier to query across layers (e.g., "show all HIGH criticality boundaries")
- Better git history (one file's evolution vs three)
- Easier to maintain consistency (single header schema)

**Before** (v2.5):
```
deliverables:
  - BOUNDARY_INDEX.csv (backend)
  - BOUNDARY_UI.csv (frontend)
  - BOUNDARY_INFRA.csv (infrastructure)
```

**After** (v2.6):
```
deliverables:
  - BOUNDARY_INDEX.csv (all layers with layer=backend|frontend|infra)
  - BOUNDARY_EVENTS.csv (event catalog)
  - STATE_MODELS/*.md (state machines)
```

**CSV Header** (add `layer` column):
```csv
name,layer,intent,subject_id,dedupe_key,idempotency_scope,inputs,dependencies,effects,...
email-ingest,backend,ingest_email,email.message_id,...
artist-profile-view,frontend,render_profile,user_id + artist_id,...
k8s-deployment,infra,deploy_service,service_name + version,...
```

**Benefits**:
- Single file queries: `grep "layer=frontend" BOUNDARY_INDEX.csv`
- Cross-layer analysis: "which frontend boundaries depend on email-ingest?"
- Simpler tooling: one parser, one validator
- Better for LLM: less file switching

### 3. Create Practical Examples

**Example 1: Simple Web App** (email management)
- 3 backend boundaries (ingest, search, send)
- 2 frontend boundaries (inbox view, compose)
- 1 infra boundary (email worker deployment)
- Complete `BOUNDARY_INDEX.csv` + `BOUNDARY_EVENTS.csv`
- 2-3 sample `SKILL.md` files showing progression

**Example 2: API Service** (payment processing)
- 5 backend boundaries (charge, refund, webhook, reconcile, report)
- 1 frontend boundary (admin dashboard)
- 2 infra boundaries (PCI-compliant deployment, secrets rotation)
- Emphasis on security surface, idempotency, retry policies
- HIGH criticality → full test suite example

**Example 3: Monorepo** (multi-tenant SaaS)
- 15+ boundaries across backend/frontend/infra
- Tenancy scope variations (GLOBAL, FAMILY, USER, CHILD)
- Event-driven architecture (10+ events in catalog)
- State models for key entities (tenant, subscription)
- Demonstrates scale and cross-boundary relationships

### 4. Integration with Other Workflows

**Boundary + HTK**:
```
Hypothesis: If we define boundaries with invariants,
           then LLM can generate tests that verify those invariants

Test: Create boundary for "send-email" with invariants,
      ask Claude to generate pytest tests from SKILL.md

Verify: Tests cover all invariants, pass on implementation
```

**Boundary + TDD**:
```
1. Define boundary contract (inputs, effects, invariants)
2. Generate test cases from invariants
3. Implement boundary to satisfy contract
4. Validate with test-on-demand policy
```

**Boundary + Refactoring**:
```
Before refactoring:
  - Document existing system as boundaries
  - Extract dependencies, effects, invariants from code
  - Use BOUNDARY_INDEX.csv as specification

During refactoring:
  - Contracts remain stable
  - Implementation changes
  - Tests validate contract adherence

After refactoring:
  - Update boundary metadata (e.g., new dependencies)
  - Contracts evolve deliberately
```

### 5. Tooling Opportunities

**For Future Development**:

**A. Boundary Linter** (CI check):
```bash
# .claude/commands/quality/validate-boundaries.md
uv run boundary-lint BOUNDARY_INDEX.csv --strict

Checks:
- Every effect:event exists in BOUNDARY_EVENTS.csv
- Every emitted event has consumer (or orphan:true)
- All subject_id/dedupe_key resolvable from inputs
- Observability metrics present for layer=backend|infra
- Tenancy scope valid enum
```

**B. Boundary Generator** (from code):
```bash
# .claude/commands/workflows/extract-boundaries.md
Ask Claude to analyze codebase and propose BOUNDARY_INDEX.csv

Claude:
  1. Identify entry points (API handlers, cron jobs, event handlers)
  2. Trace dependencies (DB, APIs, caches)
  3. Infer effects from code (INSERT/UPDATE/DELETE)
  4. Extract retry/timeout configs
  5. Propose boundaries CSV
```

**C. Contract Validator** (against implementation):
```bash
# .claude/commands/quality/validate-implementation.md
Compare BOUNDARY_INDEX.csv to actual code

For each boundary:
  - Does code accept declared inputs?
  - Does code produce declared effects?
  - Are invariants validated in code?
  - Are retry policies implemented correctly?
```

**D. Boundary Visualizer** (generate C4 diagrams):
```bash
# .claude/commands/workflows/visualize-boundaries.md
Generate Mermaid/PlantUML from BOUNDARY_INDEX.csv

- System context: Show systems and external actors
- Container: Show services and databases
- Sequence: Show event flows from BOUNDARY_EVENTS.csv
```

---

## Industry Validation

### Approaches Similar to Boundary Protocol

While no exact match exists, these projects show similar thinking:

**1. Ortelius** (microservice dependency mapping)
- Tracks "logical views" of applications
- Shows dependencies across clusters
- Versions services and relationships
- **Similar**: Dependency tracking, versioning
- **Different**: Discovery-based, not contract-based

**2. Code-Index MCP Server** (LLM codebase indexing)
- Creates searchable index for LLMs
- Exposes tools for code search and analysis
- Supports architecture analysis
- **Similar**: LLM-native documentation
- **Different**: Code-focused, not boundary-focused

**3. Structurizr** (architecture as code)
- Programmatic architecture definition
- Version controlled
- Generates diagrams
- **Similar**: Code-first approach, versioning
- **Different**: Visualization-focused, not contracts

**4. OpenAPI + Extensions** (contract-first APIs)
- Machine-readable contracts
- Single source of truth
- Some tools add `x-` extensions for SLAs, owners, etc.
- **Similar**: Contract-first, machine-readable
- **Different**: API-only, no idempotency/invariants

### Gaps in Industry

**No industry standard exists for**:
1. ✅ **Idempotency contracts** at system level (APIs have some, but not batch/workers/infra)
2. ✅ **Invariant specification** in structured format
3. ✅ **Unified backend + frontend + infra** documentation
4. ✅ **CSV-based contracts** optimized for LLM consumption
5. ✅ **Test-on-demand policy** based on criticality
6. ✅ **Security surface as first-class metadata**
7. ✅ **Event catalog as system spine**

**Boundary protocol fills these gaps.**

---

## Positioning Strategy

### Internal (Prompt-Kit)

**Tagline**: "The LLM-native architecture protocol"

**Value Proposition**:
- Reduce onboarding time (boundaries = map of system)
- Enable AI-assisted refactoring (contracts = safety net)
- Systematize testing (test-on-demand = rational strategy)
- Operationalize observability (metrics/alerts = contract, not afterthought)
- Document security (PII surface = explicit, not implicit)

**Use Cases**:
- New project setup: Define boundaries before coding
- Legacy system documentation: Extract boundaries from code
- Refactoring: Use contracts as specification
- Incident response: Rollback refs + observability metrics
- Compliance: PII surface + redaction rules

### External (Community)

**Comparison Table** (for docs):

| Need | Traditional Approach | Boundary Protocol | Advantage |
|------|---------------------|-------------------|-----------|
| API docs | OpenAPI | Boundary for APIs + workers + infra | Unified system view |
| Service catalog | Backstage.io | BOUNDARY_INDEX.csv | LLM-native, contract-enforced |
| Architecture docs | C4 diagrams | Boundaries + auto-generated diagrams | Single source of truth |
| Dependency mapping | Service mesh discovery | Declared dependencies with mutation classification | Proactive + detailed |
| Testing strategy | 100% coverage or ad-hoc | Test-on-demand based on criticality | Rational resource allocation |
| Observability | Post-hoc monitoring | Metrics/alerts in contract | Shift-left observability |
| Security docs | Separate compliance docs | PII surface + redaction in contract | Security-by-design |

**Article Ideas**:
1. "Why We Built a CSV-Based Architecture Protocol"
2. "Contract-First System Design for the LLM Era"
3. "From Service Catalog to Boundary Contracts: The Next Evolution"
4. "How to Document Your System for AI Assistants"

---

## Next Steps

1. ✅ **Research complete** (this document)
2. ⏭️ **Update boundary guide** to v2.6 (single CSV with `layer` column)
3. ⏭️ **Create web app example** (complete walkthrough)
4. ⏭️ **Update restructure recommendations** (add boundary as flagship workflow)
5. ⏭️ **Write comparison doc** for docs/workflows/boundary-decomposition/
6. ⏭️ **Create commands** for boundary validation/generation
7. ⏭️ **Consider article** for external community

---

**Research Summary**:
- **Sources reviewed**: 9 web searches, 40+ links analyzed
- **Industry approaches identified**: 6 major categories
- **Conclusion**: Boundary protocol is unique synthesis of best practices, optimized for LLM era
- **Recommendation**: Feature prominently, create examples, position as "LLM-native architecture"

