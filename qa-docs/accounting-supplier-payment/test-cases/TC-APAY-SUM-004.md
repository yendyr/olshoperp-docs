---
doc_type: e2e-test-case
tc_code: TC-APAY-SUM-004
menu: accounting-supplier-payment
menu_name: "Account Payment"
test_type: regression
title: "SUMMARY — Konversi full amount PI beda currency (PaymentDetailHelper)"
summary: "Konversi full amount PI beda currency (PaymentDetailHelper) (origin ETM-16643)."
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
  - description: "AP IDR rate header 16.000 bayar PI USD 750 (rate PI 15.500)"
  - description: "AP USD bayar PI IDR"
steps:
  - "Buat AP IDR rate 16.000, Use PI USD 750 full amount."
  - "Cash/Bank sesuai to-be-paid, Approve."
  - "Cek Exchange Gain/Loss & jurnal; ulangi AP USD bayar PI IDR."
expected_result: |
  To-be-paid memakai rate header (12.000.000); exchange gain/loss benar; jurnal balance.
test_result:
  status: failed
  started_at: "2026-10-21T08:00:00Z"
  finished_at: "2026-10-21T10:40:00Z"
  executed_by: "Bugsy"
  environment: staging
  log_summary: "FAIL 1/3 — PY-5UTDC0FK: to-be-paid 11.625.000 (rate PI), Exchange Gain −23,44 IDR (selisih USD); jurnal GL-5UTDD9NV Debit 11.625.023,44 vs Credit 11.625.000,00. AP USD bayar PI IDR → 6,16 USD OK."
  report_url: "https://drive.google.com/drive/folders/1mdXaVWT8kmIh3ZgK0t7m_FEG5dIayxLz"
first_execution:
  at: "2026-10-21"
  via: "bugsy"
  jira: "ETM-16683"
last_execution:
  at: "2026-10-21"
  jira: "ETM-16683"
  status: failed
  via: "manual:Bugsy"
  notes: "FAIL 1/3 — PY-5UTDC0FK: to-be-paid 11.625.000 (rate PI), Exchange Gain −23,44 IDR (selisih USD); jurnal GL-5UTDD9NV Debit 11.625.023,44 vs Credit 11.625.000,00. AP USD bayar PI IDR → 6,16 USD OK."
---

# TC-APAY-SUM-004 — Konversi full amount PI beda currency (PaymentDetailHelper)

- Jira: [ETM-16683](https://erpintegration.atlassian.net/browse/ETM-16683) · origin [ETM-16643](https://erpintegration.atlassian.net/browse/ETM-16643)
- Hasil 21-10-2026: **FAILED** — FAIL 1/3 — PY-5UTDC0FK: to-be-paid 11.625.000 (rate PI), Exchange Gain −23,44 IDR (selisih USD); jurnal GL-5UTDD9NV Debit 11.625.023,44 vs Credit 11.625.000,00. AP USD bayar PI IDR → 6,16 USD OK.
- Catatan data: PI-6968A1D5; dokumen sudah Approved.
- Evidence: https://drive.google.com/drive/folders/1mdXaVWT8kmIh3ZgK0t7m_FEG5dIayxLz
