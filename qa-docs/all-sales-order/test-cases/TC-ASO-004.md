---
doc_type: e2e-test-case
tc_code: TC-ASO-004
menu: all-sales-order
menu_name: "All Sales Order"
title: "Memastikan Visibility, Counter & Posisi Pill Button Net Sales < COGS"
summary: "Verifikasi tombol pill Net Sales < COGS muncul di urutan ke-4, berstatus warning (kuning), dan counter menampilkan jumlah SO under COGS yang akurat."
status: draft
owner: QA - Yemima
last_updated: 2026-08-20
requirement_ref: "qa-docs/all-sales-order/requirement.md"
automated: true
automated_spec: tests/specs/sales-order/aso-pill-net-sales-cogs-tc1.spec.ts
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
  - "Periksa jajaran PillButtons di atas tabel datalist"
  - "Verifikasi tombol pill berlabel "Net Sales < COGS" berada di urutan ke-4 (setelah Ready to Process dan sebelum Order Synchronize Status)"
  - "Verifikasi warna tombol bertipe warning (kuning/oranye)"
  - "Periksa badge counter pada pill dan bandingkan dengan respon API /omnichannel/sales-order/pill-count?type=all"
expected_result: |
  Tombol pill "Net Sales < COGS" tampil dengan posisi yang tepat (ke-4), warna warning, dan counter angka yang akurat mencerminkan total SO under-COGS.
test_result:
  status: passed
  started_at: "2026-08-20T17:09:00+07:00"
  finished_at: "2026-08-20T17:10:27+07:00"
  executed_by: playwright@gmail.com
  environment: staging
  log_summary: |
    Automated Playwright E2E test PASSED di menu All Sales Order (/businessdevelopment/all-sales-order) Staging (Company: lumicharmsid):
    1. Visibility & Posisi: PASSED - Tombol pill Net Sales < COGS tampil jelas di posisi ke-4 di baris PillButtons.
    2. Tipe & Warna: PASSED - Tombol pill memiliki styling warning (kuning/oranye).
    3. Counter Badge: PASSED - Badge counter berhasil me-render jumlah transaksi (458 records pada company lumicharmsid) sesuai data API /omnichannel/sales-order/pill-count.
  report_url: null
test_data_used: []
run_history: []
origin_jira: ETM-15446
request_id: recvqWrTHZ1dOV
last_execution:
  at: "2026-08-20 17:10:27"
  jira: "ETM-15446"
  status: passed
  via: "legacy:test_result"
---

# Catatan QA & Referensi
Mengacu pada card **ETM-15446** ([Pill Filter Net Sales < COGS](https://erpintegration.atlassian.net/browse/ETM-15446)):
- Scope: All Sales Order (`/sales-order/all`) & Platform Sales Order (`/omnichannel/sales-order`).
- Integrasi Error Flag `cogs-error` (dollar icon) & auto-approval blockage.
