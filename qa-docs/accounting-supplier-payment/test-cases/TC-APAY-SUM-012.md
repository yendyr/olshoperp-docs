---
doc_type: e2e-test-case
tc_code: TC-APAY-SUM-012
menu: accounting-supplier-payment
menu_name: "Account Payment"
test_type: regression
title: "SUMMARY — Summary pada create, AP approved lama, read-only"
summary: "Summary pada create, AP approved lama, read-only (origin ETM-16643)."
status: approved
owner: QA - Bugsy
last_updated: 2026-10-22
requirement_ref: "https://erpintegration.atlassian.net/browse/ETM-16643"
automated: false
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - accounting-supplier-invoice
  - accounting-debit-note
preconditions:
  - "Fix ETM-16643 (BE 6948cbd, FE 0283904) sudah di Staging (FE build 2026-10-22 09:05, API 09:07)."
test_data:
  - description: "AP baru PY-5UTM3THT; AP approved PY-5TVBFUBZ, PY-695CD958, PY-695DBA18"
steps:
  - "Buka create, cek Summary."
  - "Buka AP approved lama, cocokkan."
  - "Cek urutan sidenav & read-only, reload."
expected_result: |
  Summary muncul setelah auto-save; AP lama cocok; read-only & stabil.
test_result:
  status: passed
  started_at: "2026-10-22T01:30:00Z"
  finished_at: "2026-10-22T02:50:00Z"
  executed_by: "Bugsy"
  environment: staging
  log_summary: "PASS 3/3 — auto-save ~2s, Summary 0,00; 3 AP approved cocok; sidenav & read-only OK."
  report_url: "https://drive.google.com/drive/folders/1FDowGuA1OiazlWSV8e9jIIGVhNPdJeTy"
first_execution:
  at: "2026-10-22"
  via: "bugsy"
  jira: "ETM-16713"
last_execution:
  at: "2026-10-22"
  jira: "ETM-16713"
  status: passed
  via: "manual:Bugsy"
  notes: "PASS 3/3 — auto-save ~2s, Summary 0,00; 3 AP approved cocok; sidenav & read-only OK."
---

# TC-APAY-SUM-012 — Summary pada create, AP approved lama, read-only

- Jira: [ETM-16713](https://erpintegration.atlassian.net/browse/ETM-16713) · origin [ETM-16643](https://erpintegration.atlassian.net/browse/ETM-16643)
- Hasil 22-10-2026: **PASSED** — PASS 3/3 — auto-save ~2s, Summary 0,00; 3 AP approved cocok; sidenav & read-only OK.
- Catatan data: -
- Evidence: https://drive.google.com/drive/folders/1FDowGuA1OiazlWSV8e9jIIGVhNPdJeTy
