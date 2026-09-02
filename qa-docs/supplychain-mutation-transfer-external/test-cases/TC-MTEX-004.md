---
doc_type: e2e-test-case
tc_code: TC-MTEX-004
menu: supplychain-mutation-transfer-external
menu_name: "External Transfer"
test_type: regression
title: "Retest ETM-15596: Verifikasi Cetakan PDF dengan Urutan Default (LIFO) - Transfer External"
summary: "Memastikan urutan baris detail barang pada cetakan PDF/Print Out Transfer External sama persis dengan urutan default LIFO di grid UI detail transaksi sebelum dilakukan sorting."
status: draft
owner: QA - Yemima
last_updated: 2026-08-28
requirement_ref: "qa-docs/supplychain-mutation-transfer-external/requirement.md"
automated: true
automated_spec: "tests/specs/mutation-transfer-external/etm-15596-sorting-mtex.spec.ts"
execution_company:
  id: 13
  code: DEV-STG
related_menus: []
preconditions:
  - "User login menggunakan credential E2E: playwright@gmail.com / 12345678."
  - "Company aktif: Dev Staging (DEV-STG, id: 13)."
  - "Tersedia dokumen Transfer External Draft/Open dengan minimal 3-5 baris detail barang."
test_data:
  - field: "Transaction Code"
    value: "TFE-5U97T5DC"
steps:
  - "Buka menu External Transfer, lalu masuk ke form detail dokumen target (TFE-5U97T5DC)."
  - "Pastikan tidak ada sorting aktif di grid UI detail (kondisi default awal)."
  - "Klik tombol Print Detail untuk memicu unduhan cetakan PDF."
  - "Bandingkan urutan baris item barang pada file cetak PDF dengan grid UI."
expected_result: |
  1. Urutan baris item barang pada cetakan PDF/Print Out harus 100% sama dan sejajar dengan urutan default yang tampil di grid UI detail transaksi.
  2. Urutan harus mengikuti aturan LIFO (item terakhir ditambahkan berada paling atas).
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
origin_jira: ETM-15596
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

# TC-MTEX-004

## Catatan QA
- **Latar Belakang:** Pengujian dilakukan untuk memverifikasi perbaikan sinkronisasi sorting default cetakan vs UI pasca ETM-15596.
- **Relasi JIRA:** Terkait dengan card `ETM-15596`.
