import React, { useState } from 'react';
import { Box, Text, useApp } from 'ink';
import { Header } from './components/header.js';
import { HealthCard } from './components/health-card.js';
import { NamespaceCard } from './components/namespace-card.js';
import { MemoryCard } from './components/memory-card.js';
import { IngestCard } from './components/ingest-card.js';
import { useStatus } from './hooks/use-status.js';
import { SetupWizard } from './setup/index.js';
import { hasExistingConfig } from './setup/setup-runner.js';

interface AppProps {
  url: string;
  interval: number;
  forceSetup?: boolean;
}

function Dashboard({ url, interval }: { url: string; interval: number }) {
  const { exit } = useApp();
  const { data, isLoading, isConnected, error, lastUpdated } = useStatus(url, interval);

  if (isLoading && !data) {
    return (
      <Box padding={1}>
        <Header isConnected={false} lastUpdated={null} />
        <Box marginTop={1}>
          <Text dimColor>Loading Memory Bank status...</Text>
        </Box>
      </Box>
    );
  }

  if (error && !data) {
    return (
      <Box padding={1} flexDirection="column">
        <Header isConnected={false} lastUpdated={null} />
        <Box marginTop={1}>
          <Text color="red">❌ Failed to connect to Memory Bank server</Text>
        </Box>
        <Box marginTop={1}>
          <Text>Error: {error}</Text>
        </Box>
        <Box marginTop={1}>
          <Text dimColor>Make sure the server is running at {url}</Text>
        </Box>
        <Box marginTop={1}>
          <Text dimColor>
            Run <Text bold>mb service start</Text> to start the server
          </Text>
        </Box>
        <Box marginTop={1}>
          <Text dimColor>Press Ctrl+C to exit</Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" padding={1}>
      <Header isConnected={isConnected} lastUpdated={lastUpdated} />
      
      <Box flexDirection="row" marginTop={1} gap={2}>
        {/* Left column */}
        <Box flexDirection="column" gap={1} width="50%">
          {data?.health && <HealthCard health={data.health} />}
          {data?.namespace && <NamespaceCard namespace={data.namespace} />}
        </Box>
        
        {/* Right column */}
        <Box flexDirection="column" gap={1} width="50%">
          {data?.memories && <MemoryCard memories={data.memories} />}
          {data?.ingest && <IngestCard ingest={data.ingest} />}
        </Box>
      </Box>

      <Box marginTop={1}>
        <Text dimColor>Press Ctrl+C to exit | Auto-refresh: {interval}s</Text>
      </Box>
    </Box>
  );
}

export function App({ url, interval, forceSetup }: AppProps) {
  const [showDashboard, setShowDashboard] = useState(() => {
    // If forcing setup, always show wizard first
    if (forceSetup) return false;
    // Otherwise, check if config exists
    return hasExistingConfig();
  });

  const handleSetupComplete = () => {
    setShowDashboard(true);
  };

  const handleSetupCancel = () => {
    // If no config exists and user cancels, exit
    if (!hasExistingConfig()) {
      process.exit(0);
    }
    // Otherwise, show dashboard
    setShowDashboard(true);
  };

  if (!showDashboard) {
    return (
      <SetupWizard
        forceSetup={forceSetup}
        onComplete={handleSetupComplete}
        onCancel={handleSetupCancel}
      />
    );
  }

  return <Dashboard url={url} interval={interval} />;
}
