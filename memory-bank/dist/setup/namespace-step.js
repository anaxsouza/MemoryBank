import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { DEFAULTS } from './types.js';
export function NamespaceStep({ onSubmit, onBack, currentNamespace, currentPort, currentAutostart }) {
    const [namespace, setNamespace] = useState(currentNamespace || DEFAULTS.namespace);
    const [port, setPort] = useState(String(currentPort || DEFAULTS.port));
    const [autostart, setAutostart] = useState(currentAutostart ?? true);
    const [focusedField, setFocusedField] = useState('namespace');
    useInput((input, key) => {
        if (key.escape) {
            onBack();
            return;
        }
        if (key.tab) {
            setFocusedField(prev => {
                if (prev === 'namespace')
                    return 'port';
                if (prev === 'port')
                    return 'autostart';
                return 'namespace';
            });
            return;
        }
        if (key.return) {
            if (focusedField === 'autostart') {
                // Submit all
                const portNum = parseInt(port, 10);
                if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
                    return; // Invalid port
                }
                onSubmit(namespace, portNum, autostart);
            }
            else {
                // Move to next field
                setFocusedField(prev => {
                    if (prev === 'namespace')
                        return 'port';
                    if (prev === 'port')
                        return 'autostart';
                    return 'autostart';
                });
            }
            return;
        }
        if (key.backspace || key.delete) {
            if (focusedField === 'namespace') {
                setNamespace(prev => prev.slice(0, -1));
            }
            else if (focusedField === 'port') {
                setPort(prev => prev.slice(0, -1));
            }
            return;
        }
        if (focusedField === 'autostart') {
            if (input === 'y' || input === 'Y') {
                setAutostart(true);
            }
            else if (input === 'n' || input === 'N') {
                setAutostart(false);
            }
            return;
        }
        // Regular input
        if (input && !key.ctrl && !key.meta) {
            if (focusedField === 'namespace') {
                // Sanitize namespace: letters, numbers, hyphens, underscores only
                if (/^[a-zA-Z0-9_-]$/.test(input)) {
                    setNamespace(prev => prev + input);
                }
            }
            else if (focusedField === 'port') {
                // Only digits for port
                if (/^\d$/.test(input)) {
                    setPort(prev => prev + input);
                }
            }
        }
    });
    return (React.createElement(Box, { flexDirection: "column", padding: 1 },
        React.createElement(Box, { marginBottom: 1 },
            React.createElement(Text, { color: "cyan", bold: true }, "Step 4/6: Server Configuration")),
        React.createElement(Box, { marginBottom: 1 },
            React.createElement(Text, { dimColor: true }, "Configure the Memory Bank server settings.")),
        React.createElement(Box, { flexDirection: "column", marginY: 1 },
            React.createElement(Text, { bold: focusedField === 'namespace' },
                focusedField === 'namespace' ? React.createElement(Text, { color: "green" }, '>') : ' ',
                "Namespace (data isolation):"),
            React.createElement(Box, { marginY: 1, paddingX: 1, borderStyle: focusedField === 'namespace' ? 'double' : 'single' },
                React.createElement(Text, null, namespace),
                focusedField === 'namespace' && React.createElement(Text, { color: "green" }, "_")),
            React.createElement(Text, { dimColor: true }, "Letters, numbers, hyphens, underscores only")),
        React.createElement(Box, { flexDirection: "column", marginY: 1 },
            React.createElement(Text, { bold: focusedField === 'port' },
                focusedField === 'port' ? React.createElement(Text, { color: "green" }, '>') : ' ',
                "Server Port:"),
            React.createElement(Box, { marginY: 1, paddingX: 1, borderStyle: focusedField === 'port' ? 'double' : 'single' },
                React.createElement(Text, null, port),
                focusedField === 'port' && React.createElement(Text, { color: "green" }, "_"))),
        React.createElement(Box, { flexDirection: "column", marginY: 1 },
            React.createElement(Text, { bold: focusedField === 'autostart' },
                focusedField === 'autostart' ? React.createElement(Text, { color: "green" }, '>') : ' ',
                "Auto-start service: ",
                ' ',
                React.createElement(Text, { color: autostart ? 'green' : 'red' }, autostart ? 'Yes' : 'No')),
            focusedField === 'autostart' && (React.createElement(Box, { marginTop: 1 },
                React.createElement(Text, { dimColor: true },
                    "Press ",
                    React.createElement(Text, { bold: true }, "Y"),
                    " for Yes, ",
                    React.createElement(Text, { bold: true }, "N"),
                    " for No")))),
        React.createElement(Box, { marginTop: 2 },
            React.createElement(Text, { dimColor: true },
                React.createElement(Text, { bold: true }, "Tab"),
                " Switch field \u2022 ",
                React.createElement(Text, { bold: true }, "\u23CE"),
                " Continue \u2022 ",
                React.createElement(Text, { bold: true }, "Esc"),
                " Back"))));
}
//# sourceMappingURL=namespace-step.js.map