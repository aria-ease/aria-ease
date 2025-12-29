import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";
import type { AxeResult } from "Types";

export async function runAudit(url: string) {
    let browser;

    try{ 
        browser = await chromium.launch({ headless: true });
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(url, { waitUntil: 'networkidle' });
        const axe = new AxeBuilder({ page });
        const axeResults: AxeResult = await axe.analyze();
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
        if(browser) await browser.close(); 
    }
}