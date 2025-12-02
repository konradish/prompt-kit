#!/usr/bin/env node
/**
 * Chrome Launcher - Start Chrome with remote debugging enabled
 *
 * Usage:
 *   node chrome-launcher.mjs [--profile=schoolbrain|default] [--port=auto|9222] [url]
 *
 * Returns JSON with { pid, port, profile, wsEndpoint } for later management
 */

import { spawn, execSync } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';
import net from 'net';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');

// Parse arguments
const args = process.argv.slice(2);
const getArg = (name, defaultVal) => {
  const arg = args.find(a => a.startsWith(`--${name}=`));
  return arg ? arg.split('=').slice(1).join('=') : defaultVal;
};

const requestedPort = getArg('port', 'auto');
const profileName = getArg('profile', 'default');
const url = args.filter(a => !a.startsWith('--')).pop() || '';

// Profile paths
const profiles = {
  default: path.join(PROJECT_ROOT, 'profiles', 'default'),
  schoolbrain: path.join(PROJECT_ROOT, 'profiles', 'schoolbrain-konra'),
};

const profilePath = profiles[profileName] || profiles.default;

// Find available port
async function findAvailablePort(startPort = 9222, maxTries = 100) {
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

// Get Chrome PID by user-data-dir using PowerShell (wmic is deprecated)
function getChromePidByProfile(profilePath) {
  try {
    const escapedPath = profilePath.replace(/\\/g, '\\\\');
    const psCmd = `Get-Process chrome -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like '*${escapedPath}*' } | Select-Object -First 1 -ExpandProperty Id`;
    const output = execSync(`powershell -Command "${psCmd}"`, { encoding: 'utf8', windowsHide: true });
    const pid = parseInt(output.trim(), 10);
    return isNaN(pid) ? null : pid;
  } catch {
    return null;
  }
}

// Wait for debug port to be ready
async function waitForDebugPort(port, timeout = 10000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const response = await fetch(`http://localhost:${port}/json/version`);
      const data = await response.json();
      return data;
    } catch {
      await new Promise(r => setTimeout(r, 200));
    }
  }
  throw new Error(`Chrome debug port ${port} not ready after ${timeout}ms`);
}

async function main() {
  // Determine port
  let port;
  if (requestedPort === 'auto') {
    port = await findAvailablePort();
  } else {
    port = parseInt(requestedPort, 10);
    // Check if port is in use
    const inUse = await new Promise(resolve => {
      const server = net.createServer();
      server.once('error', () => resolve(true));
      server.once('listening', () => {
        server.close();
        resolve(false);
      });
      server.listen(port, '127.0.0.1');
    });
    if (inUse) {
      console.error(JSON.stringify({
        success: false,
        error: `Port ${port} is already in use`
      }));
      process.exit(1);
    }
  }

  const chromeArgs = [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profilePath}`,
  ];

  if (url) {
    chromeArgs.push(url);
  }

  // Launch Chrome using PowerShell Start-Process (more reliable on Windows)
  const argsString = chromeArgs.map(a => `'${a}'`).join(',');
  const psCommand = `Start-Process -FilePath 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' -ArgumentList ${argsString} -PassThru | Select-Object -ExpandProperty Id`;

  try {
    execSync(`powershell -Command "${psCommand}"`, { stdio: 'ignore', windowsHide: true });
  } catch {
    // Chrome may already be launching, continue
  }

  // Wait for debug port and get info
  try {
    const versionInfo = await waitForDebugPort(port);

    // Get the actual PID
    const pid = getChromePidByProfile(profilePath);

    const result = {
      success: true,
      pid,
      port,
      profile: profileName,
      profilePath,
      browser: versionInfo.Browser,
      wsEndpoint: versionInfo.webSocketDebuggerUrl,
    };

    // Save to state file for later reference
    const stateFile = path.join(PROJECT_ROOT, '.chrome-instances.json');
    let instances = {};
    try {
      instances = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
    } catch {}
    instances[profileName] = result;
    fs.writeFileSync(stateFile, JSON.stringify(instances, null, 2));

    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(JSON.stringify({
      success: false,
      error: error.message,
      port,
      profile: profileName,
    }));
    process.exit(1);
  }
}

main();
