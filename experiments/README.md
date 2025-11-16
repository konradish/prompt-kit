# HTK Experiments Directory

This directory stores artifacts from HTK (Hypothesis → Test Kernel) experiments.

## Purpose

When using the HTK workflow (global skill in `~/.claude/skills/htk-workflow/`), experimental artifacts are saved here:
- Hypothesis documentation
- Test results and evidence
- Failed attempt patches
- Reports and learnings

## Structure

Each HTK gets its own directory:

```
experiments/
├── <htk-short-label>/
│   ├── hypothesis.md          # Original HTK structure
│   ├── report.md              # Findings and learnings
│   ├── attempt.patch          # Code changes (if FAIL)
│   ├── fixtures/              # Test data
│   │   ├── input.json
│   │   └── expected.json
│   └── trace/                 # Evidence
│       ├── benchmark.log
│       ├── screenshot.png
│       └── results.json
└── README.md                  # This file
```

## Example

### Successful HTK

```
experiments/progressive-disclosure/
├── hypothesis.md              # HTK: Test if split reduces tokens
├── report.md                  # Result: 42% token reduction
└── trace/
    ├── baseline-tokens.txt    # 1250 tokens
    └── optimized-tokens.txt   # 725 tokens
```

### Failed HTK

```
experiments/auto-linking/
├── hypothesis.md              # HTK: Test if auto-link detection works
├── attempt.patch              # Code changes that didn't work
├── report.md                  # Result: False positives too high
└── trace/
    └── test-results.json      # 35% false positive rate (threshold: 5%)
```

## Version Control

**✅ Committed:**
- All experiment directories
- Hypothesis documentation
- Reports and learnings
- Evidence and traces
- Patches (even failed ones)

**Why commit failed experiments?**
- Document what doesn't work
- Avoid repeating mistakes
- Share learnings with team
- Track evolution of understanding

## HTK Workflow Integration

### On PASS

```bash
# Code AND artifacts committed
git add src/ experiments/htk-label/
git commit -m "HTK:htk-label — PASS — <metric summary>

Updated:
- <code files>
- experiments/htk-label/report.md"
```

### On FAIL

```bash
# Save patch
git diff > experiments/htk-label/attempt.patch

# Commit artifacts only (revert code)
git add experiments/htk-label/
git commit -m "HTK:htk-label — FAIL — <metric summary>

Analysis: <brief finding>"

git reset --hard HEAD  # Revert code changes
```

## Naming Convention

**Directory names:**
- Use `<short-label>` from HTK
- Lowercase, kebab-case
- Descriptive (e.g., `redis-cache`, `progressive-disclosure`)

**File names:**
- `hypothesis.md` - The original HTK structure
- `report.md` - Findings, learnings, next steps
- `attempt.patch` - Code changes (if failed)
- `trace/` - All evidence files

## Searching Experiments

### Find all passed HTKs
```bash
git log --grep="HTK:.*PASS" --oneline
```

### Find experiments for specific topic
```bash
ls experiments/ | grep cache
# redis-cache/
# cdn-cache/
```

### View HTK history
```bash
git tag -l "htk/*"
# htk/redis-cache/20250116-v1/PASS
# htk/db-index/20250117-v1/FAIL
```

## Cleanup

**Don't delete experiments** unless:
- Completely superseded by newer experiment
- Proven irrelevant to project
- Very old (>1 year) and no historical value

**Archiving old experiments:**
```bash
# Move to archive if needed
mkdir -p experiments/archive/2024/
mv experiments/old-experiment/ experiments/archive/2024/
```

## Template

When creating new HTK experiment directory:

```bash
# Create structure
mkdir -p experiments/<label>/{fixtures,trace}

# Create hypothesis.md
cat > experiments/<label>/hypothesis.md << 'EOF'
# HTK: <label>

Goal: <one sentence>

Hypothesis: <if we do X, Y happens as shown by Z>

Test:
* Change: <the one change>
* Method: <where/how; minimal steps; timebox>
* Rollback: <exact step>

Verify:
* Metric: <metric + threshold>
* Evidence: experiments/<label>/trace/<file>

Decision:
* Pass → <next step>
* Fail → <diagnostic> → <alternative> → <rerun>

Why first: <≤2 sentences>
EOF

# Create report template
cat > experiments/<label>/report.md << 'EOF'
# HTK Report: <label>

## Outcome

Status: <PASS | FAIL>
Metric: <actual result vs threshold>
Date: <YYYY-MM-DD>

## Findings

<What was learned>

## Evidence

- trace/<file>: <description>

## Next Steps

<What to do based on result>
EOF
```

## Integration with Documentation

Experiments inform documentation updates:

**After PASS:**
- Update `docs/` with proven patterns
- Update `.claude/skills/` with new workflows
- Reference experiment in commit message

**After FAIL:**
- Document anti-pattern in REFERENCE.md
- Add to troubleshooting sections
- Share findings to prevent repetition

## Example Workflow

```
1. User: "Let's test if caching improves performance"
2. HTK skill creates: experiments/redis-cache/hypothesis.md
3. User runs experiment
4. Evidence saved to: experiments/redis-cache/trace/k6-results.json
5. On PASS:
   - Code committed
   - Report written: experiments/redis-cache/report.md
   - Docs updated: specs/caching.md
6. Git tag: htk/redis-cache/20250116-v1/PASS
```

## Questions?

- See `docs/focus-htk.md` for HTK methodology
- See `~/.claude/skills/htk-workflow/SKILL.md` for workflow details
- See `~/.claude/skills/htk-workflow/REFERENCE.md` for patterns and examples
