---
tc_code: TC-ASO-003
test_type: happy
title: Memastikan Riwayat Log Re-check Failed Process Tercatat per Store dan Tersimpan Sesuai Riwayat Trigger
menu_slug: all-sales-order
status: draft
automated: true
automated_spec: tests/specs/all-sales-order/recheck-failed-process.spec.ts
execution_company:
  id: 112
  code: FAT
related_menus:
  - omni-sales-platform
preconditions:
  - User telah men-trigger Re-check Failed Process setidaknya satu kali
test_data:
  - field: menu_url
    value: /businessdevelopment/all-sales-order
steps:
  - Buka menu All Sales Order (/businessdevelopment/all-sales-order)
  - Klik tombol / icon 'Log Data' (atau Sync Log / Recheck Log) pada header tabel
  - Periksa modal Log Data yang terbuka
  - Verifikasi bahwa log menampilkan data yang di-aggregate per store (kolom Store, Action, Description, Date, Success, Failed, Start, Ended, Updated By)
  - Lakukan trigger Re-check Failed Process untuk kedua kalinya setelah batch pertama selesai
  - Buka kembali modal Log Data dan periksa apakah riwayat trigger kedua tercatat sebagai entry baru (append, bukan overwrite)
expected_result: |
  Modal Log Data menampilkan catatan riwayat trigger Re-check Failed Process yang dikelompokkan per store. Setiap trigger klik baru yang telah selesai akan menambahkan entry log baru ke dalam riwayat tanpa menimpa riwayat trigger sebelumnya.
test_result:
  status: passed
  started_at: "2026-08-19T11:29:00+07:00"
  finished_at: "2026-08-19T11:29:35+07:00"
  executed_by: playwright@gmail.com
  environment: staging
  log_summary: "Tombol Log Data (button.dt-btn-log-data) dan panel Slideover Sync Log berhasil dibuka serta memuat tabel log di Staging."
  report_url: null
test_data_used: []
run_history: []
origin_jira: ETM-15350
last_execution:
  at: "2026-08-19"
  jira: null
  status: passed
  via: "legacy:test_result"
---

# Catatan QA & Referensi

## Konteks Jira ETM-15350 / ETM-15194
Setiap klik tombol Re-check Failed Process harus mencatat log baru yang di-aggregate per store.

## Catatan Pengujian Sebelumnya (Jeiniffer - 23 Juli 2026):
- **T07 (Log grouped per store):** PASSED — Log menampilkan baris per store dengan agregat masing-masing.
- **T10 (Multiple trigger log history):** FAILED — Trigger click pertama (15 Juli 2026) tercatat, namun trigger click kedua (23 Juli 2026) tidak langsung masuk ke log atau ada ketidakjelasan kapan log dibuat (saat trigger vs saat job finish).
