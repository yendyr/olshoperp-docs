---
doc_type: e2e-test-case
tc_code: TC-ASO-006
menu: all-sales-order
menu_name: "All Sales Order"
title: "Memastikan Deaktivasi Filter Pill (Toggle OFF) Mengembalikan Seluruh Data Sales Order"
summary: "Verifikasi klik ulang pada pill aktif menghapus param net_sales_below_cogs dan mengembalikan tampilan datalist semula."
status: draft
owner: QA - Yemima
last_updated: 2026-08-20
requirement_ref: "qa-docs/all-sales-order/requirement.md"
automated: true
automated_spec: tests/specs/sales-order/aso-pill-net-sales-cogs-tc3.spec.ts
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
  - "Aktifkan pill "Net Sales < COGS" hingga tabel terfilter"
  - "Klik kembali tombol pill "Net Sales < COGS" untuk menonaktifkannya"
  - "Periksa request datalist memastikan query param net_sales_below_cogs telah dihapus"
  - "Verifikasi tabel datalist memuat kembali seluruh Sales Order secara komprehensif"
expected_result: |
  Filter pill berhasil dinonaktifkan (toggle OFF) dan tabel datalist kembali menampilkan seluruh data Sales Order tanpa filter under-COGS.
test_result:
  status: passed
  started_at: "2026-08-20T19:24:00+07:00"
  finished_at: "2026-08-20T19:25:28+07:00"
  executed_by: playwright@gmail.com
  environment: staging
  log_summary: |
    Automated Playwright E2E test PASSED di menu All Sales Order (/businessdevelopment/all-sales-order) Staging (Company: lumicharmsid):
    1. Deaktivasi Filter (Toggle OFF): PASSED - Frontend menghapus query param net_sales_below_cogs saat pill diklik ulang.
    2. Data Restoration: PASSED - Datalist kembali memuat seluruh data Sales Order secara utuh.
  report_url: null
test_data_used: []
run_history: []
origin_jira: ETM-15446
request_id: recvqWrTHZ1dOV
last_execution:
  at: "2026-08-20 19:25:28"
  jira: ETM-15446
---

# Catatan QA & Referensi
Mengacu pada card **ETM-15446** ([Pill Filter Net Sales < COGS](https://erpintegration.atlassian.net/browse/ETM-15446)):
- Scope: All Sales Order (`/sales-order/all`) & Platform Sales Order (`/omnichannel/sales-order`).
- Integrasi Error Flag `cogs-error` (dollar icon) & auto-approval blockage.
