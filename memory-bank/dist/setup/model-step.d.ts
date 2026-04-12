import React from 'react';
import type { ProviderId } from './types.js';
interface ModelStepProps {
    provider: ProviderId;
    onSelect: (model: string) => void;
    onBack: () => void;
    currentModel?: string;
}
export declare function ModelStep({ provider, onSelect, onBack, currentModel }: ModelStepProps): React.JSX.Element;
export {};
//# sourceMappingURL=model-step.d.ts.map