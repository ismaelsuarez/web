import { execSync } from 'node:child_process';
import waitOn from 'wait-on';

async function globalSetup() {
  // Ensure Prisma client is generated and DB is ready, then seed E2E data
  try {
    const dbUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/ecommerce_e2e';
    const commonEnv = { ...process.env, DATABASE_URL: dbUrl };
    execSync('pnpm --filter backend db:generate', { stdio: 'inherit', env: commonEnv });
    execSync('pnpm --filter backend db:push', { stdio: 'inherit', env: commonEnv });
    execSync('pnpm --filter backend db:seed:e2e', { stdio: 'inherit', env: commonEnv });

    // Wait for backend readiness (Playwright webServer will start backend; here we wait on its /api/products)
    const backendUrl = process.env.BACKEND_WAIT_URL || 'http://localhost:3001/api/products';
    await waitOn({ resources: [backendUrl], timeout: 30000, interval: 500, validateStatus: (status) => status === 200 });

    // Optionally verify there is at least one product
    // We avoid bringing extra deps; rely on curl if present
    try {
      execSync(`curl -s ${backendUrl} | jq -e '.products | length > 0'`, { stdio: 'inherit' });
    } catch {
      // Fallback check without jq
      const out = execSync(`curl -s ${backendUrl}`).toString();
      if (!/"products"\s*:\s*\[/.test(out)) {
        throw new Error('Seed check failed: /api/products body not recognized');
      }
    }
  } catch (err) {
    console.error('Error during global setup/seed', err);
    throw err;
  }
}

export default globalSetup;


