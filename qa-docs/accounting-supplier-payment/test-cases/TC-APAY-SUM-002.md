---
doc_type: e2e-test-case
tc_code: TC-APAY-SUM-002
menu: accounting-supplier-payment
menu_name: "Account Payment"
test_type: negative
title: "SUMMARY — Summary AP belum balance menampilkan Total orange"
summary: "Summary AP belum balance menampilkan Total orange (origin ETM-16643)."
status: approved
owner: QA - Bugsy
last_updated: 2026-10-21
requirement_ref: "https://erpintegration.atlassian.net/browse/ETM-16643"
automated: false
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - accounting-supplier-invoice
  - accounting-debit-note
preconditions:
  - "Fix ETM-16643 (BE 6948cbd, FE 0283904) sudah di Staging."
test_data:
  - description: "PI IDR full + Cash/Bank lebih kecil (selisih 200.000)"
steps:
  - "Buat AP dengan source < detail, Save All."
  - "Cek section Summary."
  - "Ubah status Open lalu Approve."
expected_result: |
  Total 200.000,00 bold orange; Save tetap bisa; Approve mengikuti validasi balance lama.
test_result:
  status: passed
  started_at: "2026-10-21T08:00:00Z"
  finished_at: "2026-10-21T10:40:00Z"
  executed_by: "Bugsy"
  environment: staging
  log_summary: "PASS 3/3 — PY-5UTD57NQ: Total 200.000,00 orange (text-warning); Save OK; Approve ditolak 'Total Payment Source must be equal to Total Payment Detail.'"
  report_url: "https://drive.google.com/drive/folders/1pYzSGxB1K8p-LsYAxR9y7RZpqd88zQiQ"
first_execution:
  at: "2026-10-21"
  via: "bugsy"
  jira: "ETM-16681"
last_execution:
  at: "2026-10-21"
  jira: "ETM-16681"
  status: passed
  via: "manual:Bugsy"
  notes: "PASS 3/3 — PY-5UTD57NQ: Total 200.000,00 orange (text-warning); Save OK; Approve ditolak 'Total Payment Source must be equal to Total Payment Detail.'"
---

# TC-APAY-SUM-002 — Summary AP belum balance menampilkan Total orange

- Jira: [ETM-16681](https://erpintegration.atlassian.net/browse/ETM-16681) · origin [ETM-16643](https://erpintegration.atlassian.net/browse/ETM-16643)
- Hasil 21-10-2026: **PASSED** — PASS 3/3 — PY-5UTD57NQ: Total 200.000,00 orange (text-warning); Save OK; Approve ditolak 'Total Payment Source must be equal to Total Payment Detail.'
- Catatan data: PI-6963C9E2 1.650.000 + Cash 1.450.000.
- Evidence: https://drive.google.com/drive/folders/1pYzSGxB1K8p-LsYAxR9y7RZpqd88zQiQ
