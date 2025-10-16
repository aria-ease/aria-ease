#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import path from "path";
import fs from "fs-extra";
import { AriaEaseConfig, AxeResults } from "Types";
import { runAudit } from "aria-ease/audit";
import { formatResults } from "src/utils/audit/formatters";

const program = new Command();

program.name('aria-ease').description('Run accessibility tests and audits').version('2.1.1');

program.command('audit')
.description('Run axe-core powered accessibility audit on webpages')
.option('-u, --url <url>', 'Single URL to audit')
.option('-f, --format <format>', 'Output format for the audit report: json | csv | html', 'all')
.option('-o, --out <path>', 'Directory to save the audit report', './accessibility-reports/audit')
.action(async (opts) => {
  console.log(chalk.cyanBright('🚀 Starting accessibility audit...\n'));

  const configPath = path.resolve(process.cwd(), 'ariaease.config.js');
  let config: AriaEaseConfig = {};
  if (await fs.pathExists(configPath)) {
    config = (await import(configPath)).default || (await import(configPath));
    console.log(chalk.green('✅ Loaded config from ariaease.config.js\n'));
  } else {
    console.log(chalk.yellow('ℹ️  No ariaease.config.js found at project root, using CLI configurations.'));
  }

  const urls: string[] = [];
  if(opts.audit?.url) urls.push(opts.audit.url);
  if(config.audit?.urls && Array.isArray(config.audit.urls)) urls.push(...config.audit.urls);

  const format: string = (config.audit?.output && (config.audit.output as { format?: string }).format) || opts.audit?.format;
  if(!['json', 'csv', 'html', 'all'].includes(format)) {
    console.log(chalk.red('❌ Invalid format. Use "json", "csv", "html" or "all".'));
    process.exit(1);
  }

  if(urls.length === 0) {
    console.log(chalk.red('❌ No URLs provided. Use --url option or add "urls" in ariaease.config.js'));
    process.exit(1);
  }

  const allResults: { url: string, result?: AxeResults }[] = [];
  for (const url of urls) {
    console.log(chalk.yellow(`🔎 Auditing: ${url}`));
    try {
      const result = await runAudit(url);
      allResults.push({ url: url, result });
      console.log(chalk.green(`✅ Completed audit for ${url}\n`));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log(chalk.red(`❌ Failed auditing ${url}: ${err.message}`));
    }
  }

  const hasResults = allResults.some(r => r.result && r.result.violations && r.result.violations.length > 0);
  if (!hasResults) {
    console.log(chalk.red('❌ No audit report generated'));
    process.exit(1);
  }

  async function createReport(format: string) {
    const formatted = formatResults(allResults, format);

    const out = (config.audit?.output && (config.audit.output as { out?: string }).out) || opts.audit.out;

    await fs.ensureDir(out);
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const timestamp = `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    const fileName = `ariaease-report-${timestamp}.${format}`;
    const filePath = path.join(out, fileName);

    await fs.writeFile(filePath, formatted, 'utf-8');
    console.log(chalk.magentaBright(`📁 Report saved to ${filePath}`));
  }

  if(['json', 'csv', 'html'].includes(format)) {
    createReport(format);
  } else if(format === 'all') {
    ['json', 'csv', 'html'].map((format) => {
      createReport(format);
    })
  }

  console.log(chalk.green('\n🎉 All audits completed.'));
})

program.command('test')
.description('Run core a11y accessibility standard tests on UI components')
.option('-f, --format <format>', 'Output format for the test report: json | csv | html', 'html')
.option('-o, --out <path>', 'Directory to save the test report', './accessibility-reports/test')
.action(() => {
  console.log('Coming soon')
})

program.command('help')
.description('Display help information')
.action(() => {
  program.outputHelp();
});

program.parse(process.argv);