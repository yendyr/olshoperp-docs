---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-031
menu: system-product
menu_name: "System Product"
test_type: edge
title: "Import Update Variant Product — child berelasi/stok: leftover vs hard-block"
summary: "Inti ETM-15495 lewat import: tambah variant type pada SKU yang sudah stok/relasi. Stock ID leftover tidak berubah; tidak auto-rename."
status: draft
owner: QA - Yemima
last_updated: 2026-08-17
requirement_ref: "qa-docs/system-product/requirement.md §6.3.2 leftover V-04 V-05 + §13 Update Variant Product"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - supplychain-variant
  - accounting-stock-remapping
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Default-origin child punya **stok** dan/atau haveRelations (SO/PR/PO/inbound/outbound/transfer/WO/binding/BOM/bundle). Catat Stock ID + qty + product_id leftover."
  - "Import **Update Variant Product**. Parent col = `{sku}-(PARENT)`. Tambah group baru (total ≤ 3 termasuk Default). Contoh Warna+Motif seperti kartu."
test_data:
  - field: "UI"
    value: "https://staging.olshoperp.com/supplychain/product"
  - field: "Import type"
    value: "Update Variant Product"
  - field: "Contoh leftover (requirement)"
    value: "SKUPENSIL leftover; SKUPENSIL-biru-doraemon dst new"
steps:
  - "Catat Stock ID/qty child `{sku}`."
  - "Import Update Variant Product dengan type **baru** (tidak match existing Default-only). Submit."
  - "Baca import log. Jika sukses: cek leftover Active, SKU baru, stok leftover."
expected_result: |
  TO-BE §6.3.2 / AC kartu: **tidak** hard-block; leftover `{sku}` tetap Active under same parent; kombinasi baru = ID baru; omit Default segment; Stock ID leftover **tidak ganti**; qty **tidak berubah**; tidak auto-rename; tidak auto stock remap.
  AS-IS UpdateVariantProductImport: parent/child `haveRelations` → log `already has relations` / `Cannot add variant options because variant types don't match` — itu **FAIL TO-BE** (sama semangat hard-block UI yang dicabut GAP-SP-18).

  [CATATAN QA] Kartu environment menyebut Import **New**; user minta path **update via import**. Confirm popup V-05 tidak ada di import — leftover tetap harus benar atau ditolak jelas tanpa menghapus child/stok.
  Referensi: requirement §6.3.2; ETM-15495 Additional Context stok; technical UpdateVariantProductImport relation checks.
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
jira_key: ETM-15581
last_execution:
  at: null
  jira: null
  status: not_run
  via: null
---

## Catatan QA

Mirror `TC-SYSPROD-008` (UI expand) untuk **Update Variant Product**. Jangan treat `TC-SYSPROD-008` PASS sebagai cover import.
