# WSL Chrome Bridge Plugin

Bridge WSL2 Claude to Windows Chrome for UI validation and browser automation using Claude in Chrome.

## The Problem

Claude Code running in WSL2 cannot directly use the "Claude in Chrome" feature because:
- Chrome runs on Windows, not in WSL
- The Chrome profile and extension are Windows-native
- WSL2 has a different filesystem and network namespace

## The Solution

This plugin provides patterns and commands to invoke a separate Claude instance on Windows via PowerShell, which can use Claude in Chrome for rich browser automation. Results are passed back to WSL Claude.

## Installation

```bash
# From your project directory
claude plugin add /mnt/c/projects/prompt-kit/plugins/wsl-chrome-bridge

# Or via git URL
claude plugin add https://github.com/konradish/prompt-kit/tree/main/plugins/wsl-chrome-bridge
```

## Prerequisites

1. **Claude Code installed on Windows** (accessible via `claude` in PowerShell)
2. **Claude Max subscription** (or API credits, but subscription is recommended)
3. **Chrome with Claude extension** installed and configured
4. **WSL2** with access to `powershell.exe`

### Important: API Key Configuration

If you have `ANTHROPIC_API_KEY` set on Windows, Claude will use API credits instead of your Max subscription. The plugin handles this by unsetting the variable before invocation.

To permanently use Max subscription on Windows:
```powershell
# In PowerShell (as admin)
[Environment]::SetEnvironmentVariable("ANTHROPIC_API_KEY", $null, "User")
```

## Usage

### Automatic Activation

The skill auto-activates on phrases like:
- "validate the UI"
- "check if the page shows..."
- "test the frontend"
- "verify the form works"
- "look at the page and tell me..."

### Manual Command

```bash
/validate-ui http://localhost:3000
```

### Direct Invocation Pattern

```bash
powershell.exe -Command "
\$env:ANTHROPIC_API_KEY = ''
claude -p 'YOUR_INSTRUCTIONS' --chrome --dangerously-skip-permissions"
```

## Key Concepts

### 1. Claude Max vs API Credits

Always unset `ANTHROPIC_API_KEY` to use subscription:
```powershell
$env:ANTHROPIC_API_KEY = ''
```

### 2. Path Mapping

| WSL Path | Windows Path |
|----------|--------------|
| `/mnt/c/projects/foo` | `C:\projects\foo` |
| `/mnt/d/data` | `D:\data` |

### 3. Required Flags

| Flag | Why |
|------|-----|
| `--chrome` | Enable Claude in Chrome |
| `--dangerously-skip-permissions` | Non-interactive execution |

### 4. Ask for Data, Not Screenshots

Instead of taking screenshots and parsing them, instruct Windows Claude to extract and return the data directly:

```bash
# BAD: Take screenshot, then I'll read it
# GOOD: Tell me what the page shows

powershell.exe -Command "
\$env:ANTHROPIC_API_KEY = ''
claude -p 'Go to http://localhost:3000 and tell me:
- Page title
- Navigation items
- Any error messages
- Is the login button visible?

Return as structured text.' --chrome --dangerously-skip-permissions"
```

## Examples

### Validate After Code Changes

```bash
# After modifying frontend code
powershell.exe -Command "
\$env:ANTHROPIC_API_KEY = ''
claude -p 'Check http://localhost:3000/dashboard:
1. Does it load without errors?
2. Is the new chart component visible?
3. Does the filter dropdown work?
Report PASS/FAIL for each.' --chrome --dangerously-skip-permissions"
```

### Test Form Submission

```bash
powershell.exe -Command "
\$env:ANTHROPIC_API_KEY = ''
claude -p 'On http://localhost:3000/contact:
1. Fill the name field with \"Test User\"
2. Fill the email field with \"test@example.com\"
3. Fill the message field with \"Hello\"
4. Click Submit
5. Tell me what happens - success, error, or redirect?' --chrome --dangerously-skip-permissions"
```

### Check Production Deployment

```bash
powershell.exe -Command "
\$env:ANTHROPIC_API_KEY = ''
claude -p 'Quick health check on https://myapp.com:
- Page loads
- No error banners
- Navigation works
- Footer visible
Return PASS or FAIL.' --chrome --dangerously-skip-permissions"
```

## Troubleshooting

### "Credit balance is too low"

The API key is being used. Ensure `$env:ANTHROPIC_API_KEY = ''` is in your command.

### "Navigation declined" / Domain Blocked

Claude in Chrome has domain restrictions. Try:
- Using your machine's LAN IP instead of `localhost`
- Using a `.workers.dev` or production domain

### Empty Output

Add `2>&1` to capture stderr:
```bash
powershell.exe -Command "..." 2>&1
```

### Timeout

Increase timeout for complex operations:
```bash
timeout 180 powershell.exe -Command "..."
```

## Comparison with Direct Chrome Automation

| Approach | Speed | Capabilities | Best For |
|----------|-------|--------------|----------|
| Claude in Chrome | 20-90s | Full understanding, complex flows | Validation, testing |
| Direct CDP scripts | 5-10s | Screenshot, basic nav | Quick captures |

## Files

```
wsl-chrome-bridge/
├── .claude-plugin/
│   └── plugin.json          # Plugin metadata
├── commands/
│   └── validate-ui.md       # /validate-ui command
├── skills/
│   └── ui-validation/
│       └── SKILL.md         # Auto-activating skill
└── README.md                # This file
```

## License

MIT
