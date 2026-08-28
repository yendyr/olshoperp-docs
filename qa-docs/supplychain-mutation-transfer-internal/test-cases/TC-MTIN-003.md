---
doc_type: e2e-test-case
tc_code: TC-MTIN-003
menu: supplychain-mutation-transfer-internal
menu_name: "Transfer Internal"
test_type: happy
title: "Akses Menu Terpisah & Verifikasi Grid Available Product dengan Colli"
summary: "Memastikan menu khusus Colli V2 Transfer Internal terpisah dan menampilkan kolom Colli Code di list Available Product."
status: draft
owner: QA - Cursor
last_updated: 2026-08-24
requirement_ref: "qa-docs/supplychain-mutation-transfer-internal/requirement.md"
automated: false
automated_spec: null
execution_company:
  id: 13
  code: DEV-STG
related_menus: []
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company aktif: DEV-STG (id: 13)."
  - "Stok telah disiapkan di lokasi asal RAK-S-1-A-1 via PO PO-6A8BF899 dan Inbound IN-5U843NDK (Approved)."
test_data:
  - field: "Konfigurasi Lokasi & SKU"
    value: |
      * Location Origin: RAK-S-1-A-1
      * Location Destination: Seruni DropOff
      * Product SKU: SKU-TFI01 dan SKU-TFI02

      | ID Inbound | SKU | Qty | COLLI Code | Status Stok |
      | --- | --- | --- | --- | --- |
      | 234952 | SKU-TFI01 | 100 | - (kosong) | Loose Stock |
      | 234953 | SKU-TFI02 | 100 | - (kosong) | Loose Stock |
      | 234954 | SKU-TFI01 | 100 | COL-6A8BFA70 | Packed Stock |
      | 234955 | SKU-TFI02 | 100 | COL-6A8BFA83 | Packed Stock |
steps:
  - "Login ke aplikasi staging."
  - "Buka menu khusus Transfer Internal Colli V2 (pisahkan dengan menu existing)."
  - "Klik buat dokumen baru."
  - "Pilih Location Origin = 'RAK-S-1-A-1' dan Location Destination = 'Seruni DropOff'."
  - "Buka grid / modal Available Product."
  - "Periksa ketersediaan kolom Colli Code."
  - "Verifikasi apakah stok SKU-TFI01 dan SKU-TFI02 terpisah per colli sesuai tabel test data (2 baris loose dengan colli kosong, 2 baris packed dengan colli COL-6A8BFA70 / COL-6A8BFA83)."
  - "Verifikasi pencarian/filter stok berdasarkan Colli Code dengan mencari 'COL-6A8BFA70'."
expected_result: |
  - Fitur Colli V2 Transfer Internal berada pada menu terpisah dari Transfer Internal existing.
  - Terdapat kolom Colli Code pada list Available Product.
  - Grid Available Product membagi stok SKU-TFI01 dan SKU-TFI02 menjadi 4 entri yang sesuai dengan data inbound:
    * SKU-TFI01 dengan Colli Code = '-' (Qty 100)
    * SKU-TFI01 dengan Colli Code = 'COL-6A8BFA70' (Qty 100)
    * SKU-TFI02 dengan Colli Code = '-' (Qty 100)
    * SKU-TFI02 dengan Colli Code = 'COL-6A8BFA83' (Qty 100)
  - Fitur pencarian colli 'COL-6A8BFA70' sukses memfilter dan hanya menampilkan baris SKU-TFI01 milik colli tersebut.
test_result:
  status: passed
  started_at: "2026-08-24T15:15:00+07:00"
  finished_at: "2026-08-24T16:13:45+07:00"
  executed_by: "QA Manual"
  environment: staging
  log_summary: "PASS — 4 entri stok tampil persis sesuai purchase inbound. Pencarian colli 'COL-6A8BFA70' sukses memfilter hanya SKU-TFI01."
  report_url: null
test_data_used: []
run_history:
  - at: "2026-08-24"
    status: passed
    environment: staging
    note: "PASS — Pencarian colli 'COL-6A8BFA70' sukses memfilter hanya SKU-TFI01."
origin_jira: ETM-15553
first_execution:
  at: "2026-08-24"
  via: "legacy:test_result"
  jira: "ETM-15553"
last_execution:
  at: "2026-08-24"
  jira: "ETM-15553"
  status: passed
  via: "legacy:test_result"
---

# TC-MTIN-DRAFT-20260824150649

## Catatan QA

[BETA] Khusus verifikasi pemisahan menu dan kolom Colli Code di Available Product.
