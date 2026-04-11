# Research History
> Maintained by Herodotus. A timeline of the research process — decisions, changes, failures, and patterns. Newest sessions at the top.
> Discipline: Software Engineering / AI Infrastructure
> Started: 2026-04-11

---

## 2026-04-11 15:30 — NVIDIA NIM API Compatibility Fix

[HYPOTHESIS] rig-core uses Responses API by default — incompatible with NVIDIA NIM which only supports Chat Completions API
            ↩ REVISES: Initial assumption that OpenAI-compatible endpoints work uniformly

[FAILURE]    Error 404 when using NVIDIA NIM API — `Invalid status code 404 Not Found with message: 404 page not found`
            ⚠ ROOT CAUSE: rig-core 0.31.0 sends requests to `/v1/responses` endpoint (Responses API) for structured outputs via `prompt_typed()`, but NVIDIA NIM only implements `/v1/chat/completions` (Chat Completions API)

[ANALYSIS]   Diagnosis performed via curl comparison — same credentials worked with direct curl to `/v1/chat/completions` but failed with MemoryBank
            ⚠ EVIDENCE: curl test returned HTTP 200 with valid response; MemoryBank returned 404

[METHOD]     Dual-path architecture implemented in `llm.rs` — separate code paths for OpenAI official API vs custom endpoints
            - OpenAi variant: Uses Responses API (`/v1/responses`) with `prompt_typed()` for structured outputs
            - OpenAiChat variant: Uses Chat Completions API (`/v1/chat/completions`) with regular `prompt()` + JSON extraction

[DECISION]   Dispatch logic based on base URL — default OpenAI URL routes to Responses API, custom URLs route to Chat Completions API
            ↩ REASON: Custom endpoints (NVIDIA NIM, OpenRouter, Groq, etc.) typically only implement Chat Completions API

[TOOL]       Added `extract_json_from_response()` helper function — handles non-JSON responses from providers that don't support `response_format` parameter
            ⚠ NECESSARY: NVIDIA NIM returns plain text or markdown-wrapped JSON instead of structured JSON

[RESULT]     Memory analysis: ✅ Working — returns valid JSON from NVIDIA NIM
[RESULT]     Graph evolution: ⚠️ Partial — needs further debugging for JSON parsing edge cases
            ⚠ PROGRESS: Error changed from 404 Not Found to JSON parsing issues — indicates API compatibility is resolved

[DATA]       Modified file: `/Users/anaxsouza/Documents/Github/MemoryBank/memory-bank-server/src/llm.rs`
            - Added `Prompt` trait import alongside `TypedPrompt`
            - Added `OpenAiChatStructuredLlm` type alias for Chat Completions API
            - Added `OpenAiChat` enum variant to `LlmClient`
            - Implemented `analyze_memory_window_chat()` method
            - Implemented `generate_memory_evolution_chat()` method
            - Modified `build_openai_llm()` to dispatch based on `base_url`
            - Added `build_openai_chat_llm()` constructor function
            - Added unit tests for both API paths

[LITERATURE] Referenced NVIDIA NIM documentation: https://docs.nvidia.com/nim/large-language-models/latest/getting-started.html

---

## 2026-04-03 22:15 — Bug Fixes in Plugins

[TOOL]       Fixed bugs in OpenCode and OpenClaw plugins — improved event capture reliability
            ↩ FILES: `.opencode/plugins/memory-bank.js`, `.openclaw/extensions/memory-bank/index.js`

[ANALYSIS]   Added test coverage for both plugins — 76 lines in OpenClaw tests, 50 lines in OpenCode tests

---

## 2026-04-03 12:09 — OpenAI Custom Endpoint Support

[METHOD]     Added support for custom OpenAI-compatible endpoints — allows configuration of alternative base URLs
            ↩ FILES: `memory-bank-cli/src/config.rs`, `memory-bank-server/src/config.rs`, `memory-bank-server/src/llm.rs`

[DECISION]   Configuration via `mb config set server.openai_url <url>` — managed service path
            ↩ REASON: Users need to use alternative providers like OpenCode Zen, Azure OpenAI, or self-hosted models

[TOOL]       Added `openai_url` field to `LlmProviderConfig::OpenAi` — defaults to `DEFAULT_OPENAI_URL`

[ANALYSIS]   Updated documentation in README.md — added "Custom OpenAI Endpoints" section with configuration examples

---

## 2026-04-02 16:34 — Documentation Update

[DATA]       Added citation information to README.md — reference to arXiv paper "A-mem: Agentic memory for llm agents"

---

## 2026-04-01 19:28 — Bug Fixes and Improved Logging

[FAILURE]    Various bugs in CLI workflow and service management — fixed in this release

[TOOL]       Improved logging configuration — added `RUST_LOG` environment variable support for debugging

[METHOD]     Enhanced troubleshooting documentation — added common issues and solutions

---

## 2026-04-01 — Codex Support Added

[METHOD]     Implemented Codex agent support — hooks-based capture path similar to Claude Code

[TOOL]       Added `memory-bank-hook` binary for normalizing hook events into shared ingest format

---

## 2026-03-31 — CLI Workflow Implementation

[METHOD]     Implemented `mb` CLI tool — user-facing interface for setup, status, logs, namespace switching, and diagnostics

[DECISION]   Managed background service architecture — Memory Bank runs as local daemon exposing `/ingest`, `/mcp`, and `/healthz` endpoints
            ↩ REASON: Separation of concerns between user interface and service logic

[DATA]       Created namespaced SQLite database structure — `~/.memory_bank/namespaces/<namespace>/memory.db`

---

## 2026-03-30 — Initial Fork

[DATA]       Repository forked from github.com/feelingsonice/MemoryBank to github.com/anaxsouza/MemoryBank
            ↩ ORIGINAL: Rust-based local memory service for AI agents

[ARCHITECTURE] Initial project structure:
            - `memory-bank-server`: Core service with LLM integration via rig-core 0.31.0
            - `memory-bank-cli`: Command-line interface (`mb` binary)
            - `memory-bank-app`: Shared library with configuration and utilities
            - `memory-bank-hook`: Event normalization binary

[METHOD]     Memory lifecycle implemented:
            1. Agent emits events (hooks/plugins/extensions)
            2. `memory-bank-hook` normalizes to ingest format
            3. Service assembles finalized turns
            4. LLM analyzes turn for structured memory
            5. SQLite storage with local embeddings
            6. MCP-based retrieval for future sessions

[TOOL]       Supported agents at fork: Claude Code, Codex, Gemini CLI, OpenCode, OpenClaw
            - Capture path: Agent-specific (hooks/plugins/extensions)
            - Recall path: HTTP MCP (stdio proxy for OpenClaw)

[LITERATURE] Based on "A-mem: Agentic memory for llm agents" (Xu et al., 2025, arXiv:2502.12110)

---

## Project Origin

**Original Repository:** github.com/feelingsonice/MemoryBank
**Forked By:** Ana Souza (github.com/anaxsouza)
**Fork Date:** 2026-03-30
**Purpose:** Local memory service for AI agents with cross-session persistence

### Technical Stack at Fork

| Component | Technology |
|-----------|-------------|
| Language | Rust |
| LLM Abstraction | rig-core 0.31.0 |
| Storage | SQLite |
| Embeddings | Local models (FastEmbed) |
| Protocol | MCP (Model Context Protocol) |
| Supported Providers | OpenAI, Anthropic, Gemini, Ollama |

### Key Architectural Decisions

1. **Separate capture and recall paths** — Different agents have different event mechanisms
2. **Namespaced databases** — Isolation between projects/teams
3. **Local ownership** — No cloud dependency for storage
4. **Provider abstraction** — Internal LLM separate from agent's model

---

## Research Questions

### Active Investigation

1. **Q1:** Why does graph evolution still have JSON parsing issues after the fix?
   - Status: Partially resolved
   - Next: Debug JSON extraction edge cases in `extract_json_from_response()`

### Resolved

1. **Q1 (Original):** Why does NVIDIA NIM return 404 when used as OpenAI-compatible provider?
   - Resolution: rig-core uses Responses API by default; NVIDIA NIM only supports Chat Completions API
   - Fix: Dual-path architecture with URL-based dispatch

---

## Files Modified Summary

| Date | File | Change Type |
|------|------|-------------|
| 2026-04-11 | `memory-bank-server/src/llm.rs` | Major — NVIDIA NIM compatibility |
| 2026-04-03 | `.opencode/plugins/memory-bank.js` | Bug fix |
| 2026-04-03 | `.openclaw/extensions/memory-bank/index.js` | Bug fix |
| 2026-04-03 | `memory-bank-cli/src/config.rs` | Feature — custom endpoints |
| 2026-04-03 | `memory-bank-server/src/config.rs` | Feature — custom endpoints |

---

## Configuration Reference

### NVIDIA NIM Configuration (Working)

```toml
[server]
llm_provider = "open-ai"
llm_model = "meta/llama-3.1-8b-instruct"
openai_url = "https://integrate.api.nvidia.com/v1"
```

Environment variables:
- `OPENAI_API_KEY`: NVIDIA API key (nvapi-xxx)
- `OPENAI_BASE_URL`: `https://integrate.api.nvidia.com/v1`

### OpenCode Zen Configuration (Working)

```toml
[server]
llm_provider = "open-ai"
llm_model = "qwen3.6-plus-free"
openai_url = "https://opencode.ai/zen/v1"
```

---

## Known Issues

| Issue | Status | Workaround |
|-------|--------|------------|
| NVIDIA NIM 404 error | ✅ Fixed | Use latest `llm.rs` with dual-path dispatch |
| Graph evolution JSON parsing | ⚠️ Partial | Under investigation |
| Ollama URL validation | ✅ Fixed | Must point to native API root, not `/v1` |

---

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| rig-core | 0.31.0 | LLM provider abstraction |
| sqlite | — | Local storage |
| schemars | — | JSON schema generation |
| serde | — | Serialization |
| chrono | — | Timestamp handling |
| tracing | — | Logging |
| ureq | — | HTTP client for Ollama verification |

---

## Next Steps

1. [ ] Debug JSON parsing edge cases in graph evolution
2. [ ] Add integration tests for NVIDIA NIM endpoint
3. [ ] Document custom endpoint configuration in troubleshooting guide
4. [ ] Consider upstream contribution to rig-core for NVIDIA NIM compatibility
5. [ ] Test with other OpenAI-compatible providers (OpenRouter, Groq)

---

*Last updated: 2026-04-11 15:30*