---
doc_type: e2e-test-case
tc_code: TC-PI-016
menu: supplychain-new-purchase-inbound
menu_name: "BETA - New Purchase Inbound"
test_type: regression
title: "Retest ETM-15611: Validasi Impor Colli Campuran, Notifikasi UI, dan Keakuratan Log Error"
summary: "Memastikan proses impor detail Colli dengan data campuran divalidasi dengan ketat, notifikasi hasil impor menunjukkan jumlah aktual, dan log error terurut secara ascending serta informatif."
status: draft
owner: QA - Yemima
last_updated: 2026-08-28
requirement_ref: "qa-docs/supplychain-new-purchase-inbound/requirement.md"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus: []
preconditions:
  - "User login menggunakan credential E2E: playwright@gmail.com / 12345678."
  - "Company aktif: FAT (id: 112)."
  - "Tersedia dokumen Purchase Inbound Draft/Open yang terikat pada PO PO-6A8665EC."
  - "Tersedia existing colli 'COL-6A867287' di sistem."
test_data:
  - field: "Excel File"
    value: "import campuran row.xlsx (17 baris termasuk header)"
steps:
  - "Buka dokumen Purchase Inbound Draft/Open target."
  - "Klik tombol 'Import' pada detail inbound untuk membuka sidebar impor."
  - "Klik tombol 'Import' kembali di dalam sidebar, lalu pilih opsi 'Upload File'."
  - "Pilih dan unggah file 'import campuran row.xlsx'."
  - "Amati pop-up notifikasi hasil impor di pojok kanan/tengah layar, pastikan ringkasannya tepat."
  - "Klik tab 'View Error Logs' yang terdapat di dalam sidebar impor."
  - "Verifikasi urutan baris pesan error (harus sorted ascending)."
  - "Verifikasi kolom 'Product' terisi dengan SKU produk terkait."
  - "Verifikasi Row 9 menampilkan pesan kesalahan kuantitas non-numerik sekaligus COLLI Code tidak ditemukan."
  - "Tutup sidebar impor dan periksa tabel grid detail inbound."
  - "Verifikasi bahwa Row 3 (terikat COL-6A867287) dan Row 15 (auto-generate colli) berhasil masuk."
  - "Verifikasi bahwa Row 16 (Qty -1) dan Row 17 (Qty 0) diblokir seutuhnya dari grid detail."
expected_result: |
  1. Notifikasi UI menampilkan hitungan summary: "3 successful and 13 failed".
  2. Tab 'View Error Logs' menampilkan log error terurut ascending berdasarkan nomor baris Excel.
  3. Kolom 'Product' terisi nama SKU produk yang bersangkutan.
  4. Terjadi multi-error detection di Row 9 (log memuat pesan qty non-numerik dan COLLI invalid).
  5. Hanya ada 2 baris item yang berhasil masuk ke detail grid (Row 3 dan Row 15), sedangkan Qty -1 dan Qty 0 gagal/ditolak seutuhnya.
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
origin_jira: ETM-15611
last_execution:
  at: null
  jira: null
  status: not_run
  via: null
first_execution:
  at: null
  via: null
  jira: null
---

# TC-PI-016

## Catatan QA
- **Latar Belakang:** Pengujian dilakukan untuk memverifikasi perbaikan bug import validation & error logs pasca ETM-15611.
- **Relasi JIRA:** Terkait dengan card `ETM-15611`.
