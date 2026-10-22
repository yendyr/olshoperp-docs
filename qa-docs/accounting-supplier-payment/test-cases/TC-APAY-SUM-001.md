---
doc_type: e2e-test-case
tc_code: TC-APAY-SUM-001
menu: accounting-supplier-payment
menu_name: "Account Payment"
test_type: happy
title: "SUMMARY — Summary AP IDR balance tampil benar dengan Total 0.00"
summary: "Summary AP IDR balance tampil benar dengan Total 0.00 (origin ETM-16643)."
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
  - description: "PI IDR (full amount) + Cash/Bank IDR + Debit Note source; total source = detail"
steps:
  - "Buat AP IDR, tambah detail PI (bulk Use, full amount)."
  - "Tambah Cash/Bank dan Debit Note sebagai payment source, Save All."
  - "Cek section Summary (setelah Adjustment); ubah detail/source/adjustment dan cek Summary ikut berubah tanpa reload."
expected_result: |
  Summary read-only (kotak dashed), currency header; Utang +, Cash/Bank −, Debit Note −; Total 0,00 bold warna normal; live update.
test_result:
  status: passed
  started_at: "2026-10-21T08:00:00Z"
  finished_at: "2026-10-21T10:40:00Z"
  executed_by: "Bugsy"
  environment: staging
  log_summary: "PASS 4/4 — PY-5UTD2MV2: Utang 1.100.000; Cash −1.000.000; DN −100.000; Total 0,00 normal. Adj Debit 10.000 → Total orange, Adj Credit 10.000 → kembali 0."
  report_url: "https://drive.google.com/drive/folders/1DC6oxfeGq0LYuCaCbJaYQQvCvYQ1uiNz"
first_execution:
  at: "2026-10-21"
  via: "bugsy"
  jira: "ETM-16680"
last_execution:
  at: "2026-10-21"
  jira: "ETM-16680"
  status: passed
  via: "manual:Bugsy"
  notes: "PASS 4/4 — PY-5UTD2MV2: Utang 1.100.000; Cash −1.000.000; DN −100.000; Total 0,00 normal. Adj Debit 10.000 → Total orange, Adj Credit 10.000 → kembali 0."
---

# TC-APAY-SUM-001 — Summary AP IDR balance tampil benar dengan Total 0.00

- Jira: [ETM-16680](https://erpintegration.atlassian.net/browse/ETM-16680) · origin [ETM-16643](https://erpintegration.atlassian.net/browse/ETM-16643)
- Hasil 21-10-2026: **PASSED** — PASS 4/4 — PY-5UTD2MV2: Utang 1.100.000; Cash −1.000.000; DN −100.000; Total 0,00 normal. Adj Debit 10.000 → Total orange, Adj Credit 10.000 → kembali 0.
- Catatan data: PI dipakai 1.100.000 (PI-6A151EEF), Cash 1.000.000, DN-6968A669 100.000 — partial amount tidak bisa via bulk Use.
- Evidence: https://drive.google.com/drive/folders/1DC6oxfeGq0LYuCaCbJaYQQvCvYQ1uiNz
