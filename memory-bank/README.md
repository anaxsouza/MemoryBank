# @anaxsouza/memory-bank

[![npm version](https://img.shields.io/npm/v/@anaxsouza/memory-bank.svg)](https://www.npmjs.com/package/@anaxsouza/memory-bank)
[![CI](https://github.com/anaxsouza/MemoryBank/workflows/CI/badge.svg)](https://github.com/anaxsouza/MemoryBank/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

MemoryBank with Terminal UI — Local memory service for AI agents.

This package provides:
- **Memory Bank Server** — HTTP server for memory storage and retrieval
- **mb CLI** — Command-line interface for service management
- **mb-tui** — Terminal UI dashboard for monitoring and setup
- **Binary hooks** — For agent integrations (Claude Code, Codex, etc.)

> This is a fork of [feelingsonice/MemoryBank](https://github.com/feelingsonice/MemoryBank) with added TUI support.

## Installation

```bash
npm install -g @anaxsouza/memory-bank
```

Requirements:
- Node.js >= 18
- macOS (Apple Silicon/Intel), Linux (x64/ARM64), or Windows (x64)

## Quick Start

### First Run — Setup Wizard

The TUI automatically detects if you need to configure Memory Bank:

```bash
mb-tui
```

This launches an interactive wizard to:
1. Choose your LLM provider (OpenAI, Anthropic, Ollama, etc.)
2. Select a model
3. Configure API credentials
4. Set up agent integrations
5. Review and apply settings

### Dashboard Mode

If already configured, `mb-tui` shows the dashboard:

```bash
mb-tui                    # Dashboard with 10s refresh
mb-tui -i 5               # 5-second refresh interval
mb-tui --url http://localhost:8080  # Custom server URL
```

Dashboard shows:
- Server health status
- Memory statistics (total memories, date range)
- Namespace information
- Ingest queue status
- Auto-refreshing data

### Force Setup Wizard

To reconfigure even with existing settings:

```bash
mb-tui --setup
# or
mb-tui -s
```

## CLI Commands

The `mb` command provides service management:

```bash
mb status                 # Check server health
mb setup                  # Interactive CLI setup
mb service start          # Start background service
mb service stop           # Stop background service
mb service restart        # Restart service
mb config show            # Show current configuration
mb config set key value   # Update configuration
mb doctor                 # Diagnose issues
mb logs -f                # Follow server logs
```

## Configuration

Configuration is stored in:
- **Settings:** `~/.memory_bank/settings.toml`
- **Secrets:** `~/.memory_bank/secrets.env`
- **Data:** `~/.memory_bank/namespaces/<namespace>/memory.db`

Example `settings.toml`:
```toml
schema_version = 1
active_namespace = "default"

[service]
autostart = true
port = 3737

[server]
llm_provider = "open-ai"
llm_model = "gpt-4o"
openai_url = "https://api.openai.com/v1"
```

## Supported Agents

| Agent | Integration |
|-------|-------------|
| Claude Code | HTTP MCP + hooks |
| Codex | HTTP MCP + hooks |
| Gemini CLI | HTTP MCP + hooks |
| OpenCode | HTTP MCP + plugin |
| OpenClaw | stdio MCP proxy |

Setup configures these automatically if detected on your PATH.

## Architecture

```
┌─────────────────┐
│   AI Agents     │
│ (Claude/Codex/  │
│  Gemini/etc)    │
└────────┬────────┘
         │ capture/recall
         ▼
┌─────────────────┐     ┌──────────────────┐
│ memory-bank-    │────▶│   SQLite DB      │
│ server (Rust)   │     │   + Embeddings   │
│ Port: 3737      │     │   (local)        │
└────────┬────────┘     └──────────────────┘
         │
         │ /api/status
         ▼
┌─────────────────┐
│   mb-tui        │
│  (Terminal UI)  │
└─────────────────┘
```

## Development

Building from source:

```bash
# Clone
git clone https://github.com/anaxsouza/MemoryBank.git
cd MemoryBank

# Build Rust workspace
cargo build --release --workspace

# Build TUI
cd tui && npm install && npm run build

# Run tests
cargo test --workspace
cd tui && npm test
```

## Troubleshooting

### mb-tui not found after install

The postinstall script adds `~/.memory_bank/bin` to your PATH. Restart your shell or run:

```bash
source ~/.zshrc  # or ~/.bashrc
```

### Server not starting

Check logs:
```bash
mb logs -f
```

Common issues:
- Missing API key in `~/.memory_bank/secrets.env`
- Port 3737 already in use
- Corrupt database (backup and recreate namespace)

### TUI shows "Failed to connect"

Ensure the server is running:
```bash
mb service start
```

Or check with:
```bash
mb status
```

## License

MIT — See [LICENSE](https://github.com/anaxsouza/MemoryBank/blob/main/LICENSE)

## Repository

- **Fork:** https://github.com/anaxsouza/MemoryBank
- **Upstream:** https://github.com/feelingsonice/MemoryBank
- **npm:** https://www.npmjs.com/package/@anaxsouza/memory-bank
