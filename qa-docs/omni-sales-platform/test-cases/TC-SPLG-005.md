---
doc_type: e2e-test-case
tc_code: TC-SPLG-005
menu: omni-sales-platform
menu_name: "Platform Sales Order"
title: "Memastikan Deaktivasi Filter Pill (Toggle OFF) Mengembalikan Seluruh Data Platform Sales Order"
summary: "Verifikasi klik ulang pada pill aktif menghapus param net_sales_below_cogs dan mengembalikan tampilan datalist Sales Platform semula."
status: draft
owner: QA - Yemima
last_updated: 2026-08-20
requirement_ref: "qa-docs/omni-sales-platform/requirement.md"
automated: true
automated_spec: tests/specs/sales-platform/splg-pill-toggle-off-tc3.spec.ts
execution_company:
  id: 112
  code: FAT
related_menus:
  - all-sales-order
preconditions:
  - "Pill Net Sales < COGS sedang dalam kondisi aktif di menu Platform Sales Order"
  - "Company aktif: FAT (id: 112)"
test_data:
  - field: filter_pill
    value: "Net Sales < COGS"
steps:
  - "Buka menu Omnichannel -> Platform Sales Order (/omnichannel/sales-order)"
  - "Aktifkan pill "Net Sales < COGS" hingga tabel terfilter"
  - "Klik kembali tombol pill "Net Sales < COGS" untuk menonaktifkannya"
  - "Periksa request datalist memastikan query param net_sales_below_cogs telah dihapus"
  - "Verifikasi tabel datalist memuat kembali seluruh Sales Platform secara utuh"
expected_result: |
  Filter pill berhasil dinonaktifkan (toggle OFF) dan tabel datalist kembali menampilkan seluruh data Platform Sales Order tanpa filter under-COGS.
test_result:
  status: passed
  started_at: "2026-08-20T20:41:00+07:00"
  finished_at: "2026-08-20T20:44:53+07:00"
  executed_by: playwright@gmail.com
  environment: staging
  log_summary: "Automated Playwright E2E test PASSED: Deaktivasi filter pill (Toggle OFF) menghapus parameter net_sales_below_cogs dan mengembalikan seluruh data Sales Platform di company FAT."
  report_url: null
test_data_used: []
run_history: []
origin_jira: ETM-15447
request_id: recvqWrTHZ1dOV
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
