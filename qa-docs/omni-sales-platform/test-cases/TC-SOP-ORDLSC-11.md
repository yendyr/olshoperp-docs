---
doc_type: e2e-test-case
tc_code: TC-SOP-ORDLSC-11
menu: omni-sales-platform
menu_name: "Dev - Sales Platform"
test_type: edge
title: "Penanganan Selisih Pembayaran (Under/Overpayment) dengan Penyesuaian Adjustment dan Debit/Credit Note pada Kartu AR"
summary: "Memastikan order yang mengalami pembayaran kurang (underpayment) atau pembayaran lebih (overpayment) mencatat kartu penyesuaian (Adjustment) beserta Debit Note (DN) atau Credit Note (CN) pada kartu Account Receivable (AR)."
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
  - accounting-customer-invoice
  - accounting-credit-note
  - accounting-debit-note
  - all-sales-order
test_data:
  - field: "Sales Order with Payment Adjustment"
    value: "Order General atau Platform dengan selisih pembayaran AR"
steps:
  - "1. Buka dokumen Sales Order yang memiliki transaksi pelunasan parsial / overpayment / underpayment"
  - "2. Buka panel Order Lifecycle"
  - "3. Gulir ke section Money Trail / Kartu AR (Account Receivable)"
  - "4. Periksa apakah terdapat rincian Adjustment jika terjadi pembulatan atau selisih bayar"
  - "5. Periksa apakah dokumen DN atau CN terkait tercatat di kartu AR"
expected_result: |
  1. Pada kasus underpayment/overpayment, kartu AR menampilkan baris Adjustment dengan nominal yang akurat sesuai AC-14.
  2. Dokumen Debit Note (DN) atau Credit Note (CN) terhubung secara tepat pada transaksi pelunasan.
  3. Total tagihan terbayar dan sisa piutang (Outstanding receivable) terhitung akurat tanpa selisih pembulatan (no drift).
test_result:
  status: failed
  started_at: "2026-09-24T22:00:00+07:00"
  finished_at: "2026-09-24T22:15:00+07:00"
  executed_by: "OlshopERP (resty)"
  environment: staging
  log_summary: "FAILED: Pada SO General SO-5UJF5WID (Invoice SI-5UJF7JZO 55.000, Receipt RC-5UJK6WB8 30.000), ditemukan rangkaian defect kritis: (1) Broken route 404 pada hyperlink RC-5UJK6WB8 (salah path ke /finance/.. bukannya /accounting/customer-payment/edit/{id}), (2) Strip Money salah logika persona B2B: menampilkan 'money kept from this order = 30.000' bukannya 'Outstanding receivable = 25.000', dan (3) Desinkronisasi data pembayaran di mana Timeline, Related Transactions, dan card Payment Term masih membaca 0 / '0 of 55.000 already paid' bukannya 30.000 (melanggar AC-4, AC-7, AC-8, AC-9, AC-14)."
  report_url: "https://app.betterbugs.io/session/6ab540699a0216b8a623a4ae"
test_data_used:
  - trx_code_general: "SO-5UJF5WID"
    si_code: "SI-5UJF7JZO (Rp55.000)"
    rc_code: "RC-5UJK6WB8 (Paid Rp30.000)"
    actual_defects:
      - "Routing Hyperlink RC: Klik RC-5UJK6WB8 memicu error 404 'We couldn't find the page you were looking for'."
      - "Formula Strip Money: Berakhir di 'money kept = 30.000' (seharusnya: Outstanding receivable = 25.000)."
      - "Desinkronisasi Timeline Payment: 'received in the bank' tertulis 0 (seharusnya 30.000)."
      - "Desinkronisasi Related Transactions: Tertulis 'IDR 0 received' (seharusnya 30.000)."
      - "Desinkronisasi Customer & Terms: Card Payment Term tertulis '0 of 55.000 already paid' (seharusnya 30.000 of 55.000)."
run_history:
  - run_at: "2026-09-24T22:15:00+07:00"
    status: failed
    via: "manual:OlshopERP"
    jira: "ETM-15893"
    note: "Defect AC-4, AC-8, AC-9, AC-14: Broken route RC 404, salah logika money strip general, dan desinkronisasi data payment di Timeline & Customer Terms."
first_execution:
  at: "2026-09-24T22:15:00+07:00"
  via: "manual:OlshopERP"
  jira: "ETM-15893"
last_execution:
  at: "2026-09-24T22:15:00+07:00"
  jira: "ETM-15893"
  status: failed
  via: "manual:OlshopERP"
---

# TC-SOP-ORDLSC-11: Penanganan Selisih Pembayaran (Under/Overpayment) dengan Penyesuaian Adjustment dan Debit/Credit Note pada Card AR

## Objective
Menguji penanganan rekonsiliasi pembayaran piutang pada kondisi kurang bayar (underpayment) atau selisih bayar sesuai AC-14, memastikan pencatatan adjustment, sinkronisasi nilai di seluruh panel, dan navigasi hyperlink dokumen tanda terima pembayaran (Receipt/Payment).

## Catatan QA & Bukti Pengujian (Evidence)
Mengacu pada card **ETM-15893** ([Order Lifecycle panel](https://erpintegration.atlassian.net/browse/ETM-15893)).
- Dokumen Uji: `SO-5UJF5WID` (SO General)
- Dokumen Tagihan: `SI-5UJF7JZO` (Total Invoice: Rp55.000)
- Dokumen Pembayaran AR: `RC-5UJK6WB8` (Paid Amount: Rp30.000, Approved).
- Evidence Session: [BetterBugs Session 6ab54069](https://app.betterbugs.io/session/6ab540699a0216b8a623a4ae)

### Temuan Defect Hasil Pengujian:
1. **Broken Route 404 pada Hyperlink Customer Receipt (`RC-xxx`):**
   - *Actual:* Ketika tautan dokumen `RC-5UJK6WB8` diklik pada Money Trail maupun strip Money, sistem mengarah ke rute yang salah sehingga muncul halaman error 404 *"We couldn't find the page you were looking for"* ❌.
   - *Expected:* Mengacu pada AC-4, tautan seharusnya mengarah ke URL valid modul penerimaan pembayaran di OlshopERP: `https://staging.olshoperp.com/accounting/customer-payment/edit/{id}`.
2. **Kalkulasi Strip Money SO General Salah Logika & Persona:**
   - *Actual:* Strip Money menampilkan card *"received in bank"* Rp30.000 dan berujung pada *"money kept from this order = 30.000"* ❌.
   - *Expected:* Sesuai kriteria persona General (B2B) pada AC-8:
     $$\text{Order} - \text{Not Yet Invoiced} = \text{Invoiced} - \text{Paid} = \text{Outstanding Receivable}$$
     Seharusnya kartu akhir bernilai **Outstanding receivable = Rp25.000** (Rp55.000 tagihan dikurangi Rp30.000 terbayar). Menampilkan "money kept = 30.000" adalah logika keliru untuk piutang B2B.
3. **Desinkronisasi Nilai Pembayaran di Timeline, Related Transactions, dan Customer & Terms:**
   - *Actual:*
     - Pada section **Timeline** (settlement & payment): baris *payment received in the bank* tertulis nominal **0** ❌.
     - Pada section **Related Transactions**: baris penerimaan tertulis **"IDR 0 received"** ❌.
     - Pada section **Customer & Terms**: card Payment Term tertulis **"0 of 55.000 already paid"** ❌.
   - *Expected:* Seluruh section di atas harus sinkron membaca pembayaran yang telah disetujui (`RC-5UJK6WB8` sebesar Rp30.000), bukan membaca 0.

### Kesimpulan:
**FAILED ❌ (Defect AC-4, AC-8, AC-9, AC-14 — Broken Route RC, Wrong Money Strip Logic, and Payment Data Desynchronization).**  
Sistem mengalami kegagalan navigasi pada dokumen penerimaan pembayaran, salah menerapkan logika sisa piutang B2B, dan mengalami desinkronisasi data pembayaran di 3 section berbeda.

