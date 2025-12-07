# Chrome Automation (WSL2 → Windows)

Browser automation from WSL2 using Chrome's DevTools Protocol (CDP).

## Why This Exists

### The WSL2 Sound Problem

Chrome running inside WSL2 (Linux) has audio quality issues—crackling, latency, and unreliable playback. Windows Chrome handles audio natively through the host OS, providing smooth, low-latency sound.

This project allows **Claude Code (running in WSL2)** to control **Windows Chrome** for tasks requiring proper audio playback (music apps, video conferencing, audio testing).

### Alternative to MCP Server

Rather than running a persistent MCP (Model Context Protocol) server, this approach uses **direct command invocation** via PowerShell bridge:

| Approach | MCP Server | Direct Commands (this project) |
|----------|------------|-------------------------------|
| Architecture | Long-running daemon | On-demand scripts |
| State | Server maintains connection | State file + reconnect |
| Complexity | Server lifecycle management | Just call scripts |
| From WSL2 | Connect via network | PowerShell.exe bridge |
| Debugging | Check server logs | JSON output per command |

The direct command approach is simpler for automation from Claude Code—each tool call runs a script and returns JSON results.

## Quick Start

```powershell
# 1. Launch Chrome with debugging (Windows PowerShell)
cd C:\projects\prompt-kit\chrome-automation
npm run start -- --profile=schoolbrain

# 2. Run automation (from WSL2 via PowerShell bridge)
powershell.exe -Command "cd C:\projects\prompt-kit\chrome-automation; npm run multi -- --action=list-tabs"
```

## Project Structure

```
C:\projects\prompt-kit\chrome-automation\
├── package.json
├── .chrome-instances.json     # Auto-managed state file
├── scripts/
│   ├── chrome-launcher.mjs    # Launch Chrome with debug port
│   ├── chrome-kill.mjs        # Kill Chrome by profile/port/pid
│   ├── multi-tab.mjs          # Multi-tab parallel operations
│   └── run-automation.mjs     # General purpose script runner
├── profiles/
│   ├── default/               # Clean profile
│   └── schoolbrain-konra/     # Profile with Google login
└── output/                    # Screenshots and exports
```

## Profiles

| Profile | Description |
|---------|-------------|
| `default` | Clean browser profile |
| `schoolbrain` | Has Google OAuth login for SchoolBrain testing |

## Scripts

### Launch Chrome
```powershell
# Default profile on port 9222
npm run start

# SchoolBrain profile
npm run start -- --profile=schoolbrain

# Custom port
npm run start -- --port=9223 --profile=schoolbrain
```

### Multi-Tab Operations
```powershell
# List all tabs
npm run multi -- --action=list-tabs

# Screenshot multiple URLs in parallel
npm run multi -- --action=parallel-screenshots --urls="https://google.com,https://github.com"

# Close tabs matching pattern
npm run multi -- --action=close-tab --pattern="google"

# Run JS on matching tabs
npm run multi -- --action=eval --pattern="schoolbrain" --script="document.title"
```

### Kill Chrome
```powershell
# Kill by profile name
node scripts/chrome-kill.mjs --profile=schoolbrain

# Kill by debug port
node scripts/chrome-kill.mjs --port=9222

# Kill by process ID
node scripts/chrome-kill.mjs --pid=12345

# Kill all managed instances
node scripts/chrome-kill.mjs --all
```

### Custom Scripts
```powershell
# Run a custom script
npm run run -- path/to/script.mjs

# Inline code
npm run run -- --inline="await page.screenshot({path: 'C:\\projects\\chrome-automation\\output\\test.png'})"
```

## WSL2 Integration

From WSL2, use PowerShell bridge:

```bash
# Run any npm script
powershell.exe -Command "cd C:\projects\prompt-kit\chrome-automation; npm run multi -- --action=list-tabs"

# Or directly
powershell.exe -Command "cd C:\projects\prompt-kit\chrome-automation; node scripts/multi-tab.mjs --action=list-tabs"
```

## Multi-Threading / Parallelism

Chrome CDP supports multiple tabs in a single browser instance. Each tab operates independently:

```javascript
// Open 3 tabs in parallel
const urls = ['https://a.com', 'https://b.com', 'https://c.com'];
const pages = await Promise.all(urls.map(async url => {
  const page = await browser.newPage();
  await page.goto(url);
  return page;
}));

// Screenshot all in parallel
await Promise.all(pages.map((page, i) =>
  page.screenshot({ path: `output/page-${i}.png` })
));
```

Use `--action=parallel-screenshots` for built-in parallel support.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `CDP_PORT` | `9222` | Chrome debugging port |
| `CDP_HOST` | `localhost` | Chrome host |

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│ WSL2 (Linux)                                                    │
│                                                                 │
│  ┌─────────────┐    powershell.exe     ┌──────────────────────┐│
│  │ Claude Code │ ─────────────────────►│ scripts/*.mjs        ││
│  └─────────────┘                       │ (runs on Windows)    ││
│                                        └──────────┬───────────┘│
└───────────────────────────────────────────────────│────────────┘
                                                    │
                                         CDP (localhost:9222)
                                                    │
┌───────────────────────────────────────────────────▼────────────┐
│ Windows                                                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Chrome (--remote-debugging-port=9222)                    │  │
│  │   • Native audio via Windows audio stack                 │  │
│  │   • Profile with saved credentials (Google OAuth, etc.)  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### State Management

The `.chrome-instances.json` file tracks running Chrome instances:

```json
{
  "schoolbrain": {
    "pid": 12345,
    "port": 9222,
    "profile": "schoolbrain",
    "wsEndpoint": "ws://localhost:9222/devtools/browser/..."
  }
}
```

Scripts auto-discover the port from this state file—no need to track ports manually.

## Usage from Claude Code

In your `~/.claude/CLAUDE.md`, add commands like:

```markdown
## Windows Chrome Automation (WSL2)

### Commands
```bash
# Launch Chrome with profile
powershell.exe -Command "cd C:\projects\prompt-kit\chrome-automation; node scripts/chrome-launcher.mjs --profile=schoolbrain 'https://strudel.cc'"

# List tabs
powershell.exe -Command "cd C:\projects\prompt-kit\chrome-automation; node scripts/multi-tab.mjs --action=list-tabs"

# Kill by profile
powershell.exe -Command "cd C:\projects\prompt-kit\chrome-automation; node scripts/chrome-kill.mjs --profile=schoolbrain"
```
```

Claude Code can then run these as Bash commands, parsing the JSON output for structured results.

## Notes

- Only ONE Chrome instance per profile at a time
- Multiple ports = multiple Chrome instances (different profiles)
- WSL2 cannot directly connect to Windows localhost (use PowerShell bridge)
- Profile contains encrypted credentials (tied to Windows user)

## Use Cases

- **Music apps** (Strudel, Tone.js demos) - proper audio playback
- **Web apps with OAuth** - reuse logged-in Google/GitHub sessions
- **Screenshot automation** - visual regression testing
- **Multi-tab workflows** - parallel page interactions
