/**
 * Connection Manager - Manage Chrome browser connections
 *
 * Handles connecting to existing Chrome instances or launching new ones.
 * Stores wsEndpoint in .chrome-session.json for persistence.
 *
 * WSL/Windows Compatibility:
 * - Detects Windows host IP from /etc/resolv.conf when running in WSL
 * - Falls back to localhost for native Windows or mirrored networking mode
 * - Supports configurable port via CHROME_DEBUG_PORT env var
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
const PROFILE_PATH = path.join(PROJECT_ROOT, 'profiles', 'default');

/**
 * Get configured port from env var, session file, or default
 */
function getConfiguredPort() {
  // Priority 1: Environment variable
  if (process.env.CHROME_DEBUG_PORT) {
    const port = parseInt(process.env.CHROME_DEBUG_PORT, 10);
    if (!isNaN(port) && port > 0 && port < 65536) {
      return port;
    }
  }

  // Priority 2: Saved session file
  try {
    const session = JSON.parse(fs.readFileSync(SESSION_FILE, 'utf8'));
    if (session.port) {
      return session.port;
    }
  } catch {
    // No session file or invalid JSON
  }

  // Priority 3: Default port
  return 9223;
}

const DEFAULT_PORT = getConfiguredPort();

/**
 * Detect if running in WSL and get Windows host IP
 * Returns { isWSL: boolean, hostIP: string }
 */
function detectWSLHost() {
  // Check if we're in WSL by looking for WSL-specific files
  const isWSL = fs.existsSync('/proc/sys/fs/binfmt_misc/WSLInterop') ||
                (process.env.WSL_DISTRO_NAME !== undefined);

  if (!isWSL) {
    return { isWSL: false, hostIP: 'localhost' };
  }

  // Try to get Windows host IP from resolv.conf
  try {
    const resolvConf = fs.readFileSync('/etc/resolv.conf', 'utf8');
    const match = resolvConf.match(/nameserver\s+(\d+\.\d+\.\d+\.\d+)/);
    if (match && match[1]) {
      // The nameserver in WSL2 points to the Windows host
      return { isWSL: true, hostIP: match[1] };
    }
  } catch {
    // Fall through to localhost
  }

  // Fallback: try localhost (works with mirrored networking mode)
  return { isWSL: true, hostIP: 'localhost' };
}

const { isWSL, hostIP } = detectWSLHost();

/**
 * Setup port forwarding on Windows to allow WSL access to Chrome debug port
 * This adds a netsh portproxy rule to forward from 0.0.0.0 to 127.0.0.1
 */
async function setupWSLPortForwarding(port) {
  if (!isWSL) return { success: true, reason: 'not_wsl' };

  try {
    // Check if port forwarding already exists
    const checkCmd = `netsh interface portproxy show v4tov4 | findstr "${port}"`;
    const checkResult = execSync(`powershell.exe -Command "${checkCmd}"`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    }).trim();

    if (checkResult.includes(String(port))) {
      return { success: true, reason: 'already_configured' };
    }
  } catch {
    // Port forwarding not yet configured
  }

  try {
    // Add port forwarding rule (requires admin, but try anyway)
    const addCmd = `netsh interface portproxy add v4tov4 listenaddress=0.0.0.0 listenport=${port} connectaddress=127.0.0.1 connectport=${port}`;
    execSync(`powershell.exe -Command "Start-Process -FilePath 'netsh' -ArgumentList 'interface portproxy add v4tov4 listenaddress=0.0.0.0 listenport=${port} connectaddress=127.0.0.1 connectport=${port}' -Verb RunAs -Wait"`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    return { success: true, reason: 'configured' };
  } catch (error) {
    // Needs admin rights - provide helpful message
    return {
      success: false,
      reason: 'admin_required',
      command: `netsh interface portproxy add v4tov4 listenaddress=0.0.0.0 listenport=${port} connectaddress=127.0.0.1 connectport=${port}`,
      error: error.message
    };
  }
}

/**
 * Export connection config for diagnostics
 */
export function getConnectionConfig() {
  return {
    isWSL,
    hostIP,
    defaultPort: DEFAULT_PORT,
    sessionFile: SESSION_FILE,
    profilePath: PROFILE_PATH
  };
}

/**
 * Export WSL port forwarding helper
 */
export { setupWSLPortForwarding };

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
 * Check if Chrome is responding on a port via PowerShell (WSL fallback)
 * This invokes PowerShell on Windows to fetch the Chrome debug info
 */
async function checkChromePortViaPowerShell(port) {
  try {
    const psCmd = `Invoke-WebRequest -Uri 'http://localhost:${port}/json/version' -UseBasicParsing -TimeoutSec 3 | Select-Object -ExpandProperty Content`;
    const result = execSync(`powershell.exe -Command "${psCmd}"`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 5000
    }).trim();
    return JSON.parse(result);
  } catch {
    return null;
  }
}

/**
 * Check if Chrome is responding on a port
 * Tries direct connection first, falls back to PowerShell proxy for WSL
 */
async function checkChromePort(port, options = {}) {
  const { returnHost = false, tryBoth = true } = options;

  // Hosts to try in order of preference
  const hosts = tryBoth && isWSL
    ? [hostIP, 'localhost', '127.0.0.1']
    : ['localhost', '127.0.0.1'];

  // Try direct connection first
  for (const host of hosts) {
    try {
      const response = await fetch(`http://${host}:${port}/json/version`, {
        signal: AbortSignal.timeout(2000)
      });
      const data = await response.json();
      if (returnHost) {
        return { ...data, _connectedHost: host };
      }
      return data;
    } catch {
      // Try next host
    }
  }

  // WSL fallback: use PowerShell to verify Chrome is running
  if (isWSL) {
    const data = await checkChromePortViaPowerShell(port);
    if (data) {
      // Chrome is running but we can't connect directly from WSL
      // Return the data with localhost - will need mirrored networking or port proxy
      if (returnHost) {
        return { ...data, _connectedHost: 'localhost', _viaProxy: true };
      }
      return data;
    }
  }

  return null;
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
    const versionInfo = await checkChromePort(DEFAULT_PORT, { returnHost: true });
    if (versionInfo?.webSocketDebuggerUrl) {
      // Replace localhost in wsEndpoint with the host that actually worked
      const connectedHost = versionInfo._connectedHost || 'localhost';
      let wsEndpoint = versionInfo.webSocketDebuggerUrl;
      if (connectedHost !== 'localhost') {
        wsEndpoint = wsEndpoint.replace(/ws:\/\/localhost:/,`ws://${connectedHost}:`);
        wsEndpoint = wsEndpoint.replace(/ws:\/\/127\.0\.0\.1:/, `ws://${connectedHost}:`);
      }

      const session = {
        wsEndpoint,
        port: DEFAULT_PORT,
        host: connectedHost,
        browser: versionInfo.Browser,
        timestamp: Date.now(),
        isWSL
      };
      saveSession(session);
      return session;
    }
    await new Promise(r => setTimeout(r, 300));
  }

  throw new Error(`Chrome debug port ${DEFAULT_PORT} not ready after ${timeout}ms. ${isWSL ? `Tried hosts: ${hostIP}, localhost` : ''}`);
}

/**
 * Connect to browser - try cached connection first, launch new if needed
 * Handles WSL/Windows connectivity by trying multiple hosts
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
    } catch (error) {
      // Connection failed - if it's a cached WSL session, try with updated host
      if (isWSL && session.host) {
        // Try updating the wsEndpoint with current host IP (might have changed)
        const currentHostIP = detectWSLHost().hostIP;
        if (currentHostIP !== session.host) {
          const updatedEndpoint = session.wsEndpoint.replace(
            new RegExp(`ws://${session.host}:`),
            `ws://${currentHostIP}:`
          );
          try {
            const browser = await puppeteer.connect({
              browserWSEndpoint: updatedEndpoint,
              defaultViewport: null
            });
            // Update session with new host
            const updatedSession = { ...session, wsEndpoint: updatedEndpoint, host: currentHostIP };
            saveSession(updatedSession);
            return { browser, session: updatedSession, isNew: false };
          } catch {
            // Fall through to port check
          }
        }
      }
      // Connection failed, will try port check
    }
  }

  // Try connecting via port with host detection
  const versionInfo = await checkChromePort(DEFAULT_PORT, { returnHost: true });
  if (versionInfo?.webSocketDebuggerUrl) {
    const connectedHost = versionInfo._connectedHost || 'localhost';

    // If Chrome was detected via PowerShell proxy, we can't actually connect from WSL
    if (versionInfo._viaProxy) {
      const cwd = process.cwd().replace(/\//g, '\\').replace('\\mnt\\c', 'C:');
      throw new Error(
        `Chrome is running on Windows (port ${DEFAULT_PORT}) but WSL2 cannot connect directly due to network isolation. ` +
        `Solutions:\n` +
        `1. Enable WSL mirrored networking: Create %USERPROFILE%\\.wslconfig with:\n` +
        `   [wsl2]\n` +
        `   networkingMode=mirrored\n` +
        `   Then run: wsl --shutdown (and restart WSL)\n` +
        `2. Or run commands from Windows PowerShell:\n` +
        `   powershell.exe -Command "cd '${cwd}'; node cli.mjs state"`
      );
    }

    let wsEndpoint = versionInfo.webSocketDebuggerUrl;
    if (connectedHost !== 'localhost') {
      wsEndpoint = wsEndpoint.replace(/ws:\/\/localhost:/, `ws://${connectedHost}:`);
      wsEndpoint = wsEndpoint.replace(/ws:\/\/127\.0\.0\.1:/, `ws://${connectedHost}:`);
    }

    const newSession = {
      wsEndpoint,
      port: DEFAULT_PORT,
      host: connectedHost,
      browser: versionInfo.Browser,
      timestamp: Date.now(),
      isWSL
    };
    saveSession(newSession);

    const browser = await puppeteer.connect({
      browserWSEndpoint: newSession.wsEndpoint,
      defaultViewport: null
    });
    return { browser, session: newSession, isNew: false };
  }

  // No Chrome running at all
  const errorDetails = isWSL
    ? `Tried hosts: ${hostIP}, localhost:${DEFAULT_PORT}`
    : `Tried port ${DEFAULT_PORT}`;
  throw new Error(`No Chrome instance running. Use "launch" command first. (${errorDetails})`);
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
 * Handles WSL/Windows connectivity
 */
export async function launch(url) {
  // Check if already running (with host detection for WSL)
  const versionInfo = await checkChromePort(DEFAULT_PORT, { returnHost: true });

  if (versionInfo?.webSocketDebuggerUrl) {
    // Chrome running - connect and navigate
    const connectedHost = versionInfo._connectedHost || 'localhost';
    let wsEndpoint = versionInfo.webSocketDebuggerUrl;
    if (connectedHost !== 'localhost') {
      wsEndpoint = wsEndpoint.replace(/ws:\/\/localhost:/, `ws://${connectedHost}:`);
      wsEndpoint = wsEndpoint.replace(/ws:\/\/127\.0\.0\.1:/, `ws://${connectedHost}:`);
    }

    const session = {
      wsEndpoint,
      port: DEFAULT_PORT,
      host: connectedHost,
      browser: versionInfo.Browser,
      timestamp: Date.now(),
      isWSL
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
