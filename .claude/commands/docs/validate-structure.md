# Validate Documentation Structure

Check all prompt-kit documentation against quality standards: **$ARGUMENTS**

## Execution

### 1. Scan Documentation Directory

```bash
# Find all markdown files
find docs/ -name "*.md" -type f
```

Count total documents and identify new files (modified in last 7 days).

### 2. Validate File Size Limits

For each document, check against progressive disclosure standards:

| Pattern | Limit | Files Matching |
|---------|-------|----------------|
| CLAUDE.md | 200 lines | */CLAUDE.md |
| SKILL.md | 500 lines | */SKILL.md |
| REFERENCE.md | 600 lines | */REFERENCE.md |
| Other templates | Reasonable (< 800) | *.md |

```bash
# Check line counts
for file in docs/*.md; do
  lines=$(wc -l < "$file")
  echo "$file: $lines lines"
done
```

Report violations with recommendations.

### 3. Validate Naming Conventions

Check files follow gerund form:

**✅ Valid patterns:**
- managing-*
- processing-*
- deploying-*
- configuring-*
- implementing-*

**❌ Invalid patterns:**
- manage-*
- process-*
- deploy-*
- configure-*
- implement-*

```bash
# Detect imperative forms
for file in docs/*.md; do
  basename=$(basename "$file" .md)
  if echo "$basename" | grep -qE '^(manage|process|deploy|configure|implement|create|build|setup)-'; then
    echo "⚠️ $file uses imperative form (should be gerund)"
  fi
done
```

### 4. Check Required Sections

Verify templates include essential sections:

**Minimum for guides:**
- Overview/Purpose
- Examples
- At least one concrete use case

**Minimum for templates:**
- Clear structure
- Usage instructions
- No TODOs or placeholders

```bash
# Check for TODO markers
grep -l "TODO\|TBD\|FIXME\|XXX" docs/*.md
```

### 5. Validate Frontmatter (if applicable)

For skills/agents, check YAML frontmatter:

```yaml
---
name: valid-name
description: Clear description with examples
---
```

### 6. Output Report

```
# DOCUMENTATION STRUCTURE VALIDATION

Scanned: <n> documents in docs/
Date: <timestamp>

## File Size Compliance

✅ Within limits: <n> files
⚠️ Exceeding limits: <n> files

Violations:
- <file>: <lines> lines (limit: <limit>)
  Recommendation: <suggestion>

## Naming Convention

✅ Gerund form: <n> files
⚠️ Imperative form: <n> files

Violations:
- <file>
  Suggestion: Rename to <gerund-form>

## Required Sections

✅ Complete: <n> files
⚠️ Missing sections: <n> files

Issues:
- <file>: Missing <section>

## Quality Issues

TODOs found: <n> files
- <file>: <count> TODOs

Placeholders: <n> files
- <file>: Contains placeholder text

## Summary

Status: <✅ All passing | ⚠️ Warnings | ❌ Action required>
Pass rate: <n>/<total> (<percentage>%)

Next steps:
1. <priority recommendation>
2. <next recommendation>
```

## Examples

### Example Output

```
# DOCUMENTATION STRUCTURE VALIDATION

Scanned: 16 documents in docs/
Date: 2025-11-16 14:30:00

## File Size Compliance

✅ Within limits: 14 files
⚠️ Exceeding limits: 2 files

Violations:
- docs/claude-code-best-practices.md: 877 lines (limit: 800 for general docs)
  Recommendation: Consider splitting into SKILL.md (< 500) + REFERENCE.md (< 600)
  OR justify as comprehensive reference doc

## Naming Convention

✅ Gerund form: 15 files
⚠️ Imperative form: 1 file

Violations:
- docs/debug-playbook.md
  Suggestion: Rename to docs/debugging-playbook.md

## Required Sections

✅ Complete: 14 files
⚠️ Missing sections: 2 files

Issues:
- docs/solution-outline.md: Missing examples section
- docs/project-kickoff.md: Missing troubleshooting section (optional for this doc type)

## Quality Issues

TODOs found: 0 files ✅

Placeholders: 1 file
- docs/knowledge-module-template.md: Contains "[Your content here]" (expected in template)

## Summary

Status: ⚠️ 3 warnings (not blocking)
Pass rate: 13/16 (81%)

Next steps:
1. Rename debug-playbook.md → debugging-playbook.md (5 min fix)
2. Add examples to solution-outline.md (15 min)
3. Consider splitting claude-code-best-practices.md (optional, low priority)
```

## Integration

Called by:
- `docs-curator` skill when validating documentation
- User directly via `/docs/validate-structure`
- Pre-commit hook (optional)
- CI/CD documentation quality gate

## Validation Focus

This command checks **structure and conventions**, not content quality:

✅ **Checks:**
- File sizes
- Naming patterns
- Section presence
- TODOs/placeholders

❌ **Does NOT check:**
- Content accuracy
- Writing quality
- Code example correctness
- Link validity (see `/docs/check-links`)

## Exit Codes

- `0`: All passing
- `1`: Warnings found (non-blocking)
- `2`: Critical issues (blocking)
