// test.ts
import { chromium, Browser, Page, ElementHandle } from 'playwright';

describe('ClickDoc DE Demo', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should accept the cookie dialog', async () => {
    await page.goto('https://demo.clickdoc.de/cd-de/');

    const acceptCookieButton = await page.waitForSelector('button[aria-label="Alle Cookies akzeptieren"]');
    await acceptCookieButton.click();

    // Optionally, you can check if the page title is updated after accepting the cookies.
    await expect(page).toHaveTitle('ClickDoc - Terminvereinbarung');
  });
});
