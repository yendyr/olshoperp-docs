---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-019
menu: system-product
menu_name: "System Product"
title: "OFF lalu ON lagi Enable Variations — unsaved vs saved zero-relation"
summary: "Toggle bolak-balik sebelum/sesudah persist. Jangan duplicate child, jangan kehilangan Default group, jangan SKU dobel."
status: draft
owner: QA - Yemima
last_updated: 2026-08-17
requirement_ref: "qa-docs/system-product/requirement.md §6.3.1 auto ON + V-02 OFF"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - supplychain-variant
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Master Default ON. Cabang A: form create belum Save. Cabang B: sudah Save Default, zero relation/stok."
test_data:
  - field: "UI"
    value: "https://staging.olshoperp.com/supplychain/product"
steps:
  - "Cabang A: OFF (confirm) → ON lagi. Cek Default group + 1 opsi kembali; SKU field masih kode user. Save sekali. Datalist: 1 parent `-(PARENT)` + 1 child, bukan 2 parent."
  - "Cabang B: edit saved product. OFF confirm **tanpa** Save → ON lagi → Save. Cek child product_id sama atau regenerate."
  - "Cabang B-2 (opsional jika B persist OFF dulu): setelah jadi Single, ON Variations lagi + Save. Cek apakah kembali Default path atau user harus pilih group manual."
expected_result: |
  Cabang A: re-ON mengembalikan Default attach (auto ON §6.3.1) tanpa duplikasi SKU.
  Cabang B: re-ON sebelum persist tidak menghapus child; product_id child stabil.
  Cabang B-2: [MENUNGGU REQUIREMENT] V-02 tidak spec Single→Variant ulang setelah OFF tersimpan. Catat actual: auto Default vs kosong vs error. Jangan 500 / SKU bentrok `{sku}` vs `{sku}-(PARENT)`.

  [CATATAN QA] Hanya zero-relation. Jangan jalankan re-ON pada leftover/SO (itu TC-SYSPROD-016/TC-SYSPROD-015).
  Referensi: §6.3.1 auto Enable Variations ON; V-02 OFF.
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
jira_key: ETM-15569
last_execution:
  at: null
  jira: null
---

## Catatan QA

Double-toggle. Fail khas: dua kali generate child, atau ON setelah OFF memakai parent `-(PARENT)` sebagai base SKU (hasil `SKU-(PARENT)-(PARENT)`).
