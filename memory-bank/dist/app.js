import React from 'react';
import { Box, Text, useApp } from 'ink';
import { Header } from './components/header.js';
import { HealthCard } from './components/health-card.js';
import { NamespaceCard } from './components/namespace-card.js';
import { MemoryCard } from './components/memory-card.js';
import { IngestCard } from './components/ingest-card.js';
import { useStatus } from './hooks/use-status.js';
export function App({ url, interval }) {
    const { exit } = useApp();
    const { data, isLoading, isConnected, error, lastUpdated } = useStatus(url, interval);
    if (isLoading && !data) {
        return (React.createElement(Box, { padding: 1 },
            React.createElement(Header, { isConnected: false, lastUpdated: null }),
            React.createElement(Box, { marginTop: 1 }, "Loading Memory Bank status...")));
    }
    if (error && !data) {
        return (React.createElement(Box, { padding: 1, flexDirection: "column" },
            React.createElement(Header, { isConnected: false, lastUpdated: null }),
            React.createElement(Box, { marginTop: 1 }, "\u274C Failed to connect to Memory Bank server"),
            React.createElement(Box, { marginTop: 1 },
                "Error: ",
                error),
            React.createElement(Box, { marginTop: 1 },
                React.createElement(Text, { dimColor: true },
                    "Make sure the server is running at ",
                    url)),
            React.createElement(Box, { marginTop: 1 },
                React.createElement(Text, { dimColor: true }, "Press Ctrl+C to exit"))));
    }
    return (React.createElement(Box, { flexDirection: "column", padding: 1 },
        React.createElement(Header, { isConnected: isConnected, lastUpdated: lastUpdated }),
        React.createElement(Box, { flexDirection: "row", marginTop: 1, gap: 2 },
            React.createElement(Box, { flexDirection: "column", gap: 1, width: "50%" },
                data?.health && React.createElement(HealthCard, { health: data.health }),
                data?.namespace && React.createElement(NamespaceCard, { namespace: data.namespace })),
            React.createElement(Box, { flexDirection: "column", gap: 1, width: "50%" },
                data?.memories && React.createElement(MemoryCard, { memories: data.memories }),
                data?.ingest && React.createElement(IngestCard, { ingest: data.ingest }))),
        React.createElement(Box, { marginTop: 1 },
            React.createElement(Text, { dimColor: true },
                "Press Ctrl+C to exit | Auto-refresh: ",
                interval,
                "s"))));
}
//# sourceMappingURL=app.js.map