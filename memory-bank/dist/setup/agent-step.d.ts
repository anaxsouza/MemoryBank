import React from 'react';
import type { AgentKind } from './types.js';
interface AgentStepProps {
    onSubmit: (agents: AgentKind[]) => void;
    onBack: () => void;
    selectedAgents: AgentKind[];
}
export declare function AgentStep({ onSubmit, onBack, selectedAgents }: AgentStepProps): React.JSX.Element;
export {};
//# sourceMappingURL=agent-step.d.ts.map