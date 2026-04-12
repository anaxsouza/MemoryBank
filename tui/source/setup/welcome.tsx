import React from 'react';
import { Box, Text, useInput } from 'ink';

interface WelcomeScreenProps {
  onStart: () => void;
  onSkip?: () => void;
  hasExistingConfig?: boolean;
}

export function WelcomeScreen({ onStart, onSkip, hasExistingConfig }: WelcomeScreenProps) {
  useInput((input, key) => {
    if (key.return) {
      onStart();
    } else if (input === 's' || input === 'S') {
      onSkip?.();
    }
  });

  return (
    <Box flexDirection="column" padding={1}>
      {/* Logo/Header */}
      <Box flexDirection="column" marginBottom={1}>
        <Text>
          <Text color="cyan" bold>╔════════════════════════════════════════════════════════════╗</Text>
        </Text>
        <Text>
          <Text color="cyan" bold>║  </Text>
          <Text color="green" bold>MEMORY BANK</Text>
          <Text color="gray">  Local memory service for AI agents</Text>
          <Text color="cyan" bold>          ║</Text>
        </Text>
        <Text>
          <Text color="cyan" bold>╚════════════════════════════════════════════════════════════╝</Text>
        </Text>
      </Box>

      {/* Status */}
      {hasExistingConfig ? (
        <Box flexDirection="column" marginY={1}>
          <Text color="yellow">⚡ Configuration already exists!</Text>
          <Text dimColor>You can re-run setup to change settings, or skip to the dashboard.</Text>
        </Box>
      ) : (
        <Box flexDirection="column" marginY={1}>
          <Text>Welcome! Let's get your Memory Bank configured.</Text>
          <Text dimColor>This wizard will guide you through:</Text>
        </Box>
      )}

      {/* Setup steps preview */}
      <Box flexDirection="column" marginY={1} paddingLeft={2}>
        <Text dimColor>  1. Choose your LLM provider (Anthropic, OpenAI, Ollama, etc.)</Text>
        <Text dimColor>  2. Select your preferred model</Text>
        <Text dimColor>  3. Configure API credentials</Text>
        <Text dimColor>  4. Set up agent integrations (Claude Code, Codex, etc.)</Text>
        <Text dimColor>  5. Review and apply settings</Text>
      </Box>

      {/* Action prompts */}
      <Box flexDirection="column" marginTop={2}>
        <Text>
          <Text color="green" bold>⏎ Enter</Text>
          <Text> to start setup</Text>
        </Text>
        
        {hasExistingConfig && onSkip && (
          <Text>
            <Text color="yellow" bold>S</Text>
            <Text> to skip to dashboard</Text>
          </Text>
        )}
        
        <Text>
          <Text color="gray" bold>Ctrl+C</Text>
          <Text dimColor> to exit</Text>
        </Text>
      </Box>

      {/* Footer */}
      <Box marginTop={2}>
        <Text dimColor>
          All data stays local. Your memories are stored in ~/.memory_bank/
        </Text>
      </Box>
    </Box>
  );
}
