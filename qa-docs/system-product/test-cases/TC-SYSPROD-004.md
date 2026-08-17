---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-004
menu: system-product
menu_name: "System Product"
title: "Create + Default ON — parent SKU-(PARENT), child = SKU user"
summary: "Master Variant Default ON: create otomatis Variant; parent literal -(PARENT); child tanpa suffix opsi Default."
status: draft
owner: QA - Yemima
last_updated: 2026-08-17
requirement_ref: "qa-docs/system-product/requirement.md §6.3.1 GAP-SP-17 V-01"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - supplychain-variant
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Master Variant: tepat 1 group Set as Default System Product ON + tepat 1 opsi (GAP-VAR-01)."
  - "SKU uji belum ada."
test_data:
  - field: "UI"
    value: "https://staging.olshoperp.com/supplychain/product"
  - field: "SKU input"
    value: "ETM15495-C1-{stamp}"
steps:
  - "Buka https://staging.olshoperp.com/supplychain/product → Create."
  - "Isi SKU ETM15495-C1-{stamp} + field wajib. Jangan klik Enable Variations manual."
  - "Save. Catat SKU parent & child di datalist/edit."
expected_result: |
  Enable Variations ON otomatis; Default group + 1 opsi terpasang.
  Parent = `{userSku}-(PARENT)` (V-01). Child = `{userSku}` tanpa suffix opsi Default.
  Default group tetap tampil di bawah toggle (sementara).

  [CATATAN QA] TO-BE §6.3.1 / [ETM-15495](https://erpintegration.atlassian.net/browse/ETM-15495). AS-IS create tetap Single kecuali Enable Variations manual (GAP-SP-17).
  Referensi: qa-docs/system-product/requirement.md §6.3.1.
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
last_execution:
  at: null
  jira: null
---

## Catatan QA

Port dari `automate testing jira/ETM-15512` TC-01. Prasyarat Master Variant Default: [ETM-15511](https://erpintegration.atlassian.net/browse/ETM-15511) / GAP-VAR-01.
