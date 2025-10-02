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
        //console.log("--- AXE-CORE VIOLATIONS RESULTS ---");
        //const violations = axeResults.violations.filter(v => v.nodes.length > 0);
        /* console.log(JSON.stringify(violations, null, 2));


        console.log("--- EACH AXE-CORE VIOLATION ---");

        violations.forEach(v => {
            console.log(`\nRule: ${v.id}`);
            console.log(`Impact: ${v.impact}`);
            console.log(`Description: ${v.description}`);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            v.nodes.forEach((n: any) => {
                console.log(`  → Target: ${n.target}`);
                console.log(`    Failure: ${n.failureSummary}`);
            });
        });


        const snapshot = await page.accessibility.snapshot();
        console.log("\n--- PLAYWRIGHT SNAPSHOT ---");
        console.log(snapshot); */


        return axeResults;
    } catch(error) {
        console.log(error);
    }
    
    await browser.close(); 
}