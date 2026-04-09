import AxeBuilder from "@axe-core/playwright";
import { chromium, Browser } from "playwright";
import { AxeResult } from "Types";

/**
 * Shared browser instance for auditing multiple URLs
 * Reuses browser across audits to avoid repeated launch overhead
 */
export async function createAuditBrowser(): Promise<Browser> {
    return await chromium.launch({ headless: true });
}

export async function runAudit(url: string, options: { browser?: Browser; }): Promise<AxeResult> {
    let browser: Browser | undefined = options.browser;
    let browserCreated: boolean = false;
    
    const timeout: number = 60000;
    const waitUntil: "load" | "domcontentloaded" | "networkidle" | "commit" | undefined = 'domcontentloaded';

    try{ 
        // Create browser only if not provided (backward compatibility)
        if (!browser) {
            browser = await chromium.launch({ headless: true });
            browserCreated = true;
        }
        
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(url, { waitUntil, timeout });
        try {
            await page.waitForSelector('main', { state: 'visible', timeout });
        } catch (waitError) {
            console.warn(`⚠️  Warning: <main> landmark not found or not visible on ${url} after ${timeout}ms. Audit will continue, but results may be inaccurate. Consider adding a <main> element to improve audit accuracy. ${waitError instanceof Error ? waitError.message : String(waitError)}`);
        }
        const axe = new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']);
        const axeResults: AxeResult = await axe.analyze();
        
        // Clean up page and context but not browser (if reused)
        await page.close();
        await context.close();
        
        return axeResults;
    } catch(error: unknown) {
        if (error instanceof Error) {
            if (error.message.includes("Executable doesn't exist")) {
                console.error('\n❌ Playwright browsers not found!\n');
                console.log('📦 First-time setup required:');
                console.log('   Run: npx playwright install chromium\n');
                console.log('💡 This downloads the browser needed for auditing (~200MB)');
                console.log('   You only need to do this once.\n');
            } else if(error.message.includes("page.goto: net::ERR_CONNECTION_REFUSED")) {
                console.error('\n❌ Server Not Running!\n');
                console.log('   Make sure your server is running before auditing URL');
                console.log('   Run: npm run dev # or your start command');
            } else if(error.message.includes("page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL")) {
                console.error('\n❌ Cannot audit invalid URL\n')
            } else {
                console.error('❌ Audit error:', error.message);
                console.log('   Make sure you provide a valid URL');
            }
        } else {
            console.error('❌ Audit error (non-Error):', String(error));
        }
        throw error;
    } finally {
        if(browser && browserCreated) {
            await browser.close(); 
        }
    }
}