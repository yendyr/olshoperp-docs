---
doc_type: e2e-test-case
tc_code: TC-PMUT-006
menu: supplychain-product-mutation
menu_name: "Product Mutation History"
test_type: negative
title: "Pencegahan eksekusi ganda (single-flight) saat manual calculation sedang berjalan"
summary: "Verifikasi proteksi backend/frontend: sistem menolak kalkulasi ganda dengan pesan 'Another ending balance calculation is running' saat proses kalkulasi sedang aktif."
status: draft
owner: QA - Yemima
last_updated: 2026-09-24
requirement_ref: "qa-docs/supplychain-product-mutation/requirement.md"
card_ref: "ETM-15984"
automated: false
automated_spec: null
execution_company:
  id: null
  code: null
related_menus:
  - supplychain-product-ending-stock
preconditions:
  - "User memiliki hak akses menu Supply Chain -> Report -> Product Mutation History."
  - "Sebuah proses manual calculation of ending balance sedang aktif berjalan (belum 100% selesai)."
test_data: []
steps:
  - "Buka menu Supply Chain -> Report -> Product Mutation History di Tab Browser 1."
  - "Klik tombol 'manual calculation of ending balance' untuk memulai kalkulasi."
  - "Segera buka tab browser kedua atau reload halaman saat progress bar kalkulasi masih berjalan."
  - "Klik kembali tombol 'manual calculation of ending balance' pada tab kedua (atau coba trigger GET /product-mutation/calculation)."
  - "Amati respon UI dan notifikasi sistem."
expected_result: |
  1. Sistem memblokir eksekusi ganda dan menampilkan pesan peringatan validasi: 'Another ending balance calculation is running'.
  2. Batch job yang sedang berjalan tidak terinterupsi atau mengalami deadlock queue.
test_result:
  status: pending
  started_at: null
  finished_at: null
  executed_by: "OlshopERP (resty)"
  environment: staging
  log_summary: null
  report_url: null
first_execution:
  at: null
  via: null
  jira: "ETM-15984"
last_execution:
  at: null
  jira: "ETM-15984"
  status: pending
  via: null
---

# TC-PMUT-006: Pencegahan Eksekusi Ganda (Single-Flight) Saat Manual Calculation Sedang Berjalan

## Konteks Pengujian (Card ETM-15984 & Requirement Rule V-02)

Validasi guard single-flight: batch kalkulasi `manual-ending-balance-calculation` harus mengunci eksekusi paralel dalam tenant yang sama agar tidak menyebabkan race condition atau queue overload saat proses kalkulasi backdate tebal berlangsung.
