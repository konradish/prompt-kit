# Documentation Governance Framework

**Purpose:** Establish project-agnostic documentation standards, sync obligations, and quality gates that ensure documentation stays current with code, specs, and automation.

**Scope:** Applies to any software project using AI-assisted development (Claude Code, GitHub Copilot, etc.)

---

## Core Principles

### 1. Documentation as Code
- Documentation changes follow the same rigor as code changes
- Documentation is versioned alongside code
- Documentation has quality gates and validation
- Documentation debt is tracked and addressed

### 2. Single Source of Truth
- Each piece of information exists in exactly one place
- Cross-references link to authoritative sources
- Duplication is detected and eliminated
- Canonical locations are clearly defined

### 3. Progressive Disclosure
- Minimal always-loaded context (quick reference)
- On-demand detailed context (guides and references)
- Deep-dive documentation (comprehensive technical details)
- Optional automation (skills and commands)

### 4. Sync Obligations
- Code changes require documentation updates
- Documentation changes trigger related updates
- Specs and docs stay synchronized
- Skills/commands reference current information

---

## Documentation Architecture

### Purpose-Based Organization

| Directory | Purpose | Who Uses It | Content Type |
|-----------|---------|-------------|--------------|
| **Root** | Quick reference | Everyone | CLAUDE.md, README.md, ENVIRONMENTS.md |
| **docs/** | Understanding | Human developers | Guides, references, procedures |
| **specs/** | Architecture | Both humans and AI | Module specs, boundary contracts, validation |
| **.claude/** | Automation | AI agents (Claude Code) | Skills, commands, agents |

**Key Distinctions:**
- `specs/` = "What the system IS" (architecture, contracts, boundaries)
- `docs/` = "How to work with the system" (guides, procedures, references)
- `.claude/` = "How AI works with the system" (automation, workflows)

### File Size Guidelines

| File Type | Target Size | Maximum Size | Action if Exceeded |
|-----------|------------|--------------|-------------------|
| CLAUDE.md | 100-150 lines | 200 lines | Split into progressive layers |
| README.md | 100-200 lines | 300 lines | Move details to docs/ |
| SKILL.md | 200-300 lines | 500 lines (hard limit) | Split into REFERENCE.md + guides |
| REFERENCE.md | 300-500 lines | 600 lines | Split into focused sub-files |
| Guide docs | 500-800 lines | 1000 lines | Split into directory structure |
| Specs | 1000-2000 words | 3000 words | Split by module/boundary |

---

## Sync Obligation Matrix

### Code Changes → Documentation Updates

| Change Type | Required Documentation Updates | Validation |
|-------------|--------------------------------|------------|
| **New API Endpoint** | 1. API reference docs<br>2. Integration test documentation<br>3. Skills/commands (if pattern change) | Run `/docs/sync-check` |
| **Database Schema** | 1. Module specs (specs/modules/)<br>2. Database documentation<br>3. Migration documentation | Verify specs updated |
| **New Feature** | 1. User-facing documentation<br>2. Module specification<br>3. Core quick reference (if major) | Check docs/ and specs/ |
| **Workflow Change** | 1. Workflow documentation<br>2. Skills and commands (.claude/)<br>3. Agent coordination docs | Run `/docs/enforce-standards` |
| **Deployment Change** | 1. Deployment guides<br>2. Environment documentation<br>3. Infrastructure docs | Validate cross-references |
| **Bug Fix** | 1. Troubleshooting guides (if pattern)<br>2. Known issues documentation | Update if systematic issue |

### Documentation Changes → Related Updates

| Documentation Change | Related Updates Required |
|---------------------|--------------------------|
| **API docs updated** | Skills referencing API patterns, integration tests |
| **Workflow docs updated** | Skills and commands automation, agent instructions |
| **Specs updated** | Related docs/ guides, skills referencing architecture |
| **File moved/renamed** | All cross-references, skills, commands, agents |
| **File split** | Table of contents, cross-references, navigation |

---

## Quality Gates

### Pre-Commit Checklist

Before committing documentation changes:

- [ ] **No duplication** - Information exists in exactly one place
- [ ] **Cross-references updated** - All links point to correct locations
- [ ] **File size compliant** - Within target size guidelines
- [ ] **Related updates made** - Code/specs/skills updated as required
- [ ] **Examples current** - Code examples work with current codebase
- [ ] **Formatting consistent** - Follows project style guide

### Pre-Push Validation

Before pushing to main branch:

- [ ] **Sync validation** - Run documentation sync check
- [ ] **Standards enforcement** - Run standards validation
- [ ] **Link validation** - No broken internal links
- [ ] **Semantic analysis** - No new near-duplicates (>85% similarity)
- [ ] **Integration check** - Documentation integrates with existing structure

### Pre-Deploy Validation

Before deploying to production:

- [ ] **Full sync report** - Generate comprehensive sync dashboard
- [ ] **Documentation debt check** - Review and address critical debt
- [ ] **User-facing docs updated** - All user-visible changes documented
- [ ] **Runbooks updated** - Operational procedures current
- [ ] **Architecture docs current** - System design matches implementation

---

## Documentation Lifecycle

### 1. Creation Phase

**When creating new documentation:**

1. **Check for existing coverage** - Search for similar content
2. **Choose canonical location** - Use purpose-based organization
3. **Follow size guidelines** - Stay within target sizes
4. **Link, don't duplicate** - Reference existing docs
5. **Add to navigation** - Update tables of contents and indexes

**Creation Checklist:**
- [ ] Searched for existing documentation on topic
- [ ] Chosen appropriate location (docs/ vs specs/ vs .claude/)
- [ ] File size within guidelines
- [ ] Cross-references to related documentation
- [ ] Added to relevant index/TOC

### 2. Maintenance Phase

**When updating existing documentation:**

1. **Locate canonical source** - Find single source of truth
2. **Update in place** - Modify existing doc, don't create new
3. **Update cross-references** - Fix any changed links/anchors
4. **Remove outdated content** - Delete immediately, don't comment out
5. **Validate related docs** - Check if related docs need updates

**Maintenance Checklist:**
- [ ] Updated canonical source (not duplicate)
- [ ] Removed outdated information
- [ ] Updated cross-references
- [ ] Checked related documentation
- [ ] File size still within guidelines

### 3. Deprecation Phase

**When deprecating documentation:**

1. **Mark as deprecated** - Add deprecation notice at top
2. **Provide redirect** - Link to replacement/updated information
3. **Set removal date** - 30-day window for transition
4. **Update cross-references** - Point to new location
5. **Delete after window** - Remove completely, don't archive

**Deprecation Template:**
```markdown
> **⚠️ DEPRECATED**: This document is deprecated as of YYYY-MM-DD.
> See [New Location](path/to/new/doc.md) for current information.
> This file will be removed on YYYY-MM-DD.
```

### 4. Archival Phase (Optional)

**When archiving historical documentation:**

Only archive if:
- Needed for compliance/audit purposes
- Contains valuable historical context
- Referenced in external documentation

Otherwise, delete completely.

**Archive Location:** `docs/archive/YYYY/` or project-specific location

---

## Progressive Disclosure Pattern

### Layer 1: Always-Loaded Essentials (~50-100 tokens)

**Files:** CLAUDE.md, README.md (summary only)

**Content:**
- Quick command reference
- Critical environment details (ports, URLs, credentials location)
- Links to detailed documentation
- Current system status

**Token Budget:** Absolute minimum to prevent common confusion

### Layer 2: On-Demand Detailed Context (~300-500 tokens)

**Files:** ENVIRONMENTS.md, docs/*/README.md, skill SKILL.md files

**Content:**
- Comprehensive environment matrices
- Directory overviews and tables of contents
- Core workflow instructions
- Common scenarios

**Token Budget:** Loaded when discussing specific topics

### Layer 3: Deep-Dive Documentation (~500-1500 tokens per file)

**Files:** docs/[category]/[guide].md, specs/modules/, skill REFERENCE.md

**Content:**
- Complete technical specifications
- Detailed procedures and workflows
- Comprehensive examples
- Troubleshooting guides

**Token Budget:** Loaded only when needed for specific tasks

### Layer 4: Optional Automation (variable tokens)

**Files:** .claude/skills/, .claude/commands/, .claude/agents/

**Content:**
- Workflow automation (skills)
- Atomic operations (slash commands)
- Domain expertise (agents)

**Token Budget:** Metadata only until activated

**Lock-In Mitigation:** Core knowledge stays in docs/ (Layer 3), automation (Layer 4) is thin wrappers

---

## Anti-Patterns to Avoid

### ❌ Documentation Debt

**Don't:**
- Leave outdated information "for historical reference"
- Create placeholder docs with TODO sections
- Duplicate information "just in case"
- Keep planning documents after implementation

**Do:**
- Delete outdated content immediately
- Write complete sections or don't write them
- Create cross-references instead of duplication
- Archive or delete planning docs after completion

### ❌ Verbose Explanations

**Don't:**
- Explain every detail of how third-party tools work
- Include multiple examples of the same concept
- Write tutorials for basic technology usage
- Document every possible scenario

**Do:**
- Explain project-specific patterns and decisions
- Include one clear example per concept
- Link to external tutorials for general topics
- Focus on common scenarios and edge cases

### ❌ Disconnected Documentation

**Don't:**
- Create standalone docs without cross-references
- Update code without updating documentation
- Move files without updating references
- Split documentation without updating navigation

**Do:**
- Link related documentation bidirectionally
- Update docs in same commit as code changes
- Update all references when moving files
- Create index/TOC when splitting files

---

## Validation Commands

### Documentation Sync Check

**Command:** `/docs/sync-check` (project-specific implementation)

**Purpose:** Detect documentation drift from code changes

**Checks:**
1. Recent commits (last 30 days) for code changes without doc updates
2. API endpoints without documentation
3. Database models without specs
4. Skills/commands referencing moved/deleted files
5. Broken cross-references

**Output:** Sync status report with gaps and recommendations

### Standards Enforcement

**Command:** `/docs/enforce-standards` (project-specific implementation)

**Purpose:** Validate documentation against standards

**Checks:**
1. File sizes against guidelines
2. Cross-reference validity (no broken links)
3. Semantic similarity (detect duplicates >85%)
4. Progressive disclosure patterns
5. Table of contents for large files (>300 lines)

**Output:** Standards compliance report with violations

### Documentation Debt Detection

**Command:** `/docs/detect-debt` (project-specific implementation)

**Purpose:** Identify accumulated documentation debt

**Checks:**
1. Outdated documentation (not updated with active code)
2. Placeholder/TODO sections
3. Near-duplicate content (consolidation candidates)
4. Planning documents not archived
5. Missing documentation (features without docs)

**Output:** Prioritized debt remediation plan

---

## Automation Integration

### Skills and Commands

**Skills** (.claude/skills/):
- Auto-activate based on keywords
- Provide workflow automation
- Reference docs/ for core knowledge
- Minimal token cost until triggered

**Commands** (.claude/commands/):
- Atomic, single-purpose operations
- Deterministic execution
- Compose into larger workflows
- Reference canonical documentation

**Agents** (.claude/agents/):
- Complex, multi-step workflows
- Domain expertise and judgment
- Coordinate with skills/commands
- Use docs/ as knowledge base

### Documentation Sync Integration

**Skills should:**
1. Detect when documentation is stale
2. Remind to load appropriate references
3. Suggest documentation updates after code changes
4. Validate cross-references during workflows

**Example:** Backend developer skill
```markdown
After implementing new API endpoint:
1. Remind to update docs/api-reference.md
2. Check if specs/modules/ needs update
3. Suggest running /docs/sync-check
4. Validate integration test documentation
```

---

## Metrics and Monitoring

### Documentation Health Metrics

| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| **Sync Score** | 95%+ | 85-95% | <85% |
| **File Size Compliance** | 95%+ | 85-95% | <85% |
| **Broken Links** | 0 | 1-3 | >3 |
| **Duplicate Content** | 0 pairs >85% | 1-2 pairs | >2 pairs |
| **Documentation Debt** | <5 items | 5-10 items | >10 items |

### Dashboard Components

**Sync Status:**
- Code changes without documentation (last 30 days)
- Documentation changes without related updates
- API endpoints without docs
- Specs without corresponding guides

**Standards Compliance:**
- Files exceeding size guidelines
- Missing tables of contents
- Broken cross-references
- Progressive disclosure violations

**Redundancy Detection:**
- Semantic similarity analysis (>85% threshold)
- Near-duplicate content pairs
- Consolidation candidates

**Documentation Debt:**
- Outdated documentation (90+ days stale)
- Placeholder/TODO sections
- Planning documents not archived
- Missing documentation for features

---

## Implementation Guide

### For New Projects

1. **Set up directory structure** (docs/, specs/, .claude/)
2. **Create CLAUDE.md** (quick reference only)
3. **Create ENVIRONMENTS.md** (environment matrix)
4. **Set up documentation analysis tools** (semantic, sync check)
5. **Configure validation commands** (/docs/sync-check, /docs/enforce-standards)
6. **Establish sync obligations** (per matrix above)

### For Existing Projects

1. **Run semantic analysis** (identify duplicates)
2. **Consolidate redundant content** (merge >85% similar)
3. **Establish canonical locations** (single source of truth)
4. **Add validation commands** (sync-check, enforce-standards)
5. **Set up progressive disclosure** (split large files)
6. **Document sync obligations** (per matrix above)

### For Teams

1. **Document standards in project** (copy this template)
2. **Set up validation gates** (pre-commit, pre-push, pre-deploy)
3. **Train team on sync obligations** (what updates what)
4. **Establish review process** (documentation changes require review)
5. **Monitor health metrics** (weekly/monthly dashboards)
6. **Address debt regularly** (quarterly debt reduction sprints)

---

## References

- **Claude Code Documentation:** https://code.claude.com/docs
- **Progressive Disclosure Pattern:** Layer-based content loading
- **Token Efficiency Research:** Claude Code best practices (2024-2025)
- **Sync Obligation Matrix:** Derived from multi-project analysis

---

## Adaptation Guide

To adapt this framework for your project:

1. **Copy this template** to your project's documentation
2. **Customize directory structure** (adjust to your tech stack)
3. **Define canonical locations** (where does each type of info live?)
4. **Implement validation commands** (project-specific tooling)
5. **Establish sync obligations** (what updates require doc changes?)
6. **Set up health monitoring** (metrics dashboard)

This framework is intentionally project-agnostic. Customize the specifics while maintaining the core principles of sync obligations, progressive disclosure, and single source of truth.
