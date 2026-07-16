---
doc_type: e2e-test-case
tc_code: TC-MTEX-001
menu: supplychain-mutation-transfer-external
menu_name: "External Transfer"
title: "Create External Transfer header (TFE*)"
summary: "Membuat header transfer external: Origin + Destination; code auto TFE*."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-mutation-transfer-external/requirement.md"
automated: true
automated_spec: "tests/specs/mutation-transfer-external/mutation-transfer-external-create-update.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - supplychain-mutation-transfer-internal
  - supplychain-warehouse-structure
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company: lumicharmsid (153)."
  - "Origin + Destination tersedia (default-values)."
  - "Fiscal period aktif untuk tanggal fallback 09-07-2026."
test_data:
  - field: "Description"
    value: "TFE automation create {stamp}"
steps:
  - "Datalist External Transfer → Create."
  - "Pastikan Origin + Destination; tanggal jika fiscal error."
  - "Description → Save & Next (atau auto-create)."
  - "Verifikasi code TFE* di form + datalist."
expected_result: |
  Header tersimpan dengan code TFE-*; tampil di datalist.
test_result:
  status: pass
  started_at: "2026-07-15T07:21:55Z"
  finished_at: "2026-07-15T07:23:00Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "2/2 PASS mutation-transfer-external-create-update.spec.ts · CREATE TFE* · company lumicharmsid"
  report_url: null
---

# TC-MTEX-001

## Fungsi menu

**External Transfer** — pindah stok antar building dengan fase transit. Prefix **TFE***.

## Catatan automation

- Spec: `@TC-MTEX-001`
- Helper: `tests/helpers/mutation-transfer-external.ts`
- `fetchDefaultValues()` dapat auto-submit create.
