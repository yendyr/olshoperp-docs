---
doc_type: e2e-test-case
tc_code: TC-CREATE-adjustment-deduction
menu: supplychain-adjustment-deduction
menu_name: "Stock Deduction"
title: "Create Stock Deduction header (Building Origin)"
summary: "Membuat dokumen Stock Deduction baru dengan Building Origin wajib; code auto-generate (AO*)."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-adjustment-deduction/requirement.md"
automated: true
automated_spec: "tests/specs/adjustment-deduction/adjustment-deduction-create-update.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company aktif: Lumi Charms.id (lumicharmsid, id: 153)."
  - "Fiscal period aktif."
  - "Minimal 1 Building Origin (warehouse) dengan stok."
test_data:
  - field: "Building Origin"
    value: "pilih opsi / autofill default"
  - field: "Description"
    value: "AO automation create {stamp}"
  - field: "Transaction Code"
    value: "auto AO*"
steps:
  - "Datalist Stock Deduction → Create."
  - "Pastikan Building Origin terisi; isi Description."
  - "Save & Next (atau biarkan auto-submit AS-IS)."
  - "Catat code AO*; verifikasi di datalist."
expected_result: |
  Header tersimpan, code AO*, muncul di datalist.
test_result:
  status: passed
  started_at: null
  finished_at: null
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: |
    PASS (~41s) — create header AO* di lumicharmsid; Building Origin + Description OK.
  report_url: null
run_history:
  - at: "2026-07-15"
    status: passed
    note: "Playwright @TC-CREATE-adjustment-deduction — serial 3/3 PASS (~2.3m)"
---

# TC-CREATE-adjustment-deduction

## Catatan automation

- Spec tag: `@TC-CREATE-adjustment-deduction`
- Helper: `tests/helpers/adjustment-deduction.ts`
- Registry: `tests/pom-registry/adjustment-deduction.yaml`
- AS-IS `fetchDefaultValues()` bisa auto-submit.
- Code **tanpa** `#code` — placeholder `Automatically generate by system`.
