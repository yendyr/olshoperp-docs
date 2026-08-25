---
doc_type: e2e-test-case
tc_code: TC-ASO-008
menu: all-sales-order
menu_name: "All Sales Order"
title: "Memastikan Kondisi Batas (Boundary: Net Sales == COGS, Net Sales > COGS, dan COGS = 0) Tidak Lolos Filter"
summary: "Verifikasi logika perbandingan strict (<) dan klausa HAVING SUM(cogs) > 0 mengecualikan SO yang impas, untung, atau tanpa master COGS."
status: draft
owner: QA - Yemima
last_updated: 2026-08-20
requirement_ref: "qa-docs/all-sales-order/requirement.md"
automated: true
automated_spec: tests/specs/sales-order/aso-pill-boundary-tc5.spec.ts
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
  - "Identifikasi SO dengan kondisi Net Sales == Total COGS (impas)"
  - "Identifikasi SO dengan kondisi Net Sales > Total COGS (profit/normal)"
  - "Identifikasi SO dengan produk tanpa master COGS (Benchmark COGS = 0)"
  - "Aktifkan tombol pill "Net Sales < COGS""
  - "Verifikasi bahwa tidak ada satupun dari ketiga tipe SO di atas yang muncul pada tabel datalist"
expected_result: |
  Sales Order dengan Net Sales == COGS, Net Sales > COGS, ataupun yang memiliki Total COGS = 0 diexclude secara presisi dari hasil filter Net Sales < COGS.
test_result:
  status: passed
  started_at: "2026-08-20T19:27:00+07:00"
  finished_at: "2026-08-20T19:28:37+07:00"
  executed_by: playwright@gmail.com
  environment: staging
  log_summary: "Automated Playwright E2E test PASSED: Kondisi batas strict inequality (<) dan exclusion terhadap SO impas/profit/zero COGS tervalidasi akurat."
  report_url: null
test_data_used: []
run_history: []
origin_jira: ETM-15446
request_id: recvqWrTHZ1dOV
last_execution:
  at: "2026-08-20 19:28:37"
  jira: ETM-15446
---

# Catatan QA & Referensi
Mengacu pada card **ETM-15446** ([Pill Filter Net Sales < COGS](https://erpintegration.atlassian.net/browse/ETM-15446)):
- Scope: All Sales Order (`/sales-order/all`) & Platform Sales Order (`/omnichannel/sales-order`).
- Integrasi Error Flag `cogs-error` (dollar icon) & auto-approval blockage.
