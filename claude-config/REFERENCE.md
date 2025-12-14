# Claude Code Global Reference

Extended documentation for tools and integrations. See CLAUDE.md for core principles.

---

## Image Generation (Nano Banana Pro)

Generate images via `nanogen` wrapper using Gemini 3 Pro Image.

```bash
nanogen "A technical architecture diagram showing microservices" diagram.png
nanogen "Logo for a startup called CloudKitchen" logo.png
echo "detailed prompt" | nanogen - output.png
```

**Best for:** Technical diagrams, architecture visualizations, documentation illustrations, flowcharts.

**Tips:** Be specific about style ("clean vector, blue boxes on white"), mention text labels explicitly, describe layout for complex diagrams.

---

## Issue Tracking with Beads

**Trigger phrases:** "track issue", "create bug", "beads", "bd"

Beads is a git-backed issue tracker designed for AI agents. Issues stored in `.beads/` directory, versioned with git.

### Installation
```bash
npm install -g @beads/bd
bd init  # Initialize in project
bd hooks install  # Set up git hooks
```

### Essential Commands
```bash
bd list                    # List all issues
bd create "title"          # Create new issue
bd create "title" --body "description"  # With description
bd show <id>               # Show issue details
bd close <id>              # Close an issue
bd ready                   # Show issues ready to work on (no blockers)
bd dep tree <id>           # View dependency tree
bd search "query"          # Search issues
```

### Workflow Integration
- **When finding bugs:** `bd create "Bug description" --body "Details..."`
- **When starting work:** `bd update <id> --status in-progress`
- **When blocked:** `bd dep add <id> --blocks <other-id>`
- **When done:** `bd close <id>`

### Key Features
- **Dependency tracking:** `bd dep add <id> --blocks <other-id>`
- **JSON output for scripting:** `bd list --json`
- **Priority levels:** P0 (critical) to P4 (low)
- **Labels:** `bd label add <id> bug` or `bd label add <id> feature`

**Note:** Beads is local/git-backed, not GitHub Issues. Issues sync via git push/pull.

---

## Windows Chrome Automation (WSL2)

**Trigger phrases:** "win-chrome", "chrome-cdp", "browser automation", "puppeteer windows"

Browser automation from WSL2 via Chrome DevTools Protocol. Project: `C:\projects\prompt-kit\chrome-automation`

### Quick Start Pattern
```bash
# 1. Launch Chrome with OAuth profile (keeps cookies/sessions)
powershell.exe -Command "cd C:\projects\prompt-kit\chrome-automation; node scripts/chrome-launcher.mjs --profile=schoolbrain 'https://initial-url.com'"

# 2. Navigate & screenshot (PREFERRED - combines nav + screenshot)
powershell.exe -Command "cd C:\projects\prompt-kit\chrome-automation; node scripts/multi-tab.mjs --action=parallel-screenshots --urls='https://url1.com,https://url2.com'"

# 3. View screenshot from WSL
Read /mnt/c/projects/prompt-kit/chrome-automation/output/screenshot-0-*.png

# 4. Cleanup when done
powershell.exe -Command "cd C:\projects\prompt-kit\chrome-automation; node scripts/chrome-kill.mjs --profile=schoolbrain"
```

### For Page Interactions (Clicks, Forms)
Create a custom script in `scripts/` - escaping issues make inline eval unreliable:
```javascript
// scripts/custom-action.mjs
import puppeteer from 'puppeteer-core';
import fs from 'fs';
const STATE_FILE = '../.chrome-instances.json';

const instances = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
const port = Object.values(instances)[0]?.port;
const response = await fetch(`http://localhost:${port}/json/version`);
const { webSocketDebuggerUrl } = await response.json();

const browser = await puppeteer.connect({ browserWSEndpoint: webSocketDebuggerUrl });
const pages = await browser.pages();
const page = pages.find(p => p.url().includes('target-pattern'));

await page.click('button');  // or page.type(), page.waitForSelector(), etc.
await page.screenshot({ path: '../output/result.png' });
await browser.disconnect();
```
Then run: `powershell.exe -Command "cd C:\projects\prompt-kit\chrome-automation; node scripts/custom-action.mjs"`

### Profiles
| Profile | Description |
|---------|-------------|
| `schoolbrain` | Google OAuth for SchoolBrain testing |
| `default` | Clean browser |

### Gotchas
- `list-tabs` returns empty immediately after launch - use `parallel-screenshots` to navigate first
- `--action=eval` has PowerShell escaping issues - use custom scripts for interactions
- Screenshots save to `output/screenshot-{index}-{timestamp}.png`
- State file `.chrome-instances.json` auto-tracks running instances

---

## Project-Specific Configuration Examples

### LiteLLM Server Configuration

```markdown
Self-hosted LiteLLM server at `http://localhost:4000`

**Available Models via LiteLLM:**
- **Local Ollama**: qwen2.5vl-7b, qwen3-30b-a3b
- **Anthropic**: claude-opus-4, claude-sonnet-4
- **Google**: gemini-2.5-flash, gemini-2.5-pro

**Usage:**
from litellm import completion
response = completion(model="gemini-2.5-pro", messages=[...], api_base="http://localhost:4000")

**Stack Management:**
- Start: `cd /path/to/project && docker compose up -d`
- Stop: `docker compose down`
- Logs: `docker compose logs -f litellm`
```

### Deployment Workflows

```markdown
**Deploy Methods:**

1. **GitHub Actions (Recommended):**
   gh workflow run deploy.yml
   gh run watch  # Monitor deployment

2. **Interactive Terminal:**
   npx wrangler deploy
```
