---
doc_type: e2e-test-case
tc_code: TC-ARCN-005
menu: accounting-credit-note
menu_name: "Credit Note"
test_type: negative
title: "EDIT header — currency tanpa Cash/Bank aktif ditolak"
summary: "Ganti Transaction Currency ke EUR (tanpa Master Cash/Bank); update header 422 dan currency revert."
status: draft
owner: QA - Yemima
last_updated: 2026-08-13
requirement_ref: "qa-docs/accounting-credit-note/requirement.md §5.2 Header create; §7.3 #3"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - accounting-company-detail-bank
card_ref: "ETM-15442"
preconditions:
  - "CN Draft/Open, currency IDR, company punya Cash/Bank aktif untuk IDR."
  - "Ada currency aktif lain (EUR) yang tidak punya Cash/Bank aktif di company."
  - "Receiving Destination sudah boleh berisi Free COA — tidak melewati gate header."
test_data:
  - field: "CN"
    value: "CN-5TU8OCFD (id 3089)"
  - field: "From currency"
    value: "IDR"
  - field: "To currency"
    value: "EUR (currency_id=3)"
steps:
  - "Buka edit CN (Basic Information)."
  - "Ubah Transaction Currency dari IDR ke EUR."
  - "Biarkan auto-update header (watch currency)."
  - "Cek toast dan nilai currency setelah response."
expected_result: |
  Header update ditolak jika tidak ada Cash/Bank aktif untuk currency CN.
  Pesan mengandung: set up a cash/bank account for this currency (requirement §7.3 #3).
  Free COA di Receiving Destination tidak menggantikan syarat Cash/Bank di header.
  Currency tidak tersimpan (kembali ke nilai semula).
test_result:
  status: passed
  started_at: "2026-08-13 14:56"
  finished_at: "2026-08-13 14:57"
  executed_by: "QA - Yemima (Playwright MCP)"
  environment: staging
  log_summary: "PUT credit-note/3089 currency_id=3 (EUR) → 422. Toast: Cannot update transaction. Please set up a cash/bank account for this currency first. Field Transaction Currency tetap IDR."
  report_url: null
test_data_used:
  - field: "CN"
    value: "CN-5TU8OCFD"
  - field: "currency_id sent"
    value: "3 (EUR)"
run_history:
  - at: "2026-08-13 14:57"
    status: pass
    by: "QA - Yemima (Playwright MCP)"
last_execution:
  at: "2026-08-13"
  jira: null
  status: passed
  via: "legacy:test_result"
---

## Catatan QA

Ini tes **edit header**, bukan create. Pesan create beda wording (`Cannot create transaction...`) — §7.2 #1 belum dijalankan di sesi ini.

Gate ini tetap jalan meski CN sudah punya baris Free COA.
