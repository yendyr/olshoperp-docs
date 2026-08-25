---
tc_code: TC-ASO-001
title: Memastikan Tombol Recheck Failed Process Tersedia dan Dapat Dijalankan di Menu All Sales Order dan Dev Sales Platform
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
  - User login ke sistem staging dengan akun yang memiliki hak akses ke menu All Sales Order dan Dev Sales Platform
  - Company aktif adalah FAT (id: 112)
test_data:
  - field: menu_all_sales_order
    value: /businessdevelopment/all-sales-order
  - field: menu_sales_platform
    value: /omni/sales-order
steps:
  - Buka menu Business Development -> All Sales Order (/businessdevelopment/all-sales-order)
  - Periksa area action button di bagian atas datalist
  - Verifikasi keberadaan tombol 'Recheck failed process'
  - Arahkan kursor (hover) ke tombol 'Recheck failed process' dan periksa tooltip yang muncul
  - Buka menu OmniChannel -> Dev - Sales Platform (/omni/sales-order)
  - Periksa area action button di bagian atas datalist
  - Verifikasi keberadaan tombol 'Recheck failed process'
  - Arahkan kursor (hover) ke tombol 'Recheck failed process' dan periksa tooltip yang muncul
expected_result: |
  Tombol 'Recheck failed process' tersedia di kedua menu (All Sales Order dan Dev - Sales Platform) dengan icon dan tooltip yang sesuai ('Re-check sales order error flaggings...'). Ketika proses recheck sedang berjalan, tombol disabled dengan label 'Rechecking...' dan tooltip menunjukkan bahwa proses sedang berlangsung.
test_result:
  status: passed
  started_at: "2026-08-19T11:29:00+07:00"
  finished_at: "2026-08-19T11:29:35+07:00"
  executed_by: playwright@gmail.com
  environment: staging
  log_summary: "Tombol Recheck failed process dan tooltip berhasil diverifikasi tampil di All Sales Order dan Dev - Sales Platform (Fix untuk note FAILED T03 Jeiniffer)"
  report_url: null
test_data_used: []
run_history: []
origin_jira: ETM-15350
last_execution:
  at: null
  jira: null
---

# Catatan QA & Referensi

## Konteks Jira ETM-15350 / ETM-15194
Card ETM-15350 mencakup penambahan tombol trigger re-check failed process di menu All Sales Order dan Dev - Sales Platform.

## Catatan Pengujian Sebelumnya (Jeiniffer - 23 Juli 2026):
- **T01 (Hover tooltip):** PASSED (Tooltip tampil wording + Last Checked timestamp).
- **T03 (Button di Dev - Sales Platform):** FAILED — Saat pengujian awal, tombol belum tersedia di menu Dev - Sales Platform.
- **T04 (Button state saat in-progress):** PASSED — Tombol disabled dan menampilkan pesan loading saat batch job sedang berjalan.
