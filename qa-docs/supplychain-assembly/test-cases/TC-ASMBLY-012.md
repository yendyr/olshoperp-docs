---
doc_type: e2e-test-case
tc_code: PENDING-20260902145501
menu: supplychain-assembly
menu_name: "Assembly"
test_type: happy
title: "Implementasi COLLI V2 (Multi-SKU per Colli) pada Transaksi Assembly"
summary: "Memverifikasi fitur Colli V2 pada perakitan barang jadi (Assembly), meliputi validasi faktor Colli Target Qty, kalkulasi Qty per Colli, auto-generate Colli Code saat Approve, serta konsistensi konversi UoM."
status: draft
owner: QA - Yemima
last_updated: 2026-09-02
requirement_ref: "qa-docs/supplychain-assembly/requirement.md"
automated: false
automated_spec: null
execution_company:
  id: 13
  code: DEV-STG
related_menus:
  - supplychain-multisku-colli
  - supplychain-colli-type
preconditions:
  - "User login ke OlshopERP Staging."
  - "Stok komponen tersedia (ASM-TOWEL01, ASM-BLND, ASM-PLUSH masing-masing 1000 pcs loose)."
  - "Tersedia Master Unit primary 'pieces' dan alternative 'box' (1 box = 10 pieces)."
test_data:
  - field: "SKU Header"
    value: "ASM-BLND, ASM-PLUSH"
  - field: "Assembly Qty"
    value: "100 / 20"
  - field: "Colli Target Qty"
    value: "5 / 20"
steps:
  - "Buka menu Supply Chain Management -> Assembly, buat dokumen baru."
  - "TC-01: Masukkan ASM-BLND (Qty = 100). Input Colli Target Qty non-faktor (3, 6, 7) vs faktor valid (2, 5, 10, 20)."
  - "TC-02: Input Qty = 100 dan Colli Target Qty = 20, periksa kalkulasi Qty per Colli (otomatis 5)."
  - "TC-03: Klik 'Create Colli' (New Colli) dan periksa kolom Colli Target (terisi 'New', kode COL belum ter-generate)."
  - "TC-04 & TC-05: Approve dokumen Assembly (AS-6A978EFE), periksa 5 kode Colli baru di menu Multi-SKU Colli dan dokumen Inbound (IN-5UBDRLGY)."
  - "TC-06: Uji konversi UoM dari pieces ke box pada inline edit dan modal 'Edit this Item'."
expected_result: |
  1. Input Colli Target Qty non-faktor ditolak dengan pesan: "COLLI Target Qty must divide Assembly Qty evenly."
  2. Qty per Colli otomatis terhitung (Qty / Colli Target Qty).
  3. Kode Colli baru ter-generate tepat sejumlah Colli Target Qty saat dokumen disetujui (Approved).
  4. Konversi unit (pieces ke box) menangani kuantitas dan alokasi colli secara konsisten tanpa penolakan tanpa notifikasi atau pengosongan field produk di modal edit.
test_result:
  status: failed
  started_at: "2026-09-02T11:00:00+07:00"
  finished_at: "2026-09-02T14:30:00+07:00"
  executed_by: "QA Manual"
  environment: staging
  log_summary: "FAILED — Ditemukan 3 bug & 1 usulan improvement: (1) Field Qty memotong teks/terpotong di UI, (2) Inkonsistensi feedback inline edit vs modal edit saat konversi unit menghasilkan Qty per Colli non-faktor, (3) Modal 'Edit this Item' tidak mengisikan produk secara otomatis (kosong), (4) Improvement: Kolom Colli Code Destination di dokumen Inbound/TFI hasil Approve bernilai null."
  report_url: null
test_data_used: []
run_history:
  - at: "2026-09-02"
    status: failed
    environment: staging
    note: "FAILED — Ditemukan isu UI truncation, inkonsistensi konversi UoM, dan field produk kosong di modal edit."
origin_jira: ETM-15497
last_execution:
  at: "2026-09-02"
  jira: "ETM-15497"
  status: failed
  via: "manual:p"
---

# PENDING-20260902145501

## Catatan QA
- **Latar Belakang:** Pengujian fitur Colli V2 pada perakitan barang jadi (Assembly).
- **Relasi JIRA:** Terkait dengan card `ETM-15497`.
