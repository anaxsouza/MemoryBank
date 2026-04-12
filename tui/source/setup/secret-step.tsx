import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import type { ProviderId } from './types.js';
import { PROVIDER_ENV_VARS, PROVIDER_INFO, DEFAULTS } from './types.js';

interface SecretStepProps {
  provider: ProviderId;
  onSubmit: (secret: string, url?: string) => void;
  onBack: () => void;
  currentSecret?: string;
  currentUrl?: string;
}

export function SecretStep({ provider, onSubmit, onBack, currentSecret, currentUrl }: SecretStepProps) {
  const [secret, setSecret] = useState(currentSecret || '');
  const [url, setUrl] = useState(currentUrl || '');
  const [showSecret, setShowSecret] = useState(false);
  const [focusedField, setFocusedField] = useState<'secret' | 'url'>('secret');
  
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
      } else {
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
      } else {
        setUrl(prev => prev + input);
      }
    }
  });

  const maskText = (text: string) => showSecret ? text : '•'.repeat(text.length);

  return (
    <Box flexDirection="column" padding={1}>
      {/* Header */}
      <Box marginBottom={1}>
        <Text color="cyan" bold>Step 3/6: Configure {providerInfo.name}</Text>
      </Box>

      {/* Environment variable notice */}
      {envValue && (
        <Box marginBottom={1} padding={1} borderStyle="round" borderColor="green">
          <Text color="green">✓ Found {envVarName} in environment</Text>
          <Text dimColor>You can use this or enter a different key below.</Text>
        </Box>
      )}

      {/* Secret input */}
      {providerInfo.requiresKey && (
        <Box flexDirection="column" marginY={1}>
          <Text bold={focusedField === 'secret'}>
            {focusedField === 'secret' ? <Text color="green">{'>'}</Text> : ' '} 
            API Key {envVarName ? `(${envVarName})` : ''}:
          </Text>
          <Box marginY={1} paddingX={1} borderStyle={focusedField === 'secret' ? 'double' : 'single'}>
            <Text>{secret ? maskText(secret) : <Text dimColor>{showSecret ? 'sk-...' : '••••••••'}</Text>}</Text>
            {focusedField === 'secret' && <Text color="green">_</Text>}
          </Box>
          <Text dimColor>
            <Text bold>Ctrl+V</Text> to toggle visibility • <Text bold>Tab</Text> to switch fields
          </Text>
        </Box>
      )}

      {/* URL input for compatible providers */}
      {needsUrl && (
        <Box flexDirection="column" marginY={1}>
          <Text bold={focusedField === 'url'}>
            {focusedField === 'url' ? <Text color="green">{'>'}</Text> : ' '}
            Base URL:
          </Text>
          <Box marginY={1} paddingX={1} borderStyle={focusedField === 'url' ? 'double' : 'single'}>
            <Text>{url || <Text dimColor>
              {provider === 'ollama' ? DEFAULTS.ollamaUrl : 'https://api.example.com/v1'}
            </Text>}</Text>
            {focusedField === 'url' && <Text color="green">_</Text>}
          </Box>
        </Box>
      )}

      {/* Ollama notice */}
      {provider === 'ollama' && (
        <Box marginTop={1} padding={1} borderStyle="round">
          <Text dimColor>
            Make sure Ollama is running locally. Default: {DEFAULTS.ollamaUrl}
          </Text>
        </Box>
      )}

      {/* Navigation hints */}
      <Box marginTop={2}>
        <Text dimColor>
          <Text bold>⏎</Text> Continue • <Text bold>Esc</Text> Back
        </Text>
      </Box>
    </Box>
  );
}
