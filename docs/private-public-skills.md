# Managing Public and Private Claude Code Configuration

How to share Claude Code skills and configuration publicly while keeping sensitive content private.

## The Problem

You want to:
- Share useful skills (orchestration patterns, workflow automation) publicly
- Keep infrastructure details (IPs, credentials, architecture) private
- Version control both public and private content
- Have Claude access everything seamlessly

## The Solution: Symlinked Private Repository

```
~/.claude/                              # Symlink to public repo
├── skills/
│   ├── hive/                           # Public skill
│   ├── session-management/             # Public skill
│   └── private/                        # Symlink to private repo (gitignored)
│       └── my-infra/                   # Private skill
├── commands/
│   └── private/                        # Symlink to private repo (gitignored)
├── .gitignore                          # Ignores private symlinks
└── CLAUDE.md                           # Public instructions

~/projects/claude-private/              # Private GitHub repo
├── skills/
│   └── my-infra/
│       └── SKILL.md                    # SSH creds, IPs, architecture
└── commands/
    └── personal/
```

## Setup Guide

### 1. Create Private Repository

```bash
mkdir -p ~/projects/claude-private/{skills,commands}
cd ~/projects/claude-private
git init
echo "# Claude Private Config" > README.md
```

### 2. Add Gitignore to Public Repo

In your public Claude config directory (e.g., `~/.claude/.gitignore`):

```gitignore
# Private content (symlinked from private repo)
skills/private
commands/private
CLAUDE-PRIVATE.md

# Runtime/cache files
.credentials.json
settings.json
settings.local.json
history.jsonl
stats-cache.json
statsig/
telemetry/
session-env/
shell-snapshots/
debug/
todos/
file-history/
plans/
local/
```

### 3. Create Symlinks

```bash
# From your public claude config directory
ln -s ~/projects/claude-private/skills skills/private
ln -s ~/projects/claude-private/commands commands/private
```

### 4. Create Private Skill

```bash
mkdir -p ~/projects/claude-private/skills/my-infra
```

Create `~/projects/claude-private/skills/my-infra/SKILL.md`:

```markdown
# My Infrastructure Skill

## Activation Triggers

Use when: "deploy", "server", "ssh", "production"

## Server Details

| Property | Value |
|----------|-------|
| IP | `1.2.3.4` |
| SSH User | `deploy` |
| SSH Key | `~/.ssh/my_key` |

## Deployment Commands

\`\`\`bash
ssh -i ~/.ssh/my_key deploy@1.2.3.4 "cd /app && docker compose up -d"
\`\`\`

## Common Issues

### Connection refused
Check if firewall allows port 22...
```

### 5. Push to GitHub

```bash
# Private repo
cd ~/projects/claude-private
gh repo create my-username/claude-private --private --source=. --push

# Public repo (if not already)
cd ~/projects/my-public-claude-config
git add .gitignore
git commit -m "Add gitignore for private content"
git push
```

## How It Works

1. **Claude loads skills from `~/.claude/skills/`**
2. **Symlink makes private content appear at `skills/private/`**
3. **Gitignore prevents private content from being committed to public repo**
4. **Private repo tracks sensitive content separately**

## Directory Structure Examples

### Public Skill (shareable)

```
skills/hive/
├── SKILL.md           # Orchestration patterns (no secrets)
├── worker-prompt.md   # Worker instructions (generic)
└── spawn.sh           # Spawn script (no hardcoded values)
```

### Private Skill (personal)

```
skills/private/my-infra/
└── SKILL.md           # Contains:
                       # - Server IPs
                       # - SSH credentials
                       # - Architecture diagrams
                       # - Deployment runbooks
```

## Activation Pattern

Skills activate on keyword triggers. Structure your private skill with clear triggers:

```markdown
## Activation Triggers

Use this skill when: "deploy", "hetzner", "cloudflare", "production", "ssh"
```

When you mention these words, Claude loads the skill and has access to your private infrastructure context.

## Best Practices

1. **Never hardcode secrets in public skills** - Use environment variables or reference private skills
2. **Keep private skills focused** - One skill per infrastructure concern
3. **Document activation triggers** - Make it clear when each skill applies
4. **Version control both repos** - Private content deserves version history too
5. **Use descriptive names** - `my-infra` not `private-stuff`

## Cloning on New Machines

```bash
# Clone both repos
git clone https://github.com/you/public-claude-config ~/.claude
git clone https://github.com/you/claude-private ~/projects/claude-private

# Recreate symlinks
ln -s ~/projects/claude-private/skills ~/.claude/skills/private
ln -s ~/projects/claude-private/commands ~/.claude/commands/private
```

## Security Notes

- Private repo should be set to **private** on GitHub
- SSH keys referenced in skills should have appropriate permissions
- Consider using environment variables for the most sensitive values
- The `.gitignore` pattern prevents accidental commits of private content

## Example Use Cases

### Infrastructure Context for Orchestrators

When running multi-agent patterns (like hive), the orchestrator needs infrastructure context without spawning workers just to read docs. Private skills provide this.

### Personal Deployment Runbooks

Document your specific deployment steps, server configurations, and troubleshooting guides in private skills.

### API Keys and Service Configurations

Keep service-specific configurations (API endpoints, authentication details) in private skills that activate when working with those services.
