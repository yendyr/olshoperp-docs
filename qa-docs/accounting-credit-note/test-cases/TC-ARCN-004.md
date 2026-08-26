---
doc_type: e2e-test-case
tc_code: TC-ARCN-004
menu: accounting-credit-note
menu_name: "Credit Note"
title: "APPROVE — ditolak jika amount fund masih 0 (termasuk Free COA)"
summary: "Add Free COA amount 0 OK; Approve CN ditolak All amount must be greater than 0."
status: draft
owner: QA - Yemima
last_updated: 2026-08-13
requirement_ref: "qa-docs/accounting-credit-note/requirement.md §5.2 Amount; §7.5 #6"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus: []
card_ref: "ETM-15442"
preconditions:
  - "CN Draft/Open punya baris fund (Cash/Bank dan/atau Free COA) dengan amount 0."
  - "User punya privilege Approve."
test_data:
  - field: "CN"
    value: "CN-5TU8OCFD (id 3089)"
  - field: "Free COA amount"
    value: "0,00"
  - field: "Cash/Bank amount"
    value: "0,00"
steps:
  - "Pastikan baris Free COA tersimpan dengan amount 0 (seed add)."
  - "Set status Open (jika masih Draft)."
  - "Klik Approve dan konfirmasi di modal."
expected_result: |
  Amount 0 diizinkan saat add Free COA (requirement §5.2).
  Approve ditolak jika amount fund kurang dari sama dengan 0.
  Pesan: All amount must be greater than 0 (requirement §7.5 #6).
test_result:
  status: passed
  started_at: "2026-08-13 14:16"
  finished_at: "2026-08-13 14:18"
  executed_by: "QA - Yemima (Playwright MCP)"
  environment: staging
  log_summary: "Open dengan amount 0 diterima. POST .../credit-note/3089/approve → 422. Toast: The given data was invalid / Fund Amount must be greater than 0. Response: All amount must be greater than 0. CN dikembalikan ke Draft setelah tes."
  report_url: null
test_data_used:
  - field: "CN"
    value: "CN-5TU8OCFD"
  - field: "endpoint"
    value: "POST /api/accounting/credit-note/3089/approve"
run_history:
  - at: "2026-08-13 14:18"
    status: pass
    by: "QA - Yemima (Playwright MCP)"
last_execution:
  at: "2026-08-13"
  jira: null
  status: passed
  via: "legacy:test_result"
---

## Catatan QA

Gate amount 0 ada di **Approve**, bukan di Open. Open dengan amount 0 lolos — sesuai §7.5 (approve), bukan perubahan status Open.
