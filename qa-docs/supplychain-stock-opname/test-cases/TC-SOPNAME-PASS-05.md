---
doc_type: e2e-test-case
tc_code: TC-SOPNAME-PASS-05
menu: supplychain-stock-opname
menu_name: "Stock Opname"
test_type: edge
title: "Approval Stock Opname dengan Fallback Harga Desimal dari Master Benchmark COGS"
summary: "Memastikan ketika unit price mengambil fallback Benchmark COGS yang bernilai desimal, nilai desimal tetap terjaga (tidak ter-rounding ke 0 atau bilangan bulat) dan dokumen dapat diproses/diapprove tanpa kendala validasi."
status: draft
owner: "QA - Yemima"
last_updated: 2026-09-23
requirement_ref: "qa-docs/supplychain-stock-opname/requirement.md"
automated: false
automated_spec: null
origin_jira: ETM-15968
execution_company:
  id: 13
  code: DEV-STG
related_menus:
  - accounting-stock-opname-approval
  - accounting-product-benchmark-price
test_data:
  - field: "Transaction Code"
    value: "SP-5UJ1Z5O0"
  - field: "SKU"
    value: "COMP-R1"
  - field: "Benchmark COGS"
    value: "100.88"
steps:
  - "1. Pastikan SKU COMP-R1 memiliki nilai Benchmark COGS berupa angka desimal 100,88 di menu Benchmark COGS"
  - "2. Buat dokumen Stock Opname di menu /supplychain/stock-opname dengan item COMP-R1 dan atur jumlah qty (SP-5UJ1Z5O0)"
  - "3. Buka menu Stock Opname Approval (/accounting/stock-opname-approval) dan buka dokumen SP-5UJ1Z5O0"
  - "4. Periksa kolom Unit Price pada tabel detail opname"
  - "5. Lakukan proses Approve pada dokumen Stock Opname"
expected_result: |
  1. Kolom Unit Price otomatis terisi 100,88 mengikuti nilai Benchmark COGS secara presisi tanpa ter-rounding ke 0 atau bilangan bulat.
  2. Dokumen Stock Opname berhasil di-approve tanpa bentrok/penolakan validasi desimal.
test_result:
  status: passed
  started_at: "2026-09-23T12:40:00+07:00"
  finished_at: "2026-09-23T12:56:00+07:00"
  executed_by: "QA - Yemima / OlshopERP"
  environment: staging
  log_summary: "PASSED: Dokumen SP-5UJ1Z5O0 dengan SKU COMP-R1 otomatis mengambil nilai Benchmark COGS desimal 100,88 secara presisi di Stock Opname Approval tanpa ter-rounding dan berhasil di-approve."
  report_url: null
test_data_used:
  - trx_code: "SP-5UJ1Z5O0"
    sku: "COMP-R1"
    benchmark_cogs: 100.88
    actual_unit_price: 100.88
run_history:
  - run_at: "2026-09-18T16:54:00+07:00"
    status: failed
    via: "manual:QA - Jeiniffer"
    jira: "ETM-15968"
    note: "Benchmark COGS 0,88 rounded to 0 on detail opname SP-5UHA7QBP"
  - run_at: "2026-09-23T12:56:00+07:00"
    status: passed
    via: "manual:OlshopERP"
    jira: "ETM-15982"
first_execution:
  at: "2026-09-18T16:54:00+07:00"
  via: "manual:QA - Jeiniffer"
  jira: "ETM-15968"
last_execution:
  at: "2026-09-23T12:56:00+07:00"
  jira: "ETM-15982"
  status: passed
  via: "manual:OlshopERP"
---

# TC-SOPNAME-PASS-05: Approval Stock Opname dengan Fallback Harga Desimal dari Master Benchmark COGS

## Catatan QA & Referensi Data Testing (Evidence)
Mengacu pada parent card re-open **ETM-15982** (asal: **ETM-15968**).
- Jira Card: [ETM-15982](https://erpintegration.atlassian.net/browse/ETM-15982) (`REOPEN [Stock Opname Approval] Lakukan penyesuaian pada kolom unit price agar user dapat input nilai desimal 2 angka dibelakang koma`).
- Company: **Dev Staging (DEV-STG, ID: 13)**.

### Bukti Eksekusi (Actual Result)
- **Produk / SKU:** `COMP-R1`
- **Master Benchmark COGS:** `100,88` (di-set via import di menu Benchmark COGS).
- **Dokumen Stock Opname:** `SP-5UJ1Z5O0`
- **Aksi:** SKU `COMP-R1` ditambahkan ke dokumen Stock Opname baru dengan qty surplus, dokumen dibuka di menu **Stock Opname Approval**, lalu dilakukan proses **Approve**.
- **Hasil:** Kolom Unit Price langsung terisi otomatis **100,88** sesuai nilai master Benchmark COGS, dan dokumen `SP-5UJ1Z5O0` **berhasil di-approve** tanpa penolakan/error validasi desimal ✅.
- **Kesimpulan:** **PASSED**. Isu sebelumnya di mana nilai Benchmark COGS berkoma desimal (seperti `0,88`) ter-rounding menjadi `0` di detail Stock Opname Approval kini telah teratasi dengan baik. Sistem berhasil mempertahankan presisi nilai desimal 2 angka di belakang koma dari master Benchmark COGS dan approval berhasil tuntas.
