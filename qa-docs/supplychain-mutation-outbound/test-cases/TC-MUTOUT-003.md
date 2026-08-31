---
doc_type: e2e-test-case
tc_code: TC-MUTOUT-003
menu: supplychain-mutation-outbound
menu_name: "Outbound External"
test_type: regression
title: "Temuan Bug Sorting Detail Transaksi & Print Screen pada Outbound External"
summary: "Verifikasi sinkronisasi urutan baris detail transaksi Outbound External antara default screen UI dan print screen hasil cetakan PDF."
status: draft
owner: QA - Jeiniffer
last_updated: 2026-08-26
requirement_ref: "qa-docs/supplychain-mutation-outbound/requirement.md"
automated: false
automated_spec: null
execution_company:
  id: 13
  code: DEV-STG
related_menus: []
preconditions:
  - "Dokumen Outbound External OT-5U6YB29J dengan status Complete, tipe 'Other'."
  - "Dokumen memiliki minimal 5 detail produk terinput."
  - "User login menggunakan server tyas.olshoperp.com."
test_data:
  - field: "trx_code"
    value: "OT-5U6YB29J"
steps:
  - "Buka detail transaksi Outbound External OT-5U6YB29J."
  - "Lakukan pengujian print out tanpa sorting (TC-01)."
  - "Lakukan pengujian sorting System Product SKU (Ascending, Descending, dan Dinonaktifkan) (TC-02)."
  - "Lakukan pengujian sorting Out Qty (Ascending, Descending, dan Dinonaktifkan) (TC-03)."
  - "Lakukan pengujian sorting Unit (TC-04)."
expected_result: |
  - TC-01: Urutan produk di print out harus sama persis dengan urutan default screen UI (pre-condition).
  - TC-02: Sorting System Product SKU (Ascending & Descending) berjalan lancar dan urutan di print screen sinkron dengan UI. Saat sorting dimatikan, urutan di print out harus kembali seperti semula (LIFO).
  - TC-03: Sorting Out Qty (Ascending & Descending) berjalan lancar dan urutan di print screen sinkron dengan UI. Saat sorting dimatikan, urutan di print out harus kembali seperti semula (LIFO).
  - TC-04: Karena semua produk menggunakan unit 'Pieces', klik header 'Unit' tidak boleh mengubah urutan di UI maupun hasil cetak print screen.
test_result:
  status: failed
  started_at: "2026-08-26T15:00:00+07:00"
  finished_at: "2026-08-26T15:30:00+07:00"
  executed_by: "QA - Jeiniffer"
  environment: "tyas.olshoperp.com"
  log_summary: |
    FAIL: Ditemukan ketidaksinkronan urutan print screen saat tidak ada sorting aktif (stuck di urutan acak):
    1. TC-01 (Print tanpa sorting): Data tercapture benar, namun urutan print out tidak sinkron dengan UI (stuck di urutan acak).
    2. TC-02 & TC-03 (Sorting dimatikan): Urutan di default UI kembali ke semula (pre-condition), namun print out tetap salah/stuck di urutan acak.
    3. TC-04 (Sorting Unit): Klik header 'Unit' tidak mengubah urutan UI (benar), namun hasil print out tetap salah/stuck di urutan acak.
  report_url: null
test_data_used:
  - "OT-5U6YB29J"
run_history:
  - run_at: "2026-08-26T15:30:00+07:00"
    status: failed
    executor: "QA - Jeiniffer"
    notes: "Urutan print out tidak pernah kembali ke default (selalu stuck di urutan acak) ketika sorting dinonaktifkan."
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

# TC-MUTOUT-003

## Catatan QA
- **Latar Belakang:** Pengujian dilakukan pasca implementasi card ETM-15596 (Sorting di Print Screen).
- **Hasil Observasi:** Masalah utama adalah data print screen selalu stuck di urutan acak (BIP-KEO PINK -> BIP-KEO MERAH -> BIP-KEO KUNING -> BIP-KEO BBABY -> BIP-KEO VIOLET) setiap kali sorting dinonaktifkan atau saat pertama kali halaman dibuka (tanpa sorting).
- **Relasi JIRA:** Melahirkan card defect `[Outbound External - Retest ETM-15596] - Temuan Bug Sorting Detail Transaksi & Print Screen` dengan Request ID `recvsfHMQ9Fr1p`.
