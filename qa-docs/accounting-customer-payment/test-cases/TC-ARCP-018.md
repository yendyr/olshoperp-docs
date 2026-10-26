---
doc_type: e2e-test-case
tc_code: TC-ARCP-018
menu: accounting-customer-payment
menu_name: "Account Receive"
test_type: cross-menu
title: "Import Account Receive dengan Credit Note dari Sales Return memakai akun Deposit of Sales Return (cross-menu)"
summary: "Import AR mengikuti aturan COA yang sama dengan input manual: baris CN SR → Deposit of Sales Return, CN manual → Customer's Deposit, CN overpay hasil import → Customer's Deposit."
status: draft
owner: QA - Yemima
last_updated: 2026-10-26
requirement_ref: "card ETM-16764 (CN asal Sales Return memakai Deposit of Sales Return; CN lain memakai Customer's Deposit)"
automated: false
automated_spec: null
execution_company:
  id: 13
  code: DEV-STG
related_menus:
  - accounting-credit-note
  - general-ledger
preconditions:
  - "Akun uji QA dengan akses menu Account Receive (Finance and Accounting → Account Receive). Login di https://staging.olshoperp.com/login."
  - "Company aktif Dev Staging (avatar → Switch Company → Dev Staging → Proceed)."
  - "Perbaikan ETM-16764 sudah ada di Staging: 'Last API build' di footer lebih baru dari 23-10-2026 16:40:37 (pada build itu perilaku masih logika lama)."
  - "Customer uji PT Nusa Jaya Abadi (NJA, company id 14): Customer's Deposit COA = 2-20104 Uang Muka Penjualan, Deposit of Sales Return = 4-40103 Retur Penjualan (cek di Master Data customer / setting COA company)."
  - "CN asal SR dan CN manual Approved bersaldo untuk NJA."
test_data:
  - field: "Data uji / File import"
    value: "1 baris CN Sales Return, 1 baris CN manual, 1 baris overpay (menghasilkan CN baru)"
steps:
  - "Upload file import Account Receive, cek hasil validasi. Cek: Validasi menampilkan akun sesuai asal CN."
  - "Proses import sampai selesai, buka AR hasil import. Cek: CN SR 4-40103, CN manual 2-20104."
  - "Buka jurnal di General Ledger; buka CN overpay hasil import, approve, cek jurnal. Cek: Jurnal konsisten dengan validasi; CN overpay memakai 2-20104."
expected_result: |
  1. Baris CN Sales Return mendebit Deposit of Sales Return, CN manual mendebit Customer's Deposit.
  2. CN overpay hasil import memakai Customer's Deposit.
  3. Tidak ada selisih akun antara validasi dan jurnal.
test_result:
  status: not_run
  started_at: null
  finished_at: null
  executed_by: null
  environment: staging
  log_summary: null
  report_url: null
test_data_used: []
run_history: []
origin_jira: ETM-16764
first_execution:
  at: null
  via: null
  jira: null
last_execution:
  at: null
  jira: null
  status: not_run
  via: null
---

# Import Account Receive dengan Credit Note dari Sales Return memakai akun Deposit of Sales Return (cross-menu)

Card: [ETM-16789](https://erpintegration.atlassian.net/browse/ETM-16789) (Test Case, cross-menu) · card asal: [ETM-16764](https://erpintegration.atlassian.net/browse/ETM-16764)

## Data uji dari awal sampai akhir

Prasyarat umum:
- Akun uji QA dengan akses menu Account Receive (Finance and Accounting → Account Receive). Login di https://staging.olshoperp.com/login.
- Company aktif Dev Staging (avatar → Switch Company → Dev Staging → Proceed).
- Perbaikan ETM-16764 sudah ada di Staging: 'Last API build' di footer lebih baru dari 23-10-2026 16:40:37 (pada build itu perilaku masih logika lama).
- Customer uji PT Nusa Jaya Abadi (NJA, company id 14): Customer's Deposit COA = 2-20104 Uang Muka Penjualan, Deposit of Sales Return = 4-40103 Retur Penjualan (cek di Master Data customer / setting COA company).
- CN asal SR dan CN manual Approved bersaldo untuk NJA.

| Item | Nilai | Keterangan / link |
|---|---|---|
| File import | 1 baris CN Sales Return, 1 baris CN manual, 1 baris overpay (menghasilkan CN baru) |  |

## Langkah dan hasil yang harus terlihat

1. Upload file import Account Receive, cek hasil validasi.
   - Validasi menampilkan akun sesuai asal CN.
2. Proses import sampai selesai, buka AR hasil import.
   - CN SR 4-40103, CN manual 2-20104.
3. Buka jurnal di General Ledger; buka CN overpay hasil import, approve, cek jurnal.
   - Jurnal konsisten dengan validasi; CN overpay memakai 2-20104.

## Hasil yang diharapkan

- Baris CN Sales Return mendebit Deposit of Sales Return, CN manual mendebit Customer's Deposit.
- CN overpay hasil import memakai Customer's Deposit.
- Tidak ada selisih akun antara validasi dan jurnal.

## Catatan QA

- Fix ETM-16764 belum aktif pada build API Staging 23-10-2026 16:40:37; ulangi setelah deploy.

## Pembersihan data (akhir tes)

- Data uji tidak dihapus. AR RC-5UV2ZH9Z (Draft) menahan CN-5UME5OMY dan CN-5UOYPXXH; lepaskan manual bila CN itu perlu dipakai penguji lain.
