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
last_updated: 2026-09-24
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
  started_at: "2026-09-24T21:40:00+07:00"
  finished_at: "2026-09-24T21:48:00+07:00"
  executed_by: "OlshopERP (resty)"
  environment: staging
  log_summary: "FAILED (CRITICAL ERROR 500): Saat membuka panel Order Lifecycle pada order ber-Sales Return SO-5T35VYJO (dokumen SR-5T35ZFS4), slideover gagal memuat data dengan pesan 'failed to load lifecycle data. please try again later'. Hasil inspect jaringan menunjukkan endpoint backend /lifecycle menghasilkan HTTP 500 Internal Server Error (Tercatat di Laravel log-viewer index 5248). Fitur Order Lifecycle crash saat memproses pesanan yang memiliki retur penjualan (melanggar AC-13)."
  report_url: "https://app.betterbugs.io/session/6ab538159a0216b8a623a471"
test_data_used:
  - trx_code: "SO-5T35VYJO"
    sr_code: "SR-5T35ZFS4"
    sr_details: "SO Qty = 6, Restock Qty = 4, Broken Items = 2, Total Return Qty = 6"
    actual_behavior: "Slideover menampilkan 'failed to load lifecycle data. please try again later', endpoint /lifecycle crash dengan status HTTP 500."
    log_viewer: "https://api.staging.olshoperp.com/log-viewer?file=097fd301-laravel-2026-09-24.log&query=log-index%3A5248"
run_history:
  - run_at: "2026-09-24T21:48:00+07:00"
    status: failed
    via: "manual:OlshopERP"
    jira: "ETM-15893"
    note: "Critical Defect AC-13: Endpoint backend /lifecycle crash Error 500 pada order dengan dokumen Sales Return."
first_execution:
  at: "2026-09-24T21:48:00+07:00"
  via: "manual:OlshopERP"
  jira: "ETM-15893"
last_execution:
  at: "2026-09-24T21:48:00+07:00"
  jira: "ETM-15893"
  status: failed
  via: "manual:OlshopERP"
---

# TC-SOP-ORDLSC-10: Penanganan Retur Pasca-Settlement dan Pembentukan Credit Note (CN) pada Money Trail

## Objective
Menguji integritas data pencatatan pengembalian barang pasca-penyelesaian transaksi (*Sales Return post-settlement*) dan verifikasi pembentukan Credit Note pada jejak audit keuangan (*Money Trail*) sesuai AC-13.

## Catatan QA & Bukti Pengujian (Evidence)
Mengacu pada card **ETM-15893** ([Order Lifecycle panel](https://erpintegration.atlassian.net/browse/ETM-15893)).
- Dokumen Uji: `SO-5T35VYJO`
- Dokumen Sales Return: `SR-5T35ZFS4` (SO Qty: 6, Restock: 4, Broken: 2, Total Return: 6).
- Evidence Session: [BetterBugs Session 6ab53815](https://app.betterbugs.io/session/6ab538159a0216b8a623a471)
- Log Viewer Error: [Laravel Log Index 5248](https://api.staging.olshoperp.com/log-viewer?file=097fd301-laravel-2026-09-24.log&query=log-index%3A5248)

### Hasil Pengujian (Actual vs Expected):
1. **Pemuatan Panel Order Lifecycle pada Order dengan Sales Return:**
   - *Actual:* Slideover gagal memuat data dan menampilkan pesan *"failed to load lifecycle data. please try again later"*. Pemeriksaan tab Network menunjukkan request endpoint backend `.../lifecycle` mengalami crash dengan response **HTTP 500 Internal Server Error** ❌.
   - *Expected:* Mengacu pada kriteria AC-13, panel Order Lifecycle seharusnya mampu memproses dan menampilkan data alur pesanan yang memiliki dokumen Sales Return tanpa terjadi crash / error 500.

### Kesimpulan:
**FAILED ❌ (Critical Blocker Defect AC-13 — Backend 500 Internal Server Error on Sales Return).**  
Endpoint backend Order Lifecycle crash (HTTP 500) ketika mengakses pesanan yang memiliki keterkaitan dengan dokumen Sales Return, sehingga seluruh panel gagal dimuat.

