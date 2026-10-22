---
doc_type: e2e-test-case
tc_code: TC-ARCP-012
menu: accounting-customer-payment
menu_name: "Account Receive"
test_type: regression
title: "Summary tampil di dokumen Approved dan belum tampil saat Create (regression)"
summary: "Summary pada AR Approved RC-5UNRJVO7 (Cash/Bank dan Credit Note) dan RC-5T8MU1WU (Credit Note dan Adjustment Debit) bernilai Total 0,00 dan read-only; halaman Create belum menampilkan Summary."
status: draft
owner: QA - Yemima
last_updated: 2026-10-22
requirement_ref: "qa-docs/accounting-customer-payment/requirement.md §6.5 (Mode: Show dan Edit; read-only) dan card ETM-16644 AC 'Section Summary muncul setelah Adjustment pada Show dan Edit'"
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
  - "Dokumen Approved di bawah hanya dibuka dan dibaca. Jangan mengubah isinya."
  - "Tidak ada dokumen AR Approved dengan currency USD di data, jadi pengecekan Approved hanya IDR."
test_data:
  - field: "Data uji / RC-5UNRJVO7 (IDR) https://staging.olshoperp.com/accounting/customer-payment/edit/3269"
    value: "Customer PT Nusa Jaya Abadi; SI-5ULN7W0W Rp 150.000,00; Cash/Bank Rp 100.000,00; Credit Note Rp 50.000,00; tanggal 06-10-2026 | Piutang Rp 150.000,00; Cash / Bank Rp -100.000,00; Credit Note Rp -50.000,00; Adj Debit 0,00; Adj Credit 0,00; Total Rp 0,00"
  - field: "Data uji / RC-5T8MU1WU (IDR) https://staging.olshoperp.com/accounting/customer-payment/edit/1893"
    value: "Customer PT Nusa Jaya Abadi; detail Rp 500.000,00; Credit Note Rp 493.500,00; Adjustment Debit Rp 6.500,00 (kekurangan bayar); tanggal 18-05-2026 | Piutang Rp 500.000,00; Cash / Bank Rp 0,00; Credit Note Rp -493.500,00; Adj Debit Rp -6.500,00; Adj Credit 0,00; Total Rp 0,00"
steps:
  - "Login, pastikan company Dev Staging."
  - "Buka Account Receive → Create (https://staging.olshoperp.com/accounting/customer-payment/create). Selama dokumen belum tersimpan (Transaction Code belum terisi RC-…), lihat sidenav dan seluruh halaman. Cek: Section Summary belum ada (belum ada dokumen). Yang tampil hanya Basic Information (dan section lain sesuai layar Create)."
  - "Isi Customer, Transaction Currency, Exchange Rate hingga dokumen tersimpan dan masuk halaman Edit. Cek: Section Summary muncul setelah Adjustment (sebelum Approval dan Audit Log). Semua baris 0,00 dan Total 0,00 normal."
  - "Hapus dokumen uji itu dari daftar (bukan dokumen Approved di bawah)."
  - "Buka RC-5UNRJVO7 (link di tabel data uji). Cek urutan sidenav: Basic Information, Detail Account Receive, Receiving Destination, Adjustment, Summary, Approval, Audit Log. Cek: Summary sesuai tabel; tidak ada kolom input atau tombol di kotak Summary."
  - "Buka RC-5T8MU1WU, baca Summary. Cek: Angka sesuai tabel data uji; Adj Debit tampil negatif (-6.500,00)."
  - "Muat ulang tiap halaman. Cek: Angka Summary tidak berubah."
expected_result: |
  1. Halaman Create (belum tersimpan) tidak menampilkan Summary; setelah dokumen tersimpan Summary muncul setelah Adjustment dengan semua angka 0,00.
  2. Pada dokumen Approved Summary tampil read-only, urutan section benar, dan angka sama dengan tabel data uji (Total 0,00 normal untuk keduanya).
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

# Summary tampil di dokumen Approved dan belum tampil saat Create (regression)

Card: [ETM-16721](https://erpintegration.atlassian.net/browse/ETM-16721) (Test Case, regression) · card asal: [ETM-16644](https://erpintegration.atlassian.net/browse/ETM-16644) · TC terkait lama: ETM-16685 sampai ETM-16689

## Retest cepat

1. Buka Account Receive → Create (https://staging.olshoperp.com/accounting/customer-payment/create). Selama dokumen belum tersimpan (Transaction Code belum terisi RC-…), lihat sidenav dan seluruh halaman.
2. Isi Customer, Transaction Currency, Exchange Rate hingga dokumen tersimpan dan masuk halaman Edit.
3. Hapus dokumen uji itu dari daftar (bukan dokumen Approved di bawah).

## Data uji dari awal sampai akhir

Prasyarat umum:
- Akun uji QA yang punya akses menu Account Receive (Finance and Accounting → Account Receive). Login di https://staging.olshoperp.com/login.
- Company aktif harus **Dev Staging**: klik avatar profil di pojok kanan atas → Switch Company → Dev Staging → Proceed. Cara cek: daftar Account Receive memuat dokumen customer PT Nusa Jaya Abadi (mis. RC-5UNRJVO7 tanggal 06-10-2026). Kalau membuka halaman edit dokumen muncul 'You do not have access to this page', berarti company belum benar (data tes ini milik company Dev Staging).
- Perbaikan ETM-16644 sudah ada di Staging. Cek di bagian paling bawah halaman: tulisan 'Last FE build' tanggal 21-10-2026 15:09 atau lebih baru, dan 'Last API build' 21-10-2026 16:19 atau lebih baru.
- Aturan isian: kolom 'to be Paid Amount (kode mata uang)' di sub-modal 'Use this to Payment Process' selalu dalam mata uang header AR (Transaction Currency). Angka bantu di sisi kanan modal (to be Paid Amount dan to be Paid Amount (IDR)) bisa membingungkan (labelnya ganda, catatan screening ETM-16644); yang dinilai di TC ini adalah angka di tabel Detail dan di Summary.
- Customer uji: PT Nusa Jaya Abadi (kode NJA). Di AR, pilihan Customer bisa berisi customer atau store; pilih customer.
- Dokumen Approved di bawah hanya dibuka dan dibaca. Jangan mengubah isinya.
- Tidak ada dokumen AR Approved dengan currency USD di data, jadi pengecekan Approved hanya IDR.

**Data uji (siapkan sebelum mulai)**

| Dokumen Approved | Isi dokumen | Summary yang harus tampil |
|---|---|---|
| RC-5UNRJVO7 (IDR) https://staging.olshoperp.com/accounting/customer-payment/edit/3269 | Customer PT Nusa Jaya Abadi; SI-5ULN7W0W Rp 150.000,00; Cash/Bank Rp 100.000,00; Credit Note Rp 50.000,00; tanggal 06-10-2026 | Piutang Rp 150.000,00; Cash / Bank Rp -100.000,00; Credit Note Rp -50.000,00; Adj Debit 0,00; Adj Credit 0,00; Total Rp 0,00 |
| RC-5T8MU1WU (IDR) https://staging.olshoperp.com/accounting/customer-payment/edit/1893 | Customer PT Nusa Jaya Abadi; detail Rp 500.000,00; Credit Note Rp 493.500,00; Adjustment Debit Rp 6.500,00 (kekurangan bayar); tanggal 18-05-2026 | Piutang Rp 500.000,00; Cash / Bank Rp 0,00; Credit Note Rp -493.500,00; Adj Debit Rp -6.500,00; Adj Credit 0,00; Total Rp 0,00 |

## Langkah dan hasil yang harus terlihat

1. Login, pastikan company Dev Staging.
2. Buka Account Receive → Create (https://staging.olshoperp.com/accounting/customer-payment/create). Selama dokumen belum tersimpan (Transaction Code belum terisi RC-…), lihat sidenav dan seluruh halaman.
   - Section Summary belum ada (belum ada dokumen). Yang tampil hanya Basic Information (dan section lain sesuai layar Create).
3. Isi Customer, Transaction Currency, Exchange Rate hingga dokumen tersimpan dan masuk halaman Edit.
   - Section Summary muncul setelah Adjustment (sebelum Approval dan Audit Log). Semua baris 0,00 dan Total 0,00 normal.
4. Hapus dokumen uji itu dari daftar (bukan dokumen Approved di bawah).
5. Buka RC-5UNRJVO7 (link di tabel data uji).
   - Cek urutan sidenav: Basic Information, Detail Account Receive, Receiving Destination, Adjustment, Summary, Approval, Audit Log.
   - Summary sesuai tabel; tidak ada kolom input atau tombol di kotak Summary.
6. Buka RC-5T8MU1WU, baca Summary.
   - Angka sesuai tabel data uji; Adj Debit tampil negatif (-6.500,00).
7. Muat ulang tiap halaman.
   - Angka Summary tidak berubah.

## Hasil yang diharapkan

- Halaman Create (belum tersimpan) tidak menampilkan Summary; setelah dokumen tersimpan Summary muncul setelah Adjustment dengan semua angka 0,00.
- Pada dokumen Approved Summary tampil read-only, urutan section benar, dan angka sama dengan tabel data uji (Total 0,00 normal untuk keduanya).
- Kode currency di Summary = IDR.

## Catatan QA

- Requirement menyebut mode 'Show dan Edit'. Kalau Approved ternyata tidak punya Summary, atau Summary tampil di halaman Create, tulis sebagai temuan.
- RC-5T8MU1WU adalah dokumen lama yang tautan SI-nya tidak terbaca di tabel invoice. Kalau Piutang tampil berbeda dari Rp 500.000,00, catat sebagai temuan.
- Sistem bisa langsung menyimpan otomatis saat Create dibuka (kolom Customer, Currency, Exchange Rate terisi dari transaksi terakhir). Kalau Transaction Code langsung terisi, bagian 'belum tampil saat Create' tidak bisa diamati: tulis 'tidak teramati' di Actual Result dan lanjut ke langkah berikutnya.
- Dokumen ini DRAFT (belum dijalankan). Hasil run dicatat di card ETM-16721.

## Pembersihan data (akhir tes)

- Hapus dokumen AR uji yang kamu buat (daftar Account Receive → pilih dokumen → Delete) supaya Sales Invoice dan Credit Note yang tertahan (reserved) dilepas dan bisa dipakai penguji lain. Dokumen yang sudah Approved tidak dihapus.
- Credit Note baru yang kamu buat sendiri (hanya TC Credit Note bagian USD) boleh dibiarkan Approved untuk uji ulang berikutnya.
- Simpan screenshot hasil (khususnya kotak Summary) sebagai bukti sebelum dokumen dihapus.
