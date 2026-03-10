#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import path from "path";
import fs from "fs-extra";
import { AxeResult } from "Types";
import { loadConfig } from "./configLoader.js";
import { displayBadgeInfo, promptAddBadge } from "./badgeHelper.js";

const program = new Command();

program.name('aria-ease').description('Run accessibility tests and audits').version('2.2.3');

program.command('audit')
.description('Run axe-core powered accessibility audit on webpages')
.option('-u, --url <url>', 'Single URL to audit')
.option('-f, --format <format>', 'Output format for the audit report: json | csv | html | all', 'all')
.option('-o, --out <path>', 'Directory to save the audit report', './accessibility-reports/audit')
.action(async (opts) => {
  console.log(chalk.cyanBright('🚀 Starting accessibility audit...\n'));

  // Dynamically import audit dependencies
  const { runAudit } = await import("../audit/src/audit/audit.js");
  const { formatResults } = await import("../audit/src/formatters/formatters.js");

  // Determine if we need config (only if URL not provided via CLI)
  const needsConfig = !opts.url;
  
  // Load config with robust discovery and validation
  const { config, configPath, errors } = await loadConfig(process.cwd());
  
  if (configPath) {
    console.log(chalk.green(`✅ Loaded config from ${path.basename(configPath)}\n`));
  } else if (errors.length > 0 && needsConfig) {
    // Only fail on config errors if we actually need the config for URLs
    console.log(chalk.red('❌ Config file errors:\n'));
    errors.forEach(err => console.log(chalk.red(`   ${err}`)));
    console.log('');
    process.exit(1);
  } else if (errors.length > 0) {
    // Config has errors but we don't need it (URL provided via CLI)
    console.log(chalk.yellow('⚠️  Config file has errors (ignored, using CLI options)\n'));
  } else if (!configPath && needsConfig) {
    console.log(chalk.yellow('ℹ️  No config file found, using CLI options.\n'));
  }

  const urls: string[] = [];
  if(opts.url) {
    urls.push(opts.url);
  } else if(config.audit?.urls && Array.isArray(config.audit.urls)) {
    urls.push(...config.audit.urls);
  }

  const format: string = (config.audit?.output && (config.audit.output as { format?: string }).format) || opts.format;
  if(!['json', 'csv', 'html', 'all'].includes(format)) {
    console.log(chalk.red('❌ Invalid format. Use "json", "csv", "html" or "all".'));
    process.exit(1);
  }

  if(urls.length === 0) {
    console.log(chalk.red('❌ No URLs provided. Use --url option or add "urls" in config file'));
    process.exit(1);
  }

  const allResults: { url: string, result?: AxeResult }[] = [];
  
  const { createAuditBrowser } = await import("../audit/src/audit/audit.js");
  const browser = await createAuditBrowser();
  
  try {
    const auditOptions = { browser };
    
    for (const url of urls) {
      console.log(chalk.yellow(`🔎 Auditing: ${url}`));
      try {
        const result: AxeResult = await runAudit(url, auditOptions);
        allResults.push({ url: url, result });
        console.log(chalk.green(`✅ Completed audit for ${url}\n`));
      } catch (error: unknown) {
        if(error instanceof Error && error.message) {
          console.log(chalk.red(`❌ Failed auditing ${url}: ${error.message}`));
        }
      }
    }
  } finally {
    // Always close the browser after all audits complete
    await browser.close();
  }

  const hasResults = allResults.some(r => r.result && r.result.violations && r.result.violations.length > 0);
  if (!hasResults) {
    const auditedCount = allResults.filter(r => r.result).length;
    if (auditedCount === 0) {
      console.log(chalk.red('❌ No pages were successfully audited.'));
      process.exit(1);
    }
    console.log(chalk.green('\n🎉 Great news! No static accessibility violations found!'));
    console.log(chalk.gray(`   Audited ${auditedCount} page${auditedCount > 1 ? 's' : ''} successfully.\n`));
    
    // Badge prompt - show even when no violations found (success case!)
    displayBadgeInfo('audit');
    await promptAddBadge('audit', process.cwd());
    
    // Call to action
    console.log(chalk.dim('\n' + '─'.repeat(60)));
    console.log(chalk.cyan('💙 Found aria-ease helpful?'));
    console.log(chalk.white('   • Star us on GitHub: ') + chalk.blue.underline('https://github.com/aria-ease/aria-ease'));
    console.log(chalk.white('   • Share feedback: ') + chalk.blue.underline('https://github.com/aria-ease/aria-ease/discussions'));
    console.log(chalk.dim('─'.repeat(60) + '\n'));
    
    process.exit(0);
  }

  async function createReport(format: string) {
    const formatted = formatResults(allResults, format);

    const out = (config.audit?.output && (config.audit.output as { out?: string }).out) || opts.out;

    await fs.ensureDir(out);
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const timestamp = `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()} ${pad(d.getHours())}h ${pad(d.getMinutes())}m ${pad(d.getSeconds())}s`;
    const fileName = `ariaease-report-${timestamp}.${format}`;
    const filePath = path.join(out, fileName);

    await fs.writeFile(filePath, formatted, 'utf-8');
    console.log(chalk.magentaBright(`📁 Report saved to ${filePath}`));
  }

  if(['json', 'csv', 'html'].includes(format)) {
    await createReport(format);
  } else if(format === 'all') {
    await Promise.all(['json', 'csv', 'html'].map((format) => createReport(format)));
  }

  console.log(chalk.green('\n🎉 All audits completed.'));
  
  // Badge prompt
  displayBadgeInfo('audit');
  await promptAddBadge('audit', process.cwd());
  
  // Call to action - help grow the community
  console.log(chalk.dim('\n' + '─'.repeat(60)));
  console.log(chalk.cyan('💙 Found aria-ease helpful?'));
  console.log(chalk.white('   • Star us on GitHub: ') + chalk.blue.underline('https://github.com/aria-ease/aria-ease'));
  console.log(chalk.white('   • Share feedback: ') + chalk.blue.underline('https://github.com/aria-ease/aria-ease/discussions'));
  console.log(chalk.dim('─'.repeat(60) + '\n'));
})

program.command('test')
.description('Run core a11y accessibility standard tests on UI components')
.action(async () => {
  const { runTest } = await import("../test/index.js");
  runTest();
})

program.command('help')
.description('Display help information')
.action(() => {
  program.outputHelp();
});

program.parse(process.argv);