---
doc_type: e2e-test-case
tc_code: TC-VAR-006
menu: supplychain-variant
menu_name: "Master Variant"
title: "Create/Edit Default Variant ON + opsi > 1 — save ditolak"
summary: "Default ON tidak tersimpan jika Option Name lebih dari satu; notifikasi jelas."
status: draft
owner: QA - Yemima
last_updated: 2026-08-14
requirement_ref: "qa-docs/supplychain-variant/requirement.md"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus: []
preconditions:
  - "User login staging, company FAT (112)."
  - "Ada Variant Group 1 opsi Default ON (edit 2964) dan Variant Group opsi random+Red Default OFF (edit 2965)."
test_data:
  - field: "Edit 1 opsi + tambah Extra"
    value: "https://staging.olshoperp.com/supplychain/variant/edit/2964"
  - field: "Edit random+Red toggle Default ON"
    value: "https://staging.olshoperp.com/supplychain/variant/edit/2965"
steps:
  - "Edit 2964 (Default ON, opsi Standard): tambah opsi Extra → klik **Save All**."
  - "Edit 2965 (opsi random + Red): nyalakan **Default Variant**."
  - "Create: Default ON + opsi Red dan Blue → **Save & Next**."
expected_result: |
  Save ditolak dengan notifikasi jelas; Default tidak tersimpan ON jika option count > 1 (requirement §6.2 V-01 / V-06). Berlaku create dan edit.
test_result:
  status: passed
  started_at: "2026-08-14 06:15"
  finished_at: "2026-08-14 06:23"
  executed_by: "QA - Yemima (Playwright MCP)"
  environment: staging
  log_summary: |
    Toast seragam: Default variant can only have maximum 1 option.
    Edit 2964 Save All dengan Standard+Extra → reject, tetap di edit.
    Edit 2965 toggle Default ON (random+Red) → toast + toggle revert ke OFF.
    Create Default ON + Red/Blue → toast, tetap di /create.
  report_url: null
test_data_used:
  - field: "URL edit 2964"
    value: "https://staging.olshoperp.com/supplychain/variant/edit/2964"
  - field: "URL edit 2965"
    value: "https://staging.olshoperp.com/supplychain/variant/edit/2965"
  - field: "Toast"
    value: "Default variant can only have maximum 1 option."
run_history:
  - at: "2026-08-14 06:23"
    status: pass
    note: "ETM-15511 — reject Default ON when options > 1"
origin_jira: ETM-15511
last_execution:
  at: "2026-08-14 06:23"
  jira: "ETM-15511"
  status: passed
  via: "legacy:test_result"
---

# TC-VAR-006

## Catatan QA

Requirement §6.4 menyebut auto-clear Default + notify jika opsi tumbuh. Actual: **reject save** (tidak diam-diam OFF) — sesuai AC card "save ditolak/notif jelas".
