---
doc_type: e2e-test-case
tc_code: TC-ADJADD-013
menu: supplychain-adjustment-addition
menu_name: "Stock Addition"
test_type: happy
title: "Edit In Qty pada Baris Ber-Colli"
summary: "Memastikan pengubahan kuantitas (In Qty) pada baris item yang telah ber-colli berhasil tersimpan tanpa merusak atau memutuskan relasi Colli ID."
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
  - "Dokumen Stock Addition memiliki baris SKU ber-colli dengan In Qty awal = 10"
test_data:
  - field: "New In Qty"
    value: "25"
steps:
  - "1. Buka form edit Stock Addition"
  - "2. Ubah nilai In Qty pada baris ber-colli tersebut dari 10 menjadi 25"
  - "3. Klik tombol Save / Save All"
expected_result: |
  Nilai In Qty berhasil diperbarui menjadi 25 dan relasi Colli ID pada baris tersebut tetap terjaga tanpa terputus.
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
- Jira Test Case: [ETM-15771](https://erpintegration.atlassian.net/browse/ETM-15771).
- Assignee: **OlshopERP**.
- Target Testing Company: **FAT (ID: 112)**.
- Request ID: `recvtVn0R0JkFk`.
