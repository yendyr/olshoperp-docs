---
doc_type: e2e-test-case
tc_code: TC-APAY-SUM-005
menu: accounting-supplier-payment
menu_name: "Account Payment"
test_type: cross-menu
title: "SUMMARY — Summary & Debit Note terbit dari import AP"
summary: "Summary & Debit Note terbit dari import AP (origin ETM-16643)."
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
  - description: "Import AP: bank 1-10005 1.000.000, PI-6963C9C0 950.000, adjustment DEBIT NOTE 50.000"
  - description: "Lalu Cash 800.000 + DN-6968A669 150.000 sebagai source"
steps:
  - "Import AP via Import History (3 sheet)."
  - "Edit: kurangi Cash, tambah DN source."
  - "Cek Summary dan menu Debit Note (DN terbit + DN sumber)."
expected_result: |
  DN terbit Open & referensi AP; nominal DN menu cocok; Summary Total 0 saat balance.
test_result:
  status: failed
  started_at: "2026-10-21T08:00:00Z"
  finished_at: "2026-10-21T10:40:00Z"
  executed_by: "Bugsy"
  environment: staging
  log_summary: "FAIL 1/2 — DN-5UTDAX60 Open 50.000 ref PY-5UTDAX6T OK; DN-6968A669 prepared 250.000 OK. FAIL: DN terbit ikut dihitung minus → Source=Detail 950k tapi Total −50.000 orange."
  report_url: "https://drive.google.com/drive/folders/1XaoicUVmMHk0DVz80zw5VgHA21JveJTK"
first_execution:
  at: "2026-10-21"
  via: "bugsy"
  jira: "ETM-16684"
last_execution:
  at: "2026-10-21"
  jira: "ETM-16684"
  status: failed
  via: "bugsy"
---

# TC-APAY-SUM-005 — Summary & Debit Note terbit dari import AP

- Jira: [ETM-16684](https://erpintegration.atlassian.net/browse/ETM-16684) · origin [ETM-16643](https://erpintegration.atlassian.net/browse/ETM-16643)
- Hasil 21-10-2026: **FAILED** — FAIL 1/2 — DN-5UTDAX60 Open 50.000 ref PY-5UTDAX6T OK; DN-6968A669 prepared 250.000 OK. FAIL: DN terbit ikut dihitung minus → Source=Detail 950k tapi Total −50.000 orange.
- Catatan data: Import id 70, file QA-AUTO-ETM-16684-import.xlsx.
- Evidence: https://drive.google.com/drive/folders/1XaoicUVmMHk0DVz80zw5VgHA21JveJTK
