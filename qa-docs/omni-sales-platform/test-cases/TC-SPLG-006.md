---
doc_type: e2e-test-case
tc_code: TC-SPLG-006
menu: omni-sales-platform
menu_name: "Platform Sales Order"
test_type: edge
title: "Memastikan Interaksi Single-Active Toggle antar Pill Buttons di Sales Platform"
summary: "Verifikasi perpindahan antar-pill (Failed Process, Failed Sync, Ready to Process, Net Sales < COGS) hanya mengaktifkan satu panel filter secara bergantian di Sales Platform."
status: draft
owner: QA - Yemima
last_updated: 2026-08-20
requirement_ref: "qa-docs/omni-sales-platform/requirement.md"
automated: true
automated_spec: tests/specs/sales-platform/splg-pill-toggle-mutual-tc4.spec.ts
execution_company:
  id: 112
  code: FAT
related_menus:
  - all-sales-order
preconditions:
  - "Terdapat variasi data order platform pada berbagai kategori filter di company FAT"
  - "Company aktif: FAT (id: 112)"
test_data:
  - field: filter_pill
    value: "Net Sales < COGS"
steps:
  - "Buka menu Omnichannel -> Platform Sales Order (/omnichannel/sales-order)"
  - "Klik tombol pill "Failed Process" -> amati filter failed_process=true aktif"
  - "Langsung klik tombol pill "Net Sales < COGS" tanpa mematikan pill sebelumnya"
  - "Verifikasi pill "Failed Process" otomatis nonaktif dan "Net Sales < COGS" menjadi aktif"
  - "Klik tombol pill "Ready to Process" -> verifikasi "Net Sales < COGS" otomatis nonaktif"
expected_result: |
  Pill buttons di Platform Sales Order bekerja secara single-active toggle tanpa tumpang tindih parameter filter.
test_result:
  status: passed
  started_at: "2026-08-20T20:41:00+07:00"
  finished_at: "2026-08-20T20:44:53+07:00"
  executed_by: playwright@gmail.com
  environment: staging
  log_summary: "Automated Playwright E2E test PASSED: Single-active toggle antar pill buttons (Failed Process, Net Sales < COGS, Ready to Process) berfungsi eksklusif tanpa tumpang tindih filter."
  report_url: null
test_data_used: []
run_history: []
origin_jira: ETM-15447
request_id: recvqWrTHZ1dOV
first_execution:
  at: "2026-08-20 20:44:53"
  via: "legacy:test_result"
  jira: "ETM-15447"
last_execution:
  at: "2026-08-20 20:44:53"
  jira: "ETM-15447"
  status: passed
  via: "legacy:test_result"
---

# Catatan QA & Referensi
Mengacu pada card **ETM-15447** ([Pill Filter Net Sales < COGS pada Platform Sales Order](https://erpintegration.atlassian.net/browse/ETM-15447)):
- Scope: Platform Sales Order (`/omnichannel/sales-order`).
- Target Testing Company: **FAT** (ID: 112).
- Request ID: `recvqWrTHZ1dOV`.
