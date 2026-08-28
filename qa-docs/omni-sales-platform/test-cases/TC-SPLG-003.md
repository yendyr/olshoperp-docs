---
doc_type: e2e-test-case
tc_code: TC-SPLG-003
menu: omni-sales-platform
menu_name: "Platform Sales Order"
test_type: happy
title: "Memastikan Visibility, Counter & Posisi Pill Button Net Sales < COGS di Sales Platform"
summary: "Verifikasi tombol pill Net Sales < COGS muncul di urutan ke-4, berstatus warning (kuning), dan counter menampilkan jumlah SO platform under COGS yang akurat di company FAT."
status: draft
owner: QA - Yemima
last_updated: 2026-08-20
requirement_ref: "qa-docs/omni-sales-platform/requirement.md"
automated: true
automated_spec: tests/specs/sales-platform/splg-pill-net-sales-cogs-tc1.spec.ts
execution_company:
  id: 112
  code: FAT
related_menus:
  - all-sales-order
preconditions:
  - "User login ke staging dengan akun yang memiliki hak akses menu Platform Sales Order"
  - "Company aktif: FAT (id: 112)"
  - "Terdapat data Sales Platform yang tersinkronisasi dari berbagai channel marketplace"
test_data:
  - field: filter_pill
    value: "Net Sales < COGS"
steps:
  - "Buka menu Omnichannel -> Platform Sales Order (/omnichannel/sales-order)"
  - "Periksa jajaran PillButtons di atas tabel datalist"
  - "Verifikasi tombol pill berlabel "Net Sales < COGS" berada di urutan ke-4"
  - "Verifikasi warna tombol bertipe warning (kuning/oranye)"
  - "Periksa badge counter pada pill dan bandingkan dengan respon API /omnichannel/sales-order/pill-count?type=platform"
expected_result: |
  Tombol pill "Net Sales < COGS" tampil dengan posisi yang tepat (ke-4), warna warning, dan counter angka yang akurat mencerminkan total SO platform under-COGS di company FAT.
test_result:
  status: passed
  started_at: "2026-08-20T20:20:00+07:00"
  finished_at: "2026-08-20T20:33:19+07:00"
  executed_by: playwright@gmail.com
  environment: staging
  log_summary: "Automated Playwright E2E test PASSED: Tombol pill Net Sales < COGS tampil di posisi ke-4 dengan counter badge 4.125 transaksi di company FAT."
  report_url: null
test_data_used: []
run_history: []
origin_jira: ETM-15447
request_id: recvqWrTHZ1dOV
first_execution:
  at: "2026-08-20 20:33:19"
  via: "legacy:test_result"
  jira: "ETM-15447"
last_execution:
  at: "2026-08-20 20:33:19"
  jira: "ETM-15447"
  status: passed
  via: "legacy:test_result"
---

# Catatan QA & Referensi
Mengacu pada card **ETM-15447** ([Pill Filter Net Sales < COGS pada Platform Sales Order](https://erpintegration.atlassian.net/browse/ETM-15447)):
- Scope: Platform Sales Order (`/omnichannel/sales-order`).
- Target Testing Company: **FAT** (ID: 112).
- Request ID: `recvqWrTHZ1dOV`.
