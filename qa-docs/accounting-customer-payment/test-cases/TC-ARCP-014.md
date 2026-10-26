---
doc_type: e2e-test-case
tc_code: TC-ARCP-014
menu: accounting-customer-payment
menu_name: "Account Receive"
test_type: happy
title: "Penerimaan dengan Credit Note dari Sales Return mendebit akun Deposit of Sales Return (happy)"
summary: "CN asal Sales Return yang dipakai di Receiving Destination AR tampil dengan GL Account Deposit of Sales Return customer (4-40103 untuk NJA), dan jurnal approve mendebit akun itu."
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
  - "CN asal Sales Return Approved bersaldo untuk NJA, mis. CN-5UME5OMY (IDR 150.000) belum ditahan AR lain."
test_data:
  - field: "Data uji / Customer"
    value: "PT Nusa Jaya Abadi (NJA)"
  - field: "Data uji / Credit Note (asal Sales Return)"
    value: "CN-5UME5OMY: IDR 150.000,00 | https://staging.olshoperp.com/accounting/credit-note/edit/3264"
  - field: "Data uji / Header AR"
    value: "Transaction Currency IDR, Exchange Rate 1"
steps:
  - "Buat AR: Account Receive → Create; Customer PT Nusa Jaya Abadi; Transaction Currency IDR (Exchange Rate 1). Isi Description 'QA-AUTO <card> <tanggal>'. Cek: Halaman Edit AR terbuka, kode RC-xxxx terbentuk."
  - "Receiving Destination → Select Credit Note → kosongkan pencarian → centang baris CN-5UME5OMY → Use. Cek: Baris CN-5UME5OMY masuk tabel Receiving Destination dengan GL Account 4-40103 Retur Penjualan (bukan 2-20104)."
  - "Lengkapi Sales Invoice outstanding NJA dan approve AR, lalu buka jurnalnya di General Ledger. Cek: Jurnal mendebit 4-40103 sebesar nominal CN; 2-20104 tidak tersentuh."
expected_result: |
  1. GL Account baris CN asal Sales Return = Deposit of Sales Return customer (4-40103).
  2. Jurnal approve AR mendebit Deposit of Sales Return, bukan Customer's Deposit.
test_result:
  status: failed
  started_at: "2026-10-26T09:40:00+07:00"
  finished_at: "2026-10-26T10:20:00+07:00"
  executed_by: "Bugsy atas permintaan Rachmatulloh Yendy; Playwright staging"
  environment: staging
  log_summary: "CN-5UME5OMY (asal SR) di AR RC-5UV2ZH9Z tampil GL Account 2-20104 Uang Muka Penjualan (coa_id 751), expected 4-40103. Approve/jurnal tidak dijalankan."
  report_url: "https://drive.google.com/drive/folders/1_Nfvd5eedd4L5ZgQeG8ge50y011nrGNa"
test_data_used:
  - "RC-5UV2ZH9Z (AR id 5850, Draft, Dev Staging, desc QA-AUTO ETM-16764 26-10-2026)"
run_history:
  - at: "2026-10-26"
    status: failed
    environment: staging
    note: "CN-5UME5OMY (asal SR) di AR RC-5UV2ZH9Z tampil GL Account 2-20104 Uang Muka Penjualan (coa_id 751), expected 4-40103. Approve/jurnal tidak dijalankan."
origin_jira: ETM-16764
first_execution:
  at: "2026-10-26"
  via: "manual:Bugsy"
  jira: ETM-16785
last_execution:
  at: "2026-10-26"
  jira: ETM-16785
  status: failed
  via: "manual:Bugsy"
  notes: "Dieksekusi manual oleh Bugsy 26-10-2026 di staging Dev Staging: CN-5UME5OMY asal Sales Return dipakai di AR RC-5UV2ZH9Z, GL Account tampil 2-20104 Uang Muka Penjualan (expected 4-40103 Retur Penjualan), Failed; fix belum aktif di build API 23-10-2026 16:40:37."
---

# Penerimaan dengan Credit Note dari Sales Return mendebit akun Deposit of Sales Return (happy)

Card: [ETM-16785](https://erpintegration.atlassian.net/browse/ETM-16785) (Test Case, happy) · card asal: [ETM-16764](https://erpintegration.atlassian.net/browse/ETM-16764)

## Data uji dari awal sampai akhir

Prasyarat umum:
- Akun uji QA dengan akses menu Account Receive (Finance and Accounting → Account Receive). Login di https://staging.olshoperp.com/login.
- Company aktif Dev Staging (avatar → Switch Company → Dev Staging → Proceed).
- Perbaikan ETM-16764 sudah ada di Staging: 'Last API build' di footer lebih baru dari 23-10-2026 16:40:37 (pada build itu perilaku masih logika lama).
- Customer uji PT Nusa Jaya Abadi (NJA, company id 14): Customer's Deposit COA = 2-20104 Uang Muka Penjualan, Deposit of Sales Return = 4-40103 Retur Penjualan (cek di Master Data customer / setting COA company).
- CN asal Sales Return Approved bersaldo untuk NJA, mis. CN-5UME5OMY (IDR 150.000) belum ditahan AR lain.

| Item | Nilai | Keterangan / link |
|---|---|---|
| Customer | PT Nusa Jaya Abadi (NJA) |  |
| Credit Note (asal Sales Return) | CN-5UME5OMY: IDR 150.000,00 | https://staging.olshoperp.com/accounting/credit-note/edit/3264 |
| Header AR | Transaction Currency IDR, Exchange Rate 1 |  |

## Langkah dan hasil yang harus terlihat

1. Buat AR: Account Receive → Create; Customer PT Nusa Jaya Abadi; Transaction Currency IDR (Exchange Rate 1). Isi Description 'QA-AUTO <card> <tanggal>'.
   - Halaman Edit AR terbuka, kode RC-xxxx terbentuk.
2. Receiving Destination → Select Credit Note → kosongkan pencarian → centang baris CN-5UME5OMY → Use.
   - Baris CN-5UME5OMY masuk tabel Receiving Destination dengan GL Account 4-40103 Retur Penjualan (bukan 2-20104).
3. Lengkapi Sales Invoice outstanding NJA dan approve AR, lalu buka jurnalnya di General Ledger.
   - Jurnal mendebit 4-40103 sebesar nominal CN; 2-20104 tidak tersentuh.

## Hasil yang diharapkan

- GL Account baris CN asal Sales Return = Deposit of Sales Return customer (4-40103).
- Jurnal approve AR mendebit Deposit of Sales Return, bukan Customer's Deposit.

## Catatan QA

- Run 26-10-2026 (Bugsy, staging): CN-5UME5OMY (asal SR) di AR RC-5UV2ZH9Z tampil GL Account 2-20104 Uang Muka Penjualan (coa_id 751), expected 4-40103. Approve/jurnal tidak dijalankan. Bukti: https://drive.google.com/drive/folders/1_Nfvd5eedd4L5ZgQeG8ge50y011nrGNa
- Fix ETM-16764 belum aktif pada build API Staging 23-10-2026 16:40:37; ulangi setelah deploy.

## Pembersihan data (akhir tes)

- Data uji tidak dihapus. AR RC-5UV2ZH9Z (Draft) menahan CN-5UME5OMY dan CN-5UOYPXXH; lepaskan manual bila CN itu perlu dipakai penguji lain.
