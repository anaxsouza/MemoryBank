import React from 'react';
interface NamespaceStepProps {
    onSubmit: (namespace: string, port: number, autostart: boolean) => void;
    onBack: () => void;
    currentNamespace?: string;
    currentPort?: number;
    currentAutostart?: boolean;
}
export declare function NamespaceStep({ onSubmit, onBack, currentNamespace, currentPort, currentAutostart }: NamespaceStepProps): React.JSX.Element;
export {};
//# sourceMappingURL=namespace-step.d.ts.map