import meow from 'meow';

export interface Config {
  url: string;
  interval: number; // seconds
  forceSetup: boolean;
}

const DEFAULT_URL = 'http://127.0.0.1:3737';
const DEFAULT_INTERVAL = 10;

export function getConfig(): Config {
  const cli = meow({
    importMeta: import.meta,
    flags: {
      url: {
        type: 'string',
        short: 'u',
      },
      interval: {
        type: 'number',
        short: 'i',
      },
      setup: {
        type: 'boolean',
        short: 's',
        default: false,
      },
      welcome: {
        type: 'boolean',
        default: false,
      },
    },
    help: `
    Usage
      $ mb-tui [options]

    Options
      --url, -u       Memory Bank server URL (default: ${DEFAULT_URL})
      --interval, -i  Refresh interval in seconds (default: ${DEFAULT_INTERVAL})
      --setup, -s     Force setup wizard (ignore existing config)
      --welcome       Show welcome/setup wizard on startup
      --help          Show help
      --version       Show version

    Examples
      $ mb-tui
      $ mb-tui --url http://localhost:8080
      $ mb-tui -i 5
      $ mb-tui --setup    # Re-run setup wizard
      
    Environment Variables
      MEMORY_BANK_URL    Server URL (overridden by --url flag)
  `,
  });

  // Priority: CLI flag > env var > default
  const url = cli.flags.url ?? process.env.MEMORY_BANK_URL ?? DEFAULT_URL;
  const interval = cli.flags.interval ?? DEFAULT_INTERVAL;
  const forceSetup = cli.flags.setup || cli.flags.welcome || false;

  return {
    url: url.replace(/\/+$/, ''), // Remove trailing slashes
    interval: Math.max(1, interval), // Minimum 1 second
    forceSetup,
  };
}
