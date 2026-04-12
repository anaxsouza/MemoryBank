import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import type { ProviderId } from './types.js';
import { PROVIDER_MODELS, PROVIDER_INFO } from './types.js';

interface ModelStepProps {
  provider: ProviderId;
  onSelect: (model: string) => void;
  onBack: () => void;
  currentModel?: string;
}

export function ModelStep({ provider, onSelect, onBack, currentModel }: ModelStepProps) {
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
      } else if (key.escape) {
        setIsCustomInput(false);
        setCustomModel('');
      } else if (key.backspace || key.delete) {
        setCustomModel(prev => prev.slice(0, -1));
      } else if (input && !key.ctrl && !key.meta) {
        setCustomModel(prev => prev + input);
      }
    } else {
      // Handle navigation
      if (key.upArrow) {
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : models.length - 1));
      } else if (key.downArrow) {
        setSelectedIndex(prev => (prev < models.length - 1 ? prev + 0 : 0));
      } else if (key.return) {
        if (isCustom) {
          setIsCustomInput(true);
        } else {
          onSelect(selectedModel.id);
        }
      } else if (key.escape) {
        onBack();
      }
    }
  });

  return (
    <Box flexDirection="column" padding={1}>
      {/* Header */}
      <Box marginBottom={1}>
        <Text color="cyan" bold>Step 2/6: Select Model</Text>
      </Box>

      <Box marginBottom={1}>
        <Text dimColor>
          Choose a model from {PROVIDER_INFO[provider].name}.
        </Text>
      </Box>

      {isCustomInput ? (
        // Custom model input mode
        <Box flexDirection="column" marginY={1}>
          <Text>Enter custom model ID:</Text>
          <Box marginY={1} paddingX={1} borderStyle="single">
            <Text>{customModel}</Text>
            <Text color="green">_</Text>
          </Box>
          <Text dimColor>
            <Text bold>⏎</Text> Confirm • <Text bold>Esc</Text> Cancel
          </Text>
        </Box>
      ) : (
        // Model selection list
        <>
          <Box flexDirection="column" marginY={1}>
            {models.map((model, index) => {
              const isSelected = index === selectedIndex;
              
              return (
                <Box key={model.id}>
                  <Text>
                    {isSelected ? (
                      <Text color="green" bold>{'> '}</Text>
                    ) : (
                      <Text dimColor>{'  '}</Text>
                    )}
                    <Text bold={isSelected}>{model.name}</Text>
                    <Text dimColor> — {model.description}</Text>
                  </Text>
                </Box>
              );
            })}
          </Box>

          {/* Selected model details */}
          <Box flexDirection="column" marginTop={1} padding={1} borderStyle="round">
            <Text bold>{selectedModel.name}</Text>
            <Text dimColor>{selectedModel.description}</Text>
            {isCustom && (
              <Box marginTop={1}>
                <Text color="yellow">
                  You'll enter a custom model ID next
                </Text>
              </Box>
            )}
          </Box>

          {/* Navigation hints */}
          <Box marginTop={2}>
            <Text dimColor>
              <Text bold>↑↓</Text> Navigate • <Text bold>⏎</Text> Select • <Text bold>Esc</Text> Back
            </Text>
          </Box>
        </>
      )}
    </Box>
  );
}
