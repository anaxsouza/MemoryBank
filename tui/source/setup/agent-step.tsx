import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import type { AgentKind } from './types.js';
import { AGENTS } from './types.js';

interface AgentStepProps {
  onSubmit: (agents: AgentKind[]) => void;
  onBack: () => void;
  selectedAgents: AgentKind[];
}

// Detect if agents are on PATH
function detectAgent(agent: AgentKind): boolean {
  // In real implementation, this would check PATH
  // For now, return false for all (will be implemented with actual detection)
  return false;
}

export function AgentStep({ onSubmit, onBack, selectedAgents }: AgentStepProps) {
  const [agents, setAgents] = useState(() => 
    AGENTS.map(agent => ({
      ...agent,
      detected: detectAgent(agent.kind),
      selected: selectedAgents.includes(agent.kind),
    }))
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  useInput((input, key) => {
    if (key.escape) {
      onBack();
      return;
    }

    if (key.return) {
      const selected = agents.filter(a => a.selected).map(a => a.kind);
      onSubmit(selected);
      return;
    }

    if (key.upArrow) {
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : agents.length - 1));
    } else if (key.downArrow) {
      setSelectedIndex(prev => (prev < agents.length - 1 ? prev + 1 : 0));
    } else if (input === ' ') {
      // Toggle selection
      setAgents(prev => prev.map((agent, idx) => 
        idx === selectedIndex ? { ...agent, selected: !agent.selected } : agent
      ));
    }
  });

  const selectedCount = agents.filter(a => a.selected).length;

  return (
    <Box flexDirection="column" padding={1}>
      {/* Header */}
      <Box marginBottom={1}>
        <Text color="cyan" bold>Step 5/6: Agent Integrations</Text>
      </Box>

      <Box marginBottom={1}>
        <Text dimColor>
          Select AI agents to integrate with Memory Bank. Detected agents are marked with ✓.
        </Text>
      </Box>

      {/* Agent list */}
      <Box flexDirection="column" marginY={1}>
        {agents.map((agent, index) => {
          const isSelected = index === selectedIndex;
          const isChecked = agent.selected;
          
          return (
            <Box key={agent.kind}>
              <Text>
                {isSelected ? (
                  <Text color="green" bold>{'> '}</Text>
                ) : (
                  <Text dimColor>{'  '}</Text>
                )}
                <Text color={isChecked ? 'green' : 'gray'}>
                  {isChecked ? '[x]' : '[ ]'}
                </Text>
                {' '}
                <Text bold={isSelected}>{agent.name}</Text>
                {agent.detected && (
                  <Text color="green"> ✓</Text>
                )}
                <Text dimColor> — {agent.description}</Text>
              </Text>
            </Box>
          );
        })}
      </Box>

      {/* Selection summary */}
      <Box marginTop={1} padding={1} borderStyle="round">
        <Text>
          Selected: <Text bold color="green">{selectedCount}</Text> agent{selectedCount !== 1 ? 's' : ''}
        </Text>
      </Box>

      {/* Navigation hints */}
      <Box marginTop={2}>
        <Text dimColor>
          <Text bold>↑↓</Text> Navigate • <Text bold>Space</Text> Toggle • <Text bold>⏎</Text> Continue • <Text bold>Esc</Text> Back
        </Text>
      </Box>
    </Box>
  );
}
