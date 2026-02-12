/**
 * Shared Playwright browser instance for all contract tests
 * Avoids launching a new browser for each component test
 */
import { chromium, Browser, BrowserContext, Page } from "playwright";

let sharedBrowser: Browser | null = null;
let sharedContext: BrowserContext | null = null;

export async function getOrCreateBrowser(): Promise<Browser> {
  if (!sharedBrowser) {
    sharedBrowser = await chromium.launch({ 
      headless: true,
      // Launch with clean browser profile - no extensions, no user data
      args: [
        '--disable-extensions',
        '--disable-blink-features=AutomationControlled',
      ]
    });
  }
  return sharedBrowser;
}

export async function getOrCreateContext(): Promise<BrowserContext> {
  if (!sharedContext) {
    const browser = await getOrCreateBrowser();
    sharedContext = await browser.newContext({
      // Isolated context - no permissions, no geolocation, etc.
      permissions: [],
      // Ignore HTTPS errors for local dev servers
      ignoreHTTPSErrors: true,
    });
  }
  return sharedContext;
}

export async function createTestPage(): Promise<Page> {
  const context = await getOrCreateContext();
  return await context.newPage();
}

export async function closeSharedBrowser(): Promise<void> {
  if (sharedContext) {
    await sharedContext.close();
    sharedContext = null;
  }
  if (sharedBrowser) {
    await sharedBrowser.close();
    sharedBrowser = null;
  }
}