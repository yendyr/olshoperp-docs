---
doc_type: e2e-test-case
tc_code: TC-PR-004
menu: supplychain-purchase-requisition
menu_name: "Purchase Requisition"
test_type: regression
title: "Urutan print screen tidak sama dengan UI setelah sorting dinonaktifkan (kembali ke default)"
summary: "Verifikasi urutan print screen sinkron dengan default screen UI setelah seluruh sorting dinonaktifkan."
status: draft
owner: QA - Jeiniffer
last_updated: 2026-08-26
requirement_ref: "qa-docs/supplychain-purchase-requisition/requirement.md"
automated: false
automated_spec: null
execution_company:
  id: 13
  code: DEV-STG
related_menus: []
preconditions:
  - "Dokumen Purchase Requisition PR-6A8BF9DB (status Complete)."
  - "User login menggunakan server tyas.olshoperp.com."
test_data:
  - field: "trx_code"
    value: "PR-6A8BF9DB"
steps:
  - "Buka detail dokumen Purchase Requisition PR-6A8BF9DB."
  - "Lakukan sorting pada kolom tertentu, lalu klik kembali hingga tidak ada sorting aktif di UI (kembali ke default)."
  - "Klik tombol Print untuk mengamati hasil cetakan."
expected_result: |
  Urutan baris produk di print out harus sama persis dengan urutan default screen UI saat sorting dinonaktifkan.
test_result:
  status: failed
  started_at: "2026-08-26T14:00:00+07:00"
  finished_at: "2026-08-26T14:15:00+07:00"
  executed_by: "QA - Jeiniffer"
  environment: "tyas.olshoperp.com"
  log_summary: |
    FAIL: Data yang tercapture di print out sudah sesuai, namun urutannya acak/tidak sama dengan urutan default screen UI.
  report_url: null
test_data_used:
  - "PR-6A8BF9DB"
run_history:
  - run_at: "2026-08-26T14:15:00+07:00"
    status: failed
    executor: "QA - Jeiniffer"
    notes: "Data di print out tidak mengikuti urutan reset default screen UI."
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

# TC-PR-004

## Catatan QA
- **Latar Belakang:** Pengujian dilakukan pasca implementasi card ETM-15596 (Sorting di Print Screen).
- **Hasil Observasi:** Masalah sinkronisasi cetak muncul ketika urutan dikembalikan ke status awal (tanpa sorting).
- **Relasi JIRA:** Melahirkan card defect `[Purchase Requisition - Retest ETM-15596] - Temuan Bug Sorting Detail Transaksi & Print Screen` dengan Request ID `recvsfHMQ9Fr1p`.
