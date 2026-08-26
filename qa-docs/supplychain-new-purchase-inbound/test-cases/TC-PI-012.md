---
doc_type: e2e-test-case
tc_code: TC-PI-012
menu: supplychain-new-purchase-inbound
menu_name: "BETA - New Purchase Inbound"
test_type: negative
title: "Import Inbound — Validasi Campuran Baris Excel (Edge/Negative cases)"
summary: "Unggah template Excel berisi data valid, invalid (qty <= 0), typo colli, required fields kosong untuk memverifikasi log error, notifikasi, dan downstream safety."
status: draft
owner: QA - Cursor
last_updated: 2026-08-24
requirement_ref: "qa-docs/supplychain-new-purchase-inbound/requirement.md"
automated: false
automated_spec: null
execution_company:
  id: 13
  code: DEV-STG
related_menus: []
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company aktif: DEV-STG (id: 13)."
  - "Purchase Inbound Draft/Open terikat PO PO-6A8665EC (outstanding SKU-HANDUK, SKU-LAPMEJA, SKU-HANGER tersedia)."
  - "Existing colli terdaftar di inbound: COL-6A867287."
  - "File uji 'import campuran row.xlsx' sudah disiapkan dengan isi sesuai tabel test data."
test_data:
  - field: "Isi Excel"
    value: |
      | Excel Row | PO Code | System Product SKU | Inbound Qty | Unit | COLLI | Intent baris |
      | --- | --- | --- | --- | --- | --- | --- |
      | 2 | PO-6A8665EC | SKU-HANDUK | 5 | PCS | COL-6A867281 | COLLI tidak ada (typo) |
      | 3 | PO-6A8665EC | SKU-LAPMEJA | 5 | PCS | COL-6A867287 | COLLI existing valid |
      | 4 | PO-6A8665EC | SKU-HANGER | 5 | PCS | ABC123 | COLLI tidak ada |
      | 5 | PO-6A8665EC | SKU-HANDUK | 5 | (kosong) | (kosong) | Unit required kosong |
      | 6 | PO-6A8665EC | SKU-LAPMEJA | 5 | PCS | @#- | COLLI invalid |
      | 7 | PO-6A8665EC | (kosong) | 5 | PCS | 0 | SKU kosong |
      | 8 | PO-6A8665EC | SKU-HANDUK | 5O | PCS | (kosong) | Qty non-numeric |
      | 9 | PO-6A8665EC | SKU-LAPMEJA | ii | PCS | 500a | Qty non-numeric + COLLI invalid |
      | 10 | PO-6A8665EC | SKU-HANGER | 5 | PCS | 500a | COLLI invalid |
      | 11 | PO-6A8665EC | SKU-HANGER | 5 | PCS | 500B | COLLI invalid |
      | 12 | PO-6A8665EC | RM-Variant-Pink | 5 | PCS | (kosong) | SKU tidak di PO |
      | 13 | (kosong) | SKU-HANGER | 5 | PCS | (kosong) | PO Code kosong |
      | 14 | PO-6A8665EC | SKU-HANDUK | 5 | S | (kosong) | Unit tidak di master |
      | 15 | PO-6A8665EC | SKU-HANDUK | 5 | PCS | 0 | COLLI = 0 (value group) |
      | 16 | PO-6A8665EC | SKU-HANDUK | -1 | PCs | 0 | Qty minus + COLLI = 0 |
      | 17 | PO-6A8665EC | SKU-HANDUK | 0 | PCs | (kosong) | Qty 0 |
steps:
  - "Buka edit Purchase Inbound Draft/Open yang terikat PO-6A8665EC."
  - "Unggah file Excel 'import campuran row.xlsx'."
  - "Periksa notifikasi pop-up summary setelah upload selesai."
  - "Klik tombol 'View Error Logs' di UI."
  - "Verifikasi keterurutan pesan log berdasarkan nomor baris Excel (ascending)."
  - "Verifikasi kolom 'Product' pada tabel log error terisi dengan SKU terkait."
  - "Verifikasi log error untuk Row 9 memuat pesan kegagalan kuantitas numeric dan colli tidak ditemukan."
  - "Periksa grid detail inbound. Pastikan Row 3 terikat COL-6A867287 dan Row 15 terikat colli code baru yang tergenerate otomatis."
  - "Verifikasi Row 16 (Qty -1) dan Row 17 (Qty 0) gagal masuk ke grid detail."
  - "Pilih baris yang berhasil diimport, lalu klik tombol Bulk Delete. Amati error log."
  - "Ulangi import ulang tanpa menyertakan baris qty negatif, lalu klik Approve. Amati error log."
expected_result: |
  - Excel Row 16 (Qty -1) dan Row 17 (Qty 0) gagal diimport.
  - Notifikasi ringkasan menampilkan: '3 successful and 13 failed' (bukan 0 successful).
  - View Error Logs menampilkan log yang terurut ascending berdasarkan nomor baris Excel.
  - Kolom 'Product' di tabel log error menampilkan SKU yang sesuai (tidak kosong / -).
  - Row 9 menampilkan multi-error (kegagalan qty dan colli sekaligus).
  - Bulk Delete dan Approve dokumen berhasil tanpa memicu fatal error database/code 'cannot below zero'.
test_result:
  status: passed
  started_at: "2026-08-24T14:00:00+07:00"
  finished_at: "2026-08-24T14:33:59+07:00"
  executed_by: "QA Manual"
  environment: staging
  log_summary: "PASS — Semua validasi impor, sortir log error, bloking qty <= 0, bulk delete, dan approve berhasil tanpa kendala. Performa impor 1000 baris cepat."
  report_url: null
test_data_used: []
run_history:
  - at: "2026-08-20"
    status: failed
    environment: staging
    note: "FAIL — Sesuai deskripsi aktual JIRA ETM-15611."
  - at: "2026-08-24"
    status: passed
    environment: staging
    note: |
      PASS:
      1. Notif summary impor benar: '2 imports successful, 14 failed. Check the log for details.'
      2. Jumlah sukses (2) dan gagal (14) di log & grid detail sinkron.
      3. Kuantitas <= 0 diblokir saat impor.
      4. Log error terurut ascending by Excel Row, kolom Product terisi, multi-error tertangkap.
      5. Inline edit qty 0 & modal update qty 0 diblokir dengan pesan error yang sesuai.
      6. Bulk delete dan Approve sukses tanpa memicu error fatal.
      7. Impor alternatif unit (sebagian melebihi outstanding max) sukses terfilter, stock masuk dalam unit pieces.
      8. Uji performa impor 1000 baris sukses dengan cepat.
origin_jira: ETM-15611
last_execution:
  at: "2026-08-20"
  jira: "ETM-15611"
  status: passed
  via: "legacy:test_result"
---

# TC-PI-DRAFT-20260824124900

## Catatan QA

Gunakan file attachment `import campuran row.xlsx` dari card JIRA ETM-15611.
Dokumen PO yang digunakan wajib memiliki outstanding qty yang cukup untuk alokasi import.
