export default async function({ browser, pages, page }) {
  await page.screenshot({path: 'current-screen.png', fullPage: false});
  return "Screenshot saved";
}
