---
doc_type: e2e-test-case
tc_code: TC-PENDSTK-001
menu: supplychain-product-ending-stock
menu_name: "Product Ending Stock"
title: "Buka Product Ending Stock — tab By Warehouse"
summary: "Load report Ending Stock; verify tab By Warehouse, kolom Availability/Unit, Manual Calculate + Log Data; tanpa Create."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-product-ending-stock/requirement.md"
automated: true
automated_spec: "tests/specs/product-ending-stock/product-ending-stock-view-filter.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - supplychain-real-stock
  - system-product
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company: lumicharmsid (153)."
  - "Akses view ItemStockProductEndingStock."
test_data: []
steps:
  - "Buka /supplychain/product-ending-stock."
  - "Verifikasi breadcrumb Product Ending Stock; tab By Warehouse aktif."
  - "Verifikasi tidak ada tombol Create."
  - "Verifikasi tombol Manual Calculate + Log Data."
  - "Verifikasi kolom: System Product SKU, Availability, Unit, Latest Calculation, Status."
  - "Verifikasi tabel punya baris data atau empty state valid."
expected_result: |
  Report load (GET product-ending-stock OK); shell read-only; kolom By Warehouse terlihat.
test_result:
  status: pass
  started_at: "2026-07-15T08:28:00Z"
  finished_at: "2026-07-15T08:28:14Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "PASS VIEW By Warehouse · Availability/Unit/Status · Manual Calculate+Log · company lumicharmsid"
  report_url: null
---

# TC-PENDSTK-001

## Fungsi menu

**Product Ending Stock** — laporan read-only stok ending (`scmag_ending_stocks`): Availability per warehouse + agregat By SKU. Recalc via Real Stock manual calculate.

## Catatan automation

- Spec: `@TC-PENDSTK-001`
- Helper: `tests/helpers/product-ending-stock.ts`
- Default tab: **By Warehouse** · API `GET supplychain/product-ending-stock`
