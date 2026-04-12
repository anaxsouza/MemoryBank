#!/usr/bin/env node
/**
 * Post-install script for memory-bank
 * Detects platform and copies the appropriate binary to ~/.memory_bank/bin/
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync, copyFileSync, chmodSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { homedir } from 'os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(__dirname, '..');

// Platform detection
const platform = process.platform;
const arch = process.arch;
const platformKey = `${platform}-${arch}`;

// Binary mapping
const binaryNames = {
  'darwin-arm64': 'memory-bank-server-darwin-arm64',
  'darwin-x64': 'memory-bank-server-darwin-x64',
  'linux-arm64': 'memory-bank-server-linux-arm64',
  'linux-x64': 'memory-bank-server-linux-x64',
  'win32-x64': 'memory-bank-server-win32-x64.exe'
};

const binaryName = binaryNames[platformKey];
const isWindows = platform === 'win32';
const exeExt = isWindows ? '.exe' : '';

// Paths
const userBinDir = join(homedir(), '.memory_bank', 'bin');
const targetBinaryName = `memory-bank-server${exeExt}`;
const targetBinaryPath = join(userBinDir, targetBinaryName);

function log(message) {
  console.log(`[memory-bank] ${message}`);
}

function warn(message) {
  console.warn(`[memory-bank] ${message}`);
}

async function main() {
  log('Installing MemoryBank...');
  log(`Platform: ${platformKey}`);

  // Check if binary exists for this platform
  if (!binaryName) {
    warn(`Platform ${platformKey} is not supported.`);
    warn('Supported platforms: darwin-arm64, darwin-x64, linux-arm64, linux-x64, win32-x64');
    warn('You may need to build from source: cargo build --release');
    process.exit(0);
  }

  // Create user bin directory
  if (!existsSync(userBinDir)) {
    mkdirSync(userBinDir, { recursive: true });
    log(`Created directory: ${userBinDir}`);
  }

  // Try to find binary in optional dependencies
  const optionalDepPath = join(
    packageRoot,
    'node_modules',
    `@memory-bank/server-${platformKey}`,
    binaryName
  );

  // Or look in local binaries directory
  const localBinaryPath = join(packageRoot, 'binaries', binaryName);

  let sourcePath = null;

  if (existsSync(optionalDepPath)) {
    sourcePath = optionalDepPath;
    log(`Found binary in optional dependency`);
  } else if (existsSync(localBinaryPath)) {
    sourcePath = localBinaryPath;
    log(`Found binary in package`);
  }

  if (!sourcePath) {
    warn(`Prebuilt binary not found for ${platformKey}`);
    warn('Expected one of:');
    warn(`  - ${optionalDepPath}`);
    warn(`  - ${localBinaryPath}`);
    warn('');
    warn('To use MemoryBank, either:');
    warn('  1. Install platform-specific package:');
    warn(`     npm install @memory-bank/server-${platformKey}`);
    warn('  2. Build from source:');
    warn('     cargo build --release --package memory-bank-server');
    process.exit(0);
  }

  // Copy binary to user bin directory
  try {
    copyFileSync(sourcePath, targetBinaryPath);
    chmodSync(targetBinaryPath, 0o755);
    log(`Binary installed: ${targetBinaryPath}`);
  } catch (error) {
    warn(`Failed to install binary: ${error.message}`);
    process.exit(1);
  }

  // Create shell wrapper for mb command
  const shellWrapperPath = join(userBinDir, `mb${exeExt}`);
  const shellWrapperContent = isWindows
    ? `@echo off\n"${targetBinaryPath}" %*`
    : `#!/bin/sh\nexec "${targetBinaryPath}" "$@"`;

  try {
    writeFileSync(shellWrapperPath, shellWrapperContent);
    chmodSync(shellWrapperPath, 0o755);
    log(`Shell wrapper created: ${shellWrapperPath}`);
  } catch (error) {
    warn(`Failed to create shell wrapper: ${error.message}`);
  }

  // Add to PATH instructions
  const pathExport = isWindows
    ? `setx PATH "%PATH%;${userBinDir}"`
    : `export PATH="${userBinDir}:$PATH"`;

  log('');
  log('Installation complete!');
  log('');
  log('To use the mb command, add the following to your shell profile:');
  log(`  ${pathExport}`);
  log('');
  log('Or run: mb-tui --help');
  log('');
}

main().catch((error) => {
  console.error('[memory-bank] Fatal error:', error);
  process.exit(1);
});
