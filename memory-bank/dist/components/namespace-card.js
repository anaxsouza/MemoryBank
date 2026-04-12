import React from 'react';
import { Box, Text } from 'ink';
function formatBytes(bytes) {
    if (bytes === 0)
        return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
export function NamespaceCard({ namespace }) {
    return (React.createElement(Box, { flexDirection: "column", borderStyle: "round", borderColor: "blue", paddingX: 1, paddingY: 1 },
        React.createElement(Box, { marginBottom: 1 },
            React.createElement(Text, { bold: true, color: "blue" }, "\uD83D\uDCC1 Namespace")),
        React.createElement(Box, { flexDirection: "column", gap: 1 },
            React.createElement(Box, { flexDirection: "row" },
                React.createElement(Text, { dimColor: true }, "Name: "),
                React.createElement(Text, { bold: true, color: "blue" }, namespace.name)),
            React.createElement(Box, { flexDirection: "row" },
                React.createElement(Text, { dimColor: true }, "DB Size: "),
                React.createElement(Text, null, formatBytes(namespace.db_size_bytes))),
            React.createElement(Box, { flexDirection: "column", marginTop: 1 },
                React.createElement(Text, { dimColor: true }, "Database Path:"),
                React.createElement(Text, { wrap: "wrap", dimColor: true }, namespace.db_path)))));
}
//# sourceMappingURL=namespace-card.js.map