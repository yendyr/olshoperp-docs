---
doc_type: e2e-test-case
tc_code: TC-UPDATE-qc-procedure
menu: supplychain-qc-procedure
menu_name: "QC Procedure"
title: "Update header + add Procedure Detail activity"
summary: "Update Instruction Name + Description; tambah activity Sequence di Procedure Detail (digabung)."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-qc-procedure/requirement.md"
automated: true
automated_spec: "tests/specs/qc-procedure/qc-procedure-create-update.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "Dokumen dari TC-CREATE-qc-procedure."
test_data:
  - field: Instruction Name
    value: "QC Upd {stamp}"
  - field: Sequence
    value: "1"
  - field: Activity
    value: "Vis check {stamp}"
steps:
  - "Buka edit dokumen CREATE."
  - "Ubah Instruction Name + Description → Save All."
  - "Procedure Detail: Sequence + Activity name → tombol add."
  - "Verifikasi activity di detail table."
expected_result: |
  Header ter-update; activity detail tersimpan (sequence unik 1–30).
test_result:
  status: pass
  started_at: "2026-07-15T09:10:21Z"
  finished_at: "2026-07-15T09:10:49Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "PASS UPDATE name + Procedure Detail activity seq=1 · company lumicharmsid · 2/2"
  report_url: null
---

# TC-UPDATE-qc-procedure

## Catatan automation

- Spec: `@TC-UPDATE-qc-procedure`
- Detail API: `POST qc-procedure/{id}/qc-procedure-detail`
- Activity store max **30**; jangan buat TC-DETAIL terpisah.
