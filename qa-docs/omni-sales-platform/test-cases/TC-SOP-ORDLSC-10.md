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
  status: failed
  started_at: "2026-09-30T10:00:00+07:00"
  finished_at: "2026-09-30T10:15:00+07:00"
  executed_by: "OlshopERP (resty)"
  environment: staging
  log_summary: "FAILED (DESINKRONISASI STATUS & DATA RETUR): Endpoint /lifecycle sudah tidak lagi error 500 saat order berelasi dengan Sales Return. Namun ditemukan defect baru: (1) Header invoice status terbaca 'UNPAID' dan Customer & Terms '0 of 333.000 already paid' padahal sales invoice sudah dibayar lunas, (2) Section Returns menampilkan 'None' padahal ada riwayat retur, (3) Related Transactions kurang informasi qty retur, dan (4) Timeline order lifecycle hanya mengambil 'restock qty' bukannya 'total return qty' (melanggar AC-13)."
  report_url: "https://jam.dev/c/5f54355a-ea98-4151-b3c2-688c631c3e06"
test_data_used:
  - trx_code: "SO-5T35VYJO"
    sr_code: "SR-5T35ZFS4"
    actual_defects:
      - "Invoice & Payment Term status: Header invoice status 'UNPAID' dan Payment Term '0 of 333.000 already paid' padahal SI sudah lunas."
      - "Returns section: Menampilkan 'None. A return would be capped at the 6 pcs already delivered.' padahal ada riwayat return."
      - "Related Transactions - Exception: Kode SR-5T35ZFS4 bisa diklik tapi belum memuat informasi total return quantity."
      - "Timeline return quantity: Mengambil 'restock qty' bukannya 'total return qty'."
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
    note: "Retest FAILED (AC-13): Error 500 resolved, namun status invoice terbaca UNPAID, section Returns terbaca None, dan timeline salah ambil restock qty bukan total return qty."
first_execution:
  at: "2026-09-24T21:48:00+07:00"
  via: "manual:OlshopERP"
  jira: "ETM-15893"
last_execution:
  at: "2026-09-30T10:15:00+07:00"
  jira: "ETM-16098"
  status: failed
  via: "manual:OlshopERP"
---

# TC-SOP-ORDLSC-10: Penanganan Retur Pasca-Settlement dan Pembentukan Credit Note (CN) pada Money Trail

## Objective
Menguji integritas data pencatatan pengembalian barang pasca-penyelesaian transaksi (*Sales Return post-settlement*) dan verifikasi pembentukan Credit Note pada jejak audit keuangan (*Money Trail*) sesuai AC-13.

## Catatan QA & Bukti Pengujian (Evidence)
Mengacu pada card **ETM-15893** dan retest pada **ETM-16098** ([Order Lifecycle panel](https://erpintegration.atlassian.net/browse/ETM-16098)).
- Dokumen Uji: `SO-5T35VYJO`
- Dokumen Sales Return: `SR-5T35ZFS4` (SO Qty: 6, Restock: 4, Broken: 2, Total Return: 6).
- Evidence Retest: https://jam.dev/c/5f54355a-ea98-4151-b3c2-688c631c3e06

### Hasil Pengujian Retest (ETM-16098):
1. **Endpoint Lifecycle:** Request endpoint `/lifecycle` tidak lagi crash (HTTP 500 teratasi) ✅.
2. **Desinkronisasi Status Pembayaran Invoice:**
   - *Actual:* Header menampilkan invoice status **'UNPAID'** dan card Customer & Terms menampilkan **'Cash upon receipt 0 of 333.000 already paid'**, padahal faktur penjualan (Sales Invoice) sudah berstatus approved dan dibayar lunas sebelum sales return dibuat ❌.
   - *Expected:* Status pelunasan faktur penjualan harus tetap mencerminkan status pembayaran riil (**PAID**), sedangkan retur diproses melalui Credit Note / refund di Money Trail.
3. **Pencatatan Section Returns:**
   - *Actual:* Section Returns mencatat *"None. A return would be capped at the 6 pcs already delivered."* padahal pesanan memiliki riwayat Sales Return ❌.
4. **Kuantitas Retur di Related Transactions & Timeline:**
   - *Actual:* Pada Related Transactions (Exception) tautan kode SR berhasil dibuka namun belum memuat informasi kuantitasnya. Pada Order Lifecycle Timeline, jumlah yang diambil hanya *restock qty* (4 pcs) ❌.
   - *Expected:* Kuantitas retur pada timeline dan related transaction wajib mengacu pada **Total Return Qty** (6 pcs = Restock 4 + Broken 2).

### Kesimpulan:
**FAILED ❌ (Defect AC-13 — Payment Status Desynchronization & Incomplete Return Quantities).**  
Error 500 telah berhasil diperbaiki, namun status pembayaran ter-reset menjadi UNPAID pada pesanan yang sudah lunas, section Returns belum mendeteksi dokumen retur yang ada, serta timeline salah menghitung kuantitas retur menggunakan restock qty bukan total return qty.

