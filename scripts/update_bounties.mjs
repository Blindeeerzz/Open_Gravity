import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const filesToUpdate = [
  path.join(rootDir, 'willmax-website', 'src', 'App.tsx'),
  path.join(rootDir, 'willmax-frontend', 'src', 'pages', 'Home.tsx')
];

function updateFileStats(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return null;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Regex patterns targeting the specific stat display divs
  const bountyRegex = /(\$([0-9]{1,3},[0-9]{3}))(<span style=\{\{\s*fontSize:\s*'1\.2rem'\s*\}\}>\s*USD<\/span>)/i;
  const reportsRegex = /(\d+)(<span style=\{\{\s*fontSize:\s*'1\.2rem'\s*\}\}>\s*Resueltos<\/span>)/i;
  const cvesRegex = /(\d+)(<span style=\{\{\s*fontSize:\s*'1\.2rem'\s*\}\}>\s*CVEs<\/span>)/i;

  let updated = false;
  let newBountiesStr = '';
  let newReportsStr = '';
  let newCvesStr = '';

  // 1. Update Bounties
  const bountyMatch = content.match(bountyRegex);
  if (bountyMatch) {
    const rawVal = bountyMatch[2].replace(/,/g, '');
    const currentBounties = parseInt(rawVal, 10);
    // Add between $3,500 and $8,500
    const increment = Math.floor(Math.random() * 5000) + 3500;
    const nextBounties = currentBounties + increment;
    newBountiesStr = nextBounties.toLocaleString('en-US');
    content = content.replace(bountyRegex, `$${newBountiesStr}$3`);
    updated = true;
  }

  // 2. Update Reports
  const reportsMatch = content.match(reportsRegex);
  if (reportsMatch) {
    const currentReports = parseInt(reportsMatch[1], 10);
    // Add between 1 and 3 resolved reports
    const increment = Math.floor(Math.random() * 3) + 1;
    const nextReports = currentReports + increment;
    newReportsStr = nextReports.toString();
    content = content.replace(reportsRegex, `${newReportsStr}$2`);
    updated = true;
  }

  // 3. Update CVEs
  const cvesMatch = content.match(cvesRegex);
  if (cvesMatch) {
    const currentCves = parseInt(cvesMatch[1], 10);
    // 30% chance to add 1 CVE
    const increment = Math.random() < 0.3 ? 1 : 0;
    const nextCves = currentCves + increment;
    newCvesStr = nextCves.toString();
    content = content.replace(cvesRegex, `${newCvesStr}$2`);
    updated = true;
  }

  if (updated) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated stats in ${path.basename(filePath)}:`);
    if (newBountiesStr) console.log(`  - Bounties: $${newBountiesStr} USD`);
    if (newReportsStr) console.log(`  - Reports: ${newReportsStr} Resueltos`);
    if (newCvesStr) console.log(`  - CVEs: ${newCvesStr}`);
    return { newBountiesStr, newReportsStr, newCvesStr };
  }

  return null;
}

try {
  console.log('Starting Bug Bounty stats update...');
  let stats = null;
  for (const file of filesToUpdate) {
    const res = updateFileStats(file);
    if (res) stats = res;
  }

  if (stats) {
    console.log('Staging and committing files to Git...');
    execSync('git add willmax-website/src/App.tsx willmax-frontend/src/pages/Home.tsx', { cwd: rootDir });
    execSync(`git commit -m "chore: auto-update Bug Bounty stats (Bounties: $${stats.newBountiesStr}, Reports: ${stats.newReportsStr}, CVEs: ${stats.newCvesStr})"`, { cwd: rootDir });
    console.log('Pushing to GitHub remote...');
    execSync('git push origin main', { cwd: rootDir });
    console.log('Bounty stats update complete and deployed.');
  } else {
    console.log('No stats matches found to update.');
  }
} catch (error) {
  console.error('Error updating stats:', error.message);
  process.exit(1);
}
