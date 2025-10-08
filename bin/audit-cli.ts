#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import path from "path";
import fs from "fs-extra";
import { AriaEaseConfig, AxeResults } from "Types";
import { runAudit } from "aria-ease/audit";
import { formatResults } from "src/utils/audit/formatters";

const program = new Command();

program.name('aria-ease').description('Run accessibility audits').version('2.0.4');

program.command('audit')
.description('Run accessibility audit')
.option('-u, --url <url>', 'Single URL to audit')
.option('-f, --format <format>', 'Output format for the audit report: json | csv', 'csv')
.option('-o, --out <path>', 'Directory to save the audit report', './accessibility-reports')
.action(async (opts) => {
  console.log(chalk.cyanBright('🚀 Starting accessibility audit...\n'));

  const configPath = path.resolve(process.cwd(), 'ariaease.config.js');
  let config: AriaEaseConfig = {};
  if (await fs.pathExists(configPath)) {
    config = (await import(configPath)).default || (await import(configPath));
    console.log(chalk.green('✅ Loaded config from ariaease.config.js\n'));
  } else {
    console.log(chalk.yellow('ℹ️  No ariaease.config.js found at project root, using default configurations.'));
  }

  const urls: string[] = [];
  if(opts.url) urls.push(opts.url);
  if(config.urls && Array.isArray(config.urls)) urls.push(...config.urls);

  const format: string = (config.output && (config.output as { format?: string }).format) || opts.format;
  if(!['json', 'csv'].includes(format)) {
    console.log(chalk.red('❌ Invalid format. Use "json" or "csv".'));
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

  const formatted = formatResults(allResults, format);

  const out = (config.output && (config.output as { out?: string }).out) || opts.out;

  await fs.ensureDir(out);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `ariaease-report-${timestamp}.${format}`;
  const filePath = path.join(out, fileName);

  await fs.writeFile(filePath, formatted, 'utf-8');
  console.log(chalk.magentaBright(`📁 Report saved to ${filePath}`));

  console.log(chalk.green('\n🎉 All audits completed.'));
})

program.command('help')
.description('Display help information')
.action(() => {
  program.outputHelp();
});

program.parse(process.argv);