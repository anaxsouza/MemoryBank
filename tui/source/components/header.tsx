import React from 'react';
import { Box, Text } from 'ink';

interface HeaderProps {
  isConnected: boolean;
  lastUpdated: Date | null;
}

export function Header({ isConnected, lastUpdated }: HeaderProps) {
  return (
    <Box flexDirection="column">
      <Box flexDirection="row" justifyContent="space-between">
        <Box flexDirection="row">
          <Text bold color="cyan">🧠 Memory Bank</Text>
        </Box>
        
        <Box flexDirection="row" gap={1}>
          <Text color={isConnected ? 'green' : 'red'}>
            {isConnected ? '●' : '○'}
          </Text>
          <Text color={isConnected ? 'green' : 'red'}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </Text>
        </Box>
      </Box>
      
      {lastUpdated && (
        <Box marginTop={1}>
          <Text dimColor>
            Last updated: {lastUpdated.toLocaleTimeString()}
          </Text>
        </Box>
      )}
    </Box>
  );
}
