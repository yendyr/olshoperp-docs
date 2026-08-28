---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-011
menu: system-product
menu_name: "System Product"
test_type: edge
title: "Error/gap — child punya stok tapi zero haveRelations: leftover vs soft-delete"
summary: "SKU sudah ada item stock, belum PR/SO/dll. Expand group: stok tidak boleh hilang/pindah diam-diam."
status: draft
owner: QA - Yemima
last_updated: 2026-08-17
requirement_ref: "qa-docs/system-product/requirement.md §6.3.2 (stok bukan syarat tunggal); request ETM-15495 Stock ID tidak berubah"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - accounting-stock-remapping
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Child Default punya **item stock qty > 0** dan **tidak** punya relasi PR/PO/inbound/outbound/transfer/SO/WO/binding/BOM/bundle."
  - "Catat Stock ID + qty sebelum expand."
test_data:
  - field: "UI"
    value: "https://staging.olshoperp.com/supplychain/product"
steps:
  - "Edit parent. Catat Stock ID + qty child."
  - "Tambah Variant Group + opsi. Save (dan confirm jika popup muncul)."
  - "Cek: child lama masih ada atau soft-deleted; Stock ID/qty; SKU baru."
expected_result: |
  Request [ETM-15495](https://erpintegration.atlassian.net/browse/ETM-15495): variant type masih bisa ditambah; Stock ID nempel di SKU itu **nilai stok tidak berubah**.

  [CATATAN QA] Benturan docs: §6.3.2 tabel — soft delete jika **zero relation**; "stok **bukan** syarat" (relasi yang mengunci). Jika `haveRelations()` tidak menghitung item stock, child berstok bisa masuk cabang soft-delete + ID baru → stok orphan / qty pindah. Itu kandidat Error vs request user.
  Catat actual: leftover + qty sama = selaras request. Soft-delete child berstok = FAIL terhadap judul card; sitir gap §6.3.2 vs request.
  Referensi: qa-docs/system-product/requirement.md §6.3.2.
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
jira_key: ETM-15561
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

Ini TC risiko dari requirement, bukan skenario dikarang. Prioritas tinggi bersama leftover berelasi.
