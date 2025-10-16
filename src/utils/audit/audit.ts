import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";
import { AxeResults } from "Types";

export async function runAudit(url: string) {
    let browser; 

    try{
        browser = await chromium.launch({ headless: true });
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(url, { waitUntil: 'networkidle' });
        const axe = new AxeBuilder({ page });
        const axeResults: AxeResults = await axe.analyze();
        return axeResults;
    } catch(error: unknown) {
        if (error instanceof Error && error.message.includes("Executable doesn't exist")) {
            console.error('\n❌ Playwright browsers not found!\n');
            console.log('📦 First-time setup required:');
            console.log('   Run: npx playwright install chromium\n');
            console.log('💡 This downloads the browser needed for auditing (~200MB)');
            console.log('   You only need to do this once.\n');
            process.exit(1);
        }
        
    }
    
    if(browser) await browser.close(); 
}