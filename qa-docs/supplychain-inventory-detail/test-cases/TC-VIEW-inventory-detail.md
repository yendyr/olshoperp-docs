---
doc_type: e2e-test-case
tc_code: TC-VIEW-inventory-detail
menu: supplychain-inventory-detail
menu_name: "Inventory Detail"
title: "Buka Inventory Detail + warehouse level + kolom stok"
summary: "Memastikan laporan load setelah auto-pilih warehouse level; KPI cards + kolom Availability tampil."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-inventory-detail/requirement.md"
automated: true
automated_spec: "tests/specs/inventory-detail/inventory-detail-view-filter.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - supplychain-real-stock
  - supplychain-warehouse-type
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company: lumicharmsid (153)."
  - "Minimal 1 warehouse level ON di master (Building preferred)."
test_data: []
steps:
  - "Buka /supplychain/inventory-detail."
  - "Tunggu select2-warehouse-level + datalist ?warehouse_space_type=."
  - "Verifikasi tidak ada Create; KPI cards Total Availability / Out of Stock / Warning / Transit."
  - "Verifikasi kolom System Product, Warehouse, Reserved TF, Availability, Primary Unit."
  - "Catat label warehouse level terpilih (default Building bila ada)."
expected_result: |
  Datalist HTTP 200; warehouse level terisi; shell read-only + kolom stok tampil.
test_result:
  status: pass
  started_at: "2026-07-15T03:37:00Z"
  finished_at: "2026-07-15T03:38:14Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "2/2 PASS inventory-detail-view-filter.spec.ts · VIEW OK · warehouse level auto · lumicharmsid"
  report_url: null
---

# TC-VIEW-inventory-detail

## Fungsi menu

Laporan **stok inventori per level gudang**: lihat Availability (on hand − reserved), reserved TF/Out,
transit, in/out rack per SKU × warehouse parent. Baca saja — tidak adjust stok.

## Catatan automation

- Spec: `@TC-VIEW-inventory-detail`
- Helper: `tests/helpers/inventory-detail.ts`
- Registry: `tests/pom-registry/inventory-detail.yaml`
