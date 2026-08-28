---
doc_type: e2e-test-case
tc_code: TC-ASMBLY-007
menu: supplychain-assembly
menu_name: "Assembly"
test_type: regression
title: "Regresi — Single Rack Fulfillment & FIFO: origin bukan Outrack / WIP (menu selain Assembly)"
summary: "MPL, TI, TE, Outbound External manual, Stock Deduction: alokasi origin tidak boleh dari WH yang di-state Outrack atau WIP."
status: draft
owner: QA - Yemima
last_updated: 2026-08-17
requirement_ref: "qa-docs/supplychain-manual-picking-list/requirement.md §5.2; qa-docs/supplychain-mutation-transfer-internal/requirement.md; qa-docs/supplychain-warehouse-structure/requirement.md (origin Remapping/Deduction/Outbound)"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - supplychain-manual-picking-list
  - supplychain-mutation-transfer-internal
  - supplychain-mutation-transfer-external
  - supplychain-mutation-outbound
  - supplychain-adjustment-deduction
  - supplychain-setting
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Role punya akses kelima menu di daftar langkah."
  - "Warehouse Setting: Outrack Picking + WIP terisi untuk building uji. Ada stok di rack biasa dan (jika ada) stok di Outrack/WIP untuk membuktikan exclude."
test_data:
  - field: "Manual Picking List"
    value: "https://staging.olshoperp.com/supplychain/manual-picking-list"
  - field: "Transfer Internal"
    value: "https://staging.olshoperp.com/supplychain/mutation-transfer-internal"
  - field: "Transfer External"
    value: "https://staging.olshoperp.com/supplychain/mutation-transfer-external"
  - field: "Outbound External"
    value: "https://staging.olshoperp.com/supplychain/mutation-outbound"
  - field: "Stock Deduction"
    value: "https://staging.olshoperp.com/supplychain/adjustment-deduction"
steps:
  - "Manual Picking List: create, pilih produk via Select Product (Single Rack → FIFO). Cek rack origin di detail — bukan Outrack picking, bukan WIP."
  - "Transfer Internal: Select Product / bulk-fifo. Cek warehouse origin line — bukan Outrack, bukan WIP."
  - "Transfer External: sama untuk FIFO / Select Product."
  - "Outbound External (tipe manual, bukan job Approve Assembly): selector / FIFO origin bukan Outrack & bukan WIP."
  - "Stock Deduction: warehouse origin exclude WIP Assembly, Outrack, virtual."
  - "Catat PASS/FAIL per menu di test_data_used. Fail jika line origin = WH yang di Warehouse Setting sebagai Outrack atau WIP."
expected_result: |
  Menu selain Assembly yang memakai Single Rack Fulfillment dan/atau FIFO tidak memakai WH yang di-state sebagai Outrack atau WIP sebagai origin.

  Manual Picking List: alloc `getFulfillAfterFifo` exclude semua Outrack picking + WIP + destination Outrack PL (§5.2).
  Transfer Internal: origin ≠ WIP; stok dari building tree exclude WIP (requirement TFI / Assembly A-24).
  Stock Deduction / Outbound origin: exclude WIP Assembly, Outrack, virtual (warehouse-structure).
  Outbound External **manual** mengikuti exclude origin itu. Outbound yang di-generate Approve Assembly (origin = WIP) **bukan** cakupan baris ini.

  [CATATAN QA] Bukan AC baru 15519 — regresi: perubahan selector Assembly (boleh level 20) tidak merusak exclude Outrack/WIP pada FIFO/Single Rack menu lain. Expected dari requirement MPL §5.2 + TFI + warehouse-structure, bukan dari AC COLLI.
  TC-MPL-001 / TC-MTIN-002 tidak cover exclude ini — jangan anggap sudah ditest.
  Referensi: qa-docs/supplychain-manual-picking-list/requirement.md §5.1–5.2; qa-docs/supplychain-setting/requirement.md (FIFO exclude Outrack); qa-docs/supplychain-mutation-transfer-internal/requirement.md; qa-docs/supplychain-warehouse-structure/requirement.md.
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
origin_jira: ETM-15519
first_execution:
  at: null
  via: null
  jira: null
last_execution:
  at: null
  jira: null
  status: not_run
  via: null
---

## Catatan QA

Card: [ETM-15519](https://erpintegration.atlassian.net/browse/ETM-15519). Isolasi selector (TC-ASMBLY-006) = filter dropdown. TC ini = **alokasi stok origin**.
