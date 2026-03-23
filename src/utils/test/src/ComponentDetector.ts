import { ComponentStrategy, ComponentContract, Contract } from "Types";
import { TabsComponentStrategy } from "./component-strategies/TabsComponentStrategy";
import { readFileSync } from "fs";
import path from "path";
import contract from "../contract/contract.json";
import { StrategyRegistry } from "./StrategyRegistry";

class ComponentDetector {
    private static strategyRegistry = new StrategyRegistry();

    private static isComponentConfig(value: unknown): value is { path?: string; strategyPath?: string } {
        return typeof value === "object" && value !== null;
    }

    /**
     * Detect and instantiate a component strategy
     * Supports:
     * - Built-in strategies (menu, accordion, combobox, tabs)
     * - Custom strategies via config (strategyPath)
     * - Custom contract paths via config (path)
     * @param componentName - Component name
     * @param componentConfig - Component config from ariaease.config.js
     * @param actionTimeoutMs - Action timeout in milliseconds
     * @param assertionTimeoutMs - Assertion timeout in milliseconds
     * @returns Instantiated ComponentStrategy or null
     */
    static async detect(
        componentName: string,
        componentConfig?: unknown,
        actionTimeoutMs: number = 400,
        assertionTimeoutMs: number = 400,
        configBaseDir?: string
    ): Promise<ComponentStrategy | null> {
        const typedComponentConfig = this.isComponentConfig(componentConfig) ? componentConfig : undefined;

        // Resolve contract path - use config override or default
        let contractPath = typedComponentConfig?.path;
        if (!contractPath) {
            const contractTyped: Contract = contract;
            contractPath = contractTyped[componentName]?.path;
        }

        if (!contractPath) {
            throw new Error(`Contract path not found for component: ${componentName}`);
        }

        const resolvedPath = (() => {
            if (path.isAbsolute(contractPath)) return contractPath;
            if (configBaseDir) {
                const configResolved = path.resolve(configBaseDir, contractPath);
                try {
                    readFileSync(configResolved, "utf-8");
                    return configResolved;
                } catch {
                    // fall through
                }
            }
            const cwdResolved = path.resolve(process.cwd(), contractPath);
            try {
                readFileSync(cwdResolved, "utf-8");
                return cwdResolved;
            } catch {
                return new URL(contractPath, import.meta.url).pathname;
            }
        })();
        const contractData = readFileSync(resolvedPath, "utf-8");
        const componentContract: ComponentContract = JSON.parse(contractData);
        
        const selectors = componentContract.selectors;

        // Try to load strategy - either custom (from config) or built-in
        const strategyClass = await this.strategyRegistry.loadStrategy(
            componentName,
            typedComponentConfig?.strategyPath,
            configBaseDir
        );

        if (!strategyClass) {
            return null; // Unsupported component
        }

        // Calculate main selector - needed for all strategies
        const mainSelector = 
            selectors.trigger || 
            selectors.input || 
            selectors.tablist || 
            selectors.container as string;

        // Instantiate the strategy class with appropriate constructor args
        // Different strategies have different constructor signatures
        if (componentName === "tabs") {
            return new (strategyClass as typeof TabsComponentStrategy)(mainSelector, selectors);
        }

        // Default strategy constructor: (mainSelector, selectors, actionTimeoutMs, assertionTimeoutMs)
        return new (strategyClass as new (...args: unknown[]) => ComponentStrategy)(
            mainSelector,
            selectors,
            actionTimeoutMs,
            assertionTimeoutMs
        );
    }
}

export { ComponentDetector };