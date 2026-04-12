#!/usr/bin/env node
/**
 * First-run initialization script for memory-bank
 * Checks if configuration exists and guides user through setup if needed
 */

import { existsSync, readFileSync } from 'fs';
import { join, homedir } from 'path';
import { spawn } from 'child_process';

const CONFIG_DIR = join(homedir(), '.memory_bank');
const SETTINGS_PATH = join(CONFIG_DIR, 'settings.toml');

function log(message) {
  console.log(`[memory-bank] ${message}`);
}

async function checkConfiguration() {
  // Check if settings.toml exists
  if (existsSync(SETTINGS_PATH)) {
    log('Configuration found!');
    log(`Settings: ${SETTINGS_PATH}`);
    return true;
  }
  
  return false;
}

async function runSetupWizard() {
  log('');
  log('╔════════════════════════════════════════════════════════════╗');
  log('║              Welcome to MemoryBank!                        ║');
  log('╚════════════════════════════════════════════════════════════╝');
  log('');
  log('It looks like this is your first time running MemoryBank.');
  log('');
  log('You have two options:');
  log('');
  log('1. Quick Setup (TUI): Run `mb-tui` for a visual setup wizard');
  log('2. CLI Setup: Run `mb setup` for command-line setup');
  log('');
  log('Or configure manually by creating:');
  log(`  ${SETTINGS_PATH}`);
  log('');
  log('Example configuration:');
  log('  [server]');
  log('  host = "127.0.0.1"');
  log('  port = 3737');
  log('');
  log('  [llm]');
  log('  provider = "openai"');
  log('  model = "gpt-4o"');
  log('');
  log('  [storage]');
  log('  namespace = "default"');
  log('');
}

async function showStatus() {
  log('');
  log('MemoryBank Status:');
  log('');
  
  // Try to read settings
  if (existsSync(SETTINGS_PATH)) {
    const settings = readFileSync(SETTINGS_PATH, 'utf8');
    const namespace = settings.match(/namespace\s*=\s*"([^"]+)"/)?.[1] || 'default';
    log(`  Namespace: ${namespace}`);
  }
  
  log(`  Config directory: ${CONFIG_DIR}`);
  log('');
  log('Run `mb-tui` to open the Terminal UI');
  log('Run `mb status` to check server status');
  log('');
}

async function main() {
  const isConfigured = await checkConfiguration();
  
  if (!isConfigured) {
    await runSetupWizard();
    process.exit(0);
  }
  
  await showStatus();
}

main().catch((error) => {
  console.error('[memory-bank] Error:', error);
  process.exit(1);
});
