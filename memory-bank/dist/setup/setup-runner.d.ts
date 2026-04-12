/**
 * Setup Runner — Applies configuration by shelling out to mb CLI
 *
 * This module applies the wizard's SetupPlan by invoking mb config set
 * commands. It delegates all persistence to the Rust CLI to ensure
 * consistency with the existing codebase.
 */
import type { SetupPlan } from './types.js';
export interface SetupResult {
    success: boolean;
    error?: string;
    commands: string[];
}
/** Apply the complete setup plan */
export declare function applySetupPlan(plan: SetupPlan): Promise<SetupResult>;
/** Check if configuration already exists */
export declare function hasExistingConfig(): boolean;
/** Start the Memory Bank service */
export declare function startService(): Promise<boolean>;
//# sourceMappingURL=setup-runner.d.ts.map