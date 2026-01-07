import { chromium } from "playwright";
import { readFileSync } from "fs";
import contract from "./contract.json";
import { ContractReporter } from "./ContractReporter";
export async function runContractTestsPlaywright(componentName, url) {
    const reporter = new ContractReporter(true);
    const contractTyped = contract;
    const contractPath = contractTyped[componentName]?.path;
    if (!contractPath) {
        throw new Error(`Contract path not found for component: ${componentName}`);
    }
    const resolvedPath = new URL(contractPath, import.meta.url).pathname;
    const contractData = readFileSync(resolvedPath, "utf-8");
    const componentContract = JSON.parse(contractData);
    const totalTests = componentContract.static[0].assertions.length + componentContract.dynamic.length;
    reporter.start(componentName, totalTests);
    const failures = [];
    const passes = [];
    //const skipped: string[] = [];
    let browser = null;
    try {
        browser = await chromium.launch({ headless: true });
        const context = await browser.newContext();
        const page = await context.newPage();
        // Navigate with more reliable settings and longer timeout
        await page.goto(url, {
            waitUntil: "domcontentloaded",
            timeout: 60000
        });
        await page.waitForSelector(componentContract.selectors.trigger, { timeout: 60000 });
        async function resolveRelativeTarget(selector, relative) {
            const items = await page.locator(selector).all();
            switch (relative) {
                case "first":
                    return items[0];
                case "second":
                    return items[1];
                case "last":
                    return items[items.length - 1];
                case "next": {
                    const currentIndex = await page.evaluate(([sel]) => {
                        const items = Array.from(document.querySelectorAll(sel));
                        return items.indexOf(document.activeElement);
                    }, [selector]);
                    const nextIndex = (currentIndex + 1) % items.length;
                    return items[nextIndex];
                }
                case "previous": {
                    const currentIndex = await page.evaluate(([sel]) => {
                        const items = Array.from(document.querySelectorAll(sel));
                        return items.indexOf(document.activeElement);
                    }, [selector]);
                    const prevIndex = (currentIndex - 1 + items.length) % items.length;
                    return items[prevIndex];
                }
                default:
                    return null;
            }
        }
        // Run static tests
        for (const test of componentContract.static[0]?.assertions || []) {
            if (test.target === "relative")
                continue;
            const targetSelector = componentContract.selectors[test.target];
            if (!targetSelector) {
                failures.push(`Selector for target ${test.target} not found.`);
                continue;
            }
            const target = page.locator(targetSelector).first();
            const exists = await target.count() > 0;
            if (!exists) {
                failures.push(`Target ${test.target} not found.`);
                continue;
            }
            if (!test.expectedValue) {
                const attributes = test.attribute.split(" | ");
                let hasAny = false;
                for (const attr of attributes) {
                    const value = await target.getAttribute(attr.trim());
                    if (value !== null) {
                        hasAny = true;
                        break;
                    }
                }
                if (!hasAny) {
                    failures.push(test.failureMessage + ` None of the attributes "${test.attribute}" are present.`);
                }
                else {
                    passes.push(`At least one of the attributes "${test.attribute}" exists on the element.`);
                }
            }
            else {
                const attributeValue = await target.getAttribute(test.attribute);
                const expectedValues = test.expectedValue.split(" | ");
                if (!attributeValue || !expectedValues.includes(attributeValue)) {
                    failures.push(test.failureMessage + ` Attribute value does not match expected value. Expected: ${test.expectedValue}, Found: ${attributeValue}`);
                }
                else {
                    passes.push(`Attribute value matches expected value. Expected: ${test.expectedValue}, Found: ${attributeValue}`);
                }
            }
        }
        // Run dynamic tests
        for (const dynamicTest of componentContract.dynamic || []) {
            const { action, assertions } = dynamicTest;
            const failuresBeforeTest = failures.length;
            // Reset component state before each test for proper isolation
            const containerElement = page.locator(componentContract.selectors.container).first();
            const triggerElement = page.locator(componentContract.selectors.trigger).first();
            const isContainerVisible = await containerElement.isVisible();
            if (isContainerVisible) {
                await triggerElement.click(); // Close the component
                await page.waitForTimeout(50); // Wait for state update
            }
            for (const act of action) {
                if (act.type === "click") {
                    if (act.target === "document") {
                        await page.mouse.click(10, 10);
                    }
                    else {
                        const actionSelector = componentContract.selectors[act.target];
                        if (!actionSelector) {
                            failures.push(`Selector for action target ${act.target} not found.`);
                            continue;
                        }
                        await page.locator(actionSelector).first().click();
                        await page.waitForTimeout(200);
                    }
                }
                if (act.type === "keypress" && act.key) {
                    const keyMap = {
                        "Space": "Space",
                        "Enter": "Enter",
                        "Escape": "Escape",
                        "Arrow Up": "ArrowUp",
                        "Arrow Down": "ArrowDown",
                        "Arrow Left": "ArrowLeft",
                        "Arrow Right": "ArrowRight",
                        "Home": "Home",
                        "End": "End",
                        "Tab": "Tab"
                    };
                    let keyValue = keyMap[act.key] || act.key;
                    if (keyValue === "Space") {
                        keyValue = " ";
                    }
                    else if (keyValue.includes(" ")) {
                        keyValue = keyValue.replace(/ /g, "");
                    }
                    if (act.target === "focusable" && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Escape"].includes(keyValue)) {
                        await page.waitForTimeout(100);
                        await page.keyboard.press(keyValue);
                        await page.waitForTimeout(50);
                    }
                    else {
                        const keypressSelector = componentContract.selectors[act.target];
                        if (!keypressSelector) {
                            failures.push(`Selector for keypress target ${act.target} not found.`);
                            continue;
                        }
                        const target = page.locator(keypressSelector).first();
                        await target.press(keyValue);
                    }
                }
                await page.waitForTimeout(100);
            }
            // Evaluate assertions after action chain completes
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
                    target = await resolveRelativeTarget(relativeSelector, assertion.expectedValue);
                }
                else {
                    const assertionSelector = componentContract.selectors[assertion.target];
                    if (!assertionSelector) {
                        failures.push(`Selector for assertion target ${assertion.target} not found.`);
                        continue;
                    }
                    target = page.locator(assertionSelector).first();
                }
                if (!target) {
                    failures.push(`Target ${assertion.target} not found.`);
                    continue;
                }
                // Evaluate assertion
                if (assertion.assertion === "toBeVisible") {
                    const isVisible = await target.isVisible();
                    if (isVisible) {
                        passes.push(`${assertion.target} is visible as expected. Test: "${dynamicTest.description}".`);
                    }
                    else {
                        failures.push(`${assertion.failureMessage}`);
                    }
                }
                if (assertion.assertion === "notToBeVisible") {
                    const isVisible = await target.isVisible();
                    if (!isVisible) {
                        passes.push(`${assertion.target} is not visible as expected. Test: "${dynamicTest.description}".`);
                    }
                    else {
                        failures.push(assertion.failureMessage + ` ${assertion.target} is still visible.`);
                    }
                }
                if (assertion.assertion === "toHaveAttribute" && assertion.attribute && assertion.expectedValue) {
                    const attributeValue = await target.getAttribute(assertion.attribute);
                    if (attributeValue === assertion.expectedValue) {
                        passes.push(`${assertion.target} has expected "${assertion.attribute}". Test: "${dynamicTest.description}".`);
                    }
                    else {
                        failures.push(assertion.failureMessage + ` ${assertion.target} "${assertion.attribute}" should be "${assertion.expectedValue}", found "${attributeValue}".`);
                    }
                }
                if (assertion.assertion === "toHaveFocus") {
                    const hasFocus = await target.evaluate((el) => el === document.activeElement);
                    if (hasFocus) {
                        passes.push(`${assertion.target} has focus as expected. Test: "${dynamicTest.description}".`);
                    }
                    else {
                        failures.push(`${assertion.failureMessage}`);
                    }
                }
                if (assertion.assertion === "toHaveRole" && assertion.expectedValue) {
                    const roleValue = await target.getAttribute("role");
                    if (roleValue === assertion.expectedValue) {
                        passes.push(`${assertion.target} has role "${assertion.expectedValue}". Test: "${dynamicTest.description}".`);
                    }
                    else {
                        failures.push(assertion.failureMessage + ` Expected role "${assertion.expectedValue}", found "${roleValue}".`);
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
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message.includes("Executable doesn't exist")) {
                console.error("\n❌ Playwright browsers not found!\n");
                console.log("📦 Run: npx playwright install chromium\n");
                failures.push("Playwright browser not installed. Run: npx playwright install chromium");
            }
            else if (error.message.includes("net::ERR_CONNECTION_REFUSED")) {
                console.error("\n❌ Cannot connect to dev server!\n");
                console.log(`   Make sure your dev server is running at ${url}\n`);
                failures.push(`Dev server not running at ${url}`);
            }
            else {
                console.error("❌ Playwright test error:", error.message);
                failures.push(`Test error: ${error.message}`);
            }
        }
    }
    finally {
        if (browser)
            await browser.close();
    }
    return { passes, failures };
}
