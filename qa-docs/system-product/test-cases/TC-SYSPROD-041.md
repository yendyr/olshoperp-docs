---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-041
menu: system-product
menu_name: "System Product"
test_type: happy
title: "Omit Default segment + hide Default column"
summary: "Mengabaikan opsi segment default dari penamaan SKU child baru hasil expand dan menyembunyikan kolom default di datatable variasi."
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
  - "Master Default Variant ON (group Standard, opsi Standard)."
  - "Produk parent default variant SKUPNSL-OMIT-(PARENT)."
steps:
  - "Buka halaman Edit produk parent SKUPNSL-OMIT-(PARENT)."
  - "Scroll ke section Product Details pada area variasi."
  - "Tambahkan Variant Group CLR-SP (opsi: biru, hijau)."
  - "Klik button Save All."
expected_result: |
  Kode SKU kombinasi baru yang terbentuk adalah SKUPNSL-OMIT-biru dan SKUPNSL-OMIT-hijau (tanpa segmen nama opsi default '-Standard').
  Kolom group Default (Standard) tersembunyi (visible: false) di datatable variasi.
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
