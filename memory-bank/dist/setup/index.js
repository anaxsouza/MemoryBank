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
function ApplyingScreen({ commands }) {
    return (React.createElement(Box, { flexDirection: "column", padding: 1 },
        React.createElement(Text, { color: "cyan", bold: true }, "Applying Configuration..."),
        React.createElement(Box, { flexDirection: "column", marginY: 1 }, commands.map((cmd, i) => (React.createElement(Text, { key: i, dimColor: true },
            "  ",
            cmd)))),
        React.createElement(Text, { dimColor: true }, "Please wait...")));
}
function CompleteScreen({ onContinue }) {
    return (React.createElement(Box, { flexDirection: "column", padding: 1 },
        React.createElement(Text, { color: "green", bold: true }, "\u2713 Setup Complete!"),
        React.createElement(Box, { marginY: 1 },
            React.createElement(Text, null, "Your Memory Bank is now configured and ready to use.")),
        React.createElement(Box, { marginTop: 1 },
            React.createElement(Text, null,
                React.createElement(Text, { bold: true, color: "green" }, "\u23CE Enter"),
                React.createElement(Text, null, " to continue to dashboard")))));
}
function ErrorScreen({ error, onRetry, onCancel }) {
    return (React.createElement(Box, { flexDirection: "column", padding: 1 },
        React.createElement(Text, { color: "red", bold: true }, "\u2717 Setup Failed"),
        React.createElement(Box, { marginY: 1, padding: 1, borderStyle: "round", borderColor: "red" },
            React.createElement(Text, null, error)),
        React.createElement(Box, { marginTop: 1 },
            React.createElement(Text, null,
                React.createElement(Text, { bold: true, color: "yellow" }, "R"),
                React.createElement(Text, null, " to retry"),
                onCancel && (React.createElement(React.Fragment, null,
                    ' • ',
                    React.createElement(Text, { bold: true, color: "gray" }, "C"),
                    React.createElement(Text, null, " to cancel")))))));
}
export function SetupWizard({ forceSetup, onComplete, onCancel }) {
    const { state, goNext, goBack, goTo, updatePlan, setError, startApplying, complete } = useSetupWizard();
    const [appliedCommands, setAppliedCommands] = useState([]);
    const hasConfig = hasExistingConfig();
    const shouldShowWizard = forceSetup || !hasConfig;
    // If not forcing and config exists, skip wizard
    if (!shouldShowWizard) {
        onComplete();
        return null;
    }
    const handleProviderSelect = (provider) => {
        updatePlan({ provider });
        goNext();
    };
    const handleModelSelect = (model) => {
        updatePlan({ model });
        goNext();
    };
    const handleSecretSubmit = (apiKey, url) => {
        if (state.plan.provider === 'ollama') {
            updatePlan({ ollamaUrl: url, apiKey });
        }
        else if (state.plan.provider === 'openai-compatible') {
            updatePlan({ openaiUrl: url, apiKey });
        }
        else {
            updatePlan({ apiKey });
        }
        goNext();
    };
    const handleNamespaceSubmit = (namespace, port, autostart) => {
        updatePlan({ namespace, port, autostart });
        goNext();
    };
    const handleAgentSubmit = (agents) => {
        updatePlan({ selectedAgents: agents });
        goNext();
    };
    const handleReviewConfirm = async () => {
        startApplying();
        const plan = state.plan;
        const result = await applySetupPlan(plan);
        setAppliedCommands(result.commands);
        if (result.success) {
            // Try to start service if autostart is enabled
            if (plan.autostart) {
                await startService();
            }
            complete();
        }
        else {
            setError(result.error || 'Unknown error');
        }
    };
    const handleReviewEdit = (step) => {
        goTo(step);
    };
    switch (state.currentStep) {
        case 'welcome':
            return (React.createElement(WelcomeScreen, { onStart: () => goNext(), onSkip: hasConfig ? onComplete : undefined, hasExistingConfig: hasConfig }));
        case 'provider':
            return (React.createElement(ProviderStep, { onSelect: handleProviderSelect, onBack: goBack, currentProvider: state.plan.provider }));
        case 'model':
            if (!state.plan.provider)
                return null;
            return (React.createElement(ModelStep, { provider: state.plan.provider, onSelect: handleModelSelect, onBack: goBack, currentModel: state.plan.model }));
        case 'secret':
            if (!state.plan.provider)
                return null;
            return (React.createElement(SecretStep, { provider: state.plan.provider, onSubmit: handleSecretSubmit, onBack: goBack, currentSecret: state.plan.apiKey, currentUrl: state.plan.openaiUrl || state.plan.ollamaUrl }));
        case 'namespace':
            return (React.createElement(NamespaceStep, { onSubmit: handleNamespaceSubmit, onBack: goBack, currentNamespace: state.plan.namespace, currentPort: state.plan.port, currentAutostart: state.plan.autostart }));
        case 'agents':
            return (React.createElement(AgentStep, { onSubmit: handleAgentSubmit, onBack: goBack, selectedAgents: state.plan.selectedAgents || [] }));
        case 'review':
            if (!state.plan.provider || !state.plan.model)
                return null;
            return (React.createElement(ReviewStep, { plan: state.plan, onConfirm: handleReviewConfirm, onBack: goBack, onEdit: handleReviewEdit }));
        case 'applying':
            return React.createElement(ApplyingScreen, { commands: appliedCommands });
        case 'complete':
            return React.createElement(CompleteScreen, { onContinue: onComplete });
        case 'error':
            return (React.createElement(ErrorScreen, { error: state.error || 'Unknown error', onRetry: () => goTo('review'), onCancel: onCancel }));
        default:
            return null;
    }
}
//# sourceMappingURL=index.js.map