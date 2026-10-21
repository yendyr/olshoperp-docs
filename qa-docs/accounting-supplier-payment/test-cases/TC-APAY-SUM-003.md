---
doc_type: e2e-test-case
tc_code: TC-APAY-SUM-003
menu: accounting-supplier-payment
menu_name: "Account Payment"
test_type: edge
title: "SUMMARY — Summary AP multi-currency & pembulatan"
summary: "Summary AP multi-currency & pembulatan (origin ETM-16643)."
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
  - description: "AP USD rate 16.234,50 bayar PI IDR 100.000; Cash/Bank USD 6,16"
  - description: "Variasi PI EUR di AP USD"
steps:
  - "Buat AP USD dengan rate desimal, tambah PI IDR."
  - "Tambah Cash/Bank USD 6,16, Save."
  - "Cek Summary (Utang, Total, warna)."
expected_result: |
  Rate desimal tersimpan; Utang 6,16 USD; Total 0,00 tidak orange walau selisih pembulatan.
test_result:
  status: failed
  started_at: "2026-10-21T08:00:00Z"
  finished_at: "2026-10-21T10:40:00Z"
  executed_by: "Bugsy"
  environment: staging
  log_summary: "FAIL 2/4 (1 skip) — Utang 6,16 & Total 0,00 normal OK (PY-5UTD6K2D, rate 16234). FAIL: rate 16.234,50 tersimpan 162.345 (FE kirim '16234.5'; PY-5UTD8RYM). SKIP: PI EUR tidak muncul di outstanding AP USD."
  report_url: "https://drive.google.com/drive/folders/1BrRteSwgDBgJlqo8xXQokUTlIYfGcRAB"
first_execution:
  at: "2026-10-21"
  via: "bugsy"
  jira: "ETM-16682"
last_execution:
  at: "2026-10-21"
  jira: "ETM-16682"
  status: failed
  via: "bugsy"
---

# TC-APAY-SUM-003 — Summary AP multi-currency & pembulatan

- Jira: [ETM-16682](https://erpintegration.atlassian.net/browse/ETM-16682) · origin [ETM-16643](https://erpintegration.atlassian.net/browse/ETM-16643)
- Hasil 21-10-2026: **FAILED** — FAIL 2/4 (1 skip) — Utang 6,16 & Total 0,00 normal OK (PY-5UTD6K2D, rate 16234). FAIL: rate 16.234,50 tersimpan 162.345 (FE kirim '16234.5'; PY-5UTD8RYM). SKIP: PI EUR tidak muncul di outstanding AP USD.
- Catatan data: Logika Summary diuji dengan rate bulat 16234 karena bug rate desimal.
- Evidence: https://drive.google.com/drive/folders/1BrRteSwgDBgJlqo8xXQokUTlIYfGcRAB
