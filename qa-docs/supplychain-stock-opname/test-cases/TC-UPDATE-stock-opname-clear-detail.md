---
doc_type: e2e-test-case
tc_code: TC-UPDATE-stock-opname-clear-detail
menu: supplychain-stock-opname
menu_name: "Stock Opname"
title: "Clear Opname Detail (delete all products)"
summary: "Edit SP-6A56E465, hapus semua baris product di Opname Detail hingga kosong."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-stock-opname/requirement.md"
automated: true
automated_spec: "tests/specs/stock-opname/stock-opname-clear-detail.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company aktif: Lumi Charms.id (lumicharmsid, id: 153)."
  - "Dokumen SP-6A56E465 editable."
test_data:
  - field: "Transaction Code"
    value: "SP-6A56E465"
steps:
  - "Buka Stock Opname → search SP-6A56E465 → edit."
  - "Di Opname Detail, hapus semua baris product (ikon trash per baris)."
  - "Konfirmasi Delete jika modal muncul."
  - "Verifikasi tabel Opname Detail kosong."
expected_result: |
  Opname Detail tidak memiliki baris product.
test_result:
  status: passed
  started_at: null
  finished_at: null
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: |
    PASS (~40s) — SP-6A56E465 Opname Detail dikosongkan (product LUMI00001 dihapus).
  report_url: null
run_history:
  - at: "2026-07-15"
    status: passed
    note: "Playwright @TC-UPDATE-stock-opname-clear-detail — clear detail SP-6A56E465"
---

# TC-UPDATE-stock-opname-clear-detail

## Step to reproduce (manual)

1. Login staging → company **Lumi Charms.id**.
2. Menu Stock Opname → search **SP-6A56E465** → edit.
3. Section **Opname Detail** → klik ikon **Delete** (trash) pada setiap baris product.
4. Konfirmasi **Delete** jika diminta.
5. Grid Opname Detail harus kosong.

## Catatan automation

- Spec tag: `@TC-UPDATE-stock-opname-clear-detail`
- Helper: `clearAllOpnameDetailRows()` — hindari mass-delete-SKU (all documents)
