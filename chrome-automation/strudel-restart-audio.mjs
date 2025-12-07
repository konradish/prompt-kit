export default async function({ browser, pages, page }) {
  // Click somewhere to re-enable audio context (browser security)
  await page.click('body');
  await new Promise(r => setTimeout(r, 200));
  
  // Click stop first to reset
  try {
    await page.click('text=stop');
    await new Promise(r => setTimeout(r, 300));
  } catch(e) {}
  
  // Click on editor
  await page.click('.cm-content');
  
  // Select all and replace
  await page.keyboard.down('Control');
  await page.keyboard.press('a');
  await page.keyboard.up('Control');
  await page.keyboard.press('Backspace');
  
  // Type simple pattern
  await page.keyboard.type('s("bd sd bd sd").bank("RolandTR808")', {delay: 5});
  
  // Click play (not update)
  await new Promise(r => setTimeout(r, 200));
  await page.click('text=play');
  
  return "Restarted with simple pattern";
}
