---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-030
menu: system-product
menu_name: "System Product"
title: "Import Update Variant Product — expand zero-relation (path import, bukan edit UI)"
summary: "Tambah Variant Type/Option lewat Update Variant Product pada Default-origin tanpa relasi. Soft delete obsolete + SKU baru omit Default."
status: draft
owner: QA - Yemima
last_updated: 2026-08-17
requirement_ref: "qa-docs/system-product/requirement.md §6.3.2 zero-relation + §13 Update Variant Product"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - supplychain-variant
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Default-origin: parent `{sku}-(PARENT)`, child `{sku}`, **zero** haveRelations, **zero** stok (stok → `TC-SYSPROD-031`/`TC-SYSPROD-011`)."
  - "Import type **Update Variant Product**. Template static xlsx. Total group setelah expand ≤ 3 termasuk Default."
  - "Kolom Parent di file = SKU **parent** `-(PARENT)` (bukan child), sesuai pola import variant existing."
test_data:
  - field: "UI"
    value: "https://staging.olshoperp.com/supplychain/product"
  - field: "Import type"
    value: "Update Variant Product"
  - field: "Group baru"
    value: "Warna — biru, hijau (kode master variant, bukan nama Default)"
steps:
  - "Download template Update Variant Product. Isi row child baru: SKU baru, Variant Type, Option, Parent = `{sku}-(PARENT)`."
  - "Submit. Tunggu job. Cek import log + datalist child."
  - "Bandingkan dengan expand UI (`TC-SYSPROD-007`): child Default lama obsolete? ID baru? naming omit Default?"
expected_result: |
  Tidak hard-block `Cannot add variant, Product already have relations` (zero relation).
  TO-BE §6.3.2: child Default obsolete **soft-delete**; kombinasi baru = ID baru; SKU baru **omit** opsi Default.
  Tidak auto-rename. Tidak 500.

  [CATATAN QA] GAP-SP-18 + V-05 confirm popup ditulis untuk **edit UI**. Import tidak punya popup — [MENUNGGU REQUIREMENT] apakah leftover/soft-delete wajib sama di Update Variant Product. AS-IS import: child tanpa relasi + variant type beda “will update in job”; parent/child `haveRelations` memblok tambah type. Catat actual vs `TC-SYSPROD-007`.
  Referensi: requirement §6.3.2; §13 Update Variant Product; technical UpdateVariantProductImport.
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
jira_key: ETM-15580
last_execution:
  at: null
  jira: null
  status: not_run
  via: null
---

## Catatan QA

Expand lewat **import**, bukan form edit. Relasi/stok = `TC-SYSPROD-031`.
