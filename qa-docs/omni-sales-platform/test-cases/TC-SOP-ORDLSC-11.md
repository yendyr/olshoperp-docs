---
doc_type: e2e-test-case
tc_code: TC-SOP-ORDLSC-11
menu: omni-sales-platform
menu_name: "Dev - Sales Platform"
test_type: edge
title: "Penanganan Selisih Pembayaran (Under/Overpayment) dengan Penyesuaian Adjustment dan Debit/Credit Note pada Kartu AR"
summary: "Memastikan order yang mengalami pembayaran kurang (underpayment) atau pembayaran lebih (overpayment) mencatat kartu penyesuaian (Adjustment) beserta Debit Note (DN) atau Credit Note (CN) pada kartu Account Receivable (AR)."
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
  status: passed
  started_at: "2026-09-30T10:00:00+07:00"
  finished_at: "2026-09-30T10:15:00+07:00"
  executed_by: "OlshopERP (resty)"
  environment: staging
  log_summary: "PASSED: Nilai paid sudah tersinkronisasi di seluruh komponen (Money Trail, Timeline, Related Transactions, Customer & Terms), hyperlink RC-5UJK6WB8 valid dan tidak 404, formula strip Money berakhir di Outstanding receivable (Rp25.000) memenuhi AC-04, AC-08, AC-09, AC-14."
  report_url: "https://drive.google.com/file/d/1rSef5QpcxlXcH33QW-d3Y3OyuMNoGrZY/view?usp=drive_link"
test_data_used:
  - trx_code_general: "SO-5UJF5WID"
    si_code: "SI-5UJF7JZO (Rp55.000)"
    rc_code: "RC-5UJK6WB8 (Paid Rp30.000)"
    evidence_sync_money_trail: "https://drive.google.com/file/d/1rSef5QpcxlXcH33QW-d3Y3OyuMNoGrZY/view?usp=drive_link"
    evidence_sync_timeline: "https://drive.google.com/file/d/13vOop-Go7ae8Ti8jSfYdxE6SVTzctlna/view?usp=drive_link"
    evidence_sync_related_tx: "https://drive.google.com/file/d/1Mi2VUe4IJTxaiYB618E6zS_fxusvLkZy/view?usp=drive_link"
    evidence_sync_customer_terms: "https://drive.google.com/file/d/1Fjp9EuGrK17iUqQV_kBDP1SNI-7Yp57q/view?usp=drive_link"
    evidence_strip_money: "https://drive.google.com/file/d/1jlxOgTuYJDQiBusi73NxAFNGypBRGOzo/view?usp=drive_link"
run_history:
  - run_at: "2026-09-24T22:15:00+07:00"
    status: failed
    via: "manual:OlshopERP"
    jira: "ETM-15893"
    note: "Defect AC-4, AC-8, AC-9, AC-14: Broken route RC 404, salah logika money strip general, dan desinkronisasi data payment di Timeline & Customer Terms."
  - run_at: "2026-09-30T10:15:00+07:00"
    status: passed
    via: "manual:OlshopERP"
    jira: "ETM-16098"
    note: "Retest PASSED (AC-04, AC-08, AC-09, AC-14): Nilai paid sinkron di semua section, link RC valid tanpa 404, formula strip Money berakhir di Outstanding receivable."
first_execution:
  at: "2026-09-24T22:15:00+07:00"
  via: "manual:OlshopERP"
  jira: "ETM-15893"
last_execution:
  at: "2026-09-30T10:15:00+07:00"
  jira: "ETM-16098"
  status: passed
  via: "manual:OlshopERP"
---

# TC-SOP-ORDLSC-11: Penanganan Selisih Pembayaran (Under/Overpayment) dengan Penyesuaian Adjustment dan Debit/Credit Note pada Card AR

## Objective
Menguji penanganan rekonsiliasi pembayaran piutang pada kondisi kurang bayar (underpayment) atau selisih bayar sesuai AC-14, memastikan pencatatan adjustment, sinkronisasi nilai di seluruh panel, dan navigasi hyperlink dokumen tanda terima pembayaran (Receipt/Payment).

## Catatan QA & Bukti Pengujian (Evidence)
Mengacu pada card **ETM-15893** dan retest pada **ETM-16098** ([Order Lifecycle panel](https://erpintegration.atlassian.net/browse/ETM-16098)).
- Dokumen Uji: `SO-5UJF5WID` (SO General)
- Dokumen Tagihan: `SI-5UJF7JZO` (Total Invoice: Rp55.000)
- Dokumen Pembayaran AR: `RC-5UJK6WB8` (Paid Amount: Rp30.000, Approved).

### Hasil Pengujian Retest (ETM-16098):
1. **Fungsionalitas Hyperlink Customer Receipt (`RC-xxx`):** Tautan kode dokumen `RC-5UJK6WB8` berhasil dibuka ke rute pembayaran yang valid tanpa error 404 ✅.
2. **Sinkronisasi Data Pembayaran Lintas Section (AC-9, AC-14):**
   - Nilai paid telah sinkron tercatat Rp30.000 pada:
     - **Money Trail:** https://drive.google.com/file/d/1rSef5QpcxlXcH33QW-d3Y3OyuMNoGrZY/view?usp=drive_link ✅
     - **Timeline:** https://drive.google.com/file/d/13vOop-Go7ae8Ti8jSfYdxE6SVTzctlna/view?usp=drive_link ✅
     - **Related Transactions:** https://drive.google.com/file/d/1Mi2VUe4IJTxaiYB618E6zS_fxusvLkZy/view?usp=drive_link ✅
     - **Customer & Terms:** https://drive.google.com/file/d/1Fjp9EuGrK17iUqQV_kBDP1SNI-7Yp57q/view?usp=drive_link ✅
3. **Kalkulasi Strip Money SO General (AC-8):**
   - Formula strip Money berakhir pada **Outstanding receivable = Rp25.000** (Invoice Rp55.000 − Paid Rp30.000): https://drive.google.com/file/d/1jlxOgTuYJDQiBusi73NxAFNGypBRGOzo/view?usp=drive_link ✅.

### Kesimpulan:
**PASSED 🟢 (AC-04, AC-08, AC-09, AC-14 Terpenuhi).**  
Navigasi rute penerimaan pembayaran telah aktif, formula saldo piutang B2B tepat, dan nilai pelunasan tersinkronisasi sempurna pada seluruh section panel.

