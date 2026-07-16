---
doc_type: e2e-test-case
tc_code: TC-QCPROC-001
menu: supplychain-qc-procedure
menu_name: "QC Procedure"
title: "Create QC Procedure header"
summary: "Membuat header template QC: Code + Instruction Name; Save → edit."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-qc-procedure/requirement.md"
automated: true
automated_spec: "tests/specs/qc-procedure/qc-procedure-create-update.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - system-product
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company: lumicharmsid (153)."
test_data:
  - field: Code
    value: "QCAT{stamp}"
  - field: Instruction Name
    value: "QC Auto {stamp}"
steps:
  - "Buka /supplychain/qc-procedure → Create."
  - "Isi Code (max 15) + Instruction Name + Description; Active on."
  - "Save → redirect edit."
  - "Verifikasi code di form + datalist."
expected_result: |
  Header tersimpan; URL edit qc-procedure; code unik.
test_result:
  status: pass
  started_at: "2026-07-15T09:10:00Z"
  finished_at: "2026-07-15T09:10:21Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "PASS CREATE QC header QCAT* · Save → edit · company lumicharmsid"
  report_url: null
---

# TC-QCPROC-001

## Fungsi menu

**QC Procedure** — master checklist inspeksi receiving/checking/packing (header + sequenced activities).

## Catatan automation

- Spec: `@TC-QCPROC-001`
- Create: tombol **Save** (bukan Save & Next).
- Code store max **15** chars.
