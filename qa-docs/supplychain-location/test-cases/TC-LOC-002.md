---
doc_type: e2e-test-case
tc_code: TC-LOC-002
menu: supplychain-location
menu_name: "Location"
title: "Update Processing Location (Code + Name)"
summary: "Mengubah Code dan Name dari dokumen hasil create; verifikasi datalist mengikuti code baru."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-location/requirement.md"
automated: true
automated_spec: "tests/specs/location/location-create-update.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "Dokumen dari TC-LOC-001 (serial)."
test_data:
  - field: "Code (updated)"
    value: "LOU{stamp}"
  - field: "Name (updated)"
    value: "West Side {stamp}"
steps:
  - "Edit Location hasil create."
  - "Ubah Code + Name (+ Description)."
  - "Save All."
  - "Verifikasi code baru di form dan datalist; code lama tidak tersisa."
expected_result: |
  Update sukses; datalist menampilkan code/name baru.
test_result:
  status: pass
  started_at: "2026-07-15T03:06:18Z"
  finished_at: "2026-07-15T03:09:12Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "2/2 PASS location-create-update.spec.ts (~2.4m) · UPDATE ~1.3m · company lumicharmsid"
  report_url: null
---


# TC-LOC-002

## Catatan automation

- Spec: `@TC-LOC-002`
- Code unique per company — stamp unik di automation.
