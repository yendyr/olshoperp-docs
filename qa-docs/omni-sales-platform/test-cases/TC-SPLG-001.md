---
doc_type: e2e-test-case
tc_code: TC-SPLG-001
menu: omni-sales-platform
menu_name: "Dev - Sales Platform"
test_type: happy
title: "LOG DATA — kolom Total Order (platform ALL count) tampil di Sync Log"
summary: "Slideover Log Data menampilkan kolom count order per job (AC card: Platform Total)."
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
  - "User login staging, company FAT (atau company dengan store marketplace sync)."
  - "Menu Dev - Sales Platform accessible."
  - "Ada data di omni sales order sync logs."
test_data:
  - field: "Menu"
    value: "/omni/sales-order"
  - field: "Company"
    value: "FAT (112)"
steps:
  - "Buka https://staging.olshoperp.com/omni/sales-order"
  - "Klik tombol Log Data."
  - "Cek header kolom di tabel Log Data."
  - "Cek nilai kolom count (Total Order / Platform Total) pada baris sync; bandingkan dengan total_order API bila tersedia."
expected_result: |
  Ada kolom baru bernama **Platform Total** (per wording card ETM-15409).
  Nilai = ALL count jumlah order dalam 1 job sync tsb (field backend total_order).
  Kolom tampil di Log Data Dev - Sales Platform (komponen SyncLog yang sama dipakai All Sales Order).
test_result:
  status: failed
  started_at: "2026-08-13 21:53"
  finished_at: "2026-08-13 22:00"
  executed_by: "QA - Yemima (Playwright MCP)"
  environment: staging
  log_summary: "Log Data terbuka di Dev - Sales Platform (FAT). Header kolom yang ada: store, action, description, date, **total order**, success, failed, Skipped, started, ended, updated by. Label **Platform Total** tidak ditemukan. Field API total_order tampil di kolom Total Order. Sort total_order DESC pada FAT: semua sample page = 0 (belum ada job non-zero di company ini untuk verifikasi nilai ALL count > 0). FE build footer staging: Thu Aug 13 16:05 +0700 · API 2026-08-13 16:03. All Sales Order page blank saat diuji ulang (tidak diverifikasi UI terpisah; komponen SyncLog.vue shared)."
  report_url: null
test_data_used:
  - field: "URL"
    value: "https://staging.olshoperp.com/omni/sales-order"
  - field: "API"
    value: "GET /api/omnichannel/sales-order/sync-logs (recordsTotal 6742 FAT)"
run_history:
  - at: "2026-08-13 22:00"
    status: fail
    by: "QA - Yemima (Playwright MCP)"
last_execution:
  at: "2026-08-13"
  jira: null
  status: failed
  via: "legacy:test_result"
---

## Catatan QA

**AC card:** “nambahi 1 kolom baru namanya 'platform total'”.

**Actual:** FE commit ETM-15409 memakai title **Total Order** (`SyncLog.vue` data `total_order`). Ini fail terhadap wording label card, meski field count job sudah ada.

Verifikasi nilai non-zero (ALL count > 0) **belum** bisa di company FAT pada run ini — semua baris sample `total_order = 0`.
