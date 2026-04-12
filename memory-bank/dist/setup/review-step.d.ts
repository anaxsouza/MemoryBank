import React from 'react';
import type { SetupPlan } from './types.js';
interface ReviewStepProps {
    plan: SetupPlan;
    onConfirm: () => void;
    onBack: () => void;
    onEdit: (step: string) => void;
}
export declare function ReviewStep({ plan, onConfirm, onBack, onEdit }: ReviewStepProps): React.JSX.Element;
export {};
//# sourceMappingURL=review-step.d.ts.map