---
doc_type: e2e-test-case
tc_code: TC-APAY-009
menu: accounting-supplier-payment
menu_name: "Account Payment"
test_type: regression
title: "Summary tampil di dokumen Approved (IDR dan USD) dan belum tampil saat Create (regression)"
summary: "Summary pada AP Approved PY-5TVBFUBZ (IDR), PY-695CD958 (USD, Cash dan DN), PY-695DBA18 (USD, DN saja) bernilai Total 0,00 dan read-only; halaman Create belum menampilkan Summary."
status: draft
owner: QA - Yemima
last_updated: 2026-10-22
requirement_ref: "qa-docs/accounting-supplier-payment/requirement.md §9.5 (Mode: Show dan Edit, bukan Create sebelum header ada; read-only) dan §16.1 (urutan section)"
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
  - "Dokumen Approved di bawah hanya dibuka dan dibaca. Jangan mengubah isinya."
test_data:
  - field: "Data uji / PY-5TVBFUBZ (IDR) https://staging.olshoperp.com/accounting/supplier-payment/edit/3105"
    value: "Supplier PT. Unbilled Goods; PI-6960CB30 Rp 4.000,00; Cash/Bank Bank BCA 001 Rp 4.000,00; tanggal 20-07-2026 | Utang Rp 4.000,00; Cash / Bank Rp -4.000,00; Debit Note 0,00; Adj Debit 0,00; Adj Credit 0,00; Total Rp 0,00"
  - field: "Data uji / PY-695CD958 (USD) https://staging.olshoperp.com/accounting/supplier-payment/edit/433"
    value: "Kurs 14.500; PI-695CDD2F USD 2.000,00; Cash/Bank USD 1.000,00; Debit Note USD 1.000,00; tanggal 06-01-2026 | Utang USD 2.000,00; Cash / Bank USD -1.000,00; Debit Note USD -1.000,00; Adj 0,00; Total USD 0,00"
  - field: "Data uji / PY-695DBA18 (USD) https://staging.olshoperp.com/accounting/supplier-payment/edit/436"
    value: "Kurs 12.000; PI-695DB9C4 USD 500,00; Debit Note USD 500,00 (tanpa Cash/Bank); tanggal 07-01-2026 | Utang USD 500,00; Cash / Bank USD 0,00; Debit Note USD -500,00; Adj 0,00; Total USD 0,00"
steps:
  - "Login, pastikan company Lumi Charms.id."
  - "Buka Account Payment → Create (https://staging.olshoperp.com/accounting/supplier-payment/create). Selama dokumen belum tersimpan (Transaction Code belum terisi PY-…), lihat sidenav dan seluruh halaman. Cek: Section Summary belum ada (belum ada dokumen). Yang tampil hanya Basic Information (dan section lain sesuai layar Create)."
  - "Isi Supplier, Transaction Currency, Exchange Rate hingga dokumen tersimpan dan masuk halaman Edit. Cek: Section Summary muncul setelah Adjustment (sebelum Approval dan Audit Log). Semua baris 0,00 dan Total 0,00 normal."
  - "Hapus dokumen uji itu dari daftar (bukan dokumen Approved di bawah)."
  - "Buka PY-5TVBFUBZ (link di tabel data uji). Cek urutan sidenav: Basic Information, Account Payment Source, Detail Account Payment, Adjustment, Summary, Approval, Audit Log. Cek: Summary sesuai tabel; tidak ada kolom input atau tombol di kotak Summary."
  - "Buka PY-695CD958 dan PY-695DBA18, baca Summary masing-masing. Cek: Angka sesuai tabel data uji; kode currency USD."
  - "Muat ulang tiap halaman. Cek: Angka Summary tidak berubah."
expected_result: |
  1. Halaman Create (belum tersimpan) tidak menampilkan Summary; setelah dokumen tersimpan Summary muncul setelah Adjustment dengan semua angka 0,00.
  2. Pada dokumen Approved Summary tampil read-only, urutan section benar, dan angka sama dengan tabel data uji (Total 0,00 normal untuk ketiganya).
  3. Kode currency di Summary mengikuti dokumen: IDR untuk PY-5TVBFUBZ, USD untuk dua dokumen lain.
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

# Summary tampil di dokumen Approved (IDR dan USD) dan belum tampil saat Create (regression)

Card: [ETM-16713](https://erpintegration.atlassian.net/browse/ETM-16713) (Test Case, regression) · card asal: [ETM-16643](https://erpintegration.atlassian.net/browse/ETM-16643) · TC terkait lama: ETM-16680 sampai ETM-16684 (TC-APAY-SUM-001 sampai 005)

## Retest cepat

1. Buka Account Payment → Create (https://staging.olshoperp.com/accounting/supplier-payment/create). Selama dokumen belum tersimpan (Transaction Code belum terisi PY-…), lihat sidenav dan seluruh halaman.
2. Isi Supplier, Transaction Currency, Exchange Rate hingga dokumen tersimpan dan masuk halaman Edit.
3. Hapus dokumen uji itu dari daftar (bukan dokumen Approved di bawah).

## Data uji dari awal sampai akhir

Prasyarat umum:
- Akun uji QA yang punya akses menu Account Payment (Finance and Accounting → Account Payment). Login di https://staging.olshoperp.com/login.
- Company aktif harus **Lumi Charms.id**: klik avatar profil di pojok kanan atas → Switch Company → Lumi Charms.id → Proceed. Cara cek: daftar Account Payment memuat dokumen tanggal 21-10-2026 (mis. PY-5UTDC0FK). Kalau membuka halaman edit dokumen muncul 'You do not have access to this page', berarti company belum benar (data tes ini milik company Lumi Charms.id).
- Perbaikan ETM-16643 sudah ada di Staging. Cek di bagian paling bawah halaman: tulisan 'Last FE build' tanggal 21-10-2026 15:09 atau lebih baru, dan 'Last API build' 21-10-2026 16:19 atau lebih baru.
- Aturan isian: kolom 'to be Paid Amount (kode mata uang)' di form Use selalu dalam mata uang header AP (Transaction Currency), bukan mata uang invoice. Kolom 'to be Paid Amount' dan 'to be Paid Amount (IDR)' di sisi kanan hanya tampilan.
- Dokumen Approved di bawah hanya dibuka dan dibaca. Jangan mengubah isinya.

**Data uji (siapkan sebelum mulai)**

| Dokumen Approved | Isi dokumen | Summary yang harus tampil |
|---|---|---|
| PY-5TVBFUBZ (IDR) https://staging.olshoperp.com/accounting/supplier-payment/edit/3105 | Supplier PT. Unbilled Goods; PI-6960CB30 Rp 4.000,00; Cash/Bank Bank BCA 001 Rp 4.000,00; tanggal 20-07-2026 | Utang Rp 4.000,00; Cash / Bank Rp -4.000,00; Debit Note 0,00; Adj Debit 0,00; Adj Credit 0,00; Total Rp 0,00 |
| PY-695CD958 (USD) https://staging.olshoperp.com/accounting/supplier-payment/edit/433 | Kurs 14.500; PI-695CDD2F USD 2.000,00; Cash/Bank USD 1.000,00; Debit Note USD 1.000,00; tanggal 06-01-2026 | Utang USD 2.000,00; Cash / Bank USD -1.000,00; Debit Note USD -1.000,00; Adj 0,00; Total USD 0,00 |
| PY-695DBA18 (USD) https://staging.olshoperp.com/accounting/supplier-payment/edit/436 | Kurs 12.000; PI-695DB9C4 USD 500,00; Debit Note USD 500,00 (tanpa Cash/Bank); tanggal 07-01-2026 | Utang USD 500,00; Cash / Bank USD 0,00; Debit Note USD -500,00; Adj 0,00; Total USD 0,00 |

## Langkah dan hasil yang harus terlihat

1. Login, pastikan company Lumi Charms.id.
2. Buka Account Payment → Create (https://staging.olshoperp.com/accounting/supplier-payment/create). Selama dokumen belum tersimpan (Transaction Code belum terisi PY-…), lihat sidenav dan seluruh halaman.
   - Section Summary belum ada (belum ada dokumen). Yang tampil hanya Basic Information (dan section lain sesuai layar Create).
3. Isi Supplier, Transaction Currency, Exchange Rate hingga dokumen tersimpan dan masuk halaman Edit.
   - Section Summary muncul setelah Adjustment (sebelum Approval dan Audit Log). Semua baris 0,00 dan Total 0,00 normal.
4. Hapus dokumen uji itu dari daftar (bukan dokumen Approved di bawah).
5. Buka PY-5TVBFUBZ (link di tabel data uji).
   - Cek urutan sidenav: Basic Information, Account Payment Source, Detail Account Payment, Adjustment, Summary, Approval, Audit Log.
   - Summary sesuai tabel; tidak ada kolom input atau tombol di kotak Summary.
6. Buka PY-695CD958 dan PY-695DBA18, baca Summary masing-masing.
   - Angka sesuai tabel data uji; kode currency USD.
7. Muat ulang tiap halaman.
   - Angka Summary tidak berubah.

## Hasil yang diharapkan

- Halaman Create (belum tersimpan) tidak menampilkan Summary; setelah dokumen tersimpan Summary muncul setelah Adjustment dengan semua angka 0,00.
- Pada dokumen Approved Summary tampil read-only, urutan section benar, dan angka sama dengan tabel data uji (Total 0,00 normal untuk ketiganya).
- Kode currency di Summary mengikuti dokumen: IDR untuk PY-5TVBFUBZ, USD untuk dua dokumen lain.

## Catatan QA

- Requirement menyebut mode 'Show dan Edit'. Kalau Approved ternyata tidak punya Summary, atau Summary tampil di halaman Create, tulis sebagai temuan.
- Jika angka berbeda tipis (mis. 0,01) catat sebagai Actual; jangan ubah dokumen Approved.
- Sistem bisa langsung menyimpan otomatis saat Create dibuka (kolom Supplier, Currency, Exchange Rate terisi dari transaksi terakhir). Kalau Transaction Code langsung terisi, bagian 'belum tampil saat Create' tidak bisa diamati: tulis 'tidak teramati' di Actual Result dan lanjut ke langkah berikutnya.
- Dokumen ini DRAFT (belum dijalankan). Hasil run dicatat di card ETM-16713.

## Pembersihan data (akhir tes)

- Hapus dokumen AP uji yang kamu buat (daftar Account Payment → pilih dokumen → Delete) supaya PI, Debit Note, dan saldo bank yang tertahan (reserved) dilepas dan bisa dipakai penguji lain. Dokumen yang sudah Approved tidak dihapus.
- Jangan menghapus dokumen uji milik orang lain (mis. PY-5UTD8RYM adalah bukti card ETM-16702).
- Simpan screenshot hasil (khususnya kotak Summary) sebagai bukti sebelum dokumen dihapus.
