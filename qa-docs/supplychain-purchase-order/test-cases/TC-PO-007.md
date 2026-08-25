---
doc_type: e2e-test-case
tc_code: TC-PO-007
menu: supplychain-purchase-order
menu_name: "Purchase Order"
title: "Memastikan Kegagalan Global Format File Excel Membatalkan Seluruh Proses Import"
summary: "Verifikasi validasi level file: file kosong, header rusak, atau template mismatch membatalkan seluruh import (all-or-nothing)."
status: draft
owner: QA - Cursor
last_updated: 2026-08-19
requirement_ref: "qa-docs/supplychain-purchase-order/requirement.md"
automated: true
automated_spec: tests/specs/purchase-order/po-import-global-failure-tc5.spec.ts
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - Dokumen Purchase Order status Draft telah dibuat
  - Company aktif: lumicharmsid (id: 153)
test_data:
  - field: file_empty
    value: file_kosong.xlsx (0 data rows)
  - field: file_corrupt_header
    value: file_header_rusak.xlsx (header kolom tidak sesuai)
  - field: file_type_mismatch
    value: file berisi kode PR diupload ke PO Without PR
steps:
  - Buka menu Supply Chain Management -> Purchase Order (/supplychain/purchase-order)
  - Buka PO status Draft
  - Upload file Excel kosong (tanpa baris data) -> periksa respon sistem
  - Upload file Excel dengan header yang corrupt/salah kolom -> periksa respon sistem
  - Upload file Excel tipe With PR (kolom PR terisi) ke PO yang bertipe Without PR -> periksa respon sistem
  - Verifikasi tabel detail PO
expected_result: |
  Kesalahan format file tingkat global (file kosong, header rusak, atau ketidaksesuaian tipe With PR vs Without PR) membatalkan seluruh proses import (0 baris masuk) dan menampilkan pesan error global yang jelas.
test_result:
  status: passed
  started_at: "2026-08-19T21:32:00+07:00"
  finished_at: "2026-08-19T21:32:47+07:00"
  executed_by: playwright@gmail.com
  environment: staging
  log_summary: |
    Automated Playwright E2E test PASSED pada dokumen PO Without PR (#2571) di Staging (Company: lumicharmsid):
    1. Sub-Case 1 (Header Corrupt / Kolom Salah): PASSED - File ditolak secara total (0 baris masuk ke detail PO). Import Log mencatat status failed dengan pesan The file format doesnt match the system template.
    2. Sub-Case 2 (File Kosong / 0 Baris Data): PASSED - File Excel tanpa baris data berhasil dibatalkan (0 baris masuk ke detail PO).
    3. Sub-Case 3 (Template Mismatch): PASSED - Validasi tipe template berjalan All-or-Nothing, detail PO tetap bersih (0 data).
    Dokumen Pengujian: PO Without PR (#2571).
  report_url: null
test_data_used: []
run_history: []
origin_jira: ETM-15425
last_execution:
  at: "2026-08-19 21:32:47"
  jira: ETM-15425
---

# Catatan QA & Referensi
Mengacu pada card **ETM-15425** (AC 8):
- File-level failure tetap all-or-nothing (bukan partial success).
