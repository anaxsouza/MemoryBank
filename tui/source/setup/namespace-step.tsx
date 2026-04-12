import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { DEFAULTS } from './types.js';

interface NamespaceStepProps {
  onSubmit: (namespace: string, port: number, autostart: boolean) => void;
  onBack: () => void;
  currentNamespace?: string;
  currentPort?: number;
  currentAutostart?: boolean;
}

export function NamespaceStep({ 
  onSubmit, 
  onBack, 
  currentNamespace, 
  currentPort, 
  currentAutostart 
}: NamespaceStepProps) {
  const [namespace, setNamespace] = useState(currentNamespace || DEFAULTS.namespace);
  const [port, setPort] = useState(String(currentPort || DEFAULTS.port));
  const [autostart, setAutostart] = useState(currentAutostart ?? true);
  const [focusedField, setFocusedField] = useState<'namespace' | 'port' | 'autostart'>('namespace');

  useInput((input, key) => {
    if (key.escape) {
      onBack();
      return;
    }

    if (key.tab) {
      setFocusedField(prev => {
        if (prev === 'namespace') return 'port';
        if (prev === 'port') return 'autostart';
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
      } else {
        // Move to next field
        setFocusedField(prev => {
          if (prev === 'namespace') return 'port';
          if (prev === 'port') return 'autostart';
          return 'autostart';
        });
      }
      return;
    }

    if (key.backspace || key.delete) {
      if (focusedField === 'namespace') {
        setNamespace(prev => prev.slice(0, -1));
      } else if (focusedField === 'port') {
        setPort(prev => prev.slice(0, -1));
      }
      return;
    }

    if (focusedField === 'autostart') {
      if (input === 'y' || input === 'Y') {
        setAutostart(true);
      } else if (input === 'n' || input === 'N') {
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
      } else if (focusedField === 'port') {
        // Only digits for port
        if (/^\d$/.test(input)) {
          setPort(prev => prev + input);
        }
      }
    }
  });

  return (
    <Box flexDirection="column" padding={1}>
      {/* Header */}
      <Box marginBottom={1}>
        <Text color="cyan" bold>Step 4/6: Server Configuration</Text>
      </Box>

      <Box marginBottom={1}>
        <Text dimColor>
          Configure the Memory Bank server settings.
        </Text>
      </Box>

      {/* Namespace field */}
      <Box flexDirection="column" marginY={1}>
        <Text bold={focusedField === 'namespace'}>
          {focusedField === 'namespace' ? <Text color="green">{'>'}</Text> : ' '}
          Namespace (data isolation):
        </Text>
        <Box marginY={1} paddingX={1} borderStyle={focusedField === 'namespace' ? 'double' : 'single'}>
          <Text>{namespace}</Text>
          {focusedField === 'namespace' && <Text color="green">_</Text>}
        </Box>
        <Text dimColor>Letters, numbers, hyphens, underscores only</Text>
      </Box>

      {/* Port field */}
      <Box flexDirection="column" marginY={1}>
        <Text bold={focusedField === 'port'}>
          {focusedField === 'port' ? <Text color="green">{'>'}</Text> : ' '}
          Server Port:
        </Text>
        <Box marginY={1} paddingX={1} borderStyle={focusedField === 'port' ? 'double' : 'single'}>
          <Text>{port}</Text>
          {focusedField === 'port' && <Text color="green">_</Text>}
        </Box>
      </Box>

      {/* Autostart field */}
      <Box flexDirection="column" marginY={1}>
        <Text bold={focusedField === 'autostart'}>
          {focusedField === 'autostart' ? <Text color="green">{'>'}</Text> : ' '}
          Auto-start service: {' '}
          <Text color={autostart ? 'green' : 'red'}>{autostart ? 'Yes' : 'No'}</Text>
        </Text>
        {focusedField === 'autostart' && (
          <Box marginTop={1}>
            <Text dimColor>
              Press <Text bold>Y</Text> for Yes, <Text bold>N</Text> for No
            </Text>
          </Box>
        )}
      </Box>

      {/* Navigation hints */}
      <Box marginTop={2}>
        <Text dimColor>
          <Text bold>Tab</Text> Switch field • <Text bold>⏎</Text> Continue • <Text bold>Esc</Text> Back
        </Text>
      </Box>
    </Box>
  );
}
