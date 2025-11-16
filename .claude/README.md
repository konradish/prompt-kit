# Project Claude Configuration

This directory contains **project-specific** Claude Code configuration for the prompt-kit repository.

## Distinction from Global Config

**Global config (`~/.claude` / `claude-config/`):**
- Universal preferences and tools
- HTK workflow (used across all projects)
- Generic utilities (`/scan-env`, `/search-code`)
- Personal development philosophy

**Project config (`.claude/`):**
- Specific to prompt-kit repository
- Documentation curation and validation
- Template management
- This repo's workflows and standards

## Structure

```
.claude/
├── CLAUDE.md                       # Project context (version controlled)
├── README.md                       # This file
├── settings.json                   # Project settings (version controlled, optional)
├── settings.local.json             # Personal overrides (gitignored)
├── skills/
│   └── docs-curator/              # Manage prompt-kit docs
│       └── SKILL.md
└── commands/
    └── docs/
        ├── validate-structure.md   # Check doc standards
        └── check-links.md          # Validate cross-references
```

## Version Control

**✅ Committed to git:**
- `CLAUDE.md` - Team-shared project context
- `skills/` - Shared skills for this project
- `commands/` - Shared commands for this project
- `README.md` - This documentation

**❌ NOT committed (gitignored):**
- `settings.local.json` - Personal overrides
- Any runtime files

## Usage

### For Team Members

When you clone this repository, you get:
1. **Global HTK workflow** - from `~/.claude/skills/htk-workflow/`
2. **Project documentation tools** - from `.claude/skills/docs-curator/`

The `docs-curator` skill auto-activates when you work on documentation.

### For Maintainers

**Adding a new project command:**
```bash
# Create command file
touch .claude/commands/docs/new-command.md

# Edit with command prompt
# Commit to git
git add .claude/commands/docs/new-command.md
git commit -m "Add /docs/new-command for X"
```

**Adding a new project skill:**
```bash
# Create skill directory
mkdir -p .claude/skills/new-skill

# Create SKILL.md
touch .claude/skills/new-skill/SKILL.md

# Optionally add REFERENCE.md for detailed patterns
touch .claude/skills/new-skill/REFERENCE.md

# Commit to git
git add .claude/skills/new-skill/
git commit -m "Add new-skill for Y"
```

## Skills

### docs-curator

**Purpose**: Maintain prompt-kit documentation library

**Auto-activates on:**
- "validate documentation"
- "check docs"
- "update index"
- "broken links"

**Capabilities:**
- Validate file sizes against progressive disclosure limits
- Check gerund naming convention
- Validate cross-references
- Update index.md
- Ensure template quality

**Delegates to:**
- `/docs/validate-structure` - Structure checks
- `/docs/check-links` - Link validation

## Commands

### /docs/validate-structure

Check all documentation against quality standards:
- File size limits (CLAUDE < 100, SKILL < 500, REFERENCE < 600)
- Naming conventions (gerund form)
- Required sections
- TODOs and placeholders

### /docs/check-links

Validate cross-references:
- Internal file links
- Section anchors
- Broken or outdated references
- Link map generation

## Integration with Global HTK

This project uses the global HTK workflow for testing documentation patterns:

**Example workflow:**
```
1. User: "Let's test if progressive disclosure improves token efficiency"
2. Global htk-workflow skill activates
3. Generates HTK for experiment
4. Creates experiments/progressive-disclosure/
5. Runs test, measures tokens
6. Commits result (PASS/FAIL)
7. Uses findings to update best practices docs
```

## Best Practices

### When to add to project .claude

**✅ Add here:**
- Workflows specific to prompt-kit
- Documentation validation for THIS repo
- Template management for THIS repo
- Commands referencing prompt-kit structure

**❌ Don't add here:**
- Generic utilities (use global)
- Personal preferences (use settings.local.json)
- Cross-project patterns (use global)

### Keeping Skills Lean

Follow progressive disclosure:
- SKILL.md: < 500 lines (core workflow)
- REFERENCE.md: < 600 lines (detailed patterns)
- Delegate to commands for execution
- Link to docs/ for examples

### Version Control Hygiene

Before committing:
- [ ] No personal paths or info
- [ ] Works for anyone who clones repo
- [ ] Tested that skill/command works
- [ ] README updated if new capability added

## Troubleshooting

### Skill not activating

**Check:**
1. Skill description has relevant keywords
2. You're in the prompt-kit directory
3. Global skills not overriding (more specific wins)

**Debug:**
```bash
# Verify skill file exists
ls .claude/skills/docs-curator/SKILL.md

# Check frontmatter is valid YAML
head -10 .claude/skills/docs-curator/SKILL.md
```

### Command not found

**Check:**
1. Command file exists: `.claude/commands/docs/command-name.md`
2. File has proper markdown structure
3. Running from repo root (Claude Code context)

### Settings not applying

**Check priority order:**
```
<project>/.claude/settings.local.json (highest priority, gitignored)
    ↓
<project>/.claude/settings.json (team settings, version controlled)
    ↓
~/.claude/settings.local.json (personal global)
    ↓
~/.claude/settings.json (global)
```

Most specific wins. Your `.claude/settings.local.json` overrides everything.

## Contributing

When adding new project-specific capabilities:

1. **Determine if project-specific** - Would this help other prompt-kit contributors?
2. **Create in appropriate location** - Skill vs command vs setting
3. **Follow conventions** - Gerund naming, progressive disclosure
4. **Test thoroughly** - Ensure works for fresh clone
5. **Document** - Update this README if significant addition
6. **Commit** - Version control for team benefit

## Questions?

- See `docs/claude-code-best-practices.md` for configuration guidance
- See `claude-config/README.md` for global config explanation
- See `docs/focus-htk.md` for HTK methodology
