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
  - "Data dibuat baru end-to-end (label QA-AUTO ETM-16786 26-10-2026): SI → import Account Receive overpay (menghasilkan CN overpay) → CN manual → CN bertag store → AR uji. Transaction Date AR pemakai CN overpay harus >= tanggal CN overpay (CN overpay tercatat 00:00:09 hari berikutnya)."
  - "Bila ada: store Platform dengan deposit_coa_id terisi dan CN manual milik store itu."
test_data:
  - field: "Data uji / Customer"
    value: "PT Nusa Jaya Abadi (NJA)"
  - field: "Data uji / Sales Invoice"
    value: "SI-5UV3DVQ3 (1.530.000) dan SI-5UV3FRXS (4.260.000), Approved"
  - field: "Data uji / Import Account Receive overpay"
    value: "RC-5UV3MSXY (Approved, bayar 4.360.000 untuk SI-5UV3FRXS, COA 1-10002)"
  - field: "Data uji / Credit Note overpay"
    value: "CN-5UV3MSZD: IDR 100.000 | https://staging.olshoperp.com/accounting/credit-note/edit/5856"
  - field: "Data uji / Credit Note manual"
    value: "CN-5UV3P1L4: IDR 50.000 | https://staging.olshoperp.com/accounting/credit-note/edit/5857"
  - field: "Data uji / Credit Note customer bertag store"
    value: "CN-5UV3SW93: IDR 30.000, store Deliwafa (deposit COA store 2-20101) | https://staging.olshoperp.com/accounting/credit-note/edit/5860"
  - field: "Data uji / Account Receive uji"
    value: "RC-5UV3GHZ9 (Approved, SI-5UV3DVQ3) | https://staging.olshoperp.com/accounting/customer-payment/edit/5853"
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
  status: failed
  started_at: "2026-10-26T11:20:00+07:00"
  finished_at: "2026-10-26T12:30:00+07:00"
  executed_by: "Bugsy atas permintaan Rachmatulloh Yendy; API + Playwright staging"
  environment: staging
  log_summary: "CN manual → 2-20104 (PASS); CN overpay CN-5UV3MSZD tidak bisa dipakai, error 'already prepared' padahal belum dipakai (FAIL, bug ETM-16819); CN store tidak conclusive; jurnal RC-5UV3GHZ9 tidak menyentuh 4-40103 (PASS)."
  report_url: "https://drive.google.com/drive/folders/1_Nfvd5eedd4L5ZgQeG8ge50y011nrGNa"
test_data_used:
  - "RC-5UV2ZH9Z (AR id 5850, Draft, Dev Staging, desc QA-AUTO ETM-16764 26-10-2026) - run 1"
  - "SI-5UV3DVQ3, SI-5UV3FRXS, RC-5UV3MSXY, CN-5UV3MSZD, CN-5UV3P1L4, CN-5UV3SW93, RC-5UV3GHZ9 (Approved), RC-5UV4BJUP (Draft) - run 2, label QA-AUTO ETM-16786 26-10-2026"
run_history:
  - at: "2026-10-26"
    status: blocked
    environment: staging
    note: "CN manual CN-5UOYPXXH → 2-20104 (sesuai). CN overpay CN-5UTLZQQ8 ditolak 'already prepared'; CN store dan approve/jurnal belum diuji. Fix belum aktif di Staging sehingga hasil belum membuktikan fix."
  - at: "2026-10-26"
    status: failed
    environment: staging
    note: "Data baru end-to-end. CN manual CN-5UV3P1L4 → 2-20104 PASS; CN overpay CN-5UV3MSZD gagal dipakai ('already prepared', Grand Total CN 0) di RC-5UV3GHZ9 dan RC-5UV4BJUP → ETM-16819; CN-5UV3SW93 (CN customer bertag store) → 2-20104, tidak conclusive untuk skenario store sebagai customer; jurnal GL-EA83I0ODB86M Dr 2-20104 80.000, 4-40103 tidak tersentuh PASS."
origin_jira: ETM-16764
first_execution:
  at: "2026-10-26"
  via: "manual:Bugsy"
  jira: ETM-16786
last_execution:
  at: "2026-10-26"
  jira: ETM-16786
  status: failed
  via: "manual:Bugsy"
  notes: "Retest data baru end-to-end 26-10-2026: Failed karena CN overpay hasil import tidak bisa dipakai (bug ETM-16819). Card ETM-16786 Done (Failed)."
---

# Penerimaan dengan Credit Note manual atau overpay tetap mendebit akun Customer's Deposit (negative)

Card: [ETM-16786](https://erpintegration.atlassian.net/browse/ETM-16786) (Test Case, negative) · card asal: [ETM-16764](https://erpintegration.atlassian.net/browse/ETM-16764)

## Data uji dari awal sampai akhir

Prasyarat umum:
- Akun uji QA dengan akses menu Account Receive (Finance and Accounting → Account Receive). Login di https://staging.olshoperp.com/login.
- Company aktif Dev Staging (avatar → Switch Company → Dev Staging → Proceed).
- Perbaikan ETM-16764 sudah ada di Staging: 'Last API build' di footer lebih baru dari 23-10-2026 16:40:37 (pada build itu perilaku masih logika lama).
- Customer uji PT Nusa Jaya Abadi (NJA, company id 14): Customer's Deposit COA = 2-20104 Uang Muka Penjualan, Deposit of Sales Return = 4-40103 Retur Penjualan (cek di Master Data customer / setting COA company).
- Data dibuat baru end-to-end (label QA-AUTO ETM-16786 26-10-2026): SI → import Account Receive overpay (menghasilkan CN overpay) → CN manual → CN bertag store → AR uji. Transaction Date AR pemakai CN overpay harus >= tanggal CN overpay.
- Bila ada: store Platform dengan deposit_coa_id terisi dan CN manual milik store itu.

| Item | Nilai | Keterangan / link |
|---|---|---|
| Customer | PT Nusa Jaya Abadi (NJA) |  |
| Sales Invoice | SI-5UV3DVQ3 (1.530.000), SI-5UV3FRXS (4.260.000) | Approved |
| Import Account Receive overpay | RC-5UV3MSXY | Approved, bayar 4.360.000 untuk SI-5UV3FRXS |
| Credit Note overpay | CN-5UV3MSZD: IDR 100.000 | https://staging.olshoperp.com/accounting/credit-note/edit/5856 |
| Credit Note manual | CN-5UV3P1L4: IDR 50.000 | https://staging.olshoperp.com/accounting/credit-note/edit/5857 |
| Credit Note customer bertag store | CN-5UV3SW93: IDR 30.000 (Deliwafa) | https://staging.olshoperp.com/accounting/credit-note/edit/5860 |
| Account Receive uji | RC-5UV3GHZ9 | https://staging.olshoperp.com/accounting/customer-payment/edit/5853 |

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
- Run 2 26-10-2026 (Bugsy, staging, data baru end-to-end, build API 11:38:51 WIB):
  1. CN manual CN-5UV3P1L4 → GL 2-20104 - PASS (sama dengan perilaku kode lama, belum membuktikan logika baru).
  2. CN overpay CN-5UV3MSZD (dari import RC-5UV3MSXY) → error "Credit Note(s) CN-5UV3MSZD already prepared." padahal Prepared 0 / Processed 0; diulang di AR baru RC-5UV4BJUP hasil sama - FAIL, bug [ETM-16819](https://erpintegration.atlassian.net/browse/ETM-16819). CN overpay hasil import menyimpan Grand Total 0. Gejala run 1 (CN-5UTLZQQ8) juga bug ini, bukan karena ditahan AR lain.
  3. CN-5UV3SW93 adalah CN customer (company) bertag store Deliwafa, bukan store sebagai customer; GL 2-20104 - tidak conclusive. Skenario CN milik store Platform sebagai customer belum dites.
  4. Jurnal RC-5UV3GHZ9 (GL-EA83I0ODB86M): Dr 1-10007 1.450.000, Dr 2-20104 80.000, Cr 1-11001 1.530.000; 4-40103 tidak tersentuh - PASS.
  - Observasi: import dengan COA bank 1-10007 ditolak "ambiguity detected" (pakai 1-10002 berhasil).
  - Bukti: https://drive.google.com/file/d/1AMYfgNcoIuaEGUKDhW_0KYJY0HWAp6JA/view?usp=drivesdk , https://drive.google.com/file/d/1kZtJ89sIp_7GeThZdRVJlOuocz_df4No/view?usp=drivesdk

## Pembersihan data (akhir tes)

- Data uji tidak dihapus. AR RC-5UV2ZH9Z (Draft) menahan CN-5UME5OMY dan CN-5UOYPXXH; lepaskan manual bila CN itu perlu dipakai penguji lain.
- Data run 2 (label QA-AUTO ETM-16786 26-10-2026) tidak dihapus. RC-5UV4BJUP dibiarkan Draft untuk retest ETM-16819; CN-5UV3MSZD masih bersaldo 100.000.
