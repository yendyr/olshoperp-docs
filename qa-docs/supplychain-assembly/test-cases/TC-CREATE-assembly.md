---
doc_type: e2e-test-case
tc_code: TC-CREATE-assembly
menu: supplychain-assembly
menu_name: "Assembly"
title: "Create Assembly header (Building Origin + Type)"
summary: "Membuat Assembly (Work Order) draft; code auto AS*; field wajib Building Origin, Type, Start Date, Transaction Date."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-assembly/requirement.md"
automated: true
automated_spec: "tests/specs/assembly/assembly-create-update.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - bill-of-material
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company: lumicharmsid (153)."
  - "Fiscal period aktif."
  - "Minimal 1 Building Origin dengan WIP & FG configured."
test_data:
  - field: "Type"
    value: "Assembly (default)"
  - field: "Description"
    value: "AS automation create {stamp}"
  - field: "Code"
    value: "auto AS*"
steps:
  - "Datalist Assembly → Create."
  - "Pastikan Building Origin + Type Assembly; isi Description."
  - "Save & Next (atau biarkan auto-submit AS-IS)."
  - "Catat code AS*; verifikasi datalist."
expected_result: |
  Header draft tersimpan, code AS*, muncul di datalist.
test_result:
  status: passed
  started_at: null
  finished_at: null
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: |
    PASS (~26s) — create AS* di lumicharmsid; Building Origin + Type Assembly OK.
    Catatan: Type harus di-assert/seleksi eksplisit sebelum Save All (AS-IS mudah kosong di edit).
  report_url: null
run_history:
  - at: "2026-07-15"
    status: passed
    note: "Playwright @TC-CREATE-assembly — serial 3/3 PASS (~2.2m)"
---

# TC-CREATE-assembly

## Catatan automation

- Spec: `@TC-CREATE-assembly`
- Helper: `tests/helpers/assembly.ts` · Registry: `tests/pom-registry/assembly.yaml`
- API: `supplychain/work-order` (bukan `/assembly`)
- AS-IS `fetchDefaultValues()` bisa auto-submit.
