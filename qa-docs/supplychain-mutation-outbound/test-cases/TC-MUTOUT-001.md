---
doc_type: e2e-test-case
tc_code: TC-MUTOUT-001
menu: supplychain-mutation-outbound
menu_name: "Outbound External"
title: "Create Outbound External header (OT*)"
summary: "Membuat header outbound type Other + Building Origin; code auto OT*."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-mutation-outbound/requirement.md"
automated: true
automated_spec: "tests/specs/mutation-outbound/mutation-outbound-create-update.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - supplychain-mutation-inbound
  - supplychain-delivery-order
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company: lumicharmsid (153)."
  - "Building Origin tersedia (default warehouse)."
  - "Fiscal period aktif untuk tanggal fallback 09-07-2026."
test_data:
  - field: "Type"
    value: "Other"
  - field: "Description"
    value: "OT automation create {stamp}"
steps:
  - "Datalist Outbound External → Create."
  - "Pastikan Type Other + Building Origin; tanggal jika fiscal error."
  - "Description → Save & Next (atau auto-create)."
  - "Verifikasi code OT* di form + datalist."
expected_result: |
  Header tersimpan dengan code OT-*; tampil di datalist.
test_result:
  status: pass
  started_at: "2026-07-15T06:35:40Z"
  finished_at: "2026-07-15T06:36:25Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "3/3 PASS mutation-outbound-create-update.spec.ts · CREATE OT* · company lumicharmsid"
  report_url: null
---

# TC-MUTOUT-001

## Fungsi menu

**Outbound External** — pengeluaran stok dari Building Origin (bukan transfer antar gudang).
Type Other = outbound manual; approve mengurangi item stock FIFO. Prefix **OT***.

## Catatan automation

- Spec: `@TC-MUTOUT-001`
- Helper: `tests/helpers/mutation-outbound.ts`
- `fetchDefaultValues()` dapat auto-submit create.
