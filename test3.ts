// test.ts
import { chromium, Browser, Page, ElementHandle } from 'playwright';

interface OpeningHours {
  morningStart: string;
  morningEnd: string;
  afternoonStart: string;
  afternoonEnd: string;
}

const getOpeningHours = async (page: Page): Promise<OpeningHours> => {
  const openingHoursList = await page.$$('.cd-opening-hours .cd-opening-hours-list-item');
  const morningShift = openingHoursList[0];
  const afternoonShift = openingHoursList[1];

  const openingHours: OpeningHours = {
    morningStart: await (await morningShift.$eval('time', el => el.getAttribute('datetime'))).slice(0, 5),
    morningEnd: await (await morningShift.$eval('time', el => el.getAttribute('datetime'))).slice(0, 5),
    afternoonStart: await (await afternoonShift.$eval('time', el => el.getAttribute('datetime'))).slice(0, 5),
    afternoonEnd: await (await afternoonShift.$eval('time', el => el.getAttribute('datetime'))).slice(0, 5),
  };

  return openingHours;
};

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

  it('should navigate to the practice page of Peter Wunderlich and validate the details', async () => {
    await page.goto('https://demo.clickdoc.de/cd-de/');

    // Search for the doctor and city.
    await page.fill('input[name="q"]', 'Peter Wunderlich');
    await page.fill('input[name="l"]', 'Testhausen');
    await page.click('button[type="submit"]');
    await page.waitForSelector('.search-results-list', { visible: true });

    // Click on the first search result.
    await page.click('.search-results-list .card-item:first-child a');
    await page.waitForTimeout(5000);

    // Validate physician name and address.
    const physicianName = await page.textContent('h1.doctor-name');
    expect(physicianName).toBe('Peter Wunderlich');

    const physicianAddress = await page.textContent('.doctor-address');
    expect(physicianAddress).toBe('Testhausen, Musterstra├če 123');

    // Validate the current day opening hours from the contact section.
    const openingHours = await getOpeningHours(page);
    const currentDay = new Date().toLocaleString('default', { weekday: 'long' });

    const currentDayOpeningHours = await page.textContent(
      `.cd-opening-hours-list-item:nth-child(2) .cd-opening-hours-list-item-title:contains("${currentDay}")`
    );

    expect(currentDayOpeningHours).toBe(`${currentDay}`);

    // Validate the current day start and end time of morning and afternoon shift timings.
    const openingHoursValidation = {
      morning: `09:00 Uhr - ${openingHours.morningEnd} Uhr`,
      afternoon: `14:00 Uhr - ${openingHours.afternoonEnd} Uhr`,
    };

    const openingHoursValidationSelector = '.cd-opening-hours-list-item:nth-child(2) .cd-opening-hours-list-item-content';
    const openingHoursValidationText = await page.textContent(openingHoursValidationSelector);

    for (const [key, value] of Object.entries(openingHoursValidation)) {
      expect(openingHoursValidationText).toContain(value);
    }
  });
});
