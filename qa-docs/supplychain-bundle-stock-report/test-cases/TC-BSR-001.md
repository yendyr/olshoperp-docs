---
doc_type: e2e-test-case
tc_code: TC-BSR-001
menu: supplychain-bundle-stock-report
menu_name: "Bundle Stock Report"
title: "Buka Bundle Stock Report + verifikasi kolom read-only"
summary: "Memastikan laporan Product Bundle load; kolom Availability/Unit/Update At tampil; tanpa Create/warehouse."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-bundle-stock-report/requirement.md"
automated: true
automated_spec: "tests/specs/bundle-stock-report/bundle-stock-report-view-filter.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - system-product
  - supplychain-stock-monitoring
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company: lumicharmsid (153)."
  - "Akses view BundleStockReport."
  - "Minimal 1 Product Bundle (BOM header is_bom=0) di company."
test_data: []
steps:
  - "Buka /supplychain/bundle-stock-report."
  - "Verifikasi breadcrumb Bundle Stock Report."
  - "Verifikasi tidak ada tombol Create; Warehouse selector tidak tampil."
  - "Verifikasi kolom: System Product SKU, Availability, Unit, Update At; ATS Qty hidden."
  - "Verifikasi minimal 1 baris bundle + link SKU ke product edit + nilai Availability."
expected_result: |
  Laporan load (HTTP 200); shell read-only; kolom Availability terlihat; ada data bundle.
test_result:
  status: pass
  started_at: "2026-07-15T03:20:40Z"
  finished_at: "2026-07-15T03:21:40Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "2/2 PASS bundle-stock-report-view-filter.spec.ts (~60s) · VIEW ~16.4s · company lumicharmsid · 24 bundle headers"
  report_url: null
---

# TC-BSR-001

## Fungsi menu (dari requirement + AS-IS)

Menampilkan **berapa unit header Product Bundle** yang bisa disiapkan dari stok komponen
(Availability = lowest denominator BOM). Bukan transaksi; tidak create/edit.

## Catatan automation

- Spec: `@TC-BSR-001`
- Helper: `tests/helpers/bundle-stock-report.ts`
- Registry: `tests/pom-registry/bundle-stock-report.yaml`
