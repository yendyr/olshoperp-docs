---
doc_type: e2e-test-case
tc_code: TC-ARCP-008
menu: accounting-customer-payment
menu_name: "Account Receive"
test_type: edge
title: "Summary AR: Kurs header terkunci saat ada detail; setelah detail dikosongkan, Piutang memakai kurs baru (edge)"
summary: "Ubah kurs header ditolak saat ada detail (Summary tetap); setelah detail dihapus kurs diganti 16.500 dan Piutang dari SI IDR 255.000 berubah dari 15,94 menjadi 15,45 USD."
status: draft
owner: QA - Yemima
last_updated: 2026-10-22
requirement_ref: "qa-docs/accounting-customer-payment/requirement.md §6.5 (rate = header exchange rate) dan aturan header locking Account Payment/Receive (sama: pesan 'Cannot edit Header when detail data exists')"
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
  - "SI-69A8F2FC (IDR 255.000) bebas: di Available Sales Invoice tombolnya 'Use'."
  - "Kerjakan setelah TC pembulatan Total selesai dan AR ujinya sudah dihapus (memakai SI yang sama)."
test_data:
  - field: "Data uji / Customer"
    value: "PT Nusa Jaya Abadi (kode NJA)"
  - field: "Data uji / Sales Invoice"
    value: "SI-69A8F2FC: IDR 255.000,00, Approved | https://staging.olshoperp.com/accounting/customer-invoice/edit/849"
  - field: "Data uji / Cash/Bank"
    value: "Bank BCA USD Staging (USD)"
  - field: "Data uji / Kurs awal / kurs baru"
    value: "16.000 lalu 16.500 | Kurs bulat"
  - field: "Data uji / Hasil hitung (Allocate Full Amount)"
    value: "255.000 : 16.000 = 15,9375 USD; 255.000 : 16.500 = 15,4545 USD | Tampil 15,94 dan 15,45. Cash/Bank untuk kurs baru: USD 15,45"
steps:
  - "Login, pastikan company Dev Staging."
  - "Buat AR: Create; Customer = PT Nusa Jaya Abadi, Transaction Currency = USD, Exchange Rate = 16.000; lanjut sampai halaman Edit."
  - "Available Sales Invoice → SI-69A8F2FC → Use → klik 'Allocate Full Amount (Clearing)' → Save. Cek Summary: Piutang USD 15,94; Total USD 15,94 orange."
  - "Di Basic Information ubah Exchange Rate menjadi 16.500, klik Save All. Cek: Harus ditolak dengan pesan: 'Cannot edit Header when detail data exists. Please clear all details first.'. Cek: Summary tetap Piutang USD 15,94. Muat ulang halaman: Exchange Rate masih 16.000."
  - "Hapus baris detail SI-69A8F2FC (ikon hapus di tabel Detail Account Receive). Cek Summary: semua USD 0,00; Total USD 0,00."
  - "Ubah Exchange Rate menjadi 16.500, klik Save All, lalu muat ulang halaman. Cek: Exchange Rate tersimpan 16.500."
  - "Use SI-69A8F2FC lagi dengan 'Allocate Full Amount (Clearing)'. Cek Summary: Piutang USD 15,45 (bukan 15,94 dari kurs lama); Total USD 15,45 orange."
  - "Tambah Cash/Bank 'Bank BCA USD Staging' Amount = 15,45. Cek Summary: Cash / Bank USD -15,45; Total USD 0,00 warna normal (selisih mentah 0,0045 dibulatkan)."
expected_result: |
  1. Selama ada detail, kurs tidak bisa diubah dan pesan penolakan tampil persis seperti di atas; Summary tidak berubah.
  2. Setelah detail dikosongkan, kurs baru tersimpan, dan Piutang di Summary dihitung dengan kurs baru: 15,45 (bukan 15,94).
  3. Total 0,00 normal setelah Cash/Bank 15,45.
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

# Summary AR: Kurs header terkunci saat ada detail; setelah detail dikosongkan, Piutang memakai kurs baru (edge)

Card: [ETM-16717](https://erpintegration.atlassian.net/browse/ETM-16717) (Test Case, edge) · card asal: [ETM-16644](https://erpintegration.atlassian.net/browse/ETM-16644) · TC terkait lama: ETM-16685 sampai ETM-16689

## Retest cepat

1. Buat AR: Create; Customer = PT Nusa Jaya Abadi, Transaction Currency = USD, Exchange Rate = 16.000; lanjut sampai halaman Edit.
2. Available Sales Invoice → SI-69A8F2FC → Use → klik 'Allocate Full Amount (Clearing)' → Save.
3. Di Basic Information ubah Exchange Rate menjadi 16.500, klik Save All.

## Data uji dari awal sampai akhir

Prasyarat umum:
- Akun uji QA yang punya akses menu Account Receive (Finance and Accounting → Account Receive). Login di https://staging.olshoperp.com/login.
- Company aktif harus **Dev Staging**: klik avatar profil di pojok kanan atas → Switch Company → Dev Staging → Proceed. Cara cek: daftar Account Receive memuat dokumen customer PT Nusa Jaya Abadi (mis. RC-5UNRJVO7 tanggal 06-10-2026). Kalau membuka halaman edit dokumen muncul 'You do not have access to this page', berarti company belum benar (data tes ini milik company Dev Staging).
- Perbaikan ETM-16644 sudah ada di Staging. Cek di bagian paling bawah halaman: tulisan 'Last FE build' tanggal 21-10-2026 15:09 atau lebih baru, dan 'Last API build' 21-10-2026 16:19 atau lebih baru.
- Aturan isian: kolom 'to be Paid Amount (kode mata uang)' di sub-modal 'Use this to Payment Process' selalu dalam mata uang header AR (Transaction Currency). Angka bantu di sisi kanan modal (to be Paid Amount dan to be Paid Amount (IDR)) bisa membingungkan (labelnya ganda, catatan screening ETM-16644); yang dinilai di TC ini adalah angka di tabel Detail dan di Summary.
- Customer uji: PT Nusa Jaya Abadi (kode NJA). Di AR, pilihan Customer bisa berisi customer atau store; pilih customer.
- SI-69A8F2FC (IDR 255.000) bebas: di Available Sales Invoice tombolnya 'Use'.
- Kerjakan setelah TC pembulatan Total selesai dan AR ujinya sudah dihapus (memakai SI yang sama).

**Data uji (siapkan sebelum mulai)**

| Item | Nilai | Keterangan / link |
|---|---|---|
| Customer | PT Nusa Jaya Abadi (kode NJA) |  |
| Sales Invoice | SI-69A8F2FC: IDR 255.000,00, Approved | https://staging.olshoperp.com/accounting/customer-invoice/edit/849 |
| Cash/Bank | Bank BCA USD Staging (USD) |  |
| Kurs awal / kurs baru | 16.000 lalu 16.500 | Kurs bulat |
| Hasil hitung (Allocate Full Amount) | 255.000 : 16.000 = 15,9375 USD; 255.000 : 16.500 = 15,4545 USD | Tampil 15,94 dan 15,45. Cash/Bank untuk kurs baru: USD 15,45 |

## Langkah dan hasil yang harus terlihat

1. Login, pastikan company Dev Staging.
2. Buat AR: Create; Customer = PT Nusa Jaya Abadi, Transaction Currency = USD, Exchange Rate = 16.000; lanjut sampai halaman Edit.
3. Available Sales Invoice → SI-69A8F2FC → Use → klik 'Allocate Full Amount (Clearing)' → Save.
   - Cek Summary: Piutang USD 15,94; Total USD 15,94 orange.
4. Di Basic Information ubah Exchange Rate menjadi 16.500, klik Save All.
   - Harus ditolak dengan pesan: 'Cannot edit Header when detail data exists. Please clear all details first.'
   - Summary tetap Piutang USD 15,94. Muat ulang halaman: Exchange Rate masih 16.000.
5. Hapus baris detail SI-69A8F2FC (ikon hapus di tabel Detail Account Receive).
   - Cek Summary: semua USD 0,00; Total USD 0,00.
6. Ubah Exchange Rate menjadi 16.500, klik Save All, lalu muat ulang halaman.
   - Exchange Rate tersimpan 16.500.
7. Use SI-69A8F2FC lagi dengan 'Allocate Full Amount (Clearing)'.
   - Cek Summary: Piutang USD 15,45 (bukan 15,94 dari kurs lama); Total USD 15,45 orange.
8. Tambah Cash/Bank 'Bank BCA USD Staging' Amount = 15,45.
   - Cek Summary: Cash / Bank USD -15,45; Total USD 0,00 warna normal (selisih mentah 0,0045 dibulatkan).

## Hasil yang diharapkan

- Selama ada detail, kurs tidak bisa diubah dan pesan penolakan tampil persis seperti di atas; Summary tidak berubah.
- Setelah detail dikosongkan, kurs baru tersimpan, dan Piutang di Summary dihitung dengan kurs baru: 15,45 (bukan 15,94).
- Total 0,00 normal setelah Cash/Bank 15,45.

## Catatan QA

- Kalau pesan penolakan berbeda atau kurs ternyata bisa diubah saat ada detail, itu temuan terhadap aturan header locking.
- Dokumen ini DRAFT (belum dijalankan). Hasil run dicatat di card ETM-16717.

## Pembersihan data (akhir tes)

- Hapus dokumen AR uji yang kamu buat (daftar Account Receive → pilih dokumen → Delete) supaya Sales Invoice dan Credit Note yang tertahan (reserved) dilepas dan bisa dipakai penguji lain. Dokumen yang sudah Approved tidak dihapus.
- Credit Note baru yang kamu buat sendiri (hanya TC Credit Note bagian USD) boleh dibiarkan Approved untuk uji ulang berikutnya.
- Simpan screenshot hasil (khususnya kotak Summary) sebagai bukti sebelum dokumen dihapus.
