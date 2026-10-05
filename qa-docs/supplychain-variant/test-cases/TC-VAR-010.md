---
doc_type: e2e-test-case
tc_code: TC-VAR-010
menu: supplychain-variant
menu_name: "Master Variant"
test_type: negative
title: "Hapus Master Variant Non-Default yang Sedang Digunakan oleh System Product"
summary: "Memastikan sistem memblokir penghapusan Master Variant non-default (Variant Test) yang telah terikat ke System Product dengan notifikasi proteksi integritas data."
status: ready
owner: "QA - Yemima"
last_updated: 2026-10-05
requirement_ref: "qa-docs/supplychain-variant/requirement.md §3.3 & §5"
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
  - "Terdapat Master Variant 'Variant Test' (Code: DLT-VAR, Options: D1, D2, D3, random)."
  - "Terdapat System Product 'SKU-MasterVariant01-(PARENT)' yang menggunakan variant 'Variant Test' (D1)."
test_data:
  - field: "Variant Group"
    value: "Variant Test (Code: DLT-VAR)"
  - field: "Option"
    value: "D1"
  - field: "System Product"
    value: "SKU-MasterVariant01-(PARENT)"
steps:
  - "1. Buka menu Master Variant (/supplychain/variant)."
  - "2. Cari data Variant Group 'Variant Test' (DLT-VAR) yang terikat pada System Product."
  - "3. Klik tombol aksi Delete pada baris variant 'Variant Test'."
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
  log_summary: "PASSED: Penghapusan Master Variant non-default 'Variant Test' (DLT-VAR) yang terikat di System Product SKU-MasterVariant01-(PARENT) berhasil ditolak sistem dengan notifikasi 'This variant cannot be deleted because it is already used in system product.'."
  report_url: null
test_data_used:
  - variant_group: "Variant Test (DLT-VAR)"
    option: "D1"
    system_product: "SKU-MasterVariant01-(PARENT)"
run_history:
  - run_at: "2026-10-05T13:25:00+07:00"
    status: passed
    via: "manual:OlshopERP"
    jira: "ETM-16225"
    note: "PASSED: Proteksi delete variant yang terikat ke system product berfungsi normal."
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

# TC-VAR-010: Hapus Master Variant Non-Default yang Sedang Digunakan oleh System Product

## Objective
Memverifikasi fungsionalitas proteksi integritas relasi data pada menu Master Variant, memastikan variant group non-default (`Variant Test`) yang telah terikat ke System Product tidak dapat dihapus.

## Rujukan Requirement
- `qa-docs/supplychain-variant/requirement.md` — §3.3 (Option UX: Hapus opsi/header non-random ditolak jika sudah dipakai System Product) dan §5 (Delete & Active).

## Bukti Pengujian (Evidence)
- **Action:** Hapus variant `Variant Test` (Code: `DLT-VAR`) yang digunakan di `SKU-MasterVariant01-(PARENT)`.
- **Actual Result:** Ditolak sistem dengan notifikasi:  
  *"This variant cannot be deleted because it is already used in system product."* ✅
- **Evidence Video/Jam:** https://jam.dev/c/10bbdc16-bb2f-427d-9782-b71df006cd81

## Catatan Tambahan (Side Finding):
- Terjadi penggantian/hilangnya variant default `standard` saat menambahkan variant baru `Variant Test` pada form edit System Product (Video: https://jam.dev/c/6675eef5-f57b-42d8-bb69-d910a2fa9773).
