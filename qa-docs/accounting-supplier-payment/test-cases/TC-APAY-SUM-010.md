---
doc_type: e2e-test-case
tc_code: TC-APAY-SUM-010
menu: accounting-supplier-payment
menu_name: "Account Payment"
test_type: edge
title: "SUMMARY — Summary dengan beberapa adjustment debit/credit"
summary: "Summary dengan beberapa adjustment debit/credit (origin ETM-16643)."
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
  - description: "AP USD rate 16.000, PI USD 100, Adj D20 / D5 / C8, Cash 117"
steps:
  - "Tambah 3 adjustment."
  - "Cek Adj Debit/Credit & Total."
  - "Tambah Cash 117."
expected_result: |
  Adj Debit 25, Adj Credit 8; Total 0 saat balance.
test_result:
  status: passed
  started_at: "2026-10-22T01:30:00Z"
  finished_at: "2026-10-22T02:50:00Z"
  executed_by: "Bugsy"
  environment: staging
  log_summary: "PASS 3/3 — PY-5UTM0FYW: Total 0,00. Catatan: footer adjustment memberi label kolom IDR 'USD 528.000,00'."
  report_url: "https://drive.google.com/drive/folders/1OmN_DF483TXP_NEgayCs3k8mtCokJLKD"
first_execution:
  at: "2026-10-22"
  via: "bugsy"
  jira: "ETM-16711"
last_execution:
  at: "2026-10-22"
  jira: "ETM-16711"
  status: passed
  via: "manual:Bugsy"
  notes: "PASS 3/3 — PY-5UTM0FYW: Total 0,00. Catatan: footer adjustment memberi label kolom IDR 'USD 528.000,00'."
---

# TC-APAY-SUM-010 — Summary dengan beberapa adjustment debit/credit

- Jira: [ETM-16711](https://erpintegration.atlassian.net/browse/ETM-16711) · origin [ETM-16643](https://erpintegration.atlassian.net/browse/ETM-16643)
- Hasil 22-10-2026: **PASSED** — PASS 3/3 — PY-5UTM0FYW: Total 0,00. Catatan: footer adjustment memberi label kolom IDR 'USD 528.000,00'.
- Catatan data: COA tidak boleh dobel per AP; debit kedua pakai 6-60103.
- Evidence: https://drive.google.com/drive/folders/1OmN_DF483TXP_NEgayCs3k8mtCokJLKD
