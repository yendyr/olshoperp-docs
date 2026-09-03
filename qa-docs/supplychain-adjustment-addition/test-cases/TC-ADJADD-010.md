---
doc_type: e2e-test-case
tc_code: TC-ADJADD-010
menu: supplychain-adjustment-addition
menu_name: "Stock Addition"
test_type: edge
title: "Aturan Integritas 1 Baris Maksimal 1 Colli"
summary: "Memastikan aturan integritas relasi 1 baris detail item maksimal hanya memiliki 1 Colli ID (tidak terjadi duplikasi atau tumpang tindih colli pada 1 baris)."
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
  - "Baris SKU-1 telah terhubung ke Colli-A"
test_data:
  - field: "Target Reassign"
    value: "Colli-B"
steps:
  - "1. Buka kembali opsi assign colli pada baris SKU-1 yang sudah memiliki Colli-A"
  - "2. Pilih Colli-B (New / Existing) -> Klik Simpan"
  - "3. Periksa nilai kolom Colli ID pada baris SKU-1"
expected_result: |
  Relasi colli pada baris SKU-1 berganti menjadi Colli-B. Tidak terjadi penumpukan atau duplikasi multi-colli pada satu baris SKU yang sama.
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
- Jira Test Case: [ETM-15768](https://erpintegration.atlassian.net/browse/ETM-15768).
- Assignee: **Jeiniffer**.
- Target Testing Company: **FAT (ID: 112)**.
- Request ID: `recvtVn0R0JkFk`.
