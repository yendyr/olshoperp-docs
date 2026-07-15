---
doc_type: e2e-test-case
tc_code: TC-VIEW-product-mutation
menu: supplychain-product-mutation
menu_name: "Product Mutation History"
title: "Buka Product Mutation History — shell filter Product"
summary: "Load halaman; verifikasi Product* + Apply + manual calculation; tanpa Create; tabel belum muncul sebelum product dipilih."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-product-mutation/requirement.md"
automated: true
automated_spec: "tests/specs/product-mutation/product-mutation-view-filter.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - supplychain-product-ending-stock
  - supplychain-real-stock
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company: lumicharmsid (153)."
test_data: []
steps:
  - "Buka /supplychain/product-mutation."
  - "Verifikasi breadcrumb Product Mutation History."
  - "Verifikasi Multiselect Choose Product (wajib) + tombol Apply."
  - "Verifikasi tombol manual calculation of ending balance."
  - "Verifikasi tidak ada Create; datalist belum tampil tanpa product_id."
expected_result: |
  Shell laporan load; filter Product siap; read-only.
test_result:
  status: pass
  started_at: "2026-07-15T08:36:00Z"
  finished_at: "2026-07-15T08:36:12Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "PASS VIEW shell · Choose Product + Apply + manual calculation · no Create · company lumicharmsid"
  report_url: null
---

# TC-VIEW-product-mutation

## Fungsi menu

**Product Mutation History** — riwayat mutasi stok per SKU (IN/OT/AI/TF/…) + ending balance. Wajib pilih Product dulu.

## Catatan automation

- Spec: `@TC-VIEW-product-mutation`
- Helper: `tests/helpers/product-mutation.ts`
- AS-IS: `v-if="product_id"` — tabel hanya setelah pilih produk (watch auto Apply).
