---
doc_type: e2e-test-case
tc_code: PENDING-JENNI-2026090901
menu: all-sales-order
menu_name: "All Sales Order"
test_type: happy
title: Verifikasi Takedown Pill Button Net Sales < COGS dari UI Datalist All Sales Order
summary: "Memastikan pill button Net Sales < COGS telah secara resmi di-takedown dari barisan filter pill button di halaman Datalist All Sales Order."
status: draft
owner: QA - Jeiniffer
last_updated: 2026-09-09
requirement_ref: "qa-docs/all-sales-order/requirement.md"
automated: false
automated_spec: null
origin_jira: ETM-15821
first_execution:
  at: null
  jira: null
  via: null
last_execution:
  at: null
  jira: null
  status: not_run
  via: null
---

# TC-ASO-JENNI-DRAFT-2026090901: Verifikasi Takedown Pill Button Net Sales < COGS dari UI Datalist All Sales Order

## Objective
Memastikan pill button `Net Sales < COGS` telah secara resmi di-takedown (dihapus/disembunyikan) dari barisan filter pill button di halaman Datalist All Sales Order (`/businessdevelopment/sales-order-general`).

## Preconditions
1. User login ke OlshopERP Staging (`tim_dev@mail.com`).
2. Scope Company: `Dev Staging` / `FAT`.

## Test Steps
1. Buka menu **Business Development / Omnichannel → All Sales Order** (`/businessdevelopment/sales-order-general`).
2. Perhatikan deretan pill button filter status di bagian atas datalist.
3. Cari keberadaan pill button `Net Sales < COGS`.

## Expected Results
1. Pill button **`Net Sales < COGS`** **TIDAK MUNCUL (telah di-takedown)** di seluruh tampilan UI Datalist All Sales Order.
2. Deretan pill button filter hanya menampilkan tab status baku (seperti *All*, *Failed Process*, *Draft*, *Open*, *Approved*, dll.).
