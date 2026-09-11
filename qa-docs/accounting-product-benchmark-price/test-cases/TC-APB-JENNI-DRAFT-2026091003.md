---
doc_type: e2e-test-case
tc_code: PENDING-APB-JENNI-2026091003
menu: accounting-product-benchmark-price
menu_name: "Product Benchmark Price"
test_type: happy
title: Verifikasi Default Auto Expiry +30 Hari saat Expiry NULL & Preservation of Custom Expiry
summary: "Memastikan verifikasi default auto expiry +30 hari saat expiry NULL & preservation of custom expiry."
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

# TC-APB-JENNI-DRAFT-2026091003: Verifikasi Default Auto Expiry +30 Hari saat Expiry NULL & Preservation of Custom Expiry

## Objective
Memastikan saat user mengisi Manual COGS pada kondisi Expiry NULL, sistem otomatis menetapkan Expiry = Today + 30 hari. Jika Expiry sudah terisi sebelumnya, perubahan Manual COGS tidak meng-overwrite nilai Expiry tersebut.

## Preconditions
1. User login ke OlshopERP Staging (`tim_dev@mail.com`).
2. Berada di halaman Benchmark COGS.

## Test Steps
1. Pilih SKU produk yang memiliki **Manual COGS Expiry = NULL**.
2. Isi nilai **Manual COGS** (misal: 75.000) tanpa mengisi Expiry Date. Simpan.
3. Amati nilai **Manual COGS Expiry** yang dihasilkan sistem.
4. Ubah nilai **Manual COGS** menjadi 80.000 pada SKU yang **Expiry Date-nya sudah terisi** (misal H+15). Simpan.
5. Amati apakah nilai Expiry Date berubah atau di-reset.

## Expected Results
1. Pada kondisi Expiry awal `NULL`: Sistem secara otomatis mengisi **Manual COGS Expiry = Tanggal Simpan + 30 Hari** (Asia/Jakarta).
2. Pada kondisi Expiry awal **sudah terisi**: Nilai Expiry Date dipertahankan (tidak di-reset/overwritten ke +30 hari).
3. User tetap dapat mengedit Expiry Date ke tanggal lain (< atau > 30 hari) selama Expiry Date ≥ Today.
