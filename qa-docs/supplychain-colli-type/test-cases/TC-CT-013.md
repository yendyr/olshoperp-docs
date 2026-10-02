---
doc_type: e2e-test-case
tc_code: TC-CT-013
menu: supplychain-colli-type
menu_name: "Colli Type"
test_type: edge
title: "Active OFF boleh setelah inbound dan Colli code dihapus — history DB tidak mengunci"
summary: "Jika Purchase Inbound dihapus dan Colli code ikut hilang (termasuk yang already deleted), type bisa di-Inactive meski ada history di DB."
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
  - "User login ke staging dengan akses company Dev-Staging."
  - "Colli Type BX100 digunakan pada transaksi Purchase Inbound."
test_data:
  - field: "Company"
    value: "Dev-Staging"
  - field: "Colli Type"
    value: "BX100"
  - field: "Inbound 1 (Open)"
    value: "IN-5UMAONPF"
  - field: "Inbound 2 (Draft)"
    value: "IN-5UMAMFZU"
steps:
  - "1. Pada company Dev-Staging, buat transaksi Purchase Inbound (IN-5UMAONPF status Open) dan buat colli code baru menggunakan Colli Type BX100."
  - "2. Buka master Colli Type, ubah BX100 menjadi Active = OFF lalu simpan."
  - "3. Buka kembali IN-5UMAONPF, verifikasi apakah colli code existing masih bisa dipakai dan opsi BX100 hilang dari dropdown New Colli."
  - "4. Pada transaksi inbound draft (IN-5UMAMFZU), hapus dokumen dari datalist, lalu pastikan BX100 dapat dinon-aktifkan tanpa error."
expected_result: |
  1. Pada dokumen berstatus Open (IN-5UMAONPF), saat Colli Type BX100 dinon-aktifkan (Active = OFF), status Active OFF berhasil tersimpan. Di form transaksi, colli code existing tetap dapat diterapkan ke baris detail lain, namun opsi BX100 sudah tidak muncul di dropdown New Colli.
  2. Saat dokumen inbound draft (IN-5UMAMFZU) dihapus, Colli Type BX100 berhasil dinon-aktifkan tanpa error dan tanpa terkunci oleh history DB.
test_result:
  status: passed
  started_at: "2026-10-02T09:30:00+07:00"
  finished_at: "2026-10-02T09:45:00+07:00"
  executed_by: "OlshopERP (resty)"
  environment: staging
  log_summary: "PASSED: Colli Type BX100 berhasil dinon-aktifkan (Active = OFF). Pada transaksi Open (IN-5UMAONPF), colli code existing tetap dapat digunakan namun opsi BX100 tidak lagi muncul pada dropdown New Colli. Penghapusan inbound draft (IN-5UMAMFZU) juga memungkinkan Active OFF tanpa error."
  report_url: "https://drive.google.com/file/d/1YoO5xJ8V3vzWzL-hYlT-EOYkSYHrooJq/view?usp=drive_link"
test_data_used:
  - field: "Colli Type"
    value: "BX100"
  - field: "Inbound Open"
    value: "IN-5UMAONPF"
  - field: "Inbound Draft"
    value: "IN-5UMAMFZU"
run_history:
  - run_at: "2026-10-02T09:45:00+07:00"
    status: passed
    via: "manual:OlshopERP"
    note: "PASSED: Active OFF berhasil disimpan dan menghapus opsi BX100 dari dropdown New Colli transaksi."
origin_jira: ETM-15543
first_execution:
  at: "2026-10-02T09:45:00+07:00"
  via: "manual:OlshopERP"
  jira: "ETM-15543"
last_execution:
  at: "2026-10-02T09:45:00+07:00"
  jira: "ETM-15543"
  status: passed
  via: "manual:OlshopERP"
---

# TC-CT-013: Active OFF boleh setelah inbound dan Colli code dihapus — history DB tidak mengunci

## Bukti Pengujian (Evidence)
- Master Colli Type BX100: https://drive.google.com/file/d/1YoO5xJ8V3vzWzL-hYlT-EOYkSYHrooJq/view?usp=drive_link
- Inbound Open (IN-5UMAONPF) - Active OFF tersimpan, existing colli bisa dipakai tapi dropdown New Colli tidak menampilkan BX100: https://drive.google.com/file/d/1Gf0B49j-vDhVVyLatXS0T3pT2eRBdg3g/view?usp=drive_link
- Inbound Draft (IN-5UMAMFZU) dihapus dan colli type dinon-aktifkan: https://drive.google.com/file/d/1fIl13MlTkwSnD45Omp27KJf5UCj58Gyc/view?usp=drive_link

## Hasil Pengujian
- **Status:** **PASSED 🟢**
- Saat Colli Type `BX100` diset `Active = OFF`:
  1. Pada dokumen transaksi Open (`IN-5UMAONPF`), colli code existing tetap dapat dipakai pada detail baris, namun opsi `BX100` otomatis hilang dari dropdown pembuatan New Colli.
  2. Pada dokumen Draft (`IN-5UMAMFZU`), setelah dokumen dihapus dari datalist, Colli Type dapat dinon-aktifkan secara lancar tanpa hambatan relasi database lama.
