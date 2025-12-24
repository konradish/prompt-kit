#!/usr/bin/env node
/**
 * Chrome CLI - Simplified browser automation for Claude
 *
 * Usage:
 *   node cli.mjs launch <url>              - Launch Chrome or navigate to URL
 *   node cli.mjs state                     - Get page state as JSON
 *   node cli.mjs click <text>              - Click element containing text
 *   node cli.mjs eval <script>             - Run JS in page, return result
 *   node cli.mjs clear                     - Clear cookies + localStorage
 *   node cli.mjs screenshot [--output=file] - Take screenshot
 *   node cli.mjs wait <text> [--timeout=5000] - Wait for text on page
 *   node cli.mjs config                    - Show connection config (WSL/port info)
 *   node cli.mjs setup                     - Configure WSL port forwarding (one-time)
 *
 * Environment Variables:
 *   CHROME_DEBUG_PORT   - Override default Chrome debug port (default: 9223)
 *
 * WSL/Windows Compatibility:
 *   Automatically detects WSL and uses Windows host IP from /etc/resolv.conf.
 *   For WSL2, run 'node cli.mjs setup' once to configure port forwarding.
 *   Falls back to localhost for native Windows or mirrored networking mode.
 *
 * Output: Always JSON { success: true, data: ... } or { success: false, error: "..." }
 */

import { launch, getConnection, disconnect, getConnectionConfig, setupWSLPortForwarding } from './lib/connection.mjs';
import { clickByText, navigate, clear } from './lib/actions.mjs';
import { getState, screenshot, waitForText, evaluate } from './lib/queries.mjs';

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0];

// Parse --key=value arguments
function getArg(name, defaultValue = null) {
  const arg = args.find(a => a.startsWith(`--${name}=`));
  return arg ? arg.split('=').slice(1).join('=') : defaultValue;
}

// Get positional arguments (not starting with --)
function getPositionalArgs() {
  return args.slice(1).filter(a => !a.startsWith('--'));
}

// Output JSON result and exit
function output(result) {
  console.log(JSON.stringify(result, null, 2));
  process.exit(result.success ? 0 : 1);
}

// Wrap async operations with error handling
async function run(fn) {
  try {
    const result = await fn();
    output(result);
  } catch (error) {
    output({ success: false, error: error.message });
  }
}

// Command handlers
const commands = {
  async launch() {
    const positional = getPositionalArgs();
    const url = positional[0];

    if (!url) {
      return { success: false, error: 'Usage: cli.mjs launch <url>' };
    }

    const { browser, session, launched, navigated } = await launch(url);

    // Wait a bit for navigation to complete
    await new Promise(r => setTimeout(r, 1000));

    // Get fresh page reference after navigation
    const pages = await browser.pages();
    const page = pages[0];
    let pageUrl = '';
    let pageTitle = '';

    try {
      pageUrl = page?.url() || url;
      pageTitle = page ? await page.title() : '';
    } catch {
      // Page might still be navigating
      pageUrl = url;
    }

    await disconnect(browser);

    return {
      success: true,
      launched,
      navigated,
      url: pageUrl,
      title: pageTitle,
      wsEndpoint: session.wsEndpoint,
      port: session.port
    };
  },

  async state() {
    const { browser } = await getConnection();
    const pages = await browser.pages();
    const page = pages[0];

    if (!page) {
      await disconnect(browser);
      return { success: false, error: 'No page available' };
    }

    const result = await getState(page);
    await disconnect(browser);
    return result;
  },

  async click() {
    const positional = getPositionalArgs();
    const text = positional.join(' ');

    if (!text) {
      return { success: false, error: 'Usage: cli.mjs click <text>' };
    }

    const { browser } = await getConnection();
    const pages = await browser.pages();
    const page = pages[0];

    if (!page) {
      await disconnect(browser);
      return { success: false, error: 'No page available' };
    }

    const result = await clickByText(page, text);
    await disconnect(browser);
    return result;
  },

  async eval() {
    const positional = getPositionalArgs();
    const script = positional.join(' ');

    if (!script) {
      return { success: false, error: 'Usage: cli.mjs eval <script>' };
    }

    const { browser } = await getConnection();
    const pages = await browser.pages();
    const page = pages[0];

    if (!page) {
      await disconnect(browser);
      return { success: false, error: 'No page available' };
    }

    const result = await evaluate(page, script);
    await disconnect(browser);
    return result;
  },

  async clear() {
    const { browser } = await getConnection();
    const pages = await browser.pages();
    const page = pages[0];

    if (!page) {
      await disconnect(browser);
      return { success: false, error: 'No page available' };
    }

    const result = await clear(page);
    await disconnect(browser);
    return result;
  },

  async screenshot() {
    const outputPath = getArg('output');

    const { browser } = await getConnection();
    const pages = await browser.pages();
    const page = pages[0];

    if (!page) {
      await disconnect(browser);
      return { success: false, error: 'No page available' };
    }

    const result = await screenshot(page, { output: outputPath });
    await disconnect(browser);
    return result;
  },

  async wait() {
    const positional = getPositionalArgs();
    const text = positional.join(' ');
    const timeout = parseInt(getArg('timeout', '5000'), 10);

    if (!text) {
      return { success: false, error: 'Usage: cli.mjs wait <text> [--timeout=5000]' };
    }

    const { browser } = await getConnection();
    const pages = await browser.pages();
    const page = pages[0];

    if (!page) {
      await disconnect(browser);
      return { success: false, error: 'No page available' };
    }

    const result = await waitForText(page, text, timeout);
    await disconnect(browser);
    return result;
  },

  async config() {
    const config = getConnectionConfig();
    let wslNote = null;

    if (config.isWSL) {
      // Test if we can connect directly or need PowerShell workaround
      try {
        const response = await fetch(`http://${config.hostIP}:${config.defaultPort}/json/version`, {
          signal: AbortSignal.timeout(2000)
        });
        wslNote = 'Direct WSL connection available (mirrored networking or port forwarding working)';
      } catch {
        wslNote = 'WSL2 network isolation detected. Use PowerShell wrapper or enable mirrored networking.';
      }
    }

    const cwd = process.cwd().replace(/\//g, '\\').replace('\\mnt\\c', 'C:');
    return {
      success: true,
      config: {
        ...config,
        wslConnectivity: wslNote
      },
      env: {
        CHROME_DEBUG_PORT: process.env.CHROME_DEBUG_PORT || '(not set)'
      },
      help: config.isWSL
        ? `Running in WSL2. For best results, run via PowerShell:\n  powershell.exe -Command "cd '${cwd}'; node cli.mjs <command>"`
        : `Running natively. Will connect to Chrome at localhost:${config.defaultPort}`
    };
  },

  async setup() {
    const config = getConnectionConfig();

    if (!config.isWSL) {
      return {
        success: true,
        message: 'Not running in WSL - no setup needed. Chrome localhost connections work natively.'
      };
    }

    // Try to set up port forwarding
    const result = await setupWSLPortForwarding(config.defaultPort);

    if (result.success) {
      return {
        success: true,
        message: result.reason === 'already_configured'
          ? `Port forwarding already configured for port ${config.defaultPort}`
          : `Port forwarding configured for port ${config.defaultPort}`,
        nextStep: `Chrome debug port ${config.defaultPort} should now be accessible from WSL. Try 'node cli.mjs launch <url>'`
      };
    } else {
      return {
        success: false,
        error: 'Port forwarding requires administrator privileges',
        manualCommand: result.command,
        instructions: [
          '1. Open PowerShell as Administrator on Windows',
          `2. Run: ${result.command}`,
          '3. Retry the CLI command'
        ]
      };
    }
  },

  async help() {
    return {
      success: true,
      usage: {
        'launch <url>': 'Launch Chrome or navigate to URL',
        'state': 'Get page state as JSON',
        'click <text>': 'Click element containing text (fuzzy match)',
        'eval <script>': 'Run JS in page, return result',
        'clear': 'Clear cookies + localStorage',
        'screenshot [--output=file]': 'Take screenshot (base64 or save to file)',
        'wait <text> [--timeout=5000]': 'Wait for text to appear on page',
        'config': 'Show connection config (WSL detection, port, host)',
        'setup': 'Configure WSL port forwarding for Chrome access (run once)'
      },
      envVars: {
        'CHROME_DEBUG_PORT': 'Override default Chrome debug port (default: 9223)'
      }
    };
  }
};

// Main execution
if (!command || !commands[command]) {
  run(() => commands.help());
} else {
  run(() => commands[command]());
}
