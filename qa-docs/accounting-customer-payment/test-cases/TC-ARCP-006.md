---
doc_type: e2e-test-case
tc_code: TC-ARCP-006
menu: accounting-customer-payment
menu_name: "Account Receive"
test_type: happy
title: "Summary AR USD yang menerima pembayaran SI USD (currency sama dengan header) tampil benar, Total 0.00 (happy)"
summary: "AR USD untuk SI USD: Summary tampil angka USD apa adanya (tanpa konversi kurs), Cash/Bank minus, Total 0,00 normal; ubah Paid Amount membuat Total orange lalu kembali normal."
status: draft
owner: QA - Yemima
last_updated: 2026-10-22
requirement_ref: "qa-docs/accounting-customer-payment/requirement.md §6.5 (Currency header; invoice sama currency tidak dikonversi) dan card ETM-16644 AC 'Semua angka dalam currency header'"
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
  - "Tidak ada dokumen AR lain yang menahan SI-69A9447A. Cek di Available Sales Invoice: kolom Status SI-69A9447A 'Prepared: USD 0' dan tombol aksinya 'Use'."
test_data:
  - field: "Data uji / Customer"
    value: "PT Nusa Jaya Abadi (kode NJA) | Punya SI IDR dan USD serta Credit Note IDR"
  - field: "Data uji / Sales Invoice"
    value: "SI-69A9447A: USD 140,00, kurs SI 11.000, tanggal 26-02-2026, Approved, belum dibayar | https://staging.olshoperp.com/accounting/customer-invoice/edit/860"
  - field: "Data uji / Cash/Bank (tempat uang masuk)"
    value: "Bank BCA USD Staging (Bank, USD) | Kolom Balance hanya informasi, tidak membatasi penerimaan"
  - field: "Data uji / Header AR"
    value: "Transaction Currency USD, Exchange Rate 16.000, Transaction Date hari ini | Pakai kurs bulat 16.000"
  - field: "Data uji / Nominal uji"
    value: "to be Paid Amount (USD) 100,00; Amount Cash/Bank USD 100,00 | 100 lebih kecil dari sisa SI (140), jadi boleh"
steps:
  - "Login, lalu pastikan company aktif Dev Staging (lihat Precondition)."
  - "Buka Finance and Accounting → Account Receive, klik Create. Isi Basic Information: Customer = PT Nusa Jaya Abadi, Transaction Currency = USD, Exchange Rate = 16.000, Description = 'QA ETM-16644 TC1'. Transaction Date biarkan hari ini. Lanjutkan (Save & Next / simpan otomatis) sampai masuk halaman Edit dan Transaction Code RC-… terisi. Cek: di sidenav kanan ada Summary setelah Adjustment. Isi Summary: semua baris USD 0,00, Total USD 0,00 normal."
  - "Di Detail Account Receive klik Available Sales Invoice. Pada baris SI-69A9447A klik Use. Di sub-modal 'Use this to Payment Process' isi to be Paid Amount (USD) = 100,00 lalu klik Save. Cek tabel Detail: Paid Amount untuk SI-69A9447A = 100,00 (USD). Cek Summary: Piutang USD 100,00; Cash / Bank USD 0,00; Total USD 100,00 berwarna orange (belum balance)."
  - "Di Receiving Destination klik Select Cash/Bank. Di daftar yang muncul centang 'Bank BCA USD Staging', klik Use, isi Amount = 100,00 lalu simpan. Cek Summary: Cash / Bank USD -100,00; Total USD 0,00 dengan warna normal (tidak orange)."
  - "Ubah Paid Amount SI-69A9447A: klik angka di kolom Paid Amount, ketik 120,00, tekan Enter. Cek Summary tanpa reload: Piutang USD 120,00; Total USD 20,00 berwarna orange."
  - "Kembalikan Paid Amount menjadi 100,00 (Enter). Cek Summary: Piutang USD 100,00; Total USD 0,00 warna normal."
  - "Muat ulang halaman (F5) dan buka lagi section Summary. Cek: Angka sama dengan sebelum reload."
expected_result: |
  1. Kode currency di Summary = USD (currency header).
  2. Piutang USD 100,00: angka SI USD apa adanya. Bukan USD 0,01 dan bukan 1.600.000,00 (tidak ada perkalian atau pembagian kurs 16.000 karena SI dan header sama-sama USD).
  3. Cash / Bank USD -100,00; Credit Note USD 0,00; Adj Debit USD 0,00; Adj Credit USD 0,00; Total USD 0,00 normal saat Detail = Receiving Destination.
  4. Saat Paid Amount 120,00 Total USD 20,00 orange; kembali 100,00 Total 0,00 normal. Summary hanya tampilan (tidak ada kolom input).
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

# Summary AR USD yang menerima pembayaran SI USD (currency sama dengan header) tampil benar, Total 0.00 (happy)

Card: [ETM-16715](https://erpintegration.atlassian.net/browse/ETM-16715) (Test Case, happy) · card asal: [ETM-16644](https://erpintegration.atlassian.net/browse/ETM-16644) · TC terkait lama: ETM-16685 sampai ETM-16689

## Retest cepat

1. Buka Finance and Accounting → Account Receive, klik Create. Isi Basic Information: Customer = PT Nusa Jaya Abadi, Transaction Currency = USD, Exchange Rate = 16.000, Description = 'QA ETM-16644 TC1'. Transaction Date biarkan hari ini. Lanjutkan (Save & Next / simpan otomatis) sampai masuk halaman Edit dan Transaction Code RC-… terisi.
2. Di Detail Account Receive klik Available Sales Invoice. Pada baris SI-69A9447A klik Use. Di sub-modal 'Use this to Payment Process' isi to be Paid Amount (USD) = 100,00 lalu klik Save.
3. Di Receiving Destination klik Select Cash/Bank. Di daftar yang muncul centang 'Bank BCA USD Staging', klik Use, isi Amount = 100,00 lalu simpan.

## Data uji dari awal sampai akhir

Prasyarat umum:
- Akun uji QA yang punya akses menu Account Receive (Finance and Accounting → Account Receive). Login di https://staging.olshoperp.com/login.
- Company aktif harus **Dev Staging**: klik avatar profil di pojok kanan atas → Switch Company → Dev Staging → Proceed. Cara cek: daftar Account Receive memuat dokumen customer PT Nusa Jaya Abadi (mis. RC-5UNRJVO7 tanggal 06-10-2026). Kalau membuka halaman edit dokumen muncul 'You do not have access to this page', berarti company belum benar (data tes ini milik company Dev Staging).
- Perbaikan ETM-16644 sudah ada di Staging. Cek di bagian paling bawah halaman: tulisan 'Last FE build' tanggal 21-10-2026 15:09 atau lebih baru, dan 'Last API build' 21-10-2026 16:19 atau lebih baru.
- Aturan isian: kolom 'to be Paid Amount (kode mata uang)' di sub-modal 'Use this to Payment Process' selalu dalam mata uang header AR (Transaction Currency). Angka bantu di sisi kanan modal (to be Paid Amount dan to be Paid Amount (IDR)) bisa membingungkan (labelnya ganda, catatan screening ETM-16644); yang dinilai di TC ini adalah angka di tabel Detail dan di Summary.
- Customer uji: PT Nusa Jaya Abadi (kode NJA). Di AR, pilihan Customer bisa berisi customer atau store; pilih customer.
- Tidak ada dokumen AR lain yang menahan SI-69A9447A. Cek di Available Sales Invoice: kolom Status SI-69A9447A 'Prepared: USD 0' dan tombol aksinya 'Use'.

**Data uji (siapkan sebelum mulai)**

| Item | Nilai | Keterangan / link |
|---|---|---|
| Customer | PT Nusa Jaya Abadi (kode NJA) | Punya SI IDR dan USD serta Credit Note IDR |
| Sales Invoice | SI-69A9447A: USD 140,00, kurs SI 11.000, tanggal 26-02-2026, Approved, belum dibayar | https://staging.olshoperp.com/accounting/customer-invoice/edit/860 |
| Cash/Bank (tempat uang masuk) | Bank BCA USD Staging (Bank, USD) | Kolom Balance hanya informasi, tidak membatasi penerimaan |
| Header AR | Transaction Currency USD, Exchange Rate 16.000, Transaction Date hari ini | Pakai kurs bulat 16.000 |
| Nominal uji | to be Paid Amount (USD) 100,00; Amount Cash/Bank USD 100,00 | 100 lebih kecil dari sisa SI (140), jadi boleh |

## Langkah dan hasil yang harus terlihat

1. Login, lalu pastikan company aktif Dev Staging (lihat Precondition).
2. Buka Finance and Accounting → Account Receive, klik Create. Isi Basic Information: Customer = PT Nusa Jaya Abadi, Transaction Currency = USD, Exchange Rate = 16.000, Description = 'QA ETM-16644 TC1'. Transaction Date biarkan hari ini. Lanjutkan (Save & Next / simpan otomatis) sampai masuk halaman Edit dan Transaction Code RC-… terisi.
   - Cek: di sidenav kanan ada Summary setelah Adjustment. Isi Summary: semua baris USD 0,00, Total USD 0,00 normal.
3. Di Detail Account Receive klik Available Sales Invoice. Pada baris SI-69A9447A klik Use. Di sub-modal 'Use this to Payment Process' isi to be Paid Amount (USD) = 100,00 lalu klik Save.
   - Cek tabel Detail: Paid Amount untuk SI-69A9447A = 100,00 (USD).
   - Cek Summary: Piutang USD 100,00; Cash / Bank USD 0,00; Total USD 100,00 berwarna orange (belum balance).
4. Di Receiving Destination klik Select Cash/Bank. Di daftar yang muncul centang 'Bank BCA USD Staging', klik Use, isi Amount = 100,00 lalu simpan.
   - Cek Summary: Cash / Bank USD -100,00; Total USD 0,00 dengan warna normal (tidak orange).
5. Ubah Paid Amount SI-69A9447A: klik angka di kolom Paid Amount, ketik 120,00, tekan Enter.
   - Cek Summary tanpa reload: Piutang USD 120,00; Total USD 20,00 berwarna orange.
6. Kembalikan Paid Amount menjadi 100,00 (Enter).
   - Cek Summary: Piutang USD 100,00; Total USD 0,00 warna normal.
7. Muat ulang halaman (F5) dan buka lagi section Summary.
   - Angka sama dengan sebelum reload.

## Hasil yang diharapkan

- Kode currency di Summary = USD (currency header).
- Piutang USD 100,00: angka SI USD apa adanya. Bukan USD 0,01 dan bukan 1.600.000,00 (tidak ada perkalian atau pembagian kurs 16.000 karena SI dan header sama-sama USD).
- Cash / Bank USD -100,00; Credit Note USD 0,00; Adj Debit USD 0,00; Adj Credit USD 0,00; Total USD 0,00 normal saat Detail = Receiving Destination.
- Saat Paid Amount 120,00 Total USD 20,00 orange; kembali 100,00 Total 0,00 normal. Summary hanya tampilan (tidak ada kolom input).

## Catatan QA

- Ini satu-satunya TC AR yang menguji alur valas paling umum: currency SI sama dengan currency header (TC lama AR hanya IDR).
- Tanda di AR kebalikan dari AP untuk sisi jurnal: Cash/Bank tampil minus (pengurang piutang).
- Dokumen ini DRAFT (belum dijalankan). Hasil run dicatat di card ETM-16715.

## Pembersihan data (akhir tes)

- Hapus dokumen AR uji yang kamu buat (daftar Account Receive → pilih dokumen → Delete) supaya Sales Invoice dan Credit Note yang tertahan (reserved) dilepas dan bisa dipakai penguji lain. Dokumen yang sudah Approved tidak dihapus.
- Credit Note baru yang kamu buat sendiri (hanya TC Credit Note bagian USD) boleh dibiarkan Approved untuk uji ulang berikutnya.
- Simpan screenshot hasil (khususnya kotak Summary) sebagai bukti sebelum dokumen dihapus.
