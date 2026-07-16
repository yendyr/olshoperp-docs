---
doc_type: e2e-test-case
tc_code: TC-TAG-001
menu: supplychain-tagging
menu_name: "Tagging"
title: "Create new Tagging"
summary: "Membuat Tagging baru secara valid untuk mengelompokkan label/tag produk di dalam sistem."
status: draft
owner: QA - Cursor
last_updated: 2026-07-14
requirement_ref: null
automated: true
automated_spec: "tests/specs/tagging/tagging-create-update.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company aktif: Lumi Charms.id (lumicharmsid, id: 153)."
  - "Sudah di halaman datalist Tagging (`/supplychain/tagging`)."
  - "User memiliki akses create Tagging."
test_data:
  - field: "Code"
    value: "TG-AT-{stamp}"
  - field: "Tagging Name"
    value: "Promo Seasonal {stamp}"
  - field: "Active"
    value: "ON"
  - field: "Show for all company"
    value: "ON"
steps:
  - "Klik button Create di halaman datalist Tagging."
  - "Input Code dan Tagging Name secara valid."
  - "Aktifkan toggle Active dan Show for all company."
  - "Klik Save & Next."
  - "Verifikasi Tagging tampil di datalist."
expected_result: |
  Tagging baru berhasil disimpan ke sistem dan tampil di halaman datalist.
test_result:
  status: passed
  started_at: null
  finished_at: null
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: |
    PASS (~23s) — create di lumicharmsid (153).
    Code TG-AT-{stamp} / Name Promo Seasonal {stamp},
    Active + Show for all company ON, Save & Next → datalist OK.
  report_url: null
test_data_used:
  - field: "Code"
    value: "TG-AT-{stamp}"
  - field: "Name"
    value: "Promo Seasonal {stamp}"
  - field: "Company"
    value: "lumicharmsid (153)"
run_history:
  - at: "2026-07-14"
    status: passed
    note: "Playwright @TC-TAG-001 — 2/2 serial PASS (~1.0m)"
---

# TC-TAG-001

## Catatan automation

- Spec: `tests/specs/tagging/tagging-create-update.spec.ts` (tag `@TC-TAG-001`)
- Helper: `tests/helpers/tagging.ts`
- Registry: `tests/pom-registry/tagging.yaml`
- Chain: hasil create dipakai `@TC-TAG-002`.
