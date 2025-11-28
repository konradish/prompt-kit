# Prompt-Kit Project Configuration

This repository maintains reusable LLM prompt templates, Claude Code workflows, and best practices documentation.

## Repository Purpose

**What**: Documentation library for prompt engineering and Claude Code organization patterns
**Who**: Engineers using Claude Code across different projects
**Value**: Reusable templates and proven patterns, reducing setup time from hours to minutes

## Structure

```
prompt-kit/
├── docs/                           # Prompt templates and guides
│   ├── index.md                   # Documentation index
│   ├── focus-htk.md               # HTK protocol (implemented globally)
│   ├── claude-code-best-practices.md  # Configuration guidance
│   └── *.md                       # Various templates
├── claude-config/                  # Symlink to ~/.claude (global config)
│   ├── skills/htk-workflow/       # HTK implementation (global)
│   └── commands/htk/              # HTK commands (global)
└── .claude/                       # Project-specific config (this directory)
    ├── skills/docs-curator/       # Manage prompt-kit docs
    └── commands/docs/             # Doc validation commands
```

## Development Workflow

### Using HTK Protocol

This project uses the HTK (Hypothesis → Test Kernel) methodology for testing new documentation patterns:

**Example:**
```
Goal: Validate new progressive disclosure template improves token efficiency

Hypothesis: If we create skill with SKILL.md + REFERENCE.md split,
context usage drops 40% as shown by token measurements

Test:
* Change: Create example skill with progressive disclosure
* Method: Compare token usage with/without REFERENCE.md loaded
* Rollback: rm -rf example-skill/

Verify:
* Metric: Token usage < 60% of baseline
* Evidence: experiments/progressive-disclosure/token-comparison.json
```

### Experiments Directory

Store HTK artifacts in `experiments/`:
```
experiments/
├── progressive-disclosure/
│   ├── hypothesis.md
│   ├── token-comparison.json
│   └── report.md
└── skill-vs-command/
    └── ...
```

### Documentation Standards

1. **Progressive Disclosure** (from best practices guide)
   - CLAUDE.md: < 200 lines
   - SKILL.md: < 500 lines
   - REFERENCE.md: < 600 lines

2. **Naming Conventions**
   - Use gerund form: `managing-databases`, not `manage-database`
   - Descriptive and scannable
   - Consistent across similar docs

3. **Cross-References**
   - Validate links before committing
   - Use `/docs/validate-structure` command
   - Keep index.md current

## Quality Gates

Before merging to main:
- [ ] Progressive disclosure limits met
- [ ] Cross-references validated
- [ ] index.md updated if new doc added
- [ ] Examples tested (if applicable)
- [ ] Gerund naming convention followed

## Integration with Global Config

**Global (`~/.claude` / `claude-config/`):**
- HTK workflow skill and commands
- Generic utilities (`/scan-env`, `/search-code`)
- Universal development preferences

**Project (`.claude/`):**
- Documentation curation for prompt-kit
- Template validation specific to this repo
- Commands for maintaining this documentation library

## Notes

- `claude-config/` is a symlink to `~/.claude` - DO NOT edit it from this repo
- Use global HTK skill for testing new patterns
- Keep main branch green - failed HTKs save patches only
- This project practices what it preaches (meta!)
