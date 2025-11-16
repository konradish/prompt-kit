# Claude Code Documentation Pattern

**Purpose:** Reusable template for organizing `.claude/` directory structure with skills, commands, and agents following progressive disclosure and minimal lock-in principles.

**Scope:** Projects using Claude Code for AI-assisted development

---

## Directory Structure Template

```
project-root/
│
├── CLAUDE.md                      # Always-loaded quick reference (<150 lines)
├── README.md                      # Project overview (<300 lines)
├── ENVIRONMENTS.md                # Environment matrix (optional, <500 lines)
│
├── .claude/                       # Claude Code automation
│   ├── AGENTS_AND_SKILLS.md      # Organization guide for .claude/
│   │
│   ├── agents/                   # Specialized subagents (user-invoked)
│   │   ├── domain-expert.md     # Agent definition (thin, points to docs/)
│   │   └── ...
│   │
│   ├── skills/                   # Discoverable workflows (model-invoked)
│   │   ├── skill-name/
│   │   │   ├── SKILL.md         # Core workflow (<500 lines, HARD LIMIT)
│   │   │   ├── REFERENCE.md     # TOC pointing to detailed guides (<600 lines)
│   │   │   └── [guides].md      # Detailed domain-specific guides
│   │   └── ...
│   │
│   └── commands/                 # Atomic slash commands (user-invoked)
│       ├── domain/
│       │   └── action.md        # Command definition (<300 lines)
│       └── ...
│
├── docs/                         # Human-friendly documentation
│   ├── [category]/
│   │   ├── README.md            # Category overview + TOC
│   │   └── [guides].md          # Detailed guides (<1000 lines each)
│   └── ...
│
└── specs/                        # Architecture (pure, no deployment)
    ├── README.md                 # Architecture overview + index
    ├── modules/                  # Module specifications
    ├── boundaries/               # Boundary contracts
    └── ...
```

---

## File Size Constraints

| File Type | Target Lines | Maximum Lines | Enforcement |
|-----------|-------------|---------------|-------------|
| **SKILL.md** | 200-300 | **500 (HARD LIMIT)** | Performance degradation beyond 500 |
| **REFERENCE.md** | 300-500 | **600** | Split into focused guides if exceeded |
| **Command** | 100-200 | **300** | Keep atomic and single-purpose |
| **CLAUDE.md** | 50-100 | **150** | Absolute minimum context only |
| **Guide docs** | 500-800 | **1000** | Split into directory structure |

**Why these limits?**
- Claude Code performance degrades with large files
- Token efficiency for context loading
- Cognitive load for maintainability
- Progressive disclosure effectiveness

---

## Purpose-Based Organization

### `.claude/` = Automation Layer

**Purpose:** How Claude Code interacts with the system

**Content:**
- Skills (auto-discovered workflows)
- Commands (atomic operations)
- Agents (domain experts)

**Principle:** Thin wrappers that reference `docs/` for core knowledge

### `docs/` = Knowledge Layer

**Purpose:** How humans understand and work with the system

**Content:**
- Guides and tutorials
- Reference documentation
- Procedures and workflows
- Troubleshooting guides

**Principle:** All core knowledge lives here (minimal Claude Code lock-in)

### `specs/` = Architecture Layer

**Purpose:** What the system IS (architecture and contracts)

**Content:**
- Module specifications
- Boundary contracts
- System architecture
- Validation reports

**Principle:** Pure architecture, no operational procedures

---

## Skills vs Commands vs Agents

### Skills (Model-Invoked, Auto-Discovery)

**When to use:**
- Procedural workflows with strict steps
- Auto-discoverable trigger keywords
- Context-heavy reference material
- Self-contained operations
- Frequent usage patterns

**Structure:**
```
.claude/skills/skill-name/
├── SKILL.md           # Core workflow, trigger keywords, steps
├── REFERENCE.md       # TOC pointing to detailed guides (optional)
└── [guides].md        # Detailed implementation guides (optional)
```

**SKILL.md Template:**
```yaml
---
name: skill-name
description: Use this skill when [trigger conditions]. Triggers on "[keywords]".
allowed-tools: Read, Edit, Write, Bash, Glob, Grep
---

# Skill Name

## Trigger Cues
- Keywords: "database", "schema", "migration"
- Scenarios: When user needs to modify database structure

## Workflow

1. Step 1: [Action with specific tool]
2. Step 2: [Action with validation]
3. Step 3: [Action with output]

## Success Checklist
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## References
For detailed patterns, see [REFERENCE.md](REFERENCE.md)
```

**Progressive Disclosure Pattern:**
1. SKILL.md: Core workflow (~300 lines)
2. REFERENCE.md: TOC + quick patterns (~500 lines)
3. Detailed guides: Complete technical specs (~800 lines each)

### Commands (User-Invoked, Atomic Operations)

**When to use:**
- Single, well-defined operations
- Deterministic execution
- Compose into larger workflows
- User explicitly requests action

**Structure:**
```
.claude/commands/domain/action.md
```

**Command Template:**
```yaml
---
description: Brief description of what this command does
allowed-tools: Read, Edit, Write, Bash
---

## Command Purpose
[One-sentence description]

## Execution Steps
1. [Atomic step 1]
2. [Atomic step 2]
3. [Atomic step 3]

## Success Criteria
[How to verify command succeeded]
```

**Best Practices:**
- Keep commands atomic (one responsibility)
- Commands should be composable
- Limit to 100-300 lines
- Reference docs/ for context

### Agents (User-Invoked, Domain Experts)

**When to use:**
- Complex multi-step workflows needing isolation
- Explicit user control over invocation
- Long-running tasks with state management
- Domain expertise requiring full context
- Security-critical operations

**Structure:**
```
.claude/agents/domain-expert.md
```

**Agent Template:**
```yaml
---
name: domain-expert
description: Use this agent for [complex scenarios]. Examples: [use cases]
---

# Domain Expert Agent

## When to Use
- [Scenario 1: complex multi-file changes]
- [Scenario 2: requires deep expertise]
- [Scenario 3: coordination with other agents]

## Workflow
[Detailed procedural steps]

## Tools and Skills
- Skills to leverage: [list]
- Commands to use: [list]
- External tools: [list]

## Quality Gates
- [ ] [Validation criterion 1]
- [ ] [Validation criterion 2]

## References
Core knowledge: [docs/domain/guide.md](../../docs/domain/guide.md)
```

---

## Decision Tree: Skill vs Command vs Agent

```
Start: Need to automate workflow
│
├─ Should Claude auto-activate based on keywords?
│  YES → Consider SKILL
│  NO  → Go to next question
│
├─ Is this a single atomic operation?
│  YES → Use COMMAND
│  NO  → Go to next question
│
├─ Requires complex multi-step workflow with judgment?
│  YES → Use AGENT
│  NO  → Use SKILL with commands
│
└─ Is workflow highly procedural with strict steps?
   YES → Use SKILL
   NO  → Use AGENT
```

**Examples:**

- **Database migration** → SKILL (procedural, auto-discover)
- **Run tests** → COMMAND (atomic operation)
- **Implement new feature** → AGENT (complex, requires judgment)
- **Documentation update** → SKILL (procedural, frequent)
- **Generate migration** → COMMAND (atomic, composable)
- **Debug production issue** → AGENT (requires expertise)

---

## Progressive Disclosure Strategy

### Layer 1: Metadata Only (~100 bytes per skill)

**Always loaded** when Claude Code initializes

```yaml
---
name: skill-name
description: Use this skill when making database schema changes...
---
```

**Token cost:** Minimal, just skill registry

### Layer 2: SKILL.md (~500 lines max)

**Loaded when skill triggers** based on keywords

**Contains:**
- Core workflow instructions
- Step-by-step procedures
- Common scenarios
- Links to REFERENCE.md

**Token cost:** Moderate, only when needed

### Layer 3: REFERENCE.md (~600 lines max)

**Loaded on-demand** when Claude needs details

**Contains:**
- Table of contents
- Quick patterns and examples
- Links to detailed guides
- Troubleshooting quick reference

**Token cost:** Higher, but avoided unless necessary

### Layer 4: Detailed Guides (unbounded)

**Loaded specifically** when working on complex scenarios

**Contains:**
- Complete technical specifications
- Extensive examples
- Edge cases and advanced patterns
- Integration details

**Token cost:** Highest, loaded only for specific needs

---

## Lock-In Mitigation Strategy

### Core Principle: Knowledge lives in `docs/`, automation lives in `.claude/`

**If migrating away from Claude Code:**
- ✅ Keep `docs/` directory (all core knowledge)
- ✅ Keep `specs/` directory (architecture)
- ❌ Lose `.claude/` directory (only automation)
- 📊 Result: Lose automation, keep 100% of knowledge

### Implementation Pattern

**❌ BAD: Knowledge in skill**
```markdown
# .claude/skills/database-schema-manager/SKILL.md

## Database Migration Pattern
1. Update SQLAlchemy model in backend/app/models/
2. Generate migration: alembic revision --autogenerate
3. Review migration in backend/alembic/versions/
4. Apply: alembic upgrade head
[500+ lines of detailed procedures, examples, edge cases...]
```
**Problem:** All knowledge locked in Claude Code skill

**✅ GOOD: Thin skill wrapper**
```markdown
# .claude/skills/database-schema-manager/SKILL.md

## Database Migration Workflow
Follow the model-first workflow documented in [docs/workflows/database-workflows.md](../../docs/workflows/database-workflows.md).

Steps:
1. Run /database/update-models
2. Run /database/autogenerate-migration
3. Run /database/verify-migration

See REFERENCE.md for quick patterns or docs/workflows/database-workflows.md for complete guide.
```

```markdown
# docs/workflows/database-workflows.md

[500+ lines of detailed procedures, examples, edge cases...]
```
**Benefit:** Skill provides automation, docs/ contains knowledge

---

## Cross-Reference Conventions

### Within `.claude/` directory

**Skills referencing commands:**
```markdown
Run `/database/update-models` to modify the SQLAlchemy model
```

**Skills referencing docs:**
```markdown
For complete database patterns, see [docs/workflows/database-workflows.md](../../docs/workflows/database-workflows.md)
```

**REFERENCE.md referencing guides:**
```markdown
- [Email Analysis Patterns](email-analysis-patterns.md)
- [Schema Design Patterns](schema-design-patterns.md)
```

### One-Level-Deep Rule

**Avoid deep reference chains:**

❌ BAD:
```
SKILL.md → REFERENCE.md → another-toc.md → actual-content.md
(Too many hops, frustrating navigation)
```

✅ GOOD:
```
SKILL.md → REFERENCE.md → actual-content.md
(One level deep from SKILL.md)
```

or

```
SKILL.md → docs/guide.md
(Direct reference to detailed knowledge)
```

---

## Tool Restrictions

### Why Restrict Tools?

**Benefits:**
- Prevents scope creep
- Forces focused workflows
- Improves security for sensitive tasks
- Reduces cognitive load
- Clearer debugging when issues occur

### Common Tool Sets

**Documentation Skills:**
```yaml
allowed-tools: Read, Edit, Write, Glob, Grep
```

**Backend Development:**
```yaml
allowed-tools: Read, Edit, Write, Bash, Glob, Grep
```

**Infrastructure:**
```yaml
allowed-tools: Read, Bash, Glob, Grep, WebFetch
```

**Read-Only Analysis:**
```yaml
allowed-tools: Read, Glob, Grep
```

---

## Skill Authoring Best Practices

### 1. Naming Conventions

**Use gerund form** (verb + -ing):
- ✅ `processing-pdfs`
- ✅ `managing-database-schemas`
- ❌ `process-pdfs` (sounds like a command)
- ❌ `pdf-processor` (sounds like a tool)

**Write descriptions in third person:**
- ✅ "Processes PDF documents and extracts..."
- ❌ "I process PDF documents and extract..."
- ❌ "You should use this to process PDFs..."

### 2. Trigger Keywords

**Be specific and comprehensive:**
```yaml
description: Use this skill when making database schema changes, adding tables, modifying columns, creating indexes, or generating Alembic migrations. Triggers on "database", "schema", "migration", "add column", "create table", "alter table", "SQLAlchemy model".
```

**Include variations:**
- Nouns: "database", "schema", "migration"
- Verbs: "add column", "create table", "alter table"
- Tools: "SQLAlchemy", "Alembic"
- Patterns: "model-first workflow"

### 3. Workflow Structure

**Use numbered steps:**
```markdown
## Workflow

1. Confirm scope and requirements
2. Update SQLAlchemy model in backend/app/models/
3. Generate migration: Run /database/autogenerate-migration
4. Review generated migration file
5. Verify migration: Run /database/verify-migration
6. Document changes in specs/modules/
```

**Include validation at each step:**
```markdown
3. Generate migration
   - Run: /database/autogenerate-migration
   - Validate: Check generated SQL in migration file
   - ✅ Success: Migration file created in alembic/versions/
   - ❌ Failure: Review model changes, check for syntax errors
```

### 4. Success Criteria

**Make criteria measurable:**
```markdown
## Success Checklist
- [ ] SQLAlchemy model updated with new fields
- [ ] Migration file generated without errors
- [ ] Migration applied successfully to local database
- [ ] Module spec updated with schema changes
- [ ] No test failures after migration
```

### 5. Link to Knowledge Base

**Always reference docs/ for details:**
```markdown
## References
- Complete workflow: [docs/workflows/database-workflows.md](../../docs/workflows/database-workflows.md)
- Migration patterns: [REFERENCE.md](REFERENCE.md)
- Troubleshooting: [docs/troubleshooting/database-issues.md](../../docs/troubleshooting/database-issues.md)
```

---

## Command Authoring Best Practices

### 1. Single Responsibility

**Each command does ONE thing:**

✅ GOOD:
```
/database/update-models         # Only updates SQLAlchemy models
/database/autogenerate-migration # Only generates migration
/database/verify-migration       # Only verifies migration
```

❌ BAD:
```
/database/migrate-schema        # Does everything (too broad)
```

### 2. Composability

**Commands should compose into workflows:**

```markdown
# Skill orchestrates commands:
1. Run /database/update-models
2. Run /database/autogenerate-migration
3. Run /database/verify-migration
```

### 3. Clear Success Criteria

```yaml
---
description: Generate Alembic migration from model changes
---

## Success Criteria
Migration file created in backend/alembic/versions/ with:
- Upgrade operation for model changes
- Downgrade operation for rollback
- No autogenerate warnings or errors
```

---

## Agent Authoring Best Practices

### 1. Clear Scope Definition

**Define when to use vs when to use skills:**

```markdown
## When to Use This Agent

Use the backend-developer agent for:
- ✅ Implementing new FastAPI endpoints across multiple files
- ✅ Complex business logic requiring judgment
- ✅ Multi-service integration

Use skills instead for:
- ❌ Database schema changes → use database-schema-manager skill
- ❌ Documentation updates → use docs-maintainer skill
- ❌ Running tests → use /test/* commands
```

### 2. Reference Skills and Commands

**Agents should leverage existing automation:**

```markdown
## Tools and Workflows

This agent coordinates:
- database-schema-manager skill (for schema changes)
- /test/run-backend command (for validation)
- /docs/update-api-reference command (for documentation)

The agent focuses on implementation logic while delegating procedural tasks to skills/commands.
```

### 3. Quality Gates

**Define comprehensive validation:**

```markdown
## Quality Gates

Before completing:
- [ ] All tests passing (run /test/run-backend)
- [ ] API documentation updated (run /docs/update-api-reference)
- [ ] Type checking passes (run /validate/type-check)
- [ ] Integration tests cover new endpoints
- [ ] Database migrations verified (if schema changed)
```

---

## Validation and Maintenance

### Regular Health Checks

**Monthly:**
- Check skill file sizes (none >500 lines for SKILL.md)
- Validate cross-references (no broken links)
- Review trigger keywords (are they being found?)
- Check tool restrictions (still appropriate?)

**Quarterly:**
- Run semantic similarity on skills (detect duplicates)
- Review skill effectiveness (usage metrics)
- Update deprecated patterns
- Consolidate underused skills

### Refactoring Triggers

**When to refactor a skill:**

1. **SKILL.md exceeds 500 lines** → Split into REFERENCE.md + guides
2. **Low usage despite relevant keywords** → Improve trigger keywords or merge into another skill
3. **High duplication with docs/** → Thin out skill, reference docs/
4. **Frequent manual corrections needed** → Improve workflow clarity or add validation steps

**When to convert agent to skill:**

1. **Workflow becomes highly procedural** → Clear steps can be codified
2. **Frequent usage pattern emerges** → Auto-activation would help
3. **Less judgment needed** → Can be automated with validation checks

**When to convert skill to agent:**

1. **Requires complex decision-making** → Human judgment or deep expertise needed
2. **Multi-domain coordination** → Orchestrating multiple skills/agents
3. **Security-critical operations** → Needs human oversight

---

## Integration with Documentation Governance

### Sync Obligations for `.claude/` Changes

| Change Type | Required Updates |
|-------------|------------------|
| **New skill added** | Update AGENTS_AND_SKILLS.md, add to index |
| **Skill workflow changed** | Update related docs/ if core knowledge changed |
| **Command added** | Update skill that uses it, document in AGENTS_AND_SKILLS.md |
| **Agent added** | Update AGENTS_AND_SKILLS.md with scope and coordination patterns |
| **File moved in docs/** | Update all .claude/ references to that file |

### Progressive Disclosure Maintenance

**After splitting large docs file:**
1. Update all skill SKILL.md files referencing it
2. Update REFERENCE.md files with new links
3. Update agent instructions if they reference it
4. Add navigation (README.md with TOC)

**After consolidating docs:**
1. Update all .claude/ cross-references
2. Remove deprecated links
3. Update skills to reference new canonical location

---

## Template Checklist

When setting up `.claude/` in a new project:

- [ ] Create `.claude/` directory structure
- [ ] Write AGENTS_AND_SKILLS.md (organization guide)
- [ ] Create first skill (use template above)
- [ ] Create first command (use template above)
- [ ] Set file size limits (500 for skills, 300 for commands)
- [ ] Establish sync obligations (what updates what)
- [ ] Configure tool restrictions per skill/command
- [ ] Link skills to docs/ (knowledge lives in docs/)
- [ ] Test progressive disclosure (does Layer 1→2→3 work?)
- [ ] Validate cross-references (no broken links)

---

## References

- **Claude Code Documentation:** https://code.claude.com/docs
- **Documentation Governance Framework:** [documentation-governance.md](documentation-governance.md)
- **Progressive Disclosure Research:** Claude Code best practices (2024-2025)
- **Lock-In Mitigation:** Minimal automation, maximum portability

---

## Adaptation Guide

To use this pattern in your project:

1. **Copy directory structure** to your project root
2. **Customize AGENTS_AND_SKILLS.md** with your project's needs
3. **Create first skill** using template and best practices above
4. **Define tool restrictions** based on your security requirements
5. **Establish sync obligations** between .claude/, docs/, and specs/
6. **Set up validation** to enforce file size limits
7. **Monitor effectiveness** and refactor as patterns emerge

This pattern prioritizes:
- **Token efficiency** (progressive disclosure)
- **Portability** (knowledge in docs/, automation in .claude/)
- **Maintainability** (file size limits, clear organization)
- **Effectiveness** (auto-discovery, composability, validation)
