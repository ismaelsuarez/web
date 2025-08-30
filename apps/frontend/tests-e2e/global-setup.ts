import { execSync } from 'node:child_process';

async function globalSetup() {
  // Ensure Prisma client is generated and DB is ready, then seed E2E data
  try {
    const dbUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/ecommerce_e2e';
    const commonEnv = { ...process.env, DATABASE_URL: dbUrl };
    execSync('pnpm --filter backend db:generate', { stdio: 'inherit', env: commonEnv });
    execSync('pnpm --filter backend db:push', { stdio: 'inherit', env: commonEnv });
    execSync('pnpm --filter backend db:seed:e2e', { stdio: 'inherit', env: commonEnv });
  } catch (err) {
    console.error('Error during global setup/seed', err);
    throw err;
  }
}

export default globalSetup;


