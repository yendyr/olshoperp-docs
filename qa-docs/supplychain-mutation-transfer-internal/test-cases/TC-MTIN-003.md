---
doc_type: e2e-test-case
tc_code: TC-MTIN-003
menu: supplychain-mutation-transfer-internal
menu_name: "Transfer Internal"
test_type: happy
title: "BETA route terpisah & kolom Colli Code di Available Product"
summary: "Verifikasi menu BETA new-mutation-transfer-internal terpisah dari legacy dan Available Product menampilkan colli per stock ID."
status: draft
owner: QA - Yemima
last_updated: 2026-09-01
requirement_ref: "qa-docs/supplychain-mutation-transfer-internal/requirement.md §4, §6.2, §7"
automated: false
automated_spec: null
execution_company:
  id: 13
  code: DEV-STG
related_menus:
  - supplychain-new-purchase-inbound
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company aktif: DEV-STG (id: 13)."
  - "Stok disiapkan di RAK-S-1-A-1 via PO PO-6A8BF899 dan Inbound IN-5U843NDK (Approved)."
test_data:
  - field: "Konfigurasi Lokasi & SKU"
    value: |
      * Location Origin header: RAK-S-1-A-1
      * Location Destination header: Seruni DropOff
      * URL BETA: https://staging.olshoperp.com/supplychain/new-mutation-transfer-internal
      * URL legacy (tanpa Colli v2): https://staging.olshoperp.com/supplychain/mutation-transfer-internal

      | Stock ID (inbound) | SKU | Qty | Colli Code | Tipe |
      | --- | --- | --- | --- | --- |
      | 234952 | SKU-TFI01 | 100 | - | Loose |
      | 234953 | SKU-TFI02 | 100 | - | Loose |
      | 234954 | SKU-TFI01 | 100 | COL-6A8BFA70 | Colli-bound |
      | 234955 | SKU-TFI02 | 100 | COL-6A8BFA83 | Colli-bound |
steps:
  - "Login ke staging."
  - "Buka https://staging.olshoperp.com/supplychain/new-mutation-transfer-internal — pastikan breadcrumb/menu BETA (bukan legacy mutation-transfer-internal)."
  - "Create dokumen baru; isi Origin = RAK-S-1-A-1, Location Destination = Seruni DropOff; Save."
  - "Buka modal Available Product."
  - "Verifikasi kolom Colli Code ada di grid."
  - "Verifikasi 4 baris stok sesuai tabel test data (loose dan colli-bound terpisah per stock ID)."
  - "Filter/pencarian Colli Code = COL-6A8BFA70 — hanya baris SKU-TFI01 colli-bound yang tampil."
  - "(Opsional regresi) Buka legacy https://staging.olshoperp.com/supplychain/mutation-transfer-internal — toolbar BulkColliAction / kolom Colli Origin tidak wajib ada."
expected_result: |
  - Route BETA Colli v2 terpisah dari menu legacy end-user (requirement §1 dual UI).
  - Available Product menampilkan kolom Colli Code; loose tampil '-' / kosong; colli-bound tampil code (requirement §6.2, §7).
  - Empat entri stok sesuai inbound:
    * SKU-TFI01 loose Qty 100
    * SKU-TFI01 COL-6A8BFA70 Qty 100
    * SKU-TFI02 loose Qty 100
    * SKU-TFI02 COL-6A8BFA83 Qty 100
  - Pencarian COL-6A8BFA70 hanya menampilkan baris SKU-TFI01 milik colli tersebut.
test_result:
  status: passed
  started_at: "2026-08-24T15:15:00+07:00"
  finished_at: "2026-08-24T16:13:45+07:00"
  executed_by: "QA Manual"
  environment: staging
  log_summary: "PASS (run 2026-08-24) — 4 entri stok + filter colli. Steps diperjelas vs requirement v2.0 2026-09-01."
  report_url: null
test_data_used: []
run_history:
  - at: "2026-08-24"
    status: passed
    environment: staging
    note: "PASS — filter colli COL-6A8BFA70."
  - at: "2026-09-01"
    status: revised
    environment: staging
    note: "Align requirement v2.0 §4/§6.2/§7 — URL BETA eksplisit, termin loose/colli-bound."
origin_jira: ETM-15553
first_execution:
  at: "2026-08-24"
  via: "legacy:test_result"
  jira: ETM-15553
last_execution:
  at: "2026-08-24"
  jira: ETM-15553
  status: passed
  via: "legacy:test_result"
---

# TC-MTIN-003

## Catatan QA

Requirement: [requirement.md §4](../requirement.md) (dual route), §6.2 (Available Product bind stock ID), §7 (Colli v2 BETA). Origin card ETM-15553.
