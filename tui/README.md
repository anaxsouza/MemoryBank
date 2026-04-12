# @memory-bank/tui

Terminal UI for MemoryBank - Local memory service for AI agents

## Installation

```bash
npm install -g @memory-bank/tui
```

## Usage

```bash
# Start the TUI (connects to http://127.0.0.1:3737 by default)
mb-tui

# Connect to a different server
mb-tui --url http://localhost:8080

# Change refresh interval (default: 10 seconds)
mb-tui -i 5

# Use environment variable
MEMORY_BANK_URL=http://localhost:8080 mb-tui
```

## Features

- **Real-time dashboard** - Auto-refreshes every 10 seconds
- **Server Health** - Status, version, namespace, LLM config
- **Namespace Info** - Database size and path
- **Memory Statistics** - Total count, timestamps, tags, keywords
- **Ingest Turns** - Status breakdown (stored, processing, open, etc.)

## Requirements

- Node.js >= 18
- MemoryBank server running

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Development mode (watch)
npm run dev
```

## Architecture

The TUI is a React application built with [ink](https://github.com/vadimdemedes/ink) that connects to the MemoryBank server via HTTP API (`/api/status`).

## License

MIT
