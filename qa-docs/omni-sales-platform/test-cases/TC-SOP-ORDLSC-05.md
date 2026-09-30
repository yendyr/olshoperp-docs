---
doc_type: e2e-test-case
tc_code: TC-SOP-ORDLSC-05
menu: omni-sales-platform
menu_name: "Dev - Sales Platform"
test_type: happy
title: "Kartu Dokumen Transaksi Terkait (Related Transactions) dan Validasi Hyperlink"
summary: "Memastikan seluruh dokumen turunan yang sudah terbentuk (Delivery Order, Outbound, Sales Invoice, Retur, Settlement) tampil lengkap di section Related Transactions dengan hyperlink navigasi yang valid."
status: ready
owner: "QA - Yemima"
last_updated: 2026-09-30
requirement_ref: "qa-docs/omni-sales-platform/requirement.md"
automated: false
automated_spec: null
origin_jira: ETM-15893
execution_company:
  id: 13
  code: DEV-STG
related_menus:
  - supplychain-delivery-order
  - supplychain-mutation-outbound
  - accounting-customer-invoice
test_data:
  - field: "Sales Order Platform Code"
    value: "SO-5TBW8NFJ"
steps:
  - "1. Buka form Edit dokumen Sales Platform SO-5TBW8NFJ"
  - "2. Buka panel Order Lifecycle"
  - "3. Gulir ke section 'Related Transactions'"
  - "4. Periksa daftar kartu dokumen (Delivery Order, Outbound, Sales Invoice)"
  - "5. Klik salah satu tautan kode dokumen (misal Delivery Order atau Outbound)"
  - "6. Amati apakah sistem membuka halaman dokumen yang dituju"
expected_result: |
  1. Seluruh dokumen terkait yang sudah terbit terdaftar dengan jelas sesuai kode dan tipenya.
  2. Kode dokumen memiliki tautan aktif (hyperlink) yang mengarah ke URL halaman dokumen tersebut.
  3. Dokumen dapat dibuka tanpa memicu error 404 atau link mati.
  4. Jika user tidak memiliki izin akses (permission) ke menu dokumen tertentu, kode ditampilkan sebagai teks biasa (plain text), bukan link rusak/403.
test_result:
  status: passed
  started_at: "2026-09-30T10:00:00+07:00"
  finished_at: "2026-09-30T10:15:00+07:00"
  executed_by: "OlshopERP (resty)"
  environment: staging
  log_summary: "PASSED (NAVIGATION FIXED): Tautan kode dokumen Shipping (SL-xxx) dan Shipping DO (TFI-xxx) di Related Transactions sudah mengarah ke rute detail yang valid dan tidak lagi menghasilkan error 404. Catatan QA: Terdapat temuan terpisah pada agregat Delivery Order item bundle yang menampilkan '2 of 5 pcs'."
  report_url: "https://jam.dev/c/450418cc-c552-4385-bc91-cda80770d106"
test_data_used:
  - trx_code_platform: "SO-5TBW8NFJ"
    actual_related_transactions: "Dokumen turunan lengkap terdaftar (DO, Outbound, SI, Shipping, TFI). Seluruh tautan dokumen Shipping (SL-xxx) dan Shipping DO (TFI-xxx) berhasil membuka halaman detail yang valid."
    bundle_aggregate_note: "Keterangan pada DO tertulis '2 of 5 pcs' pada item 1 bundle (isi 2 komponen)."
run_history:
  - run_at: "2026-09-24T21:36:00+07:00"
    status: failed
    via: "manual:OlshopERP"
    jira: "ETM-15893"
    note: "Defect AC-4: Multiple dokumen turunan (SL-xxx, TFI-xxx, SI-xxx) salah rute URL dan memicu error 404 Page Not Found."
  - run_at: "2026-09-30T10:15:00+07:00"
    status: passed
    via: "manual:OlshopERP"
    jira: "ETM-16098"
    note: "Retest PASSED (AC-04): Hyperlink Shipping (SL-xxx) dan Shipping DO (TFI-xxx) valid tanpa error 404. Catatan terpisah: agregat DO bundle terbaca '2 of 5 pcs'."
first_execution:
  at: "2026-09-24T14:38:00+07:00"
  via: "manual:OlshopERP"
  jira: "ETM-15893"
last_execution:
  at: "2026-09-30T10:15:00+07:00"
  jira: "ETM-16098"
  status: passed
  via: "manual:OlshopERP"
---

# TC-SOP-ORDLSC-05: Card Dokumen Transaksi Terkait (Related Transactions) dan Validasi Hyperlink

## Objective
Menguji kelengkapan pemetaan dokumen turunan (*Related Transactions*) pada alur pemrosesan pesanan dan memastikan fungsionalitas navigasi tautan (*hyperlink*) bekerja dengan tepat.

## Catatan QA & Bukti Pengujian (Evidence)
Mengacu pada card **ETM-15893** dan retest pada **ETM-16098** ([Order Lifecycle panel](https://erpintegration.atlassian.net/browse/ETM-16098)).
- Dokumen Uji: `SO-5TBW8NFJ` (Sales Platform berdokumen lengkap).
- Evidence Retest: https://jam.dev/c/450418cc-c552-4385-bc91-cda80770d106

### Hasil Pengujian Retest (ETM-16098):
1. **Kelengkapan Dokumen & Fungsionalitas Hyperlink (AC-4):**
   - *Actual:* Tautan kode dokumen Shipping (`SL-xxx`) dan Shipping DO (`TFI-xxx`) pada section Related Transactions mengarah ke rute detail yang valid dan tidak lagi memicu error 404 ✅.
2. **Catatan Temuan QA (Agregat Delivery Order pada Item Bundle):**
   - Keterangan pada kartu Delivery Order tercatat `2 of 5 pcs` padahal total detail item Sales Order hanya 2 pcs (1 bundle isi 2 komponen). Sistem terindikasi salah menjumlahkan denominator komponen bundle secara ganda.

### Kesimpulan:
**PASSED 🟢 (AC-04 Terpenuhi untuk Navigasi Related Transactions).**  
Navigasi rute dokumen Shipping dan Shipping DO telah diperbaiki. Isu tampilan agregat quantity bundle pada kartu DO dicatat sebagai temuan tindak lanjut.



