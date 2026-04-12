import React from 'react';
import { Box, Text, useInput } from 'ink';
import type { SetupPlan, ProviderId } from './types.js';
import { PROVIDER_INFO } from './types.js';

interface ReviewStepProps {
  plan: SetupPlan;
  onConfirm: () => void;
  onBack: () => void;
  onEdit: (step: string) => void;
}

const AGENT_NAMES: Record<string, string> = {
  claude_code: 'Claude Code',
  codex: 'Codex CLI',
  gemini_cli: 'Gemini CLI',
  opencode: 'OpenCode',
  openclaw: 'OpenClaw',
};

export function ReviewStep({ plan, onConfirm, onBack, onEdit }: ReviewStepProps) {
  useInput((input, key) => {
    if (key.escape) {
      onBack();
      return;
    }
    
    if (key.return) {
      onConfirm();
      return;
    }

    // Quick navigation to steps
    if (input === '1') onEdit('provider');
    if (input === '2') onEdit('model');
    if (input === '3') onEdit('secret');
    if (input === '4') onEdit('namespace');
    if (input === '5') onEdit('agents');
  });

  const maskSecret = (secret: string) => {
    if (secret.length <= 8) return '•'.repeat(secret.length);
    return secret.slice(0, 4) + '••••' + secret.slice(-4);
  };

  return (
    <Box flexDirection="column" padding={1}>
      {/* Header */}
      <Box marginBottom={1}>
        <Text color="cyan" bold>Step 6/6: Review Configuration</Text>
      </Box>

      <Box marginBottom={1}>
        <Text dimColor>
          Review your settings before applying. Press number keys to edit.
        </Text>
      </Box>

      {/* Configuration summary */}
      <Box flexDirection="column" marginY={1} padding={1} borderStyle="round">
        {/* Provider */}
        <Box marginY={1}>
          <Text dimColor>1. </Text>
          <Text bold>Provider:</Text>
          {' '}
          <Text color="green">{PROVIDER_INFO[plan.provider].name}</Text>
        </Box>

        {/* Model */}
        <Box marginY={1}>
          <Text dimColor>2. </Text>
          <Text bold>Model:</Text>
          {' '}
          <Text color="green">{plan.model}</Text>
        </Box>

        {/* API Key (masked) */}
        {plan.apiKey && (
          <Box marginY={1}>
            <Text dimColor>3. </Text>
            <Text bold>API Key:</Text>
            {' '}
            <Text color="green">{maskSecret(plan.apiKey)}</Text>
          </Box>
        )}

        {/* Custom URL */}
        {plan.openaiUrl && (
          <Box marginY={1}>
            <Text dimColor>3. </Text>
            <Text bold>Base URL:</Text>
            {' '}
            <Text color="green">{plan.openaiUrl}</Text>
          </Box>
        )}

        {/* Ollama URL */}
        {plan.ollamaUrl && (
          <Box marginY={1}>
            <Text dimColor>3. </Text>
            <Text bold>Ollama URL:</Text>
            {' '}
            <Text color="green">{plan.ollamaUrl}</Text>
          </Box>
        )}

        {/* Namespace */}
        <Box marginY={1}>
          <Text dimColor>4. </Text>
          <Text bold>Namespace:</Text>
          {' '}
          <Text color="green">{plan.namespace}</Text>
        </Box>

        {/* Port */}
        <Box marginY={1}>
          <Text dimColor>   </Text>
          <Text bold>Port:</Text>
          {' '}
          <Text color="green">{plan.port}</Text>
        </Box>

        {/* Autostart */}
        <Box marginY={1}>
          <Text dimColor>   </Text>
          <Text bold>Auto-start:</Text>
          {' '}
          <Text color={plan.autostart ? 'green' : 'red'}>
            {plan.autostart ? 'Yes' : 'No'}
          </Text>
        </Box>

        {/* Agents */}
        <Box marginY={1}>
          <Text dimColor>5. </Text>
          <Text bold>Agents:</Text>
          {' '}
          {plan.selectedAgents.length > 0 ? (
            <Text color="green">
              {plan.selectedAgents.map(a => AGENT_NAMES[a] || a).join(', ')}
            </Text>
          ) : (
            <Text dimColor>None selected</Text>
          )}
        </Box>
      </Box>

      {/* Action hints */}
      <Box marginTop={2}>
        <Text>
          <Text bold color="green">⏎ Enter</Text>
          <Text> to apply configuration</Text>
        </Text>
      </Box>

      <Box>
        <Text dimColor>
          <Text bold>1-5</Text> Edit step • <Text bold>Esc</Text> Back
        </Text>
      </Box>
    </Box>
  );
}
