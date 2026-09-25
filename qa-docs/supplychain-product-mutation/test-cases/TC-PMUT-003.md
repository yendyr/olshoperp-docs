---
doc_type: e2e-test-case
tc_code: TC-PMUT-003
menu: supplychain-product-mutation
menu_name: "Product Mutation History"
test_type: regression
title: "Manual calculation of ending balance selesai sukses tanpa timeout pada mutasi masif Building 19"
summary: "Trigger manual calculation of ending balance untuk company/building bervolume mutasi masif dengan rentang tanggal backdate (mulai 1 Juli 2026); verifikasi job selesai sukses tanpa timeout 360s dan tidak hang."
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
  - supplychain-real-stock
preconditions:
  - "User memiliki hak akses menu Supply Chain -> Report -> Product Mutation History."
  - "Company memiliki Building 19 (atau building aktif dengan mutasi tinggi) dengan riwayat mutasi sejak 1 Juli 2026."
  - "Tidak ada proses manual calculation ending balance lain yang sedang berjalan (tidak muncul pesan 'Another ending balance calculation is running')."
test_data:
  - building: "Building 19 (SERUNI-ST)"
    backdate_start: "2026-07-01"
    sample_skus:
      - sku: "SKUCasing-Cinnamoroll"
        type: "Fast-Moving (Inbound PO + Outbound SO)"
      - sku: "SKUCasing-HelloKitty"
        type: "Variasi Mutasi (Transfer TF / Opname AI/AO / Retur PT)"
      - sku: "CHARMBUN03"
        type: "Saldo awal non-nol sebelum 1 Juli 2026"
steps:
  - "Buka menu Supply Chain -> Report -> Product Mutation History (/supplychain/product-mutation)."
  - "Pastikan halaman memuat tombol 'manual calculation of ending balance'."
  - "Klik tombol 'manual calculation of ending balance'."
  - "Pantau request ke API GET /product-mutation/calculation dan polling GET /product-mutation/calculation-progress."
  - "Catat durasi kalkulasi dan pastikan proses selesai sampai 100% tanpa error timeout di browser."
  - "Cek log viewer Laravel (jika ada akses) pada queue worker CalculateEndingBalancePerBuilding: pastikan tidak ada status 'Timeout Exceeded' (sebelumnya timeout 360 detik)."
expected_result: |
  1. Proses manual calculation of ending balance berjalan tuntas hingga selesai.
  2. Tidak terjadi Timeout Exceeded (360 detik) pada job CalculateEndingBalancePerBuilding.
  3. Indikator/modal kalkulasi di layar menutup atau memberikan feedback sukses selesai.
test_result:
  status: passed
  started_at: "2026-09-25T08:50:00+07:00"
  finished_at: "2026-09-25T08:54:00+07:00"
  executed_by: "OlshopERP (resty)"
  environment: staging
  log_summary: "PASS Manual Calculation Ending Balance pada backdate jauh Building 19 · Selesai sukses tanpa timeout/error · Respon render inspect: SKUCasing-Cinnamoroll 187ms, SKUCasing-HelloKitty 71ms, CHARMBUN03 67ms"
  report_url: null
first_execution:
  at: "2026-09-25"
  via: "manual:resty"
  jira: "ETM-15984"
last_execution:
  at: "2026-09-25"
  jira: "ETM-15984"
  status: passed
  via: "manual:resty"
---

# TC-PMUT-003: Manual Calculation of Ending Balance Selesai Sukses Tanpa Timeout pada Mutasi Masif Building 19

## Konteks Pengujian (Card ETM-15984)

Card ini merupakan perbaikan (re-open) atas isu **Timeout Exceeded** pada job queue backend `CalculateEndingBalancePerBuilding` ketika memproses mutasi dalam volume sangat besar dan rentang waktu lama (backdate mulai 1 Juli 2026 di Building 19).

Parameter timeout sebelumnya bernilai 360 detik dengan chunk produk per job yang memicu antrian gagal saat beban mutasi tinggi.

## Catatan Eksekusi

- **Target Building:** Building 19 (SERUNI-ST).
- **Log Verification:** Jika ada indikasi error, cek log viewer Laravel pada queue worker `CalculateEndingBalancePerBuilding` / command `stock:calculate-ending-balance`.
