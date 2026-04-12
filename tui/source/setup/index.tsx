import React, { useState } from 'react';
import { Box, Text } from 'ink';
import { WelcomeScreen } from './welcome.js';
import { ProviderStep } from './provider-step.js';
import { ModelStep } from './model-step.js';
import { SecretStep } from './secret-step.js';
import { NamespaceStep } from './namespace-step.js';
import { AgentStep } from './agent-step.js';
import { ReviewStep } from './review-step.js';
import { useSetupWizard } from './use-setup-wizard.js';
import { applySetupPlan, startService, hasExistingConfig } from './setup-runner.js';
import type { SetupPlan, ProviderId, AgentKind } from './types.js';

interface SetupWizardProps {
  forceSetup?: boolean;
  onComplete: () => void;
  onCancel?: () => void;
}

function ApplyingScreen({ commands }: { commands: string[] }) {
  return (
    <Box flexDirection="column" padding={1}>
      <Text color="cyan" bold>Applying Configuration...</Text>
      <Box flexDirection="column" marginY={1}>
        {commands.map((cmd, i) => (
          <Text key={i} dimColor>  {cmd}</Text>
        ))}
      </Box>
      <Text dimColor>Please wait...</Text>
    </Box>
  );
}

function CompleteScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <Box flexDirection="column" padding={1}>
      <Text color="green" bold>✓ Setup Complete!</Text>
      <Box marginY={1}>
        <Text>Your Memory Bank is now configured and ready to use.</Text>
      </Box>
      <Box marginTop={1}>
        <Text>
          <Text bold color="green">⏎ Enter</Text>
          <Text> to continue to dashboard</Text>
        </Text>
      </Box>
    </Box>
  );
}

function ErrorScreen({ error, onRetry, onCancel }: { error: string; onRetry: () => void; onCancel?: () => void }) {
  return (
    <Box flexDirection="column" padding={1}>
      <Text color="red" bold>✗ Setup Failed</Text>
      <Box marginY={1} padding={1} borderStyle="round" borderColor="red">
        <Text>{error}</Text>
      </Box>
      <Box marginTop={1}>
        <Text>
          <Text bold color="yellow">R</Text>
          <Text> to retry</Text>
          {onCancel && (
            <>
              {' • '}
              <Text bold color="gray">C</Text>
              <Text> to cancel</Text>
            </>
          )}
        </Text>
      </Box>
    </Box>
  );
}

export function SetupWizard({ forceSetup, onComplete, onCancel }: SetupWizardProps) {
  const { state, goNext, goBack, goTo, updatePlan, setError, startApplying, complete } = useSetupWizard();
  const [appliedCommands, setAppliedCommands] = useState<string[]>([]);

  const hasConfig = hasExistingConfig();
  const shouldShowWizard = forceSetup || !hasConfig;

  // If not forcing and config exists, skip wizard
  if (!shouldShowWizard) {
    onComplete();
    return null;
  }

  const handleProviderSelect = (provider: ProviderId) => {
    updatePlan({ provider });
    goNext();
  };

  const handleModelSelect = (model: string) => {
    updatePlan({ model });
    goNext();
  };

  const handleSecretSubmit = (apiKey: string, url?: string) => {
    if (state.plan.provider === 'ollama') {
      updatePlan({ ollamaUrl: url, apiKey });
    } else if (state.plan.provider === 'openai-compatible') {
      updatePlan({ openaiUrl: url, apiKey });
    } else {
      updatePlan({ apiKey });
    }
    goNext();
  };

  const handleNamespaceSubmit = (namespace: string, port: number, autostart: boolean) => {
    updatePlan({ namespace, port, autostart });
    goNext();
  };

  const handleAgentSubmit = (agents: AgentKind[]) => {
    updatePlan({ selectedAgents: agents });
    goNext();
  };

  const handleReviewConfirm = async () => {
    startApplying();
    
    const plan = state.plan as SetupPlan;
    const result = await applySetupPlan(plan);
    
    setAppliedCommands(result.commands);
    
    if (result.success) {
      // Try to start service if autostart is enabled
      if (plan.autostart) {
        await startService();
      }
      complete();
    } else {
      setError(result.error || 'Unknown error');
    }
  };

  const handleReviewEdit = (step: string) => {
    goTo(step as any);
  };

  switch (state.currentStep) {
    case 'welcome':
      return (
        <WelcomeScreen
          onStart={() => goNext()}
          onSkip={hasConfig ? onComplete : undefined}
          hasExistingConfig={hasConfig}
        />
      );

    case 'provider':
      return (
        <ProviderStep
          onSelect={handleProviderSelect}
          onBack={goBack}
          currentProvider={state.plan.provider}
        />
      );

    case 'model':
      if (!state.plan.provider) return null;
      return (
        <ModelStep
          provider={state.plan.provider}
          onSelect={handleModelSelect}
          onBack={goBack}
          currentModel={state.plan.model}
        />
      );

    case 'secret':
      if (!state.plan.provider) return null;
      return (
        <SecretStep
          provider={state.plan.provider}
          onSubmit={handleSecretSubmit}
          onBack={goBack}
          currentSecret={state.plan.apiKey}
          currentUrl={state.plan.openaiUrl || state.plan.ollamaUrl}
        />
      );

    case 'namespace':
      return (
        <NamespaceStep
          onSubmit={handleNamespaceSubmit}
          onBack={goBack}
          currentNamespace={state.plan.namespace}
          currentPort={state.plan.port}
          currentAutostart={state.plan.autostart}
        />
      );

    case 'agents':
      return (
        <AgentStep
          onSubmit={handleAgentSubmit}
          onBack={goBack}
          selectedAgents={state.plan.selectedAgents || []}
        />
      );

    case 'review':
      if (!state.plan.provider || !state.plan.model) return null;
      return (
        <ReviewStep
          plan={state.plan as SetupPlan}
          onConfirm={handleReviewConfirm}
          onBack={goBack}
          onEdit={handleReviewEdit}
        />
      );

    case 'applying':
      return <ApplyingScreen commands={appliedCommands} />;

    case 'complete':
      return <CompleteScreen onContinue={onComplete} />;

    case 'error':
      return (
        <ErrorScreen
          error={state.error || 'Unknown error'}
          onRetry={() => goTo('review')}
          onCancel={onCancel}
        />
      );

    default:
      return null;
  }
}
