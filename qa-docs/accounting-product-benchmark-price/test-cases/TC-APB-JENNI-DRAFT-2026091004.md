---
doc_type: e2e-test-case
tc_code: PENDING-APB-JENNI-2026091004
menu: accounting-product-benchmark-price
menu_name: "Product Benchmark Price"
test_type: happy
title: Verifikasi Validasi & Processing Import Excel Benchmark COGS
summary: "Memastikan verifikasi validasi & processing import excel benchmark COGS."
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

# TC-APB-JENNI-DRAFT-2026091004: Verifikasi Validasi & Processing Import Excel Benchmark COGS

## Objective
Memastikan fitur Import Benchmark COGS memproses aturan semantik baru dengan tepat (Manual NULL = clear override; Manual NULL + Expiry terisi = error baris; Manual terisi + Expiry kosong = auto +30 hari).

## Preconditions
1. User login ke OlshopERP Staging (`tim_dev@mail.com`).
2. Memiliki template file import Benchmark COGS.

## Test Steps
1. Siapkan file import Excel Benchmark COGS dengan 3 baris pengujian:
   - **Baris A**: Manual COGS = Kosong (NULL), Expiry = Kosong (NULL).
   - **Baris B**: Manual COGS = Kosong (NULL), Expiry = 2026-10-10.
   - **Baris C**: Manual COGS = 60.000, Expiry = Kosong (NULL).
   - **Baris D**: Manual COGS = 70.000, Expiry = 2026-10-15.
2. Unggah dan jalankan proses Import Benchmark COGS.
3. Amati pesan error/notifikasi respon import dan periksa data di datalist Benchmark COGS.

## Expected Results
1. **Baris A**: Berhasil diimpor. SKU yang memiliki override sebelumnya akan di-clear (Manual COGS & Expiry jadi NULL).
2. **Baris B**: Ditolak (Error baris). Notifikasi menginformasikan bahwa Expiry tidak boleh diisi apabila Manual COGS kosong.
3. **Baris C**: Berhasil diimpor. Manual COGS terisi 60.000 dan Expiry terisi otomatis `Today + 30 Hari`.
4. **Baris D**: Berhasil diimpor. Manual COGS terisi 70.000 dan Expiry sesuai nilai file (`2026-10-15`).
