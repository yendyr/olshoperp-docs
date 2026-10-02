---
doc_type: e2e-test-case
tc_code: TC-CT-011
menu: supplychain-colli-type
menu_name: "Colli Type"
test_type: permission
title: "Show for all company ON di company A — company B tidak melihat data jika Show Public Data OFF"
summary: "Colli Type public milik A tidak muncul di datalist B selama B tidak allow data dari A di Internal Company Show Public Data."
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
    note: "Section Show Public Data — toggle allow lihat public data company lain"
preconditions:
  - "User login ke staging dan bisa switch company."
  - "Company A = playwright. Company B = Dev-Staging."
  - "Di Internal Company edit company Dev-Staging, section Show Public Data: toggle untuk company playwright = OFF (default 0)."
  - "URL Internal Company B: https://staging.olshoperp.com/generalsetting/internal-company/edit/{id-company-B}"
  - "URL Colli Type: https://staging.olshoperp.com/supplychain/colli-type"
test_data:
  - field: "Company A"
    value: "playwright"
  - field: "Company B"
    value: "Dev-Staging"
  - field: "Code (milik A)"
    value: "CT-PUB-PW"
  - field: "Name"
    value: "Public Box Playwright"
  - field: "Show for all company"
    value: "ON"
  - field: "Show Public Data (Dev-Staging → playwright)"
    value: "OFF"
steps:
  - "1. Login company A (playwright), buat Colli Type: Code 'CT-PUB-PW', Name 'Public Box Playwright', Show for all company = ON, Active = ON, simpan."
  - "2. Switch ke company B (Dev-Staging), pastikan toggle Show Public Data untuk playwright berstatus OFF (kondisi default)."
  - "3. Buka https://staging.olshoperp.com/supplychain/colli-type di Dev-Staging dan cari 'CT-PUB-PW'."
expected_result: |
  Di company A (playwright): Colli Type tersimpan dengan Show for all company = ON.
  Di company B (Dev-Staging): Selama toggle Show Public Data untuk playwright = OFF, record CT-PUB-PW milik playwright TIDAK MUNCUL di datalist Colli Type Dev-Staging.
test_result:
  status: passed
  started_at: "2026-10-02T09:00:00+07:00"
  finished_at: "2026-10-02T09:10:00+07:00"
  executed_by: "OlshopERP (resty)"
  environment: staging
  log_summary: "PASSED: Dengan toggle Show Public Data untuk company playwright berstatus OFF di setting Internal Company Dev-Staging, Colli Type public CT-PUB-PW milik playwright terbukti tidak muncul di datalist Colli Type Dev-Staging."
  report_url: null
test_data_used:
  - field: "Company A"
    value: "playwright"
  - field: "Company B"
    value: "Dev-Staging"
  - field: "Code"
    value: "CT-PUB-PW"
run_history:
  - run_at: "2026-10-02T09:10:00+07:00"
    status: passed
    via: "manual:OlshopERP"
    note: "PASSED: Data public CT-PUB-PW milik playwright tidak muncul saat toggle Show Public Data OFF di Dev-Staging."
origin_jira: ETM-15543
first_execution:
  at: "2026-10-02T09:10:00+07:00"
  via: "manual:OlshopERP"
  jira: "ETM-15543"
last_execution:
  at: "2026-10-02T09:10:00+07:00"
  jira: "ETM-15543"
  status: passed
  via: "manual:OlshopERP"
---

# TC-CT-011: Show for all company ON di company A — company B tidak melihat data jika Show Public Data OFF

## Hasil Pengujian
- **Status:** **PASSED 🟢**
- Data Colli Type public `CT-PUB-PW` yang dibuat di company `playwright` tidak muncul pada datalist Colli Type `Dev-Staging` saat toggle *Show Public Data* untuk `playwright` berada dalam status default (OFF).
