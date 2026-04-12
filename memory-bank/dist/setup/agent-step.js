import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { AGENTS } from './types.js';
// Detect if agents are on PATH
function detectAgent(agent) {
    // In real implementation, this would check PATH
    // For now, return false for all (will be implemented with actual detection)
    return false;
}
export function AgentStep({ onSubmit, onBack, selectedAgents }) {
    const [agents, setAgents] = useState(() => AGENTS.map(agent => ({
        ...agent,
        detected: detectAgent(agent.kind),
        selected: selectedAgents.includes(agent.kind),
    })));
    const [selectedIndex, setSelectedIndex] = useState(0);
    useInput((input, key) => {
        if (key.escape) {
            onBack();
            return;
        }
        if (key.return) {
            const selected = agents.filter(a => a.selected).map(a => a.kind);
            onSubmit(selected);
            return;
        }
        if (key.upArrow) {
            setSelectedIndex(prev => (prev > 0 ? prev - 1 : agents.length - 1));
        }
        else if (key.downArrow) {
            setSelectedIndex(prev => (prev < agents.length - 1 ? prev + 1 : 0));
        }
        else if (input === ' ') {
            // Toggle selection
            setAgents(prev => prev.map((agent, idx) => idx === selectedIndex ? { ...agent, selected: !agent.selected } : agent));
        }
    });
    const selectedCount = agents.filter(a => a.selected).length;
    return (React.createElement(Box, { flexDirection: "column", padding: 1 },
        React.createElement(Box, { marginBottom: 1 },
            React.createElement(Text, { color: "cyan", bold: true }, "Step 5/6: Agent Integrations")),
        React.createElement(Box, { marginBottom: 1 },
            React.createElement(Text, { dimColor: true }, "Select AI agents to integrate with Memory Bank. Detected agents are marked with \u2713.")),
        React.createElement(Box, { flexDirection: "column", marginY: 1 }, agents.map((agent, index) => {
            const isSelected = index === selectedIndex;
            const isChecked = agent.selected;
            return (React.createElement(Box, { key: agent.kind },
                React.createElement(Text, null,
                    isSelected ? (React.createElement(Text, { color: "green", bold: true }, '> ')) : (React.createElement(Text, { dimColor: true }, '  ')),
                    React.createElement(Text, { color: isChecked ? 'green' : 'gray' }, isChecked ? '[x]' : '[ ]'),
                    ' ',
                    React.createElement(Text, { bold: isSelected }, agent.name),
                    agent.detected && (React.createElement(Text, { color: "green" }, " \u2713")),
                    React.createElement(Text, { dimColor: true },
                        " \u2014 ",
                        agent.description))));
        })),
        React.createElement(Box, { marginTop: 1, padding: 1, borderStyle: "round" },
            React.createElement(Text, null,
                "Selected: ",
                React.createElement(Text, { bold: true, color: "green" }, selectedCount),
                " agent",
                selectedCount !== 1 ? 's' : '')),
        React.createElement(Box, { marginTop: 2 },
            React.createElement(Text, { dimColor: true },
                React.createElement(Text, { bold: true }, "\u2191\u2193"),
                " Navigate \u2022 ",
                React.createElement(Text, { bold: true }, "Space"),
                " Toggle \u2022 ",
                React.createElement(Text, { bold: true }, "\u23CE"),
                " Continue \u2022 ",
                React.createElement(Text, { bold: true }, "Esc"),
                " Back"))));
}
//# sourceMappingURL=agent-step.js.map