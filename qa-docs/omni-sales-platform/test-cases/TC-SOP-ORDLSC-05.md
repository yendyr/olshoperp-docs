---
doc_type: e2e-test-case
tc_code: TC-SOP-ORDLSC-05
menu: omni-sales-platform
menu_name: "Dev - Sales Platform"
test_type: happy
title: "Kartu Dokumen Transaksi Terkait (Related Transactions) dan Validasi Hyperlink"
summary: "Memastikan seluruh dokumen turunan yang sudah terbentuk (Delivery Order, Outbound, Sales Invoice, Retur, Settlement) tampil lengkap di section Related Transactions dengan hyperlink navigasi yang valid."
status: draft
owner: "QA - Yemima"
last_updated: 2026-09-24
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
  status: failed
  started_at: "2026-09-24T13:35:00+07:00"
  finished_at: "2026-09-24T21:36:00+07:00"
  executed_by: "OlshopERP (resty)"
  environment: staging
  log_summary: "FAILED: Dokumen turunan tampil lengkap pada section Related Transactions dan memiliki hyperlink. Namun saat diklik, beberapa tautan dokumen mengalami salah rute (wrong route) sehingga memicu halaman error 404 'We couldn't find the page you were looking for.', yaitu pada dokumen Shipping (SL-xxx), Shipping DO (TFI-xxx), dan Sales Invoice (SI-xxx) yang salah path (melanggar AC-4)."
  report_url: "https://app.betterbugs.io/session/6ab4d2fa587953ccdcfdb298"
test_data_used:
  - trx_code_platform: "SO-5TBW8NFJ"
    actual_related_transactions: "Dokumen turunan lengkap terdaftar (DO, Outbound, SI, Shipping, TFI). Namun tautan dokumen Shipping (SL-xxx), Shipping DO (TFI-xxx), dan Sales Invoice (SI-xxx) salah route dan menghasilkan error 404."
    expected: "Kode dokumen memiliki hyperlink aktif yang membuka URL valid tanpa memicu 404 (AC-4)."
run_history:
  - run_at: "2026-09-24T21:36:00+07:00"
    status: failed
    via: "manual:OlshopERP"
    jira: "ETM-15893"
    note: "Defect AC-4: Multiple dokumen turunan (SL-xxx, TFI-xxx, SI-xxx) salah rute URL dan memicu error 404 Page Not Found."
first_execution:
  at: "2026-09-24T14:38:00+07:00"
  via: "manual:OlshopERP"
  jira: "ETM-15893"
last_execution:
  at: "2026-09-24T21:36:00+07:00"
  jira: "ETM-15893"
  status: failed
  via: "manual:OlshopERP"
---

# TC-SOP-ORDLSC-05: Card Dokumen Transaksi Terkait (Related Transactions) dan Validasi Hyperlink

## Objective
Menguji kelengkapan pemetaan dokumen turunan (*Related Transactions*) pada alur pemrosesan pesanan dan memastikan fungsionalitas navigasi tautan (*hyperlink*) bekerja dengan tepat.

## Catatan QA & Bukti Pengujian (Evidence)
Mengacu pada card **ETM-15893** ([Order Lifecycle panel](https://erpintegration.atlassian.net/browse/ETM-15893)).
- Dokumen Uji: `SO-5TBW8NFJ` (Sales Platform berdokumen lengkap).
- Evidence Session: 
  - Hyperlink Presentation: [BetterBugs Session 6ab4d2fa](https://app.betterbugs.io/session/6ab4d2fa587953ccdcfdb298)
  - Broken Route 404 Evidence: [BetterBugs Session 6ab533f7](https://app.betterbugs.io/session/6ab533f79a0216b8a623a429) & [BetterBugs Session 6ab53465](https://app.betterbugs.io/session/6ab534659a0216b8a623a433)

### Hasil Pengujian (Actual vs Expected):
1. **Kelengkapan Dokumen:**
   - *Actual:* Dokumen turunan yang terbentuk terdaftar lengkap di card *Related Transactions* (Delivery Order, Outbound, Sales Invoice, Shipping, dsb) ✅.
2. **Fungsionalitas Hyperlink (AC-4):**
   - *Actual:* Tautan kode dokumen aktif, namun saat diklik mengarah ke rute yang salah (*wrong route*) dan memicu halaman error 404 *"We couldn't find the page you were looking for"*, terjadi pada:
     - Dokumen Shipping (`SL-xxx`) ❌
     - Dokumen Shipping DO (`TFI-xxx`) ❌
     - Dokumen Sales Invoice (`SI-xxx`) $\rightarrow$ mengarah ke `/finance/sales-invoice/edit/{id}` bukan `/accounting/customer-invoice/{id}` ❌.
   - *Expected:* Mengacu pada spesifikasi AC-4 (`Kode dokumen → URL benar; tanpa permission → plain text`), dokumen seharusnya memiliki tautan navigasi aktif ke URL halaman dokumen yang tepat tanpa error 404.

### Kesimpulan:
**FAILED ❌ (Defect AC-4 — Multiple Broken Routes 404 on Related Transactions Hyperlinks).**  
Tautan kode dokumen turunan pada card *Related Transactions* mengalami *broken route* (404 Page Not Found) untuk dokumen Shipping (`SL-xxx`), Shipping DO (`TFI-xxx`), dan Sales Invoice (`SI-xxx`).



