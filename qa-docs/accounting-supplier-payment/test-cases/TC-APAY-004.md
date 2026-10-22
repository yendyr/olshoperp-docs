---
doc_type: e2e-test-case
tc_code: TC-APAY-004
menu: accounting-supplier-payment
menu_name: "Account Payment"
test_type: edge
title: "Summary Total dibulatkan 2 desimal: selisih kecil tidak orange dan tanpa tanda minus nol, selisih 0,01 orange (edge)"
summary: "AP USD kurs 15.900 melunasi PI IDR 100.000 (Allocate Full Amount): Utang 6,29; Cash/Bank 6,29 → Total 0,00 normal tanpa minus; 6,28 → 0,01 orange; 6,30 → -0,01 orange; bagian B kurs 16.234,50 setelah ETM-16702 diperbaiki."
status: draft
owner: QA - Yemima
last_updated: 2026-10-22
requirement_ref: "qa-docs/accounting-supplier-payment/requirement.md §9.5 (Desimal 2 digit; Total ideal 0,00, orange bila tidak nol) dan card ETM-16643 AC 'Total 2 desimal; Total ≠ 0 → orange'"
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
  - "PI-6968A510 (IDR 100.000) sedang ditahan draft PY-5UTD6K2D (sisa uji TC lama; bukti-nya sudah tersimpan di Drive). Hapus draft itu dulu, atau pastikan di Outstanding Purchase Invoice tombol PI-6968A510 bertuliskan 'Use' (bukan 'Already Prepared'). Jangan hapus PY-5UTD8RYM (bukti ETM-16702)."
  - "Untuk Bagian B: bug ETM-16702 (kurs berdesimal tersimpan salah) sudah diperbaiki. Kalau belum, kerjakan Bagian A saja dan tulis Bagian B sebagai Blocked."
  - "TC ini dan TC kurs header (card berikutnya) memakai PI yang sama. Kerjakan satu per satu dan hapus AP uji sebelum lanjut."
test_data:
  - field: "Data uji / Supplier"
    value: "PT. Supplier Multicurrency (kode SUPP019)"
  - field: "Data uji / Purchase Invoice"
    value: "PI-6968A510: IDR 100.000,00, kurs 1, tanggal 15-01-2026, Approved, belum dibayar | https://staging.olshoperp.com/accounting/supplier-invoice/edit/162"
  - field: "Data uji / Cash/Bank"
    value: "BCA USD 2 - New 31 Dec 25 (USD) | Saldo tersedia USD 2.571,50 per 21-10-2026. Butuh minimal USD 6,30"
  - field: "Data uji / Header AP (Bagian A)"
    value: "Transaction Currency USD, Exchange Rate 15.900 | Kurs bulat. Kurs ini dipilih supaya hasil bagi 100.000 : 15.900 = 6,2893 (berpecahan)"
  - field: "Data uji / Header AP (Bagian B)"
    value: "Transaction Currency USD, Exchange Rate 16.234,50 | Hanya dikerjakan setelah ETM-16702 diperbaiki. 100.000 : 16.234,50 = 6,1597"
  - field: "Tabel hitungan Bagian A / 6,29"
    value: "6,29 | 0,00 (selisih mentah -0,0007; tidak boleh tertulis '-0,00') | Normal"
  - field: "Tabel hitungan Bagian A / 6,28"
    value: "6,29 | 0,01 (selisih mentah 0,0093) | Orange"
  - field: "Tabel hitungan Bagian A / 6,30"
    value: "6,29 | -0,01 (selisih mentah -0,0107) | Orange"
  - field: "Hitungan Bagian B / 6,16"
    value: "6,16 (6,1597) | 0,00 (selisih mentah -0,0003) | Normal"
steps:
  - "Login, lalu pastikan company aktif Lumi Charms.id."
  - "BAGIAN A. Buat AP: Account Payment → Create; Supplier = PT. Supplier Multicurrency, Transaction Currency = USD, Exchange Rate = 15.900. Lanjutkan sampai halaman Edit."
  - "Di Detail Account Payment klik Outstanding Purchase Invoice. Pada baris PI-6968A510 klik Use, lalu klik tombol 'Allocate Full Amount (Clearing)' dan simpan. Cek tabel Detail: Paid Amount PI-6968A510 = 6,29 (USD). Cek Summary: Utang USD 6,29; Total USD 6,29 orange."
  - "Di Account Payment Source: Select Cash/Bank → centang 'BCA USD 2 - New 31 Dec 25' → Use → Amount = 6,29 → simpan. Cek Summary: Cash / Bank USD -6,29; Total USD 0,00 warna normal dan tertulis 0,00, bukan -0,00."
  - "Hapus baris Cash/Bank tadi (ikon hapus di tabel Payment Source), lalu tambah lagi dengan Amount = 6,28. Cek Summary: Total USD 0,01 berwarna orange."
  - "Hapus lagi baris Cash/Bank, lalu tambah dengan Amount = 6,30. Cek Summary: Total USD -0,01 berwarna orange."
  - "Hapus dokumen AP uji Bagian A (supaya PI-6968A510 bebas)."
  - "BAGIAN B (setelah ETM-16702 diperbaiki). Buat AP baru: Supplier sama, Transaction Currency = USD, Exchange Rate = 16.234,50. Setelah tersimpan, buka ulang dan cek field Exchange Rate. Cek: Harus tampil 16.234,50 (bukan 162.345)."
  - "Use PI-6968A510 dengan 'Allocate Full Amount (Clearing)'; tambah Cash/Bank 'BCA USD 2 - New 31 Dec 25' Amount = 6,16. Cek Summary: Utang USD 6,16; Cash / Bank USD -6,16; Total USD 0,00 warna normal."
expected_result: |
  1. Total selalu tampil 2 desimal. Selisih mentah di bawah 0,005 (contoh -0,0007) tampil '0,00', warna normal, dan tidak pernah tampil '-0,00'.
  2. Selisih 0,01 (positif) dan -0,01 (negatif) tampil orange.
  3. Utang dan baris lain juga tampil 2 desimal (6,2893 tampil 6,29).
  4. Bagian B: kurs 16.234,50 tersimpan utuh; Total 0,00 normal walau hasil bagi mentah 6,1597 dan Cash/Bank 6,16.
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

# Summary Total dibulatkan 2 desimal: selisih kecil tidak orange dan tanpa tanda minus nol, selisih 0,01 orange (edge)

Card: [ETM-16708](https://erpintegration.atlassian.net/browse/ETM-16708) (Test Case, edge) · card asal: [ETM-16643](https://erpintegration.atlassian.net/browse/ETM-16643) · TC terkait lama: ETM-16680 sampai ETM-16684 (TC-APAY-SUM-001 sampai 005)

## Retest cepat

1. BAGIAN A. Buat AP: Account Payment → Create; Supplier = PT. Supplier Multicurrency, Transaction Currency = USD, Exchange Rate = 15.900. Lanjutkan sampai halaman Edit.
2. Di Detail Account Payment klik Outstanding Purchase Invoice. Pada baris PI-6968A510 klik Use, lalu klik tombol 'Allocate Full Amount (Clearing)' dan simpan.
3. Di Account Payment Source: Select Cash/Bank → centang 'BCA USD 2 - New 31 Dec 25' → Use → Amount = 6,29 → simpan.

## Data uji dari awal sampai akhir

Prasyarat umum:
- Akun uji QA yang punya akses menu Account Payment (Finance and Accounting → Account Payment). Login di https://staging.olshoperp.com/login.
- Company aktif harus **Lumi Charms.id**: klik avatar profil di pojok kanan atas → Switch Company → Lumi Charms.id → Proceed. Cara cek: daftar Account Payment memuat dokumen tanggal 21-10-2026 (mis. PY-5UTDC0FK). Kalau membuka halaman edit dokumen muncul 'You do not have access to this page', berarti company belum benar (data tes ini milik company Lumi Charms.id).
- Perbaikan ETM-16643 sudah ada di Staging. Cek di bagian paling bawah halaman: tulisan 'Last FE build' tanggal 21-10-2026 15:09 atau lebih baru, dan 'Last API build' 21-10-2026 16:19 atau lebih baru.
- Aturan isian: kolom 'to be Paid Amount (kode mata uang)' di form Use selalu dalam mata uang header AP (Transaction Currency), bukan mata uang invoice. Kolom 'to be Paid Amount' dan 'to be Paid Amount (IDR)' di sisi kanan hanya tampilan.
- PI-6968A510 (IDR 100.000) sedang ditahan draft PY-5UTD6K2D (sisa uji TC lama; bukti-nya sudah tersimpan di Drive). Hapus draft itu dulu, atau pastikan di Outstanding Purchase Invoice tombol PI-6968A510 bertuliskan 'Use' (bukan 'Already Prepared'). Jangan hapus PY-5UTD8RYM (bukti ETM-16702).
- Untuk Bagian B: bug ETM-16702 (kurs berdesimal tersimpan salah) sudah diperbaiki. Kalau belum, kerjakan Bagian A saja dan tulis Bagian B sebagai Blocked.
- TC ini dan TC kurs header (card berikutnya) memakai PI yang sama. Kerjakan satu per satu dan hapus AP uji sebelum lanjut.

**Data uji (siapkan sebelum mulai)**

| Item | Nilai | Keterangan / link |
|---|---|---|
| Supplier | PT. Supplier Multicurrency (kode SUPP019) |  |
| Purchase Invoice | PI-6968A510: IDR 100.000,00, kurs 1, tanggal 15-01-2026, Approved, belum dibayar | https://staging.olshoperp.com/accounting/supplier-invoice/edit/162 |
| Cash/Bank | BCA USD 2 - New 31 Dec 25 (USD) | Saldo tersedia USD 2.571,50 per 21-10-2026. Butuh minimal USD 6,30 |
| Header AP (Bagian A) | Transaction Currency USD, Exchange Rate 15.900 | Kurs bulat. Kurs ini dipilih supaya hasil bagi 100.000 : 15.900 = 6,2893 (berpecahan) |
| Header AP (Bagian B) | Transaction Currency USD, Exchange Rate 16.234,50 | Hanya dikerjakan setelah ETM-16702 diperbaiki. 100.000 : 16.234,50 = 6,1597 |

**Tabel hitungan Bagian A (Utang = 6,2893 dari Allocate Full Amount)**

| Amount Cash/Bank | Utang tampil | Total tampil | Warna Total |
|---|---|---|---|
| 6,29 | 6,29 | 0,00 (selisih mentah -0,0007; tidak boleh tertulis '-0,00') | Normal |
| 6,28 | 6,29 | 0,01 (selisih mentah 0,0093) | Orange |
| 6,30 | 6,29 | -0,01 (selisih mentah -0,0107) | Orange |

**Hitungan Bagian B**

| Amount Cash/Bank | Utang tampil | Total tampil | Warna Total |
|---|---|---|---|
| 6,16 | 6,16 (6,1597) | 0,00 (selisih mentah -0,0003) | Normal |

## Langkah dan hasil yang harus terlihat

1. Login, lalu pastikan company aktif Lumi Charms.id.
2. BAGIAN A. Buat AP: Account Payment → Create; Supplier = PT. Supplier Multicurrency, Transaction Currency = USD, Exchange Rate = 15.900. Lanjutkan sampai halaman Edit.
3. Di Detail Account Payment klik Outstanding Purchase Invoice. Pada baris PI-6968A510 klik Use, lalu klik tombol 'Allocate Full Amount (Clearing)' dan simpan.
   - Cek tabel Detail: Paid Amount PI-6968A510 = 6,29 (USD).
   - Cek Summary: Utang USD 6,29; Total USD 6,29 orange.
4. Di Account Payment Source: Select Cash/Bank → centang 'BCA USD 2 - New 31 Dec 25' → Use → Amount = 6,29 → simpan.
   - Cek Summary: Cash / Bank USD -6,29; Total USD 0,00 warna normal dan tertulis 0,00, bukan -0,00.
5. Hapus baris Cash/Bank tadi (ikon hapus di tabel Payment Source), lalu tambah lagi dengan Amount = 6,28.
   - Cek Summary: Total USD 0,01 berwarna orange.
6. Hapus lagi baris Cash/Bank, lalu tambah dengan Amount = 6,30.
   - Cek Summary: Total USD -0,01 berwarna orange.
7. Hapus dokumen AP uji Bagian A (supaya PI-6968A510 bebas).
8. BAGIAN B (setelah ETM-16702 diperbaiki). Buat AP baru: Supplier sama, Transaction Currency = USD, Exchange Rate = 16.234,50. Setelah tersimpan, buka ulang dan cek field Exchange Rate.
   - Harus tampil 16.234,50 (bukan 162.345).
9. Use PI-6968A510 dengan 'Allocate Full Amount (Clearing)'; tambah Cash/Bank 'BCA USD 2 - New 31 Dec 25' Amount = 6,16.
   - Cek Summary: Utang USD 6,16; Cash / Bank USD -6,16; Total USD 0,00 warna normal.

## Hasil yang diharapkan

- Total selalu tampil 2 desimal. Selisih mentah di bawah 0,005 (contoh -0,0007) tampil '0,00', warna normal, dan tidak pernah tampil '-0,00'.
- Selisih 0,01 (positif) dan -0,01 (negatif) tampil orange.
- Utang dan baris lain juga tampil 2 desimal (6,2893 tampil 6,29).
- Bagian B: kurs 16.234,50 tersimpan utuh; Total 0,00 normal walau hasil bagi mentah 6,1597 dan Cash/Bank 6,16.

## Catatan QA

- Kalau Total 0,00 tapi masih berwarna orange (atau tertulis -0,00) itu temuan: catat angka dan screenshot.
- Bagian B ini yang dimaksud TC lama ETM-16682, yang tidak bisa dilanjutkan karena bug kurs desimal (ETM-16702).
- Utang berpecahan hanya muncul lewat 'Allocate Full Amount (Clearing)'. Kalau kamu mengetik to be Paid Amount (USD) sendiri, Utang sama persis dengan angka yang diketik sehingga tidak ada selisih pecahan.
- Dokumen ini DRAFT (belum dijalankan). Hasil run dicatat di card ETM-16708.

## Pembersihan data (akhir tes)

- Hapus dokumen AP uji yang kamu buat (daftar Account Payment → pilih dokumen → Delete) supaya PI, Debit Note, dan saldo bank yang tertahan (reserved) dilepas dan bisa dipakai penguji lain. Dokumen yang sudah Approved tidak dihapus.
- Jangan menghapus dokumen uji milik orang lain (mis. PY-5UTD8RYM adalah bukti card ETM-16702).
- Simpan screenshot hasil (khususnya kotak Summary) sebagai bukti sebelum dokumen dihapus.
