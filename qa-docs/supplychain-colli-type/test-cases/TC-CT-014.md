---
doc_type: e2e-test-case
tc_code: TC-CT-014
menu: supplychain-colli-type
menu_name: "Colli Type"
test_type: edge
title: "Delete Colli Type boleh setelah inbound dan Colli code dihapus — history DB tidak mengunci"
summary: "Jika Purchase Inbound dihapus dan Colli code ikut hilang (termasuk already deleted), type boleh di-Delete meski ada history di DB."
status: ready
owner: QA - Yemima
last_updated: 2026-10-02
requirement_ref: "qa-docs/supplychain-colli-type/requirement.md"
automated: false
automated_spec: null
execution_company:
  id: 13
  code: DEV-STG
related_menus:
  - supplychain-new-purchase-inbound
    menu_name: "Purchase Inbound"
    role: involved
    note: "Hapus inbound Draft/Open/Rejected agar Colli code baru ikut hilang"
preconditions:
  - "User login ke staging dengan privilege delete Colli Type."
  - "Colli Type BX100 masih terikat ke Colli code pada transaksi Inbound (IN-5UMAONPF)."
test_data:
  - field: "Colli Type"
    value: "BX100"
  - field: "Purchase Inbound"
    value: "IN-5UMAONPF"
steps:
  - "1. Pada saat dokumen inbound IN-5UMAONPF masih aktif menggunakan colli code BX100, coba hapus Colli Type BX100 dari kolom action (single delete) dan bulk delete."
  - "2. Amati pesan error / validasi yang muncul."
  - "3. Hapus dokumen inbound IN-5UMAONPF dari sistem."
  - "4. Lakukan delete ulang pada Colli Type BX100 di master Colli Type."
expected_result: |
  1. Saat Colli Type masih dipakai Colli code pada transaksi aktif, aksi Delete diblokir dengan notifikasi: 'This COLLI Type cannot be deleted because it is already used by one or more COLLI codes.'
  2. Setelah dokumen transaksi yang memakai colli code tersebut dihapus, aksi Delete pada Colli Type BX100 BERHASIL dilakukan (soft delete).
test_result:
  status: passed
  started_at: "2026-10-02T09:45:00+07:00"
  finished_at: "2026-10-02T10:00:00+07:00"
  executed_by: "OlshopERP (resty)"
  environment: staging
  log_summary: "PASSED: Validasi delete berhasil memblokir penghapusan Colli Type BX100 yang sedang dipakai colli code (notifikasi valid). Setelah transaksi IN-5UMAONPF dihapus, penghapusan Colli Type BX100 berhasil dijalankan."
  report_url: "https://drive.google.com/file/d/1RvloMjw42VP7-tQEhi_2-fuZRZ9vhD9U/view?usp=drive_link"
test_data_used:
  - field: "Colli Type"
    value: "BX100"
  - field: "Purchase Inbound"
    value: "IN-5UMAONPF"
run_history:
  - run_at: "2026-10-02T10:00:00+07:00"
    status: passed
    via: "manual:OlshopERP"
    note: "PASSED: Delete terblokir saat colli code aktif; Delete sukses setelah dokumen transaksi dihapus."
origin_jira: ETM-15543
first_execution:
  at: "2026-10-02T10:00:00+07:00"
  via: "manual:OlshopERP"
  jira: "ETM-15543"
last_execution:
  at: "2026-10-02T10:00:00+07:00"
  jira: "ETM-15543"
  status: passed
  via: "manual:OlshopERP"
---

# TC-CT-014: Delete Colli Type boleh setelah inbound dan Colli code dihapus — history DB tidak mengunci

## Bukti Pengujian (Evidence)
- Notifikasi Delete Terblokir saat Colli Type Sedang Dipakai Colli Code: https://drive.google.com/file/d/1hh4n8d5Og-oPcKe5kEj6jeb30Bao459l/view?usp=drive_link
- Hapus Inbound IN-5UMAONPF lalu Hapus Colli Type BX100 (Success): https://drive.google.com/file/d/1RvloMjw42VP7-tQEhi_2-fuZRZ9vhD9U/view?usp=drive_link

## Hasil Pengujian
- **Status:** **PASSED 🟢**
- **Skenario 1 (Sedang Dipakai):** Klik icon delete dari action column (single delete) maupun bulk delete berhasil memunculkan pesan validasi penolakan: *"This COLLI Type cannot be deleted because it is already used by one or more COLLI codes."*
- **Skenario 2 (Setelah Inbound Dihapus):** Setelah dokumen inbound `IN-5UMAONPF` dihapus, Colli Type `BX100` berhasil dihapus tanpa terkunci oleh history log lama di database.
