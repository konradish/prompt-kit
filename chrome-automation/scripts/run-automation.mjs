#!/usr/bin/env node
/**
 * Run Automation Script
 *
 * General-purpose script runner for Chrome automation.
 *
 * Usage:
 *   node run-automation.mjs <script-path> [args...]
 *   node run-automation.mjs --inline="await page.screenshot({path: 'test.png'})"
 *
 * Environment:
 *   CDP_PORT - Chrome debug port (default: 9222)
 *   CDP_HOST - Chrome host (default: localhost)
 */

import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CDP_PORT = process.env.CDP_PORT || '9222';
const CDP_HOST = process.env.CDP_HOST || 'localhost';

async function connectBrowser() {
  const response = await fetch(`http://${CDP_HOST}:${CDP_PORT}/json/version`);
  const { webSocketDebuggerUrl } = await response.json();

  return puppeteer.connect({
    browserWSEndpoint: webSocketDebuggerUrl,
    defaultViewport: null,
  });
}

async function main() {
  const args = process.argv.slice(2);

  // Check for inline script
  const inlineArg = args.find(a => a.startsWith('--inline='));
  const inline = inlineArg ? inlineArg.slice('--inline='.length) : null;

  // Or script file
  const scriptPath = args.find(a => !a.startsWith('--'));

  if (!inline && !scriptPath) {
    console.error('Usage: run-automation.mjs <script.mjs> | --inline="code"');
    process.exit(1);
  }

  let browser;
  try {
    browser = await connectBrowser();
    const pages = await browser.pages();

    // Make browser and pages available to scripts
    globalThis.browser = browser;
    globalThis.pages = pages;
    globalThis.page = pages[0]; // Default to first page

    if (inline) {
      // Execute inline code
      const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
      const fn = new AsyncFunction('browser', 'pages', 'page', inline);
      const result = await fn(browser, pages, pages[0]);
      if (result !== undefined) {
        console.log(JSON.stringify(result, null, 2));
      }
    } else {
      // Execute script file
      const absolutePath = path.resolve(scriptPath);
      if (!fs.existsSync(absolutePath)) {
        console.error(`Script not found: ${absolutePath}`);
        process.exit(1);
      }

      // Import and run the script
      const module = await import(`file://${absolutePath}`);
      if (typeof module.default === 'function') {
        const result = await module.default({ browser, pages, page: pages[0] });
        if (result !== undefined) {
          console.log(JSON.stringify(result, null, 2));
        }
      }
    }
  } catch (error) {
    console.error(JSON.stringify({ success: false, error: error.message }));
    process.exit(1);
  } finally {
    if (browser) {
      await browser.disconnect();
    }
  }
}

main();
