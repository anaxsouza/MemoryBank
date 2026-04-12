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
export type WizardStep = 
  | 'welcome'
  | 'provider'
  | 'model'
  | 'secret'
  | 'namespace'
  | 'agents'
  | 'review'
  | 'applying'
  | 'complete'
  | 'error';

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
export const PROVIDER_MODELS: Record<ProviderId, ModelInfo[]> = {
  anthropic: [
    { id: 'claude-sonnet-4-5', name: 'Claude Sonnet 4.5', description: 'Fast and capable' },
    { id: 'claude-opus-4', name: 'Claude Opus 4', description: 'Most powerful' },
    { id: 'claude-haiku-4', name: 'Claude Haiku 4', description: 'Fast and affordable' },
  ],
  openai: [
    { id: 'gpt-4o', name: 'GPT-4o', description: 'Most capable multimodal' },
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini', description: 'Fast and affordable' },
    { id: 'o1-mini', name: 'o1-mini', description: 'Reasoning optimized' },
  ],
  'openai-compatible': [
    { id: 'custom', name: 'Custom Model', description: 'Enter your model ID' },
  ],
  ollama: [
    { id: 'llama3.2', name: 'Llama 3.2', description: 'Meta Llama 3.2' },
    { id: 'mistral', name: 'Mistral', description: 'Mistral 7B' },
    { id: 'custom', name: 'Custom Model', description: 'Enter Ollama model name' },
  ],
  gemini: [
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', description: 'Most capable' },
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', description: 'Fast and efficient' },
  ],
};

/** Provider configuration metadata */
export const PROVIDER_INFO: Record<ProviderId, { name: string; description: string; requiresKey: boolean; requiresUrl?: boolean }> = {
  anthropic: {
    name: 'Anthropic',
    description: 'Claude models via Anthropic API',
    requiresKey: true,
  },
  openai: {
    name: 'OpenAI',
    description: 'GPT models via OpenAI API',
    requiresKey: true,
  },
  'openai-compatible': {
    name: 'OpenAI-Compatible',
    description: 'Custom endpoint (NVIDIA, Groq, OpenRouter, etc.)',
    requiresKey: true,
    requiresUrl: true,
  },
  ollama: {
    name: 'Ollama',
    description: 'Local models via Ollama',
    requiresKey: false,
    requiresUrl: true,
  },
  gemini: {
    name: 'Google Gemini',
    description: 'Gemini models via Google AI',
    requiresKey: true,
  },
};

/** Agent definitions */
export const AGENTS: AgentInfo[] = [
  { kind: 'claude_code', name: 'Claude Code', description: 'Anthropic\'s CLI coding assistant', detected: false },
  { kind: 'codex', name: 'Codex CLI', description: 'OpenAI\'s CLI coding assistant', detected: false },
  { kind: 'gemini_cli', name: 'Gemini CLI', description: 'Google\'s CLI coding assistant', detected: false },
  { kind: 'opencode', name: 'OpenCode', description: 'Community AI coding assistant', detected: false },
  { kind: 'openclaw', name: 'OpenClaw', description: 'Open-source coding assistant', detected: false },
];

/** Environment variable names for each provider */
export const PROVIDER_ENV_VARS: Record<ProviderId, string> = {
  anthropic: 'ANTHROPIC_API_KEY',
  openai: 'OPENAI_API_KEY',
  'openai-compatible': 'OPENAI_API_KEY',
  ollama: '', // No key needed
  gemini: 'GOOGLE_API_KEY',
};

/** Default values */
export const DEFAULTS = {
  namespace: 'default',
  port: 3737,
  ollamaUrl: 'http://127.0.0.1:11434',
};

/** Create initial wizard state */
export function createInitialState(): WizardState {
  return {
    currentStep: 'welcome',
    plan: {
      namespace: DEFAULTS.namespace,
      port: DEFAULTS.port,
      autostart: true,
      selectedAgents: [],
    },
    history: [],
    isApplying: false,
  };
}

/** Navigation actions */
export type WizardAction =
  | { type: 'NEXT'; payload?: Partial<SetupPlan> }
  | { type: 'BACK' }
  | { type: 'GO_TO'; step: WizardStep; payload?: Partial<SetupPlan> }
  | { type: 'SET_ERROR'; error: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'START_APPLYING' }
  | { type: 'COMPLETE' };

/** Step order for navigation */
export const STEP_ORDER: WizardStep[] = [
  'welcome',
  'provider',
  'model',
  'secret',
  'namespace',
  'agents',
  'review',
  'applying',
  'complete',
];

/** Get next step */
export function getNextStep(current: WizardStep): WizardStep | null {
  const idx = STEP_ORDER.indexOf(current);
  if (idx === -1 || idx >= STEP_ORDER.length - 1) return null;
  return STEP_ORDER[idx + 1];
}

/** Get previous step */
export function getPreviousStep(current: WizardStep): WizardStep | null {
  const idx = STEP_ORDER.indexOf(current);
  if (idx <= 0) return null;
  return STEP_ORDER[idx - 1];
}

/** Wizard state reducer */
export function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'NEXT': {
      const nextStep = getNextStep(state.currentStep);
      if (!nextStep) return state;
      return {
        ...state,
        currentStep: nextStep,
        plan: { ...state.plan, ...action.payload },
        history: [...state.history, state.currentStep],
        error: undefined,
      };
    }
    case 'BACK': {
      const prevStep = getPreviousStep(state.currentStep);
      if (!prevStep) return state;
      return {
        ...state,
        currentStep: prevStep,
        history: state.history.slice(0, -1),
        error: undefined,
      };
    }
    case 'GO_TO':
      return {
        ...state,
        currentStep: action.step,
        plan: { ...state.plan, ...action.payload },
        error: undefined,
      };
    case 'SET_ERROR':
      return { ...state, error: action.error };
    case 'CLEAR_ERROR':
      return { ...state, error: undefined };
    case 'START_APPLYING':
      return { ...state, isApplying: true };
    case 'COMPLETE':
      return { ...state, isApplying: false, currentStep: 'complete' };
    default:
      return state;
  }
}
