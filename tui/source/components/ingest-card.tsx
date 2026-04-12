import React from 'react';
import { Box, Text } from 'ink';
import type { IngestStats } from '../hooks/use-status.js';

interface IngestCardProps {
  ingest: IngestStats;
}

const STATUS_COLORS: Record<string, string> = {
  stored: 'green',
  processing: 'yellow',
  open: 'gray',
  finalized: 'gray',
  aborted: 'red',
  failed: 'red',
  exhausted: 'red',
};

export function IngestCard({ ingest }: IngestCardProps) {
  const totalTurns = ingest.turns_by_status.reduce((sum, s) => sum + s.count, 0);
  
  // Sort by count descending
  const sorted = [...ingest.turns_by_status].sort((a, b) => b.count - a.count);

  return (
    <Box 
      flexDirection="column" 
      borderStyle="round" 
      borderColor="yellow"
      paddingX={1}
      paddingY={1}
    >
      <Box marginBottom={1}>
        <Text bold color="yellow">🔄 Ingest Turns</Text>
      </Box>
      
      <Box flexDirection="column" gap={1}>
        <Box flexDirection="row">
          <Text dimColor>Total Turns: </Text>
          <Text bold color="yellow">{totalTurns.toLocaleString()}</Text>
        </Box>
        
        <Box flexDirection="column" marginTop={1} gap={1}>
          {sorted.map((item, i) => (
            <Box key={i} flexDirection="row" justifyContent="space-between">
              <Text color={STATUS_COLORS[item.status] || 'gray'}>
                ● {item.status}
              </Text>
              <Text bold>{item.count.toLocaleString()}</Text>
            </Box>
          ))}
          
          {sorted.length === 0 && (
            <Text dimColor>No ingest data</Text>
          )}
        </Box>
      </Box>
    </Box>
  );
}
