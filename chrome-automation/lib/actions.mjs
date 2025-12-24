/**
 * Actions - Browser interaction commands
 *
 * click, clear, navigate
 */

/**
 * Find element by fuzzy text match
 * @param {Page} page - Puppeteer page
 * @param {string} searchText - Text to find (case-insensitive, partial match)
 * @returns {ElementHandle|null}
 */
export async function findElementByText(page, searchText) {
  const searchLower = searchText.toLowerCase().trim();

  // Get all interactive elements
  const result = await page.evaluate((search) => {
    const elements = document.querySelectorAll('a, button, input[type="submit"], input[type="button"], [role="button"], [onclick], [tabindex]');
    const matches = [];

    for (const el of elements) {
      const text = (el.textContent || el.value || el.getAttribute('aria-label') || '').toLowerCase().trim();
      const title = (el.getAttribute('title') || '').toLowerCase();
      const href = (el.getAttribute('href') || '').toLowerCase();

      // Check for match
      if (text.includes(search) || title.includes(search) || href.includes(search)) {
        // Get a unique selector for this element
        let selector = '';
        if (el.id) {
          selector = `#${el.id}`;
        } else {
          // Build a path
          const path = [];
          let current = el;
          while (current && current !== document.body) {
            let part = current.tagName.toLowerCase();
            if (current.className && typeof current.className === 'string') {
              const mainClass = current.className.split(/\s+/).find(c => c && !c.includes(':'));
              if (mainClass) {
                part += `.${mainClass}`;
              }
            }
            path.unshift(part);
            current = current.parentElement;
          }
          selector = path.join(' > ');
        }

        matches.push({
          text: el.textContent?.trim().substring(0, 100),
          tag: el.tagName.toLowerCase(),
          selector,
          visible: el.offsetParent !== null,
          exactMatch: text === search
        });
      }
    }

    // Sort: exact matches first, then visible elements
    matches.sort((a, b) => {
      if (a.exactMatch !== b.exactMatch) return b.exactMatch - a.exactMatch;
      if (a.visible !== b.visible) return b.visible - a.visible;
      return 0;
    });

    return matches[0] || null;
  }, searchLower);

  if (!result) {
    return null;
  }

  // Return the element handle
  try {
    const elementHandle = await page.$(result.selector);
    return { element: elementHandle, info: result };
  } catch {
    return null;
  }
}

/**
 * Click element containing text
 * @param {Page} page - Puppeteer page
 * @param {string} searchText - Text to find and click
 * @returns {Object} Result with success status
 */
export async function clickByText(page, searchText) {
  const found = await findElementByText(page, searchText);

  if (!found || !found.element) {
    return {
      success: false,
      error: `No element found containing text: "${searchText}"`
    };
  }

  try {
    // Scroll into view
    await found.element.evaluate(el => el.scrollIntoView({ block: 'center' }));

    // Click using evaluate to avoid puppeteer waiting for navigation
    // This dispatches a click event and returns immediately
    await found.element.evaluate(el => el.click());

    // Brief wait for click to register
    await new Promise(r => setTimeout(r, 300));

    return {
      success: true,
      clicked: {
        text: found.info.text,
        tag: found.info.tag,
        selector: found.info.selector
      }
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to click element: ${error.message}`,
      found: found.info
    };
  }
}

/**
 * Navigate to URL
 * @param {Page} page - Puppeteer page
 * @param {string} url - URL to navigate to
 * @returns {Object} Result with success status
 */
export async function navigate(page, url) {
  try {
    // Ensure URL has protocol
    let fullUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      fullUrl = 'https://' + url;
    }

    await page.goto(fullUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    return {
      success: true,
      url: page.url(),
      title: await page.title()
    };
  } catch (error) {
    return {
      success: false,
      error: `Navigation failed: ${error.message}`
    };
  }
}

/**
 * Clear cookies and localStorage
 * @param {Page} page - Puppeteer page
 * @returns {Object} Result with success status
 */
export async function clear(page) {
  try {
    // Clear localStorage
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    // Clear cookies via CDP
    const client = await page.target().createCDPSession();
    await client.send('Network.clearBrowserCookies');
    await client.send('Network.clearBrowserCache');
    await client.detach();

    return {
      success: true,
      message: 'Cleared cookies, localStorage, sessionStorage, and cache'
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to clear: ${error.message}`
    };
  }
}
