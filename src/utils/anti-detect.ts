import { type Page } from 'playwright';
import config from '../config/playwright.config';

// Danh sách User-Agent ngẫu nhiên
const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1',
];

// Hàm chọn User-Agent ngẫu nhiên
function getRandomUserAgent(): string {
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

// Hàm thêm delay ngẫu nhiên
function randomDelay(min: number, max: number): Promise<void> {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
}

// Hàm mô phỏng hành vi người dùng
async function simulateHumanBehavior(page: Page): Promise<void> {
  // Cuộn trang ngẫu nhiên
  await page.evaluate(() => {
    window.scrollTo(0, Math.random() * document.body.scrollHeight);
  });
  await randomDelay(500, 2000); // Delay 0.5-2 giây

  // Di chuột ngẫu nhiên
  await page.mouse.move(Math.random() * 1280, Math.random() * 720);
  await randomDelay(300, 1000); // Delay 0.3-1 giây
}

// Hàm cấu hình anti-detect cho page
export async function applyAntiDetect(page: Page): Promise<void> {
  // Set User-Agent ngẫu nhiên
  const userAgent = getRandomUserAgent();
  await page.setExtraHTTPHeaders({
    ...config.use?.extraHTTPHeaders, // Kết hợp với headers từ config
    'User-Agent': userAgent,
  });

  // Bỏ qua WebDriver detection
  await page.context().addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', {
      get: () => false,
    });
  });

  // Mô phỏng hành vi người dùng trước khi crawl
  await simulateHumanBehavior(page);

  // Có thể thêm proxy nếu cần (uncomment nếu có proxy)
  // await page.context().setProxy({ server: 'http://your-proxy:port' });
}

// Hàm retry khi bị block
export async function retryOnBlock<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 5000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      console.warn(
        `Retry ${i + 1}/${maxRetries} after error: ${(error as Error).message}`
      );
      await randomDelay(delayMs, delayMs + 2000); // Delay trước khi retry
    }
  }
  throw new Error('Max retries reached');
}
