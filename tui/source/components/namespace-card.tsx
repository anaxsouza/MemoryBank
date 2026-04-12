import React from 'react';
import { Box, Text } from 'ink';
import type { NamespaceInfo } from '../hooks/use-status.js';

interface NamespaceCardProps {
  namespace: NamespaceInfo;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function NamespaceCard({ namespace }: NamespaceCardProps) {
  return (
    <Box 
      flexDirection="column" 
      borderStyle="round" 
      borderColor="blue"
      paddingX={1}
      paddingY={1}
    >
      <Box marginBottom={1}>
        <Text bold color="blue">📁 Namespace</Text>
      </Box>
      
      <Box flexDirection="column" gap={1}>
        <Box flexDirection="row">
          <Text dimColor>Name: </Text>
          <Text bold color="blue">{namespace.name}</Text>
        </Box>
        
        <Box flexDirection="row">
          <Text dimColor>DB Size: </Text>
          <Text>{formatBytes(namespace.db_size_bytes)}</Text>
        </Box>
        
        <Box flexDirection="column" marginTop={1}>
          <Text dimColor>Database Path:</Text>
          <Text wrap="wrap" dimColor>{namespace.db_path}</Text>
        </Box>
      </Box>
    </Box>
  );
}
