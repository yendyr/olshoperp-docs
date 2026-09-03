---
doc_type: e2e-test-case
tc_code: TC-ADJADD-012
menu: supplychain-adjustment-addition
menu_name: "Stock Addition"
test_type: edge
title: "Move SKU ke Colli Lain"
summary: "Memastikan pemindahan SKU dari Colli A ke Colli B yang valid pada gudang tujuan yang sama berhasil memperbarui relasi Colli ID secara tepat."
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
  - "Baris SKU terhubung ke Colli-A"
  - "Terdapat Colli-B pada Warehouse Destination yang sama"
test_data:
  - field: "Target Move"
    value: "Colli-B"
steps:
  - "1. Buka modal edit pada baris SKU yang berada di Colli-A"
  - "2. Pilih aksi Move to another Colli -> Pilih Colli-B dari daftar dropdown"
  - "3. Klik tombol Simpan"
expected_result: |
  SKU berhasil berpindah dari Colli-A ke Colli-B. Kolom Colli ID pada baris tersebut terupdate menampilkan kode Colli-B.
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
- Jira Test Case: [ETM-15770](https://erpintegration.atlassian.net/browse/ETM-15770).
- Assignee: **Jeiniffer**.
- Target Testing Company: **FAT (ID: 112)**.
- Request ID: `recvtVn0R0JkFk`.
