/**
 * Queries - Information retrieval commands
 *
 * state, screenshot, wait, eval
 */

/**
 * Get page state as JSON
 * @param {Page} page - Puppeteer page
 * @returns {Object} Page state including URL, title, cookies, elements
 */
export async function getState(page) {
  try {
    const url = page.url();
    const title = await page.title();

    // Get cookies
    const cookies = await page.cookies();

    // Find auth-related cookie
    const authCookie = cookies.find(c =>
      c.name.toLowerCase().includes('auth') ||
      c.name.toLowerCase().includes('session') ||
      c.name.toLowerCase().includes('token') ||
      c.name.toLowerCase().includes('jwt')
    );

    // Get key interactive elements
    const elements = await page.evaluate(() => {
      const results = [];
      const selectors = 'a, button, input, select, [role="button"], nav a, header a';
      const els = document.querySelectorAll(selectors);

      for (const el of els) {
        // Skip hidden elements
        if (el.offsetParent === null && el.tagName !== 'INPUT') continue;

        const text = (el.textContent || el.value || el.placeholder || '').trim();
        if (!text || text.length > 100) continue;

        results.push({
          tag: el.tagName.toLowerCase(),
          text: text.substring(0, 100),
          href: el.getAttribute('href') || undefined,
          type: el.getAttribute('type') || undefined,
          id: el.id || undefined,
          name: el.getAttribute('name') || undefined
        });

        // Limit to 50 elements
        if (results.length >= 50) break;
      }

      return results;
    });

    return {
      success: true,
      url,
      title,
      cookies: cookies.map(c => ({ name: c.name, domain: c.domain })),
      authCookie: authCookie ? {
        name: authCookie.name,
        domain: authCookie.domain,
        expires: authCookie.expires
      } : null,
      elements
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to get state: ${error.message}`
    };
  }
}

/**
 * Take a screenshot
 * @param {Page} page - Puppeteer page
 * @param {Object} options - { output: filepath (optional) }
 * @returns {Object} Result with base64 or file path
 */
export async function screenshot(page, options = {}) {
  try {
    const screenshotOptions = {
      type: 'png',
      fullPage: false
    };

    if (options.output) {
      screenshotOptions.path = options.output;
      await page.screenshot(screenshotOptions);

      return {
        success: true,
        saved: options.output
      };
    } else {
      const buffer = await page.screenshot(screenshotOptions);
      const base64 = buffer.toString('base64');

      return {
        success: true,
        base64,
        mimeType: 'image/png',
        size: buffer.length
      };
    }
  } catch (error) {
    return {
      success: false,
      error: `Screenshot failed: ${error.message}`
    };
  }
}

/**
 * Wait for text to appear on page
 * @param {Page} page - Puppeteer page
 * @param {string} text - Text to wait for
 * @param {number} timeout - Max wait time in ms
 * @returns {Object} Result with success status
 */
export async function waitForText(page, text, timeout = 5000) {
  const searchLower = text.toLowerCase();

  try {
    await page.waitForFunction(
      (search) => {
        const body = document.body?.innerText?.toLowerCase() || '';
        return body.includes(search);
      },
      { timeout },
      searchLower
    );

    return {
      success: true,
      found: text
    };
  } catch (error) {
    if (error.name === 'TimeoutError') {
      return {
        success: false,
        error: `Text "${text}" not found within ${timeout}ms`
      };
    }
    return {
      success: false,
      error: `Wait failed: ${error.message}`
    };
  }
}

/**
 * Execute JavaScript in page context
 * @param {Page} page - Puppeteer page
 * @param {string} script - JavaScript to execute
 * @returns {Object} Result with return value
 */
export async function evaluate(page, script) {
  try {
    // Wrap script in a function that returns the result
    const wrappedScript = `(() => { return ${script}; })()`;
    const result = await page.evaluate(wrappedScript);

    return {
      success: true,
      result
    };
  } catch (error) {
    return {
      success: false,
      error: `Eval failed: ${error.message}`
    };
  }
}
