import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import readline from 'readline';

export type BadgeType = 'audit' | 'component' | 'verified';

export interface BadgeConfig {
  type: BadgeType;
  fileName: string;
  label: string;
  markdownUrl: string;
}

export const BADGE_CONFIGS: Record<BadgeType, BadgeConfig> = {
  audit: {
    type: 'audit',
    fileName: 'audited-by-aria-ease.svg',
    label: 'Audited by aria-ease',
    markdownUrl: 'https://cdn.jsdelivr.net/gh/aria-ease/aria-ease@main/badges/audited-by-aria-ease.svg'
  },
  component: {
    type: 'component',
    fileName: 'components-tested-aria-ease.svg',
    label: 'Components tested: aria-ease',
    markdownUrl: 'https://cdn.jsdelivr.net/gh/aria-ease/aria-ease@main/badges/components-tested-aria-ease.svg'
  },
  verified: {
    type: 'verified',
    fileName: 'verified-by-aria-ease.svg',
    label: 'Verified by aria-ease',
    markdownUrl: 'https://cdn.jsdelivr.net/gh/aria-ease/aria-ease@main/badges/verified-by-aria-ease.svg'
  }
};

/**
 * Generate badge markdown snippet
 */
export function getBadgeMarkdown(badgeType: BadgeType): string {
  const config = BADGE_CONFIGS[badgeType];
  return `[![${config.label}](${config.markdownUrl})](https://github.com/aria-ease/aria-ease)`;
}

/**
 * Display badge information to the user
 */
export function displayBadgeInfo(badgeType: BadgeType): void {
  const markdown = getBadgeMarkdown(badgeType);
  
  console.log(chalk.cyan('\n🏅 Show your accessibility commitment!'));
  console.log(chalk.white('   Add this badge to your README.md:\n'));
  console.log(chalk.green('   ' + markdown));
  console.log(chalk.dim('\n   This helps others discover accessibility tools and shows you care!\n'));
}

/**
 * Prompt user to add badge to README
 */
export async function promptAddBadge(badgeType: BadgeType, cwd: string = process.cwd()): Promise<void> {
  const readmePath = path.join(cwd, 'README.md');
  
  // Check if README exists
  const readmeExists = await fs.pathExists(readmePath);
  
  if (!readmeExists) {
    console.log(chalk.yellow('   ℹ️  No README.md found in current directory'));
    return;
  }

  // Read current README
  const readmeContent = await fs.readFile(readmePath, 'utf-8');
  const markdown = getBadgeMarkdown(badgeType);
  
  // Check if badge already exists
  if (readmeContent.includes(markdown) || readmeContent.includes(BADGE_CONFIGS[badgeType].fileName)) {
    console.log(chalk.gray('   ✓ Badge already in README.md'));
    return;
  }

  // Prompt user
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const answer = await new Promise<string>((resolve) => {
    rl.question(chalk.cyan('   Add badge to README.md now? (y/n): '), (ans) => {
      rl.close();
      resolve(ans.toLowerCase().trim());
    });
  });

  if (answer === 'y' || answer === 'yes') {
    await addBadgeToReadme(readmePath, readmeContent, markdown);
    console.log(chalk.green('   ✓ Badge added to README.md!'));
  } else {
    console.log(chalk.gray('   Skipped. You can add it manually anytime.'));
  }
}

/**
 * Add badge to README file
 */
async function addBadgeToReadme(readmePath: string, content: string, badge: string): Promise<void> {
  const lines = content.split('\n');
  let insertIndex = 0;

  // Try to find existing badges section or first heading
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // If there are existing badges (lines starting with [![), add after them
    if (line.startsWith('[![') || line.startsWith('[!')) {
      insertIndex = i + 1;
      continue;
    }
    
    // If we found badges and now hit non-badge content, insert here
    if (insertIndex > 0 && !line.startsWith('[![') && !line.startsWith('[!') && line.length > 0) {
      break;
    }
    
    // If we find the first heading and haven't found badges yet, insert before it
    if (insertIndex === 0 && line.startsWith('#')) {
      insertIndex = i + 2; // After the heading
      break;
    }
  }

  // If no good place found, add after first line (usually the title)
  if (insertIndex === 0) {
    insertIndex = 1;
  }

  // Insert badge
  lines.splice(insertIndex, 0, badge);
  
  await fs.writeFile(readmePath, lines.join('\n'), 'utf-8');
}

/**
 * Display all available badges
 */
export function displayAllBadges(): void {
  console.log(chalk.cyan('\n📍 Available badges:'));
  console.log(chalk.white('\n   For audits:'));
  console.log(chalk.green('   ' + getBadgeMarkdown('audit')));
  console.log(chalk.white('\n   For component testing:'));
  console.log(chalk.green('   ' + getBadgeMarkdown('component')));
  console.log(chalk.white('\n   For both (verified):'));
  console.log(chalk.green('   ' + getBadgeMarkdown('verified')));
  console.log('');
}