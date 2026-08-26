---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-039
menu: system-product
menu_name: "System Product"
test_type: happy
title: "Expand zero-relation → soft delete + regenerate"
summary: "Menambah Variant Group baru pada default variant product tanpa relasi/stok akan men-soft delete child lama dan men-generate ID/SKU kombinasi baru secara bersih."
status: draft
owner: QA - Antigravity
last_updated: 2026-08-21
requirement_ref: "qa-docs/system-product/requirement.md"
automated: false
automated_spec: null
execution_company:
  id: 13
  code: DEV-STG
related_menus:
  - supplychain-variant
preconditions:
  - "Produk parent SKUPNSL-ZERO-(PARENT) dengan child default SKUPNSL-ZERO (stok 0, tanpa relasi SO/PO)."
steps:
  - "Buka halaman Edit produk parent SKUPNSL-ZERO-(PARENT)."
  - "Scroll ke section Product Details pada area variasi."
  - "Tambahkan Variant Group CLR-SP (opsi: biru, hijau)."
  - "Klik button Save All."
expected_result: |
  Child SKU lama (SKUPNSL-ZERO) ter-soft delete dari sistem.
  Sistem men-generate seluruh ID baru dan kombinasi SKU baru:
  - SKUPNSL-ZERO-biru
  - SKUPNSL-ZERO-hijau
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
origin_jira: ETM-15512
last_execution:
  at: null
  jira: null
---
