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
 *
 * Output: Always JSON { success: true, data: ... } or { success: false, error: "..." }
 */

import { launch, getConnection, disconnect } from './lib/connection.mjs';
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
        'wait <text> [--timeout=5000]': 'Wait for text to appear on page'
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
