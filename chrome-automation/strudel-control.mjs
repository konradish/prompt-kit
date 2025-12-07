export default async function({ browser, pages, page }) {
  // Close welcome panel by clicking X button
  try {
    await page.click('button:has-text("×")');
  } catch (e) {}
  
  // Small delay
  await new Promise(r => setTimeout(r, 300));
  
  // Click on the editor area (CodeMirror)
  await page.click('.cm-content');
  
  // Select all and clear
  await page.keyboard.down('Control');
  await page.keyboard.press('a');
  await page.keyboard.up('Control');
  await page.keyboard.press('Backspace');
  
  // Type a simple pattern
  await page.keyboard.type('s("bd sd bd sd").bank("RolandTR808")', {delay: 5});
  
  return "Pattern written";
}
