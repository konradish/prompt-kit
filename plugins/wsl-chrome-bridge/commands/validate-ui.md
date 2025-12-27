---
name: validate-ui
description: Validate UI via Windows Chrome from WSL
arguments:
  - name: url
    description: URL to validate (optional, uses localhost:3000 if not provided)
    required: false
---

# Validate UI Command

Invokes Windows Claude with Chrome integration to validate a web UI.

## Usage

```
/validate-ui [url]
```

## Arguments

- `url` (optional): The URL to validate. Defaults to `http://localhost:3000`

## Execution

When this command is invoked:

1. **Parse the URL** from arguments or use default
2. **Convert localhost** to accessible address if needed
3. **Invoke Windows Claude** with Chrome integration
4. **Request structured validation** covering:
   - Page loads successfully
   - No error messages/banners
   - Navigation elements present
   - Key content visible
   - No visual issues
5. **Return results** in a structured format

## Implementation

Execute the following to validate the UI:

```bash
URL="${1:-http://localhost:3000}"

# Check if URL uses localhost - may need LAN IP for Chrome access
if [[ "$URL" == *"localhost"* ]]; then
    echo "Note: localhost may require domain approval in Claude in Chrome."
    echo "If validation fails, try using your machine's LAN IP instead."
fi

# Invoke Windows Claude with Chrome
RESULT=$(timeout 120 powershell.exe -Command "
\$env:ANTHROPIC_API_KEY = ''
claude -p 'Validate the UI at $URL. Check and report:

## Page Health
- Does the page load without errors?
- Are there any error banners or messages?
- Is the page responsive (not frozen)?

## Navigation
- Is the main navigation visible?
- List the navigation items present

## Content
- What is the page title?
- Is the main content area populated?
- Are there any loading spinners stuck?

## Visual Issues
- Any broken images?
- Any layout problems (overflow, misalignment)?
- Any missing styles (unstyled elements)?

## Console
- Any JavaScript errors visible?

Return a structured report with PASS/FAIL for each section and overall verdict.' --chrome --dangerously-skip-permissions" 2>&1)

echo "$RESULT"
```

## Example Output

```
## UI Validation Report: http://localhost:3000

### Page Health: PASS
- Page loaded in 1.2s
- No error banners
- Page responsive

### Navigation: PASS
- Main nav visible
- Items: Home, Dashboard, Settings, Profile

### Content: PASS
- Title: "My Application"
- Main content populated with user data
- No stuck spinners

### Visual Issues: PASS
- All images loaded
- Layout correct
- Styles applied

### Console: PASS
- No JavaScript errors

## Overall: PASS
```

## Tips

1. **For localhost URLs**: If Chrome can't access localhost, use your machine's LAN IP:
   ```bash
   /validate-ui http://192.168.1.100:3000
   ```

2. **For specific checks**: Use the skill directly with custom prompts for more targeted validation.

3. **After deployments**: Run this command to quick-check production deployments:
   ```bash
   /validate-ui https://myapp.example.com
   ```
