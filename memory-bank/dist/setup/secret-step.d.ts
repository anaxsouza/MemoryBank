import React from 'react';
import type { ProviderId } from './types.js';
interface SecretStepProps {
    provider: ProviderId;
    onSubmit: (secret: string, url?: string) => void;
    onBack: () => void;
    currentSecret?: string;
    currentUrl?: string;
}
export declare function SecretStep({ provider, onSubmit, onBack, currentSecret, currentUrl }: SecretStepProps): React.JSX.Element;
export {};
//# sourceMappingURL=secret-step.d.ts.map