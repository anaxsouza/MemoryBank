/**
 * Setup Wizard Hook
 *
 * Manages the wizard state machine and navigation.
 */
import { useState, useCallback } from 'react';
import { createInitialState, wizardReducer } from './types.js';
export function useSetupWizard() {
    const [state, setState] = useState(createInitialState());
    const dispatch = useCallback((action) => {
        setState(prev => wizardReducer(prev, action));
    }, []);
    const goNext = useCallback((payload) => {
        dispatch({ type: 'NEXT', payload });
    }, [dispatch]);
    const goBack = useCallback(() => {
        dispatch({ type: 'BACK' });
    }, [dispatch]);
    const goTo = useCallback((step, payload) => {
        dispatch({ type: 'GO_TO', step, payload });
    }, [dispatch]);
    const setError = useCallback((error) => {
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
    const updatePlan = useCallback((payload) => {
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
//# sourceMappingURL=use-setup-wizard.js.map