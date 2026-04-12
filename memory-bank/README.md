# MemoryBank

Local memory service for AI agents with Terminal UI.

## Installation

```bash
npm install -g memory-bank
```

## Quick Start

```bash
# First time? Run the setup wizard
mb-tui

# Or use the command-line setup
mb setup

# Check status
mb status

# Start the server
mb service start

# Stop the server
mb service stop
```

## Features

- **Local-first** — All data stays on your machine
- **Terminal UI** — Rich visual interface with real-time updates
- **Multi-agent support** — Works with Claude Code, Codex, Gemini CLI, OpenCode, OpenClaw
- **Embeddings** — Local vector search with FastEmbed
- **MCP Protocol** — Model Context Protocol for AI agent integration

## Configuration

Configuration is stored in:
- Settings: `~/.memory_bank/settings.toml`
- Secrets: `~/.memory_bank/secrets.env`

## Requirements

- Node.js >= 18
- macOS (Intel/Apple Silicon), Linux (x64/ARM64), or Windows (x64)
- OpenAI API key or compatible endpoint

## Architecture

```
memory-bank (npm package)
├── memory-bank-server (Rust binary) — HTTP server + MCP
├── mb-tui (Node.js TUI) — Terminal dashboard
└── mb (Rust CLI) — Service management, config
```

## Development

```bash
# Clone repository
git clone https://github.com/anaxsouza/MemoryBank.git
cd MemoryBank

# Build Rust
cargo build --release --workspace

# Build TUI
cd tui && npm install && npm run build

# Run tests
cargo test --workspace
npm test --workspace=tui
```

## License

MIT
