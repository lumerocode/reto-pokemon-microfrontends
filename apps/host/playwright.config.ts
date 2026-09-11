import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'pnpm --filter mfe-detail preview',
      url: 'http://localhost:3001/assets/remoteEntry.js',
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'pnpm --filter mfe-history preview',
      url: 'http://localhost:3002/assets/remoteEntry.js',
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'pnpm --filter host preview',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
    },
  ],
});