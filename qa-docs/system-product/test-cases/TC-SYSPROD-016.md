---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-016
menu: system-product
menu_name: "System Product"
title: "OFF Enable Variations — setelah leftover expand (banyak child Active)"
summary: "Worst case: leftover + kombinasi baru sudah hidup. OFF tidak boleh collapse mass-delete semua child jadi satu Single."
status: draft
owner: QA - Yemima
last_updated: 2026-08-17
requirement_ref: "qa-docs/system-product/requirement.md §6.3.1 V-02 + §6.3.2 leftover"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - supplychain-variant
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Sudah lewat expand leftover (DRAFT TC-SYSPROD-008 atau setara): leftover `{sku}` Active + child baru ` {sku}-biru-doraemon` dst. Minimal leftover punya relasi."
  - "Catat daftar product_id + SKU semua child Active sebelum OFF."
test_data:
  - field: "UI"
    value: "https://staging.olshoperp.com/supplychain/product"
  - field: "Contoh leftover (requirement)"
    value: "SKUPENSIL leftover; SKUPENSIL-biru-doraemon dst new"
steps:
  - "Edit parent. Hitung jumlah child Active. Pastikan leftover + new masih ada."
  - "OFF Enable Variations. Amati popup / error / apakah Save All men-delete semua child."
  - "Cancel vs Confirm+Save. Bandingkan daftar child + dokumen yang memakai leftover."
expected_result: |
  OFF **tidak** menghapus leftover maupun kombinasi baru yang sudah digenerate.
  Diterima: toggle ditolak / BE error jelas / struktur Variant tidak berubah.
  Fail/broken: semua child `Product::delete()`, parent jadi Single, SO/PR leftover 404, stok leftover hilang.

  [CATATAN QA] §6.3.2 leftover = child lama **tetap Active under same parent**. Collapse ke Single bertentangan dengan leftover (banyak SKU transactable). V-02 tidak cover cabang ini — catat actual vs expected sibling leftover.
  Referensi: requirement §6.3.2 contoh SKUPENSIL.
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
jira_key: ETM-15566
last_execution:
  at: null
  jira: null
---

## Catatan QA

Jalankan **setelah** leftover expand sukses. Jangan pakai produk Default 1-child tanpa expand.
