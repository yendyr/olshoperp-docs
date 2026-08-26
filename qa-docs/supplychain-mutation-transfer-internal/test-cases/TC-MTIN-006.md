---
doc_type: e2e-test-case
tc_code: TC-MTIN-006
menu: supplychain-mutation-transfer-internal
menu_name: "Transfer Internal"
test_type: cross-menu
title: "Persetujuan (Approve) Dokumen & Verifikasi Mutasi Stok Colli V2"
summary: "Melakukan approval dokumen Transfer Internal Colli V2 dan memeriksa perpindahan stok di lokasi origin dan destination."
status: draft
owner: QA - Cursor
last_updated: 2026-08-24
requirement_ref: "qa-docs/supplychain-mutation-transfer-internal/requirement.md"
automated: false
automated_spec: null
execution_company:
  id: 13
  code: DEV-STG
related_menus:
  - supplychain-product-mutation-stock
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company aktif: DEV-STG (id: 13)."
  - "Dokumen Transfer Internal Colli V2 berisi detail transfer dari TC-MTIN-DRAFT-20260824150650."
  - "Stok awal telah disiapkan di lokasi asal RAK-S-1-A-1 via PO PO-6A8BF899 dan Inbound IN-5U843NDK."
test_data:
  - field: "Location Origin"
    value: "RAK-S-1-A-1"
  - field: "Location Destination"
    value: "Seruni DropOff"
  - field: "Stok Awal di Origin"
    value: |
      * SKU-TFI01 (Loose): 100 pcs
      * SKU-TFI01 (COL-6A8BFA70): 100 pcs
      * SKU-TFI02 (Loose): 100 pcs
      * SKU-TFI02 (COL-6A8BFA83): 100 pcs
steps:
  - "Buka dokumen Transfer Internal Colli V2 yang sudah lengkap diisi detail colli (dari TC-MTIN-DRAFT-20260824150650)."
  - "Klik tombol Approve."
  - "Tunggu status dokumen berubah menjadi Approved."
  - "Buka menu mutasi stok atau cek saldo akhir stok untuk Lokasi Origin (RAK-S-1-A-1)."
  - "Buka menu mutasi stok atau cek saldo akhir stok untuk Lokasi Tujuan (Seruni DropOff)."
expected_result: |
  - Dokumen berhasil disetujui (Approved) tanpa memicu error database/sistem.
  - Saldo stok di Lokasi Origin (RAK-S-1-A-1) berkurang secara akurat:
    * SKU-TFI01 (Loose): Berkurang dari 100 menjadi 90 pcs (dikurangi 10 pcs).
    * SKU-TFI01 (COL-6A8BFA70): Berkurang dari 100 menjadi 85 pcs (dikurangi 15 pcs).
    * SKU-TFI02 (Loose): Berkurang dari 100 menjadi 80 pcs (dikurangi 20 pcs yang dikemas colli target).
    * SKU-TFI02 (COL-6A8BFA83): Tetap 100 pcs (tidak ada transfer).
  - Saldo stok di Lokasi Tujuan (Seruni DropOff) bertambah secara akurat:
    * SKU-TFI01 (Loose): Bertambah 10 pcs.
    * SKU-TFI01 (di bawah Colli Code COL-6A8C0379): Bertambah 15 pcs.
    * SKU-TFI02 (di bawah Colli Code COL-6A8C0379): Bertambah 20 pcs (kedua SKU bersatu dalam wadah colli ini).
test_result:
  status: passed
  started_at: "2026-08-24T15:15:00+07:00"
  finished_at: "2026-08-24T16:13:45+07:00"
  executed_by: "QA Manual"
  environment: staging
  log_summary: "PASS — Approve sukses untuk TFI-5U848VM3. Di mutasi histori: SKU-TFI01 mengambil dari 2 stock id (qty 10 & 15) dan SKU-TFI02 mengambil 1 stock id (qty 20). Ending balance wh tetap 200 pcs (internal transfer)."
  report_url: null
test_data_used:
  - "TFI-5U848VM3"
run_history:
  - at: "2026-08-24"
    status: passed
    environment: staging
    note: "PASS — Mutasi stok terverifikasi akurat."
origin_jira: ETM-15553
last_execution:
  at: "2026-08-24"
  jira: ETM-15553
---

# TC-MTIN-DRAFT-20260824150652

## Catatan QA

Verifikasi mutasi stok pergudangan untuk transaksi berbasis colli.
