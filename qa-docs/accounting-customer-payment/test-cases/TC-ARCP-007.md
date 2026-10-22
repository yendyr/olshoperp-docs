---
doc_type: e2e-test-case
tc_code: TC-ARCP-007
menu: accounting-customer-payment
menu_name: "Account Receive"
test_type: edge
title: "Summary Total dibulatkan 2 desimal: selisih kecil tidak orange dan tanpa tanda minus nol, selisih 0,01 orange (edge)"
summary: "AR USD kurs 15.850 melunasi SI IDR 410.000 (Allocate Full Amount): Piutang 25,87; Cash/Bank 25,87 → Total 0,00 normal tanpa minus; 25,86 → 0,01 orange; 25,88 → -0,01 orange; bagian B kurs 16.234,50."
status: draft
owner: QA - Yemima
last_updated: 2026-10-22
requirement_ref: "qa-docs/accounting-customer-payment/requirement.md §6.5 (Desimal 2 digit; Total ideal 0,00, orange bila tidak nol) dan card ETM-16644 AC 'Total 2 desimal; Total ≠ 0 → orange'"
automated: false
automated_spec: null
execution_company:
  id: 13
  code: DEV-STG
related_menus:
  - accounting-customer-invoice
  - accounting-credit-note
preconditions:
  - "Akun uji QA yang punya akses menu Account Receive (Finance and Accounting → Account Receive). Login di https://staging.olshoperp.com/login."
  - "Company aktif harus Dev Staging: klik avatar profil di pojok kanan atas → Switch Company → Dev Staging → Proceed. Cara cek: daftar Account Receive memuat dokumen customer PT Nusa Jaya Abadi (mis. RC-5UNRJVO7 tanggal 06-10-2026). Kalau membuka halaman edit dokumen muncul 'You do not have access to this page', berarti company belum benar (data tes ini milik company Dev Staging)."
  - "Perbaikan ETM-16644 sudah ada di Staging. Cek di bagian paling bawah halaman: tulisan 'Last FE build' tanggal 21-10-2026 15:09 atau lebih baru, dan 'Last API build' 21-10-2026 16:19 atau lebih baru."
  - "Aturan isian: kolom 'to be Paid Amount (kode mata uang)' di sub-modal 'Use this to Payment Process' selalu dalam mata uang header AR (Transaction Currency). Angka bantu di sisi kanan modal (to be Paid Amount dan to be Paid Amount (IDR)) bisa membingungkan (labelnya ganda, catatan screening ETM-16644); yang dinilai di TC ini adalah angka di tabel Detail dan di Summary."
  - "Customer uji: PT Nusa Jaya Abadi (kode NJA). Di AR, pilihan Customer bisa berisi customer atau store; pilih customer."
  - "SI-691BE1A0 (IDR 410.000) dan SI-69A8F2FC (IDR 255.000) bebas: di Available Sales Invoice tombolnya 'Use' dan Status 'Prepared: IDR 0'."
  - "Bagian B hanya dikerjakan kalau kurs berdesimal tersimpan benar di AR. Cek dulu: buat AR dengan Exchange Rate 16.234,50, simpan, buka ulang. Kalau tertulis 162.345 (bug seperti ETM-16702 di Account Payment), tulis Bagian B sebagai Blocked."
  - "TC ini dan TC kurs header (card berikutnya) memakai SI yang sama. Kerjakan satu per satu dan hapus AR uji sebelum lanjut."
test_data:
  - field: "Data uji / Customer"
    value: "PT Nusa Jaya Abadi (kode NJA)"
  - field: "Data uji / Sales Invoice Bagian A"
    value: "SI-691BE1A0: IDR 410.000,00, kurs 1, tanggal 18-11-2025, Approved, belum dibayar | https://staging.olshoperp.com/accounting/customer-invoice/edit/482"
  - field: "Data uji / Sales Invoice Bagian B"
    value: "SI-69A8F2FC: IDR 255.000,00, kurs 1, tanggal 02-03-2026, Approved, belum dibayar | https://staging.olshoperp.com/accounting/customer-invoice/edit/849"
  - field: "Data uji / Cash/Bank"
    value: "Bank BCA USD Staging (Bank, USD)"
  - field: "Data uji / Header AR (Bagian A)"
    value: "Transaction Currency USD, Exchange Rate 15.850 | 410.000 : 15.850 = 25,8675 (berpecahan)"
  - field: "Data uji / Header AR (Bagian B)"
    value: "Transaction Currency USD, Exchange Rate 16.234,50 | 255.000 : 16.234,50 = 15,7073"
  - field: "Tabel hitungan Bagian A / 25,87"
    value: "25,87 | 0,00 (selisih mentah -0,0025; tidak boleh tertulis '-0,00') | Normal"
  - field: "Tabel hitungan Bagian A / 25,86"
    value: "25,87 | 0,01 (selisih mentah 0,0075) | Orange"
  - field: "Tabel hitungan Bagian A / 25,88"
    value: "25,87 | -0,01 (selisih mentah -0,0125) | Orange"
  - field: "Hitungan Bagian B / 15,71"
    value: "15,71 (15,7073) | 0,00 (selisih mentah -0,0027) | Normal"
steps:
  - "Login, lalu pastikan company aktif Dev Staging."
  - "BAGIAN A. Buat AR: Account Receive → Create; Customer = PT Nusa Jaya Abadi, Transaction Currency = USD, Exchange Rate = 15.850. Lanjutkan sampai halaman Edit."
  - "Di Detail Account Receive klik Available Sales Invoice. Pada baris SI-691BE1A0 klik Use, lalu di sub-modal klik 'Allocate Full Amount (Clearing)' dan klik Save. Cek tabel Detail: Paid Amount SI-691BE1A0 = 25,87 (USD). Cek Summary: Piutang USD 25,87; Total USD 25,87 orange."
  - "Di Receiving Destination: Select Cash/Bank → centang 'Bank BCA USD Staging' → Use → Amount = 25,87 → simpan. Cek Summary: Cash / Bank USD -25,87; Total USD 0,00 warna normal dan tertulis 0,00, bukan -0,00."
  - "Hapus baris Cash/Bank tadi (ikon hapus di tabel Receiving Destination), lalu tambah lagi dengan Amount = 25,86. Cek Summary: Total USD 0,01 berwarna orange."
  - "Hapus lagi baris Cash/Bank, lalu tambah dengan Amount = 25,88. Cek Summary: Total USD -0,01 berwarna orange."
  - "Hapus dokumen AR uji Bagian A (supaya SI-691BE1A0 bebas)."
  - "BAGIAN B. Buat AR baru: Customer sama, Transaction Currency = USD, Exchange Rate = 16.234,50. Setelah tersimpan, buka ulang dan cek field Exchange Rate. Cek: Harus tampil 16.234,50 (bukan 162.345)."
  - "Use SI-69A8F2FC dengan 'Allocate Full Amount (Clearing)'; tambah Cash/Bank 'Bank BCA USD Staging' Amount = 15,71. Cek Summary: Piutang USD 15,71; Cash / Bank USD -15,71; Total USD 0,00 warna normal."
expected_result: |
  1. Total selalu tampil 2 desimal. Selisih mentah di bawah 0,005 (contoh -0,0025) tampil '0,00', warna normal, dan tidak pernah tampil '-0,00'.
  2. Selisih 0,01 (positif) dan -0,01 (negatif) tampil orange.
  3. Piutang dan baris lain juga tampil 2 desimal (25,8675 tampil 25,87).
  4. Bagian B: kurs 16.234,50 tersimpan utuh; Total 0,00 normal walau hasil bagi mentah 15,7073 dan Cash/Bank 15,71.
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
origin_jira: ETM-16644
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

Card: [ETM-16716](https://erpintegration.atlassian.net/browse/ETM-16716) (Test Case, edge) · card asal: [ETM-16644](https://erpintegration.atlassian.net/browse/ETM-16644) · TC terkait lama: ETM-16685 sampai ETM-16689

## Retest cepat

1. BAGIAN A. Buat AR: Account Receive → Create; Customer = PT Nusa Jaya Abadi, Transaction Currency = USD, Exchange Rate = 15.850. Lanjutkan sampai halaman Edit.
2. Di Detail Account Receive klik Available Sales Invoice. Pada baris SI-691BE1A0 klik Use, lalu di sub-modal klik 'Allocate Full Amount (Clearing)' dan klik Save.
3. Di Receiving Destination: Select Cash/Bank → centang 'Bank BCA USD Staging' → Use → Amount = 25,87 → simpan.

## Data uji dari awal sampai akhir

Prasyarat umum:
- Akun uji QA yang punya akses menu Account Receive (Finance and Accounting → Account Receive). Login di https://staging.olshoperp.com/login.
- Company aktif harus **Dev Staging**: klik avatar profil di pojok kanan atas → Switch Company → Dev Staging → Proceed. Cara cek: daftar Account Receive memuat dokumen customer PT Nusa Jaya Abadi (mis. RC-5UNRJVO7 tanggal 06-10-2026). Kalau membuka halaman edit dokumen muncul 'You do not have access to this page', berarti company belum benar (data tes ini milik company Dev Staging).
- Perbaikan ETM-16644 sudah ada di Staging. Cek di bagian paling bawah halaman: tulisan 'Last FE build' tanggal 21-10-2026 15:09 atau lebih baru, dan 'Last API build' 21-10-2026 16:19 atau lebih baru.
- Aturan isian: kolom 'to be Paid Amount (kode mata uang)' di sub-modal 'Use this to Payment Process' selalu dalam mata uang header AR (Transaction Currency). Angka bantu di sisi kanan modal (to be Paid Amount dan to be Paid Amount (IDR)) bisa membingungkan (labelnya ganda, catatan screening ETM-16644); yang dinilai di TC ini adalah angka di tabel Detail dan di Summary.
- Customer uji: PT Nusa Jaya Abadi (kode NJA). Di AR, pilihan Customer bisa berisi customer atau store; pilih customer.
- SI-691BE1A0 (IDR 410.000) dan SI-69A8F2FC (IDR 255.000) bebas: di Available Sales Invoice tombolnya 'Use' dan Status 'Prepared: IDR 0'.
- Bagian B hanya dikerjakan kalau kurs berdesimal tersimpan benar di AR. Cek dulu: buat AR dengan Exchange Rate 16.234,50, simpan, buka ulang. Kalau tertulis 162.345 (bug seperti ETM-16702 di Account Payment), tulis Bagian B sebagai Blocked.
- TC ini dan TC kurs header (card berikutnya) memakai SI yang sama. Kerjakan satu per satu dan hapus AR uji sebelum lanjut.

**Data uji (siapkan sebelum mulai)**

| Item | Nilai | Keterangan / link |
|---|---|---|
| Customer | PT Nusa Jaya Abadi (kode NJA) |  |
| Sales Invoice Bagian A | SI-691BE1A0: IDR 410.000,00, kurs 1, tanggal 18-11-2025, Approved, belum dibayar | https://staging.olshoperp.com/accounting/customer-invoice/edit/482 |
| Sales Invoice Bagian B | SI-69A8F2FC: IDR 255.000,00, kurs 1, tanggal 02-03-2026, Approved, belum dibayar | https://staging.olshoperp.com/accounting/customer-invoice/edit/849 |
| Cash/Bank | Bank BCA USD Staging (Bank, USD) |  |
| Header AR (Bagian A) | Transaction Currency USD, Exchange Rate 15.850 | 410.000 : 15.850 = 25,8675 (berpecahan) |
| Header AR (Bagian B) | Transaction Currency USD, Exchange Rate 16.234,50 | 255.000 : 16.234,50 = 15,7073 |

**Tabel hitungan Bagian A (Piutang = 25,8675 dari Allocate Full Amount)**

| Amount Cash/Bank | Piutang tampil | Total tampil | Warna Total |
|---|---|---|---|
| 25,87 | 25,87 | 0,00 (selisih mentah -0,0025; tidak boleh tertulis '-0,00') | Normal |
| 25,86 | 25,87 | 0,01 (selisih mentah 0,0075) | Orange |
| 25,88 | 25,87 | -0,01 (selisih mentah -0,0125) | Orange |

**Hitungan Bagian B**

| Amount Cash/Bank | Piutang tampil | Total tampil | Warna Total |
|---|---|---|---|
| 15,71 | 15,71 (15,7073) | 0,00 (selisih mentah -0,0027) | Normal |

## Langkah dan hasil yang harus terlihat

1. Login, lalu pastikan company aktif Dev Staging.
2. BAGIAN A. Buat AR: Account Receive → Create; Customer = PT Nusa Jaya Abadi, Transaction Currency = USD, Exchange Rate = 15.850. Lanjutkan sampai halaman Edit.
3. Di Detail Account Receive klik Available Sales Invoice. Pada baris SI-691BE1A0 klik Use, lalu di sub-modal klik 'Allocate Full Amount (Clearing)' dan klik Save.
   - Cek tabel Detail: Paid Amount SI-691BE1A0 = 25,87 (USD).
   - Cek Summary: Piutang USD 25,87; Total USD 25,87 orange.
4. Di Receiving Destination: Select Cash/Bank → centang 'Bank BCA USD Staging' → Use → Amount = 25,87 → simpan.
   - Cek Summary: Cash / Bank USD -25,87; Total USD 0,00 warna normal dan tertulis 0,00, bukan -0,00.
5. Hapus baris Cash/Bank tadi (ikon hapus di tabel Receiving Destination), lalu tambah lagi dengan Amount = 25,86.
   - Cek Summary: Total USD 0,01 berwarna orange.
6. Hapus lagi baris Cash/Bank, lalu tambah dengan Amount = 25,88.
   - Cek Summary: Total USD -0,01 berwarna orange.
7. Hapus dokumen AR uji Bagian A (supaya SI-691BE1A0 bebas).
8. BAGIAN B. Buat AR baru: Customer sama, Transaction Currency = USD, Exchange Rate = 16.234,50. Setelah tersimpan, buka ulang dan cek field Exchange Rate.
   - Harus tampil 16.234,50 (bukan 162.345).
9. Use SI-69A8F2FC dengan 'Allocate Full Amount (Clearing)'; tambah Cash/Bank 'Bank BCA USD Staging' Amount = 15,71.
   - Cek Summary: Piutang USD 15,71; Cash / Bank USD -15,71; Total USD 0,00 warna normal.

## Hasil yang diharapkan

- Total selalu tampil 2 desimal. Selisih mentah di bawah 0,005 (contoh -0,0025) tampil '0,00', warna normal, dan tidak pernah tampil '-0,00'.
- Selisih 0,01 (positif) dan -0,01 (negatif) tampil orange.
- Piutang dan baris lain juga tampil 2 desimal (25,8675 tampil 25,87).
- Bagian B: kurs 16.234,50 tersimpan utuh; Total 0,00 normal walau hasil bagi mentah 15,7073 dan Cash/Bank 15,71.

## Catatan QA

- Kalau Total 0,00 tapi masih berwarna orange (atau tertulis -0,00) itu temuan: catat angka dan screenshot.
- Piutang berpecahan hanya muncul lewat 'Allocate Full Amount (Clearing)'. Kalau kamu mengetik to be Paid Amount (USD) sendiri, Piutang sama persis dengan angka yang diketik sehingga tidak ada selisih pecahan.
- TC lama ETM-16687 (kurs desimal AR) belum dijalankan; Bagian B di sini mencakupnya.
- Dokumen ini DRAFT (belum dijalankan). Hasil run dicatat di card ETM-16716.

## Pembersihan data (akhir tes)

- Hapus dokumen AR uji yang kamu buat (daftar Account Receive → pilih dokumen → Delete) supaya Sales Invoice dan Credit Note yang tertahan (reserved) dilepas dan bisa dipakai penguji lain. Dokumen yang sudah Approved tidak dihapus.
- Credit Note baru yang kamu buat sendiri (hanya TC Credit Note bagian USD) boleh dibiarkan Approved untuk uji ulang berikutnya.
- Simpan screenshot hasil (khususnya kotak Summary) sebagai bukti sebelum dokumen dihapus.
