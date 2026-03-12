/**
 * Runs static and interactions accessibility test on UI components. 
 * @param {string} componentName The name of the component contract to test against
 * @param {HTMLElement} component The UI component to be tested
 * @param {string} url Optional URL to run full Playwright E2E tests. If omitted, uses isolated component testing with page.setContent()
 */

import { axe } from "jest-axe";
import type { JestAxeResult, ContractTestResult } from "Types";
import { runContractTests } from "../contract/contractTestRunner";
import { closeSharedBrowser } from "../contract/playwrightTestHarness";


export async function testUiComponent(componentName: string, component: HTMLElement | null, url: string | null): Promise<JestAxeResult> {
    // Validate inputs
    if (!componentName || typeof componentName !== 'string') {
        throw new Error('❌ testUiComponent requires a valid componentName (string)');
    }
    
    // Component can be null if URL is provided (for URL-only testing)
    if (!url && (!component || !(component instanceof HTMLElement))) {
        throw new Error('❌ testUiComponent requires either a valid component (HTMLElement) or a URL');
    }
    
    if (url && typeof url !== 'string') {
        throw new Error('❌ testUiComponent url parameter must be a string');
    }

    // Run axe accessibility tests (skip if using URL-only mode)
    let results;
    if (component) {
        try {
            results = await axe(component);
        } catch (error) {
            throw new Error(
                `❌ Axe accessibility scan failed\n` +
                `Error: ${error instanceof Error ? error.message : String(error)}`
            );
        }
    } else {
        // URL-only mode - skip axe scan, Playwright will handle it
        results = { violations: [] } as unknown as JestAxeResult;
    }
    
    // Check if dev server is running
    async function checkDevServer(url: string): Promise<string | null> {
        try {
            const response = await fetch(url, { 
                method: 'HEAD',
                signal: AbortSignal.timeout(1000)
            });
            if (response.ok || response.status === 304) {
                return url;
            }
        } catch {
            return null;
        }
        return null;
    }
    
    // Run contract tests
    let contract;
    
    try {
        // If URL provided, use it for full app testing; otherwise use isolated component injection
        if (url) {
            const devServerUrl = await checkDevServer(url);
            
            if (devServerUrl) {
                console.log(`🎭 Running Playwright tests on ${devServerUrl}`);
                
                const { runContractTestsPlaywright } = await import("../contract/contractTestRunnerPlaywright");
                contract = await runContractTestsPlaywright(componentName, devServerUrl);
            } else {
                throw new Error(
                    `❌ Dev server not running at ${url}\n` +
                    `Please start your dev server and try again.`
                );
            }
        } else if (component) {
            // No URL provided - use isolated testing with page.setContent 
            console.log(`🎭 Running component contract tests in JSDOM mode`);
            
            contract = await runContractTests(componentName, component as HTMLElement);
        } else {
            throw new Error('❌ Either component or URL must be provided');
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
        const violationDetails = (results.violations as Array<{ id: string; description: string; impact: string; nodes: unknown[]; helpUrl: string }>).map((v) => 
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

let runTest = async (): Promise<ContractTestResult> => {
    return {
        passes: [],
        failures: [],
        skipped: []
    }
};

if (typeof window === "undefined") {
    runTest = async () => {
        console.log(`🚀 Running component accessibility tests...\n`);

        const { exec } = await import("child_process");
        const chalk = (await import("chalk")).default;

        return new Promise<ContractTestResult>((resolve, reject) => {
            exec(
                `npx vitest --run --reporter verbose`,
                async (error, stdout, stderr) => {
                    console.log(stdout);
                    if (stderr) console.error(stderr);

                    const testsPassed = !error || error.code === 0;
                    
                    if (testsPassed) {
                        try {
                            const { displayBadgeInfo, promptAddBadge } = await import("../../cli/badgeHelper.js");
                            displayBadgeInfo('component');
                            await promptAddBadge('component', process.cwd());
                            
                            // Call to action
                            console.log(chalk.dim('\n' + '─'.repeat(60)));
                            console.log(chalk.cyan('💙 Found aria-ease helpful?'));
                            console.log(chalk.white('   • Star us on GitHub: ') + chalk.blue.underline('https://github.com/aria-ease/aria-ease'));
                            console.log(chalk.white('   • Share feedback: ') + chalk.blue.underline('https://github.com/aria-ease/aria-ease/discussions'));
                            console.log(chalk.dim('─'.repeat(60) + '\n'));
                        } catch (badgeError) {
                            console.error('Warning: Could not display badge prompt:', badgeError);
                        }
                        
                        resolve({ passes: [], failures: [], skipped: [] });
                        process.exit(0);
                    } else {
                        // Tests failed
                        const exitCode = error?.code || 1;
                        reject(new Error(`Tests failed with code ${exitCode}`));
                        process.exit(exitCode);
                    }
                }
            );
        });
    }
}

/**
 * Cleanup function to close the shared Playwright browser
 * Call this in afterAll() or after all tests complete
 */
async function cleanupTests(): Promise<void> {
    await closeSharedBrowser();
}

export { runTest, cleanupTests };