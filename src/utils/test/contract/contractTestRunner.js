import contract from "./contract.json";
import fs from "fs/promises";
import { fireEvent } from "@testing-library/dom";
import { ContractReporter } from "./ContractReporter";
export async function runContractTests(componentName, component) {
    const reporter = new ContractReporter(false);
    const contractTyped = contract;
    const contractPath = contractTyped[componentName]?.path;
    if (!contractPath) {
        throw new Error(`No contract found for component: ${componentName}`);
    }
    const resolvedPath = new URL(contractPath, import.meta.url).pathname;
    const contractData = await fs.readFile(resolvedPath, "utf-8");
    const componentContract = JSON.parse(contractData);
    // Start reporter
    const totalTests = componentContract.static[0].assertions.length + componentContract.dynamic.length;
    reporter.start(componentName, totalTests);
    const failures = [];
    const passes = [];
    const skipped = [];
    for (const test of componentContract.static[0].assertions) {
        if (test.target !== "relative") {
            const target = component.querySelector(componentContract.selectors[test.target]);
            if (!target) {
                failures.push(`Target ${test.target} not found.`);
                continue;
            }
            const attributeValue = target.getAttribute(test.attribute);
            if (!test.expectedValue) {
                const attributes = test.attribute.split(" | ");
                const hasAnyAttribute = attributes.some(attr => target.hasAttribute(attr));
                if (!hasAnyAttribute) {
                    failures.push(test.failureMessage + ` None of the attributes "${test.attribute}" are present.`);
                }
                else {
                    passes.push(`At least one of the attributes "${test.attribute}" exists on the element.`);
                }
            }
            else if (!attributeValue || !(test.expectedValue.split(" | ").includes(attributeValue))) {
                failures.push(test.failureMessage + ` Attribute value does not match expected value. Expected: ${test.expectedValue}, Found: ${attributeValue}`);
            }
            else {
                passes.push(`Attribute value matches expected value. Expected: ${test.expectedValue}, Found: ${attributeValue}`);
            }
        }
    }
    function resolveRelativeTarget(component, selector, relative) {
        const items = Array.from(component.querySelectorAll(selector));
        const activeElement = document.activeElement;
        switch (relative) {
            case "first": {
                return items[0] || null;
            }
            case "second": {
                return items[1] || null;
            }
            case "last": {
                return items[items.length - 1] || null;
            }
            case "next": {
                const currentIndex = items.indexOf(activeElement);
                if (currentIndex === -1)
                    return items[0] || null;
                const nextIndex = (currentIndex + 1) % items.length;
                return items[nextIndex] || null;
            }
            case "previous": {
                const currentIndex = items.indexOf(activeElement);
                if (currentIndex === -1)
                    return items[items.length - 1] || null;
                const prevIndex = (currentIndex - 1 + items.length) % items.length;
                return items[prevIndex] || null;
            }
            default:
                return null;
        }
    }
    for (const dynamicTest of componentContract.dynamic) {
        if (dynamicTest.requiresBrowser) {
            skipped.push(dynamicTest.description);
            reporter.reportTest(dynamicTest, 'skip');
            continue;
        }
        const { action, assertions } = dynamicTest;
        // Track failures before this test
        const failuresBeforeTest = failures.length;
        // Reset component state before each test for proper isolation
        // Uses generic "container" and "trigger" selectors
        const containerElement = component.querySelector(componentContract.selectors.container);
        const triggerElement = component.querySelector(componentContract.selectors.trigger);
        if (containerElement && triggerElement) {
            // Close container if it's open
            const isContainerVisible = containerElement.style.display !== "none";
            if (isContainerVisible) {
                fireEvent.click(triggerElement); // Close the component
                await new Promise(resolve => setTimeout(resolve, 50)); // Wait for state update
            }
        }
        // Capture expected assertion targets BEFORE actions (for relative focus assertions)
        const preActionExpectedTargets = new Map();
        for (const assertion of assertions) {
            if (assertion.target === "relative" && assertion.assertion === "toHaveFocus" && assertion.expectedValue) {
                const relativeSelector = componentContract.selectors.relative;
                if (relativeSelector) {
                    // For action chains, we'll resolve this after all actions complete
                    preActionExpectedTargets.set(assertion.expectedValue, null);
                }
            }
        }
        // Execute action chain
        for (const act of action) {
            if (act.type === "click") {
                if (act.target === "document") {
                    fireEvent.click(document.body);
                }
                else {
                    const target = component.querySelector(componentContract.selectors[act.target]);
                    if (target instanceof HTMLElement) {
                        target.focus();
                        fireEvent.click(target);
                    }
                    else {
                        failures.push(`Action target ${act.target} is not a valid HTMLElement.`);
                    }
                }
            }
            if (act.type === "keypress") {
                // Map "Space" to " " for proper event.key value
                const keyValue = act.key === "Space" ? " " : (act.key || "");
                let target;
                // For navigation keys on focusable elements, fire on the currently focused element
                if (act.target === "focusable" && ["Arrow Up", "Arrow Down", "Arrow Left", "Arrow Right", "Escape"].includes(act.key || "")) {
                    const activeElement = document.activeElement;
                    const containerElement = component.querySelector(componentContract.selectors.container);
                    const focusableItems = containerElement?.querySelectorAll(componentContract.selectors.focusable);
                    // Fire on currently focused item, or first item if none focused
                    if (focusableItems && focusableItems.length > 0) {
                        const focusedItem = Array.from(focusableItems).find(item => item === activeElement);
                        target = (focusedItem || focusableItems[0]);
                    }
                    else {
                        target = containerElement;
                    }
                }
                else {
                    target = component.querySelector(componentContract.selectors[act.target]);
                }
                if (target) {
                    target.focus();
                    // For focusable item navigation, use native KeyboardEvent to trigger addEventListener handlers
                    if (act.target === "focusable" && ["Arrow Up", "Arrow Down", "Arrow Left", "Arrow Right", "Escape"].includes(act.key || "")) {
                        const keyboardEvent = new KeyboardEvent("keydown", {
                            key: keyValue,
                            code: keyValue === " " ? "Space" : keyValue.replace(" ", ""),
                            bubbles: true,
                            cancelable: true
                        });
                        target.dispatchEvent(keyboardEvent);
                    }
                    else {
                        // For trigger, use fireEvent (works with React onKeyDown prop)
                        fireEvent.keyDown(target, {
                            key: keyValue,
                            code: keyValue === " " ? "Space" : keyValue.replace(" ", ""),
                            bubbles: true,
                            cancelable: true
                        });
                    }
                }
                else {
                    failures.push(`Action target ${act.target} not found for keypress action.`);
                }
            }
            // Wait for DOM updates and focus changes
            // Longer delay for Escape to ensure menu visibility updates propagate
            const isEscapeKey = act.key === "Escape";
            const isMenuToggleAction = act.target === "trigger" || act.target === "document";
            await new Promise(resolve => setTimeout(resolve, isEscapeKey ? 300 : (isMenuToggleAction ? 200 : 150)));
            // Now evaluate all assertions after waiting
        }
        // Now evaluate all assertions after action chain completes
        for (const assertion of assertions) {
            let target;
            if (assertion.target === "relative") {
                const relativeSelector = componentContract.selectors.relative;
                if (!relativeSelector) {
                    failures.push("Relative selector is not defined in the contract.");
                    continue;
                }
                if (!assertion.expectedValue) {
                    failures.push("Expected value for relative target is not defined.");
                    continue;
                }
                // Resolve relative target based on POST-ACTION state
                target = resolveRelativeTarget(component, relativeSelector, assertion.expectedValue);
            }
            else {
                target = component.querySelector(componentContract.selectors[assertion.target]);
            }
            if (!target) {
                failures.push(`Target ${assertion.target} not found.`);
                continue;
            }
            if (assertion.assertion === "toBeVisible") {
                const isVisible = target.style.display !== "none" && getComputedStyle(target).display !== "none";
                if (!isVisible) {
                    failures.push(`${assertion.failureMessage}`);
                }
                else {
                    passes.push(`${assertion.target} is visible as expected. Test description: '${dynamicTest.description}'.`);
                }
            }
            if (assertion.assertion === "notToBeVisible") {
                const isNotVisible = target.style.display === "none" || getComputedStyle(target).display === "none";
                if (!isNotVisible) {
                    failures.push(assertion.failureMessage + ` ${assertion.target} is still visible.`);
                }
                else {
                    passes.push(`${assertion.target} is not visible as expected. Test description: '${dynamicTest.description}'.`);
                }
            }
            if (assertion.assertion === "toHaveAttribute" && assertion.attribute && assertion.expectedValue) {
                const attributeValue = target.getAttribute(assertion.attribute);
                if (attributeValue !== assertion.expectedValue) {
                    failures.push(assertion.failureMessage + ` ${assertion.target} does not have the expected attribute value. '${assertion.attribute}' should be '${assertion.expectedValue}', but found '${attributeValue}'.`);
                }
                else {
                    passes.push(`${assertion.target} has the expected attribute value for '${assertion.attribute}'. Test description: '${dynamicTest.description}'.`);
                }
            }
            if (assertion.assertion === "toHaveFocus") {
                const hasFocus = document.activeElement === target;
                if (!hasFocus) {
                    failures.push(`${assertion.failureMessage}`);
                }
                else {
                    passes.push(`${assertion.target} has focus as expected. Test description: '${dynamicTest.description}'.`);
                }
            }
            if (assertion.assertion === "toHaveRole" && assertion.expectedValue) {
                const roleValue = target.getAttribute("role");
                if (roleValue !== assertion.expectedValue) {
                    failures.push(assertion.failureMessage + ` ${assertion.target} does not have the expected role. Expected: "${assertion.expectedValue}", Found: "${roleValue}".`);
                }
                else {
                    passes.push(`${assertion.target} has the expected role "${assertion.expectedValue}". Test description: "${dynamicTest.description}".`);
                }
            }
        }
        // Report test result
        const failuresAfterTest = failures.length;
        const testPassed = failuresAfterTest === failuresBeforeTest;
        const failureMessage = testPassed ? undefined : failures[failures.length - 1];
        reporter.reportTest(dynamicTest, testPassed ? 'pass' : 'fail', failureMessage);
    }
    // Report static test summary
    const staticPassed = componentContract.static[0].assertions.length;
    const staticFailed = 0;
    reporter.reportStatic(staticPassed, staticFailed);
    // Final summary
    reporter.summary(failures);
    return { passes, failures, };
}
