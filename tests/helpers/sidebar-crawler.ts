import fs from 'node:fs';
import path from 'node:path';
import { Page, expect } from '@playwright/test';
import { EnvConfig } from './env-config';
import { dismissStagingBanner, getApiUrl, readAuthFromPage } from './company-access';

export interface SidebarMenuNode {
  title?: string;
  pageName?: string;
  path?: string;
  subMenu?: SidebarMenuNode[];
}

export interface CrawlResult {
  path: string;
  status: 'passed' | 'failed' | 'skipped';
  finalUrl: string;
  durationMs: number;
  error?: string;
}

export interface CrawlReport {
  env: string;
  baseURL: string;
  companyId: number;
  companyCode: string;
  crawledAt: string;
  totalPaths: number;
  passed: number;
  failed: number;
  skipped: number;
  results: CrawlResult[];
}

const SKIP_PATH_PREFIXES = ['/login', '/logout', '/register', '/forgot-password'];
const SKIP_PATH_EXACT = new Set(['/', '#', '']);

function normalizePath(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed || trimmed === '#' || trimmed.startsWith('http')) {
    return null;
  }

  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  const withoutQuery = withLeadingSlash.split('?')[0].split('#')[0];

  if (SKIP_PATH_EXACT.has(withoutQuery) || withoutQuery.includes('*')) {
    return null;
  }

  for (const prefix of SKIP_PATH_PREFIXES) {
    if (withoutQuery.startsWith(prefix)) {
      return null;
    }
  }

  return withoutQuery;
}

function extractPathsFromNodes(nodes: SidebarMenuNode[]): string[] {
  const paths = new Set<string>();

  const walk = (items: SidebarMenuNode[]): void => {
    for (const item of items) {
      const normalized = item.path ? normalizePath(item.path) : null;
      if (normalized) {
        paths.add(normalized);
      }

      if (item.subMenu?.length) {
        walk(item.subMenu);
      }
    }
  };

  walk(nodes);
  return [...paths].sort();
}

function parseSidebarStorage(raw: string): SidebarMenuNode[] {
  const parsed = JSON.parse(raw) as unknown;

  if (Array.isArray(parsed)) {
    const withoutFooter = parsed.filter(
      (item) =>
        item &&
        typeof item === 'object' &&
        !('transaction_limit' in (item as Record<string, unknown>)),
    );
    return withoutFooter as SidebarMenuNode[];
  }

  if (parsed && typeof parsed === 'object') {
    const record = parsed as Record<string, unknown>;
    if (Array.isArray(record.menus)) {
      return record.menus as SidebarMenuNode[];
    }
    if (
      record.data &&
      typeof record.data === 'object' &&
      Array.isArray((record.data as Record<string, unknown>).menus)
    ) {
      return (record.data as { menus: SidebarMenuNode[] }).menus;
    }
  }

  return [];
}

export async function readSidebarFromLocalStorage(
  page: Page,
): Promise<SidebarMenuNode[]> {
  const raw = await page.evaluate(() => localStorage.getItem('sidebar'));
  if (!raw) {
    return [];
  }

  return parseSidebarStorage(raw);
}

export async function fetchSidebarFromApi(
  page: Page,
  env: EnvConfig,
): Promise<SidebarMenuNode[]> {
  const auth = await readAuthFromPage(page);
  if (!auth.token) {
    return [];
  }

  const apiURL = getApiUrl(env);
  const response = await page.request.get(`${apiURL}/sidebar-menu`, {
    headers: {
      Authorization: `Bearer ${auth.token}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok()) {
    throw new Error(
      `GET /sidebar-menu failed with HTTP ${response.status()} on ${env.name}`,
    );
  }

  const body = (await response.json()) as {
    status?: { error?: number; message?: string };
    data?: unknown;
  };

  if (body.status?.error) {
    throw new Error(
      `GET /sidebar-menu API error: ${body.status.message ?? 'unknown'}`,
    );
  }

  if (!body.data) {
    return [];
  }

  return parseSidebarStorage(JSON.stringify(body.data));
}

export async function collectSidebarPaths(
  page: Page,
  env: EnvConfig,
): Promise<string[]> {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await dismissStagingBanner(page);
  await expect(page.locator('.topbar')).toBeVisible();

  let nodes = await readSidebarFromLocalStorage(page);
  if (nodes.length === 0) {
    nodes = await fetchSidebarFromApi(page, env);
  }

  const paths = extractPathsFromNodes(nodes);
  expect(
    paths.length,
    `sidebar should expose at least one navigable path on ${env.name}`,
  ).toBeGreaterThan(0);

  return paths;
}

async function assertPageHealthy(page: Page, targetPath: string): Promise<void> {
  await expect(page).not.toHaveURL(/\/login(?:\/|$)/, { timeout: 5_000 });
  await expect(page.locator('.topbar')).toBeVisible({ timeout: 30_000 });

  const bodyText = await page.locator('body').innerText();
  expect(bodyText.trim().length, `${targetPath}: page body should not be empty`).toBeGreaterThan(
    0,
  );

  const fatalPatterns = [
    /404\s*not\s*found/i,
    /page\s*not\s*found/i,
    /something\s*went\s*wrong/i,
  ];

  for (const pattern of fatalPatterns) {
    expect(bodyText, `${targetPath}: fatal error pattern ${pattern}`).not.toMatch(
      pattern,
    );
  }
}

export async function crawlSidebarPaths(
  page: Page,
  paths: string[],
  env: EnvConfig,
  onProgress?: (current: number, total: number, path: string) => void,
): Promise<CrawlResult[]> {
  const results: CrawlResult[] = [];

  for (let index = 0; index < paths.length; index++) {
    const targetPath = paths[index];
    onProgress?.(index + 1, paths.length, targetPath);
    const startedAt = Date.now();

    try {
      await page.goto(targetPath, { waitUntil: 'domcontentloaded' });
      await dismissStagingBanner(page);
      await assertPageHealthy(page, targetPath);

      results.push({
        path: targetPath,
        status: 'passed',
        finalUrl: page.url(),
        durationMs: Date.now() - startedAt,
      });
    } catch (error) {
      results.push({
        path: targetPath,
        status: 'failed',
        finalUrl: page.url(),
        durationMs: Date.now() - startedAt,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return results;
}

export function buildCrawlReport(
  env: EnvConfig,
  company: { id: number; code: string },
  results: CrawlResult[],
): CrawlReport {
  const passed = results.filter((item) => item.status === 'passed').length;
  const failed = results.filter((item) => item.status === 'failed').length;
  const skipped = results.filter((item) => item.status === 'skipped').length;

  return {
    env: env.name,
    baseURL: env.baseURL,
    companyId: company.id,
    companyCode: company.code,
    crawledAt: new Date().toISOString(),
    totalPaths: results.length,
    passed,
    failed,
    skipped,
    results,
  };
}

export function writeCrawlReport(report: CrawlReport): string {
  const outputDir = path.join(process.cwd(), 'test-results', 'crawl-reports');
  fs.mkdirSync(outputDir, { recursive: true });

  const filename = `crawl-${report.env}-${report.companyCode}-${Date.now()}.json`;
  const outputPath = path.join(outputDir, filename);
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2), 'utf8');

  return outputPath;
}

export function summarizeCrawlFailures(results: CrawlResult[]): string {
  const failed = results.filter((item) => item.status === 'failed');
  if (failed.length === 0) {
    return '';
  }

  return failed
    .map((item) => `- ${item.path}: ${item.error ?? 'unknown error'}`)
    .join('\n');
}
