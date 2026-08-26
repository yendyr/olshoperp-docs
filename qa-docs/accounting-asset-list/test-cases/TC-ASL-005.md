---
doc_type: e2e-test-case
tc_code: TC-ASL-005
menu: accounting-asset-list
menu_name: "Asset List"
title: "EXPORT — buka panel Export"
summary: "Setelah warehouse dipilih, buka UI Export; verifikasi kontrol Export (All/Active Page)."
status: approved
owner: QA - Cursor
last_updated: 2026-07-24
requirement_ref: "qa-docs/accounting-asset-list/knowledge-base.md"
automated: true
automated_spec: "tests/specs/asset-list/asset-list-view.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "Warehouse sudah dipilih (datalist #main-content tampil)."
test_data: []
steps:
  - "Buka panel/slide Export dari toolbar datalist."
  - "Verifikasi kontrol Export (label Export / Export All Data) terlihat."
expected_result: |
  Panel export terbuka; tombol/dropdown Export siap dipakai.
test_result:
  status: passed
  environment: staging
  log_summary: "5/5 PASS · TC-ASL-005 · company lumicharmsid"
last_execution:
  at: null
  jira: null
  status: passed
  via: "legacy:test_result"
---

# TC-ASL-005

## Catatan automation

- Spec: `@TC-ASL-005`
- Tidak wajib menunggu file Excel selesai (async job); cukup UI export terbuka.
