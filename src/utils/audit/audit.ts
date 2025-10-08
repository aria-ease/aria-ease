import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";
import { AxeResults } from "Types";

export async function runAudit(url: string) {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });

    try{
        const axe = new AxeBuilder({ page });
        const axeResults: AxeResults = await axe.analyze();
        return axeResults;
    } catch(error) {
        console.log(error);
    }
    
    await browser.close(); 
}