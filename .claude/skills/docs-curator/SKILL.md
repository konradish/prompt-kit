# Documentation Curator Skill

---
name: docs-curator
description: Activates on "documentation", "docs", "template", "validate docs", "update index" keywords. Manages the prompt-kit documentation library with validation, cross-reference checking, and index maintenance.
allowed-tools: Read, Edit, Write, Glob, Grep
---

## Purpose

Maintain the prompt-kit documentation library with:
- Progressive disclosure enforcement
- Cross-reference validation
- Index synchronization
- Template quality standards

## Scope

**This skill is PROJECT-SPECIFIC to prompt-kit**. It manages THIS repository's documentation only.

For general documentation workflows across projects, use the global `/doc-workflow` command.

## Core Responsibilities

### 1. Documentation Validation

Check that docs meet standards:
- File size limits (< 200/500/600 lines based on type)
- Gerund naming convention
- Required sections present
- Examples included where appropriate

### 2. Cross-Reference Checking

Validate links:
- Internal references (`[text](./other-doc.md)`)
- Section anchors (`#heading`)
- Broken or outdated links
- Circular dependencies

### 3. Index Maintenance

Keep `docs/index.md` current:
- All docs listed
- Proper categorization
- Accurate descriptions
- NEW labels for recent additions

### 4. Template Quality

Ensure templates are:
- Complete and usable
- Include clear examples
- Follow established patterns
- No placeholders or TODOs

## Workflow

### When user requests doc validation:

1. **Scan docs directory**
   ```
   Glob: docs/*.md
   Count files, identify new/modified
   ```

2. **Validate each document**
   - Check line count against limits
   - Verify naming convention (gerund)
   - Ensure required sections exist
   - Look for broken links

3. **Cross-reference check**
   - Extract all `[text](link)` patterns
   - Verify target files exist
   - Check section anchors valid
   - Report broken links

4. **Index sync**
   - Compare docs/ files to index.md entries
   - Identify missing or outdated entries
   - Suggest index updates

5. **Report findings**
   ```
   # DOCUMENTATION AUDIT

   Status: <✅ Passing | ⚠️ Warnings | ❌ Issues>

   ## Files Scanned
   Total: <n> documents

   ## Issues Found
   - <file>: <issue description>

   ## Cross-References
   Valid: <n>
   Broken: <n> (list below)

   ## Index Status
   Current: <n> entries
   Missing: <list>
   Outdated: <list>

   ## Recommendations
   - <actionable suggestion>
   ```

### When user adds new document:

1. **Validate against standards**
   - Progressive disclosure limits
   - Naming convention
   - Required sections

2. **Update index.md**
   - Add to appropriate category
   - Include NEW label with date
   - Write concise description

3. **Check cross-references**
   - Ensure new doc links are valid
   - Update related docs if needed

### When user requests template creation:

1. **Select appropriate pattern**
   - Skill template vs agent template
   - Command template vs general doc
   - Include frontmatter if needed

2. **Generate from existing patterns**
   - Use proven structure from docs/
   - Include placeholder sections
   - Add usage examples

3. **Validate before delivery**
   - Complete and usable
   - Follows conventions
   - No contradictions with best practices

## Integration with Commands

Delegates to project-specific commands:

| Command | Purpose |
|---------|---------|
| `/docs/validate-structure` | Check all docs against standards |
| `/docs/check-links` | Validate cross-references |
| `/docs/update-index` | Sync index.md with docs/ |

## Progressive Disclosure Standards

Enforces limits from `docs/claude-code-best-practices.md`:

| File Type | Line Limit | Purpose |
|-----------|-----------|----------|
| CLAUDE.md | < 200 | Core project context |
| SKILL.md | < 500 | Skill workflow |
| REFERENCE.md | < 600 | Detailed reference |
| Templates | Variable | Based on type |

## Naming Convention Rules

**✅ Correct (gerund form):**
- managing-databases.md
- processing-pdfs.md
- deploying-applications.md

**❌ Incorrect (imperative):**
- manage-database.md
- process-pdf.md
- deploy-application.md

## Auto-Activation Triggers

This skill activates when user mentions:
- "validate documentation" or "check docs"
- "update index" or "sync index"
- "add new template" or "create doc"
- "broken links" or "cross-references"
- "documentation standards"

## Examples

### Example 1: Validate Documentation

```
User: "Check if our documentation meets standards"

Skill activates → scans docs/ directory

Report:
# DOCUMENTATION AUDIT

Status: ⚠️ 2 warnings found

## Files Scanned
Total: 16 documents

## Issues Found
- debugging-playbook.md: 105 lines (exceeds 100 line CLAUDE.md limit)
  Note: This is a playbook, not CLAUDE.md - limit may not apply
- template-validator.md: Uses imperative naming (should be template-validating.md)

## Cross-References
Valid: 23
Broken: 1
  - claude-code-features.md:45 → ./nonexistent.md

## Index Status
Current: 14 entries
Missing: 2 docs not in index
  - docs/mermaid-diagram-guide.md (NEW)
  - docs/boundary-decomposition-guide.md

## Recommendations
1. Rename template-validator.md → template-validating.md
2. Fix broken link in claude-code-features.md
3. Add missing entries to index.md with NEW labels
```

### Example 2: Add New Document

```
User: "I want to add a guide for managing CI/CD with Claude Code"

Skill activates → template creation mode

1. Confirms naming: "managing-cicd-claude-code.md" ✅ (gerund)
2. Generates template from pattern:

---
# Managing CI/CD with Claude Code

Guide for integrating Claude Code into continuous integration pipelines.

## Overview
[Purpose and scope]

## Prerequisites
[What you need]

## Workflow
[Step-by-step process]

## Examples
[Concrete examples]

## Troubleshooting
[Common issues]
---

3. Adds to index.md:
### DevOps
- **managing-cicd-claude-code.md** – **NEW 2025-11-16**: Integrate Claude Code into CI/CD pipelines with GitHub Actions, GitLab CI, and Jenkins. Covers automated testing, deployment validation, and rollback strategies.

4. Validates:
   ✅ Naming convention: gerund form
   ✅ Template complete
   ✅ Index updated
   ✅ No broken links
```

### Example 3: Cross-Reference Validation

```
User: "Are there any broken links in the docs?"

Skill activates → link checking mode

Scans all *.md files for [text](link) patterns

Results:
# CROSS-REFERENCE VALIDATION

Total links: 45
Valid: 42
Broken: 3

## Broken Links

1. docs/claude-code-features.md:78
   Link: [agent pattern](./agents-guide.md)
   Issue: File not found
   Suggestion: Should be ./agent-delegation-pattern.md?

2. docs/focus-htk.md:134
   Link: [documentation governance](./docs-governance.md)
   Issue: File not found
   Suggestion: Should be ./documentation-governance.md

3. docs/best-practices.md:23
   Link: [skills section](#skills-vs-agents)
   Issue: Anchor not found in file
   Suggestion: Section renamed? Now called #skills-vs-agents-decision-framework

## Recommendations
Fix these 3 broken links before next commit
```

## Quality Gates

Before marking doc work as complete:
- [ ] All files under progressive disclosure limits
- [ ] Gerund naming convention followed
- [ ] Cross-references validated (no broken links)
- [ ] Index.md updated and accurate
- [ ] Examples included where appropriate
- [ ] No TODOs or placeholders remain

## Limitations

**This skill can:**
- Validate documentation structure
- Check cross-references
- Update index.md
- Enforce standards

**This skill cannot:**
- Create complex multi-file architectures (use agent)
- Write actual content (user/agent responsibility)
- Validate code examples (read-only tools)
- Deploy documentation (no Bash access)

For complex documentation overhauls, escalate to user or suggest agent delegation.
