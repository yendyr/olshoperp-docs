---
doc_type: e2e-test-case
tc_code: TC-BSR-002
menu: supplychain-bundle-stock-report
menu_name: "Bundle Stock Report"
title: "Filter Choose Product mengirim product_id"
summary: "Memilih SKU di Multiselect Choose Product merefresh datalist dengan query product_id."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-bundle-stock-report/requirement.md"
automated: true
automated_spec: "tests/specs/bundle-stock-report/bundle-stock-report-view-filter.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "Akses Bundle Stock Report."
  - "Select2 products mengembalikan minimal 1 opsi (produk dengan BOM is_bom=0)."
test_data:
  - field: "Filter search"
    value: "a (ambil opsi pertama)"
steps:
  - "Buka Bundle Stock Report."
  - "Buka Multiselect Choose Product; ketik token pencarian."
  - "Pilih opsi pertama."
  - "Verifikasi GET datalist menyertakan product_id=; tabel reload."
expected_result: |
  Request filter sukses; product_id terkirim. Tabel dapat 0+ baris (AS-IS: filter = header yang detail memuat product_id).
test_result:
  status: pass
  started_at: "2026-07-15T03:20:40Z"
  finished_at: "2026-07-15T03:21:40Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "2/2 PASS · FILTER Choose Product → product_id reload OK · company lumicharmsid"
  report_url: null
---

# TC-BSR-002

## Catatan automation

- Spec: `@TC-BSR-002`
- Tippy: "Select SKU to view its bundle headers."
- Select2 AS-IS: produk yang `whereHas billOfMaterial is_bom=0` (umumnya header), bukan khusus komponen anak.
