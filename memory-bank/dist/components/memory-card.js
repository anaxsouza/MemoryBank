import React from 'react';
import { Box, Text } from 'ink';
function formatTimestamp(isoString) {
    if (!isoString)
        return '--';
    try {
        const date = new Date(isoString);
        return date.toLocaleString();
    }
    catch {
        return isoString;
    }
}
export function MemoryCard({ memories }) {
    return (React.createElement(Box, { flexDirection: "column", borderStyle: "round", borderColor: "green", paddingX: 1, paddingY: 1 },
        React.createElement(Box, { marginBottom: 1 },
            React.createElement(Text, { bold: true, color: "green" }, "\uD83D\uDCBE Memory Statistics")),
        React.createElement(Box, { flexDirection: "column", gap: 1 },
            React.createElement(Box, { flexDirection: "row" },
                React.createElement(Text, { dimColor: true }, "Total Memories: "),
                React.createElement(Text, { bold: true, color: "green" }, memories.total_count.toLocaleString())),
            React.createElement(Box, { flexDirection: "row" },
                React.createElement(Text, { dimColor: true }, "Earliest: "),
                React.createElement(Text, { dimColor: true }, formatTimestamp(memories.earliest_timestamp))),
            React.createElement(Box, { flexDirection: "row" },
                React.createElement(Text, { dimColor: true }, "Latest: "),
                React.createElement(Text, { dimColor: true }, formatTimestamp(memories.latest_timestamp))),
            memories.unique_tags.length > 0 && (React.createElement(React.Fragment, null,
                React.createElement(Box, { marginTop: 1 },
                    React.createElement(Text, { dimColor: true },
                        "Tags (",
                        memories.unique_tags.length,
                        "):")),
                React.createElement(Box, { flexDirection: "row", flexWrap: "wrap", gap: 1 },
                    memories.unique_tags.slice(0, 8).map((tag, i) => (React.createElement(Text, { key: i, color: "gray" },
                        "[",
                        tag,
                        "]"))),
                    memories.unique_tags.length > 8 && (React.createElement(Text, { dimColor: true },
                        "+",
                        memories.unique_tags.length - 8,
                        " more"))))),
            memories.unique_keywords.length > 0 && (React.createElement(React.Fragment, null,
                React.createElement(Box, { marginTop: 1 },
                    React.createElement(Text, { dimColor: true },
                        "Keywords (",
                        memories.unique_keywords.length,
                        "):")),
                React.createElement(Box, { flexDirection: "row", flexWrap: "wrap", gap: 1 },
                    memories.unique_keywords.slice(0, 8).map((keyword, i) => (React.createElement(Text, { key: i, color: "gray" },
                        "[",
                        keyword,
                        "]"))),
                    memories.unique_keywords.length > 8 && (React.createElement(Text, { dimColor: true },
                        "+",
                        memories.unique_keywords.length - 8,
                        " more"))))))));
}
//# sourceMappingURL=memory-card.js.map