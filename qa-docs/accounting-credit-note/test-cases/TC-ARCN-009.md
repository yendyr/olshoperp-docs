---
doc_type: e2e-test-case
tc_code: TC-ARCN-009
menu: accounting-credit-note
menu_name: "Credit Note"
test_type: edge
title: "EDIT — Free COA picker exclude Customer's Deposit COA"
summary: "Select Free COA tidak menampilkan Deposit COA actor (General tagging); Equity Free COA tetap muncul."
status: draft
owner: QA - Yemima
last_updated: 2026-08-13
requirement_ref: "qa-docs/accounting-credit-note/requirement.md §5.2 Free COA picker exclude Deposit COA; §7.3 #8"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - accounting-chart-of-account
  - generalsetting-general-company
card_ref: "ETM-15442"
preconditions:
  - "Company FAT. CN Draft/Open dengan customer General yang punya tagging Customer's Deposit COA."
  - "Deposit COA actor diketahui dari General Company accounting (bukan COA bound Cash/Bank)."
  - "Ada Free COA control (Equity leaf) yang boleh muncul di picker."
test_data:
  - field: "CN"
    value: "CN-5U43L1SR (id 3181)"
  - field: "Customer"
    value: "DS-CORNELSTORE (281_General)"
  - field: "Deposit COA actor"
    value: "2-104 Pendapatan Diterima di Muka (coa_id 4465)"
  - field: "Control Free COA"
    value: "3-102 Tambahan Modal Disetor (coa_id 4469)"
steps:
  - "Switch company ke FAT."
  - "Buka https://staging.olshoperp.com/accounting/credit-note/edit/3181 (CN-5U43L1SR, customer DS-CORNELSTORE)."
  - "Catat Deposit COA dari General Company accounting customer: Customer's Deposit COA → 2-104 Pendapatan Diterima di Muka."
  - "Di Receiving Destination, buka Select Free COA."
  - "Search kode 2-104 dan nama Pendapatan Diterima di Muka."
  - "Control: search 3-102 / modal — pastikan Equity masih muncul."
expected_result: |
  Customer's Deposit COA actor tidak muncul di Free COA picker (requirement §5.2).
  Free COA Equity (bukan Deposit, bukan bound Cash/Bank) tetap muncul — picker tidak rusak.
  Bound Cash/Bank exclude sudah diuji terpisah di TC-ARCN-002.
test_result:
  status: passed
  started_at: "2026-08-13 21:40"
  finished_at: "2026-08-13 21:45"
  executed_by: "QA - Yemima (Playwright MCP)"
  environment: staging
  log_summary: "FAT. CN-5U43L1SR Open, DS-CORNELSTORE. Tagging Customer's Deposit COA = 2-104 / id 4465. GET select2/receiving-coa/3181?q=2-104 → hanya 2-104-01 Platform (#11294), BUKAN 2-104 (#4465). q=Pendapatan Diterima di Muka → sama, tanpa 4465. Control q=3-102 → 3-102 Tambahan Modal Disetor (#4469). UI edit CN menampilkan Select Free COA. FE 16:05 / API 16:03."
  report_url: null
test_data_used:
  - field: "CN"
    value: "https://staging.olshoperp.com/accounting/credit-note/edit/3181"
  - field: "Deposit COA"
    value: "2-104 / 4465 (excluded)"
  - field: "Control"
    value: "3-102 / 4469 (visible)"
  - field: "endpoint"
    value: "GET /api/accounting/chart-of-account/select2/receiving-coa/3181"
run_history:
  - at: "2026-08-13 21:45"
    status: pass
    by: "QA - Yemima (Playwright MCP)"
last_execution:
  at: "2026-08-13"
  jira: null
  status: passed
  via: "legacy:test_result"
---

## Catatan QA

AC ETM-15442: Free COA picker exclude **Customer's Deposit COA** (Company tagging / Store `deposit_coa_id`). Pair dengan TC bound Cash/Bank `TC-ARCN-002`.

**PASS** — actor Deposit `2-104` (#4465) tidak pernah muncul di select2 Free COA untuk CN General ini.

### Observasi (bukan FAIL AC ini)

Search `2-104` / `Pendapatan Diterima di Muka` masih bisa menampilkan **`2-104-01 Pendapatan Diterima di Muka (Platform)`** (#11294). Itu **bukan** Deposit COA actor CN ini (General memakai `2-104` #4465). Sesuai implementasi: exclude hanya `depositCoaId` milik actor CN, bukan semua COA bernama mirip.

Negative API (POST fund `coa_id=4465`) tidak dijalankan di run ini — AC picker sudah terbukti lewat select2 + UI.
