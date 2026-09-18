import {defineConfig} from '@playwright/test';
export default defineConfig({
  testDir:'tests/e2e',testMatch:'**/*.spec.ts',workers:1,
  use:{baseURL:'http://127.0.0.1:4187',viewport:{width:1440,height:900},trace:'retain-on-failure',channel:process.env.PLAYWRIGHT_CHANNEL},
  webServer:{command:'node --import tsx scripts/e2e-server.ts',url:'http://127.0.0.1:4187/api/v1/health',reuseExistingServer:false,timeout:60000},
});
