---
doc_type: e2e-test-case
tc_code: TC-MTEX-011
menu: supplychain-mutation-transfer-external
menu_name: "Transfer External"
test_type: negative
title: "Konsistensi Konversi Unit (UOM) dan Validasi Stok saat Penyuntingan Baris Detail - Transfer External"
summary: "Memverifikasi perilaku konversi unit (pieces ke box), alokasi FIFO, dan sinkronisasi atribut colli (origin & destination) ketika unit diubah melalui inline edit detail grid atau modal pada Transfer External."
status: draft
owner: QA - Yemima
last_updated: 2026-09-11
requirement_ref: "qa-docs/supplychain-mutation-transfer-external/requirement.md"
automated: false
automated_spec: null
execution_company:
  id: 13
  code: DEV-STG
related_menus: []
preconditions:
  - "User login ke OlshopERP."
  - "Company aktif: DEV-STG (13)."
  - "Tersedia stok produk SKU-COLLI05 (Full Colli Transfer, Colli Origin & Destination COL-6AA3809E, Qty 10 pieces / 1 box)."
  - "Tersedia stok produk SKU-COLLI03 (loose, qty 5 pieces)."
  - "Tersedia stok produk SKU-COLLI01 (Partial Colli Transfer, Colli Origin COL-6A912EB5, Qty 9 pieces)."
test_data:
  - field: "Conversion"
    value: "1 Box = 10 Pieces"
  - field: "Tested Items"
    value: "Stock ID 134821 (Full Colli), Stock ID 134819 (Loose), Stock ID 134822 (Partial Colli)"
steps:
  - "Buka dokumen Transfer External baru (Draft/Open)."
  - "Tambahkan 3 baris pengujian:"
  - "  1. Case 1 (Full Colli Transfer): SKU-COLLI05 (Stock ID 134821), Colli Origin COL-6AA3809E, Qty 10 pieces, Colli Destination COL-6AA3809E."
  - "  2. Case 2 (Loose SKU): SKU-COLLI03 (Stock ID 134819), Qty 5 pieces, tanpa colli."
  - "  3. Case 3 (Partial Colli Transfer): SKU-COLLI01 (Stock ID 134822), Colli Origin COL-6A912EB5, Qty 9 pieces, Colli Destination null."
  - "Ubah unit pada baris Case 2 dan Case 3 menjadi unit alternatif 'box' via inline edit / modal."
  - "Periksa konversi unit dan kuantitas pada Case 2 dan Case 3."
  - "Ubah unit pada baris Case 1 (Full Colli) menjadi unit alternatif 'box' via inline edit / modal update."
  - "Amati perubahan item_stock_id, Colli Code Origin, Colli Code Destination, serta kuantitas di grid detail."
expected_result: |
  1. Pada Case 2 (Loose) dan Case 3 (Partial Colli), unit dan kuantitas transfer otomatis terkonversi secara proporsional sesuai rasio konversi unit (pieces ke box).
  2. Pada Case 1 (Full Colli Transfer), saat unit diubah dan sistem menjalankan ulang alokasi FIFO yang mengalokasikan stok ke item_stock_id baru yang tidak terikat colli origin tersebut:
     - Colli Origin menyesuaikan/terlepas sesuai batch stok yang baru.
     - Colli Destination lama wajib di-reset otomatis menjadi NULL (-) agar tidak menempel pada baris produk yang sudah berganti stock ID.
test_result:
  status: failed
  started_at: "2026-09-11T15:00:00+07:00"
  finished_at: "2026-09-11T15:45:00+07:00"
  executed_by: "QA Manual"
  environment: staging
  log_summary: "FAIL — Terjadi bug Colli Destination nyangkut pasca realokasi FIFO. Pada Case 1 (Full Colli), perubahan unit ke 'box' memicu alokasi ulang FIFO sehingga item_stock_id berganti ke batch lain dan Colli Origin terlepas. Namun, nilai Colli Destination lama tidak di-reset ke NULL (tetap nyangkut di baris detail). Untuk Case 2 (loose) dan Case 3 (partial colli), konversi unit berhasil tersimpan."
  report_url: null
test_data_used: []
run_history:
  - at: "2026-08-31"
    status: failed
    environment: staging
    note: "FAIL — Inkonsistensi UI unit dan qty pasca edit."
  - at: "2026-09-11"
    status: failed
    environment: staging
    note: "FAIL (Retest ETM-15692) — Realokasi FIFO saat ubah UoM mengubah item_stock_id, tetapi Colli Destination lama tetap nyangkut."
origin_jira: ETM-15646
last_execution:
  at: "2026-09-11"
  jira: "ETM-15692"
  status: failed
  via: "manual:p"
  notes: "Retest ETM-15692: update unit memicu realokasi FIFO ke item_stock_id baru, namun Colli Destination lama tidak ter-reset (nyangkut)."
first_execution:
  at: "2026-08-31"
  via: "manual:p"
  jira: "ETM-15646"
---

# TC-MTEX-011

## Catatan QA
- **Latar Belakang:** Pengujian dilakukan untuk memverifikasi validasi konversi UoM (Unit of Measure) saat penyuntingan detail transaksi Transfer External.
- **Relasi JIRA:** Terkait dengan card `ETM-15646` dan retest `ETM-15692`.
- **Temuan Retest ETM-15692 (2026-09-11):**
  - Mengubah unit dari satuan dasar (`pieces`) ke satuan alternatif (`box`) pada produk Full Colli memicu sistem menjalankan alokasi FIFO ulang sesuai requirement §6.1.
  - Hal ini menyebabkan `item_stock_id` berubah ke batch baru.
  - Namun terdapat celah: field `Colli Destination` lama tidak dibersihkan/direset ke NULL, sehingga terjadi ketidaksinkronan data colli dengan stock ID hasil realokasi.
