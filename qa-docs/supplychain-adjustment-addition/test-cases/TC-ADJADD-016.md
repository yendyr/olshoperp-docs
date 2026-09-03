---
doc_type: e2e-test-case
tc_code: TC-ADJADD-016
menu: supplychain-adjustment-addition
menu_name: "Stock Addition"
test_type: happy
title: "Import Excel: Kode Existing & Baris Kosong (NULL)"
summary: "Memastikan proses import file Excel detail Stock Addition yang memuat kode Existing Colli dan baris tanpa colli berhasil di-assign secara tepat."
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
  - "Terdapat Existing Colli COL-AAA di sistem pada Warehouse Destination yang sama"
test_data:
  - field: "Baris 1 Colli"
    value: "COL-AAA"
  - field: "Baris 2 Colli"
    value: "(Kosong / NULL)"
steps:
  - "1. Siapkan file Excel import: Baris 1 = COL-AAA, Baris 2 = kosong"
  - "2. Upload file Excel pada modal Import Detail Stock Addition"
  - "3. Klik proses import"
expected_result: |
  Baris 1 terhubung ke kode existing COL-AAA, dan baris 2 masuk sebagai baris detail tanpa colli (NULL).
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
- Jira Test Case: [ETM-15774](https://erpintegration.atlassian.net/browse/ETM-15774).
- Assignee: **Jeiniffer**.
- Target Testing Company: **FAT (ID: 112)**.
- Request ID: `recvtVn0R0JkFk`.
