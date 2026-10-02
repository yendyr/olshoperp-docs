---
doc_type: e2e-test-case
tc_code: TC-CT-012
menu: supplychain-colli-type
menu_name: "Colli Type"
test_type: permission
title: "Show Public Data ON di company B — Colli Type public milik A muncul dengan owner A"
summary: "Jika B allow data dari A, type public milik A tampil di datalist B; owner tetap company A."
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
  - generalsetting-internal-company
    menu_name: "Internal Company"
    role: involved
    note: "Section Show Public Data — toggle allow lihat public data company playwright"
preconditions:
  - "Lanjutan TC-CT-011: company playwright memiliki Colli Type public CT-PUB-PW dengan Show for all company = ON."
  - "Toggle Show Public Data untuk company playwright diaktifkan (ON) pada setting Internal Company Dev-Staging."
  - "URL Internal Company Dev-Staging: https://staging.olshoperp.com/generalsetting/internal-company/edit/{id-company-B}"
  - "URL Colli Type: https://staging.olshoperp.com/supplychain/colli-type"
test_data:
  - field: "Company A (Source)"
    value: "playwright"
  - field: "Company B (Receiver)"
    value: "Dev-Staging"
  - field: "Code (milik A)"
    value: "CT-PUB-PW"
  - field: "Show Public Data (Dev-Staging → playwright)"
    value: "ON"
steps:
  - "1. Login company playwright, buat Colli Type: Code 'CT-PUB-PW', Name 'Public Box Playwright', Show for all company = ON, Active = ON, simpan."
  - "2. Switch ke company Dev-Staging, buka Internal Company -> Edit Dev-Staging -> section Show Public Data."
  - "3. Aktifkan toggle untuk company playwright (ON) dan klik Save."
  - "4. Buka menu Colli Type di Dev-Staging (https://staging.olshoperp.com/supplychain/colli-type)."
  - "5. Cari record CT-PUB-PW milik playwright pada datalist Colli Type Dev-Staging."
expected_result: |
  Setelah Dev-Staging mengaktifkan toggle Show Public Data untuk company playwright:
  1. Record Colli Type public CT-PUB-PW milik playwright MUNCUL di datalist Colli Type Dev-Staging.
  2. Kepemilikan (owner) tetap teridentifikasi sebagai milik company playwright.
test_result:
  status: passed
  started_at: "2026-10-02T10:30:00+07:00"
  finished_at: "2026-10-02T10:40:00+07:00"
  executed_by: "OlshopERP (resty)"
  environment: staging
  log_summary: "PASSED: Setelah toggle Show Public Data untuk company playwright diaktifkan (ON) pada setting Internal Company Dev-Staging, data Colli Type public CT-PUB-PW milik playwright berhasil tampil pada datalist Colli Type Dev-Staging."
  report_url: "https://drive.google.com/file/d/1AVaZe8q9_QPIPOuN5GECfhs7FXe7C3o7/view?usp=drive_link"
test_data_used:
  - field: "Company A"
    value: "playwright"
  - field: "Company B"
    value: "Dev-Staging"
  - field: "Code"
    value: "CT-PUB-PW"
run_history:
  - run_at: "2026-10-02T10:40:00+07:00"
    status: passed
    via: "manual:OlshopERP"
    note: "PASSED: CT-PUB-PW milik playwright berhasil muncul di datalist Colli Type Dev-Staging saat Show Public Data ON."
origin_jira: ETM-15543
first_execution:
  at: "2026-10-02T10:40:00+07:00"
  via: "manual:OlshopERP"
  jira: "ETM-15543"
last_execution:
  at: "2026-10-02T10:40:00+07:00"
  jira: "ETM-15543"
  status: passed
  via: "manual:OlshopERP"
---

# TC-CT-012: Show Public Data ON di company B — Colli Type public milik A muncul dengan owner A

## Bukti Pengujian (Evidence)
- Data Colli Type CT-PUB-PW berhasil dibuat di company playwright: https://drive.google.com/file/d/1eQiJf2Btw0uwp-Dccy0KOIe1SekzvljV/view?usp=drive_link
- Toggle Show Public Data ON untuk company playwright di Dev-Staging: https://drive.google.com/file/d/1OqOFM0mHHqLmTrXsaYo83gC8N5QO-5XC/view?usp=drive_link
- Datalist Colli Type Dev-Staging (CT-PUB-PW berhasil tampil): https://drive.google.com/file/d/1AVaZe8q9_QPIPOuN5GECfhs7FXe7C3o7/view?usp=drive_link

## Hasil Pengujian
- **Status:** **PASSED 🟢**
- Setelah izin *Show Public Data* untuk company `playwright` diaktifkan (**ON**) pada setting Internal Company `Dev-Staging`, record Colli Type public `CT-PUB-PW` (`is_all_company = 1`) yang dibuat di company `playwright` **berhasil tampil secara otomatis** pada Datalist Colli Type `Dev-Staging`. Mekanisme integrasi *Show Public Data* lintas company berjalan sempurna.
