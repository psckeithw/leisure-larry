import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './tests',
  timeout: 60000,
  expect: {
    timeout: 5000
  },
  fullyParallel: true,
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
      headless: false,
      },
    },
  ],
};

export default config;
