import React from 'react';
import type { ProviderId } from './types.js';
interface ProviderStepProps {
    onSelect: (provider: ProviderId) => void;
    onBack?: () => void;
    currentProvider?: ProviderId;
}
export declare function ProviderStep({ onSelect, onBack, currentProvider }: ProviderStepProps): React.JSX.Element;
export {};
//# sourceMappingURL=provider-step.d.ts.map