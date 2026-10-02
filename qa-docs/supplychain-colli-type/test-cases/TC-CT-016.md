---
doc_type: e2e-test-case
tc_code: TC-CT-016
menu: supplychain-colli-type
menu_name: "Colli Type"
test_type: cross-menu
title: "Colli Type Active OFF tidak muncul pada pilihan New Colli di Purchase Inbound"
summary: "Memastikan Colli Type yang berstatus Active OFF tidak dapat dipilih pada dropdown opsi Colli Type saat pembuatan New Colli di menu Purchase Inbound."
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
preconditions:
  - "User login ke staging."
  - "Company aktif: Dev-Staging (13)."
  - "Terdapat Colli Type dengan status Active OFF (BX100)."
  - "Terdapat transaksi Purchase Inbound (IN-5UMAONPF)."
test_data:
  - field: "Colli Type (Active OFF)"
    value: "BX100 (Active: OFF)"
  - field: "Inbound Document"
    value: "IN-5UMAONPF"
steps:
  - "1. Pada master Colli Type Dev-Staging, pastikan Colli Type BX100 berstatus Active = OFF."
  - "2. Buka transaksi Purchase Inbound IN-5UMAONPF."
  - "3. Buka modal pembuatan New Colli pada baris barang."
  - "4. Buka dropdown pilihan Colli Type dan periksa apakah BX100 muncul dalam daftar."
expected_result: |
  Colli Type dengan status Active OFF (BX100) TIDAK MUNCUL pada opsi dropdown pembuatan New Colli di transaksi Purchase Inbound.
test_result:
  status: passed
  started_at: "2026-10-02T09:30:00+07:00"
  finished_at: "2026-10-02T09:45:00+07:00"
  executed_by: "OlshopERP (resty)"
  environment: staging
  log_summary: "PASSED: Colli Type BX100 yang berstatus Active OFF terbukti otomatis hilang dan tidak muncul pada dropdown pilihan Colli Type saat pembuatan New Colli di Purchase Inbound IN-5UMAONPF."
  report_url: "https://drive.google.com/file/d/1Gf0B49j-vDhVVyLatXS0T3pT2eRBdg3g/view?usp=drive_link"
test_data_used:
  - field: "Colli Type"
    value: "BX100 (Active: OFF)"
  - field: "Inbound Document"
    value: "IN-5UMAONPF"
run_history:
  - run_at: "2026-10-02T09:45:00+07:00"
    status: passed
    via: "manual:OlshopERP"
    note: "PASSED: Colli Type Active OFF terbukti tidak muncul pada dropdown New Colli transaksi."
origin_jira: ETM-15528
first_execution:
  at: "2026-10-02T09:45:00+07:00"
  via: "manual:OlshopERP"
  jira: "ETM-15528"
last_execution:
  at: "2026-10-02T09:45:00+07:00"
  jira: "ETM-15528"
  status: passed
  via: "manual:OlshopERP"
---

# TC-CT-016: Colli Type Active OFF tidak muncul pada pilihan New Colli di Purchase Inbound

## Bukti Pengujian (Evidence)
- Dropdown New Colli di Purchase Inbound (IN-5UMAONPF) - Opsi BX100 tidak muncul: https://drive.google.com/file/d/1Gf0B49j-vDhVVyLatXS0T3pT2eRBdg3g/view?usp=drive_link

## Hasil Pengujian
- **Status:** **PASSED 🟢**
- Pada saat Colli Type `BX100` disetting `Active = OFF` pada master Colli Type, opsi `BX100` terbukti otomatis tidak ditampilkan pada dropdown *Colli Type* saat user membuat New Colli di transaksi Purchase Inbound (`IN-5UMAONPF`). Sesuai spesifikasi requirement §3 dan §6.2.
