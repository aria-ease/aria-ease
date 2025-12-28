/**
 * Contract Test Reporter - Vitest-style output for accessibility contract tests
 * Provides clear, actionable feedback with proper formatting and context
 */
export declare class ContractReporter {
    private startTime;
    private componentName;
    private staticPasses;
    private staticFailures;
    private dynamicResults;
    private totalTests;
    private skipped;
    private isPlaywright;
    constructor(isPlaywright?: boolean);
    private log;
    start(componentName: string, totalTests: number): void;
    reportStatic(passes: number, failures: number): void;
    /**
     * Report individual dynamic test result
     */
    reportTest(test: {
        description: string;
        requiresBrowser?: boolean;
    }, status: 'pass' | 'fail' | 'skip', failureMessage?: string): void;
    /**
     * Report all failures with actionable context
     */
    private reportFailures;
    /**
     * Report skipped tests with helpful context
     */
    private reportSkipped;
    /**
     * Generate final summary with statistics
     */
    summary(failures: string[]): {
        passes: number;
        failures: number;
        skipped: number;
        duration: number;
    };
    /**
     * Report an error during test execution
     */
    error(message: string, context?: string): void;
}
//# sourceMappingURL=ContractReporter.d.ts.map