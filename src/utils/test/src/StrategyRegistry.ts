/**
 * StrategyRegistry - Manages dynamic loading of component strategies
 * Supports both built-in strategies and custom user-provided strategies
 */

import { ComponentStrategy } from "Types";
import path from "path";
import { pathToFileURL } from "url";

type StrategyConstructor = new (...args: unknown[]) => ComponentStrategy;

class StrategyRegistry {
  private builtInStrategies: Map<string, () => Promise<StrategyConstructor>> = new Map();

  constructor() {
    this.registerBuiltInStrategies();
  }

  /**
   * Register built-in strategies
   */
  private registerBuiltInStrategies() {
    // Import strategies dynamically to avoid circular dependencies
    this.builtInStrategies.set("menu", () =>
      import("./component-strategies/MenuComponentStrategy").then(
        (m) => m.MenuComponentStrategy as unknown as StrategyConstructor
      )
    );

    this.builtInStrategies.set("accordion", () =>
      import("./component-strategies/AccordionComponentStrategy").then(
        (m) => m.AccordionComponentStrategy as unknown as StrategyConstructor
      )
    );

    this.builtInStrategies.set("combobox", () =>
      import("./component-strategies/ComboboxComponentStrategy").then(
        (m) => m.ComboboxComponentStrategy as unknown as StrategyConstructor
      )
    );

    this.builtInStrategies.set("tabs", () =>
      import("./component-strategies/TabsComponentStrategy").then(
        (m) => m.TabsComponentStrategy as unknown as StrategyConstructor
      )
    );
  }

  /**
   * Load a strategy - either from custom path or built-in registry
   * @param componentName - Component name (e.g., "menu", "accordion")
   * @param customStrategyPath - Optional custom strategy file path
   * @returns Strategy constructor function or null if not found
   */
  async loadStrategy(
    componentName: string,
    customStrategyPath?: string,
    configBaseDir?: string
  ): Promise<StrategyConstructor | null> {
    try {
      // If custom strategy path provided, try to load it
      if (customStrategyPath) {
        try {
          const resolvedCustomPath = path.isAbsolute(customStrategyPath)
            ? customStrategyPath
            : path.resolve(configBaseDir || process.cwd(), customStrategyPath);
          const customModule = await import(pathToFileURL(resolvedCustomPath).href);
          // Look for a default export or the module itself
          const strategy = customModule.default || customModule;
          if (!strategy) {
            throw new Error(`No default export found in ${customStrategyPath}`);
          }
          return strategy as StrategyConstructor;
        } catch (error) {
          throw new Error(
            `Failed to load custom strategy from ${customStrategyPath}: ${
              error instanceof Error ? error.message : String(error)
            }`
          );
        }
      }

      // Fall back to built-in strategy
      const builtInLoader = this.builtInStrategies.get(componentName);
      if (!builtInLoader) {
        return null;
      }

      return builtInLoader();
    } catch (error) {
      throw new Error(
        `Strategy loading failed for ${componentName}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Check if a strategy exists (either built-in or custom path provided)
   */
  has(componentName: string, customStrategyPath?: string): boolean {
    return !!customStrategyPath || this.builtInStrategies.has(componentName);
  }
}

export { StrategyRegistry };