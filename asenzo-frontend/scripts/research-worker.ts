#!/usr/bin/env node

/**
 * ASENZO Standalone Native Research Worker Process
 *
 * Runs independently of Next.js HTTP requests.
 * Claims tasks atomically from Supabase PostgreSQL, processes them via native processor,
 * respects workspace boundaries, handles graceful shutdowns, heartbeats, and bounded retries.
 *
 * Usage:
 *   npx tsx scripts/research-worker.ts
 *   npm run worker:research
 *   npx tsx scripts/research-worker.ts --once
 *   npx tsx scripts/research-worker.ts --concurrency 3 --poll 1000
 */

import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());
import { ResearchWorker } from '../src/lib/automation/queue';

function parseArgs(): {
  once: boolean;
  concurrency: number;
  pollIntervalMs: number;
  workspaceId?: string;
  logFormat: 'json' | 'pretty';
} {
  const args = process.argv.slice(2);
  let once = process.env.RESEARCH_WORKER_ONCE === 'true';
  let concurrency = parseInt(process.env.RESEARCH_WORKER_CONCURRENCY || '2', 10);
  let pollIntervalMs = parseInt(process.env.RESEARCH_WORKER_POLL_MS || '2000', 10);
  let workspaceId = process.env.RESEARCH_WORKER_WORKSPACE_ID || undefined;
  let logFormat: 'json' | 'pretty' = process.env.RESEARCH_LOG_FORMAT === 'json' ? 'json' : 'pretty';

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--once') {
      once = true;
    } else if (arg === '--concurrency' && args[i + 1]) {
      concurrency = parseInt(args[++i], 10);
    } else if (arg === '--poll' && args[i + 1]) {
      pollIntervalMs = parseInt(args[++i], 10);
    } else if (arg === '--workspace' && args[i + 1]) {
      workspaceId = args[++i];
    } else if (arg === '--json') {
      logFormat = 'json';
    }
  }

  return { once, concurrency, pollIntervalMs, workspaceId, logFormat };
}

async function main() {
  const { once, concurrency, pollIntervalMs, workspaceId, logFormat } = parseArgs();

  console.log('================================================================');
  console.log('ASENZO DURABLE NATIVE RESEARCH WORKER');
  console.log('================================================================');
  console.log(`Process PID:      ${process.pid}`);
  console.log(`Node Version:     ${process.version}`);
  console.log(`Max Concurrency:  ${concurrency}`);
  console.log(`Poll Interval:    ${pollIntervalMs}ms`);
  console.log(`Workspace Scope:  ${workspaceId || 'Global (all workspaces)'}`);
  console.log(`Execution Mode:   ${once ? 'Run Once & Drain' : 'Continuous Daemon'}`);
  console.log(`Log Format:       ${logFormat}`);
  console.log('================================================================\n');

  const worker = new ResearchWorker({
    maxConcurrency: concurrency,
    pollIntervalMs,
    workspaceId,
    once,
    logFormat
  });

  let shutdownPromise: Promise<void> | null = null;
  const handleShutdown = (signal: string) => {
    if (shutdownPromise) return;
    console.log(`\n[Research Worker] Received ${signal}. Requesting graceful shutdown...`);
    shutdownPromise = worker.stop(signal).then(() => {
      console.log('[Research Worker] Graceful shutdown complete. Exiting.');
      process.exit(0);
    }).catch(err => {
      console.error('[Research Worker] Error during shutdown:', err);
      process.exit(1);
    });
  };

  process.on('SIGINT', () => handleShutdown('SIGINT'));
  process.on('SIGTERM', () => handleShutdown('SIGTERM'));

  try {
    await worker.start();
    if (once) {
      console.log('[Research Worker] Run-once execution completed successfully.');
      process.exit(0);
    }
  } catch (err: unknown) {
    console.error('[Research Worker] Fatal unhandled error:', err);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('[Research Worker] Fatal startup error:', err);
  process.exit(1);
});
