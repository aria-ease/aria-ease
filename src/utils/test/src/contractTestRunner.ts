//import contractSchema from "./contract.schema.json";
import type { ComponentContract, Selector, ContractTestResult } from "Types";
import fs from "fs/promises";
import { ContractReporter } from "./ContractReporter";
import { normalizeLevel, normalizeStrictness, resolveEnforcement } from "./strictness";



/**
 * Run contract tests for a component using a user-provided contract path.
 * @param contractPath - Absolute path to the contract JSON file
 * @param componentName - Name of the component (for reporting)
 * @param component - The DOM element to test
 * @param strictness - Optional strictness mode
 */
export async function runContractTests(
    contractPath: string,
    componentName: string,
    component: HTMLElement,
    strictness?: string
): Promise<ContractTestResult> {
    const reporter = new ContractReporter(false);
    const strictnessMode = normalizeStrictness(strictness);

    if (!contractPath) {
        throw new Error(`No contract path provided for component: ${componentName}`);
    }

    const contractData = await fs.readFile(contractPath, "utf-8");
    const componentContract: ComponentContract = JSON.parse(contractData);
    const totalTests =
        (componentContract.relationships?.length || 0) +
        (componentContract.static[0]?.assertions.length || 0) +
        componentContract.dynamic.length;

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

    for (const rel of componentContract.relationships || []) {
        const relationshipLevel = normalizeLevel(rel.level);
        if (rel.type === "aria-reference") {
            const fromSelector = componentContract.selectors[rel.from as keyof Selector];
            const toSelector = componentContract.selectors[rel.to as keyof Selector];
            const relDescription = `${rel.from}.${rel.attribute} references ${rel.to}`;

            if (!fromSelector || !toSelector) {
                const outcome = classifyFailure(`Relationship selector missing: from="${rel.from}" or to="${rel.to}" not found in selectors.`, rel.level);
                if (outcome.status === 'fail') staticFailed += 1;
                if (outcome.status === 'warn') staticWarnings += 1;
                reporter.reportStaticTest(relDescription, outcome.status, outcome.detail, outcome.level);
                continue;
            }

            const fromTarget = component.querySelector(fromSelector) as HTMLElement | null;
            const toTarget = component.querySelector(toSelector) as HTMLElement | null;

            if (!fromTarget || !toTarget) {
                const outcome = classifyFailure(`Relationship target not found: ${!fromTarget ? rel.from : rel.to}.`, rel.level);
                if (outcome.status === 'fail') staticFailed += 1;
                if (outcome.status === 'warn') staticWarnings += 1;
                reporter.reportStaticTest(relDescription, outcome.status, outcome.detail, outcome.level);
                continue;
            }

            const toId = toTarget.getAttribute("id");
            const attrValue = fromTarget.getAttribute(rel.attribute) || "";
            if (!toId) {
                const outcome = classifyFailure(`Relationship target "${rel.to}" must have an id for ${rel.attribute} validation.`, rel.level);
                if (outcome.status === 'fail') staticFailed += 1;
                if (outcome.status === 'warn') staticWarnings += 1;
                reporter.reportStaticTest(relDescription, outcome.status, outcome.detail, outcome.level);
                continue;
            }

            const references = attrValue.split(/\s+/).filter(Boolean);
            if (!references.includes(toId)) {
                const outcome = classifyFailure(`Expected ${rel.from} ${rel.attribute} to reference id "${toId}", found "${attrValue}".`, rel.level);
                if (outcome.status === 'fail') staticFailed += 1;
                if (outcome.status === 'warn') staticWarnings += 1;
                reporter.reportStaticTest(relDescription, outcome.status, outcome.detail, outcome.level);
                continue;
            }

            passes.push(`Relationship valid: ${rel.from}.${rel.attribute} -> ${rel.to} (id=${toId}).`);
            staticPassed += 1;
            reporter.reportStaticTest(relDescription, 'pass', undefined, relationshipLevel);
            continue;
        }

        if (rel.type === "contains") {
            const parentSelector = componentContract.selectors[rel.parent as keyof Selector];
            const childSelector = componentContract.selectors[rel.child as keyof Selector];
            const relDescription = `${rel.parent} contains ${rel.child}`;

            if (!parentSelector || !childSelector) {
                const outcome = classifyFailure(`Relationship selector missing: parent="${rel.parent}" or child="${rel.child}" not found in selectors.`, rel.level);
                if (outcome.status === 'fail') staticFailed += 1;
                if (outcome.status === 'warn') staticWarnings += 1;
                reporter.reportStaticTest(relDescription, outcome.status, outcome.detail, outcome.level);
                continue;
            }

            const parentTarget = component.querySelector(parentSelector) as HTMLElement | null;
            if (!parentTarget) {
                const outcome = classifyFailure(`Relationship parent target not found: ${rel.parent}.`, rel.level);
                if (outcome.status === 'fail') staticFailed += 1;
                if (outcome.status === 'warn') staticWarnings += 1;
                reporter.reportStaticTest(relDescription, outcome.status, outcome.detail, outcome.level);
                continue;
            }

            const nestedChild = parentTarget.querySelector(childSelector);
            if (!nestedChild) {
                const outcome = classifyFailure(`Expected ${rel.parent} to contain descendant matching selector for ${rel.child}.`, rel.level);
                if (outcome.status === 'fail') staticFailed += 1;
                if (outcome.status === 'warn') staticWarnings += 1;
                reporter.reportStaticTest(relDescription, outcome.status, outcome.detail, outcome.level);
                continue;
            }

            passes.push(`Relationship valid: ${rel.parent} contains ${rel.child}.`);
            staticPassed += 1;
            reporter.reportStaticTest(relDescription, 'pass', undefined, relationshipLevel);
        }
    }

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
            } else if (!attributeValue || (typeof test.expectedValue === "string" && !(test.expectedValue.split(" | ").includes(attributeValue)))) {
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