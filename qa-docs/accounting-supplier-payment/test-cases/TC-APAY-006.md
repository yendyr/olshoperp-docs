---
doc_type: e2e-test-case
tc_code: TC-APAY-006
menu: accounting-supplier-payment
menu_name: "Account Payment"
test_type: edge
title: "Summary AP: Utang Summary untuk PI valas (USD dan EUR) pada AP IDR dengan Allocate Full Amount memakai kurs header (edge)"
summary: "AP IDR melunasi PI USD 2.250 (kurs header 16.000 → Utang Rp 36.000.000) dan PI EUR 4.000 (kurs header 20.000 → Utang Rp 80.000.000); hasil saat ini memakai kurs PI (Rp 34.875.000 dan Rp 76.000.000) sehingga TC diperkirakan gagal sampai keputusan kurs ditetapkan."
status: draft
owner: QA - Yemima
last_updated: 2026-10-22
requirement_ref: "qa-docs/accounting-supplier-payment/requirement.md §9.5 (rate = header exchange rate, bukan rate PI) dan card ETM-16643 AC 'konversi pakai rate header'"
automated: false
automated_spec: null
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - accounting-supplier-invoice
  - accounting-debit-note
preconditions:
  - "Akun uji QA yang punya akses menu Account Payment (Finance and Accounting → Account Payment). Login di https://staging.olshoperp.com/login."
  - "Company aktif harus Lumi Charms.id: klik avatar profil di pojok kanan atas → Switch Company → Lumi Charms.id → Proceed. Cara cek: daftar Account Payment memuat dokumen tanggal 21-10-2026 (mis. PY-5UTDC0FK). Kalau membuka halaman edit dokumen muncul 'You do not have access to this page', berarti company belum benar (data tes ini milik company Lumi Charms.id)."
  - "Perbaikan ETM-16643 sudah ada di Staging. Cek di bagian paling bawah halaman: tulisan 'Last FE build' tanggal 21-10-2026 15:09 atau lebih baru, dan 'Last API build' 21-10-2026 16:19 atau lebih baru."
  - "Aturan isian: kolom 'to be Paid Amount (kode mata uang)' di form Use selalu dalam mata uang header AP (Transaction Currency), bukan mata uang invoice. Kolom 'to be Paid Amount' dan 'to be Paid Amount (IDR)' di sisi kanan hanya tampilan."
  - "PERHATIAN: kode saat ini mengalikan PI valas dengan kurs PI (bukan kurs header) saat Allocate Full Amount (lihat card ETM-16703). Karena itu hasil di layar diperkirakan berbeda dari Expected di bawah. Catat angka yang tampil sebagai Actual Result dan beri tahu Lead QA. Jangan mengubah Expected tanpa keputusan Lead QA/Finance."
  - "PI-6968A3ED dan PI-6968A20D tidak sedang ditahan AP lain (tombol di Outstanding Purchase Invoice 'Use', bukan 'Already Prepared')."
test_data:
  - field: "Data uji / Supplier"
    value: "PT. Supplier Multicurrency (kode SUPP019)"
  - field: "Data uji / PI USD"
    value: "PI-6968A3ED: USD 2.250,00, kurs PI 15.500, Approved | https://staging.olshoperp.com/accounting/supplier-invoice/edit/160"
  - field: "Data uji / PI EUR"
    value: "PI-6968A20D: EUR 4.000,00, kurs PI 19.000, Approved | https://staging.olshoperp.com/accounting/supplier-invoice/edit/159"
  - field: "Data uji / Cash/Bank"
    value: "Bank BCA Lumi Charms (Bank, IDR) | Saldo tersedia sekitar Rp 173.163.000 per 21-10-2026 (lihat kolom Balance). Butuh sampai Rp 80.000.000"
  - field: "Data uji / AP A (PI USD)"
    value: "Transaction Currency IDR, Exchange Rate 16.000; Allocate Full Amount; Cash/Bank Rp 36.000.000 | Sesuai requirement: 2.250 × 16.000 = 36.000.000. Kode saat ini: 2.250 × 15.500 = 34.875.000"
  - field: "Data uji / AP B (PI EUR)"
    value: "Transaction Currency IDR, Exchange Rate 20.000; Allocate Full Amount; Cash/Bank Rp 80.000.000 | Sesuai requirement: 4.000 × 20.000 = 80.000.000. Kode saat ini: 4.000 × 19.000 = 76.000.000"
steps:
  - "Login, pastikan company Lumi Charms.id."
  - "AP A. Buat AP: Create; Supplier = PT. Supplier Multicurrency, Transaction Currency = IDR, Exchange Rate = 16.000; lanjut sampai halaman Edit."
  - "Outstanding Purchase Invoice → PI-6968A3ED → Use → klik 'Allocate Full Amount (Clearing)' → simpan. Cek: Catat angka Paid Amount di tabel Detail (rupiah) dan Utang di Summary."
  - "Select Cash/Bank → centang 'Bank BCA Lumi Charms' → Use → Amount = 36.000.000 → simpan. Cek Summary: Utang Rp 36.000.000,00; Cash / Bank Rp -36.000.000,00; Total Rp 0,00 warna normal."
  - "AP B. Buat AP baru: Supplier sama, Transaction Currency = IDR, Exchange Rate = 20.000."
  - "Use PI-6968A20D dengan 'Allocate Full Amount (Clearing)'; tambah Cash/Bank 'Bank BCA Lumi Charms' Amount = 80.000.000. Cek Summary: Utang Rp 80.000.000,00; Cash / Bank Rp -80.000.000,00; Total Rp 0,00 warna normal."
expected_result: |
  1. AP A: Utang Rp 36.000.000,00 (2.250 × kurs header 16.000); Total Rp 0,00 normal.
  2. AP B: Utang Rp 80.000.000,00 (4.000 × kurs header 20.000); Total Rp 0,00 normal.
  3. Kode currency di Summary = IDR.
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
origin_jira: ETM-16643
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

# Summary AP: Utang Summary untuk PI valas (USD dan EUR) pada AP IDR dengan Allocate Full Amount memakai kurs header (edge)

Card: [ETM-16710](https://erpintegration.atlassian.net/browse/ETM-16710) (Test Case, edge) · card asal: [ETM-16643](https://erpintegration.atlassian.net/browse/ETM-16643) · TC terkait lama: ETM-16680 sampai ETM-16684 (TC-APAY-SUM-001 sampai 005)

## Retest cepat

1. AP A. Buat AP: Create; Supplier = PT. Supplier Multicurrency, Transaction Currency = IDR, Exchange Rate = 16.000; lanjut sampai halaman Edit.
2. Outstanding Purchase Invoice → PI-6968A3ED → Use → klik 'Allocate Full Amount (Clearing)' → simpan.
3. Select Cash/Bank → centang 'Bank BCA Lumi Charms' → Use → Amount = 36.000.000 → simpan.

## Data uji dari awal sampai akhir

Prasyarat umum:
- Akun uji QA yang punya akses menu Account Payment (Finance and Accounting → Account Payment). Login di https://staging.olshoperp.com/login.
- Company aktif harus **Lumi Charms.id**: klik avatar profil di pojok kanan atas → Switch Company → Lumi Charms.id → Proceed. Cara cek: daftar Account Payment memuat dokumen tanggal 21-10-2026 (mis. PY-5UTDC0FK). Kalau membuka halaman edit dokumen muncul 'You do not have access to this page', berarti company belum benar (data tes ini milik company Lumi Charms.id).
- Perbaikan ETM-16643 sudah ada di Staging. Cek di bagian paling bawah halaman: tulisan 'Last FE build' tanggal 21-10-2026 15:09 atau lebih baru, dan 'Last API build' 21-10-2026 16:19 atau lebih baru.
- Aturan isian: kolom 'to be Paid Amount (kode mata uang)' di form Use selalu dalam mata uang header AP (Transaction Currency), bukan mata uang invoice. Kolom 'to be Paid Amount' dan 'to be Paid Amount (IDR)' di sisi kanan hanya tampilan.
- PERHATIAN: kode saat ini mengalikan PI valas dengan kurs PI (bukan kurs header) saat Allocate Full Amount (lihat card ETM-16703). Karena itu hasil di layar diperkirakan berbeda dari Expected di bawah. Catat angka yang tampil sebagai Actual Result dan beri tahu Lead QA. Jangan mengubah Expected tanpa keputusan Lead QA/Finance.
- PI-6968A3ED dan PI-6968A20D tidak sedang ditahan AP lain (tombol di Outstanding Purchase Invoice 'Use', bukan 'Already Prepared').

**Data uji (siapkan sebelum mulai)**

| Item | Nilai | Keterangan / link |
|---|---|---|
| Supplier | PT. Supplier Multicurrency (kode SUPP019) |  |
| PI USD | PI-6968A3ED: USD 2.250,00, kurs PI 15.500, Approved | https://staging.olshoperp.com/accounting/supplier-invoice/edit/160 |
| PI EUR | PI-6968A20D: EUR 4.000,00, kurs PI 19.000, Approved | https://staging.olshoperp.com/accounting/supplier-invoice/edit/159 |
| Cash/Bank | Bank BCA Lumi Charms (Bank, IDR) | Saldo tersedia sekitar Rp 173.163.000 per 21-10-2026 (lihat kolom Balance). Butuh sampai Rp 80.000.000 |
| AP A (PI USD) | Transaction Currency IDR, Exchange Rate 16.000; Allocate Full Amount; Cash/Bank Rp 36.000.000 | Sesuai requirement: 2.250 × 16.000 = 36.000.000. Kode saat ini: 2.250 × 15.500 = 34.875.000 |
| AP B (PI EUR) | Transaction Currency IDR, Exchange Rate 20.000; Allocate Full Amount; Cash/Bank Rp 80.000.000 | Sesuai requirement: 4.000 × 20.000 = 80.000.000. Kode saat ini: 4.000 × 19.000 = 76.000.000 |

## Langkah dan hasil yang harus terlihat

1. Login, pastikan company Lumi Charms.id.
2. AP A. Buat AP: Create; Supplier = PT. Supplier Multicurrency, Transaction Currency = IDR, Exchange Rate = 16.000; lanjut sampai halaman Edit.
3. Outstanding Purchase Invoice → PI-6968A3ED → Use → klik 'Allocate Full Amount (Clearing)' → simpan.
   - Catat angka Paid Amount di tabel Detail (rupiah) dan Utang di Summary.
4. Select Cash/Bank → centang 'Bank BCA Lumi Charms' → Use → Amount = 36.000.000 → simpan.
   - Cek Summary: Utang Rp 36.000.000,00; Cash / Bank Rp -36.000.000,00; Total Rp 0,00 warna normal.
5. AP B. Buat AP baru: Supplier sama, Transaction Currency = IDR, Exchange Rate = 20.000.
6. Use PI-6968A20D dengan 'Allocate Full Amount (Clearing)'; tambah Cash/Bank 'Bank BCA Lumi Charms' Amount = 80.000.000.
   - Cek Summary: Utang Rp 80.000.000,00; Cash / Bank Rp -80.000.000,00; Total Rp 0,00 warna normal.

## Hasil yang diharapkan

- AP A: Utang Rp 36.000.000,00 (2.250 × kurs header 16.000); Total Rp 0,00 normal.
- AP B: Utang Rp 80.000.000,00 (4.000 × kurs header 20.000); Total Rp 0,00 normal.
- Kode currency di Summary = IDR.

## Catatan QA

- Hasil yang diperkirakan saat ini (kurs PI dipakai): AP A Utang Rp 34.875.000,00 dan Total Rp -1.125.000,00 orange; AP B Utang Rp 76.000.000,00 dan Total Rp -4.000.000,00 orange. Kalau itu yang tampil, TC ini Failed dan terkait ETM-16703; tulis kedua angka di Actual Result.
- Kalau kamu mengetik sendiri to be Paid Amount (rupiah) tanpa Allocate Full Amount, Utang di Summary sama dengan angka yang diketik. Karena itu TC ini sengaja memakai Allocate Full Amount.
- Satu AP IDR hanya punya satu Exchange Rate, jadi PI USD dan PI EUR diuji di AP yang terpisah.
- PI valas tidak muncul di AP USD kalau currency-nya beda (misal PI EUR di AP USD), jadi skenario itu memang tidak bisa dibuat.
- Dokumen ini DRAFT (belum dijalankan). Hasil run dicatat di card ETM-16710.

## Pembersihan data (akhir tes)

- Hapus dokumen AP uji yang kamu buat (daftar Account Payment → pilih dokumen → Delete) supaya PI, Debit Note, dan saldo bank yang tertahan (reserved) dilepas dan bisa dipakai penguji lain. Dokumen yang sudah Approved tidak dihapus.
- Jangan menghapus dokumen uji milik orang lain (mis. PY-5UTD8RYM adalah bukti card ETM-16702).
- Simpan screenshot hasil (khususnya kotak Summary) sebagai bukti sebelum dokumen dihapus.
