import React from 'react';
import { Box, Text } from 'ink';
const STATUS_COLORS = {
    stored: 'green',
    processing: 'yellow',
    open: 'gray',
    finalized: 'gray',
    aborted: 'red',
    failed: 'red',
    exhausted: 'red',
};
export function IngestCard({ ingest }) {
    const totalTurns = ingest.turns_by_status.reduce((sum, s) => sum + s.count, 0);
    // Sort by count descending
    const sorted = [...ingest.turns_by_status].sort((a, b) => b.count - a.count);
    return (React.createElement(Box, { flexDirection: "column", borderStyle: "round", borderColor: "yellow", paddingX: 1, paddingY: 1 },
        React.createElement(Box, { marginBottom: 1 },
            React.createElement(Text, { bold: true, color: "yellow" }, "\uD83D\uDD04 Ingest Turns")),
        React.createElement(Box, { flexDirection: "column", gap: 1 },
            React.createElement(Box, { flexDirection: "row" },
                React.createElement(Text, { dimColor: true }, "Total Turns: "),
                React.createElement(Text, { bold: true, color: "yellow" }, totalTurns.toLocaleString())),
            React.createElement(Box, { flexDirection: "column", marginTop: 1, gap: 1 },
                sorted.map((item, i) => (React.createElement(Box, { key: i, flexDirection: "row", justifyContent: "space-between" },
                    React.createElement(Text, { color: STATUS_COLORS[item.status] || 'gray' },
                        "\u25CF ",
                        item.status),
                    React.createElement(Text, { bold: true }, item.count.toLocaleString())))),
                sorted.length === 0 && (React.createElement(Text, { dimColor: true }, "No ingest data"))))));
}
//# sourceMappingURL=ingest-card.js.map