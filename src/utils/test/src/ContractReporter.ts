/**
 * Contract Test Reporter - Vitest-style output for accessibility contract tests
 * Provides clear, actionable feedback with proper formatting and context
 */

interface TestResult {
  description: string;
  status: 'pass' | 'fail' | 'warn' | 'skip';
  failureMessage?: string;
  skipReason?: string;
  level?: string;
}

export class ContractReporter {
  private startTime: number = 0;
  private componentName: string = '';
  private staticPasses: number = 0;
  private staticFailures: number = 0;
  private staticWarnings: number = 0;
  private dynamicResults: TestResult[] = [];
  private totalTests: number = 0;
  private skipped: number = 0;
  private warnings: number = 0;
  private isPlaywright: boolean = false;
  private apgUrl: string = 'https://www.w3.org/WAI/ARIA/apg/';
  private hasPrintedStaticSection: boolean = false;
  private hasPrintedDynamicSection: boolean = false;

  constructor(isPlaywright: boolean = false) {
    this.isPlaywright = isPlaywright;
  }

  private log(message: string) {
    process.stderr.write(message + '\n');
  }

  start(componentName: string, totalTests: number, apgUrl?: string) {
    this.startTime = Date.now();
    this.componentName = componentName;
    this.totalTests = totalTests;
    this.hasPrintedStaticSection = false;
    this.hasPrintedDynamicSection = false;
    if (apgUrl) {
      this.apgUrl = apgUrl;
    }
    
    const mode = this.isPlaywright ? 'Playwright (Real Browser)' : 'jsdom (Fast)';
    this.log(`\n${'═'.repeat(60)}`);
    this.log(`🔍 Testing ${componentName.charAt(0).toUpperCase() + componentName.slice(1)} Component - ${mode}`);
    this.log(`${'═'.repeat(60)}\n`);
  }

  reportStatic(passes: number, failures: number, warnings: number = 0) {
    this.staticPasses = passes;
    this.staticFailures = failures;
    this.staticWarnings = warnings;
  }

  /**
   * Report individual static test pass
   */
  reportStaticTest(
    description: string,
    status: 'pass' | 'fail' | 'warn' | 'skip',
    failureMessage?: string,
    level?: string
  ) {
    if (!this.hasPrintedStaticSection) {
      this.log(`${'─'.repeat(60)}`);
      this.log(`🧪 Static Assertions`);
      this.log(`${'─'.repeat(60)}`);
      this.hasPrintedStaticSection = true;
    }

    const icon = status === 'pass' ? '✓' : status === 'warn' ? '⚠' : status === 'skip' ? '○' : '✗';
    this.log(`  ${icon} ${description}`);
    if (level) {
      this.log(`     ↳ level=${level}`);
    }
    if ((status === 'fail' || status === 'warn' || status === 'skip') && failureMessage) {
      this.log(`     ↳ ${failureMessage}`);
    }
  }

  /**
   * Report individual dynamic test result
   */
  reportTest(test: { description: string; level?: string }, status: 'pass' | 'fail' | 'warn' | 'skip', failureMessage?: string) {
    if (!this.hasPrintedDynamicSection) {
      this.log('');
      this.log(`${'─'.repeat(60)}`);
      this.log(`⌨️ Dynamic Interaction Tests`);
      this.log(`${'─'.repeat(60)}`);
      this.hasPrintedDynamicSection = true;
    }

    const result: TestResult = {
      description: test.description,
      status,
      failureMessage,
      level: test.level,
    };

    if (status === 'skip') {
      result.skipReason = 'Requires real browser (addEventListener events)';
    }

    this.dynamicResults.push(result);

    const icons = { pass: '✓', fail: '✗', warn: '⚠', skip: '○' };
    const levelPrefix = test.level ? `[${test.level.toUpperCase()}] ` : '';
    this.log(`  ${icons[status]} ${levelPrefix}${test.description}`);
    
    if (status === 'skip' && !this.isPlaywright) {
      this.log(`     ↳ Skipped in jsdom (runs in Playwright)`);
    }
    
    if (status === 'fail' && failureMessage) {
      this.log(`     ↳ ${failureMessage}`);
    }

    if (status === 'warn' && failureMessage) {
      this.log(`     ↳ ${failureMessage}`);
    }

    if (status === 'skip' && failureMessage) {
      this.log(`     ↳ ${failureMessage}`);
    }
  }

  /**
   * Report all failures with actionable context
   */
  private reportFailures(failures: string[]) {
    if (failures.length === 0) return;

    this.log(`\n${'─'.repeat(60)}`);
    this.log(`❌ Failures (${failures.length}):\n`);

    failures.forEach((failure, index) => {
      this.log(`${index + 1}. ${failure}`);
      
      if (failure.includes('aria-')) {
        this.log(`   💡 Add the missing ARIA attribute to improve screen reader support`);
      } else if (failure.includes('focus')) {
        this.log(`   💡 Check keyboard event handlers and focus management`);
      } else if (failure.includes('visible')) {
        this.log(`   💡 Verify display/visibility styles and state management`);
      }
      this.log('');
    });
  }

  private reportWarnings() {
    const warnings = this.dynamicResults.filter(r => r.status === 'warn');
    if (warnings.length === 0 && this.staticWarnings === 0) return;

    this.log(`\n${'─'.repeat(60)}`);
    this.log(`⚠️ Warnings (${this.staticWarnings + warnings.length}):\n`);
    this.log(`These checks are failing but treated as warnings under the active strictness mode.\n`);

    warnings.forEach((test, index) => {
      this.log(`${index + 1}. ${test.description}`);
      if (test.failureMessage) {
        this.log(`   ↳ ${test.failureMessage}`);
      }
      if (test.level) {
        this.log(`   ↳ level=${test.level}`);
      }
    });

    if (this.apgUrl) {
      this.log(`\nReference: ${this.apgUrl}\n`);
    }
  }

  /**
   * Report skipped tests with helpful context
   */
  private reportSkipped() {
    if (this.skipped === 0 || this.isPlaywright) return;

    const skippedTests = this.dynamicResults.filter(r => r.status === 'skip');
    
    this.log(`\n${'─'.repeat(60)}`);
    this.log(`ℹ️  Skipped Tests (${this.skipped}):\n`);
    this.log(`These tests use native keyboard events via addEventListener,`);
    this.log(`which jsdom cannot simulate. They run successfully in Playwright.\n`);
    
    skippedTests.forEach((test, index) => {
      this.log(`${index + 1}. ${test.description}`);
    });
    
    this.log(`\n💡 Run with Playwright for full validation:`);
    this.log(`   testUiComponent('${this.componentName}', null, 'http://localhost:5173/test-harness?component=component_name')\n`);
  }

  /**
   * Generate final summary with statistics
   */
  summary(failures: string[]) {
    const duration = Date.now() - this.startTime;
    //const totalDynamic = this.dynamicResults.length;
    const dynamicPasses = this.dynamicResults.filter(r => r.status === 'pass').length;
    const dynamicFailures = this.dynamicResults.filter(r => r.status === 'fail').length;
    const dynamicWarnings = this.dynamicResults.filter(r => r.status === 'warn').length;
    this.skipped = this.dynamicResults.filter(r => r.status === 'skip').length;
    this.warnings = this.staticWarnings + dynamicWarnings;
    
    const totalPasses = this.staticPasses + dynamicPasses;
    const totalFailures = this.staticFailures + dynamicFailures;
    const totalRun = totalPasses + totalFailures + this.warnings;

    // Report failures first
    if (failures.length > 0) {
      this.reportFailures(failures);
    }

    // Report warnings
    this.reportWarnings();

    // Report skipped tests
    this.reportSkipped();

    // Summary section
    this.log(`\n${'═'.repeat(60)}`);
    this.log(`📊 Summary\n`);
    
    if (totalFailures === 0 && this.skipped === 0 && this.warnings === 0) {
      this.log(`✅ All ${totalRun} tests passed!`);
      this.log(`   ${this.componentName.charAt(0).toUpperCase()}${this.componentName.slice(1)} component meets WAI-ARIA expectations for Roles, States, Properties, and Keyboard Interactions ✓`);
    } else if (totalFailures === 0) {
      this.log(`✅ ${totalPasses}/${totalRun} tests passed`);
      if (this.skipped > 0) {
        this.log(`○  ${this.skipped} tests skipped`);
      }
      if (this.warnings > 0) {
        this.log(`⚠️ ${this.warnings} warning${this.warnings > 1 ? 's' : ''}`);
      }
      this.log(`   ${this.componentName.charAt(0).toUpperCase()}${this.componentName.slice(1)} component meets WAI-ARIA expectations for Roles, States, Properties, and Keyboard Interactions ✓`);
    } else {
      this.log(`❌ ${totalFailures} test${totalFailures > 1 ? 's' : ''} failed`);
      this.log(`✅ ${totalPasses} test${totalPasses > 1 ? 's' : ''} passed`);
      if (this.warnings > 0) {
        this.log(`⚠️ ${this.warnings} warning${this.warnings > 1 ? 's' : ''}`);
      }
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
    } else if (!this.isPlaywright && this.skipped > 0) {
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
  error(message: string, context?: string) {
    this.log(`\n❌ Error: ${message}`);
    if (context) {
      this.log(`   Context: ${context}`);
    }
    this.log('');
  }
}