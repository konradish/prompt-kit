# Chrome Automation (WSL2 → Windows)

Browser automation from WSL2 using Chrome's DevTools Protocol (CDP).

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
├── scripts/
│   ├── chrome-launcher.mjs    # Launch Chrome with debug port
│   ├── run-automation.mjs     # General purpose script runner
│   └── multi-tab.mjs          # Multi-tab parallel operations
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

## Notes

- Only ONE Chrome instance per profile at a time
- Multiple ports = multiple Chrome instances (different profiles)
- WSL2 cannot directly connect to Windows localhost (use PowerShell bridge)
- Profile contains encrypted credentials (tied to Windows user)
