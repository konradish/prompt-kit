/**
 * Connection Manager - Manage Chrome browser connections
 *
 * Handles connecting to existing Chrome instances or launching new ones.
 * Stores wsEndpoint in .chrome-session.json for persistence.
 */

import puppeteer from 'puppeteer-core';
import { execSync, spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import net from 'net';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const SESSION_FILE = path.join(PROJECT_ROOT, '.chrome-session.json');
const INSTANCES_FILE = path.join(PROJECT_ROOT, '.chrome-instances.json');
const DEFAULT_PORT = 9223;
const PROFILE_PATH = path.join(PROJECT_ROOT, 'profiles', 'default');

/**
 * Load saved session info
 */
function loadSession() {
  try {
    return JSON.parse(fs.readFileSync(SESSION_FILE, 'utf8'));
  } catch {
    return null;
  }
}

/**
 * Save session info
 */
function saveSession(session) {
  fs.writeFileSync(SESSION_FILE, JSON.stringify(session, null, 2));
}

/**
 * Check if Chrome is responding on a port
 */
async function checkChromePort(port) {
  try {
    const response = await fetch(`http://localhost:${port}/json/version`, {
      signal: AbortSignal.timeout(2000)
    });
    return await response.json();
  } catch {
    return null;
  }
}

/**
 * Find available port
 */
async function findAvailablePort(startPort = DEFAULT_PORT, maxTries = 100) {
  for (let port = startPort; port < startPort + maxTries; port++) {
    const available = await new Promise(resolve => {
      const server = net.createServer();
      server.once('error', () => resolve(false));
      server.once('listening', () => {
        server.close();
        resolve(true);
      });
      server.listen(port, '127.0.0.1');
    });
    if (available) return port;
  }
  throw new Error('No available ports found');
}

/**
 * Kill Chrome process using port (via PowerShell from WSL)
 */
function killChromeOnPort(port) {
  try {
    // Use PowerShell to find and kill process on port
    const psCmd = `
      $conn = Get-NetTCPConnection -LocalPort ${port} -ErrorAction SilentlyContinue | Where-Object { $_.State -eq 'Listen' };
      if ($conn) {
        Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue;
        Write-Output 'killed';
      }
    `.replace(/\n/g, ' ');
    const result = execSync(`powershell.exe -Command "${psCmd}"`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    return result.includes('killed');
  } catch {
    // Port not in use or kill failed
  }
  return false;
}

/**
 * Kill Chrome instances using our profile directory
 */
function killChromeByProfile() {
  try {
    const winProfilePath = PROFILE_PATH.replace('/mnt/c', 'C:').replace(/\//g, '\\\\');
    const psCmd = `
      Get-WmiObject Win32_Process -Filter "Name='chrome.exe'" |
      Where-Object { $_.CommandLine -like '*${winProfilePath}*' } |
      ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue };
      Write-Output 'done'
    `.replace(/\n/g, ' ');
    execSync(`powershell.exe -Command "${psCmd}"`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Launch Chrome with remote debugging
 */
async function launchChrome(url = null) {
  // Kill any existing Chrome on our port
  killChromeOnPort(DEFAULT_PORT);

  // Kill any Chrome using our profile (so we can launch fresh with debugging)
  killChromeByProfile();

  // Wait a bit for processes to terminate
  await new Promise(r => setTimeout(r, 1000));

  const chromeArgs = [
    `--remote-debugging-port=${DEFAULT_PORT}`,
    `--user-data-dir=${PROFILE_PATH}`,
  ];

  if (url) {
    chromeArgs.push(url);
  }

  // Launch Chrome using PowerShell from WSL
  // Convert WSL path to Windows path for user-data-dir
  const winProfilePath = PROFILE_PATH.replace('/mnt/c', 'C:').replace(/\//g, '\\');
  const winChromeArgs = [
    `--remote-debugging-port=${DEFAULT_PORT}`,
    `--user-data-dir=${winProfilePath}`,
  ];
  if (url) {
    winChromeArgs.push(url);
  }

  const argsString = winChromeArgs.map(a => `'${a}'`).join(',');
  const psCommand = `Start-Process -FilePath 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' -ArgumentList ${argsString}`;

  try {
    execSync(`powershell.exe -Command "${psCommand}"`, {
      stdio: 'ignore'
    });
  } catch {
    // Chrome may already be launching
  }

  // Wait for debug port to be ready
  const start = Date.now();
  const timeout = 15000;

  while (Date.now() - start < timeout) {
    const versionInfo = await checkChromePort(DEFAULT_PORT);
    if (versionInfo?.webSocketDebuggerUrl) {
      const session = {
        wsEndpoint: versionInfo.webSocketDebuggerUrl,
        port: DEFAULT_PORT,
        browser: versionInfo.Browser,
        timestamp: Date.now()
      };
      saveSession(session);
      return session;
    }
    await new Promise(r => setTimeout(r, 300));
  }

  throw new Error(`Chrome debug port ${DEFAULT_PORT} not ready after ${timeout}ms`);
}

/**
 * Connect to browser - try cached connection first, launch new if needed
 */
export async function getConnection() {
  // Try cached session first
  const session = loadSession();
  if (session?.wsEndpoint) {
    try {
      const browser = await puppeteer.connect({
        browserWSEndpoint: session.wsEndpoint,
        defaultViewport: null
      });
      return { browser, session, isNew: false };
    } catch {
      // Connection failed, will try port check
    }
  }

  // Try connecting via port
  const versionInfo = await checkChromePort(DEFAULT_PORT);
  if (versionInfo?.webSocketDebuggerUrl) {
    const newSession = {
      wsEndpoint: versionInfo.webSocketDebuggerUrl,
      port: DEFAULT_PORT,
      browser: versionInfo.Browser,
      timestamp: Date.now()
    };
    saveSession(newSession);

    const browser = await puppeteer.connect({
      browserWSEndpoint: newSession.wsEndpoint,
      defaultViewport: null
    });
    return { browser, session: newSession, isNew: false };
  }

  // No existing Chrome - need to launch
  throw new Error('No Chrome instance running. Use "launch" command first.');
}

/**
 * Connect to browser, launching if needed
 */
export async function getOrLaunchConnection(url = null) {
  try {
    return await getConnection();
  } catch {
    // Launch new Chrome instance
    const session = await launchChrome(url);
    const browser = await puppeteer.connect({
      browserWSEndpoint: session.wsEndpoint,
      defaultViewport: null
    });
    return { browser, session, isNew: true };
  }
}

/**
 * Launch Chrome and navigate to URL
 */
export async function launch(url) {
  // Check if already running
  const versionInfo = await checkChromePort(DEFAULT_PORT);

  if (versionInfo?.webSocketDebuggerUrl) {
    // Chrome running - connect and navigate
    const session = {
      wsEndpoint: versionInfo.webSocketDebuggerUrl,
      port: DEFAULT_PORT,
      browser: versionInfo.Browser,
      timestamp: Date.now()
    };
    saveSession(session);

    const browser = await puppeteer.connect({
      browserWSEndpoint: session.wsEndpoint,
      defaultViewport: null
    });

    const pages = await browser.pages();
    let page = pages[0];

    if (!page) {
      page = await browser.newPage();
    }

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

    return {
      browser,
      page,
      session,
      launched: false,
      navigated: true
    };
  }

  // Launch new Chrome
  const session = await launchChrome(url);

  const browser = await puppeteer.connect({
    browserWSEndpoint: session.wsEndpoint,
    defaultViewport: null
  });

  const pages = await browser.pages();
  const page = pages[0] || await browser.newPage();

  // Wait for page to be ready
  await new Promise(r => setTimeout(r, 1000));

  return {
    browser,
    page,
    session,
    launched: true,
    navigated: true
  };
}

/**
 * Disconnect browser without closing
 */
export async function disconnect(browser) {
  if (browser) {
    await browser.disconnect();
  }
}
