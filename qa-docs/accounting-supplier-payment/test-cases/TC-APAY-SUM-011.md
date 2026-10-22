---
doc_type: e2e-test-case
tc_code: TC-APAY-SUM-011
menu: accounting-supplier-payment
menu_name: "Account Payment"
test_type: cross-menu
title: "SUMMARY — Debit Note USD sebagai source di Summary"
summary: "Debit Note USD sebagai source di Summary (origin ETM-16643)."
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
  - description: "AP USD rate 16.000 (SUPP019), PI-6968A3ED 1.500, DN-69689DE9 1.000, Bank USD 500"
steps:
  - "Use PI, DN, Bank."
  - "Cek Summary DN & Exchange Gain DN."
expected_result: |
  DN -1.000 tepat; rate DN/gain tampil dan tidak ikut dihitung di Summary.
test_result:
  status: passed
  started_at: "2026-10-22T01:30:00Z"
  finished_at: "2026-10-22T02:50:00Z"
  executed_by: "Bugsy"
  environment: staging
  log_summary: "PASS 3/3 — PY-5UTLZK62: DN -1.000; rate DN 14.700, gain IDR 1.300.000 tidak dihitung; Total 0."
  report_url: "https://drive.google.com/drive/folders/16FbLRjpC8XPAC8WMYsC8OIFrn0l-InFA"
first_execution:
  at: "2026-10-22"
  via: "bugsy"
  jira: "ETM-16712"
last_execution:
  at: "2026-10-22"
  jira: "ETM-16712"
  status: passed
  via: "manual:Bugsy"
  notes: "PASS 3/3 — PY-5UTLZK62: DN -1.000; rate DN 14.700, gain IDR 1.300.000 tidak dihitung; Total 0."
---

# TC-APAY-SUM-011 — Debit Note USD sebagai source di Summary

- Jira: [ETM-16712](https://erpintegration.atlassian.net/browse/ETM-16712) · origin [ETM-16643](https://erpintegration.atlassian.net/browse/ETM-16643)
- Hasil 22-10-2026: **PASSED** — PASS 3/3 — PY-5UTLZK62: DN -1.000; rate DN 14.700, gain IDR 1.300.000 tidak dihitung; Total 0.
- Catatan data: -
- Evidence: https://drive.google.com/drive/folders/16FbLRjpC8XPAC8WMYsC8OIFrn0l-InFA
