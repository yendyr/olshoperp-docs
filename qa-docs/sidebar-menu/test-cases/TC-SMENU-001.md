---
doc_type: e2e-test-case
tc_code: TC-SMENU-001
menu: sidebar-menu
menu_name: "Sidebar Menu (Gate)"
title: Switch company ke FAT (Company ID 112)
summary: Login → Switch Company FAT → Proceed → company context id 112
status: review
owner: QA - Yemima
last_updated: "2026-07-02"
requirement_ref: "technical.md §6 TopBar company switch"
automated: true
automated_spec: tests/company-access.spec.ts
execution_company:
  code: FAT
  id: 112
related_menus:
  - menu_slug: sidebar-menu
    menu_name: "Sidebar Menu (Gate)"
    role: primary
    note: TopBar dropdown Switch Company + refresh sidebar
  - menu_slug: gate-user
    menu_name: "User (Gate)"
    role: involved
    note: Company context dari token / Role Assignment user
preconditions:
  - Akun **playwright@gmail.com** aktif dengan akses company **FAT (id 112)**.
  - User dapat login staging dan membuka dropdown profil di topbar.
test_data:
  - field: Company code
    value: FAT
  - field: Company ID
    value: 112
  - field: Label di dropdown Switch Company
    value: FAT
steps:
  - Login staging dengan akun E2E runner.
  - Klik foto profil di **topbar** (`.topbar .rounded-full.image-fit`).
  - Pada bagian **Switch Company**, pilih **FAT**.
  - Pada modal **Are you sure?**, klik **Proceed**.
  - Tunggu redirect ke dashboard (`/`).
expected_result: |
  - `localStorage.company.data.id` = **112**.
  - Dashboard termuat tanpa error; topbar tetap terlihat.
  - Jika company aktif sudah FAT sebelum switch, sistem boleh melewati dialog (early return) — id tetap 112.
test_result:
  status: passed
  started_at: null
  finished_at: null
  executed_by: Playwright local (olshoperp-docs)
  environment: staging
  log_summary: "Playwright chromium headed, slowMo 1500ms — switch FAT passed"
  report_url: null
test_data_used:
  - field: Runner email
    value: playwright@gmail.com
  - field: Company setelah switch
    value: FAT (id 112)
  - field: API change-company
    value: GET /api/change-company/112
run_history:
  - at: "2026-07-02"
    status: passed
    environment: staging
    note: Execute otomatis Playwright repo olshoperp-docs
---

## Catatan QA

- API daftar company: `GET /api/sidebar-menu-company`.
- API switch: `GET /api/change-company/{company_id}` — lihat `sidebar-menu/technical.md` file map TopBar.
