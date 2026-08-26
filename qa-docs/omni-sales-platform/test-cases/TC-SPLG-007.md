---
doc_type: e2e-test-case
tc_code: TC-SPLG-007
menu: omni-sales-platform
menu_name: "Platform Sales Order"
title: "Memastikan Kondisi Batas (Boundary: Net Sales == COGS, Net Sales > COGS, dan COGS = 0) Tidak Lolos Filter di Sales Platform"
summary: "Verifikasi logika perbandingan strict (<) dan klausa HAVING SUM(cogs) > 0 mengecualikan SO platform yang impas, untung, atau tanpa master COGS."
status: draft
owner: QA - Yemima
last_updated: 2026-08-20
requirement_ref: "qa-docs/omni-sales-platform/requirement.md"
automated: true
automated_spec: tests/specs/sales-platform/splg-pill-boundary-tc5.spec.ts
execution_company:
  id: 112
  code: FAT
related_menus:
  - all-sales-order
preconditions:
  - "Terdapat variasi order platform di company FAT dengan kondisi Net Sales == COGS, Net Sales > COGS, dan produk tanpa master COGS"
  - "Company aktif: FAT (id: 112)"
test_data:
  - field: filter_pill
    value: "Net Sales < COGS"
steps:
  - "Buka menu Omnichannel -> Platform Sales Order (/omnichannel/sales-order)"
  - "Identifikasi SO platform dengan kondisi Net Sales == Total COGS (impas)"
  - "Identifikasi SO platform dengan kondisi Net Sales > Total COGS (profit/normal)"
  - "Identifikasi SO platform dengan produk tanpa master COGS (Benchmark COGS = 0)"
  - "Aktifkan tombol pill "Net Sales < COGS""
  - "Verifikasi bahwa ketiga tipe SO di atas tidak muncul pada tabel datalist"
expected_result: |
  Sales Order platform dengan Net Sales == COGS, Net Sales > COGS, ataupun yang memiliki Total COGS = 0 diexclude secara presisi dari hasil filter Net Sales < COGS.
test_result:
  status: passed
  started_at: "2026-08-20T20:53:00+07:00"
  finished_at: "2026-08-20T20:55:56+07:00"
  executed_by: playwright@gmail.com
  environment: staging
  log_summary: "Automated Playwright E2E test PASSED: Kondisi batas strict inequality (<) dan zero COGS exclusion tervalidasi akurat di company FAT."
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
