#!/usr/bin/env node
/**
 * Chrome Kill - Stop a Chrome instance by profile or PID
 *
 * Usage:
 *   node chrome-kill.mjs --profile=schoolbrain    # Kill by profile name
 *   node chrome-kill.mjs --pid=12345              # Kill by PID
 *   node chrome-kill.mjs --port=9222              # Kill by debug port
 *   node chrome-kill.mjs --all                    # Kill all managed instances
 */

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const STATE_FILE = path.join(PROJECT_ROOT, '.chrome-instances.json');

// Parse arguments
const args = process.argv.slice(2);
const getArg = (name) => {
  const arg = args.find(a => a.startsWith(`--${name}=`));
  return arg ? arg.split('=').slice(1).join('=') : null;
};
const hasFlag = (name) => args.includes(`--${name}`);

const profileName = getArg('profile');
const targetPid = getArg('pid');
const targetPort = getArg('port');
const killAll = hasFlag('all');

function loadInstances() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function saveInstances(instances) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(instances, null, 2));
}

function killByPid(pid) {
  try {
    execSync(`taskkill /F /PID ${pid} /T`, { stdio: 'pipe', windowsHide: true });
    return true;
  } catch {
    return false;
  }
}

function findPidByPort(port) {
  try {
    // Query Chrome debug endpoint to find the browser
    const response = execSync(
      `powershell -Command "(Invoke-WebRequest -Uri 'http://localhost:${port}/json/version' -UseBasicParsing).Content"`,
      { encoding: 'utf8', windowsHide: true }
    );
    // Find process using netstat
    const netstat = execSync(`netstat -ano | findstr ":${port}"`, { encoding: 'utf8', windowsHide: true });
    const match = netstat.match(/LISTENING\s+(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  } catch {
    return null;
  }
}

async function main() {
  const instances = loadInstances();
  const killed = [];

  if (killAll) {
    // Kill all managed instances
    for (const [name, instance] of Object.entries(instances)) {
      if (instance.pid && killByPid(instance.pid)) {
        killed.push({ profile: name, pid: instance.pid });
        delete instances[name];
      }
    }
  } else if (profileName) {
    // Kill by profile name - try PID first, then port
    const instance = instances[profileName];
    if (instance?.pid) {
      if (killByPid(instance.pid)) {
        killed.push({ profile: profileName, pid: instance.pid });
        delete instances[profileName];
      }
    } else if (instance?.port) {
      // Fallback: kill by port
      const pid = findPidByPort(instance.port);
      if (pid && killByPid(pid)) {
        killed.push({ profile: profileName, port: instance.port, pid });
        delete instances[profileName];
      } else {
        console.error(JSON.stringify({
          success: false,
          error: `Could not find process for profile: ${profileName} on port ${instance.port}`
        }));
        process.exit(1);
      }
    } else {
      console.error(JSON.stringify({
        success: false,
        error: `No running instance found for profile: ${profileName}`
      }));
      process.exit(1);
    }
  } else if (targetPid) {
    // Kill by PID directly
    const pid = parseInt(targetPid, 10);
    if (killByPid(pid)) {
      killed.push({ pid });
      // Remove from instances if found
      for (const [name, instance] of Object.entries(instances)) {
        if (instance.pid === pid) {
          delete instances[name];
        }
      }
    }
  } else if (targetPort) {
    // Kill by port
    const pid = findPidByPort(parseInt(targetPort, 10));
    if (pid && killByPid(pid)) {
      killed.push({ port: targetPort, pid });
      // Remove from instances if found
      for (const [name, instance] of Object.entries(instances)) {
        if (instance.port === parseInt(targetPort, 10)) {
          delete instances[name];
        }
      }
    } else {
      console.error(JSON.stringify({
        success: false,
        error: `No Chrome instance found on port ${targetPort}`
      }));
      process.exit(1);
    }
  } else {
    console.error('Usage: chrome-kill.mjs --profile=NAME | --pid=PID | --port=PORT | --all');
    process.exit(1);
  }

  saveInstances(instances);

  console.log(JSON.stringify({
    success: true,
    killed,
    remaining: Object.keys(instances).length
  }, null, 2));
}

main();
