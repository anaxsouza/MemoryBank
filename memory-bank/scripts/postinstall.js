#!/usr/bin/env node
/**
 * Post-install script for memory-bank
 * Detects platform and copies binaries to ~/.memory_bank/bin/
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync, copyFileSync, chmodSync, writeFileSync, readFileSync, appendFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { homedir } from 'os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(__dirname, '..');

// Platform detection
const platform = process.platform;
const arch = process.arch;
const platformKey = `${platform}-${arch}`;

// Binary mapping for all executables
const binaryNames = {
  'darwin-arm64': {
    server: 'memory-bank-server-darwin-arm64',
    cli: 'mb-darwin-arm64',
    hook: 'memory-bank-hook-darwin-arm64',
    mcpProxy: 'memory-bank-mcp-proxy-darwin-arm64'
  },
  'darwin-x64': {
    server: 'memory-bank-server-darwin-x64',
    cli: 'mb-darwin-x64',
    hook: 'memory-bank-hook-darwin-x64',
    mcpProxy: 'memory-bank-mcp-proxy-darwin-x64'
  },
  'linux-arm64': {
    server: 'memory-bank-server-linux-arm64',
    cli: 'mb-linux-arm64',
    hook: 'memory-bank-hook-linux-arm64',
    mcpProxy: 'memory-bank-mcp-proxy-linux-arm64'
  },
  'linux-x64': {
    server: 'memory-bank-server-linux-x64',
    cli: 'mb-linux-x64',
    hook: 'memory-bank-hook-linux-x64',
    mcpProxy: 'memory-bank-mcp-proxy-linux-x64'
  },
  'win32-x64': {
    server: 'memory-bank-server-win32-x64.exe',
    cli: 'mb-win32-x64.exe',
    hook: 'memory-bank-hook-win32-x64.exe',
    mcpProxy: 'memory-bank-mcp-proxy-win32-x64.exe'
  }
};

const binaries = binaryNames[platformKey];
const isWindows = platform === 'win32';
const exeExt = isWindows ? '.exe' : '';

// Paths
const userBinDir = join(homedir(), '.memory_bank', 'bin');

function log(message) {
  console.log(`[memory-bank] ${message}`);
}

function warn(message) {
  console.warn(`[memory-bank] ${message}`);
}

function findBinary(binaryName) {
  // Try optional dependencies
  const optionalDepPath = join(
    packageRoot,
    'node_modules',
    `@memory-bank/server-${platformKey}`,
    binaryName
  );

  // Try local binaries directory
  const localBinaryPath = join(packageRoot, 'binaries', binaryName);

  if (existsSync(optionalDepPath)) {
    return optionalDepPath;
  }
  if (existsSync(localBinaryPath)) {
    return localBinaryPath;
  }
  return null;
}

function installBinary(sourcePath, targetName) {
  const targetPath = join(userBinDir, targetName);
  
  try {
    copyFileSync(sourcePath, targetPath);
    chmodSync(targetPath, 0o755);
    log(`  ✓ ${targetName}`);
    return true;
  } catch (error) {
    warn(`  ✗ ${targetName}: ${error.message}`);
    return false;
  }
}

function isAlreadyInPath() {
  const currentPath = process.env.PATH || '';
  return currentPath.includes(userBinDir);
}

function addToPath() {
  // Check if already in PATH
  if (isAlreadyInPath()) {
    log('  ✓ PATH already configured');
    return true;
  }
  
  const shell = process.env.SHELL || '';
  const home = homedir();
  let profileFile = null;
  
  if (isWindows) {
    try {
      execSync(`setx PATH "%PATH%;${userBinDir}"`, { stdio: 'ignore' });
      log('  ✓ Added to Windows PATH via setx');
      return true;
    } catch (e) {
      return false;
    }
  }
  
  // Detect shell profile
  if (shell.includes('zsh')) {
    profileFile = join(home, '.zshrc');
  } else if (shell.includes('bash')) {
    profileFile = join(home, '.bashrc');
  } else if (shell.includes('fish')) {
    profileFile = join(home, '.config', 'fish', 'config.fish');
  }
  
  if (profileFile && existsSync(dirname(profileFile))) {
    // Check if already in profile file to avoid duplication
    if (existsSync(profileFile)) {
      const profileContent = readFileSync(profileFile, 'utf8');
      if (profileContent.includes(userBinDir)) {
        log('  ✓ PATH already in shell profile');
        return true;
      }
    }
    
    const pathLine = `\n# MemoryBank PATH\nexport PATH="${userBinDir}:$PATH"\n`;
    try {
      appendFileSync(profileFile, pathLine);
      log(`  ✓ Added to PATH in ${profileFile}`);
      return true;
    } catch (e) {
      return false;
    }
  }
  
  return false;
}

async function main() {
  log('Installing MemoryBank...');
  log(`Platform: ${platformKey}`);

  // Check if binaries exist for this platform
  if (!binaries) {
    warn(`Platform ${platformKey} is not supported.`);
    warn('Supported platforms: darwin-arm64, darwin-x64, linux-arm64, linux-x64, win32-x64');
    warn('You may need to build from source: cargo build --release');
    process.exit(0);
  }

  // Create user bin directory
  if (!existsSync(userBinDir)) {
    mkdirSync(userBinDir, { recursive: true });
  }

  // Find and install all binaries
  log('\nInstalling binaries:');
  
  const serverSource = findBinary(binaries.server);
  const cliSource = findBinary(binaries.cli);
  const hookSource = findBinary(binaries.hook);
  const mcpProxySource = findBinary(binaries.mcpProxy);

  let installedCount = 0;

  if (serverSource) {
    if (installBinary(serverSource, `memory-bank-server${exeExt}`)) installedCount++;
  } else {
    warn(`  ✗ memory-bank-server: binary not found`);
  }

  if (cliSource) {
    if (installBinary(cliSource, `mb${exeExt}`)) installedCount++;
  } else {
    warn(`  ✗ mb: binary not found`);
  }

  if (hookSource) {
    if (installBinary(hookSource, `memory-bank-hook${exeExt}`)) installedCount++;
  } else {
    // Hook is optional
    log(`  ○ memory-bank-hook: optional, not found`);
  }

  if (mcpProxySource) {
    if (installBinary(mcpProxySource, `memory-bank-mcp-proxy${exeExt}`)) installedCount++;
  } else {
    // MCP proxy is optional
    log(`  ○ memory-bank-mcp-proxy: optional, not found`);
  }

  if (installedCount < 2) {
    warn('\nFailed to install required binaries (memory-bank-server and mb)');
    warn('To use MemoryBank, build from source:');
    warn('  cargo build --release --workspace');
    process.exit(0);
  }

  // Add to PATH
  log('\nConfiguring PATH:');
  const pathAdded = addToPath();
  if (!pathAdded) {
    log('  ! Could not auto-configure PATH');
    log(`  ! Add this to your shell profile: export PATH="${userBinDir}:$PATH"`);
  }

  log('');
  log('Installation complete! 🎉');
  log('');
  log('Quick start:');
  log('  mb-tui          # Launch Terminal UI');
  log('  mb setup        # Command-line setup wizard');
  log('  mb status       # Check server status');
  log('');
}

main().catch((error) => {
  console.error('[memory-bank] Fatal error:', error);
  process.exit(1);
});
