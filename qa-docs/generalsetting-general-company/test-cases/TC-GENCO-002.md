---
doc_type: e2e-test-case
tc_code: TC-GENCO-002
menu: generalsetting-general-company
menu_name: 'General Company'
title: 'Create General Company sebagai Customer saja'
summary: 'Buat partner baru dengan role Customer ON, role lain OFF'
status: review
owner: 'QA - Yemima'
last_updated: '2026-06-28'
requirement_ref: '§3 Tab General, §14 create validation'
automated: true
automated_spec: e2e/general-company-create-customer.spec.ts
related_menus:
  - menu_slug: generalsetting-general-company
    menu_name: 'General Company'
    role: primary
    note: 'Form create dan verifikasi datalist/edit setelah simpan'
preconditions:
  - 'User sudah login dengan hak akses General Company (view + create).'
  - 'Code General Company yang dipakai belum terdaftar di staging.'
test_data: {}
steps:
  - 'Buka halaman create General Company (`/generalsetting/general-company/create`).'
  - 'Isi field Code dan Name (wajib).'
  - 'Aktifkan Recognize as Customer; nonaktifkan Supplier, Shipper, dan Manufacturer.'
  - 'Klik Save & Next (konfirmasi incomplete data jika muncul modal).'
  - 'Verifikasi redirect ke halaman edit dan toast sukses create.'
expected_result: |
  - Toast: "The new data has been successfully created."
  - Redirect ke `/generalsetting/general-company/edit/{id}`.
  - Role Customer = Yes; Supplier/Shipper/Manufacturer = No pada data yang dibuat.
test_result:
  status: error
  started_at: '2026-06-26 16:53:52'
  finished_at: '2026-06-28 20:47:35'
  executed_by: system
  environment: staging
  log_summary: 'Run E2E terputus atau stale (status queued/running tanpa job aktif). Silakan Execute lagi.'
  report_url: null
test_data_used: {}
run_history:
  - status: error
    finished_at: '2026-06-28 20:47:35'
    executed_by: system
    environment: staging
    log_summary: 'Run E2E terputus atau stale (status queued/running tanpa job aktif). Silakan Execute lagi.'
  - status: error
    finished_at: '2026-06-26 11:21:39'
    executed_by: system
    environment: staging
    log_summary: 'E2E runner belum dikonfigurasi. Deploy runner VM + set QA_DOCS_E2E_STUB=false (PR-3).'
  - status: error
    finished_at: '2026-06-26 11:21:22'
    executed_by: system
    environment: staging
    log_summary: 'E2E runner belum dikonfigurasi. Deploy runner VM + set QA_DOCS_E2E_STUB=false (PR-3).'
---

## Catatan QA

- Default form create: Customer dan Supplier ON — test ini sengaja mematikan Supplier dan role lain.
- Code dibuat unik otomatis di automated test (`PW-CUST-*`).
