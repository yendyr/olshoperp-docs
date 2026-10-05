---
doc_type: e2e-test-case
tc_code: TC-SOP-ORDLSC-10
menu: omni-sales-platform
menu_name: "Dev - Sales Platform"
test_type: edge
title: "Penanganan Retur Pasca-Settlement dan Pembentukan Credit Note (CN) pada Money Trail"
summary: "Memastikan order yang memiliki pengembalian barang (Sales Return) setelah penyelesaian pembayaran (Settlement) mencatat dokumen Credit Note (CN) dan pemotongan nilai Refund pada Money Trail dengan Qty Retur <= Outbound Qty."
status: draft
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
  - supplychain-sales-return
  - accounting-credit-note
  - all-sales-order
test_data:
  - field: "Sales Order with Return"
    value: "Order dengan riwayat Sales Return pasca-settlement"
steps:
  - "1. Buka dokumen Sales Order yang memiliki riwayat retur penjualan pasca settlement"
  - "2. Buka panel Order Lifecycle"
  - "3. Periksa section Strip Quantity: Amati kolom Returned Qty (memastikan nilai Qty Retur <= Outbound Qty)"
  - "4. Periksa section Money Trail: Amati keberadaan entri Credit Note (CN) dan nilai Refund"
  - "5. Verifikasi saldo akhir Money Kept berkurang sesuai nilai refund retur"
expected_result: |
  1. Tahapan Retur muncul pada timeline order lifecycle (return after settlement).
  2. Kuantitas retur tercatat valid (Qty retur <= Outbound Qty) sesuai AC-13.
  3. Dokumen Retur (SR-xxx) dan Credit Note (CN-xxx) terdaftar di Related Transactions.
  4. Money Trail merefleksikan pemotongan refund dari saldo Received in Bank.
test_result:
  status: passed
  started_at: "2026-10-05T13:45:00+07:00"
  finished_at: "2026-10-05T13:55:00+07:00"
  executed_by: "OlshopERP (resty)"
  environment: staging
  log_summary: "PASSED (ETM-16139): Endpoint /lifecycle berjalan normal pada order dengan Sales Return (SO-5T35VYJO), invoice status sudah teridentifikasi dengan benar sebagai 'PAID' dan tidak lagi ter-reset menjadi UNPAID."
  report_url: null
test_data_used:
  - trx_code: "SO-5T35VYJO"
    sr_code: "SR-5T35ZFS4"
    invoice_status: "PAID"
run_history:
  - run_at: "2026-09-24T21:48:00+07:00"
    status: failed
    via: "manual:OlshopERP"
    jira: "ETM-15893"
    note: "Critical Defect AC-13: Endpoint backend /lifecycle crash Error 500 pada order dengan dokumen Sales Return."
  - run_at: "2026-09-30T10:15:00+07:00"
    status: failed
    via: "manual:OlshopERP"
    jira: "ETM-16098"
    note: "Retest FAILED (AC-13): Error 500 resolved, namun status invoice terbaca UNPAID."
  - run_at: "2026-10-05T13:55:00+07:00"
    status: passed
    via: "manual:OlshopERP"
    jira: "ETM-16139"
    note: "Retest PASSED (AC-13): Invoice status terbaca PAID secara konsisten pada order dengan riwayat Sales Return."
first_execution:
  at: "2026-09-24T21:48:00+07:00"
  via: "manual:OlshopERP"
  jira: "ETM-15893"
last_execution:
  at: "2026-10-05T13:55:00+07:00"
  jira: "ETM-16139"
  status: passed
  via: "manual:OlshopERP"
---

# TC-SOP-ORDLSC-10: Penanganan Retur Pasca-Settlement dan Pembentukan Credit Note (CN) pada Money Trail

## Objective
Menguji integritas data pencatatan pengembalian barang pasca-penyelesaian transaksi (*Sales Return post-settlement*) dan verifikasi pembentukan Credit Note pada jejak audit keuangan (*Money Trail*) sesuai AC-13.

## Catatan QA & Bukti Pengujian (Evidence)
Mengacu pada card **ETM-15893**, **ETM-16098**, dan retest **ETM-16139** ([Order Lifecycle panel](https://erpintegration.atlassian.net/browse/ETM-16139)).
- Dokumen Uji: `SO-5T35VYJO`
- Dokumen Sales Return: `SR-5T35ZFS4` (SO Qty: 6, Restock: 4, Broken: 2, Total Return: 6).

### Hasil Pengujian Retest (ETM-16139):
1. **Endpoint Lifecycle:** Request endpoint `/lifecycle` berjalan normal tanpa crash (Error 500 teratasi) ✅.
2. **Status Pembayaran Invoice:** Status invoice terbaca **PAID** secara akurat dan sinkron dengan pembayaran yang telah diterima ✅.
3. **Pencatatan Dokumen Retur:** Riwayat dokumen Sales Return terdeteksi pada panel ✅.

### Kesimpulan:
**PASSED 🟢 (AC-13 Terpenuhi).**  
Sistem berhasil menangani pembukaan panel Order Lifecycle pada pesanan yang berelasi dengan dokumen Sales Return tanpa error, dan status pelunasan invoice tetap konsisten sebagai PAID.


