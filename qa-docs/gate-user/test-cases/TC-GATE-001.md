---
doc_type: e2e-test-case
tc_code: TC-GATE-001
menu: gate-user
menu_name: "User (Gate)"
title: Login staging berhasil dengan akun E2E runner
summary: Email/password valid → redirect dashboard, token auth & company context terisi
status: review
owner: QA - Yemima
last_updated: "2026-07-02"
requirement_ref: "§6 QA Test Notes (login dengan kredensial)"
automated: true
automated_spec: tests/company-access.spec.ts
execution_company:
  code: FAT
  id: 112
related_menus:
  - menu_slug: gate-user
    menu_name: "User (Gate)"
    role: primary
    note: Identitas login & token Sanctum (POST /api/login)
  - menu_slug: sidebar-menu
    menu_name: "Sidebar Menu (Gate)"
    role: involved
    note: Setelah login, topbar/sidebar harus termuat (regresi sidebar kosong)
preconditions:
  - Akun staging **playwright@gmail.com** aktif dengan password valid.
  - User punya Role Assignment ke minimal satu company dalam allowlist E2E (FAT / lumicharmsid / DEV-STG).
test_data:
  - field: Base URL
    value: https://staging.olshoperp.com/login
  - field: Email runner
    value: playwright@gmail.com
  - field: Password runner
    value: '"12345678" (staging E2E — jangan commit ke production)'
steps:
  - Buka halaman login staging (`/login`).
  - Isi **Email** dan **Password** akun runner.
  - Klik tombol **Login**.
  - Tunggu redirect keluar dari `/login` ke dashboard (`/`).
expected_result: |
  - Heading **Sign In** tidak lagi ditampilkan; halaman dashboard termuat.
  - Elemen **topbar** (`.topbar`) terlihat.
  - `localStorage.auth` berisi `token` dan data `user`.
  - `localStorage.company.data.id` terisi company aktif (> 0) dan termasuk allowlist E2E (112, 153, atau 13).
test_result:
  status: passed
  started_at: null
  finished_at: null
  executed_by: Playwright local (olshoperp-docs)
  environment: staging
  log_summary: "Playwright chromium headed, slowMo 1500ms — skenario login passed"
  report_url: null
test_data_used:
  - field: Runner email
    value: playwright@gmail.com
  - field: Company aktif setelah login (contoh run)
    value: FAT (id 112)
  - field: Spec file
    value: tests/company-access.spec.ts
run_history:
  - at: "2026-07-02"
    status: passed
    environment: staging
    note: Execute otomatis Playwright repo olshoperp-docs
---

## Catatan QA

- Selector UI (staging bundle): `placeholder="Email"`, `placeholder="Password"`, tombol **Login** (`Login-CvdZr7Xo.js`).
- API login: `POST https://api.staging.olshoperp.com/api/login` (FormData email + password).
- TC ini **hanya** skenario login; switch company ada di menu **Sidebar Menu** (`TC-SMENU-00x`).
