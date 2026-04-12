import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { PROVIDER_ENV_VARS, PROVIDER_INFO, DEFAULTS } from './types.js';
export function SecretStep({ provider, onSubmit, onBack, currentSecret, currentUrl }) {
    const [secret, setSecret] = useState(currentSecret || '');
    const [url, setUrl] = useState(currentUrl || '');
    const [showSecret, setShowSecret] = useState(false);
    const [focusedField, setFocusedField] = useState('secret');
    const providerInfo = PROVIDER_INFO[provider];
    const envVarName = PROVIDER_ENV_VARS[provider];
    const needsUrl = providerInfo.requiresUrl;
    // Check if already set in environment
    const envValue = envVarName ? process.env[envVarName] : undefined;
    useInput((input, key) => {
        if (key.escape) {
            onBack();
            return;
        }
        if (key.tab && needsUrl) {
            setFocusedField(prev => prev === 'secret' ? 'url' : 'secret');
            return;
        }
        if (key.return) {
            if (needsUrl && focusedField === 'secret' && secret) {
                setFocusedField('url');
                return;
            }
            // Validate and submit
            if (providerInfo.requiresKey && !secret && !envValue) {
                return; // Can't proceed without secret
            }
            if (needsUrl && !url) {
                return; // Can't proceed without URL
            }
            onSubmit(secret || envValue || '', url || undefined);
            return;
        }
        if (key.backspace || key.delete) {
            if (focusedField === 'secret') {
                setSecret(prev => prev.slice(0, -1));
            }
            else {
                setUrl(prev => prev.slice(0, -1));
            }
            return;
        }
        // Toggle visibility with 'v'
        if (input === 'v' && key.ctrl) {
            setShowSecret(prev => !prev);
            return;
        }
        // Regular input
        if (input && !key.ctrl && !key.meta) {
            if (focusedField === 'secret') {
                setSecret(prev => prev + input);
            }
            else {
                setUrl(prev => prev + input);
            }
        }
    });
    const maskText = (text) => showSecret ? text : '•'.repeat(text.length);
    return (React.createElement(Box, { flexDirection: "column", padding: 1 },
        React.createElement(Box, { marginBottom: 1 },
            React.createElement(Text, { color: "cyan", bold: true },
                "Step 3/6: Configure ",
                providerInfo.name)),
        envValue && (React.createElement(Box, { marginBottom: 1, padding: 1, borderStyle: "round", borderColor: "green" },
            React.createElement(Text, { color: "green" },
                "\u2713 Found ",
                envVarName,
                " in environment"),
            React.createElement(Text, { dimColor: true }, "You can use this or enter a different key below."))),
        providerInfo.requiresKey && (React.createElement(Box, { flexDirection: "column", marginY: 1 },
            React.createElement(Text, { bold: focusedField === 'secret' },
                focusedField === 'secret' ? React.createElement(Text, { color: "green" }, '>') : ' ',
                "API Key ",
                envVarName ? `(${envVarName})` : '',
                ":"),
            React.createElement(Box, { marginY: 1, paddingX: 1, borderStyle: focusedField === 'secret' ? 'double' : 'single' },
                React.createElement(Text, null, secret ? maskText(secret) : React.createElement(Text, { dimColor: true }, showSecret ? 'sk-...' : '••••••••')),
                focusedField === 'secret' && React.createElement(Text, { color: "green" }, "_")),
            React.createElement(Text, { dimColor: true },
                React.createElement(Text, { bold: true }, "Ctrl+V"),
                " to toggle visibility \u2022 ",
                React.createElement(Text, { bold: true }, "Tab"),
                " to switch fields"))),
        needsUrl && (React.createElement(Box, { flexDirection: "column", marginY: 1 },
            React.createElement(Text, { bold: focusedField === 'url' },
                focusedField === 'url' ? React.createElement(Text, { color: "green" }, '>') : ' ',
                "Base URL:"),
            React.createElement(Box, { marginY: 1, paddingX: 1, borderStyle: focusedField === 'url' ? 'double' : 'single' },
                React.createElement(Text, null, url || React.createElement(Text, { dimColor: true }, provider === 'ollama' ? DEFAULTS.ollamaUrl : 'https://api.example.com/v1')),
                focusedField === 'url' && React.createElement(Text, { color: "green" }, "_")))),
        provider === 'ollama' && (React.createElement(Box, { marginTop: 1, padding: 1, borderStyle: "round" },
            React.createElement(Text, { dimColor: true },
                "Make sure Ollama is running locally. Default: ",
                DEFAULTS.ollamaUrl))),
        React.createElement(Box, { marginTop: 2 },
            React.createElement(Text, { dimColor: true },
                React.createElement(Text, { bold: true }, "\u23CE"),
                " Continue \u2022 ",
                React.createElement(Text, { bold: true }, "Esc"),
                " Back"))));
}
//# sourceMappingURL=secret-step.js.map