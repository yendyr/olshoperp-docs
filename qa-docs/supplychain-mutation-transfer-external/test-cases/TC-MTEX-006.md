---
doc_type: e2e-test-case
tc_code: TC-MTEX-006
menu: supplychain-mutation-transfer-external
menu_name: "External Transfer"
test_type: regression
title: "Retest ETM-15596: Verifikasi Cetakan PDF dengan Sorting Qty (Ascending & Descending) - Transfer External"
summary: "Memastikan urutan baris detail barang pada cetakan PDF/Print Out Transfer External sinkron dengan urutan aktif di grid UI detail saat disorting berdasarkan Qty secara Ascending dan Descending."
status: draft
owner: QA - Yemima
last_updated: 2026-08-27
requirement_ref: "qa-docs/supplychain-mutation-transfer-external/requirement.md"
automated: false
automated_spec: null
execution_company:
  id: 13
  code: DEV-STG
related_menus: []
preconditions:
  - "User login menggunakan credential E2E: playwright@gmail.com / 12345678."
  - "Company aktif: Dev Staging (DEV-STG, id: 13)."
  - "Tersedia dokumen Transfer External Draft/Open dengan minimal 3-5 baris detail barang dengan kuantitas (Qty) yang bervariasi."
test_data:
  - field: "Transaction Code"
    value: "TFE-XXXXX"
steps:
  - "Buka menu External Transfer, lalu masuk ke form detail dokumen target (TFE-XXXXX)."
  - "Klik header kolom 'Qty' hingga indikator sorting ascending aktif (berwarna hijau)."
  - "Verifikasi urutan baris barang di grid UI terurut secara numerik ascending berdasarkan kuantitas."
  - "Klik tombol Print Detail dan bandingkan urutan barang di PDF cetakan dengan grid UI."
  - "Klik kembali header kolom 'Qty' hingga indikator sorting descending aktif."
  - "Verifikasi urutan baris barang di grid UI terurut secara numerik descending berdasarkan kuantitas."
  - "Klik tombol Print Detail dan bandingkan urutan barang di PDF cetakan dengan grid UI."
expected_result: |
  1. Pada pengujian sorting Qty Ascending, urutan barang di cetakan PDF harus sama persis dengan urutan Ascending di grid UI.
  2. Pada pengujian sorting Qty Descending, urutan barang di cetakan PDF harus sama persis dengan urutan Descending di grid UI.
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

# TC-MTEX-006

## Catatan QA
- **Latar Belakang:** Pengujian dilakukan untuk memverifikasi perbaikan sinkronisasi sorting Qty cetakan vs UI pasca ETM-15596.
- **Relasi JIRA:** Terkait dengan card `ETM-15596`.
