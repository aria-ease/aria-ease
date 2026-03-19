import contract from "../contract/contract.json";
//import contractSchema from "./contract.schema.json";
import type { Contract, ComponentContract, Selector, ContractTestResult } from "Types";
import fs from "fs/promises";
import { ContractReporter } from "./ContractReporter";
import { normalizeLevel, normalizeStrictness, resolveEnforcement } from "./strictness";


export async function runContractTests(
    componentName: string,
    component: HTMLElement,
    strictness?: string
): Promise<ContractTestResult> {
    const reporter = new ContractReporter(false);
        const strictnessMode = normalizeStrictness(strictness);

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
    const warnings: string[] = [];

    const classifyFailure = (message: string, levelRaw?: string): { status: 'fail' | 'warn' | 'skip'; level: string; detail: string } => {
        const level = normalizeLevel(levelRaw);
        const enforcement = resolveEnforcement(level, strictnessMode);

        if (enforcement === 'error') {
            failures.push(message);
            return { status: 'fail', level, detail: message };
        }

        if (enforcement === 'warning') {
            warnings.push(message);
            return { status: 'warn', level, detail: message };
        }

        const ignoredMessage = `${message} (ignored by strictness=${strictnessMode}, level=${level})`;
        skipped.push(ignoredMessage);
        return { status: 'skip', level, detail: ignoredMessage };
    };

    let staticPassed = 0;
    let staticFailed = 0;
    let staticWarnings = 0;

    for (const test of componentContract.static[0].assertions) {
        if(test.target !== "relative") {
            const staticLevel = normalizeLevel(test.level);
            const selector = componentContract.selectors[test.target as keyof Selector];
            if (!selector) {
                const outcome = classifyFailure(`Selector for target ${test.target} not found.`, test.level);
                if (outcome.status === 'fail') staticFailed += 1;
                if (outcome.status === 'warn') staticWarnings += 1;
                reporter.reportStaticTest(`${test.target} has required ARIA attributes`, outcome.status, outcome.detail, outcome.level);
                continue;
            }

            const target = component.querySelector(selector) as HTMLElement;
            if (!target) {
                const outcome = classifyFailure(`Target ${test.target} not found.`, test.level);
                if (outcome.status === 'fail') staticFailed += 1;
                if (outcome.status === 'warn') staticWarnings += 1;
                reporter.reportStaticTest(`${test.target} has required ARIA attributes`, outcome.status, outcome.detail, outcome.level);
                continue;
            }

            const attributeValue = target.getAttribute(test.attribute);
            if (!test.expectedValue) {
                const attributes = test.attribute.split(" | ");
                const hasAnyAttribute = attributes.some(attr => target.hasAttribute(attr));

                if (!hasAnyAttribute) {
                    const outcome = classifyFailure(test.failureMessage + ` None of the attributes "${test.attribute}" are present.`, test.level);
                    if (outcome.status === 'fail') staticFailed += 1;
                    if (outcome.status === 'warn') staticWarnings += 1;
                    reporter.reportStaticTest(`${test.target} has ${test.attribute}`, outcome.status, outcome.detail, outcome.level);
                } else {
                    passes.push(`At least one of the attributes "${test.attribute}" exists on the element.`);
                    staticPassed += 1;
                    reporter.reportStaticTest(`${test.target} has ${test.attribute}`, 'pass', undefined, staticLevel);
                }
            } else if (!attributeValue || !(test.expectedValue.split(" | ").includes(attributeValue))) {
                const outcome = classifyFailure(test.failureMessage + ` Attribute value does not match expected value. Expected: ${test.expectedValue}, Found: ${attributeValue}`, test.level);
                if (outcome.status === 'fail') staticFailed += 1;
                if (outcome.status === 'warn') staticWarnings += 1;
                reporter.reportStaticTest(`${test.target} has ${test.attribute}="${test.expectedValue}"`, outcome.status, outcome.detail, outcome.level);
            } else {
                passes.push(`Attribute value matches expected value. Expected: ${test.expectedValue}, Found: ${attributeValue}`);
                staticPassed += 1;
                reporter.reportStaticTest(`${test.target} has ${test.attribute}="${attributeValue}"`, 'pass', undefined, staticLevel);
            }
        } 
    }


    for (const dynamicTest of componentContract.dynamic) {
        skipped.push(dynamicTest.description);
        reporter.reportTest({ description: dynamicTest.description, level: dynamicTest.level }, 'skip');
    }  
    
    // Report static test summary
    reporter.reportStatic(staticPassed, staticFailed, staticWarnings);
    
    // Final summary
    reporter.summary(failures);

    return { passes, failures, skipped, warnings }
}