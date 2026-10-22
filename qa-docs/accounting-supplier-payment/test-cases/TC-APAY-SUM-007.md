---
doc_type: e2e-test-case
tc_code: TC-APAY-SUM-007
menu: accounting-supplier-payment
menu_name: "Account Payment"
test_type: edge
title: "SUMMARY — Pembulatan Summary 0,01 & rate desimal"
summary: "Pembulatan Summary 0,01 & rate desimal (origin ETM-16643)."
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
  - description: "A: AP USD rate 15.900 bayar PI IDR 100.000 (6,29 USD)"
  - description: "B: rate desimal 16.234,5"
steps:
  - "Cash 6,29 / 6,28 / 6,30, cek Total & warna."
  - "Set rate 16.234,5, Save, reload."
expected_result: |
  Tidak ada -0,00; selisih 0,01 orange; rate desimal tersimpan.
test_result:
  status: failed
  started_at: "2026-10-22T01:30:00Z"
  finished_at: "2026-10-22T02:50:00Z"
  executed_by: "Bugsy"
  environment: staging
  log_summary: "Part A PASS 4/4 (PY-5UTLWI77: 0,00 normal, 0,01 & -0,01 orange). Part B BLOCKED: rate 16.234,5 tersimpan 162.345 (PY-5UTLX9LP), sama dengan ETM-16702 (Jira Test Result Failed, link QA Test Case ke ETM-16702)."
  report_url: "https://drive.google.com/drive/folders/1-Jtslup9MIpB3lixXB9DvjodiZSsL_-Z"
first_execution:
  at: "2026-10-22"
  via: "bugsy"
  jira: "ETM-16708"
last_execution:
  at: "2026-10-22"
  jira: "ETM-16708"
  status: failed
  via: "manual:Bugsy"
  notes: "Part A PASS 4/4 (PY-5UTLWI77: 0,00 normal, 0,01 & -0,01 orange). Part B BLOCKED: rate 16.234,5 tersimpan 162.345 (PY-5UTLX9LP), sama dengan ETM-16702 (Jira Test Result Failed, link QA Test Case ke ETM-16702)."
---

# TC-APAY-SUM-007 — Pembulatan Summary 0,01 & rate desimal

- Jira: [ETM-16708](https://erpintegration.atlassian.net/browse/ETM-16708) · origin [ETM-16643](https://erpintegration.atlassian.net/browse/ETM-16643)
- Hasil 22-10-2026: **FAILED** — Part A PASS 4/4 (PY-5UTLWI77: 0,00 normal, 0,01 & -0,01 orange). Part B BLOCKED: rate 16.234,5 tersimpan 162.345 (PY-5UTLX9LP), sama dengan ETM-16702 (Jira Test Result Failed, link QA Test Case ke ETM-16702).
- Catatan data: Pakai PI-6A72AB79 (SUPP008) karena PI-6968A510 masih dipakai PY-5UTD6K2D.
- Evidence: https://drive.google.com/drive/folders/1-Jtslup9MIpB3lixXB9DvjodiZSsL_-Z
