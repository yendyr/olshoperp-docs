---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-032
menu: system-product
menu_name: "System Product"
test_type: edge
title: "Import Update Product lalu Update Variant — pipeline create-by-import + update-by-import"
summary: "SKU lahir dari Import New Default, lalu diubah field (Update Product), lalu expand (Update Variant). Identitas dan leftover tidak pecah di tengah jalan."
status: draft
owner: QA - Yemima
last_updated: 2026-08-17
requirement_ref: "qa-docs/system-product/requirement.md §6.3.1 Import create + §6.3.2 + §13 kedua tipe update"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - supplychain-variant
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Master Default ON. SKU belum ada. Siapkan 3 file: New Product (eligible); Update Product (name/price child); Update Variant Product (group baru, zero relation dulu)."
test_data:
  - field: "UI"
    value: "https://staging.olshoperp.com/supplychain/product"
steps:
  - "Import New (`TC-SYSPROD-006` happy). Verifikasi parent/child Default."
  - "Import Update Product child (`TC-SYSPROD-027`). Verifikasi tree utuh."
  - "Import Update Variant Product expand zero-relation (`TC-SYSPROD-030`). Verifikasi naming omit Default, tidak duplikasi parent."
  - "Opsional cabang berelasi: isi SO/stok di leftover lalu ulang expand (`TC-SYSPROD-031`) — jangan skip catat Stock ID."
expected_result: |
  Setelah 3 import: tetap satu parent `{sku}-(PARENT)`; tidak ada SKU ghost; child transactable konsisten; tidak `-(PARENT)-(PARENT)`.
  Expand mengikuti §6.3.2 (zero-relation soft-delete vs leftover bila sudah relasi).

  [CATATAN QA] End-to-end **hanya import** (tanpa Save form). Gagal di tengah = stop, jangan lanjut file berikutnya. TC-SYSPROD-020 (OFF UI setelah import) **bukan** langkah pipeline ini.
  Referensi: §6.3.1 + §6.3.2 + §13 New / Update / Update Variant.
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
jira_key: ETM-15582
first_execution:
  at: null
  via: null
  jira: null
last_execution:
  at: null
  jira: null
  status: not_run
  via: null
---

## Catatan QA

Pipeline import. Jalankan setelah `TC-SYSPROD-006`/`TC-SYSPROD-027`/`TC-SYSPROD-030` individual sudah jelas actual-nya.
