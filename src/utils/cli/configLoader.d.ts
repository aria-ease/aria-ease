import { AriaEaseConfig } from "Types";
/**
 * Searches for and loads an AriaEase config file
 * Checks for config files in this order:
 * - ariaease.config.js
 * - ariaease.config.mjs
 * - ariaease.config.cjs
 * - ariaease.config.json
 * - ariaease.config.ts
 *
 * @param cwd - Current working directory to search in
 * @returns Object containing the config and any errors
 */
export declare function loadConfig(cwd?: string): Promise<{
    config: AriaEaseConfig;
    configPath: string | null;
    errors: string[];
}>;
//# sourceMappingURL=configLoader.d.ts.map