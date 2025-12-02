#!/usr/bin/env node
/**
 * Multi-Tab Chrome Automation
 *
 * Supports parallel operations across multiple tabs in a single Chrome instance.
 *
 * Usage:
 *   node multi-tab.mjs --urls="url1,url2,url3" --action=screenshot
 *   node multi-tab.mjs --action=list-tabs
 *   node multi-tab.mjs --action=parallel-screenshots --urls="url1,url2"
 *
 * Actions:
 *   list-tabs              - List all open tabs
 *   screenshot             - Screenshot specific URLs (opens new tabs)
 *   parallel-screenshots   - Screenshot multiple URLs in parallel
 *   close-tab              - Close tab by URL pattern
 *   eval                   - Run JS on all matching tabs
 */

import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const STATE_FILE = path.join(PROJECT_ROOT, '.chrome-instances.json');

// Parse arguments
const args = process.argv.slice(2);
const getArg = (name) => {
  const arg = args.find(a => a.startsWith(`--${name}=`));
  return arg ? arg.split('=').slice(1).join('=') : null;
};

// Get port from args, env, or state file
function getPort() {
  // 1. Explicit --port argument
  const portArg = getArg('port');
  if (portArg) return portArg;

  // 2. --profile argument -> look up in state file
  const profileArg = getArg('profile');
  if (profileArg) {
    try {
      const instances = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
      if (instances[profileArg]?.port) {
        return instances[profileArg].port.toString();
      }
    } catch {}
  }

  // 3. Environment variable
  if (process.env.CDP_PORT) return process.env.CDP_PORT;

  // 4. First available instance from state file
  try {
    const instances = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    const first = Object.values(instances)[0];
    if (first?.port) return first.port.toString();
  } catch {}

  // 5. Default
  return '9222';
}

const CDP_PORT = getPort();
const CDP_HOST = process.env.CDP_HOST || 'localhost';

const action = getArg('action') || 'list-tabs';
const urls = getArg('urls')?.split(',') || [];
const pattern = getArg('pattern') || '';
const script = getArg('script') || '';
const outputDir = getArg('output') || path.join(PROJECT_ROOT, 'output');

async function connectBrowser() {
  const response = await fetch(`http://${CDP_HOST}:${CDP_PORT}/json/version`);
  const { webSocketDebuggerUrl } = await response.json();

  return puppeteer.connect({
    browserWSEndpoint: webSocketDebuggerUrl,
    defaultViewport: null,
  });
}

async function listTabs(browser) {
  const pages = await browser.pages();
  const tabs = await Promise.all(pages.map(async (page, i) => ({
    index: i,
    url: page.url(),
    title: await page.title().catch(() => '(untitled)'),
  })));

  console.log(JSON.stringify({ success: true, tabs }, null, 2));
  return tabs;
}

async function screenshotUrls(browser, urls, parallel = false) {
  const results = [];

  const processUrl = async (url, index) => {
    const page = await browser.newPage();
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      const title = await page.title();
      const filename = `${outputDir}\\screenshot-${index}-${Date.now()}.png`;
      await page.screenshot({ path: filename, fullPage: false });
      results.push({ url, title, screenshot: filename, success: true });
    } catch (error) {
      results.push({ url, error: error.message, success: false });
    }
    // Keep tab open for inspection
  };

  if (parallel) {
    await Promise.all(urls.map((url, i) => processUrl(url, i)));
  } else {
    for (let i = 0; i < urls.length; i++) {
      await processUrl(urls[i], i);
    }
  }

  console.log(JSON.stringify({ success: true, results }, null, 2));
  return results;
}

async function closeTabByPattern(browser, pattern) {
  const pages = await browser.pages();
  const regex = new RegExp(pattern);
  let closed = 0;

  for (const page of pages) {
    if (regex.test(page.url())) {
      await page.close();
      closed++;
    }
  }

  console.log(JSON.stringify({ success: true, closed, pattern }));
}

async function evalOnTabs(browser, pattern, script) {
  const pages = await browser.pages();
  const regex = pattern ? new RegExp(pattern) : /.*/;
  const results = [];

  for (const page of pages) {
    if (regex.test(page.url())) {
      try {
        const result = await page.evaluate(script);
        results.push({ url: page.url(), result, success: true });
      } catch (error) {
        results.push({ url: page.url(), error: error.message, success: false });
      }
    }
  }

  console.log(JSON.stringify({ success: true, results }, null, 2));
}

async function getTabByUrl(browser, urlPattern) {
  const pages = await browser.pages();
  const regex = new RegExp(urlPattern);
  return pages.find(p => regex.test(p.url()));
}

// Main
async function main() {
  let browser;
  try {
    browser = await connectBrowser();

    switch (action) {
      case 'list-tabs':
        await listTabs(browser);
        break;

      case 'screenshot':
      case 'screenshots':
        if (!urls.length) {
          console.error('Error: --urls required');
          process.exit(1);
        }
        await screenshotUrls(browser, urls, false);
        break;

      case 'parallel-screenshots':
        if (!urls.length) {
          console.error('Error: --urls required');
          process.exit(1);
        }
        await screenshotUrls(browser, urls, true);
        break;

      case 'close-tab':
        if (!pattern) {
          console.error('Error: --pattern required');
          process.exit(1);
        }
        await closeTabByPattern(browser, pattern);
        break;

      case 'eval':
        if (!script) {
          console.error('Error: --script required');
          process.exit(1);
        }
        await evalOnTabs(browser, pattern, script);
        break;

      default:
        console.error(`Unknown action: ${action}`);
        process.exit(1);
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
