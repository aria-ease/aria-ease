import contract from "./contract.json";
//import contractSchema from "./contract-schema.json";
import type { Contract, ComponentContract, Selector, ContractTestResult } from "Types";
import fs from "fs/promises";
import { ContractReporter } from "./ContractReporter";


export async function runContractTests(componentName: string, component: HTMLElement): Promise<ContractTestResult> {
    const reporter = new ContractReporter(false);

    const contractTyped: Contract = contract;
    const contractPath = contractTyped[componentName]?.path;

    if (!contractPath) {
        throw new Error(`No contract found for component: ${componentName}`);
    }

    const resolvedPath = new URL(contractPath, import.meta.url).pathname;
    const contractData = await fs.readFile(resolvedPath, "utf-8");
    const componentContract: ComponentContract = JSON.parse(contractData);
    const totalTests = componentContract.static[0].assertions.length + componentContract.dynamic.length;

    reporter.start(componentName, totalTests);

    const failures: string[] = [];
    const passes: string[] = [];
    const skipped: string[] = [];

    for (const test of componentContract.static[0].assertions) {
        if(test.target !== "relative") {
            const selector = componentContract.selectors[test.target as keyof Selector];
            if (!selector) {
                failures.push(`Selector for target ${test.target} not found.`);
                reporter.reportStaticTest(`${test.target} has required ARIA attributes`, false, `Selector for target ${test.target} not found.`);
                continue;
            }

            const target = component.querySelector(selector) as HTMLElement;
            if (!target) {
                failures.push(`Target ${test.target} not found.`);
                reporter.reportStaticTest(`${test.target} has required ARIA attributes`, false, `Target ${test.target} not found.`);
                continue;
            }

            const attributeValue = target.getAttribute(test.attribute);
            if (!test.expectedValue) {
                const attributes = test.attribute.split(" | ");
                const hasAnyAttribute = attributes.some(attr => target.hasAttribute(attr));

                if (!hasAnyAttribute) {
                    failures.push(test.failureMessage + ` None of the attributes "${test.attribute}" are present.`);
                    reporter.reportStaticTest(`${test.target} has ${test.attribute}`, false, test.failureMessage);
                } else {
                    passes.push(`At least one of the attributes "${test.attribute}" exists on the element.`);
                    reporter.reportStaticTest(`${test.target} has ${test.attribute}`, true);
                }
            } else if (!attributeValue || !(test.expectedValue.split(" | ").includes(attributeValue))) {
                failures.push(test.failureMessage + ` Attribute value does not match expected value. Expected: ${test.expectedValue}, Found: ${attributeValue}`);
                reporter.reportStaticTest(`${test.target} has ${test.attribute}="${test.expectedValue}"`, false, test.failureMessage);
            } else {
                passes.push(`Attribute value matches expected value. Expected: ${test.expectedValue}, Found: ${attributeValue}`);
                reporter.reportStaticTest(`${test.target} has ${test.attribute}="${attributeValue}"`, true);
            }
        } 
    }


    for (const dynamicTest of componentContract.dynamic) {
        skipped.push(dynamicTest.description);
        reporter.reportTest(dynamicTest, 'skip');
    }  
    
    // Report static test summary
    const staticPassed = componentContract.static[0].assertions.length;
    const staticFailed = 0;
    reporter.reportStatic(staticPassed, staticFailed);
    
    // Final summary
    reporter.summary(failures);

    return { passes, failures, skipped}
}