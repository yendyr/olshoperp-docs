---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-018
menu: system-product
menu_name: "System Product"
title: "OFF Enable Variations — confirm di UI tapi tidak persist / navigasi pergi"
summary: "Confirm popup tidak sama dengan commit. Reload/back tanpa Save harus tetap Variant; jangan half-state parent tanpa child."
status: draft
owner: QA - Yemima
last_updated: 2026-08-17
requirement_ref: "qa-docs/system-product/requirement.md §6.3.1 V-02"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - supplychain-variant
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Dua produk Default: (1) form create **belum Save**; (2) **sudah Save** zero relation."
test_data:
  - field: "UI"
    value: "https://staging.olshoperp.com/supplychain/product"
steps:
  - "Produk (1): OFF → Confirm di popup. Jangan Save. Tutup tab / Back to list. Pastikan tidak ada SKU tersimpan."
  - "Produk (2): edit, OFF → Confirm. Jika FE auto-submit specification, catat. Jika tidak: jangan Save, reload halaman edit."
  - "Bandingkan DB/datalist: tipe, parent/child, SKU."
expected_result: |
  Produk (1): tidak ada row baru.
  Produk (2): jika belum ada request persist, reload = masih Variant Default (parent+child utuh).
  Tidak boleh half-state: parent `-(PARENT)` tanpa child, atau child hidup tanpa parent.

  [CATATAN QA] V-02 = confirm sebelum jadi Single; tidak bilang confirm = auto-save. AS-IS FE: watcher OFF hanya `enable_variant=false`; `disabledVariation()` (POST specification `is_delete`) dipanggil dari path modal Delete — bedakan toggle vs Delete variant type. Catat actual path yang terpanggil.
  Referensi: technical.md FE confirm OFF→Single; FormProductComponent `switch_variant` vs `submitVariantForm(true)`.
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
jira_key: ETM-15568
last_execution:
  at: null
  jira: null
  status: not_run
  via: null
---

## Catatan QA

Celah: confirm UI tanpa persist, atau sebaliknya auto-delete child tanpa user Save All.
