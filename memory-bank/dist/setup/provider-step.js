import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { PROVIDER_INFO } from './types.js';
const providers = ['anthropic', 'openai', 'openai-compatible', 'ollama', 'gemini'];
export function ProviderStep({ onSelect, onBack, currentProvider }) {
    const [selectedIndex, setSelectedIndex] = useState(() => {
        if (currentProvider) {
            return providers.indexOf(currentProvider);
        }
        return 0;
    });
    useInput((input, key) => {
        if (key.upArrow) {
            setSelectedIndex((prev) => (prev > 0 ? prev - 1 : providers.length - 1));
        }
        else if (key.downArrow) {
            setSelectedIndex((prev) => (prev < providers.length - 1 ? prev + 1 : 0));
        }
        else if (key.return) {
            onSelect(providers[selectedIndex]);
        }
        else if (key.escape && onBack) {
            onBack();
        }
    });
    return (React.createElement(Box, { flexDirection: "column", padding: 1 },
        React.createElement(Box, { marginBottom: 1 },
            React.createElement(Text, { color: "cyan", bold: true }, "Step 1/6: Choose LLM Provider")),
        React.createElement(Box, { marginBottom: 1 },
            React.createElement(Text, { dimColor: true }, "Select the AI provider you want to use for memory processing.")),
        React.createElement(Box, { flexDirection: "column", marginY: 1 }, providers.map((providerId, index) => {
            const info = PROVIDER_INFO[providerId];
            const isSelected = index === selectedIndex;
            return (React.createElement(Box, { key: providerId },
                React.createElement(Text, null,
                    isSelected ? (React.createElement(Text, { color: "green", bold: true }, '> ')) : (React.createElement(Text, { dimColor: true }, '  ')),
                    React.createElement(Text, { bold: isSelected }, info.name),
                    React.createElement(Text, { dimColor: true },
                        " \u2014 ",
                        info.description))));
        })),
        React.createElement(Box, { flexDirection: "column", marginTop: 1, padding: 1, borderStyle: "round" },
            React.createElement(Text, { bold: true }, PROVIDER_INFO[providers[selectedIndex]].name),
            React.createElement(Text, { dimColor: true }, PROVIDER_INFO[providers[selectedIndex]].description),
            React.createElement(Box, { marginTop: 1 }, PROVIDER_INFO[providers[selectedIndex]].requiresKey ? (React.createElement(Text, { color: "yellow" }, "\uD83D\uDD11 Requires API key")) : (React.createElement(Text, { color: "green" }, "\u2713 No API key required")))),
        React.createElement(Box, { marginTop: 2 },
            React.createElement(Text, { dimColor: true },
                React.createElement(Text, { bold: true }, "\u2191\u2193"),
                " Navigate \u2022 ",
                React.createElement(Text, { bold: true }, "\u23CE"),
                " Select \u2022 ",
                React.createElement(Text, { bold: true }, "Esc"),
                " Back"))));
}
//# sourceMappingURL=provider-step.js.map