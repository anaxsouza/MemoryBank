import React from 'react';
import { Box, Text } from 'ink';
export function HealthCard({ health }) {
    return (React.createElement(Box, { flexDirection: "column", borderStyle: "round", borderColor: "cyan", paddingX: 1, paddingY: 1 },
        React.createElement(Box, { marginBottom: 1 },
            React.createElement(Text, { bold: true, color: "cyan" }, "\u26A1 Server Health")),
        React.createElement(Box, { flexDirection: "column", gap: 1 },
            React.createElement(Box, { flexDirection: "row" },
                React.createElement(Text, { dimColor: true }, "Status: "),
                React.createElement(Text, { color: health.ok ? 'green' : 'red', bold: true }, health.ok ? 'Healthy' : 'Unhealthy')),
            React.createElement(Box, { flexDirection: "row" },
                React.createElement(Text, { dimColor: true }, "Version: "),
                React.createElement(Text, null, health.version)),
            React.createElement(Box, { flexDirection: "row" },
                React.createElement(Text, { dimColor: true }, "Namespace: "),
                React.createElement(Text, { bold: true, color: "cyan" }, health.namespace)),
            React.createElement(Box, { flexDirection: "row" },
                React.createElement(Text, { dimColor: true }, "Port: "),
                React.createElement(Text, null, health.port)),
            React.createElement(Box, { flexDirection: "row" },
                React.createElement(Text, { dimColor: true }, "LLM: "),
                React.createElement(Text, null, health.llm_provider)),
            health.llm_model_id && (React.createElement(Box, { flexDirection: "row" },
                React.createElement(Text, { dimColor: true }, "Model: "),
                React.createElement(Text, null, health.llm_model_id.split('::').pop()))),
            React.createElement(Box, { flexDirection: "row" },
                React.createElement(Text, { dimColor: true }, "Encoder: "),
                React.createElement(Text, null, health.encoder_provider)),
            health.encoder_model_id && (React.createElement(Box, { flexDirection: "row" },
                React.createElement(Text, { dimColor: true }, "Encoder Model: "),
                React.createElement(Text, null, health.encoder_model_id.split('::').pop()))))));
}
//# sourceMappingURL=health-card.js.map