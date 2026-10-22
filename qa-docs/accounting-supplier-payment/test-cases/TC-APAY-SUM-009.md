---
doc_type: e2e-test-case
tc_code: TC-APAY-SUM-009
menu: accounting-supplier-payment
menu_name: "Account Payment"
test_type: edge
title: "SUMMARY — AP IDR bayar PI USD/EUR full amount pakai rate header"
summary: "AP IDR bayar PI USD/EUR full amount pakai rate header (origin ETM-16643)."
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
  - description: "A: AP IDR rate 16.000, PI USD sisa 750"
  - description: "B: AP IDR rate 20.000, PI EUR 4.000"
steps:
  - "Use PI dengan Allocate Full Amount (Clearing)."
  - "Cek to-be-paid, Exchange Gain, Summary."
  - "Tambah Cash sejumlah to-be-paid."
expected_result: |
  To-be-paid pakai rate header; Summary Total 0 saat balance.
test_result:
  status: passed
  started_at: "2026-10-22T01:30:00Z"
  finished_at: "2026-10-22T02:50:00Z"
  executed_by: "Bugsy"
  environment: staging
  log_summary: "PASS 3/3 — PY-5UTM2BSZ: 12.000.000, gain -375.000; PY-5UTM2XAD: 80.000.000, gain -4.000.000; Total 0,00. Konversi ETM-16703 tampak fixed di build ini."
  report_url: "https://drive.google.com/drive/folders/1T9KNb0Ig1kINTHJCu2bu_z7PCIDRD-Cm"
first_execution:
  at: "2026-10-22"
  via: "bugsy"
  jira: "ETM-16710"
last_execution:
  at: "2026-10-22"
  jira: "ETM-16710"
  status: passed
  via: "manual:Bugsy"
  notes: "PASS 3/3 — PY-5UTM2BSZ: 12.000.000, gain -375.000; PY-5UTM2XAD: 80.000.000, gain -4.000.000; Total 0,00. Konversi ETM-16703 tampak fixed di build ini."
---

# TC-APAY-SUM-009 — AP IDR bayar PI USD/EUR full amount pakai rate header

- Jira: [ETM-16710](https://erpintegration.atlassian.net/browse/ETM-16710) · origin [ETM-16643](https://erpintegration.atlassian.net/browse/ETM-16643)
- Hasil 22-10-2026: **PASSED** — PASS 3/3 — PY-5UTM2BSZ: 12.000.000, gain -375.000; PY-5UTM2XAD: 80.000.000, gain -4.000.000; Total 0,00. Konversi ETM-16703 tampak fixed di build ini.
- Catatan data: A pakai sisa 750 USD PI-6968A3ED; B PI-6968A20D.
- Evidence: https://drive.google.com/drive/folders/1T9KNb0Ig1kINTHJCu2bu_z7PCIDRD-Cm
