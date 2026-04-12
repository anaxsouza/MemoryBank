import React from 'react';
import { Box, Text, useInput } from 'ink';
export function WelcomeScreen({ onStart, onSkip, hasExistingConfig }) {
    useInput((input, key) => {
        if (key.return) {
            onStart();
        }
        else if (input === 's' || input === 'S') {
            onSkip?.();
        }
    });
    return (React.createElement(Box, { flexDirection: "column", padding: 1 },
        React.createElement(Box, { flexDirection: "column", marginBottom: 1 },
            React.createElement(Text, null,
                React.createElement(Text, { color: "cyan", bold: true }, "\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557")),
            React.createElement(Text, null,
                React.createElement(Text, { color: "cyan", bold: true }, "\u2551  "),
                React.createElement(Text, { color: "green", bold: true }, "MEMORY BANK"),
                React.createElement(Text, { color: "gray" }, "  Local memory service for AI agents"),
                React.createElement(Text, { color: "cyan", bold: true }, "          \u2551")),
            React.createElement(Text, null,
                React.createElement(Text, { color: "cyan", bold: true }, "\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D"))),
        hasExistingConfig ? (React.createElement(Box, { flexDirection: "column", marginY: 1 },
            React.createElement(Text, { color: "yellow" }, "\u26A1 Configuration already exists!"),
            React.createElement(Text, { dimColor: true }, "You can re-run setup to change settings, or skip to the dashboard."))) : (React.createElement(Box, { flexDirection: "column", marginY: 1 },
            React.createElement(Text, null, "Welcome! Let's get your Memory Bank configured."),
            React.createElement(Text, { dimColor: true }, "This wizard will guide you through:"))),
        React.createElement(Box, { flexDirection: "column", marginY: 1, paddingLeft: 2 },
            React.createElement(Text, { dimColor: true }, "  1. Choose your LLM provider (Anthropic, OpenAI, Ollama, etc.)"),
            React.createElement(Text, { dimColor: true }, "  2. Select your preferred model"),
            React.createElement(Text, { dimColor: true }, "  3. Configure API credentials"),
            React.createElement(Text, { dimColor: true }, "  4. Set up agent integrations (Claude Code, Codex, etc.)"),
            React.createElement(Text, { dimColor: true }, "  5. Review and apply settings")),
        React.createElement(Box, { flexDirection: "column", marginTop: 2 },
            React.createElement(Text, null,
                React.createElement(Text, { color: "green", bold: true }, "\u23CE Enter"),
                React.createElement(Text, null, " to start setup")),
            hasExistingConfig && onSkip && (React.createElement(Text, null,
                React.createElement(Text, { color: "yellow", bold: true }, "S"),
                React.createElement(Text, null, " to skip to dashboard"))),
            React.createElement(Text, null,
                React.createElement(Text, { color: "gray", bold: true }, "Ctrl+C"),
                React.createElement(Text, { dimColor: true }, " to exit"))),
        React.createElement(Box, { marginTop: 2 },
            React.createElement(Text, { dimColor: true }, "All data stays local. Your memories are stored in ~/.memory_bank/"))));
}
//# sourceMappingURL=welcome.js.map