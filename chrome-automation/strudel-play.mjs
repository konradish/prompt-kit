export default async function({ browser, pages, page }) {
  // Click the play button (or use keyboard shortcut Ctrl+Enter)
  await page.keyboard.down('Control');
  await page.keyboard.press('Enter');
  await page.keyboard.up('Control');
  
  return "Playing";
}
