/**
    * Runs static and interactions accessibility test on UI components. 
    * @param {HTMLElement} component The UI component to be tested
    * @param {string} url Optional URL to run full Playwright E2E tests (requires dev server running)
*/

import { axe } from "jest-axe";
import type { JestAxeResult } from "Types";
import { runContractTests } from "../contract/contractTestRunner";


export async function testUiComponent(componentName: string, component: HTMLElement, url?: string): Promise<JestAxeResult> {
    const results = await axe(component);
    
    let contract;
    
    if (url) {
        console.log(`🎭 Running Playwright E2E tests on ${url}`);
        const { runContractTestsPlaywright } = await import("../contract/contractTestRunnerPlaywright");
        contract = await runContractTestsPlaywright(componentName, url);
    } else {
        console.log(`🧪 Running jsdom tests (limited event handling)`);
        contract = await runContractTests(componentName, component);
    }
    
    const result = {
        violations: results.violations,
        raw: results,
        contract
    };
    
    // Throw helpful error if there are failures (use counts from reporter, not raw arrays)
    if (contract.failures.length > 0) {
        const mode = url ? 'Playwright' : 'jsdom';
        
        throw new Error(
            `\n❌ ${contract.failures.length} assertion${contract.failures.length > 1 ? 's' : ''} failed (${mode} mode)\n` +
            `✅ ${contract.passes.length} assertion${contract.passes.length > 1 ? 's' : ''} passed\n\n` +
            `📋 Review the detailed test report above for specific failures.`
        );
    }
    
    if (results.violations.length > 0) {
        const violationCount = results.violations.length;
        const violationDetails = results.violations.map(v => 
            `\n  - ${v.id}: ${v.description}\n    Impact: ${v.impact}\n    Affected elements: ${v.nodes.length}\n    Help: ${v.helpUrl}`
        ).join('\n');
        
        throw new Error(
            `\n❌ ${violationCount} axe accessibility violation${violationCount > 1 ? 's' : ''} detected\n` +
            `${violationDetails}\n\n` +
            `📋 Full details available in result.violations`
        );
    }
    
    return result;
}

let runTest = async () => {}

if (typeof window === "undefined") {
    runTest = async () => {
        console.log(`🚀 Running component accessibility tests...\n`);

        const { exec } = await import("child_process");

        exec(
            `npx vitest --run --reporter verbose`,
            { cwd: process.cwd() },
            (error, stdout, stderr) => {
                // Always output stdout (test results)
                if (stdout) {
                    console.log(stdout);
                }
                
                // Always output stderr (ContractReporter output)
                if (stderr) {
                    console.error(stderr);
                }
                
                // Exit with proper code (error.code will be set if vitest failed)
                if (error && error.code) {
                    process.exit(error.code);
                }
            }
        );
    }
}

export { runTest }