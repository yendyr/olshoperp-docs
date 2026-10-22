---
doc_type: e2e-test-case
tc_code: TC-APAY-SUM-006
menu: accounting-supplier-payment
menu_name: "Account Payment"
test_type: happy
title: "SUMMARY — Summary AP USD dengan edit Paid Amount live update"
summary: "Summary AP USD dengan edit Paid Amount live update (origin ETM-16643)."
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
  - description: "AP USD rate 16.000, PI USD 1.000, Bank BCA USD 2 1.000"
steps:
  - "Buat AP USD, Use PI full, tambah Bank USD."
  - "Ubah Paid Amount detail ke 1.200, cek Summary."
  - "Kembalikan ke 1.000, cek Summary."
expected_result: |
  Total 200 orange saat Paid 1.200; kembali 0,00 normal saat balance.
test_result:
  status: passed
  started_at: "2026-10-22T01:30:00Z"
  finished_at: "2026-10-22T02:50:00Z"
  executed_by: "Bugsy"
  environment: staging
  log_summary: "PASS 4/4 — PY-5UTLTYPT: Total 200,00 orange lalu 0,00 normal."
  report_url: "https://drive.google.com/drive/folders/1O1LqZheqcSQ84k5Raa79KDETUU8G361L"
first_execution:
  at: "2026-10-22"
  via: "bugsy"
  jira: "ETM-16707"
last_execution:
  at: "2026-10-22"
  jira: "ETM-16707"
  status: passed
  via: "manual:Bugsy"
  notes: "PASS 4/4 — PY-5UTLTYPT: Total 200,00 orange lalu 0,00 normal."
---

# TC-APAY-SUM-006 — Summary AP USD dengan edit Paid Amount live update

- Jira: [ETM-16707](https://erpintegration.atlassian.net/browse/ETM-16707) · origin [ETM-16643](https://erpintegration.atlassian.net/browse/ETM-16643)
- Hasil 22-10-2026: **PASSED** — PASS 4/4 — PY-5UTLTYPT: Total 200,00 orange lalu 0,00 normal.
- Catatan data: PI-6954C3C8 menggantikan PI-6968A3ED (tidak menghapus data test lama).
- Evidence: https://drive.google.com/drive/folders/1O1LqZheqcSQ84k5Raa79KDETUU8G361L
