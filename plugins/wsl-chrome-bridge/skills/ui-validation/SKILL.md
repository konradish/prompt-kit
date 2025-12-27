---
name: ui-validation
description: Bridge WSL Claude to Windows Chrome for UI validation and browser automation
version: 1.0.0
triggers:
  - validate ui
  - check ui
  - test ui
  - verify ui
  - browser test
  - e2e test
  - screenshot
  - check the page
  - look at the page
  - see if the page
  - navigate to
  - click on
  - fill form
  - ui looks
  - ui shows
  - page shows
  - page displays
  - frontend test
  - visual test
  - check localhost
  - test localhost
---

# WSL Chrome Bridge - UI Validation

Bridge WSL2 Claude to Windows Chrome for rich browser automation and UI validation.

## When to Use

This skill activates when you need to:
- Validate UI after making frontend changes
- Test that a page displays correctly
- Interact with browser elements (click, fill forms)
- Extract text/data from web pages
- Run E2E validation without writing test code

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  WSL Claude     │────>│  PowerShell.exe  │────>│ Windows Claude  │
│  (Orchestrator) │     │  (Bridge)        │     │ (Claude Max)    │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                                        │
                                                        v
                                                 ┌─────────────┐
                                                 │ Claude in   │
                                                 │ Chrome      │
                                                 └─────────────┘
```

## Core Pattern: Invoke Windows Claude

**CRITICAL**: Always unset `ANTHROPIC_API_KEY` to use Claude Max subscription instead of API credits.

### Basic Invocation

```bash
powershell.exe -Command "
\$env:ANTHROPIC_API_KEY = ''
claude -p 'YOUR_INSTRUCTIONS_HERE' --chrome --dangerously-skip-permissions"
```

### Key Flags

| Flag | Purpose |
|------|---------|
| `--chrome` | Enable Claude in Chrome integration |
| `--dangerously-skip-permissions` | Required for non-interactive execution |
| `$env:ANTHROPIC_API_KEY = ''` | Force Claude Max subscription (not API credits) |

## Path Mapping: Linux to Windows

When passing paths between WSL and Windows Claude:

| Linux Path | Windows Path |
|------------|--------------|
| `/mnt/c/projects/foo` | `C:\projects\foo` |
| `/mnt/d/data/bar` | `D:\data\bar` |
| `/home/user/file` | N/A (WSL-only, not accessible from Windows) |

### Conversion Function

```bash
# Convert Linux path to Windows path
linux_to_windows() {
    echo "$1" | sed 's|^/mnt/\([a-z]\)/|\U\1:\\|' | sed 's|/|\\|g'
}

# Example
linux_to_windows "/mnt/c/projects/meal_tracker"
# Output: C:\projects\meal_tracker
```

## Validation Patterns

### Pattern 1: Extract Page Content (No Screenshot)

**Best for**: Verifying text, checking element presence, reading data.

```bash
powershell.exe -Command "
\$env:ANTHROPIC_API_KEY = ''
claude -p 'Navigate to http://localhost:3000 and tell me:
1. What is the page title?
2. Is there a login button visible?
3. List all navigation menu items
4. Any error messages displayed?

Return the answers as a structured list.' --chrome --dangerously-skip-permissions"
```

### Pattern 2: Form Interaction Validation

**Best for**: Testing form submissions, input validation, user flows.

```bash
powershell.exe -Command "
\$env:ANTHROPIC_API_KEY = ''
claude -p 'On http://localhost:3000/login:
1. Enter \"test@example.com\" in the email field
2. Enter \"password123\" in the password field
3. Click the Submit button
4. Report what happens - success message, error, or redirect?

Return the result.' --chrome --dangerously-skip-permissions"
```

### Pattern 3: Multi-Step Flow Validation

**Best for**: Testing complete user journeys.

```bash
powershell.exe -Command "
\$env:ANTHROPIC_API_KEY = ''
claude -p 'Test the recipe search flow on https://recipebrain-frontend-dev.konradish.workers.dev:
1. Click on Recipes in the navigation
2. Type \"pasta\" in the search box
3. Wait for results
4. Count how many recipes appear
5. Click \"View Details\" on the first result
6. Report the recipe name and ingredients list

Return a structured summary of each step.' --chrome --dangerously-skip-permissions"
```

### Pattern 4: Visual Regression Check

**Best for**: Detecting UI changes after code modifications.

```bash
powershell.exe -Command "
\$env:ANTHROPIC_API_KEY = ''
claude -p 'On http://localhost:3000/dashboard, describe:
1. Overall layout (header, sidebar, main content areas)
2. Color scheme being used
3. Any broken images or missing icons
4. Responsive issues (content overflow, misalignment)
5. Loading states or spinners visible

Focus on visual issues, not content.' --chrome --dangerously-skip-permissions"
```

### Pattern 5: Accessibility Quick Check

**Best for**: Basic accessibility validation.

```bash
powershell.exe -Command "
\$env:ANTHROPIC_API_KEY = ''
claude -p 'On http://localhost:3000, check accessibility:
1. Do all images have alt text?
2. Are form inputs properly labeled?
3. Is there sufficient color contrast?
4. Can you identify the heading hierarchy (h1, h2, etc)?
5. Are interactive elements keyboard-focusable?

Report issues found.' --chrome --dangerously-skip-permissions"
```

## Domain Restrictions

Claude in Chrome has domain restrictions. Common patterns:

| Domain Type | Access |
|-------------|--------|
| `*.localhost` | May require approval |
| `*.workers.dev` | Usually allowed |
| Production domains | Usually allowed |
| `localhost:PORT` | May require approval |

**Workaround**: If localhost is blocked, use the machine's LAN IP or hostname:
```bash
# Instead of http://localhost:3000
# Use http://192.168.1.100:3000 or http://hostname.local:3000
```

## Output Handling

### Get Structured Output

Ask Windows Claude to return structured data:

```bash
RESULT=$(powershell.exe -Command "
\$env:ANTHROPIC_API_KEY = ''
claude -p 'Check http://localhost:3000 and return JSON:
{
  \"title\": \"page title\",
  \"hasLoginButton\": true/false,
  \"errorMessages\": [\"list of errors\"],
  \"menuItems\": [\"list of nav items\"]
}' --chrome --dangerously-skip-permissions" 2>&1)

echo "$RESULT"
```

### Write Results to File

For complex results, have Windows Claude write to a shared path:

```bash
powershell.exe -Command "
\$env:ANTHROPIC_API_KEY = ''
claude -p 'Analyze http://localhost:3000 and write a detailed report to C:\projects\output\ui-report.md' --chrome --dangerously-skip-permissions"

# Then read from WSL
cat /mnt/c/projects/output/ui-report.md
```

## Timeouts and Error Handling

### Set Timeout

```bash
timeout 120 powershell.exe -Command "
\$env:ANTHROPIC_API_KEY = ''
claude -p '...' --chrome --dangerously-skip-permissions" 2>&1
```

### Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `Credit balance is too low` | Using API key instead of subscription | Ensure `$env:ANTHROPIC_API_KEY = ''` |
| `Navigation declined` | Domain not approved | Use approved domain or LAN IP |
| Empty output | Command timed out or permission prompt | Add `--dangerously-skip-permissions` |
| Exit code 137 | Process interrupted | Increase timeout |

## Integration with Development Workflow

### After Frontend Changes

```bash
# In your dev workflow after making changes
make frontend-build  # or npm run build

# Validate the changes
powershell.exe -Command "
\$env:ANTHROPIC_API_KEY = ''
claude -p 'Navigate to http://localhost:3000 after recent changes.
Verify:
1. Page loads without errors
2. New feature X is visible
3. No console errors
4. Layout is correct

Report pass/fail for each.' --chrome --dangerously-skip-permissions"
```

### CI/CD Validation Hook

```bash
#!/bin/bash
# validate-ui.sh - Run after deployment

URL="${1:-http://localhost:3000}"

RESULT=$(powershell.exe -Command "
\$env:ANTHROPIC_API_KEY = ''
claude -p 'Quick health check on $URL:
- Page loads successfully
- No error banners
- Main navigation works
- Footer is visible
Return: PASS or FAIL with reasons' --chrome --dangerously-skip-permissions" 2>&1)

if echo "$RESULT" | grep -q "PASS"; then
    echo "UI Validation: PASS"
    exit 0
else
    echo "UI Validation: FAIL"
    echo "$RESULT"
    exit 1
fi
```

## Comparison: Claude in Chrome vs Direct CDP

| Feature | Claude in Chrome | Direct CDP (prompt-kit scripts) |
|---------|------------------|--------------------------------|
| Rich interaction | Yes - understands context | Limited - script-based |
| Form filling | Natural language | Requires selectors |
| Error handling | Intelligent retry | Manual |
| Speed | ~20-90s | ~5-10s |
| Screenshot | Via fallback | Native |
| Best for | Complex validation | Simple screenshots |

**Rule of thumb**: Use Claude in Chrome for validation that requires understanding. Use direct CDP for simple screenshots.

## Troubleshooting

### 1. Command Returns Empty

```bash
# Add stderr capture
powershell.exe -Command "..." 2>&1
```

### 2. Subscription Not Working

```bash
# Verify Claude Max is available
powershell.exe -Command "claude --version"

# Check if API key is interfering
powershell.exe -Command "echo \$env:ANTHROPIC_API_KEY"
# If set, the unset command isn't working - check quoting
```

### 3. Chrome Not Available

```bash
# Verify Chrome is installed and Claude can see it
powershell.exe -Command "claude -p 'List your available tools' --chrome"
```

### 4. Localhost Not Accessible

```bash
# Use LAN IP instead
# Find your Windows IP from WSL:
ip route show default | awk '{print $3}'
# Then use http://192.168.x.x:3000 instead of localhost
```
