---
doc_type: e2e-test-case
tc_code: TC-SPLG-008
menu: omni-sales-platform
menu_name: "Platform Sales Order"
title: "Memastikan Penanganan Empty State saat 0 Data Memenuhi Kriteria Filter di Sales Platform"
summary: "Verifikasi tampilan empty state yang informatif (No data available in table) saat filter aktif pada kriteria tanggal/store dengan 0 data under-COGS di Sales Platform."
status: draft
owner: QA - Yemima
last_updated: 2026-08-20
requirement_ref: "qa-docs/omni-sales-platform/requirement.md"
automated: true
automated_spec: tests/specs/sales-platform/splg-pill-empty-state-tc6.spec.ts
execution_company:
  id: 112
  code: FAT
related_menus:
  - all-sales-order
preconditions:
  - "Pilih parameter filter store/tanggal di company FAT yang tidak memiliki transaksi under-COGS"
  - "Company aktif: FAT (id: 112)"
test_data:
  - field: filter_pill
    value: "Net Sales < COGS"
steps:
  - "Buka menu Omnichannel -> Platform Sales Order (/omnichannel/sales-order)"
  - "Terapkan filter store/tanggal tanpa data under-COGS"
  - "Aktifkan tombol pill "Net Sales < COGS""
  - "Amati respon UI pada tabel datalist"
expected_result: |
  Tabel datalist menampilkan pesan empty state informatif ("No data available in table") dengan bersih tanpa error console ataupun tampilan blank.
test_result:
  status: passed
  started_at: "2026-08-20T20:53:00+07:00"
  finished_at: "2026-08-20T20:55:56+07:00"
  executed_by: playwright@gmail.com
  environment: staging
  log_summary: "Automated Playwright E2E test PASSED: Handling empty state berjalan bersih saat 0 data match tanpa breaking UI ataupun error console di company FAT."
  report_url: null
test_data_used: []
run_history: []
origin_jira: ETM-15447
request_id: recvqWrTHZ1dOV
last_execution:
  at: "2026-08-20 20:55:56"
  jira: "ETM-15447"
  status: passed
  via: "legacy:test_result"
---

# Catatan QA & Referensi
Mengacu pada card **ETM-15447** ([Pill Filter Net Sales < COGS pada Platform Sales Order](https://erpintegration.atlassian.net/browse/ETM-15447)):
- Scope: Platform Sales Order (`/omnichannel/sales-order`).
- Target Testing Company: **FAT** (ID: 112).
- Request ID: `recvqWrTHZ1dOV`.
