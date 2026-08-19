---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-017
menu: system-product
menu_name: "System Product"
title: "OFF Enable Variations — header bundle sudah Variant (Default create)"
summary: "§6.3.1: create bundle lewat Default → header sudah Variant. OFF Variations vs lock bundle (`product_relation` / `variant_bundle_transaction`)."
status: draft
owner: QA - Yemima
last_updated: 2026-08-17
requirement_ref: "qa-docs/system-product/requirement.md §6.3.1 bundle Default + §6.4 lock toggle"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - supplychain-variant
  - supplychain-bill-of-material
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Master Default ON. Create System Product **Set as Product Bundle ON** + Default path (header sudah Variant, bukan Single dulu). Isi resep bundle valid (§6.4)."
  - "Siapkan 2 cabang: (A) bundle **belum** `product_relation` / `variant_bundle_transaction`; (B) bundle **sudah** dipakai SO (scope bundle = SO only)."
test_data:
  - field: "UI"
    value: "https://staging.olshoperp.com/supplychain/product"
steps:
  - "Cabang A: edit header bundle Variant, zero trx. OFF Enable Variations. Catat popup, lock toggle, accordion bundle per child vs header Single."
  - "Save bila diizinkan. Cek resep bundle masih valid (≥2 line atau qty>1); komponen tidak orphan."
  - "Cabang B: header/child bundle sudah di SO. Coba OFF. Cek Tippy lock (`there_is_relation` + bundle) dan apakah Save merusak SO bundle."
expected_result: |
  Cabang A (zero trx): V-02 confirm. Setelah OFF, header bundle tidak boleh kehilangan resep; jangan 0-detail / 1-detail qty=1 (invalid §6.4).
  Cabang B (ada trx): lock toggle bundle/variant sesuai §6.4 (`product_relation` atau `variant_bundle_transaction`). SO bundle tetap resolve. Jangan 500 / komponen hilang.

  [CATATAN QA] §6.3.1: “Bundle: create lewat Default → header bundle sudah Variant”. §6.4 lock = bundle toggle, bukan explisit Variations — tapi FE Tippy men-disable Variations saat bundle+relation. Catat actual: disable vs tetap bisa OFF.
  Referensi: requirement §6.3.1 bullet bundle; §6.4 Lock toggle.
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
jira_key: ETM-15567
last_execution:
  at: null
  jira: null
---

## Catatan QA

Jangan campur dengan Header BOM Assembly (`is_bom=1`) — itu menu BoM, bukan toggle bundle.
