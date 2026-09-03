---
doc_type: e2e-test-case
tc_code: TC-ADJADD-019
menu: supplychain-adjustment-addition
menu_name: "Stock Addition"
test_type: permission
title: "Master Colli Type: Inactive Filter & Preselect Default"
summary: "Memastikan integrasi Master Colli Type berjalan benar di mana Colli Type berstatus Inactive (Active = OFF) tidak tampil di dropdown pilihan New Colli, dan Colli Type dengan Default = ON terpilih otomatis (Ref: ETM-15543)."
status: draft
owner: QA - Yemima
last_updated: 2026-09-03
requirement_ref: "qa-docs/supplychain-adjustment-addition/requirement.md"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - accounting-adjustment-inbound
  - supplychain-stock-monitoring
  - supplychain-colli-type
preconditions:
  - "Master Colli Type memiliki tipe Inactive (Active = OFF) dan tipe Default (Active = ON, Default = ON)"
test_data:
  - field: "Inactive Type"
    value: "Karton (OFF)"
  - field: "Default Type"
    value: "Pallet (ON)"
steps:
  - "1. Buka form detail Stock Addition -> Pilih Create New Colli"
  - "2. Buka dropdown Colli Type"
  - "3. Periksa keberadaan Colli Type yang berstatus Inactive dan nilai default yang terpilih"
expected_result: |
  Colli Type berstatus Inactive tidak muncul di daftar pilihan dropdown. Colli Type dengan flag Default = ON terpilih secara otomatis (preselected).
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
origin_jira: ETM-15633
last_execution:
  at: null
  jira: null
  status: not_run
  via: null
first_execution:
  at: null
  via: null
  jira: null
---

# Catatan QA & Referensi Data Testing (Evidence)
Mengacu pada card **ETM-15633** ([Stock Addition] Implementasi Colli v2 — Multi-SKU per Colli by Location).
- Jira Test Case: [ETM-15777](https://erpintegration.atlassian.net/browse/ETM-15777).
- Assignee: **OlshopERP**.
- Target Testing Company: **FAT (ID: 112)**.
- Request ID: `recvtVn0R0JkFk`.
