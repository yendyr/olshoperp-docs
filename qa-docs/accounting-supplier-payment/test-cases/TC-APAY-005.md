---
doc_type: e2e-test-case
tc_code: TC-APAY-005
menu: accounting-supplier-payment
menu_name: "Account Payment"
test_type: edge
title: "Summary AP: Kurs header terkunci saat ada detail; setelah detail dikosongkan, Utang memakai kurs baru (edge)"
summary: "Ubah kurs header ditolak saat ada detail (Summary tetap); setelah detail dihapus kurs diganti 16.500 dan Utang dari PI IDR 100.000 berubah dari 6,25 menjadi 6,06 USD."
status: draft
owner: QA - Yemima
last_updated: 2026-10-22
requirement_ref: "qa-docs/accounting-supplier-payment/requirement.md §5.1 (Header locking) dan §9.5 (rate = header exchange rate)"
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
  - "PI-6968A510 (IDR 100.000) bebas: tombolnya 'Use' (bukan 'Already Prepared'). Kalau masih ditahan draft PY-5UTD6K2D (sisa uji TC lama), hapus draft itu dulu. Jangan hapus PY-5UTD8RYM (bukti ETM-16702)."
  - "Kerjakan setelah TC pembulatan Total selesai dan AP ujinya sudah dihapus (memakai PI yang sama)."
test_data:
  - field: "Data uji / Supplier"
    value: "PT. Supplier Multicurrency (kode SUPP019)"
  - field: "Data uji / Purchase Invoice"
    value: "PI-6968A510: IDR 100.000,00, Approved | https://staging.olshoperp.com/accounting/supplier-invoice/edit/162"
  - field: "Data uji / Cash/Bank"
    value: "BCA USD 2 - New 31 Dec 25 (USD) | Saldo tersedia USD 2.571,50 per 21-10-2026"
  - field: "Data uji / Kurs awal / kurs baru"
    value: "16.000 lalu 16.500 | Kurs bulat"
  - field: "Data uji / Hasil hitung (Allocate Full Amount)"
    value: "100.000 : 16.000 = 6,25 USD; 100.000 : 16.500 = 6,0606 USD | Cash/Bank untuk kurs baru: USD 6,06"
steps:
  - "Login, pastikan company Lumi Charms.id."
  - "Buat AP: Create; Supplier = PT. Supplier Multicurrency, Transaction Currency = USD, Exchange Rate = 16.000; lanjut sampai halaman Edit."
  - "Outstanding Purchase Invoice → PI-6968A510 → Use → klik 'Allocate Full Amount (Clearing)' → simpan. Cek Summary: Utang USD 6,25; Total USD 6,25 orange."
  - "Di Basic Information ubah Exchange Rate menjadi 16.500, klik Save All. Cek: Harus ditolak dengan pesan: 'Cannot edit Header when detail data exists. Please clear all details first.'. Cek: Summary tetap Utang USD 6,25. Muat ulang halaman: Exchange Rate masih 16.000."
  - "Hapus baris detail PI-6968A510 (ikon hapus di tabel Detail Account Payment). Cek Summary: semua USD 0,00; Total USD 0,00."
  - "Ubah Exchange Rate menjadi 16.500, klik Save All, lalu muat ulang halaman. Cek: Exchange Rate tersimpan 16.500."
  - "Use PI-6968A510 lagi dengan 'Allocate Full Amount (Clearing)'. Cek Summary: Utang USD 6,06 (bukan 6,25 dari kurs lama); Total USD 6,06 orange."
  - "Tambah Cash/Bank 'BCA USD 2 - New 31 Dec 25' Amount = 6,06. Cek Summary: Cash / Bank USD -6,06; Total USD 0,00 warna normal (selisih mentah 0,0006 dibulatkan)."
expected_result: |
  1. Selama ada detail, kurs tidak bisa diubah dan pesan penolakan tampil persis seperti di atas; Summary tidak berubah.
  2. Setelah detail dikosongkan, kurs baru tersimpan, dan Utang di Summary dihitung dengan kurs baru: 6,06 (bukan 6,25).
  3. Total 0,00 normal setelah Cash/Bank 6,06.
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

# Summary AP: Kurs header terkunci saat ada detail; setelah detail dikosongkan, Utang memakai kurs baru (edge)

Card: [ETM-16709](https://erpintegration.atlassian.net/browse/ETM-16709) (Test Case, edge) · card asal: [ETM-16643](https://erpintegration.atlassian.net/browse/ETM-16643) · TC terkait lama: ETM-16680 sampai ETM-16684 (TC-APAY-SUM-001 sampai 005)

## Retest cepat

1. Buat AP: Create; Supplier = PT. Supplier Multicurrency, Transaction Currency = USD, Exchange Rate = 16.000; lanjut sampai halaman Edit.
2. Outstanding Purchase Invoice → PI-6968A510 → Use → klik 'Allocate Full Amount (Clearing)' → simpan.
3. Di Basic Information ubah Exchange Rate menjadi 16.500, klik Save All.

## Data uji dari awal sampai akhir

Prasyarat umum:
- Akun uji QA yang punya akses menu Account Payment (Finance and Accounting → Account Payment). Login di https://staging.olshoperp.com/login.
- Company aktif harus **Lumi Charms.id**: klik avatar profil di pojok kanan atas → Switch Company → Lumi Charms.id → Proceed. Cara cek: daftar Account Payment memuat dokumen tanggal 21-10-2026 (mis. PY-5UTDC0FK). Kalau membuka halaman edit dokumen muncul 'You do not have access to this page', berarti company belum benar (data tes ini milik company Lumi Charms.id).
- Perbaikan ETM-16643 sudah ada di Staging. Cek di bagian paling bawah halaman: tulisan 'Last FE build' tanggal 21-10-2026 15:09 atau lebih baru, dan 'Last API build' 21-10-2026 16:19 atau lebih baru.
- Aturan isian: kolom 'to be Paid Amount (kode mata uang)' di form Use selalu dalam mata uang header AP (Transaction Currency), bukan mata uang invoice. Kolom 'to be Paid Amount' dan 'to be Paid Amount (IDR)' di sisi kanan hanya tampilan.
- PI-6968A510 (IDR 100.000) bebas: tombolnya 'Use' (bukan 'Already Prepared'). Kalau masih ditahan draft PY-5UTD6K2D (sisa uji TC lama), hapus draft itu dulu. Jangan hapus PY-5UTD8RYM (bukti ETM-16702).
- Kerjakan setelah TC pembulatan Total selesai dan AP ujinya sudah dihapus (memakai PI yang sama).

**Data uji (siapkan sebelum mulai)**

| Item | Nilai | Keterangan / link |
|---|---|---|
| Supplier | PT. Supplier Multicurrency (kode SUPP019) |  |
| Purchase Invoice | PI-6968A510: IDR 100.000,00, Approved | https://staging.olshoperp.com/accounting/supplier-invoice/edit/162 |
| Cash/Bank | BCA USD 2 - New 31 Dec 25 (USD) | Saldo tersedia USD 2.571,50 per 21-10-2026 |
| Kurs awal / kurs baru | 16.000 lalu 16.500 | Kurs bulat |
| Hasil hitung (Allocate Full Amount) | 100.000 : 16.000 = 6,25 USD; 100.000 : 16.500 = 6,0606 USD | Cash/Bank untuk kurs baru: USD 6,06 |

## Langkah dan hasil yang harus terlihat

1. Login, pastikan company Lumi Charms.id.
2. Buat AP: Create; Supplier = PT. Supplier Multicurrency, Transaction Currency = USD, Exchange Rate = 16.000; lanjut sampai halaman Edit.
3. Outstanding Purchase Invoice → PI-6968A510 → Use → klik 'Allocate Full Amount (Clearing)' → simpan.
   - Cek Summary: Utang USD 6,25; Total USD 6,25 orange.
4. Di Basic Information ubah Exchange Rate menjadi 16.500, klik Save All.
   - Harus ditolak dengan pesan: 'Cannot edit Header when detail data exists. Please clear all details first.'
   - Summary tetap Utang USD 6,25. Muat ulang halaman: Exchange Rate masih 16.000.
5. Hapus baris detail PI-6968A510 (ikon hapus di tabel Detail Account Payment).
   - Cek Summary: semua USD 0,00; Total USD 0,00.
6. Ubah Exchange Rate menjadi 16.500, klik Save All, lalu muat ulang halaman.
   - Exchange Rate tersimpan 16.500.
7. Use PI-6968A510 lagi dengan 'Allocate Full Amount (Clearing)'.
   - Cek Summary: Utang USD 6,06 (bukan 6,25 dari kurs lama); Total USD 6,06 orange.
8. Tambah Cash/Bank 'BCA USD 2 - New 31 Dec 25' Amount = 6,06.
   - Cek Summary: Cash / Bank USD -6,06; Total USD 0,00 warna normal (selisih mentah 0,0006 dibulatkan).

## Hasil yang diharapkan

- Selama ada detail, kurs tidak bisa diubah dan pesan penolakan tampil persis seperti di atas; Summary tidak berubah.
- Setelah detail dikosongkan, kurs baru tersimpan, dan Utang di Summary dihitung dengan kurs baru: 6,06 (bukan 6,25).
- Total 0,00 normal setelah Cash/Bank 6,06.

## Catatan QA

- Kalau pesan penolakan berbeda atau kurs ternyata bisa diubah saat ada detail, itu temuan terhadap aturan header locking.
- Dokumen ini DRAFT (belum dijalankan). Hasil run dicatat di card ETM-16709.

## Pembersihan data (akhir tes)

- Hapus dokumen AP uji yang kamu buat (daftar Account Payment → pilih dokumen → Delete) supaya PI, Debit Note, dan saldo bank yang tertahan (reserved) dilepas dan bisa dipakai penguji lain. Dokumen yang sudah Approved tidak dihapus.
- Jangan menghapus dokumen uji milik orang lain (mis. PY-5UTD8RYM adalah bukti card ETM-16702).
- Simpan screenshot hasil (khususnya kotak Summary) sebagai bukti sebelum dokumen dihapus.
