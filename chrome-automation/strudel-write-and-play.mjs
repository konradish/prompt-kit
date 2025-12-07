export default async function({ browser, pages, page }) {
  const pattern = process.argv[3] || 's("bd sd bd sd")';
  
  // Click on editor
  await page.click('.cm-content');
  
  // Select all and replace
  await page.keyboard.down('Control');
  await page.keyboard.press('a');
  await page.keyboard.up('Control');
  await page.keyboard.press('Backspace');
  
  // Type the pattern
  await page.keyboard.type(pattern, {delay: 2});
  
  // Small delay then play
  await new Promise(r => setTimeout(r, 200));
  await page.keyboard.down('Control');
  await page.keyboard.press('Enter');
  await page.keyboard.up('Control');
  
  return { status: "playing", chars: pattern.length };
}
