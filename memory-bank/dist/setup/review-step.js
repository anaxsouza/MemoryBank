import React from 'react';
import { Box, Text, useInput } from 'ink';
import { PROVIDER_INFO } from './types.js';
const AGENT_NAMES = {
    claude_code: 'Claude Code',
    codex: 'Codex CLI',
    gemini_cli: 'Gemini CLI',
    opencode: 'OpenCode',
    openclaw: 'OpenClaw',
};
export function ReviewStep({ plan, onConfirm, onBack, onEdit }) {
    useInput((input, key) => {
        if (key.escape) {
            onBack();
            return;
        }
        if (key.return) {
            onConfirm();
            return;
        }
        // Quick navigation to steps
        if (input === '1')
            onEdit('provider');
        if (input === '2')
            onEdit('model');
        if (input === '3')
            onEdit('secret');
        if (input === '4')
            onEdit('namespace');
        if (input === '5')
            onEdit('agents');
    });
    const maskSecret = (secret) => {
        if (secret.length <= 8)
            return '•'.repeat(secret.length);
        return secret.slice(0, 4) + '••••' + secret.slice(-4);
    };
    return (React.createElement(Box, { flexDirection: "column", padding: 1 },
        React.createElement(Box, { marginBottom: 1 },
            React.createElement(Text, { color: "cyan", bold: true }, "Step 6/6: Review Configuration")),
        React.createElement(Box, { marginBottom: 1 },
            React.createElement(Text, { dimColor: true }, "Review your settings before applying. Press number keys to edit.")),
        React.createElement(Box, { flexDirection: "column", marginY: 1, padding: 1, borderStyle: "round" },
            React.createElement(Box, { marginY: 1 },
                React.createElement(Text, { dimColor: true }, "1. "),
                React.createElement(Text, { bold: true }, "Provider:"),
                ' ',
                React.createElement(Text, { color: "green" }, PROVIDER_INFO[plan.provider].name)),
            React.createElement(Box, { marginY: 1 },
                React.createElement(Text, { dimColor: true }, "2. "),
                React.createElement(Text, { bold: true }, "Model:"),
                ' ',
                React.createElement(Text, { color: "green" }, plan.model)),
            plan.apiKey && (React.createElement(Box, { marginY: 1 },
                React.createElement(Text, { dimColor: true }, "3. "),
                React.createElement(Text, { bold: true }, "API Key:"),
                ' ',
                React.createElement(Text, { color: "green" }, maskSecret(plan.apiKey)))),
            plan.openaiUrl && (React.createElement(Box, { marginY: 1 },
                React.createElement(Text, { dimColor: true }, "3. "),
                React.createElement(Text, { bold: true }, "Base URL:"),
                ' ',
                React.createElement(Text, { color: "green" }, plan.openaiUrl))),
            plan.ollamaUrl && (React.createElement(Box, { marginY: 1 },
                React.createElement(Text, { dimColor: true }, "3. "),
                React.createElement(Text, { bold: true }, "Ollama URL:"),
                ' ',
                React.createElement(Text, { color: "green" }, plan.ollamaUrl))),
            React.createElement(Box, { marginY: 1 },
                React.createElement(Text, { dimColor: true }, "4. "),
                React.createElement(Text, { bold: true }, "Namespace:"),
                ' ',
                React.createElement(Text, { color: "green" }, plan.namespace)),
            React.createElement(Box, { marginY: 1 },
                React.createElement(Text, { dimColor: true }, "   "),
                React.createElement(Text, { bold: true }, "Port:"),
                ' ',
                React.createElement(Text, { color: "green" }, plan.port)),
            React.createElement(Box, { marginY: 1 },
                React.createElement(Text, { dimColor: true }, "   "),
                React.createElement(Text, { bold: true }, "Auto-start:"),
                ' ',
                React.createElement(Text, { color: plan.autostart ? 'green' : 'red' }, plan.autostart ? 'Yes' : 'No')),
            React.createElement(Box, { marginY: 1 },
                React.createElement(Text, { dimColor: true }, "5. "),
                React.createElement(Text, { bold: true }, "Agents:"),
                ' ',
                plan.selectedAgents.length > 0 ? (React.createElement(Text, { color: "green" }, plan.selectedAgents.map(a => AGENT_NAMES[a] || a).join(', '))) : (React.createElement(Text, { dimColor: true }, "None selected")))),
        React.createElement(Box, { marginTop: 2 },
            React.createElement(Text, null,
                React.createElement(Text, { bold: true, color: "green" }, "\u23CE Enter"),
                React.createElement(Text, null, " to apply configuration"))),
        React.createElement(Box, null,
            React.createElement(Text, { dimColor: true },
                React.createElement(Text, { bold: true }, "1-5"),
                " Edit step \u2022 ",
                React.createElement(Text, { bold: true }, "Esc"),
                " Back"))));
}
//# sourceMappingURL=review-step.js.map