# Claude Code Configuration

This directory becomes your `~/.claude` directory via symlink when you run the setup script. All Claude Code configuration and runtime files live here, with sensitive/runtime data gitignored.

## Structure

```
claude-config/
├── CLAUDE.md                    # Global instructions for all projects
├── skills/                      # Global skills
│   └── htk-workflow/           # HTK (Hypothesis → Test Kernel) workflow
│       ├── SKILL.md            # Core HTK workflow (< 500 lines)
│       └── REFERENCE.md        # Detailed patterns (< 600 lines)
├── commands/                    # Custom slash commands
│   ├── analysis/               # Code analysis commands
│   ├── core/                   # Core utility commands
│   ├── documentation/          # Documentation commands
│   ├── evaluation/             # Evaluation and testing commands
│   ├── htk/                    # HTK workflow commands
│   │   ├── focus.md           # Generate FOCUS options
│   │   ├── create.md          # Create single HTK
│   │   ├── plan.md            # Build HTK pipeline
│   │   ├── run-next.md        # Execute next HTK
│   │   └── summarize.md       # Rollup and replan
│   ├── orchestration/         # Parallel execution commands
│   │   └── parallel-exec.md   # Run multiple tasks concurrently
│   └── workspace/              # Workspace management commands
├── hooks/                       # Event hooks
│   └── claude-tts-notify.py   # Example notification hook
├── settings.json.template       # Template for settings.json
└── README.md                    # This file
```

## Setup

From the repository root, run:

```bash
./setup-claude-config.sh
```

This creates a symlink `~/.claude` → `claude-config/`, making this directory your Claude Code home. Your existing `~/.claude` is backed up first, and runtime files are migrated automatically.

## Files Explained

### CLAUDE.md

Global instructions that Claude Code reads before every session. Use this for:
- Project-agnostic preferences (e.g., "use uv for Python")
- Development philosophy (TDD, progressive disclosure)
- Quality standards (file size limits)
- General coding standards

**Security note:** Don't include passwords, API keys, or personal paths. Use placeholders or examples.

### skills/

Global skills that work across ALL your projects. Currently includes:

**htk-workflow**: Hypothesis-driven development methodology
- Auto-activates on "hypothesis", "test if", "experiment" keywords
- Guides systematic testing with minimal changes
- Clear pass/fail criteria
- Git version hygiene (keep main branch green)
- See `skills/htk-workflow/SKILL.md` for details

### commands/

Custom slash commands organized by category. Each `.md` file becomes a `/command-name` you can invoke in Claude Code.

**Creating a new command:**

```markdown
<!-- commands/my-category/my-command.md -->

# My Command Description

Instructions for Claude on what to do when this command is invoked.
Use clear, actionable language.
```

Then invoke with `/my-command` in any Claude Code session.

### hooks/

Event-driven scripts that run on Claude Code events (Stop, Notification, etc.). Configure hooks in `settings.json`.

**Example hook configuration (in settings.json):**

```json
{
  "hooks": {
    "Stop": [{
      "matcher": "",
      "hooks": [{
        "type": "command",
        "command": "~/.claude/hooks/claude-tts-notify.py"
      }]
    }]
  }
}
```

### settings.json.template

Template for Claude Code settings. The setup script copies this to `~/.claude/settings.json` if you don't already have one.

**Note:** Actual `settings.json` is NOT version controlled to preserve local preferences and permissions.

## What's NOT Version Controlled

These directories/files remain local in `~/.claude`:

- `debug/` - Debug logs
- `file-history/` - File edit history
- `history.jsonl` - Session history
- `projects/` - Per-project data
- `session-env/` - Session environment snapshots
- `shell-snapshots/` - Shell state snapshots
- `todos/` - Todo list state
- `statsig/` - Analytics data
- `local/` - Local data
- `config/` - Local config
- `.credentials.json` - API credentials
- `settings.json` - Personal settings
- `settings.local.json` - Local setting overrides

See `.gitignore` in the repository root for the full list.

## Usage Tips

### Global vs Project Instructions

- **CLAUDE.md (Global)**: Use for universal preferences that apply everywhere
- **Project CLAUDE.md**: Use for project-specific context (located in project root, not this directory)

Claude Code reads both, with project-level instructions taking precedence.

### Sanitizing Before Committing

Before committing changes, ensure you haven't included:
- ✗ API keys, passwords, tokens
- ✗ Personal file paths (like `/Users/yourname/specific-project`)
- ✗ Internal URLs or server addresses
- ✗ PII (emails, names, etc.)

Use placeholders instead:
- ✓ `http://localhost:4000` or `http://your-server:port`
- ✓ `/path/to/project` or `$PROJECT_DIR`
- ✓ `your-email@example.com`

### Sharing Configurations

This repo can be cloned by others. Structure your files so they work for anyone:

```markdown
<!-- Good: Generic and portable -->
## Python Setup
- Use `uv` for package management
- Run tests with `pytest`

<!-- Bad: Personal and not portable -->
## Python Setup
- My venv is at /Users/john/projects/myproject/.venv
- API key: sk-abc123xyz
```

## Contributing

When adding new commands or configurations:

1. Use descriptive names and organize by category
2. Document what the command/config does
3. Test that it works after setup
4. Ensure no sensitive data is included
5. Update this README if adding new categories

## Troubleshooting

**Symlink not working?**

Check that the symlink was created:
```bash
ls -ld ~/.claude
```

You should see:
```
lrwxrwxrwx ~/.claude -> /path/to/prompt-kit/claude-config
```

**Changes not reflected?**

Since `~/.claude` is a symlink to this directory, changes are immediate. No restart needed.

**Want to revert?**

Your original `~/.claude` was backed up to `~/.claude.backup.<timestamp>`. To restore:

```bash
rm -rf ~/.claude
mv ~/.claude.backup.<timestamp> ~/.claude
```
