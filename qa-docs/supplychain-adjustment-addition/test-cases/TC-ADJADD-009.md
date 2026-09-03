---
doc_type: e2e-test-case
tc_code: TC-ADJADD-009
menu: supplychain-adjustment-addition
menu_name: "Stock Addition"
test_type: happy
title: "Kombinasi Baris Ber-Colli dan Tanpa Colli (NULL OK)"
summary: "Memastikan dokumen Stock Addition dapat menyimpan kombinasi baris yang ber-colli (New/Existing) dan baris tanpa colli (Colli = NULL) secara fleksibel tanpa error mandatory."
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
  - "Form edit Stock Addition terbuka dengan minimal 3-4 baris SKU"
test_data:
  - field: "Baris 1 & 2"
    value: "Colli COL-AAA"
  - field: "Baris 3 & 4"
    value: "Colli NULL (Kosong)"
steps:
  - "1. Buka form edit Stock Addition"
  - "2. Assign baris 1 dan 2 ke kode Colli (New/Existing)"
  - "3. Biarkan baris 3 dan 4 tanpa Colli (kolom Colli ID kosong / NULL)"
  - "4. Klik tombol Save / Save All"
expected_result: |
  Dokumen berhasil disimpan tanpa kendala. Sistem tidak mewajibkan seluruh baris memiliki Colli (Colli is optional).
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
- Jira Test Case: [ETM-15767](https://erpintegration.atlassian.net/browse/ETM-15767).
- Assignee: **OlshopERP**.
- Target Testing Company: **FAT (ID: 112)**.
- Request ID: `recvtVn0R0JkFk`.
