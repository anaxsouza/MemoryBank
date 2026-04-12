import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import type { ProviderId } from './types.js';
import { PROVIDER_INFO } from './types.js';

interface ProviderStepProps {
  onSelect: (provider: ProviderId) => void;
  onBack?: () => void;
  currentProvider?: ProviderId;
}

const providers: ProviderId[] = ['anthropic', 'openai', 'openai-compatible', 'ollama', 'gemini'];

export function ProviderStep({ onSelect, onBack, currentProvider }: ProviderStepProps) {
  const [selectedIndex, setSelectedIndex] = useState(() => {
    if (currentProvider) {
      return providers.indexOf(currentProvider);
    }
    return 0;
  });

  useInput((input, key) => {
    if (key.upArrow) {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : providers.length - 1));
    } else if (key.downArrow) {
      setSelectedIndex((prev) => (prev < providers.length - 1 ? prev + 1 : 0));
    } else if (key.return) {
      onSelect(providers[selectedIndex]);
    } else if (key.escape && onBack) {
      onBack();
    }
  });

  return (
    <Box flexDirection="column" padding={1}>
      {/* Header */}
      <Box marginBottom={1}>
        <Text color="cyan" bold>Step 1/6: Choose LLM Provider</Text>
      </Box>

      <Box marginBottom={1}>
        <Text dimColor>
          Select the AI provider you want to use for memory processing.
        </Text>
      </Box>

      {/* Provider list */}
      <Box flexDirection="column" marginY={1}>
        {providers.map((providerId, index) => {
          const info = PROVIDER_INFO[providerId];
          const isSelected = index === selectedIndex;
          
          return (
            <Box key={providerId}>
              <Text>
                {isSelected ? (
                  <Text color="green" bold>{'> '}</Text>
                ) : (
                  <Text dimColor>{'  '}</Text>
                )}
                <Text bold={isSelected}>{info.name}</Text>
                <Text dimColor> — {info.description}</Text>
              </Text>
            </Box>
          );
        })}
      </Box>

      {/* Selected provider details */}
      <Box flexDirection="column" marginTop={1} padding={1} borderStyle="round">
        <Text bold>{PROVIDER_INFO[providers[selectedIndex]].name}</Text>
        <Text dimColor>{PROVIDER_INFO[providers[selectedIndex]].description}</Text>
        <Box marginTop={1}>
          {PROVIDER_INFO[providers[selectedIndex]].requiresKey ? (
            <Text color="yellow">🔑 Requires API key</Text>
          ) : (
            <Text color="green">✓ No API key required</Text>
          )}
        </Box>
      </Box>

      {/* Navigation hints */}
      <Box marginTop={2}>
        <Text dimColor>
          <Text bold>↑↓</Text> Navigate • <Text bold>⏎</Text> Select • <Text bold>Esc</Text> Back
        </Text>
      </Box>
    </Box>
  );
}
