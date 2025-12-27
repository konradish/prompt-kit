---
name: validate-ui
description: Validate UI via Windows Chrome from WSL
arguments:
  - name: url
    description: URL to validate (e.g., http://myapp.localhost, https://myapp.example.com)
    required: false
---

# Validate UI Command

Invokes Windows Claude with Chrome integration to validate a web UI.

## Usage

```
/validate-ui [url]
```

## Arguments

- `url` (optional): The URL to validate. Examples:
  - `http://myapp.localhost` (local via Traefik)
  - `http://api.myapp.localhost` (local API)
  - `https://myapp-dev.example.com` (staging)

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
URL="${1}"

# If no URL provided, prompt user
if [[ -z "$URL" ]]; then
    echo "No URL provided. Examples:"
    echo "  - http://myapp.localhost (local via Traefik)"
    echo "  - https://myapp-dev.example.com (staging)"
    echo "Please provide a URL to validate."
    exit 1
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
## UI Validation Report: http://myapp.localhost

### Page Health: PASS
- Page loaded in 1.2s
- No error banners
- Page responsive

### Navigation: PASS
- Main nav visible
- Items: Home, Dashboard, Settings, Profile

### Content: PASS
- Title: "My Application"
- Main content populated
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

1. **Local development** (if using Traefik routing):
   ```bash
   /validate-ui http://myapp.localhost
   /validate-ui http://api.myapp.localhost
   ```

2. **Dev/staging environments**:
   ```bash
   /validate-ui https://myapp-dev.example.com
   ```

3. **For specific checks**: Use the skill directly with custom prompts for more targeted validation.
