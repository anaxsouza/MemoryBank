/**
 * Setup Wizard Hook
 *
 * Manages the wizard state machine and navigation.
 */
import type { WizardState, SetupPlan, WizardStep } from './types.js';
export interface UseSetupWizardReturn {
    state: WizardState;
    goNext: (payload?: Partial<SetupPlan>) => void;
    goBack: () => void;
    goTo: (step: WizardStep, payload?: Partial<SetupPlan>) => void;
    setError: (error: string) => void;
    clearError: () => void;
    startApplying: () => void;
    complete: () => void;
    updatePlan: (payload: Partial<SetupPlan>) => void;
}
export declare function useSetupWizard(): UseSetupWizardReturn;
//# sourceMappingURL=use-setup-wizard.d.ts.map