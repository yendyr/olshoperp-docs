---
doc_type: e2e-test-case
tc_code: TC-ASO-007
menu: all-sales-order
menu_name: "All Sales Order"
test_type: edge
title: "Memastikan Interaksi Single-Active Toggle / Mutual Exclusive dengan Pill Button Lain"
summary: "Verifikasi perpindahan antar-pill (Failed Process, Ready to Process, Net Sales < COGS) hanya mengaktifkan satu panel filter secara bergantian."
status: draft
owner: QA - Yemima
last_updated: 2026-08-20
requirement_ref: "qa-docs/all-sales-order/requirement.md"
automated: true
automated_spec: tests/specs/sales-order/aso-pill-toggle-mutual-tc4.spec.ts
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - omni-sales-platform
preconditions:
  - User login ke staging dengan akun yang memiliki hak akses menu All Sales Order
  - Terdapat data Sales Order dengan variasi kondisi harga jual dan Benchmark COGS
  - Company aktif: lumicharmsid (id: 153)
test_data:
  - field: filter_pill
    value: "Net Sales < COGS"
steps:
  - "Buka menu Omnichannel -> All Sales Order (/sales-order/all)"
  - "Klik tombol pill "Failed Process" -> amati filter failed_process=true aktif"
  - "Langsung klik tombol pill "Net Sales < COGS" tanpa mematikan pill sebelumnya"
  - "Verifikasi pill "Failed Process" otomatis nonaktif dan "Net Sales < COGS" menjadi aktif"
  - "Klik tombol pill "Ready to Process" -> verifikasi "Net Sales < COGS" otomatis nonaktif"
expected_result: |
  Pill buttons bekerja secara single-active toggle di mana hanya ada satu filter pill yang aktif pada satu waktu tanpa tumpang tindih parameter filter.
test_result:
  status: passed
  started_at: "2026-08-20T19:27:00+07:00"
  finished_at: "2026-08-20T19:28:37+07:00"
  executed_by: playwright@gmail.com
  environment: staging
  log_summary: "Automated Playwright E2E test PASSED: Single-active toggle antar pill buttons (Failed Process, Net Sales < COGS, Ready to Process) berfungsi eksklusif tanpa tumpang tindih query parameter."
  report_url: null
test_data_used: []
run_history: []
origin_jira: ETM-15446
request_id: recvqWrTHZ1dOV
first_execution:
  at: "2026-08-20 19:28:37"
  via: "legacy:test_result"
  jira: "ETM-15446"
last_execution:
  at: "2026-08-20 19:28:37"
  jira: "ETM-15446"
  status: passed
  via: "legacy:test_result"
---

# Catatan QA & Referensi
Mengacu pada card **ETM-15446** ([Pill Filter Net Sales < COGS](https://erpintegration.atlassian.net/browse/ETM-15446)):
- Scope: All Sales Order (`/sales-order/all`) & Platform Sales Order (`/omnichannel/sales-order`).
- Integrasi Error Flag `cogs-error` (dollar icon) & auto-approval blockage.
