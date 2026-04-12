/**
 * Setup Wizard Hook
 * 
 * Manages the wizard state machine and navigation.
 */

import { useState, useCallback } from 'react';
import type { WizardState, SetupPlan, WizardStep, WizardAction } from './types.js';
import { createInitialState, wizardReducer } from './types.js';

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

export function useSetupWizard(): UseSetupWizardReturn {
  const [state, setState] = useState<WizardState>(createInitialState());

  const dispatch = useCallback((action: WizardAction) => {
    setState(prev => wizardReducer(prev, action));
  }, []);

  const goNext = useCallback((payload?: Partial<SetupPlan>) => {
    dispatch({ type: 'NEXT', payload });
  }, [dispatch]);

  const goBack = useCallback(() => {
    dispatch({ type: 'BACK' });
  }, [dispatch]);

  const goTo = useCallback((step: WizardStep, payload?: Partial<SetupPlan>) => {
    dispatch({ type: 'GO_TO', step, payload });
  }, [dispatch]);

  const setError = useCallback((error: string) => {
    dispatch({ type: 'SET_ERROR', error });
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, [dispatch]);

  const startApplying = useCallback(() => {
    dispatch({ type: 'START_APPLYING' });
  }, [dispatch]);

  const complete = useCallback(() => {
    dispatch({ type: 'COMPLETE' });
  }, [dispatch]);

  const updatePlan = useCallback((payload: Partial<SetupPlan>) => {
    setState(prev => ({
      ...prev,
      plan: { ...prev.plan, ...payload },
    }));
  }, []);

  return {
    state,
    goNext,
    goBack,
    goTo,
    setError,
    clearError,
    startApplying,
    complete,
    updatePlan,
  };
}
