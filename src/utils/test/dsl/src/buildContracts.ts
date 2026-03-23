import path from 'path';
import fs from 'fs-extra';
import { glob } from 'node:fs/promises';
import chalk from 'chalk';
import { AriaEaseConfig } from 'Types';
import {
  validateContractSchema,
  validateRelationshipReferences,
  validateTargetReferences
} from './contractValidator.js';

interface ContractModule {
  default?: { toJSON(): object };
  [key: string]: { toJSON(): object } | undefined;
}

/**
 * Builds (compiles) DSL contract files to JSON format
 * @param cwd - Current working directory (config file location)
 * @param config - AriaEase config object
 * @returns Object with summary of built contracts
 */
export async function buildContracts(
  cwd: string,
  config: AriaEaseConfig
): Promise<{ success: boolean; built: string[]; errors: string[] }> {
  const errors: string[] = [];
  const built: string[] = [];

  // Check if contracts config exists
  if (!config.contracts || config.contracts.length === 0) {
    console.log(chalk.yellow('ℹ️  No contracts configured. Add "contracts" array to ariaease.config.js'));
    return { success: true, built, errors };
  }

  try {
    console.log(chalk.cyanBright('\n🏗️  Building contracts...\n'));

    // Process each contract source
    for (const contractSource of config.contracts) {
      const srcPattern = path.resolve(cwd, contractSource.src);
      const outDir = contractSource.out
        ? path.resolve(cwd, contractSource.out)
        : undefined;

      console.log(chalk.gray(`   Pattern: ${contractSource.src}`));
      if (outDir) {
        console.log(chalk.gray(`   Output:  ${contractSource.out}\n`));
      } else {
        console.log(chalk.gray(`   Output:  Same directory as source\n`));
      }

      // Use glob to find matching files (glob returns AsyncIterable, convert to array)
      const contractFiles: string[] = [];
      for await (const file of glob(srcPattern, { cwd: cwd })) {
        contractFiles.push(file);
      }

      if (contractFiles.length === 0) {
        console.log(chalk.yellow(`⚠️  No contract files found matching pattern: ${contractSource.src}`));
        continue;
      }

      // Ensure output directory exists
      if (outDir) {
        await fs.ensureDir(outDir);
      }

      // Process each contract file
      for (const contractFile of contractFiles) {
        try {
          const absolutePath = contractFile.startsWith('/') 
            ? contractFile 
            : path.resolve(cwd, contractFile);

          // Dynamically import the DSL contract
          const module = (await import(`file://${absolutePath}`)) as ContractModule;
          
          // Extract the contract (default export or first named export with toJSON method)
          let contract = module.default;
          if (!contract) {
            const namedExports = Object.entries(module).find(
              ([, value]) => value && typeof value === 'object' && 'toJSON' in value
            );
            if (namedExports) {
              contract = namedExports[1] as { toJSON(): object };
            }
          }

          if (!contract || typeof contract.toJSON !== 'function') {
            errors.push(`${path.basename(contractFile)}: No contract with toJSON() method found`);
            continue;
          }

          // Generate JSON
          const json = contract.toJSON();

          // Validate contract schema
          const schemaValidation = validateContractSchema(json);
          if (!schemaValidation.valid) {
            const errorLines = schemaValidation.errors
              .map(err => `     ${chalk.red('✗')} ${err.path}: ${err.message}`)
              .join('\n');
            const errorMsg = `Schema validation failed:\n${errorLines}`;
            errors.push(`${path.basename(contractFile)}: ${errorMsg}`);
            console.log(chalk.red(`❌ ${path.basename(contractFile)}`));
            console.log(chalk.red(`   ${errorMsg}`));
            continue;
          }

          // Validate relationship and target references
          const selectorKeys = new Set<string>();
          if (json && typeof json === 'object' && 'selectors' in json) {
            const selectors = (json as Record<string, unknown>).selectors as Record<string, unknown>;
            Object.keys(selectors).forEach(key => selectorKeys.add(key));
          }

          const refErrors = [
            ...validateRelationshipReferences(json, selectorKeys),
            ...validateTargetReferences(json, selectorKeys)
          ];

          if (refErrors.length > 0) {
            const errorLines = refErrors
              .map(err => `     ${chalk.red('✗')} ${err.path}: ${err.message}`)
              .join('\n');
            const errorMsg = `Reference validation failed:\n${errorLines}`;
            errors.push(`${path.basename(contractFile)}: ${errorMsg}`);
            console.log(chalk.red(`❌ ${path.basename(contractFile)}`));
            console.log(chalk.red(`   ${errorMsg}`));
            continue;
          }

          // Determine output path
          const contractName = path.basename(contractFile, path.extname(contractFile));
          const outputFile = outDir
            ? path.join(outDir, `${contractName}.json`)
            : path.join(path.dirname(absolutePath), `${contractName}.json`);

          // Write JSON file
          await fs.writeFile(outputFile, JSON.stringify(json, null, 2) + '\n', 'utf-8');
          
          const relativePath = path.relative(cwd, outputFile);
          built.push(relativePath);
          console.log(chalk.green(`✅ ${path.basename(contractFile)} → ${path.basename(outputFile)}`));
        } catch (error: unknown) {
          const errorMsg = error instanceof Error ? error.message : String(error);
          const filename = path.basename(contractFile);
          errors.push(`${filename}: ${errorMsg}`);
          console.log(chalk.red(`❌ ${filename}`));
          console.log(chalk.red(`   Error: ${errorMsg}`));
        }
      }
    }

    // Summary
    console.log('');
    if (errors.length === 0) {
      console.log(chalk.green(`✅ Built ${built.length} contract${built.length !== 1 ? 's' : ''} successfully\n`));
      return { success: true, built, errors };
    } else {
      console.log(chalk.yellow(`⚠️  Built ${built.length} contracts with ${errors.length} error${errors.length !== 1 ? 's' : ''}\n`));
      return { success: false, built, errors };
    }
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    const msg = `Failed to build contracts: ${errorMsg}`;
    errors.push(msg);
    console.log(chalk.red(`❌ ${msg}\n`));
    return { success: false, built, errors };
  }
}