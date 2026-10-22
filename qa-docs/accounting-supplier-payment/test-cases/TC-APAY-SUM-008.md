---
doc_type: e2e-test-case
tc_code: TC-APAY-SUM-008
menu: accounting-supplier-payment
menu_name: "Account Payment"
test_type: edge
title: "SUMMARY — Lock header saat ada detail & format Utang desimal"
summary: "Lock header saat ada detail & format Utang desimal (origin ETM-16643)."
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
  - description: "AP USD rate 16.500 (SUPP008), PI-6A72A313 IDR 100.000"
steps:
  - "Coba ubah rate saat detail ada."
  - "Hapus detail, ubah rate 16.500, Use PI lagi."
  - "Cek Utang & Total; tambah Cash 6,06."
expected_result: |
  Error lock header; rate tersimpan setelah detail kosong; Utang 6,06; Total 0,00 normal setelah balance.
test_result:
  status: failed
  started_at: "2026-10-22T01:30:00Z"
  finished_at: "2026-10-22T02:50:00Z"
  executed_by: "Bugsy"
  environment: staging
  log_summary: "FAIL 3/4 — PY-5UTLXUVR: lock 'Cannot edit Header when detail data exists...' OK; rate 16.500 OK; Total OK. FAIL: Summary Utang tampil '6,6' (API 6.0606, preview Use juga '6,6'). Root cause baru (format desimal FE), bukan 16702–16704."
  report_url: "https://drive.google.com/drive/folders/1UafRRD1Io4eYtKz5vtcsgaO3E-R9dYfL"
first_execution:
  at: "2026-10-22"
  via: "bugsy"
  jira: "ETM-16709"
last_execution:
  at: "2026-10-22"
  jira: "ETM-16709"
  status: failed
  via: "manual:Bugsy"
  notes: "FAIL 3/4 — PY-5UTLXUVR: lock 'Cannot edit Header when detail data exists...' OK; rate 16.500 OK; Total OK. FAIL: Summary Utang tampil '6,6' (API 6.0606, preview Use juga '6,6'). Root cause baru (format desimal FE), bukan 16702–16704."
---

# TC-APAY-SUM-008 — Lock header saat ada detail & format Utang desimal

- Jira: [ETM-16709](https://erpintegration.atlassian.net/browse/ETM-16709) · origin [ETM-16643](https://erpintegration.atlassian.net/browse/ETM-16643)
- Hasil 22-10-2026: **FAILED** — FAIL 3/4 — PY-5UTLXUVR: lock 'Cannot edit Header when detail data exists...' OK; rate 16.500 OK; Total OK. FAIL: Summary Utang tampil '6,6' (API 6.0606, preview Use juga '6,6'). Root cause baru (format desimal FE), bukan 16702–16704.
- Catatan data: Pakai PI-6A72A313 (alternatif, tanpa hapus data).
- Evidence: https://drive.google.com/drive/folders/1UafRRD1Io4eYtKz5vtcsgaO3E-R9dYfL
