/**
    * Runs static and interactions accessibility test on UI components.
    * @param {HTMLElement} component The UI component to be tested
    * @param {string} url Optional URL to run full Playwright E2E tests (requires dev server running)
*/
import type { JestAxeResult } from "Types";
export declare function testUiComponent(componentName: string, component: HTMLElement, url?: string): Promise<JestAxeResult>;
declare let runTest: () => Promise<void>;
export { runTest };
//# sourceMappingURL=test.d.ts.map