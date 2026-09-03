---
doc_type: e2e-test-case
tc_code: TC-ADJADD-021
menu: supplychain-adjustment-addition
menu_name: "Stock Addition"
test_type: edge
title: "Pembersihan Orphan Colli saat Hapus Detail/Draft"
summary: "Memastikan pembersihan data orphan colli di mana kode New Colli yang baru terbentuk otomatis terhapus dari sistem jika detail item atau seluruh dokumen draft Stock Addition dihapus sebelum disetujui (Ref: TC-PI-018)."
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
  - "Dokumen Stock Addition Draft baru saja membentuk New Colli dan belum pernah di-approve"
test_data:
  - field: "Target Cleanup"
    value: "New Colli pada Draft Stock Addition"
steps:
  - "1. Buat dokumen Stock Addition Draft dan generate New Colli pada detail item"
  - "2. Hapus baris detail yang membentuk colli tersebut (atau hapus seluruh dokumen draft Stock Addition dari datalist)"
  - "3. Buka menu Multi SKU Colli / Stock Monitoring -> Cari kode New Colli tersebut"
expected_result: |
  Kode New Colli tersebut otomatis terhapus dari sistem dan tidak tertinggal sebagai data yatim (orphan colli) di menu Multi SKU Colli / Stock Monitoring.
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
- Jira Test Case: [ETM-15779](https://erpintegration.atlassian.net/browse/ETM-15779).
- Assignee: **OlshopERP**.
- Target Testing Company: **FAT (ID: 112)**.
- Request ID: `recvtVn0R0JkFk`.
