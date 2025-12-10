import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default async function({ browser, pages, page: defaultPage }) {
  const patternFile = process.argv[3] || path.join(__dirname, 'pattern.txt');
  const pattern = fs.readFileSync(patternFile, 'utf-8').trim();

  // Find the Strudel tab
  let page = pages.find(p => p.url().includes('strudel.cc'));
  if (!page) {
    throw new Error('Strudel tab not found. Open https://strudel.cc first.');
  }

  // Bring the Strudel tab to front
  await page.bringToFront();

  // Click on editor
  await page.click('.cm-content');

  // Select all and replace
  await page.keyboard.down('Control');
  await page.keyboard.press('a');
  await page.keyboard.up('Control');
  await page.keyboard.press('Backspace');

  // Type the pattern
  await page.keyboard.type(pattern, {delay: 1});

  // Evaluate with Ctrl+Enter
  await new Promise(r => setTimeout(r, 200));
  await page.keyboard.down('Control');
  await page.keyboard.press('Enter');
  await page.keyboard.up('Control');

  return { status: "playing", chars: pattern.length };
}
