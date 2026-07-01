---
doc_type: e2e-test-case
tc_code: TC-GENCO-001
menu: generalsetting-general-company
menu_name: General Company
title: Delete ditolak jika ada relasi transaksi
summary: Delete shipper JNE ditolak karena masih dipakai di Sales Order
status: review
owner: QA - Yemima
last_updated: "2026-06-25"
requirement_ref: "§14.3"
automated: true
automated_spec: e2e/general-company-delete-guard.spec.ts
execution_company:
  code: FAT
  id: 112
related_menus:
  - menu_slug: generalsetting-general-company
    menu_name: General Company
    role: primary
    note: Menu utama yang diuji (aksi Delete di datalist)
  - menu_slug: sales-order-general
    menu_name: Sales Order General
    role: involved
    note: Data JNE sebagai shipper berasal dari transaksi Sales Order yang sudah ada di staging
preconditions:
  - User sudah login dengan hak akses General Company (view + delete).
  - Staging company **FAT (id 112)** memiliki data General Company kode JNE (id 122) sebagai shipper.
  - Data JNE sudah dipakai di minimal satu Sales Order.
test_data:
  - field: General Company yang dipilih
    value: JNE (id 122, staging FAT) — shipper dengan relasi Sales Order existing
steps:
  - Buka menu General Company (`/generalsetting/general-company`).
  - Cari data dengan kode JNE di kolom search datalist.
  - Klik ikon Delete (tooltip-delete) pada baris JNE.
  - Pada modal konfirmasi "Are you sure?", klik tombol Delete.
expected_result: |
  - Muncul pesan error: "Cannot delete this data because it is already used in transaction."
  - Data JNE tetap ada di datalist (tidak terhapus).
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
---

## Catatan QA

- Tombol delete di UI memakai label **Delete** (bukan "Hapus").
- Guard backend: `SalesOrder.shipper_id` — lihat requirement §14.3.
