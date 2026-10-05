---
doc_type: e2e-test-case
tc_code: TC-VAR-009
menu: supplychain-variant
menu_name: "Master Variant"
test_type: negative
title: "Hapus Master Variant Default 'Standard' yang Sedang Digunakan oleh System Product"
summary: "Memastikan sistem memblokir penghapusan Master Variant Default (standard) yang sedang terikat aktif pada System Product dengan notifikasi proteksi integritas data."
status: ready
owner: "QA - Yemima"
last_updated: 2026-10-05
requirement_ref: "qa-docs/supplychain-variant/requirement.md §5 & §6"
automated: false
automated_spec: null
origin_jira: ETM-16225
execution_company:
  id: 13
  code: DEV-STG
related_menus:
  - system-product
preconditions:
  - "User login ke environment Staging."
  - "Terdapat Master Variant 'standard' dengan toggle Set as Default System Product ON."
  - "Terdapat System Product 'SKU-MasterVariant01-(PARENT)' yang menggunakan variant default 'standard'."
test_data:
  - field: "Default Variant"
    value: "standard"
  - field: "System Product"
    value: "SKU-MasterVariant01-(PARENT)"
steps:
  - "1. Buka menu Master Variant (/supplychain/variant)."
  - "2. Cari data Variant Group 'standard' yang terikat pada System Product."
  - "3. Klik tombol aksi Delete pada baris variant 'standard'."
  - "4. Konfirmasi dialog penghapusan dan amati respon sistem."
expected_result: |
  Penghapusan ditolak oleh sistem dan memunculkan toast/notifikasi error:
  "This variant cannot be deleted because it is already used in system product."
test_result:
  status: passed
  started_at: "2026-10-05T13:20:00+07:00"
  finished_at: "2026-10-05T13:25:00+07:00"
  executed_by: "OlshopERP (resty)"
  environment: staging
  log_summary: "PASSED: Penghapusan Master Variant 'standard' yang terikat di System Product SKU-MasterVariant01-(PARENT) berhasil ditolak sistem dengan pesan notifikasi 'This variant cannot be deleted because it is already used in system product.'."
  report_url: null
test_data_used:
  - default_variant: "standard"
    system_product: "SKU-MasterVariant01-(PARENT)"
run_history:
  - run_at: "2026-10-05T13:25:00+07:00"
    status: passed
    via: "manual:OlshopERP"
    jira: "ETM-16225"
    note: "PASSED: Validasi proteksi delete variant default yang terikat produk berfungsi normal."
first_execution:
  at: "2026-10-05T13:25:00+07:00"
  via: "manual:OlshopERP"
  jira: "ETM-16225"
last_execution:
  at: "2026-10-05T13:25:00+07:00"
  jira: "ETM-16225"
  status: passed
  via: "manual:OlshopERP"
---

# TC-VAR-009: Hapus Master Variant Default 'Standard' yang Sedang Digunakan oleh System Product

## Objective
Memverifikasi fungsionalitas proteksi data pada menu Master Variant, memastikan variant group default (`standard`) yang sedang berelasi dengan System Product tidak dapat dihapus secara sepihak.

## Rujukan Requirement
- `qa-docs/supplychain-variant/requirement.md` — §5 (Delete & Active) dan §6.6 (Konsumen System Product).

## Bukti Pengujian (Evidence)
- **Action:** Hapus variant `standard` dari menu Master Variant saat masih terikat ke `SKU-MasterVariant01-(PARENT)`.
- **Actual Result:** Ditolak sistem dengan notifikasi:  
  *"This variant cannot be deleted because it is already used in system product."* ✅
- **Evidence Video/Jam:** https://jam.dev/c/12ad1a1b-75cd-4ca0-bbb1-7406a3cf0e46
