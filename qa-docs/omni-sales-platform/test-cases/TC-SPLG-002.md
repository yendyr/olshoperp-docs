---
doc_type: e2e-test-case
tc_code: TC-SPLG-002
menu: omni-sales-platform
menu_name: "Dev - Sales Platform"
test_type: happy
title: "LOG DATA — jenis log lookback Job Auto Sync Order (action Sync Order)"
summary: "System lookback sync muncul di Log Data dengan action Sync Order dan description Job Auto Sync Order + rentang tanggal."
status: draft
owner: QA - Yemima
last_updated: 2026-08-13
requirement_ref: "ETM-15409"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - all-sales-order
card_ref: "ETM-15409"
preconditions:
  - "Company punya store auto sync (contoh FAT — Lumielle Crafts)."
  - "Job lookback / sales-order:sync-update sudah pernah jalan di staging (ada log historis)."
test_data:
  - field: "Store"
    value: "Lumielle Crafts"
  - field: "Filter Description"
    value: "Job Auto Sync"
steps:
  - "Buka https://staging.olshoperp.com/omni/sales-order"
  - "Klik Log Data."
  - "Filter kolom Description = Job Auto Sync (atau Job)."
  - "Baca Action + Description penuh (tooltip TruncatedText)."
expected_result: |
  Ada jenis log baru dari system lookback sync.
  Action tetap **Sync Order**.
  Description berisi informasi job auto sync + tanggal window (card: job auto sync {date} {store name lookback sync}).
  Store lookback terlihat (di kolom Store dan/atau di description, sesuai implementasi).
test_result:
  status: passed
  started_at: "2026-08-13 21:55"
  finished_at: "2026-08-13 22:00"
  executed_by: "QA - Yemima (Playwright MCP)"
  environment: staging
  log_summary: "Filter Description Job → recordsFiltered 1276 (total 6742). Contoh log id 1029235–1029237: type Sync Order; description penuh `Job Auto Sync Order from 04-08-2026 00:00:00 to 04-08-2026 23:59:59` (dst per hari); store Lumielle Crafts; Updated By System System; sync_started 06-08-2026 16:30:22. Keyword literal lookback di description = no match (wording pakai Job Auto Sync Order from…to…). Store name ada di kolom Store, bukan di string description (Shopee). Sesuai intent AC lookback job sync log."
  report_url: null
test_data_used:
  - field: "Store"
    value: "Lumielle Crafts"
  - field: "Sample log id"
    value: "1029235"
  - field: "Description"
    value: "Job Auto Sync Order from 04-08-2026 00:00:00 to 04-08-2026 23:59:59"
run_history:
  - at: "2026-08-13 22:00"
    status: pass
    by: "QA - Yemima (Playwright MCP)"
first_execution:
  at: "2026-08-13"
  via: "legacy:test_result"
  jira: null
last_execution:
  at: "2026-08-13"
  jira: null
  status: passed
  via: "legacy:test_result"
---

## Catatan QA

**Card wording:** `job auto sync {date} {store name lookback sync}`

**Actual (Shopee / FAT):** `Job Auto Sync Order from {from} to {to}` + kolom Store terpisah.

Ini **PASS** untuk keberadaan log lookback + action Sync Order. Deviasi copy string dicatat sebagai observasi (bukan blocker fungsional kecuali PM wajib exact wording).
