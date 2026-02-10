/**
 * Runs static and interactions accessibility test on UI components. 
 * @param {string} componentName The name of the component contract to test against
 * @param {HTMLElement} component The UI component to be tested
 * @param {string} url Optional URL to run full Playwright E2E tests (requires dev server running)
 */

import { axe } from "jest-axe";
import type { JestAxeResult } from "Types";
import { runContractTests } from "../contract/contractTestRunner";


export async function testUiComponent(componentName: string, component: HTMLElement, url?: string): Promise<JestAxeResult> {
    // Validate inputs
    if (!componentName || typeof componentName !== 'string') {
        throw new Error('❌ testUiComponent requires a valid componentName (string)');
    }
    
    if (!component || !(component instanceof HTMLElement)) {
        throw new Error('❌ testUiComponent requires a valid component (HTMLElement)');
    }
    
    if (url && typeof url !== 'string') {
        throw new Error('❌ testUiComponent url parameter must be a string');
    }

    // Run axe accessibility tests
    let results;
    try {
        results = await axe(component);
    } catch (error) {
        throw new Error(
            `❌ Axe accessibility scan failed\n` +
            `Error: ${error instanceof Error ? error.message : String(error)}`
        );
    }
    
    // Check if dev server is running
    async function checkDevServer(testUrl?: string): Promise<string | null> {
        const urlsToTry = testUrl 
            ? [testUrl]
            : [
                'http://localhost:5173',
                'http://localhost:3000', 
                'http://localhost:8080',
                'http://localhost:4173'
              ];
        
        for (const serverUrl of urlsToTry) {
            try {
                const response = await fetch(serverUrl, { 
                    method: 'HEAD',
                    signal: AbortSignal.timeout(1000)
                });
                if (response.ok || response.status === 304) {
                    return serverUrl;
                }
            } catch {
                return null;
            }
        }
        return null;
    }
    
    // Run contract tests
    let contract;
    
    try {
        const devServerUrl = await checkDevServer(url);
        
        if (devServerUrl) {
            console.log(`🎭 Running Playwright E2E tests on ${devServerUrl}`);
            
            const { runContractTestsPlaywright } = await import("../contract/contractTestRunnerPlaywright");
            contract = await runContractTestsPlaywright(componentName, devServerUrl);
        } else {
            console.log(`🧪 Running jsdom tests (limited event handling)`);
            console.log(`⚠️  No dev server detected. Some tests may be skipped.\n` + `For full coverage start your dev server and provide a URL.\n`);
            contract = await runContractTests(componentName, component);
        }
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error(`❌ Contract test execution failed: ${String(error)}`);
    }
    
    const result = {
        violations: results.violations,
        raw: results,
        contract
    };
    
    // Check for contract test failures
    if (contract.failures.length > 0 && url === "Playwright") {
        
        throw new Error(
            `\n❌ ${contract.failures.length} accessibility contract test${contract.failures.length > 1 ? 's' : ''} failed (Playwright mode)\n` +
            `✅ ${contract.passes.length} test${contract.passes.length > 1 ? 's' : ''} passed\n\n` +
            `📋 Review the detailed test report above for specific failures.\n` +
            `💡 Contract tests validate ARIA attributes and keyboard interactions per W3C APG guidelines.`
        );
    }
    
    // Check for axe violations
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