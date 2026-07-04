import { test, expect } from '@playwright/test';
import { getEnvConfig } from './helpers/env-config';
import {
  ensureDefaultCompany,
  login,
  switchCompanyById,
} from './helpers/company-access';
import {
  buildCrawlReport,
  collectSidebarPaths,
  crawlSidebarPaths,
  summarizeCrawlFailures,
  writeCrawlReport,
} from './helpers/sidebar-crawler';

/**
 * Sidebar crawl — visit every navigable URL from sidebar menu tree.
 *
 * Per environment:
 * - staging → default company FAT (112)
 * - tyas    → default company TANRISE (3)
 * - merdian → default company WNA (4)
 *
 * Related docs:
 * - qa-docs/sidebar-menu/technical.md
 * - qa-docs/sidebar-menu/test-cases/TC-SMENU-001..003.md
 */

test.describe('Sidebar crawl — default company', () => {
  test.setTimeout(1_800_000);

  test('crawl semua URL sidebar tanpa error fatal', async ({ page }, testInfo) => {
    const env = getEnvConfig(testInfo.project.name);

    await login(page, env);
    const company = await ensureDefaultCompany(page, env);

    const paths = await collectSidebarPaths(page, env);
    const results = await crawlSidebarPaths(page, paths, env, (current, total, path) => {
      console.log(`[crawl:${env.name}] ${current}/${total} ${path}`);
    });

    const report = buildCrawlReport(env, company, results);
    const reportPath = writeCrawlReport(report);

    testInfo.annotations.push({
      type: 'crawl-report',
      description: reportPath,
    });

    const failureSummary = summarizeCrawlFailures(results);
    expect(
      results.filter((item) => item.status === 'failed'),
      `Crawl failures on ${env.name} (${company.code}):\n${failureSummary}\nReport: ${reportPath}`,
    ).toHaveLength(0);
  });
});

test.describe('Sidebar crawl — semua allowed company', () => {
  test.setTimeout(1_800_000);

  test('crawl sidebar untuk setiap allowed company', async ({ page }, testInfo) => {
    const env = getEnvConfig(testInfo.project.name);

    if (env.allowedCompanies.length <= 1) {
      test.skip(true, `${env.name} hanya punya satu company — sudah tercakup di default crawl`);
    }

    for (const company of env.allowedCompanies) {
      await login(page, env);
      await switchCompanyById(page, company.id, company.label, env);

      const paths = await collectSidebarPaths(page, env);
      const results = await crawlSidebarPaths(page, paths, env, (current, total, path) => {
        console.log(`[crawl:${env.name}:${company.code}] ${current}/${total} ${path}`);
      });

      const report = buildCrawlReport(env, company, results);
      const reportPath = writeCrawlReport(report);

      testInfo.annotations.push({
        type: 'crawl-report',
        description: `${company.code}: ${reportPath}`,
      });

      const failureSummary = summarizeCrawlFailures(results);
      expect(
        results.filter((item) => item.status === 'failed'),
        `Crawl failures on ${env.name} (${company.code}):\n${failureSummary}\nReport: ${reportPath}`,
      ).toHaveLength(0);
    }
  });
});
