---
doc_type: e2e-test-case
tc_code: TC-APAY-SUM-013
menu: accounting-supplier-payment
menu_name: "Account Payment"
test_type: regression
title: "SUMMARY — Summary live update 10 aksi tambah/edit/hapus"
summary: "Summary live update 10 aksi tambah/edit/hapus (origin ETM-16643)."
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
  - description: "AP IDR, PT. Supplier IDR & Foreign, PI-6954C3EA 1.000.000, Bank BCA Lumi Charms, Petty Cash"
steps:
  - "Paid 1.200.000; Adj D 50.000; edit 70.000; hapus adj."
  - "Tambah Petty Cash 200.000; hapus; hapus detail PI; hapus Bank."
  - "Reload."
expected_result: |
  Summary & warna update tiap aksi tanpa reload; akhir 0,00 stabil.
test_result:
  status: passed
  started_at: "2026-10-22T01:30:00Z"
  finished_at: "2026-10-22T02:50:00Z"
  executed_by: "Bugsy"
  environment: staging
  log_summary: "PASS 10/10 — PY-5UTM4RA4: 200k/250k/270k/200k orange, 0 normal, 200k, -1.000.000 orange, 0 normal; reload stabil. Catatan: rate header IDR default 20.000; Petty Cash pre-fill saldo penuh."
  report_url: "https://drive.google.com/drive/folders/1XIhMLsJITDC-A_ZGIkMFNOi5k6PIQRp2"
first_execution:
  at: "2026-10-22"
  via: "bugsy"
  jira: "ETM-16714"
last_execution:
  at: "2026-10-22"
  jira: "ETM-16714"
  status: passed
  via: "manual:Bugsy"
  notes: "PASS 10/10 — PY-5UTM4RA4: 200k/250k/270k/200k orange, 0 normal, 200k, -1.000.000 orange, 0 normal; reload stabil. Catatan: rate header IDR default 20.000; Petty Cash pre-fill saldo penuh."
---

# TC-APAY-SUM-013 — Summary live update 10 aksi tambah/edit/hapus

- Jira: [ETM-16714](https://erpintegration.atlassian.net/browse/ETM-16714) · origin [ETM-16643](https://erpintegration.atlassian.net/browse/ETM-16643)
- Hasil 22-10-2026: **PASSED** — PASS 10/10 — PY-5UTM4RA4: 200k/250k/270k/200k orange, 0 normal, 200k, -1.000.000 orange, 0 normal; reload stabil. Catatan: rate header IDR default 20.000; Petty Cash pre-fill saldo penuh.
- Catatan data: Hapus baris = langkah TC; dokumen AP tetap disimpan.
- Evidence: https://drive.google.com/drive/folders/1XIhMLsJITDC-A_ZGIkMFNOi5k6PIQRp2
