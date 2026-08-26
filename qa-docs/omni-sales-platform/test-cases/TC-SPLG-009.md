---
doc_type: e2e-test-case
tc_code: TC-SPLG-009
menu: omni-sales-platform
menu_name: "Platform Sales Order"
title: "Memastikan Tampilan Icon Under Benchmark COGS (cogs-error) pada Kolom Error Flag & Baris Detail Order di Sales Platform"
summary: "Verifikasi Sales Order platform dengan item under-COGS menampilkan icon dollar (cogs-error) di kolom Error Flag (Failed Process) dan muncul di spesifik baris SKU pada halaman Detail Order."
status: draft
owner: QA - Yemima
last_updated: 2026-08-20
requirement_ref: "qa-docs/omni-sales-platform/requirement.md"
automated: true
automated_spec: tests/specs/sales-platform/splg-cogs-error-flag-tc7.spec.ts
execution_company:
  id: 112
  code: FAT
related_menus:
  - all-sales-order
preconditions:
  - "Terdapat dokumen Sales Order platform di company FAT yang memiliki item under benchmark COGS"
  - "Company aktif: FAT (id: 112)"
test_data:
  - field: filter_pill
    value: "Net Sales < COGS"
steps:
  - "Buka menu Omnichannel -> Platform Sales Order (/omnichannel/sales-order)"
  - "Aktifkan pill "Failed Process" untuk memunculkan kolom "Error Flag""
  - "Cari dokumen Sales Order yang memiliki item under benchmark COGS"
  - "Verifikasi bahwa pada kolom Error Flag di header order muncul icon dollar (cogs-error) dengan tooltip "Below Benchmark COGS. Manual approval required.""
  - "Klik baris Sales Order tersebut untuk membuka halaman Detail Order"
  - "Verifikasi bahwa icon dollar / warning error flag muncul secara spesifik pada baris SKU yang under-COGS"
expected_result: |
  Icon dollar (cogs-error) tampil akurat di kolom Error Flag datalist saat pill Failed Process aktif, serta muncul secara spesifik pada baris SKU yang under benchmark COGS di halaman Detail Order.
test_result:
  status: passed
  started_at: "2026-08-20T20:53:00+07:00"
  finished_at: "2026-08-20T20:55:56+07:00"
  executed_by: playwright@gmail.com
  environment: staging
  log_summary: "Automated Playwright E2E test PASSED: Kolom Error Flag ter-render pada list Failed Process dan menampilkan icon dollar (cogs-error) pada transaksi under benchmark COGS di company FAT."
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
