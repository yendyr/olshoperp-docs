---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-021
menu: system-product
menu_name: "System Product"
title: "OFF Enable Variations — child hanya SO / assembly / transfer internal"
summary: "technical.md: checkTransaction tidak cek SO, assembly, TI. leftover §6.3.2 tetap mengunci SO+transfer. Celah lock SKU vs haveRelations."
status: draft
owner: QA - Yemima
last_updated: 2026-08-17
requirement_ref: "qa-docs/system-product/requirement.md §6.3.2 SO/transfer + technical.md §12 checkTransaction"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - supplychain-variant
  - omni-sales-order-report
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Siapkan **3 produk Default** terpisah, masing-masing child hanya punya **satu** jenis relasi: (1) SO saja; (2) assembly saja; (3) transfer internal saja. Tidak ada PR/PO/inbound/outbound/BOM."
  - "Catat nomor dokumen + SKU line = child."
test_data:
  - field: "UI"
    value: "https://staging.olshoperp.com/supplychain/product"
  - field: "technical.md §12 Not checked"
    value: "SO, assembly, transfer internal"
steps:
  - "Untuk tiap cabang: buka edit parent. Cek `can_update_sku` / toggle Enable Variations (disabled atau tidak)."
  - "Coba OFF → Confirm → Save. Catat error vs sukses vs 500."
  - "Buka ulang SO / assembly / TI. Line masih child yang sama? Qty/SKU name residual?"
expected_result: |
  Dokumen SO / assembly / TI **tidak pecah**: line tetap product_id/SKU child.
  Diterima: OFF ditolak (haveRelations) meski `checkTransaction` tidak mengunci SKU.
  Fail: OFF lolos karena SO/assembly/TI tidak masuk `checkTransaction`, child terhapus, dokumen orphan.

  [CATATAN QA] Dua gerbang berbeda di docs: leftover `haveRelations` **termasuk** SO + transfer; `checkTransaction` **tidak** cek SO/assembly/TI (hanya PR, PO, BoM, inbound, outbound). OFF Variations tidak boleh mengandalkan gerbang yang lebih sempit.
  Known residual rename `detail_sku_name` (§6.3.2) bukan fail OFF ini — yang diukur: product_id line masih hidup.
  Referensi: requirement §6.3.2; technical.md §12 Transaction Immutability.
test_result:
  status: not_run
  started_at: null
  finished_at: null
  executed_by: null
  environment: staging
  log_summary: null
  report_url: null
test_data_used: []
run_history: []
origin_jira: ETM-15495
jira_key: ETM-15571
last_execution:
  at: null
  jira: null
---

## Catatan QA

Celah lock. Jangan gabung dengan PR/PO (itu TC-SYSPROD-015, gerbang `checkTransaction` ikut).
