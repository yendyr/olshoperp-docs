---
doc_type: e2e-test-case
tc_code: TC-MUTOUT-004
menu: supplychain-mutation-outbound
menu_name: "Outbound External"
test_type: regression
title: "Regresi Urutan Baris Detail Transaksi SCM (LIFO / Last-In-First-Row) - Outbound External"
summary: "Memastikan baris detail transaksi SCM yang terakhir ditambahkan muncul di baris paling atas (LIFO) pada Outbound External."
status: draft
owner: QA - Yemima
last_updated: 2026-08-27
requirement_ref: "qa-docs/supplychain-mutation-outbound/requirement.md"
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
    value: "OT-6A4E1B87"
steps:
  - "Buka menu Outbound External, lalu buka detail transaksi target OT-6A4E1B87."
  - "Tambahkan produk SO secara berturut-turut: SO-6JJHMV4V, kemudian SO-7F1FYJKV."
  - "Amati urutan produk pada tabel detail transaksi."
expected_result: |
  Baris yang terakhir ditambahkan harus muncul di baris paling atas (LIFO).
  Urutan baris dari atas ke bawah harus: SO-7F1FYJKV -> SO-6JJHMV4V.
test_result:
  status: failed
  started_at: "2026-08-26T00:00:00+07:00"
  finished_at: "2026-08-26T00:05:00+07:00"
  executed_by: "QA - Yemima"
  environment: "staging"
  log_summary: |
    FAIL: Baris terbaru jatuh di bawah (first-in-first-row).
    Urutan aktual: SO-6JJHMV4V -> SO-7F1FYJKV (last added at index 1 / bawah).
  report_url: null
test_data_used:
  - "OT-6A4E1B87 | SO-6JJHMV4V, SO-7F1FYJKV"
run_history:
  - run_at: "2026-08-26T00:00:00+07:00"
    status: failed
    executor: "QA - Yemima"
    notes: "Baris terbaru jatuh di bawah."
first_execution:
  at: "2026-08-26"
  via: "tests/specs/regression/etm-15214/detail-sorting.spec.ts"
  jira: "ETM-15214"
last_execution:
  at: "2026-08-26"
  jira: "ETM-15214"
  status: failed
  via: "tests/specs/regression/etm-15214/detail-sorting.spec.ts"
---

# TC-MUTOUT-004

## Catatan QA
- **Latar Belakang:** Pengujian dilakukan untuk memverifikasi regresi urutan detail SCM pasca ETM-15214.
- **Relasi JIRA:** Terkait card regresi `ETM-15214`.
