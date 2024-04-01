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

  it('should accept the cookie dialog and search for the doctor and city', async () => {
    await page.goto('https://demo.clickdoc.de/cd-de/');

    const acceptCookieButton = await page.waitForSelector('button[aria-label="Alle Cookies akzeptieren"]');
    await acceptCookieButton.click();

    // Wait for the page to load after accepting the cookies.
    await page.waitForTimeout(5000);

    // Fill the search fields and click 'Finden'.
    await page.fill('input[name="q"]', 'Peter Wunderlich');
    await page.fill('input[name="l"]', 'Testhausen');
    await page.click('button[type="submit"]');

    // Wait for the search results to load.
    await page.waitForSelector('.search-results-list', { visible: true });

    // Validate 'Peter Wunderlich' physician view was displayed as first in the list of results.
    const searchResults = await page.$$('.search-results-list .card-item');
    const firstResultName = await (await searchResults[0].$eval('h3', el => el.textContent)) || '';
    expect(firstResultName).toBe('Peter Wunderlich');

    // Validate physician name and address.
    const physicianName = await page.textContent('h3.card-title');
    const physicianAddress = await page.textContent('.doctor-address');
    expect(physicianName).toBe('Peter Wunderlich');
    expect(physicianAddress).toBe('Testhausen, Musterstra├če 123');

    // Validate that he is online bookable for the month of April 2024.
    const calendar = await page.waitForSelector('.cd-calendar-month');
    const calendarDays = await calendar.$$('.week-day');
    for (const day of calendarDays) {
      const dateText = await (await day.$eval('span', el => el.textContent)) || '';
      if (dateText.startsWith('2')) {
        // Check for availability in the month of April 2024.
        const availableSlot = await day.$('.cd-calendar-day-slot');
        expect(availableSlot).toBeTruthy();
        break;
      }
    }

    // Validate the color of 'Find' and 'Appointment booking' buttons in the page.
    const findButton = await page.$('.cd-search-button');
    const appointmentButton = await page.$('.cd-book-appointment-btn');

    const [findButtonColor, appointmentButtonColor] = await Promise.all([
      findButton?.evaluate(el => getComputedStyle(el).backgroundColor),
      appointmentButton?.evaluate(el => getComputedStyle(el).backgroundColor),
    ]);

    // The color values may vary depending on your system and browser.
    // You can use a tool like 'https://www.colorhexa.com/' to find the actual color values.
    expect(findButtonColor).toBe('rgba(0, 123, 255, 1)');
    expect(appointmentButtonColor).toBe('rgba(0, 123, 255, 1)');
  });
});
