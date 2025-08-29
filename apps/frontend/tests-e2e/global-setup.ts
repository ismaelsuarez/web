import type { FullConfig } from '@playwright/test';
import { execSync } from 'node:child_process';

async function globalSetup(_config: FullConfig) {
  // Ensure Prisma client is generated and DB is ready, then seed E2E data
  try {
    execSync('pnpm --filter backend db:generate', { stdio: 'inherit' });
    execSync('pnpm --filter backend db:push', { stdio: 'inherit' });
    execSync('pnpm --filter backend db:seed:e2e', { stdio: 'inherit' });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error during global setup/seed', err);
    throw err;
  }
}

export default globalSetup;


