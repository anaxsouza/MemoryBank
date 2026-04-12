import React from 'react';
import { Box, Text } from 'ink';
import type { MemoryStats } from '../hooks/use-status.js';

interface MemoryCardProps {
  memories: MemoryStats;
}

function formatTimestamp(isoString?: string): string {
  if (!isoString) return '--';
  try {
    const date = new Date(isoString);
    return date.toLocaleString();
  } catch {
    return isoString;
  }
}

export function MemoryCard({ memories }: MemoryCardProps) {
  return (
    <Box 
      flexDirection="column" 
      borderStyle="round" 
      borderColor="green"
      paddingX={1}
      paddingY={1}
    >
      <Box marginBottom={1}>
        <Text bold color="green">💾 Memory Statistics</Text>
      </Box>
      
      <Box flexDirection="column" gap={1}>
        <Box flexDirection="row">
          <Text dimColor>Total Memories: </Text>
          <Text bold color="green">{memories.total_count.toLocaleString()}</Text>
        </Box>
        
        <Box flexDirection="row">
          <Text dimColor>Earliest: </Text>
          <Text dimColor>{formatTimestamp(memories.earliest_timestamp)}</Text>
        </Box>
        
        <Box flexDirection="row">
          <Text dimColor>Latest: </Text>
          <Text dimColor>{formatTimestamp(memories.latest_timestamp)}</Text>
        </Box>
        
        {memories.unique_tags.length > 0 && (
          <>
            <Box marginTop={1}>
              <Text dimColor>Tags ({memories.unique_tags.length}):</Text>
            </Box>
            <Box flexDirection="row" flexWrap="wrap" gap={1}>
              {memories.unique_tags.slice(0, 8).map((tag, i) => (
                <Text key={i} color="gray">[{tag}]</Text>
              ))}
              {memories.unique_tags.length > 8 && (
                <Text dimColor>+{memories.unique_tags.length - 8} more</Text>
              )}
            </Box>
          </>
        )}
        
        {memories.unique_keywords.length > 0 && (
          <>
            <Box marginTop={1}>
              <Text dimColor>Keywords ({memories.unique_keywords.length}):</Text>
            </Box>
            <Box flexDirection="row" flexWrap="wrap" gap={1}>
              {memories.unique_keywords.slice(0, 8).map((keyword, i) => (
                <Text key={i} color="gray">[{keyword}]</Text>
              ))}
              {memories.unique_keywords.length > 8 && (
                <Text dimColor>+{memories.unique_keywords.length - 8} more</Text>
              )}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
