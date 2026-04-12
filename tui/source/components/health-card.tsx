import React from 'react';
import { Box, Text } from 'ink';
import type { HealthResponse } from '../hooks/use-status.js';

interface HealthCardProps {
  health: HealthResponse;
}

export function HealthCard({ health }: HealthCardProps) {
  return (
    <Box 
      flexDirection="column" 
      borderStyle="round" 
      borderColor="cyan"
      paddingX={1}
      paddingY={1}
    >
      <Box marginBottom={1}>
        <Text bold color="cyan">⚡ Server Health</Text>
      </Box>
      
      <Box flexDirection="column" gap={1}>
        <Box flexDirection="row">
          <Text dimColor>Status: </Text>
          <Text color={health.ok ? 'green' : 'red'} bold>
            {health.ok ? 'Healthy' : 'Unhealthy'}
          </Text>
        </Box>
        
        <Box flexDirection="row">
          <Text dimColor>Version: </Text>
          <Text>{health.version}</Text>
        </Box>
        
        <Box flexDirection="row">
          <Text dimColor>Namespace: </Text>
          <Text bold color="cyan">{health.namespace}</Text>
        </Box>
        
        <Box flexDirection="row">
          <Text dimColor>Port: </Text>
          <Text>{health.port}</Text>
        </Box>
        
        <Box flexDirection="row">
          <Text dimColor>LLM: </Text>
          <Text>{health.llm_provider}</Text>
        </Box>
        
        {health.llm_model_id && (
          <Box flexDirection="row">
            <Text dimColor>Model: </Text>
            <Text>{health.llm_model_id.split('::').pop()}</Text>
          </Box>
        )}
        
        <Box flexDirection="row">
          <Text dimColor>Encoder: </Text>
          <Text>{health.encoder_provider}</Text>
        </Box>
        
        {health.encoder_model_id && (
          <Box flexDirection="row">
            <Text dimColor>Encoder Model: </Text>
            <Text>{health.encoder_model_id.split('::').pop()}</Text>
          </Box>
        )}
      </Box>
    </Box>
  );
}
