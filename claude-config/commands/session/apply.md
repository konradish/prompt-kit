---
description: Extract and apply .claude improvements from recent park documents
---

You are about to analyze recent park documents and apply accumulated `.claude` improvement suggestions to skills, commands, and documentation.

## Pre-Flight: Check Overdue Action Items

**CRITICAL: Always check for overdue items FIRST**

1. Read `.claude-sessions/action-items.yaml` if it exists
2. Find items where `status: pending` and `due < today`
3. Report overdue items prominently at TOP of output:

```markdown
## ⚠️ OVERDUE ACTION ITEMS

| ID | Description | Due | Overdue By |
|----|-------------|-----|------------|
| ai-2025-11-15-001 | Add OAuth skill | 2025-11-22 | 4 days |
| ai-2025-11-18-002 | Update CLAUDE.md | 2025-11-25 | 1 day |

**Recommendation:** Address these before creating new items.
```

## Pre-Flight: Discover Project Structure

**CRITICAL: Understand where things should go BEFORE extracting improvements**

### 1. Check CLAUDE.md Size

```bash
wc -l CLAUDE.md
```

| Lines | Status | Action |
|-------|--------|--------|
| < 150 | 🟢 OK | Can add one-liner rules if appropriate |
| 150-200 | 🟡 Warning | Prefer REFERENCE.md for new content |
| > 200 | 🔴 Overflow | **REFUSE** to add to CLAUDE.md, route all to REFERENCE.md |

**If CLAUDE.md > 200 lines:**
```markdown
⚠️ CLAUDE.md OVERFLOW (X lines > 200 limit)

All improvements will be routed to appropriate REFERENCE.md files.
Consider refactoring CLAUDE.md - move detailed sections to skills/.
```

### 2. Discover Existing Skills

```bash
ls -la .claude/skills/
```

Build a routing table from existing skills:

| Skill | REFERENCE.md Exists | Topics |
|-------|---------------------|--------|
| infrastructure | ✓ | tunnels, servers, networking |
| troubleshooting | ✓ | debugging, logs, errors |
| database-schema-manager | ✓ | migrations, models |
| ai-integration | ✓ | prompts, models, APIs |

**Use this table to route improvements to correct REFERENCE.md files.**

### 3. Discover Existing Commands

```bash
ls -la .claude/commands/*/
```

Check if suggested command already exists or fits in existing category.

## Analysis Phase

1. **Read Recent Park Documents**
   - Check `.claude-sessions/` for park documents from last 7 days
   - Extract all `.claude Improvements` sections
   - **Extract all `Project Enhancements` sections** (tech debt, features, refactoring)
   - Group suggestions by type: skills, commands, CLAUDE.md, REFERENCE.md, **github-issues**

2. **Identify Patterns**
   - Count repeated suggestions (e.g., "forgot X 3 times")
   - Prioritize high-frequency pain points
   - Note blocking issues vs. nice-to-haves

3. **Assess Impact & Assign Priority**
   - **P0 (Critical)**: Security issues, data loss, blocking bugs → SLO: 7 days
   - **P1 (High)**: Repeated 3+ times, significant efficiency gains → SLO: 14 days
   - **P2 (Medium)**: Nice-to-haves, minor improvements → SLO: 30 days

## Action Item Tracking

### Create/Update action-items.yaml

For each `.claude Improvement` found, create an action item entry:

```yaml
# .claude-sessions/action-items.yaml
version: 1
items:
  - id: ai-YYYY-MM-DD-NNN        # Format: ai-{date}-{sequence}
    description: string          # From park doc improvement
    source: string               # Park doc filename
    priority: P0|P1|P2           # Based on impact assessment
    category: skill|command|claude-md|reference-md|github-issue|tech-debt|feature|refactor|other
    slo_days: 7|14|30            # Based on priority
    created: YYYY-MM-DD          # Today's date
    due: YYYY-MM-DD              # created + slo_days
    status: pending              # Initial status
    github_issue: null           # GitHub issue URL if created
    files_affected: []           # For code-level items
```

### Deduplication Rules

Before creating new items:
1. Check if similar item already exists (fuzzy match on description)
2. If exists and pending → Increment priority if mentioned again
3. If exists and completed → Skip (already done)
4. If exists and deferred → Note in report, don't re-create

### Priority Escalation

If same improvement appears in multiple park docs:
- 2 mentions → P2 becomes P1
- 3+ mentions → P1 becomes P0
- Add note: `Escalated: mentioned in X sessions`

## Routing Decision Tree

**For EACH improvement extracted, follow this decision tree:**

```
Is it detailed technical reference?
(configs, IDs, step-by-step debugging, specific values)
    │
    ├─ YES → Route to skills/[domain]/REFERENCE.md
    │        Match domain by keywords:
    │        - tunnel, cloudflare, server, deploy → infrastructure
    │        - debug, error, log, trace → troubleshooting
    │        - database, migration, model, schema → database-schema-manager
    │        - AI, prompt, gemini, LLM → ai-integration
    │        - frontend, react, component → frontend (or create)
    │
    └─ NO → Is it a repeating workflow (mentioned 3+ times)?
            │
            ├─ YES → Create new skill or command
            │
            └─ NO → Is it a universal one-liner rule?
                    │
                    ├─ YES → Is CLAUDE.md < 80 lines?
                    │        │
                    │        ├─ YES → Add to CLAUDE.md
                    │        └─ NO → Route to REFERENCE.md instead
                    │
                    └─ NO → Route to REFERENCE.md
```

### Routing Examples

| Park Doc Says | Wrong Route | Correct Route |
|---------------|-------------|---------------|
| "Add tunnel ID table" | CLAUDE.md | `skills/infrastructure/REFERENCE.md` |
| "Document auth flow tracing" | CLAUDE.md | `skills/troubleshooting/REFERENCE.md` |
| "Add DB deprecation pattern" | CLAUDE.md | `skills/database-schema-manager/REFERENCE.md` |
| "Always run make validate" | REFERENCE.md | CLAUDE.md (one-liner rule) |
| "Never use docker compose directly" | REFERENCE.md | CLAUDE.md (one-liner rule) |

## Application Strategy

### For Skills
- Create new skill if 3+ sessions needed it
- Update existing skill if pattern unclear
- **Add detailed content to REFERENCE.md, not SKILL.md**
- Location: `.claude/skills/[domain]/`

### For Commands
- Create new command if workflow repeated 2+ times
- Update existing command if incomplete
- Location: `.claude/commands/[category]/`

### For REFERENCE.md (Preferred for Details)
- **This is where detailed technical info belongs**
- Specific configs, IDs, values
- Step-by-step debugging procedures
- Domain-specific patterns and examples
- Keep under 600 lines per file

### For CLAUDE.md (One-Liners Only)
- **ONLY universal one-liner rules**
- "Always X" or "Never Y" statements
- Quick command references
- **NOT detailed procedures or reference tables**
- Keep under 100 lines - if over, REFUSE to add more

## Project Enhancement Processing

**CRITICAL: This is where code-level improvements from park documents get actioned.**

### 1. Extract Project Enhancements

From each park document's `## Project Enhancements` section, extract:

| Section | What to Extract | Action |
|---------|-----------------|--------|
| Tech Debt Discovered | Code smells, workarounds | Create GH issue with `tech-debt` label |
| Feature Ideas | New capabilities | Create GH issue with `enhancement` label |
| Refactoring Opportunities | Structural improvements | Create GH issue with `refactor` label |
| Testing Gaps | Missing coverage | Create GH issue with `testing` label |

### 2. GitHub Issue Creation

**For each item marked `→ GH ISSUE` or in Project Enhancements sections:**

```bash
# Create GitHub issue from park document insight
gh issue create \
  --title "[Type]: Brief description" \
  --body "$(cat <<'EOF'
## Context

From session: `YYYY-MM-DD-topic-compressed.md`

## Problem/Opportunity

[Description from park document]

## Suggested Approach

[Approach from park document, if provided]

## Files Affected

- `path/to/file.py`

## Priority

[P0/P1/P2] - [Rationale]

---
*Auto-generated from park document by `/session:apply`*
EOF
)" \
  --label "from-park-doc,[type-label]"
```

### 3. Issue Type → Label Mapping

| Park Doc Section | GitHub Label(s) |
|------------------|-----------------|
| Tech Debt Discovered | `tech-debt`, `code-quality` |
| Feature Ideas | `enhancement` |
| Refactoring Opportunities | `refactor` |
| Testing Gaps | `testing`, `test-coverage` |
| Code Smells | `tech-debt`, `code-smell` |
| Performance | `performance` |

### 4. Update action-items.yaml for Project Items

```yaml
- id: ai-YYYY-MM-DD-NNN
  description: "[Tech Debt] Refactor gemini_ai.py - class too large"
  source: 2025-12-01-gemini-structured-output-compressed.md
  priority: P1
  category: tech-debt           # Use specific category
  slo_days: 14
  created: 2025-12-01
  due: 2025-12-15
  status: pending
  github_issue: "https://github.com/org/repo/issues/123"  # Link to created issue
  files_affected:
    - backend/app/services/gemini_ai.py
```

### 5. Project Enhancement Decision Tree

```
Is this a code-level improvement (not documentation)?
    │
    ├─ YES → Does it involve code changes?
    │        │
    │        ├─ YES → Create GitHub Issue
    │        │        │
    │        │        ├─ Tech debt? → label: tech-debt
    │        │        ├─ New feature? → label: enhancement
    │        │        ├─ Refactor? → label: refactor
    │        │        └─ Testing? → label: testing
    │        │
    │        └─ NO (planning/research) → Add to action-items.yaml only
    │
    └─ NO → Follow .claude improvement routing (skills/commands/docs)
```

### 6. Linking Issues to Park Documents

When creating GitHub issues:
1. Always reference the source park document in the issue body
2. Include the "Files Affected" section for context
3. Add `from-park-doc` label to track origin
4. Update action-items.yaml with the issue URL

### 7. When NOT to Create GitHub Issues

Skip issue creation if:
- Item is too vague (no clear actionable scope)
- Item is already tracked in an existing issue
- Item is documentation-only (use `.claude` improvements instead)
- Item is a one-time task already completed

## Execution Workflow

1. **Scan Park Documents**
   ```bash
   # Find park documents from last 7 days
   find .claude-sessions/ -name "*-compressed.md" -mtime -7
   ```

2. **Extract Suggestions**
   - Read each park document
   - Collect all `.claude Improvements` items
   - Categorize by type and impact

3. **Update action-items.yaml**
   - Create new items for new suggestions
   - Deduplicate against existing items
   - Calculate due dates based on priority

4. **Apply Changes**
   - Start with high-impact, high-frequency items
   - Create/update files as needed
   - Test commands/skills if possible
   - Follow progressive disclosure (link vs. duplicate)

5. **Mark Applied Items**
   - Update status to `completed` in action-items.yaml
   - Set `completed_date` to today
   - Increment metrics counters

## Update Metrics

After processing, update `.claude-sessions/metrics.yaml`:

```yaml
# Increment these counters
application:
  action_items_completed: +N     # Items completed this run
  action_items_overdue: N        # Current overdue count
  skills_created: +N             # If skills created
  commands_created: +N           # If commands created
  claude_md_updates: +N          # If CLAUDE.md updated

# Add history entry
history:
  - date: YYYY-MM-DD
    event: applied
    details: "Processed N park docs, created M action items, completed K items"
```

## Validate Spec Sync (If Applicable)

1. **Scan park documents for "Spec Updates" section**
   - Extract boundary additions/modifications
   - Extract module spec updates

2. **Validate CSV sync:**
   - For each boundary mentioned in park docs, check if exists in BOUNDARY_INDEX.csv
   - Flag missing boundaries: "❌ Boundary '<name>' in park doc but missing from CSV"
   - Suggest command: `python specs/kernel/add-boundary.py --name <name> ...`

3. **Validate module spec coverage:**
   ```bash
   python specs/kernel/sync-spec-coverage.py --report
   ```

4. **Report spec sync status:**
   - ✅ All boundaries synced
   - ⚠️ Drift detected: [list boundaries]
   - ❌ Validation failed: [list errors]

## Report Summary

Generate comprehensive report:

```markdown
## Session Apply Report - YYYY-MM-DD

### ⚠️ Overdue Action Items (Address First!)
| ID | Description | Due | Overdue By | Priority |
|----|-------------|-----|------------|----------|
| ... | ... | ... | ... | ... |

### Park Documents Analyzed
- YYYY-MM-DD-[topic] (X improvements extracted)
- YYYY-MM-DD-[topic] (X improvements extracted)

### Action Items Summary
- **New items created:** N
- **Items completed:** M
- **Items pending:** K
- **Items overdue:** J

### Priority Breakdown
| Priority | Pending | Overdue | Completed |
|----------|---------|---------|-----------|
| P0 | X | Y | Z |
| P1 | X | Y | Z |
| P2 | X | Y | Z |

### Routing Decisions

#### Items Re-Routed Away from CLAUDE.md
| Original Target | Re-Routed To | Reason |
|-----------------|--------------|--------|
| CLAUDE.md | skills/infrastructure/REFERENCE.md | Detailed config (tunnel IDs) |
| CLAUDE.md | skills/troubleshooting/REFERENCE.md | CLAUDE.md overflow (234 lines) |

#### Items Applied to Correct Destinations

**Skills Created/Updated:**
- [skill-name]: [what changed]

**Commands Created/Updated:**
- [command-name]: [what changed]

**REFERENCE.md Updates (Detailed Info):**
- `skills/[domain]/REFERENCE.md`: [what added]

**CLAUDE.md Updates (One-Liners Only):**
- [section]: [one-line rule added] *(only if CLAUDE.md < 80 lines)*

### Project Enhancements Processed

#### GitHub Issues Created
| Issue | Type | Priority | Labels |
|-------|------|----------|--------|
| [#123: Issue title](url) | tech-debt | P1 | `tech-debt`, `from-park-doc` |
| [#124: Issue title](url) | feature | P2 | `enhancement`, `from-park-doc` |

#### Tracked for Future Work
*(Items added to action-items.yaml but not yet as GitHub issues)*

| Item | Category | Priority | Files Affected |
|------|----------|----------|----------------|
| [Description] | refactor | P2 | `path/to/file.py` |

### Patterns Detected
- [Pattern]: Occurred in X sessions → [Action taken]

### Deferred Items
- [Item]: [Why deferred] → Added to action-items.yaml as P2

### Recommendations

**Documentation Improvements:**
1. [Most impactful .claude change]
2. [Second priority]

**Project Enhancements:**
1. [Most impactful code-level improvement]
2. [Second priority]
3. [Third priority]

**Suggested Next Session Focus:**
Based on parked items, consider working on: [highest-priority actionable item]

### ⚠️ CLAUDE.md Health Check
*(Include if CLAUDE.md > 80 lines)*

**Current size:** X lines (limit: 100)
**Status:** 🔴 OVERFLOW / 🟡 WARNING / 🟢 OK

**If overflow, recommend:**
1. Move tunnel/infrastructure details → `skills/infrastructure/REFERENCE.md`
2. Move debugging patterns → `skills/troubleshooting/REFERENCE.md`
3. Move database patterns → `skills/database-schema-manager/REFERENCE.md`
4. Keep only universal one-liner rules in CLAUDE.md

### Metrics Update
- Sessions analyzed: N
- Completion rate: X% (completed / total)
- Overdue rate: Y% (overdue / pending)
```

## Clean Up

1. **Archive old park documents**
   ```bash
   # Move park docs > 30 days to archive
   find .claude-sessions/ -name "*-compressed.md" -mtime +30 -exec mv {} .claude-sessions/archive/ \;
   ```

2. **Ensure archive directory exists**
   ```bash
   mkdir -p .claude-sessions/archive/
   ```

## Success Criteria

### Documentation Improvements
- [ ] Overdue items reported prominently
- [ ] CLAUDE.md size checked BEFORE applying anything
- [ ] Existing skills discovered and used for routing
- [ ] Routing decision tree followed for each improvement
- [ ] Detailed content routed to REFERENCE.md, not CLAUDE.md
- [ ] All improvements tracked in action-items.yaml
- [ ] Priorities assigned correctly
- [ ] Due dates calculated based on SLOs
- [ ] Metrics updated accurately
- [ ] Re-routing decisions documented in report

### Project Enhancements
- [ ] `Project Enhancements` sections extracted from park docs
- [ ] Tech debt items identified and categorized
- [ ] GitHub issues created for actionable items (with user approval)
- [ ] Issues linked back to source park document
- [ ] action-items.yaml updated with `github_issue` URLs
- [ ] `from-park-doc` label used for traceability
- [ ] Files affected listed in issues for context
- [ ] Suggested next session focus provided

## Important Notes

- **Process BOTH `.claude` improvements AND project enhancements** - Don't skip code-level work
- **Ask before creating GitHub issues** - Get user approval for issue creation
- **Check CLAUDE.md size FIRST** - If > 200 lines, route everything to REFERENCE.md
- **Discover existing skills FIRST** - Don't create new when existing skill covers the domain
- **CLAUDE.md is for one-liners only** - "Always X", "Never Y", not detailed reference
- **REFERENCE.md is for details** - Configs, IDs, procedures, examples
- **Check overdue items FIRST** - Don't create new work while old work languishes
- **Don't apply everything blindly** - Use judgment on value
- **Prefer REFERENCE.md over CLAUDE.md** - When in doubt, route to skill's REFERENCE.md
- **Test before committing** - Verify commands/skills work
- **Document re-routing decisions** - Explain why item was routed away from original target
