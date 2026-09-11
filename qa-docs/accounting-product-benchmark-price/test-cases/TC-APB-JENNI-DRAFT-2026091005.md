---
doc_type: e2e-test-case
tc_code: PENDING-APB-JENNI-2026091005
menu: accounting-product-benchmark-price
menu_name: "Product Benchmark Price"
test_type: happy
title: Verifikasi Penanganan Data Existing via Seeder/Migration Data
summary: "Memastikan verifikasi penanganan data existing via seeder/migration data."
status: draft
owner: QA - Jeiniffer
last_updated: 2026-09-10
requirement_ref: "qa-docs/accounting-product-benchmark-price/requirement.md"
automated: false
automated_spec: null
origin_jira: ETM-15850
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

# TC-APB-JENNI-DRAFT-2026091005: Verifikasi Penanganan Data Existing via Seeder/Migration Data

## Objective
Memastikan data existing di database yang berasal dari versi terdahulu dimigrasikan dengan benar (Manual COGS 0 + Expiry NULL diubah jadi NULL; Manual COGS >0 + Expiry NULL diberi Expiry +30).

## Preconditions
1. Database OlshopERP Staging telah menjalankan migration/seeder perbaikan ETM-15850.

## Test Steps
1. Buka database / halaman Benchmark COGS.
2. Periksa SKU existing yang sebelumnya memiliki record `manual_price = 0` dan `manual_effective_date = NULL`.
3. Periksa SKU existing yang sebelumnya memiliki record `manual_price > 0` dan `manual_effective_date = NULL` (bekas override permanen).

## Expected Results
1. Record existing dengan `manual_price = 0` & Expiry `NULL` terupdate menjadi `manual_price = NULL` (kembali mengikuti rumus sistem).
2. Record existing dengan `manual_price > 0` & Expiry `NULL` terupdate memiliki `manual_effective_date` (default `Today + 30 Hari`), sehingga tidak ada lagi data override permanen tanpa expiry.
