import React from 'react';
import { Box, Text } from 'ink';
export function Header({ isConnected, lastUpdated }) {
    return (React.createElement(Box, { flexDirection: "column" },
        React.createElement(Box, { flexDirection: "row", justifyContent: "space-between" },
            React.createElement(Box, { flexDirection: "row" },
                React.createElement(Text, { bold: true, color: "cyan" }, "\uD83E\uDDE0 Memory Bank")),
            React.createElement(Box, { flexDirection: "row", gap: 1 },
                React.createElement(Text, { color: isConnected ? 'green' : 'red' }, isConnected ? '●' : '○'),
                React.createElement(Text, { color: isConnected ? 'green' : 'red' }, isConnected ? 'Connected' : 'Disconnected'))),
        lastUpdated && (React.createElement(Box, { marginTop: 1 },
            React.createElement(Text, { dimColor: true },
                "Last updated: ",
                lastUpdated.toLocaleTimeString())))));
}
//# sourceMappingURL=header.js.map