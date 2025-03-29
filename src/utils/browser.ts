import { chromium, type Browser, type Page } from 'playwright';
import { applyAntiDetect } from './anti-detect';
import config from '../config/playwright.config';

export async function launchBrowser(): Promise<Browser> {
  return await chromium.launch({
    headless: config.use?.headless,
  });
}

export async function createPage(browser: Browser, url: string): Promise<Page> {
  const page = await browser.newPage();
  await applyAntiDetect(page);
  await page.goto(url, {
    waitUntil: 'domcontentloaded',
    timeout: config.use?.navigationTimeout,
  });
  return page;
}
