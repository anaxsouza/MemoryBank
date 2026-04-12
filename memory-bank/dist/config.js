import meow from 'meow';
const DEFAULT_URL = 'http://127.0.0.1:3737';
const DEFAULT_INTERVAL = 10;
export function getConfig() {
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
        },
        help: `
    Usage
      $ mb-tui [options]

    Options
      --url, -u       Memory Bank server URL (default: ${DEFAULT_URL})
      --interval, -i  Refresh interval in seconds (default: ${DEFAULT_INTERVAL})
      --help          Show help
      --version       Show version

    Examples
      $ mb-tui
      $ mb-tui --url http://localhost:8080
      $ mb-tui -i 5
      
    Environment Variables
      MEMORY_BANK_URL    Server URL (overridden by --url flag)
  `,
    });
    // Priority: CLI flag > env var > default
    const url = cli.flags.url ?? process.env.MEMORY_BANK_URL ?? DEFAULT_URL;
    const interval = cli.flags.interval ?? DEFAULT_INTERVAL;
    return {
        url: url.replace(/\/$/, ''), // Remove trailing slash
        interval: Math.max(1, interval), // Minimum 1 second
    };
}
//# sourceMappingURL=config.js.map