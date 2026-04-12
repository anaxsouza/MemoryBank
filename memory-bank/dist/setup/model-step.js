import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { PROVIDER_MODELS, PROVIDER_INFO } from './types.js';
export function ModelStep({ provider, onSelect, onBack, currentModel }) {
    const models = PROVIDER_MODELS[provider];
    const [selectedIndex, setSelectedIndex] = useState(() => {
        if (currentModel) {
            const idx = models.findIndex(m => m.id === currentModel);
            return idx >= 0 ? idx : 0;
        }
        return 0;
    });
    const [customModel, setCustomModel] = useState('');
    const [isCustomInput, setIsCustomInput] = useState(false);
    const selectedModel = models[selectedIndex];
    const isCustom = selectedModel?.id === 'custom';
    useInput((input, key) => {
        if (isCustomInput) {
            // Handle custom model input
            if (key.return) {
                if (customModel.trim()) {
                    onSelect(customModel.trim());
                }
            }
            else if (key.escape) {
                setIsCustomInput(false);
                setCustomModel('');
            }
            else if (key.backspace || key.delete) {
                setCustomModel(prev => prev.slice(0, -1));
            }
            else if (input && !key.ctrl && !key.meta) {
                setCustomModel(prev => prev + input);
            }
        }
        else {
            // Handle navigation
            if (key.upArrow) {
                setSelectedIndex(prev => (prev > 0 ? prev - 1 : models.length - 1));
            }
            else if (key.downArrow) {
                setSelectedIndex(prev => (prev < models.length - 1 ? prev + 0 : 0));
            }
            else if (key.return) {
                if (isCustom) {
                    setIsCustomInput(true);
                }
                else {
                    onSelect(selectedModel.id);
                }
            }
            else if (key.escape) {
                onBack();
            }
        }
    });
    return (React.createElement(Box, { flexDirection: "column", padding: 1 },
        React.createElement(Box, { marginBottom: 1 },
            React.createElement(Text, { color: "cyan", bold: true }, "Step 2/6: Select Model")),
        React.createElement(Box, { marginBottom: 1 },
            React.createElement(Text, { dimColor: true },
                "Choose a model from ",
                PROVIDER_INFO[provider].name,
                ".")),
        isCustomInput ? (
        // Custom model input mode
        React.createElement(Box, { flexDirection: "column", marginY: 1 },
            React.createElement(Text, null, "Enter custom model ID:"),
            React.createElement(Box, { marginY: 1, paddingX: 1, borderStyle: "single" },
                React.createElement(Text, null, customModel),
                React.createElement(Text, { color: "green" }, "_")),
            React.createElement(Text, { dimColor: true },
                React.createElement(Text, { bold: true }, "\u23CE"),
                " Confirm \u2022 ",
                React.createElement(Text, { bold: true }, "Esc"),
                " Cancel"))) : (
        // Model selection list
        React.createElement(React.Fragment, null,
            React.createElement(Box, { flexDirection: "column", marginY: 1 }, models.map((model, index) => {
                const isSelected = index === selectedIndex;
                return (React.createElement(Box, { key: model.id },
                    React.createElement(Text, null,
                        isSelected ? (React.createElement(Text, { color: "green", bold: true }, '> ')) : (React.createElement(Text, { dimColor: true }, '  ')),
                        React.createElement(Text, { bold: isSelected }, model.name),
                        React.createElement(Text, { dimColor: true },
                            " \u2014 ",
                            model.description))));
            })),
            React.createElement(Box, { flexDirection: "column", marginTop: 1, padding: 1, borderStyle: "round" },
                React.createElement(Text, { bold: true }, selectedModel.name),
                React.createElement(Text, { dimColor: true }, selectedModel.description),
                isCustom && (React.createElement(Box, { marginTop: 1 },
                    React.createElement(Text, { color: "yellow" }, "You'll enter a custom model ID next")))),
            React.createElement(Box, { marginTop: 2 },
                React.createElement(Text, { dimColor: true },
                    React.createElement(Text, { bold: true }, "\u2191\u2193"),
                    " Navigate \u2022 ",
                    React.createElement(Text, { bold: true }, "\u23CE"),
                    " Select \u2022 ",
                    React.createElement(Text, { bold: true }, "Esc"),
                    " Back"))))));
}
//# sourceMappingURL=model-step.js.map