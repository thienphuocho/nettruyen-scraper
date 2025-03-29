import { defineConfig, devices } from 'playwright/test';

export default defineConfig({
  retries: 1,
  timeout: 60_000,
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        headless: true,
        viewport: { width: 1280, height: 720 },
        screenshot: 'only-on-failure',
        trace: 'on-first-retry',
      },
    },
  ],
  use: {
    baseURL: process.env.NETTRUYEN_URL || 'https://nettruyen.com',
    extraHTTPHeaders: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    },
    navigationTimeout: 60_000,
    headless: true,
    storageState: undefined,
  },
  workers: '50%',
});
