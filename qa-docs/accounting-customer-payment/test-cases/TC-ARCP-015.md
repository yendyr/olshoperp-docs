---
doc_type: e2e-test-case
tc_code: TC-ARCP-015
menu: accounting-customer-payment
menu_name: "Account Receive"
test_type: negative
title: "Penerimaan dengan Credit Note manual atau overpay tetap mendebit akun Customer's Deposit (negative)"
summary: "CN manual/overpay di AR tetap memakai Customer's Deposit COA customer (2-20104 untuk NJA), CN milik store memakai deposit COA store; Deposit of Sales Return tidak tersentuh."
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
  - "CN manual Approved bersaldo NJA (mis. CN-5UOYPXXH IDR 46.000) dan CN overpay Approved bersaldo NJA yang belum ditahan AR lain."
  - "Bila ada: store Platform dengan deposit_coa_id terisi dan CN manual milik store itu."
test_data:
  - field: "Data uji / Customer"
    value: "PT Nusa Jaya Abadi (NJA)"
  - field: "Data uji / Credit Note manual"
    value: "CN-5UOYPXXH: IDR 46.000,00 | https://staging.olshoperp.com/accounting/credit-note/edit/3277"
  - field: "Data uji / Credit Note overpay"
    value: "CN overpay NJA Approved bersaldo (CN-5UTLZQQ8 sudah ditahan AR lain per 26-10-2026)"
steps:
  - "Buat AR NJA IDR, tambah Credit Note manual lewat Select Credit Note → Use. Cek: GL Account baris = 2-20104 Uang Muka Penjualan."
  - "Ulangi dengan Credit Note overpay. Cek: GL Account baris = 2-20104 Uang Muka Penjualan."
  - "Bila ada, ulangi dengan CN manual milik store Platform pada AR customer store tersebut. Cek: GL Account = deposit COA store."
  - "Lengkapi Sales Invoice, approve AR, buka jurnal di General Ledger. Cek: Jurnal mendebit Customer's Deposit (atau deposit COA store); 4-40103 tidak tersentuh."
expected_result: |
  1. GL Account dan jurnal untuk CN manual/overpay memakai Customer's Deposit COA customer.
  2. CN milik store memakai deposit COA store.
  3. Deposit of Sales Return tidak tersentuh.
test_result:
  status: blocked
  started_at: "2026-10-26T09:40:00+07:00"
  finished_at: "2026-10-26T10:20:00+07:00"
  executed_by: "Bugsy atas permintaan Rachmatulloh Yendy; Playwright staging"
  environment: staging
  log_summary: "CN manual CN-5UOYPXXH → 2-20104 (sesuai). CN overpay CN-5UTLZQQ8 ditolak 'already prepared' (ditahan AR lain); CN store dan approve/jurnal belum diuji. Fix belum aktif di Staging sehingga hasil belum membuktikan fix."
  report_url: "https://drive.google.com/drive/folders/1_Nfvd5eedd4L5ZgQeG8ge50y011nrGNa"
test_data_used:
  - "RC-5UV2ZH9Z (AR id 5850, Draft, Dev Staging, desc QA-AUTO ETM-16764 26-10-2026)"
run_history:
  - at: "2026-10-26"
    status: blocked
    environment: staging
    note: "CN manual CN-5UOYPXXH → 2-20104 (sesuai). CN overpay CN-5UTLZQQ8 ditolak 'already prepared' (ditahan AR lain); CN store dan approve/jurnal belum diuji. Fix belum aktif di Staging sehingga hasil belum membuktikan fix."
origin_jira: ETM-16764
first_execution:
  at: "2026-10-26"
  via: "manual:Bugsy"
  jira: ETM-16786
last_execution:
  at: "2026-10-26"
  jira: ETM-16786
  status: blocked
  via: "manual:Bugsy"
  notes: "Dieksekusi sebagian oleh Bugsy 26-10-2026: CN manual CN-5UOYPXXH di AR RC-5UV2ZH9Z tampil 2-20104 (sesuai), overpay/store/jurnal belum bisa diuji dan fix ETM-16764 belum aktif di Staging, jadi status blocked."
---

# Penerimaan dengan Credit Note manual atau overpay tetap mendebit akun Customer's Deposit (negative)

Card: [ETM-16786](https://erpintegration.atlassian.net/browse/ETM-16786) (Test Case, negative) · card asal: [ETM-16764](https://erpintegration.atlassian.net/browse/ETM-16764)

## Data uji dari awal sampai akhir

Prasyarat umum:
- Akun uji QA dengan akses menu Account Receive (Finance and Accounting → Account Receive). Login di https://staging.olshoperp.com/login.
- Company aktif Dev Staging (avatar → Switch Company → Dev Staging → Proceed).
- Perbaikan ETM-16764 sudah ada di Staging: 'Last API build' di footer lebih baru dari 23-10-2026 16:40:37 (pada build itu perilaku masih logika lama).
- Customer uji PT Nusa Jaya Abadi (NJA, company id 14): Customer's Deposit COA = 2-20104 Uang Muka Penjualan, Deposit of Sales Return = 4-40103 Retur Penjualan (cek di Master Data customer / setting COA company).
- CN manual Approved bersaldo NJA (mis. CN-5UOYPXXH IDR 46.000) dan CN overpay Approved bersaldo NJA yang belum ditahan AR lain.
- Bila ada: store Platform dengan deposit_coa_id terisi dan CN manual milik store itu.

| Item | Nilai | Keterangan / link |
|---|---|---|
| Customer | PT Nusa Jaya Abadi (NJA) |  |
| Credit Note manual | CN-5UOYPXXH: IDR 46.000,00 | https://staging.olshoperp.com/accounting/credit-note/edit/3277 |
| Credit Note overpay | CN overpay NJA Approved bersaldo (CN-5UTLZQQ8 sudah ditahan AR lain per 26-10-2026) |  |

## Langkah dan hasil yang harus terlihat

1. Buat AR NJA IDR, tambah Credit Note manual lewat Select Credit Note → Use.
   - GL Account baris = 2-20104 Uang Muka Penjualan.
2. Ulangi dengan Credit Note overpay.
   - GL Account baris = 2-20104 Uang Muka Penjualan.
3. Bila ada, ulangi dengan CN manual milik store Platform pada AR customer store tersebut.
   - GL Account = deposit COA store.
4. Lengkapi Sales Invoice, approve AR, buka jurnal di General Ledger.
   - Jurnal mendebit Customer's Deposit (atau deposit COA store); 4-40103 tidak tersentuh.

## Hasil yang diharapkan

- GL Account dan jurnal untuk CN manual/overpay memakai Customer's Deposit COA customer.
- CN milik store memakai deposit COA store.
- Deposit of Sales Return tidak tersentuh.

## Catatan QA

- Run 26-10-2026 (Bugsy, staging): CN manual CN-5UOYPXXH → 2-20104 (sesuai). CN overpay CN-5UTLZQQ8 ditolak 'already prepared' (ditahan AR lain); CN store dan approve/jurnal belum diuji. Fix belum aktif di Staging sehingga hasil belum membuktikan fix. Bukti: https://drive.google.com/drive/folders/1_Nfvd5eedd4L5ZgQeG8ge50y011nrGNa
- Fix ETM-16764 belum aktif pada build API Staging 23-10-2026 16:40:37; ulangi setelah deploy.

## Pembersihan data (akhir tes)

- Data uji tidak dihapus. AR RC-5UV2ZH9Z (Draft) menahan CN-5UME5OMY dan CN-5UOYPXXH; lepaskan manual bila CN itu perlu dipakai penguji lain.
