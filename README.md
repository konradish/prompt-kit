# Prompt Kit

Lightweight library of reusable LLM-ready documents and Claude Code configuration. Every Markdown file is meant to be copied, tweaked, and pasted directly into your chat interface when you need a structured response fast.

## What's inside

- `docs/` – short templates that capture the shape of common workflows (kickoffs, debugging, outlining, writing style, diagramming, Claude Code architecture patterns)
- `architectures/` – longer reference documents for complex system design and multi-step projects
- `claude-config/` – version-controlled Claude Code configuration (global instructions, slash commands, hooks)
  - `skills/htk-workflow/` – HTK (Hypothesis → Test Kernel) workflow for systematic experimentation
  - `commands/htk/` – HTK commands (/htk-focus, /htk-create, /htk-plan, /htk-run-next, /htk-summarize)
  - `commands/orchestration/` – Parallel execution utilities
- `.claude/` – project-specific Claude Code configuration for prompt-kit
  - `skills/docs-curator/` – Documentation management for this repository
  - `commands/docs/` – Doc validation and cross-reference checking
- `experiments/` – HTK experiment artifacts (hypotheses, results, learnings from testing new patterns)
- `LICENSE` – MIT license for sharing and remixing

Add new templates by dropping a Markdown file into `docs/` and referencing it from `docs/index.md`. For longer architecture guides, use `architectures/`.

## Usage

### Prompt Templates

1. Open the document that matches the job you're tackling.
2. Fill in the blanks or update the checklist for your exact scenario.
3. Paste the final version into your LLM prompt.

Keep contributions short, scannable, and free of tool-specific instructions so they work across models.

### Claude Code Configuration

To use this repo as your Claude Code configuration home:

```bash
# Run the setup script
./setup-claude-config.sh
```

This will:
- Backup your existing `~/.claude` directory to `~/.claude.backup.<timestamp>`
- Create a symlink: `~/.claude` → `claude-config/`
- Migrate all your existing runtime files to `claude-config/`

**Result:** Your entire `~/.claude` becomes a symlink to this repo's `claude-config/` directory.

**What gets version controlled:**
- `CLAUDE.md` - Global instructions for Claude Code
- `skills/` - Global skills (htk-workflow)
- `commands/` - Custom slash commands (analysis, core, htk, orchestration)
- `hooks/` - Event hooks (sanitized)
- `settings.json.template` - Settings template

**New capabilities:**
- **HTK Workflow** - Auto-activates on "hypothesis", "test if", "experiment" for systematic development
- **Parallel Execution** - Run multiple independent commands concurrently with `/parallel-exec`
- **Documentation Curation** - Project-specific skill for managing prompt-kit docs

**What's gitignored (stays local):**
- `settings.json` - Your personal settings
- `settings.local.json` - Local overrides
- Runtime files (history, todos, sessions, debug, etc.)
- Credentials (.credentials.json)

**Making changes:**

Since `~/.claude` is now a symlink, you can edit files either way:

```bash
# These are equivalent:
vim ~/.claude/CLAUDE.md
vim claude-config/CLAUDE.md

# Add a new slash command
vim claude-config/commands/my-command.md

# Commit version-controlled changes
git add claude-config/CLAUDE.md claude-config/commands/
git commit -m "Update Claude configuration"
git push
```

**Reverting:**

If you want to go back to your original setup:

```bash
rm ~/.claude
mv ~/.claude.backup.<timestamp> ~/.claude
```
