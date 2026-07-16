---
doc_type: e2e-test-case
tc_code: TC-BRAND-002
menu: supplychain-master-brand
menu_name: "Master Brand"
title: "Update Name + Description Brand"
summary: "Mengubah name/description brand hasil create; verifikasi datalist mengikuti name baru."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-master-brand/requirement.md"
automated: true
automated_spec: "tests/specs/master-brand/master-brand-create-update.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "Dokumen dari TC-BRAND-001 (serial)."
test_data:
  - field: "Name (updated)"
    value: "BR-UP-{stamp}"
steps:
  - "Edit Brand hasil create."
  - "Ubah Name + Description."
  - "Save All."
  - "Verifikasi name baru di form dan datalist; name lama tidak tersisa."
expected_result: |
  Update sukses; datalist menampilkan name baru.
test_result:
  status: pass
  started_at: "2026-07-15T05:57:00Z"
  finished_at: "2026-07-15T05:58:50Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "2/2 PASS · UPDATE Name+Description OK · company lumicharmsid"
  report_url: null
---

# TC-BRAND-002

## Catatan automation

- Spec: `@TC-BRAND-002`
- Active switch di edit → autosave PUT (watcher).
