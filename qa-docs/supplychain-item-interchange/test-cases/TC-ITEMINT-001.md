---
doc_type: e2e-test-case
tc_code: TC-ITEMINT-001
menu: supplychain-item-interchange
menu_name: "Product Interchange"
title: "membuat data master product interchange baru untuk hubungan substitusi produk"
summary: "menguji proses pendaftaran hubungan substitusi antara dua produk dengan Show for all company active."
status: draft
owner: QA - Cursor
last_updated: 2026-07-14
requirement_ref: "qa-docs/supplychain-item-interchange/requirement.md"
automated: true
automated_spec: "tests/specs/item-interchange/item-interchange-create-update.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company aktif: Lumi Charms.id (lumicharmsid, id: 153)."
  - "SKU first/second tersedia di company (dropdown product-for-transaction)."
test_data:
  - field: "First Product"
    value: "CHARM-BEAR-BEADS-Pink"
  - field: "Second Product"
    value: "TTK-CHROME-POWDER-black"
  - field: "Show for all company"
    value: "active"
steps:
  - "Klik Create di halaman datalist Product Interchange."
  - "Pilih First Product CHARM-BEAR-BEADS-Pink."
  - "Pilih Second Product TTK-CHROME-POWDER-black."
  - "Aktifkan toggle Show for all company."
  - "Klik Save & Next."
  - "Verifikasi pasangan tampil di datalist."
expected_result: |
  Data master product interchange berhasil tergenerate dan muncul di datalist.
test_result:
  status: passed
  started_at: null
  finished_at: null
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: |
    PASS (~18s) — create di lumicharmsid.
    Note: TC asli 1ant-a101/102 diganti SKU yang ada di lumicharmsid.
    DataTables search match-from-start — assert pakai clear filter + scan row.
  report_url: null
test_data_used:
  - field: "First / Second"
    value: "CHARM-BEAR-BEADS-Pink / TTK-CHROME-POWDER-black"
  - field: "Company"
    value: "lumicharmsid (153)"
run_history:
  - at: "2026-07-14"
    status: passed
    note: "Playwright @TC-ITEMINT-001 — 2/2 serial PASS (~1.1m)"
---

# TC-ITEMINT-001

## Catatan automation

- Spec: `tests/specs/item-interchange/item-interchange-create-update.spec.ts`
- Helper: `tests/helpers/item-interchange.ts`
- Registry: `tests/pom-registry/item-interchange.yaml`
- SKU TC asli (`1ant-a101`…) tidak ada di lumicharmsid → diganti CHARM/TTK.
