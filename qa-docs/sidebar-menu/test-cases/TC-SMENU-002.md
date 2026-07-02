---
doc_type: e2e-test-case
tc_code: TC-SMENU-002
menu: sidebar-menu
menu_name: "Sidebar Menu (Gate)"
title: Switch company ke lumicharmsid (Company ID 153)
summary: Login → Switch Company Lumi Charms.id → Proceed → company context id 153
status: review
owner: QA - Yemima
last_updated: "2026-07-02"
requirement_ref: "technical.md §6 TopBar company switch"
automated: true
automated_spec: tests/company-access.spec.ts
execution_company:
  code: lumicharmsid
  id: 153
related_menus:
  - menu_slug: sidebar-menu
    menu_name: "Sidebar Menu (Gate)"
    role: primary
    note: TopBar dropdown Switch Company
  - menu_slug: gate-user
    menu_name: "User (Gate)"
    role: involved
    note: Role Assignment company lumicharmsid
preconditions:
  - Akun **playwright@gmail.com** aktif dengan akses company **lumicharmsid (id 153)**.
test_data:
  - field: Company code
    value: lumicharmsid
  - field: Company ID
    value: 153
  - field: Label di dropdown Switch Company
    value: Lumi Charms.id
steps:
  - Login staging dengan akun E2E runner.
  - Buka dropdown profil topbar → **Switch Company**.
  - Pilih **Lumi Charms.id** (bukan teks code `lumicharmsid`).
  - Klik **Proceed** pada konfirmasi **Are you sure?**.
  - Tunggu redirect dashboard.
expected_result: |
  - `localStorage.company.data.id` = **153**.
  - Dashboard termuat; tidak ada toast error change company.
test_result:
  status: passed
  started_at: null
  finished_at: null
  executed_by: Playwright local (olshoperp-docs)
  environment: staging
  log_summary: "Playwright chromium headed, slowMo 1500ms — switch lumicharmsid passed"
  report_url: null
test_data_used:
  - field: Runner email
    value: playwright@gmail.com
  - field: Company setelah switch
    value: lumicharmsid / Lumi Charms.id (id 153)
  - field: API change-company
    value: GET /api/change-company/153
run_history:
  - at: "2026-07-02"
    status: passed
    environment: staging
    note: Execute otomatis Playwright repo olshoperp-docs
---

## Catatan QA

- Di UI dropdown, nama tampil **Lumi Charms.id**; code internal `lumicharmsid`.
