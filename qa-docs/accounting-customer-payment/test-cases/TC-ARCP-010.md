---
doc_type: e2e-test-case
tc_code: TC-ARCP-010
menu: accounting-customer-payment
menu_name: "Account Receive"
test_type: edge
title: "Summary AR USD dengan beberapa Adjustment Debit dan Credit dalam USD (edge)"
summary: "AR USD: Piutang 100,00; Adj Debit 20 + 5 tampil -25,00; Adj Credit 8,00; Cash/Bank 83,00 membuat Total 0,00."
status: draft
owner: QA - Yemima
last_updated: 2026-10-22
requirement_ref: "qa-docs/accounting-customer-payment/requirement.md §6.5 (Adj Debit − dan Adj Credit +) dan aturan Adjustment (Debit atau Credit per baris)"
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
  - "SI-69A949E7 (USD 180) bebas: di Available Sales Invoice tombolnya 'Use'."
test_data:
  - field: "Data uji / Customer"
    value: "PT Nusa Jaya Abadi (kode NJA)"
  - field: "Data uji / Sales Invoice"
    value: "SI-69A949E7: USD 180,00, kurs SI 10.000, Approved | https://staging.olshoperp.com/accounting/customer-invoice/edit/861"
  - field: "Data uji / Cash/Bank"
    value: "Bank BCA USD Staging (USD)"
  - field: "Data uji / Header AR"
    value: "Transaction Currency USD, Exchange Rate 16.000"
  - field: "Data uji / Nominal uji"
    value: "to be Paid Amount (USD) 100,00 | Isian dalam USD (header). Kolom Paid Amount IDR akan menampilkan 1.600.000"
  - field: "Data uji / Akun Adjustment"
    value: "'Biaya Admin Bank' (kode 9-90001) untuk Debit; 'Biaya Kirim Dokumen, Pos & Materai' (kode 7-70108) untuk Credit | Pilih lewat Select Account"
  - field: "Data uji / Baris Adjustment"
    value: "Debit USD 20,00; Debit USD 5,00; Credit USD 8,00 | Debit 25,00 tampil negatif, Credit 8,00 tampil positif di Summary"
steps:
  - "Login, pastikan company Dev Staging."
  - "Buat AR: Create; Customer = PT Nusa Jaya Abadi, Transaction Currency = USD, Exchange Rate = 16.000; lanjut sampai halaman Edit."
  - "Available Sales Invoice → SI-69A949E7 → Use → to be Paid Amount (USD) = 100,00 → Save. Cek tabel Detail: Paid Amount 100,00. Cek Summary: Piutang USD 100,00; Total USD 100,00 orange."
  - "Di section Adjustment: Select Account = 'Biaya Admin Bank' (9-90001), isi Debit = 20,00, klik Save. Cek Summary: Adj Debit USD -20,00; Total USD 80,00 orange."
  - "Adjustment kedua: Account = 'Biaya Admin Bank', Debit = 5,00, Save. Cek Summary: Adj Debit USD -25,00; Total USD 75,00."
  - "Adjustment ketiga: Account = 'Biaya Kirim Dokumen, Pos & Materai' (7-70108), Credit = 8,00, Save. Cek Summary: Adj Credit USD 8,00; Total USD 83,00 orange."
  - "Receiving Destination → Select Cash/Bank → centang 'Bank BCA USD Staging' → Use → Amount = 83,00 → simpan. Cek Summary: Cash / Bank USD -83,00; Total USD 0,00 warna normal."
expected_result: |
  1. Piutang USD 100,00; Cash / Bank USD -83,00; Credit Note USD 0,00; Adj Debit USD -25,00; Adj Credit USD 8,00; Total USD 0,00 normal.
  2. Adj Debit adalah jumlah semua baris Debit (20 + 5) dan tampil negatif; Adj Credit jumlah semua baris Credit dan tampil positif; keduanya dalam USD (bukan rupiah, bukan nilai kolom Amount In IDR).
  3. Setiap Save Adjustment langsung mengubah Summary tanpa reload.
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

# Summary AR USD dengan beberapa Adjustment Debit dan Credit dalam USD (edge)

Card: [ETM-16719](https://erpintegration.atlassian.net/browse/ETM-16719) (Test Case, edge) · card asal: [ETM-16644](https://erpintegration.atlassian.net/browse/ETM-16644) · TC terkait lama: ETM-16685 sampai ETM-16689

## Retest cepat

1. Buat AR: Create; Customer = PT Nusa Jaya Abadi, Transaction Currency = USD, Exchange Rate = 16.000; lanjut sampai halaman Edit.
2. Available Sales Invoice → SI-69A949E7 → Use → to be Paid Amount (USD) = 100,00 → Save.
3. Di section Adjustment: Select Account = 'Biaya Admin Bank' (9-90001), isi Debit = 20,00, klik Save.

## Data uji dari awal sampai akhir

Prasyarat umum:
- Akun uji QA yang punya akses menu Account Receive (Finance and Accounting → Account Receive). Login di https://staging.olshoperp.com/login.
- Company aktif harus **Dev Staging**: klik avatar profil di pojok kanan atas → Switch Company → Dev Staging → Proceed. Cara cek: daftar Account Receive memuat dokumen customer PT Nusa Jaya Abadi (mis. RC-5UNRJVO7 tanggal 06-10-2026). Kalau membuka halaman edit dokumen muncul 'You do not have access to this page', berarti company belum benar (data tes ini milik company Dev Staging).
- Perbaikan ETM-16644 sudah ada di Staging. Cek di bagian paling bawah halaman: tulisan 'Last FE build' tanggal 21-10-2026 15:09 atau lebih baru, dan 'Last API build' 21-10-2026 16:19 atau lebih baru.
- Aturan isian: kolom 'to be Paid Amount (kode mata uang)' di sub-modal 'Use this to Payment Process' selalu dalam mata uang header AR (Transaction Currency). Angka bantu di sisi kanan modal (to be Paid Amount dan to be Paid Amount (IDR)) bisa membingungkan (labelnya ganda, catatan screening ETM-16644); yang dinilai di TC ini adalah angka di tabel Detail dan di Summary.
- Customer uji: PT Nusa Jaya Abadi (kode NJA). Di AR, pilihan Customer bisa berisi customer atau store; pilih customer.
- SI-69A949E7 (USD 180) bebas: di Available Sales Invoice tombolnya 'Use'.

**Data uji (siapkan sebelum mulai)**

| Item | Nilai | Keterangan / link |
|---|---|---|
| Customer | PT Nusa Jaya Abadi (kode NJA) |  |
| Sales Invoice | SI-69A949E7: USD 180,00, kurs SI 10.000, Approved | https://staging.olshoperp.com/accounting/customer-invoice/edit/861 |
| Cash/Bank | Bank BCA USD Staging (USD) |  |
| Header AR | Transaction Currency USD, Exchange Rate 16.000 |  |
| Nominal uji | to be Paid Amount (USD) 100,00 | Isian dalam USD (header). Kolom Paid Amount IDR akan menampilkan 1.600.000 |
| Akun Adjustment | 'Biaya Admin Bank' (kode 9-90001) untuk Debit; 'Biaya Kirim Dokumen, Pos & Materai' (kode 7-70108) untuk Credit | Pilih lewat Select Account |
| Baris Adjustment | Debit USD 20,00; Debit USD 5,00; Credit USD 8,00 | Debit 25,00 tampil negatif, Credit 8,00 tampil positif di Summary |

## Langkah dan hasil yang harus terlihat

1. Login, pastikan company Dev Staging.
2. Buat AR: Create; Customer = PT Nusa Jaya Abadi, Transaction Currency = USD, Exchange Rate = 16.000; lanjut sampai halaman Edit.
3. Available Sales Invoice → SI-69A949E7 → Use → to be Paid Amount (USD) = 100,00 → Save.
   - Cek tabel Detail: Paid Amount 100,00.
   - Cek Summary: Piutang USD 100,00; Total USD 100,00 orange.
4. Di section Adjustment: Select Account = 'Biaya Admin Bank' (9-90001), isi Debit = 20,00, klik Save.
   - Cek Summary: Adj Debit USD -20,00; Total USD 80,00 orange.
5. Adjustment kedua: Account = 'Biaya Admin Bank', Debit = 5,00, Save.
   - Cek Summary: Adj Debit USD -25,00; Total USD 75,00.
6. Adjustment ketiga: Account = 'Biaya Kirim Dokumen, Pos & Materai' (7-70108), Credit = 8,00, Save.
   - Cek Summary: Adj Credit USD 8,00; Total USD 83,00 orange.
7. Receiving Destination → Select Cash/Bank → centang 'Bank BCA USD Staging' → Use → Amount = 83,00 → simpan.
   - Cek Summary: Cash / Bank USD -83,00; Total USD 0,00 warna normal.

## Hasil yang diharapkan

- Piutang USD 100,00; Cash / Bank USD -83,00; Credit Note USD 0,00; Adj Debit USD -25,00; Adj Credit USD 8,00; Total USD 0,00 normal.
- Adj Debit adalah jumlah semua baris Debit (20 + 5) dan tampil negatif; Adj Credit jumlah semua baris Credit dan tampil positif; keduanya dalam USD (bukan rupiah, bukan nilai kolom Amount In IDR).
- Setiap Save Adjustment langsung mengubah Summary tanpa reload.

## Catatan QA

- Rumus AR: Piutang 100 − Adj Debit 25 + Adj Credit 8 − Cash/Bank 83 = 0. Tanda Adjustment di AR kebalikan dari AP.
- Dokumen ini DRAFT (belum dijalankan). Hasil run dicatat di card ETM-16719.

## Pembersihan data (akhir tes)

- Hapus dokumen AR uji yang kamu buat (daftar Account Receive → pilih dokumen → Delete) supaya Sales Invoice dan Credit Note yang tertahan (reserved) dilepas dan bisa dipakai penguji lain. Dokumen yang sudah Approved tidak dihapus.
- Credit Note baru yang kamu buat sendiri (hanya TC Credit Note bagian USD) boleh dibiarkan Approved untuk uji ulang berikutnya.
- Simpan screenshot hasil (khususnya kotak Summary) sebagai bukti sebelum dokumen dihapus.
