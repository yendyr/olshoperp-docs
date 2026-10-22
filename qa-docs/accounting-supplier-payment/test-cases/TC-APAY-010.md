---
doc_type: e2e-test-case
tc_code: TC-APAY-010
menu: accounting-supplier-payment
menu_name: "Account Payment"
test_type: regression
title: "Summary ikut berubah setelah tiap aksi tambah, ubah, hapus detail, source, dan adjustment tanpa reload (regression)"
summary: "AP IDR dengan 10 aksi satu per satu (berbeda dari TC-APAY-SUM-001 yang menggabungkan semua aksi dalam satu langkah): tiap aksi detail, source, dan adjustment langsung mengubah Summary (Total dari 1.000.000 orange sampai 0,00 normal), angka sama setelah reload."
status: draft
owner: QA - Yemima
last_updated: 2026-10-22
requirement_ref: "qa-docs/accounting-supplier-payment/requirement.md §9.5 dan card ETM-16643 (Summary ikut refresh saat Detail, Payment Source, Adjustment berubah)"
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
  - "Tidak ada dokumen AP lain yang menahan seluruh sisa PI-6954C3EA."
  - "Bank BCA Lumi Charms dan Petty Cash punya saldo tersedia di atas Rp 1.500.000 (lihat kolom Balance)."
test_data:
  - field: "Data uji / Supplier"
    value: "PT. Supplier IDR & Foreign (kode SUPP011)"
  - field: "Data uji / Purchase Invoice"
    value: "PI-6954C3EA: IDR 39.000.000,00, Approved | https://staging.olshoperp.com/accounting/supplier-invoice/edit/67"
  - field: "Data uji / Cash/Bank 1"
    value: "Bank BCA Lumi Charms (Bank, IDR) | Saldo tersedia sekitar Rp 173.163.000"
  - field: "Data uji / Cash/Bank 2"
    value: "Petty Cash (Cash, IDR) | Saldo tersedia sekitar Rp 199.410.143"
  - field: "Data uji / Akun Adjustment"
    value: "'Biaya Admin Bank' (kode 9-90001)"
  - field: "Data uji / Header AP"
    value: "Transaction Currency IDR, Exchange Rate 1"
  - field: "Rangkaian aksi dan Summary yang harus tampil / 1"
    value: "Use PI-6954C3EA, to be Paid Amount (IDR) 1.000.000 | 1.000.000,00 | 0,00 | 0,00 | 1.000.000,00 | Orange"
  - field: "Rangkaian aksi dan Summary yang harus tampil / 2"
    value: "Cash/Bank Bank BCA Lumi Charms, Amount 1.000.000 | 1.000.000,00 | -1.000.000,00 | 0,00 | 0,00 | Normal"
  - field: "Rangkaian aksi dan Summary yang harus tampil / 3"
    value: "Ubah Paid Amount menjadi 1.200.000 | 1.200.000,00 | -1.000.000,00 | 0,00 | 200.000,00 | Orange"
  - field: "Rangkaian aksi dan Summary yang harus tampil / 4"
    value: "Adjustment Debit 50.000 (Biaya Admin Bank) | 1.200.000,00 | -1.000.000,00 | 50.000,00 | 250.000,00 | Orange"
  - field: "Rangkaian aksi dan Summary yang harus tampil / 5"
    value: "Edit Adjustment menjadi Debit 70.000 | 1.200.000,00 | -1.000.000,00 | 70.000,00 | 270.000,00 | Orange"
  - field: "Rangkaian aksi dan Summary yang harus tampil / 6"
    value: "Hapus Adjustment | 1.200.000,00 | -1.000.000,00 | 0,00 | 200.000,00 | Orange"
  - field: "Rangkaian aksi dan Summary yang harus tampil / 7"
    value: "Tambah Cash/Bank Petty Cash, Amount 200.000 | 1.200.000,00 | -1.200.000,00 | 0,00 | 0,00 | Normal"
  - field: "Rangkaian aksi dan Summary yang harus tampil / 8"
    value: "Hapus baris Petty Cash | 1.200.000,00 | -1.000.000,00 | 0,00 | 200.000,00 | Orange"
  - field: "Rangkaian aksi dan Summary yang harus tampil / 9"
    value: "Hapus baris detail PI-6954C3EA | 0,00 | -1.000.000,00 | 0,00 | -1.000.000,00 | Orange"
  - field: "Rangkaian aksi dan Summary yang harus tampil / 10"
    value: "Hapus baris Bank BCA Lumi Charms | 0,00 | 0,00 | 0,00 | 0,00 | Normal"
steps:
  - "Login, pastikan company Lumi Charms.id. Buat AP: Create; Supplier = PT. Supplier IDR & Foreign, Transaction Currency = IDR, Exchange Rate = 1; lanjut sampai halaman Edit. Biarkan section Summary terlihat di layar (atau scroll bolak-balik tanpa reload)."
  - "Jalankan aksi nomor 1 sampai 10 pada tabel 'Rangkaian aksi' satu per satu. Setelah tiap aksi tunggu sampai angka Summary berhenti menampilkan '-' (sedang memuat), lalu bandingkan dengan tabel. Cek: Aksi tambah detail: Outstanding Purchase Invoice → Use. Ubah detail: klik angka Paid Amount, ketik, Enter. Hapus detail: ikon hapus di tabel Detail. Cek: Aksi source: Select Cash/Bank → centang → Use → Amount → simpan; hapus: ikon hapus di tabel Payment Source. Cek: Aksi Adjustment: pilih Account, isi Debit (IDR), Save; edit atau hapus lewat kolom Action tabel Adjustment."
  - "Setelah aksi 10 muat ulang halaman (F5). Cek: Semua baris Summary 0,00 dan Total 0,00 normal (sama dengan sebelum reload)."
expected_result: |
  1. Setelah tiap aksi 1 sampai 10, angka Summary dan warna Total sama persis dengan tabel 'Rangkaian aksi', tanpa perlu reload.
  2. Tidak ada aksi yang membuat Summary tertinggal (angka lama) atau macet di tanda '-'.
  3. Total negatif (aksi 9) tampil orange.
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

# Summary ikut berubah setelah tiap aksi tambah, ubah, hapus detail, source, dan adjustment tanpa reload (regression)

Card: [ETM-16714](https://erpintegration.atlassian.net/browse/ETM-16714) (Test Case, regression) · card asal: [ETM-16643](https://erpintegration.atlassian.net/browse/ETM-16643) · TC terkait lama: ETM-16680 sampai ETM-16684 (TC-APAY-SUM-001 sampai 005)

## Retest cepat

1. Jalankan aksi nomor 1 sampai 10 pada tabel 'Rangkaian aksi' satu per satu. Setelah tiap aksi tunggu sampai angka Summary berhenti menampilkan '-' (sedang memuat), lalu bandingkan dengan tabel.
2. Setelah aksi 10 muat ulang halaman (F5).

## Data uji dari awal sampai akhir

Prasyarat umum:
- Akun uji QA yang punya akses menu Account Payment (Finance and Accounting → Account Payment). Login di https://staging.olshoperp.com/login.
- Company aktif harus **Lumi Charms.id**: klik avatar profil di pojok kanan atas → Switch Company → Lumi Charms.id → Proceed. Cara cek: daftar Account Payment memuat dokumen tanggal 21-10-2026 (mis. PY-5UTDC0FK). Kalau membuka halaman edit dokumen muncul 'You do not have access to this page', berarti company belum benar (data tes ini milik company Lumi Charms.id).
- Perbaikan ETM-16643 sudah ada di Staging. Cek di bagian paling bawah halaman: tulisan 'Last FE build' tanggal 21-10-2026 15:09 atau lebih baru, dan 'Last API build' 21-10-2026 16:19 atau lebih baru.
- Aturan isian: kolom 'to be Paid Amount (kode mata uang)' di form Use selalu dalam mata uang header AP (Transaction Currency), bukan mata uang invoice. Kolom 'to be Paid Amount' dan 'to be Paid Amount (IDR)' di sisi kanan hanya tampilan.
- Tidak ada dokumen AP lain yang menahan seluruh sisa PI-6954C3EA.
- Bank BCA Lumi Charms dan Petty Cash punya saldo tersedia di atas Rp 1.500.000 (lihat kolom Balance).

**Data uji (siapkan sebelum mulai)**

| Item | Nilai | Keterangan / link |
|---|---|---|
| Supplier | PT. Supplier IDR & Foreign (kode SUPP011) |  |
| Purchase Invoice | PI-6954C3EA: IDR 39.000.000,00, Approved | https://staging.olshoperp.com/accounting/supplier-invoice/edit/67 |
| Cash/Bank 1 | Bank BCA Lumi Charms (Bank, IDR) | Saldo tersedia sekitar Rp 173.163.000 |
| Cash/Bank 2 | Petty Cash (Cash, IDR) | Saldo tersedia sekitar Rp 199.410.143 |
| Akun Adjustment | 'Biaya Admin Bank' (kode 9-90001) |  |
| Header AP | Transaction Currency IDR, Exchange Rate 1 |  |

**Rangkaian aksi dan Summary yang harus tampil**

| No | Aksi | Utang | Cash / Bank | Adj Debit | Total | Warna Total |
|---|---|---|---|---|---|---|
| 1 | Use PI-6954C3EA, to be Paid Amount (IDR) 1.000.000 | 1.000.000,00 | 0,00 | 0,00 | 1.000.000,00 | Orange |
| 2 | Cash/Bank Bank BCA Lumi Charms, Amount 1.000.000 | 1.000.000,00 | -1.000.000,00 | 0,00 | 0,00 | Normal |
| 3 | Ubah Paid Amount menjadi 1.200.000 | 1.200.000,00 | -1.000.000,00 | 0,00 | 200.000,00 | Orange |
| 4 | Adjustment Debit 50.000 (Biaya Admin Bank) | 1.200.000,00 | -1.000.000,00 | 50.000,00 | 250.000,00 | Orange |
| 5 | Edit Adjustment menjadi Debit 70.000 | 1.200.000,00 | -1.000.000,00 | 70.000,00 | 270.000,00 | Orange |
| 6 | Hapus Adjustment | 1.200.000,00 | -1.000.000,00 | 0,00 | 200.000,00 | Orange |
| 7 | Tambah Cash/Bank Petty Cash, Amount 200.000 | 1.200.000,00 | -1.200.000,00 | 0,00 | 0,00 | Normal |
| 8 | Hapus baris Petty Cash | 1.200.000,00 | -1.000.000,00 | 0,00 | 200.000,00 | Orange |
| 9 | Hapus baris detail PI-6954C3EA | 0,00 | -1.000.000,00 | 0,00 | -1.000.000,00 | Orange |
| 10 | Hapus baris Bank BCA Lumi Charms | 0,00 | 0,00 | 0,00 | 0,00 | Normal |

## Langkah dan hasil yang harus terlihat

1. Login, pastikan company Lumi Charms.id. Buat AP: Create; Supplier = PT. Supplier IDR & Foreign, Transaction Currency = IDR, Exchange Rate = 1; lanjut sampai halaman Edit. Biarkan section Summary terlihat di layar (atau scroll bolak-balik tanpa reload).
2. Jalankan aksi nomor 1 sampai 10 pada tabel 'Rangkaian aksi' satu per satu. Setelah tiap aksi tunggu sampai angka Summary berhenti menampilkan '-' (sedang memuat), lalu bandingkan dengan tabel.
   - Aksi tambah detail: Outstanding Purchase Invoice → Use. Ubah detail: klik angka Paid Amount, ketik, Enter. Hapus detail: ikon hapus di tabel Detail.
   - Aksi source: Select Cash/Bank → centang → Use → Amount → simpan; hapus: ikon hapus di tabel Payment Source.
   - Aksi Adjustment: pilih Account, isi Debit (IDR), Save; edit atau hapus lewat kolom Action tabel Adjustment.
3. Setelah aksi 10 muat ulang halaman (F5).
   - Semua baris Summary 0,00 dan Total 0,00 normal (sama dengan sebelum reload).

## Hasil yang diharapkan

- Setelah tiap aksi 1 sampai 10, angka Summary dan warna Total sama persis dengan tabel 'Rangkaian aksi', tanpa perlu reload.
- Tidak ada aksi yang membuat Summary tertinggal (angka lama) atau macet di tanda '-'.
- Total negatif (aksi 9) tampil orange.

## Catatan QA

- TC ini memecah langkah 3 pada TC-APAY-SUM-001 yang menggabungkan semua aksi dalam satu langkah. Fokusnya memastikan setiap jalur aksi memicu pembaruan Summary. Berbeda dari TC-APAY-SUM-001: setiap aksi diuji satu per satu dengan angka yang harus tampil, jadi bukan duplikat.
- Kalau ada aksi yang tidak memperbarui Summary, catat nomor aksinya.
- Dokumen ini DRAFT (belum dijalankan). Hasil run dicatat di card ETM-16714.

## Pembersihan data (akhir tes)

- Hapus dokumen AP uji yang kamu buat (daftar Account Payment → pilih dokumen → Delete) supaya PI, Debit Note, dan saldo bank yang tertahan (reserved) dilepas dan bisa dipakai penguji lain. Dokumen yang sudah Approved tidak dihapus.
- Jangan menghapus dokumen uji milik orang lain (mis. PY-5UTD8RYM adalah bukti card ETM-16702).
- Simpan screenshot hasil (khususnya kotak Summary) sebagai bukti sebelum dokumen dihapus.
