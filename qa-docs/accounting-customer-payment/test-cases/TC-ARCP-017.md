---
doc_type: e2e-test-case
tc_code: TC-ARCP-017
menu: accounting-customer-payment
menu_name: "Account Receive"
test_type: regression
title: "Edit penerimaan berisi Credit Note dan export laporan akuntansi tetap berjalan normal (regression)"
summary: "Edit nominal baris CN di AR Draft tersimpan tanpa error dan GL Account tetap sesuai asal CN; export Trial Balance, General Ledger, Profit & Loss dan import kecil tetap selesai."
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
  - "AR Draft berisi baris CN asal SR dan CN manual (mis. RC-5UV2ZH9Z)."
test_data:
  - field: "Data uji / AR Draft"
    value: "RC-5UV2ZH9Z (CN-5UME5OMY dan CN-5UOYPXXH) | https://staging.olshoperp.com/accounting/customer-payment/edit/5850"
  - field: "Data uji / Periode laporan"
    value: "1 bulan berjalan"
steps:
  - "Edit AR Draft: ubah nominal baris CN (klik Amount, isi nilai baru, Enter), muat ulang. Cek: Tersimpan tanpa error; nominal baru tampil."
  - "Cek GL Account tiap baris. Cek: CN asal SR 4-40103, CN manual 2-20104."
  - "Jalankan Export Trial Balance, General Ledger, Profit & Loss periode uji dan 1 import kecil; tunggu status selesai. Cek: Semua selesai sukses, file terunduh, angka konsisten dengan layar."
expected_result: |
  1. Edit AR tersimpan tanpa error, GL Account sesuai asal CN.
  2. Export TB/GL/P&L selesai sukses.
  3. Import selesai tanpa error terkait company.
test_result:
  status: failed
  started_at: "2026-10-26T09:40:00+07:00"
  finished_at: "2026-10-26T10:20:00+07:00"
  executed_by: "Bugsy atas permintaan Rachmatulloh Yendy; Playwright staging"
  environment: staging
  log_summary: "Edit nominal CN-5UOYPXXH 46.000→40.000 dan CN-5UME5OMY 150.000→140.000 tersimpan (PUT 200), tetapi CN SR tetap 2-20104 (expected 4-40103). Export/import belum dijalankan."
  report_url: "https://drive.google.com/drive/folders/1_Nfvd5eedd4L5ZgQeG8ge50y011nrGNa"
test_data_used:
  - "RC-5UV2ZH9Z (AR id 5850, Draft, Dev Staging, desc QA-AUTO ETM-16764 26-10-2026)"
run_history:
  - at: "2026-10-26"
    status: failed
    environment: staging
    note: "Edit nominal CN-5UOYPXXH 46.000→40.000 dan CN-5UME5OMY 150.000→140.000 tersimpan (PUT 200), tetapi CN SR tetap 2-20104 (expected 4-40103). Export/import belum dijalankan."
origin_jira: ETM-16764
first_execution:
  at: "2026-10-26"
  via: "manual:Bugsy"
  jira: ETM-16788
last_execution:
  at: "2026-10-26"
  jira: ETM-16788
  status: failed
  via: "manual:Bugsy"
  notes: "Dieksekusi sebagian oleh Bugsy 26-10-2026: edit nominal CN di AR RC-5UV2ZH9Z tersimpan tanpa error, tetapi baris CN asal SR tetap 2-20104 (expected 4-40103), Failed; export TB/GL/P&L dan import belum dijalankan."
---

# Edit penerimaan berisi Credit Note dan export laporan akuntansi tetap berjalan normal (regression)

Card: [ETM-16788](https://erpintegration.atlassian.net/browse/ETM-16788) (Test Case, regression) · card asal: [ETM-16764](https://erpintegration.atlassian.net/browse/ETM-16764)

## Data uji dari awal sampai akhir

Prasyarat umum:
- Akun uji QA dengan akses menu Account Receive (Finance and Accounting → Account Receive). Login di https://staging.olshoperp.com/login.
- Company aktif Dev Staging (avatar → Switch Company → Dev Staging → Proceed).
- Perbaikan ETM-16764 sudah ada di Staging: 'Last API build' di footer lebih baru dari 23-10-2026 16:40:37 (pada build itu perilaku masih logika lama).
- Customer uji PT Nusa Jaya Abadi (NJA, company id 14): Customer's Deposit COA = 2-20104 Uang Muka Penjualan, Deposit of Sales Return = 4-40103 Retur Penjualan (cek di Master Data customer / setting COA company).
- AR Draft berisi baris CN asal SR dan CN manual (mis. RC-5UV2ZH9Z).

| Item | Nilai | Keterangan / link |
|---|---|---|
| AR Draft | RC-5UV2ZH9Z (CN-5UME5OMY dan CN-5UOYPXXH) | https://staging.olshoperp.com/accounting/customer-payment/edit/5850 |
| Periode laporan | 1 bulan berjalan |  |

## Langkah dan hasil yang harus terlihat

1. Edit AR Draft: ubah nominal baris CN (klik Amount, isi nilai baru, Enter), muat ulang.
   - Tersimpan tanpa error; nominal baru tampil.
2. Cek GL Account tiap baris.
   - CN asal SR 4-40103, CN manual 2-20104.
3. Jalankan Export Trial Balance, General Ledger, Profit & Loss periode uji dan 1 import kecil; tunggu status selesai.
   - Semua selesai sukses, file terunduh, angka konsisten dengan layar.

## Hasil yang diharapkan

- Edit AR tersimpan tanpa error, GL Account sesuai asal CN.
- Export TB/GL/P&L selesai sukses.
- Import selesai tanpa error terkait company.

## Catatan QA

- Run 26-10-2026 (Bugsy, staging): Edit nominal CN-5UOYPXXH 46.000→40.000 dan CN-5UME5OMY 150.000→140.000 tersimpan (PUT 200), tetapi CN SR tetap 2-20104 (expected 4-40103). Export/import belum dijalankan. Bukti: https://drive.google.com/drive/folders/1_Nfvd5eedd4L5ZgQeG8ge50y011nrGNa
- Fix ETM-16764 belum aktif pada build API Staging 23-10-2026 16:40:37; ulangi setelah deploy.

## Pembersihan data (akhir tes)

- Data uji tidak dihapus. AR RC-5UV2ZH9Z (Draft) menahan CN-5UME5OMY dan CN-5UOYPXXH; lepaskan manual bila CN itu perlu dipakai penguji lain.
