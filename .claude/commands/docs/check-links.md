# Check Documentation Cross-References

Validate all internal links in prompt-kit documentation: **$ARGUMENTS**

## Execution

### 1. Extract All Links

Scan markdown files for link patterns:

```bash
# Find all markdown links: [text](path)
grep -rEo '\[([^\]]+)\]\(([^)]+)\)' docs/*.md
```

Parse into:
- Source file
- Link text
- Target path
- Anchor (if present)

### 2. Validate File Targets

For each link, check target exists:

```bash
# Check if file exists
for link in $links; do
  # Extract path (handle ../relative and ./current)
  target=$(echo "$link" | sed -E 's/.*\(([^#)]+).*/\1/')

  # Resolve relative paths
  resolved_path=$(realpath --relative-to=docs/ "docs/$target" 2>/dev/null)

  if [ ! -f "$resolved_path" ]; then
    echo "❌ Broken link: $link in $source_file"
  fi
done
```

### 3. Validate Anchors

For links with `#section`, verify anchor exists:

```bash
# Extract anchors from target file
# Markdown headers become anchors: ## Section Title → #section-title

for link_with_anchor in $anchored_links; do
  target_file=$(echo "$link_with_anchor" | sed 's/#.*//')
  anchor=$(echo "$link_with_anchor" | sed 's/.*#//')

  # Extract headers from target file
  headers=$(grep -E '^#{1,6} ' "$target_file" | \
            sed -E 's/^#{1,6} //' | \
            tr '[:upper:]' '[:lower:]' | \
            tr ' ' '-')

  if ! echo "$headers" | grep -q "^$anchor$"; then
    echo "❌ Anchor not found: #$anchor in $target_file"
  fi
done
```

### 4. Categorize Links

**Internal links:**
- `./file.md` - Same directory
- `../file.md` - Parent directory
- Full path from repo root

**External links:**
- `http://` or `https://` - Web URLs
- Skip validation (external resources)

### 5. Output Report

```
# CROSS-REFERENCE VALIDATION

Scanned: <n> files
Total links: <count>
Internal: <count>
External: <count> (not validated)

## Link Health

✅ Valid: <count> internal links
❌ Broken: <count> internal links
⚠️ Suspicious: <count> links

## Broken Links

### File: <source>
Line: <line number>
Link: [<text>](<path>)
Issue: <file not found | anchor not found>
Suggestion: <possible fix>

[Repeat for each broken link]

## Suspicious Links

### File: <source>
Link: [<text>](<path>)
Warning: <case mismatch | unusual pattern>
Verify: <manual check needed>

## Link Map (Optional)

<source> → <target> (✅ valid)
<source> → <target> (❌ broken)

## Summary

Status: <✅ All valid | ❌ <n> broken>
Fix rate: <n> fixes needed

Recommendations:
1. Fix broken file references
2. Update renamed section anchors
3. Remove links to deleted files
```

## Examples

### Example Output

```
# CROSS-REFERENCE VALIDATION

Scanned: 16 files
Total links: 52
Internal: 45
External: 7 (not validated)

## Link Health

✅ Valid: 42 internal links
❌ Broken: 3 internal links
⚠️ Suspicious: 0 links

## Broken Links

### File: docs/claude-code-features.md
Line: 78
Link: [agent pattern](./agents-guide.md)
Issue: File not found
Suggestion: Did you mean ./agent-delegation-pattern.md?

### File: docs/focus-htk.md
Line: 134
Link: [documentation governance](./docs-governance.md)
Issue: File not found
Suggestion: Should be ./documentation-governance.md

### File: docs/best-practices.md
Line: 23
Link: [skills section](#skills-vs-agents)
Issue: Anchor not found
Suggestion: Section may be renamed. Current headers in file:
  - #skills-vs-agents-decision-framework ← likely match
  - #skill-authoring-guidelines
  - #agent-design-patterns

## Link Map

docs/index.md → docs/focus-htk.md (✅)
docs/index.md → docs/claude-code-best-practices.md (✅)
docs/claude-code-features.md → docs/agent-delegation-pattern.md (❌ wrong filename)
docs/focus-htk.md → docs/documentation-governance.md (❌ wrong filename)
docs/best-practices.md → #skills-vs-agents (❌ wrong anchor)
...

## Summary

Status: ❌ 3 broken links
Fix rate: 3 fixes needed (< 5 minutes)

Recommendations:
1. Fix 2 file reference typos (wrong filenames)
2. Update 1 anchor reference (section renamed)
3. Consider adding link validation to pre-commit hook
```

## Advanced Checks

### Check for Link Rot

Identify links to files recently deleted:

```bash
# Check git history for deleted files
git log --diff-filter=D --summary | grep delete
```

Compare with current link targets.

### Detect Circular References

Track document dependency graph:

```
docs/A.md → docs/B.md
docs/B.md → docs/C.md
docs/C.md → docs/A.md  ← circular!
```

Report cycles if found (usually not an issue for documentation, but good to know).

### External Link Validation (Optional)

If `$ARGUMENTS` includes `--check-external`:

```bash
# Test HTTP links (careful: rate limiting)
curl --head --max-time 5 "$external_url"
```

Only for small docs sets to avoid rate limiting.

## Integration

Called by:
- `docs-curator` skill for cross-reference validation
- User directly via `/docs/check-links`
- Pre-commit hook (optional)
- CI/CD quality gate

## Performance

**Fast mode (default):**
- File existence checks only
- No external links
- < 1 second for 50 docs

**Thorough mode (`$ARGUMENTS: --thorough`):**
- Anchor validation
- Link map generation
- Circular reference detection
- 2-5 seconds for 50 docs

## Exit Codes

- `0`: All links valid
- `1`: Broken links found
- `2`: Critical errors (malformed links)
