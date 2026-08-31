---
doc_type: e2e-test-case
tc_code: TC-PR-001
menu: supplychain-purchase-requisition
menu_name: "Purchase Requisition"
test_type: regression
title: "Default sorting detail PR tidak kembali ke LIFO (Last-In-First-Row) setelah reset / reopen"
summary: "Verifikasi urutan default detail PR kembali ke LIFO (Last-In-First-Row) setelah sorting dinonaktifkan atau dokumen dibuka kembali."
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
  - "Dokumen Purchase Requisition PR-6A8BF9DB (status Complete) memiliki minimal 6 baris detail produk terinput."
  - "User login menggunakan server tyas.olshoperp.com."
test_data:
  - field: "trx_code"
    value: "PR-6A8BF9DB"
steps:
  - "Buka detail dokumen Purchase Requisition PR-6A8BF9DB."
  - "Klik header kolom System Product SKU untuk melakukan sorting Descending."
  - "Klik kembali header kolom tersebut hingga sorting nonaktif (kembali ke default), atau tutup dokumen lalu buka kembali."
  - "Verifikasi urutan baris detail produk yang ditampilkan."
expected_result: |
  Tampilan urutan baris detail saat dokumen pertama kali dibuka kembali (atau setelah sorting dinonaktifkan) harus kembali ke Last-In-First-Row (LIFO).
test_result:
  status: failed
  started_at: "2026-08-26T14:00:00+07:00"
  finished_at: "2026-08-26T14:15:00+07:00"
  executed_by: "QA - Jeiniffer"
  environment: "tyas.olshoperp.com"
  log_summary: |
    FAIL: Urutan detail di default screen tidak kembali ke semula (LIFO), melainkan sistem tetap menyimpan/stuck di sorting System Product SKU descending.
  report_url: null
test_data_used:
  - "PR-6A8BF9DB"
run_history:
  - run_at: "2026-08-26T14:15:00+07:00"
    status: failed
    executor: "QA - Jeiniffer"
    notes: "Urutan detail tetap tersimpan sorting System Product SKU descending."
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

# TC-PR-001

## Catatan QA
- **Latar Belakang:** Pengujian dilakukan pasca implementasi card ETM-15596 (Sorting di Print Screen).
- **Hasil Observasi:** Setelah beralih ke sorting System Product SKU Descending lalu reload, sistem default kembali ke sort descending, bukan ke LIFO.
- **Relasi JIRA:** Melahirkan card defect `[Purchase Requisition - Retest ETM-15596] - Temuan Bug Sorting Detail Transaksi & Print Screen` dengan Request ID `recvsfHMQ9Fr1p`.
