/**
 * Contract Test Reporter - Vitest-style output for accessibility contract tests
 * Provides clear, actionable feedback with proper formatting and context
 */
export class ContractReporter {
    startTime = 0;
    componentName = '';
    staticPasses = 0;
    staticFailures = 0;
    dynamicResults = [];
    totalTests = 0;
    skipped = 0;
    isPlaywright = false;
    constructor(isPlaywright = false) {
        this.isPlaywright = isPlaywright;
    }
    log(message) {
        process.stderr.write(message + '\n');
    }
    start(componentName, totalTests) {
        this.startTime = Date.now();
        this.componentName = componentName;
        this.totalTests = totalTests;
        const mode = this.isPlaywright ? 'Playwright (Real Browser)' : 'jsdom (Fast)';
        this.log(`\n${'═'.repeat(60)}`);
        this.log(`🔍 Testing ${componentName} Component - ${mode}`);
        this.log(`${'═'.repeat(60)}\n`);
    }
    reportStatic(passes, failures) {
        this.staticPasses = passes;
        this.staticFailures = failures;
        const icon = failures === 0 ? '✅' : '❌';
        const status = failures === 0 ? 'PASS' : 'FAIL';
        this.log(`${icon} Static ARIA Tests: ${status}`);
        this.log(`   ${passes}/${passes + failures} required attributes present\n`);
    }
    /**
     * Report individual dynamic test result
     */
    reportTest(test, status, failureMessage) {
        const result = {
            description: test.description,
            status,
            failureMessage,
        };
        if (status === 'skip' && test.requiresBrowser) {
            result.skipReason = 'Requires real browser (addEventListener events)';
        }
        this.dynamicResults.push(result);
        const icons = { pass: '✓', fail: '✗', skip: '○' };
        //const colors = { pass: '', fail: '', skip: '' };
        this.log(`  ${icons[status]} ${test.description}`);
        if (status === 'skip' && !this.isPlaywright) {
            this.log(`     ↳ Skipped in jsdom (runs in Playwright)`);
        }
        if (status === 'fail' && failureMessage) {
            this.log(`     ↳ ${failureMessage}`);
        }
    }
    /**
     * Report all failures with actionable context
     */
    reportFailures(failures) {
        if (failures.length === 0)
            return;
        this.log(`\n${'─'.repeat(60)}`);
        this.log(`❌ Failures (${failures.length}):\n`);
        failures.forEach((failure, index) => {
            this.log(`${index + 1}. ${failure}`);
            if (failure.includes('aria-')) {
                this.log(`   💡 Add the missing ARIA attribute to improve screen reader support`);
            }
            else if (failure.includes('focus')) {
                this.log(`   💡 Check keyboard event handlers and focus management`);
            }
            else if (failure.includes('visible')) {
                this.log(`   💡 Verify display/visibility styles and state management`);
            }
            this.log('');
        });
    }
    /**
     * Report skipped tests with helpful context
     */
    reportSkipped() {
        if (this.skipped === 0 || this.isPlaywright)
            return;
        const skippedTests = this.dynamicResults.filter(r => r.status === 'skip');
        this.log(`\n${'─'.repeat(60)}`);
        this.log(`ℹ️  Skipped Tests (${this.skipped}):\n`);
        this.log(`These tests use native keyboard events via addEventListener,`);
        this.log(`which jsdom cannot simulate. They run successfully in Playwright.\n`);
        skippedTests.forEach((test, index) => {
            this.log(`${index + 1}. ${test.description}`);
        });
        this.log(`\n💡 Run with Playwright for full validation:`);
        this.log(`   testUiComponent('${this.componentName}', component, 'http://localhost:5173/')\n`);
    }
    /**
     * Generate final summary with statistics
     */
    summary(failures) {
        const duration = Date.now() - this.startTime;
        //const totalDynamic = this.dynamicResults.length;
        const dynamicPasses = this.dynamicResults.filter(r => r.status === 'pass').length;
        const dynamicFailures = this.dynamicResults.filter(r => r.status === 'fail').length;
        this.skipped = this.dynamicResults.filter(r => r.status === 'skip').length;
        const totalPasses = this.staticPasses + dynamicPasses;
        const totalFailures = this.staticFailures + dynamicFailures;
        const totalRun = totalPasses + totalFailures;
        // Report failures first
        if (failures.length > 0) {
            this.reportFailures(failures);
        }
        // Report skipped tests
        this.reportSkipped();
        // Summary section
        this.log(`\n${'═'.repeat(60)}`);
        this.log(`📊 Summary\n`);
        if (totalFailures === 0 && this.skipped === 0) {
            this.log(`✅ All ${totalRun} tests passed!`);
            this.log(`   ${this.componentName} component meets APG and WCAG guidelines ✓`);
        }
        else if (totalFailures === 0) {
            this.log(`✅ ${totalPasses}/${totalRun} tests passed`);
            this.log(`○  ${this.skipped} tests skipped (jsdom limitation)`);
            this.log(`   ${this.componentName} component works correctly`);
        }
        else {
            this.log(`❌ ${totalFailures} test${totalFailures > 1 ? 's' : ''} failed`);
            this.log(`✅ ${totalPasses} test${totalPasses > 1 ? 's' : ''} passed`);
            if (this.skipped > 0) {
                this.log(`○  ${this.skipped} test${this.skipped > 1 ? 's' : ''} skipped`);
            }
        }
        this.log(`⏱️  Duration: ${duration}ms`);
        this.log(`${'═'.repeat(60)}\n`);
        // Provide next steps
        if (totalFailures > 0) {
            this.log(`🔧 Next Steps:`);
            this.log(`   1. Review the failures above`);
            this.log(`   2. Fix ARIA attributes and keyboard handlers`);
            this.log(`   3. Re-run tests to verify fixes\n`);
        }
        else if (!this.isPlaywright && this.skipped > 0) {
            this.log(`✨ Optional: Run Playwright tests for complete validation\n`);
        }
        return {
            passes: totalPasses,
            failures: totalFailures,
            skipped: this.skipped,
            duration,
        };
    }
    /**
     * Report an error during test execution
     */
    error(message, context) {
        this.log(`\n❌ Error: ${message}`);
        if (context) {
            this.log(`   Context: ${context}`);
        }
        this.log('');
    }
}
