---
doc_type: e2e-test-case
tc_code: TC-CREATE-mutation-transfer-internal
menu: supplychain-mutation-transfer-internal
menu_name: "Transfer Internal"
title: "Create Transfer Internal header (TFI*)"
summary: "Membuat header transfer: Origin + Destination; code auto TFI*."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-mutation-transfer-internal/requirement.md"
automated: true
automated_spec: "tests/specs/mutation-transfer-internal/mutation-transfer-internal-create-update.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - supplychain-warehouse-structure
  - supplychain-manual-picking-list
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company: lumicharmsid (153)."
  - "Origin + Destination tersedia (default-values)."
  - "Fiscal period aktif untuk tanggal fallback 09-07-2026."
test_data:
  - field: "Description"
    value: "TFI automation create {stamp}"
steps:
  - "Datalist Transfer Internal → Create."
  - "Pastikan Origin + Destination; tanggal jika fiscal error."
  - "Description → Save & Next (atau auto-create)."
  - "Verifikasi code TFI* di form + datalist."
expected_result: |
  Header tersimpan dengan code TFI-*; tampil di datalist.
test_result:
  status: pass
  started_at: "2026-07-15T07:12:33Z"
  finished_at: "2026-07-15T07:13:10Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "2/2 PASS mutation-transfer-internal-create-update.spec.ts · CREATE TFI* · company lumicharmsid"
  report_url: null
---

# TC-CREATE-mutation-transfer-internal

## Fungsi menu

**Transfer Internal** — perpindahan stok antar lokasi dalam company. Prefix **TFI***.
API resource `mutation-transfer` (UI path `mutation-transfer-internal`).

## Catatan automation

- Spec: `@TC-CREATE-mutation-transfer-internal`
- Helper: `tests/helpers/mutation-transfer-internal.ts`
- `fetchDefaultValues()` dapat auto-submit create.
