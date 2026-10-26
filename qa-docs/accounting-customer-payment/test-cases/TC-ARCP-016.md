---
doc_type: e2e-test-case
tc_code: TC-ARCP-016
menu: accounting-customer-payment
menu_name: "Account Receive"
test_type: edge
title: "Satu penerimaan dengan Credit Note beda asal dan setelah setting COA customer diubah memakai setting baru sesuai asal CN (edge)"
summary: "Dalam satu AR, CN asal Sales Return memakai Deposit of Sales Return dan CN manual memakai Customer's Deposit; setelah setting COA customer diubah, baris CN baru memakai setting baru sesuai asal CN."
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
  - "CN asal SR (CN-5UME5OMY) dan CN manual (CN-5UOYPXXH) Approved bersaldo untuk NJA."
  - "Bila mengubah setting COA NJA, catat nilai awal dan kembalikan setelah tes."
test_data:
  - field: "Data uji / Customer"
    value: "PT Nusa Jaya Abadi (NJA)"
  - field: "Data uji / CN-A asal Sales Return"
    value: "CN-5UME5OMY: IDR 150.000,00 | https://staging.olshoperp.com/accounting/credit-note/edit/3264"
  - field: "Data uji / CN-B manual"
    value: "CN-5UOYPXXH: IDR 46.000,00 | https://staging.olshoperp.com/accounting/credit-note/edit/3277"
steps:
  - "Buat AR NJA IDR, tambah CN-A lalu CN-B lewat Select Credit Note → Use. Cek: CN-A GL Account 4-40103, CN-B GL Account 2-20104."
  - "Ubah setting COA NJA (Customer's Deposit dan/atau Deposit of Sales Return) ke akun lain, buat AR baru dan tambah CN asal SR dan manual lain. Cek: Baris baru memakai akun setting baru sesuai asal CN."
  - "Kembalikan setting COA NJA ke nilai awal. Cek: Setting kembali 2-20104 / 4-40103."
expected_result: |
  1. Satu AR bisa berisi CN beda asal dengan GL Account berbeda sesuai asal CN.
  2. Setelah setting diubah, baris baru mengikuti setting baru.
test_result:
  status: failed
  started_at: "2026-10-26T09:40:00+07:00"
  finished_at: "2026-10-26T10:20:00+07:00"
  executed_by: "Bugsy atas permintaan Rachmatulloh Yendy; Playwright staging"
  environment: staging
  log_summary: "AR RC-5UV2ZH9Z: CN-5UME5OMY (SR) dan CN-5UOYPXXH (manual) keduanya 2-20104 (coa_id 751); expected CN SR 4-40103. Langkah ubah setting tidak dijalankan. Error: ETM-16808."
  report_url: "https://drive.google.com/drive/folders/1_Nfvd5eedd4L5ZgQeG8ge50y011nrGNa"
test_data_used:
  - "RC-5UV2ZH9Z (AR id 5850, Draft, Dev Staging, desc QA-AUTO ETM-16764 26-10-2026)"
run_history:
  - at: "2026-10-26"
    status: failed
    environment: staging
    note: "AR RC-5UV2ZH9Z: CN-5UME5OMY (SR) dan CN-5UOYPXXH (manual) keduanya 2-20104 (coa_id 751); expected CN SR 4-40103. Langkah ubah setting tidak dijalankan. Error: ETM-16808."
origin_jira: ETM-16764
first_execution:
  at: "2026-10-26"
  via: "manual:Bugsy"
  jira: ETM-16787
last_execution:
  at: "2026-10-26"
  jira: ETM-16787
  status: failed
  via: "manual:Bugsy"
  notes: "Dieksekusi manual oleh Bugsy 26-10-2026: di AR RC-5UV2ZH9Z CN asal SR dan CN manual keduanya tampil 2-20104 Uang Muka Penjualan, CN SR seharusnya 4-40103, Failed; setting COA tidak diubah. Error: ETM-16808."
---

# Satu penerimaan dengan Credit Note beda asal dan setelah setting COA customer diubah memakai setting baru sesuai asal CN (edge)

Card: [ETM-16787](https://erpintegration.atlassian.net/browse/ETM-16787) (Test Case, edge) · card asal: [ETM-16764](https://erpintegration.atlassian.net/browse/ETM-16764)

## Data uji dari awal sampai akhir

Prasyarat umum:
- Akun uji QA dengan akses menu Account Receive (Finance and Accounting → Account Receive). Login di https://staging.olshoperp.com/login.
- Company aktif Dev Staging (avatar → Switch Company → Dev Staging → Proceed).
- Perbaikan ETM-16764 sudah ada di Staging: 'Last API build' di footer lebih baru dari 23-10-2026 16:40:37 (pada build itu perilaku masih logika lama).
- Customer uji PT Nusa Jaya Abadi (NJA, company id 14): Customer's Deposit COA = 2-20104 Uang Muka Penjualan, Deposit of Sales Return = 4-40103 Retur Penjualan (cek di Master Data customer / setting COA company).
- CN asal SR (CN-5UME5OMY) dan CN manual (CN-5UOYPXXH) Approved bersaldo untuk NJA.
- Bila mengubah setting COA NJA, catat nilai awal dan kembalikan setelah tes.

| Item | Nilai | Keterangan / link |
|---|---|---|
| Customer | PT Nusa Jaya Abadi (NJA) |  |
| CN-A asal Sales Return | CN-5UME5OMY: IDR 150.000,00 | https://staging.olshoperp.com/accounting/credit-note/edit/3264 |
| CN-B manual | CN-5UOYPXXH: IDR 46.000,00 | https://staging.olshoperp.com/accounting/credit-note/edit/3277 |

## Langkah dan hasil yang harus terlihat

1. Buat AR NJA IDR, tambah CN-A lalu CN-B lewat Select Credit Note → Use.
   - CN-A GL Account 4-40103, CN-B GL Account 2-20104.
2. Ubah setting COA NJA (Customer's Deposit dan/atau Deposit of Sales Return) ke akun lain, buat AR baru dan tambah CN asal SR dan manual lain.
   - Baris baru memakai akun setting baru sesuai asal CN.
3. Kembalikan setting COA NJA ke nilai awal.
   - Setting kembali 2-20104 / 4-40103.

## Hasil yang diharapkan

- Satu AR bisa berisi CN beda asal dengan GL Account berbeda sesuai asal CN.
- Setelah setting diubah, baris baru mengikuti setting baru.

## Catatan QA

- Jira ETM-16787 Done dengan Test Result Failed (26-10-2026). Error: [ETM-16808](https://erpintegration.atlassian.net/browse/ETM-16808) (GL CN asal Sales Return masih 2-20104; kemungkinan build Staging belum memuat fix).
- Run 26-10-2026 (Bugsy, staging): AR RC-5UV2ZH9Z: CN-5UME5OMY (SR) dan CN-5UOYPXXH (manual) keduanya 2-20104 (coa_id 751); expected CN SR 4-40103. Langkah ubah setting tidak dijalankan. Bukti: https://drive.google.com/drive/folders/1_Nfvd5eedd4L5ZgQeG8ge50y011nrGNa
- Fix ETM-16764 belum aktif pada build API Staging 23-10-2026 16:40:37; ulangi setelah deploy.

## Pembersihan data (akhir tes)

- Data uji tidak dihapus. AR RC-5UV2ZH9Z (Draft) menahan CN-5UME5OMY dan CN-5UOYPXXH; lepaskan manual bila CN itu perlu dipakai penguji lain.
