/**
 * Contract Test Reporter - Vitest-style output for accessibility contract tests
 * Provides clear, actionable feedback with proper formatting and context
 */

interface TestResult {
  description: string;
  status: 'pass' | 'fail' | 'skip' | 'optional-fail';
  failureMessage?: string;
  skipReason?: string;
  isOptional?: boolean;
}

export class ContractReporter {
  private startTime: number = 0;
  private componentName: string = '';
  private staticPasses: number = 0;
  private staticFailures: number = 0;
  private dynamicResults: TestResult[] = [];
  private totalTests: number = 0;
  private skipped: number = 0;
  private optionalSuggestions: number = 0;
  private isPlaywright: boolean = false;
  private apgUrl: string = 'https://www.w3.org/WAI/ARIA/apg/';

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
    if (apgUrl) {
      this.apgUrl = apgUrl;
    }
    
    const mode = this.isPlaywright ? 'Playwright (Real Browser)' : 'jsdom (Fast)';
    this.log(`\n${'═'.repeat(60)}`);
    this.log(`🔍 Testing ${componentName} Component - ${mode}`);
    this.log(`${'═'.repeat(60)}\n`);
  }

  reportStatic(passes: number, failures: number) {
    this.staticPasses = passes;
    this.staticFailures = failures;
    
    const icon = failures === 0 ? '✅' : '❌';
    const status = failures === 0 ? 'PASS' : 'FAIL';
    
    this.log(''); // Add blank line before summary
    this.log(`${icon} Static ARIA Tests: ${status}`);
    this.log(`   ${passes}/${passes + failures} required attributes present\n`);
  }

  /**
   * Report individual static test pass
   */
  reportStaticTest(description: string, passed: boolean, failureMessage?: string) {
    const icon = passed ? '✓' : '✗';
    this.log(`  ${icon} ${description}`);
    if (!passed && failureMessage) {
      this.log(`     ↳ ${failureMessage}`);
    }
  }

  /**
   * Report individual dynamic test result
   */
  reportTest(test: { description: string; requiresBrowser?: boolean; isOptional?: boolean }, status: 'pass' | 'fail' | 'skip' | 'optional-fail', failureMessage?: string) {
    const result: TestResult = {
      description: test.description,
      status,
      failureMessage,
      isOptional: test.isOptional,
    };

    if (status === 'skip' && test.requiresBrowser) {
      result.skipReason = 'Requires real browser (addEventListener events)';
    }

    this.dynamicResults.push(result);

    const icons = { pass: '✓', fail: '✗', skip: '○', 'optional-fail': '○' };
    //const colors = { pass: '', fail: '', skip: '' };
    
    const prefix = test.isOptional ? '[OPTIONAL] ' : '';
    this.log(`  ${icons[status]} ${prefix}${test.description}`);
    
    if (status === 'skip' && !this.isPlaywright) {
      this.log(`     ↳ Skipped in jsdom (runs in Playwright)`);
    }
    
    if (status === 'fail' && failureMessage && !test.isOptional) {
      this.log(`     ↳ ${failureMessage}`);
    }
    
    if (status === 'optional-fail') {
      this.log(`     ↳ Not implemented (recommended for enhanced UX)`);
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

  /**
   * Report optional features that aren't implemented
   */
  private reportOptionalSuggestions() {
    const suggestions = this.dynamicResults.filter(r => r.status === 'optional-fail');
    if (suggestions.length === 0) return;

    this.log(`\n${'─'.repeat(60)}`);
    this.log(`💡 Optional Enhancements (${suggestions.length}):\n`);
    this.log(`These features are optional per APG guidelines but recommended`);
    this.log(`for improved user experience and keyboard navigation:\n`);
    
    suggestions.forEach((test, index) => {
      this.log(`${index + 1}. ${test.description}`);
      if (test.failureMessage) {
        this.log(`   ↳ ${test.failureMessage}`);
      }
    });
    
    this.log(`\n✨ Consider implementing these for better accessibility`);
    this.log(`   Reference: ${this.apgUrl}\n`);
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
    this.log(`   testUiComponent('${this.componentName}', component, 'http://localhost:5173/')\n`);
  }

  /**
   * Generate final summary with statistics
   */
  summary(failures: string[]) {
    const duration = Date.now() - this.startTime;
    //const totalDynamic = this.dynamicResults.length;
    const dynamicPasses = this.dynamicResults.filter(r => r.status === 'pass').length;
    const dynamicFailures = this.dynamicResults.filter(r => r.status === 'fail').length;
    this.skipped = this.dynamicResults.filter(r => r.status === 'skip').length;
    this.optionalSuggestions = this.dynamicResults.filter(r => r.status === 'optional-fail').length;
    
    const totalPasses = this.staticPasses + dynamicPasses;
    const totalFailures = this.staticFailures + dynamicFailures;
    const totalRun = totalPasses + totalFailures;

    // Report failures first
    if (failures.length > 0) {
      this.reportFailures(failures);
    }

    // Report optional suggestions
    this.reportOptionalSuggestions();

    // Report skipped tests
    this.reportSkipped();

    // Summary section
    this.log(`\n${'═'.repeat(60)}`);
    this.log(`📊 Summary\n`);
    
    if (totalFailures === 0 && this.skipped === 0 && this.optionalSuggestions === 0) {
      this.log(`✅ All ${totalRun} tests passed!`);
      this.log(`   ${this.componentName} component meets APG and WCAG guidelines ✓`);
    } else if (totalFailures === 0) {
      this.log(`✅ ${totalPasses}/${totalRun} required tests passed`);
      if (this.skipped > 0) {
        this.log(`○  ${this.skipped} tests skipped`);
      }
      if (this.optionalSuggestions > 0) {
        this.log(`💡 ${this.optionalSuggestions} optional enhancement${this.optionalSuggestions > 1 ? 's' : ''} suggested`);
      }
      this.log(`   ${this.componentName} component meets required standards ✓`);
    } else {
      this.log(`❌ ${totalFailures} test${totalFailures > 1 ? 's' : ''} failed`);
      this.log(`✅ ${totalPasses} test${totalPasses > 1 ? 's' : ''} passed`);
      if (this.skipped > 0) {
        this.log(`○  ${this.skipped} test${this.skipped > 1 ? 's' : ''} skipped`);
      }
      if (this.optionalSuggestions > 0) {
        this.log(`💡 ${this.optionalSuggestions} optional enhancement${this.optionalSuggestions > 1 ? 's' : ''} suggested`);
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