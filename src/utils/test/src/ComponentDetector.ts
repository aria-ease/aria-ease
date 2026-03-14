import { ComponentStrategy, ComponentContract, Contract } from "Types";
import { ComboboxComponentStrategy } from "./component-strategies/ComboboxComponentStrategy";
import { AccordionComponentStrategy } from "./component-strategies/AccordionComponentStrategy";
import { MenuComponentStrategy } from "./component-strategies/MenuComponentStrategy";
import { TabsComponentStrategy } from "./component-strategies/TabsComponentStrategy";
import { readFileSync } from "fs";
import contract from "../contract/contract.json";

class ComponentDetector {
    static detect(
        componentName: string,
        actionTimeoutMs: number = 400,
        assertionTimeoutMs: number = 400
    ): ComponentStrategy | null {
        const contractTyped: Contract = contract;
        const contractPath = contractTyped[componentName]?.path;
        if (!contractPath) {
            throw new Error(`Contract path not found for component: ${componentName}`);
        }

        const resolvedPath = new URL(contractPath, import.meta.url).pathname;
        const contractData = readFileSync(resolvedPath, "utf-8");
        const componentContract: ComponentContract = JSON.parse(contractData);
        
        const selectors = componentContract.selectors;
        
        if (componentName.includes("combobox")) {
            const mainSelector = selectors.input || selectors.container as string;
            return new ComboboxComponentStrategy(mainSelector, selectors, actionTimeoutMs, assertionTimeoutMs);
        }
        if (componentName === "accordion") {
            const mainSelector = selectors.trigger || selectors.container as string;
            return new AccordionComponentStrategy(mainSelector, selectors, actionTimeoutMs, assertionTimeoutMs);
        }
        if (componentName === "menu") {
            const mainSelector = selectors.trigger || selectors.container as string;
            return new MenuComponentStrategy(mainSelector, selectors, actionTimeoutMs, assertionTimeoutMs);
        }
        if (componentName === "tabs") {
            const mainSelector = selectors.tablist || selectors.tab as string;
            return new TabsComponentStrategy(mainSelector, selectors);
        }

        return null; // Return null if no matching component is found
    }
}

export { ComponentDetector };