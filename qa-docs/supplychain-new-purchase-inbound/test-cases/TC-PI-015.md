---
doc_type: e2e-test-case
tc_code: TC-PI-015
menu: supplychain-new-purchase-inbound
menu_name: "BETA New Purchase Inbound"
test_type: regression
title: "Regresi Urutan Baris Detail Transaksi SCM (LIFO / Last-In-First-Row) - BETA New Purchase Inbound"
summary: "Memastikan baris detail transaksi SCM yang terakhir ditambahkan muncul di baris paling atas (LIFO) pada BETA New Purchase Inbound."
status: draft
owner: QA - Yemima
last_updated: 2026-08-27
requirement_ref: "qa-docs/supplychain-new-purchase-inbound/requirement.md"
automated: true
automated_spec: "tests/specs/regression/etm-15214/detail-sorting.spec.ts"
execution_company:
  id: 13
  code: DEV-STG
related_menus: []
preconditions:
  - "User login menggunakan credential E2E: playwright@gmail.com / 12345678."
  - "Company aktif: Dev Staging (DEV-STG, id: 13)."
test_data:
  - field: "trx_code"
    value: "IN-6A461222"
steps:
  - "Buka menu BETA New Purchase Inbound, lalu buka detail transaksi target IN-6A461222."
  - "Tambahkan produk secara berturut-turut: sku-testing-041, sku-testing-046, sku-testing-033."
  - "Amati urutan produk pada tabel detail transaksi."
expected_result: |
  Baris yang terakhir ditambahkan harus muncul di baris paling atas (LIFO).
  Urutan baris dari atas ke bawah harus: sku-testing-033 -> sku-testing-046 -> sku-testing-041.
test_result:
  status: passed
  started_at: "2026-08-26T00:00:00+07:00"
  finished_at: "2026-08-26T00:05:00+07:00"
  executed_by: "QA - Yemima"
  environment: "staging"
  log_summary: |
    PASS: Urutan baris detail sesuai kriteria LIFO (last-in-first-row).
  report_url: null
test_data_used:
  - "IN-6A461222 | sku-testing-041, sku-testing-046, sku-testing-033"
run_history:
  - run_at: "2026-08-26T00:00:00+07:00"
    status: passed
    executor: "QA - Yemima"
    notes: "Newest di atas."
first_execution:
  at: "2026-08-26"
  via: "tests/specs/regression/etm-15214/detail-sorting.spec.ts"
  jira: "ETM-15214"
last_execution:
  at: "2026-08-26"
  jira: "ETM-15214"
  status: passed
  via: "tests/specs/regression/etm-15214/detail-sorting.spec.ts"
---

# TC-PI-015

## Catatan QA
- **Latar Belakang:** Pengujian dilakukan untuk memverifikasi regresi urutan detail SCM pasca ETM-15214.
- **Relasi JIRA:** Terkait card regresi `ETM-15214`.
- **Note:** Di database/dokumen backend yang sama (`IN-6A461222`), BETA New Purchase Inbound ini menampilkan urutan yang benar (BETA adalah tampilan yang sudah diperbaiki).
