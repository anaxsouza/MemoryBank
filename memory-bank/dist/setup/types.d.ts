/**
 * Setup Wizard types and state management
 *
 * Defines the state machine for the setup wizard flow.
 */
/** Available LLM providers */
export type ProviderId = 'anthropic' | 'openai' | 'openai-compatible' | 'ollama' | 'gemini';
/** Model information */
export interface ModelInfo {
    id: string;
    name: string;
    description?: string;
}
/** Available agents for integration */
export type AgentKind = 'claude_code' | 'codex' | 'gemini_cli' | 'opencode' | 'openclaw';
export interface AgentInfo {
    kind: AgentKind;
    name: string;
    description: string;
    detected: boolean;
}
/** Wizard steps in order */
export type WizardStep = 'welcome' | 'provider' | 'model' | 'secret' | 'namespace' | 'agents' | 'review' | 'applying' | 'complete' | 'error';
/** The complete setup plan accumulated during wizard */
export interface SetupPlan {
    namespace: string;
    provider: ProviderId;
    model: string;
    apiKey?: string;
    openaiUrl?: string;
    ollamaUrl?: string;
    port: number;
    autostart: boolean;
    selectedAgents: AgentKind[];
}
/** Wizard state for managing the flow */
export interface WizardState {
    currentStep: WizardStep;
    plan: Partial<SetupPlan>;
    history: WizardStep[];
    error?: string;
    isApplying: boolean;
}
/** Provider-specific model lists */
export declare const PROVIDER_MODELS: Record<ProviderId, ModelInfo[]>;
/** Provider configuration metadata */
export declare const PROVIDER_INFO: Record<ProviderId, {
    name: string;
    description: string;
    requiresKey: boolean;
    requiresUrl?: boolean;
}>;
/** Agent definitions */
export declare const AGENTS: AgentInfo[];
/** Environment variable names for each provider */
export declare const PROVIDER_ENV_VARS: Record<ProviderId, string>;
/** Default values */
export declare const DEFAULTS: {
    namespace: string;
    port: number;
    ollamaUrl: string;
};
/** Create initial wizard state */
export declare function createInitialState(): WizardState;
/** Navigation actions */
export type WizardAction = {
    type: 'NEXT';
    payload?: Partial<SetupPlan>;
} | {
    type: 'BACK';
} | {
    type: 'GO_TO';
    step: WizardStep;
    payload?: Partial<SetupPlan>;
} | {
    type: 'SET_ERROR';
    error: string;
} | {
    type: 'CLEAR_ERROR';
} | {
    type: 'START_APPLYING';
} | {
    type: 'COMPLETE';
};
/** Step order for navigation */
export declare const STEP_ORDER: WizardStep[];
/** Get next step */
export declare function getNextStep(current: WizardStep): WizardStep | null;
/** Get previous step */
export declare function getPreviousStep(current: WizardStep): WizardStep | null;
/** Wizard state reducer */
export declare function wizardReducer(state: WizardState, action: WizardAction): WizardState;
//# sourceMappingURL=types.d.ts.map