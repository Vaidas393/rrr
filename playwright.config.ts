import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://127.0.0.1:8000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: false, // Always run in headed mode
    viewport: { width: 1280, height: 720 }, // Set proper desktop viewport
    actionTimeout: 10000, // 10 seconds timeout for actions
    navigationTimeout: 30000, // 30 seconds for navigation
  },

  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        launchOptions: {
          slowMo: 1000, // Add 1 second delay between actions
        },
      },
    },
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        launchOptions: {
          slowMo: 1000, // Add 1 second delay between actions
        },
      },
    },
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        launchOptions: {
          slowMo: 1000, // Add 1 second delay between actions
        },
      },
    },
  ],
});
