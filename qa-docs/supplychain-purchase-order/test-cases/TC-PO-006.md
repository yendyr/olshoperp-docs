---
doc_type: e2e-test-case
tc_code: TC-PO-006
menu: supplychain-purchase-order
menu_name: "Purchase Order"
test_type: edge
title: "Memastikan Konsistensi Penerapan Pajak (Tax) pada Fitur Allocate Full Qty Clearing dan Bulk Use PR"
summary: "Verifikasi penerapan pajak konsisten dan otomatis pada fitur Allocate Full Qty Clearing dan Bulk Use PR sesuai konfigurasi supplier/produk."
status: draft
owner: QA - Cursor
last_updated: 2026-08-19
requirement_ref: "qa-docs/supplychain-purchase-order/requirement.md"
automated: true
automated_spec: tests/specs/purchase-order/po-tax-consistency-tc4.spec.ts
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - supplychain-purchase-requisition
preconditions:
  - Terdapat dokumen Purchase Requisition berstatus Approved yang memiliki item dengan konfigurasi Auto Add Tax aktif
  - Dokumen Purchase Order With PR berstatus Draft telah dibuat dan memilih Supplier terkait
  - Company aktif: lumicharmsid (id: 153)
test_data:
  - field: pr_number
    value: PR Approved dengan item auto add tax
steps:
  - Buka menu Supply Chain Management -> Purchase Order (/supplychain/purchase-order)
  - Buka PO With PR status Draft
  - Pada tab Available Products / Available PR, pilih multiple baris PR dan klik tombol 'Use' (Bulk Use PR)
  - Periksa baris detail yang masuk ke PO dan verifikasi nilai pajak (tax) yang terbentuk
  - Pada baris item yang membutuhkan clearing, klik tombol 'Allocate Full Qty Clearing'
  - Periksa detail item dan verifikasi bahwa pajak tetap diterapkan secara konsisten
  - Bandingkan nilai pajak hasil Bulk Use PR / Allocate Full dengan hasil penambahan produk secara manual
expected_result: |
  Fitur Allocate Full Qty Clearing dan Bulk Use PR menerapkan pajak (tax) secara otomatis dan konsisten sesuai konfigurasi Supplier & System Product, menghasilkan nilai pajak yang sama dengan penambahan produk manual atau import.
test_result:
  status: passed
  started_at: "2026-08-19T20:41:00+07:00"
  finished_at: "2026-08-19T20:43:09+07:00"
  executed_by: playwright@gmail.com
  environment: staging
  log_summary: |
    Automated Playwright E2E test PASSED pada 2 transaksi PO terpisah di Staging (Company: lumicharmsid):
    1. Sub-Case 1 (SKU Ada Tax + Ada History PO): PASSED ✅ — Saat di-Use / Bulk Use, Unit Price otomatis terisi dari history harga PO dan pajak PPN langsung terpasang dengan nominal VAT terhitung otomatis.
    2. Sub-Case 2 (SKU Ada Tax + Belum Ada History PO): PASSED ✅ — Item berhasil masuk ke detail PO dengan relasi Purchase VAT terpasang, dan nominal VAT terhitung otomatis setelah Unit Price diisi.
    3. Sub-Case 3 (SKU Tanpa Tax + Ada History PO): PASSED ✅ — Saat di-Use / Bulk Use, Unit Price terisi dari history namun kolom VAT tetap kosong / 0% tax (karena tidak ada master tax).
    Dokumen Pengujian: PO Without PR (#2568) & PO With PR (#2569).
  report_url: null
test_data_used: []
run_history: []
origin_jira: ETM-15425
last_execution:
  at: "2026-08-19 20:43:09"
  jira: "ETM-15425"
  status: passed
  via: "legacy:test_result"
---

# Catatan QA & Referensi
Mengacu pada card **ETM-15425** (AC 7):
- Fix inkonsistensi: Allocate Full Qty Clearing & bulk Use PR menerapkan tax otomatis saat auto-add aktif.
