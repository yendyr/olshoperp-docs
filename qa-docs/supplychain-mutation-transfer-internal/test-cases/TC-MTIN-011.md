---
doc_type: e2e-test-case
tc_code: TC-MTIN-011
menu: supplychain-mutation-transfer-internal
menu_name: "Transfer Internal"
test_type: happy
title: "Validasi Penghapusan Colli Destination saat Perubahan Location Destination Inline (Partial Transfer of a Colli)"
summary: "Memverifikasi bahwa jika salah satu SKU yang berada di colli origin yang sama dipindahkan ke location destination berbeda, sistem menghapus colli destination (menjadi null) karena transaksi dianggap sebagai partial transfer."
status: draft
owner: QA - Yemima
last_updated: 2026-08-30
requirement_ref: "qa-docs/supplychain-mutation-transfer-internal/requirement.md"
automated: false
automated_spec: null
execution_company:
  id: 13
  code: DEV-STG
related_menus: []
preconditions:
  - "User login ke OlshopERP."
  - "Company aktif: DEV-STG (13)."
  - "SKU-COLLI01 dan SKU-COLLI02 berada di colli origin yang sama (COL-6A912EB5)."
test_data:
  - field: "Location Destination Initial"
    value: "RAK-S-1-A-1"
steps:
  - "Buka dokumen Transfer Internal baru (Draft/Open)."
  - "Masukkan SKU-COLLI01 dan SKU-COLLI02 ke grid detail (full transfer)."
  - "Pastikan kedua SKU terisi location destination default 'RAK-S-1-A-1'."
  - "Ubah inline location destination salah satu SKU (SKU-COLLI02) menjadi 'RAK-S-1-A-2'."
  - "Periksa kolom multi-sku colli destination untuk kedua SKU tersebut."
expected_result: |
  Ketika location destination dari salah satu SKU dalam colli yang sama diubah (partial transfer), sistem secara otomatis mengosongkan/mereset multi-sku colli destination dari kedua SKU tersebut menjadi null (-).
test_result:
  status: passed
  started_at: "2026-08-30T13:30:00+07:00"
  finished_at: "2026-08-30T14:00:00+07:00"
  executed_by: "QA Manual"
  environment: staging
  log_summary: "PASS — Ketika lokasi destination SKU-COLLI02 diubah dari RAK-S-1-A-1 ke RAK-S-1-A-2, colli destination dari SKU-COLLI01 dan SKU-COLLI02 berubah menjadi null (-). Sesuai validasi system karena dianggap partial transfer dan single rack fulfillment (no bug for now, pending lead/user feedback)."
  report_url: null
test_data_used: []
run_history:
  - at: "2026-08-30"
    status: passed
    environment: staging
    note: "PASS — Reset colli code destination saat beda lokasi tujuan."
origin_jira: ETM-15553
last_execution:
  at: "2026-08-30"
  jira: "ETM-15553"
  status: passed
  via: "manual:p"
  notes: "Verifikasi pengujian manual: status tersimpan, respon validasi dan datalist sesuai expected."
first_execution:
  at: "2026-08-30"
  via: "manual:p"
  jira: "ETM-15553"
---

# TC-MTIN-011

## Catatan QA
- **Latar Belakang:** Pengujian dilakukan untuk memverifikasi handling partial transfer dari satu colli origin.
- **Relasi JIRA:** Terkait dengan card `ETM-15553`.
