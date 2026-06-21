import { test, expect } from '@playwright/test';
import { spawn } from 'child_process';

// Helper to start Vite dev server and wait for ready signal
async function startVite() {
  const server = spawn('npx', ['vite', '--port', '5174'], {
    cwd: process.cwd(), // use directory of current file
    stdio: ['ignore', 'pipe', 'pipe']
  });
const ready = new Promise<string>((resolve)=> {
    setTimeout(()=>resolve('http://localhost:5174'),8000);
  });
  server.stderr?.on('data', data => {
    // capture error logs
    console.error(data.toString());
  });
  try {
    const url = await ready;
    return { server, url };
  } catch (e) {
    server.kill();
    throw e;
  }
}

test('Game loads in browser', async ({ page }) => {
  const { server, url } = await startVite();
  await page.goto(url);
  await expect(page.locator('body')).toBeVisible();
  // Capture screenshot after page loads
  const screenshotPath = `screenshots/load-${Date.now()}.png`;
  await page.screenshot({ path: screenshotPath });
  server.kill();
});
