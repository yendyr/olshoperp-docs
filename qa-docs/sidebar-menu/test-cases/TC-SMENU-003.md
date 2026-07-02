---
doc_type: e2e-test-case
tc_code: TC-SMENU-003
menu: sidebar-menu
menu_name: "Sidebar Menu (Gate)"
title: Switch company ke DEV-STG (Company ID 13)
summary: Login → Switch Company Dev Staging → Proceed → company context id 13 + pause observasi
status: review
owner: QA - Yemima
last_updated: "2026-07-02"
requirement_ref: "technical.md §6 TopBar company switch"
automated: true
automated_spec: tests/company-access.spec.ts
execution_company:
  code: DEV-STG
  id: 13
related_menus:
  - menu_slug: sidebar-menu
    menu_name: "Sidebar Menu (Gate)"
    role: primary
    note: TopBar Switch Company — skenario terakhir dengan delay 5 detik di spec
  - menu_slug: gate-user
    menu_name: "User (Gate)"
    role: involved
    note: Role Assignment company DEV-STG
preconditions:
  - Akun **playwright@gmail.com** aktif dengan akses company **DEV-STG (id 13)**.
test_data:
  - field: Company code
    value: DEV-STG
  - field: Company ID
    value: 13
  - field: Label di dropdown Switch Company
    value: Dev Staging
steps:
  - Login staging dengan akun E2E runner.
  - Buka dropdown profil topbar → **Switch Company**.
  - Pilih **Dev Staging**.
  - Klik **Proceed** pada modal konfirmasi.
  - Tunggu redirect dashboard.
  - (Automasi) Jeda **5 detik** (`waitForTimeout(5000)`) sebelum browser ditutup — untuk observasi manual.
expected_result: |
  - `localStorage.company.data.id` = **13**.
  - Dashboard DEV-STG termuat tanpa error.
  - Setelah jeda 5 detik, sesi test berakhir (browser ditutup oleh Playwright).
test_result:
  status: passed
  started_at: null
  finished_at: null
  executed_by: Playwright local (olshoperp-docs)
  environment: staging
  log_summary: "Playwright chromium headed, slowMo 1500ms — switch DEV-STG passed + delay 5s"
  report_url: null
test_data_used:
  - field: Runner email
    value: playwright@gmail.com
  - field: Company setelah switch
    value: DEV-STG / Dev Staging (id 13)
  - field: Observasi delay
    value: 5000 ms (hanya skenario 4 di spec)
run_history:
  - at: "2026-07-02"
    status: passed
    environment: staging
    note: Execute otomatis Playwright repo olshoperp-docs
---

## Catatan QA

- Label UI **Dev Staging**; code company **DEV-STG**.
