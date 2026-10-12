# Test Cases: Dev - Sales Order (Sales Order General)

Dokumen test case untuk menu **Dev - Sales Order** (`sales-order-general`).

## Daftar Test Case

### ETM-15887: Informasi Total Detail Lines (Termasuk Komponen Bundle) pada Form Sales Order

| Kode TC | Judul | Tipe | Status | Automated | Terakhir Dieksekusi |
| :--- | :--- | :--- | :--- | :--- | :--- |
| [`TC-SOG-15887-01`](TC-SOG-15887-01.md) | Akurasi Label Counter Total Detail Lines pada Input Single & Bundle SKU | Happy | ✅ Passed | ❌ | 2026-09-25 (manual) |
| [`TC-SOG-15887-02`](TC-SOG-15887-02.md) | Verifikasi Bahasa Teks Counter dan Penolakan Input Manual saat Mencapai Kapasitas Maksimal | Edge | ✅ Passed | ❌ | 2026-09-29 (manual) |
| [`TC-SOG-15887-03`](TC-SOG-15887-03.md) | Perhitungan Total Detail Lines untuk SKU Header Assembly | Happy | ✅ Passed | ❌ | 2026-09-25 (manual) |
| [`TC-SOG-15887-04`](TC-SOG-15887-04.md) | Import Tepat 100 Baris SKU Single (Boundary Test Limit 100 Detail Lines) | Edge | ✅ Passed | ❌ | 2026-09-25 (manual) |
| [`TC-SOG-15887-05`](TC-SOG-15887-05.md) | Penolakan Penambahan Produk saat Kapasitas Sudah Mencapai 100 Detail Lines | Negative | ✅ Passed | ❌ | 2026-09-25 (manual) |
| [`TC-SOG-15887-06`](TC-SOG-15887-06.md) | Pencegahan Race Condition Penambahan Produk Manual saat Import Processing dan Proteksi Backend Approval | Edge | ❌ Failed (Need UI Fix) | ❌ | 2026-09-29 (manual) |
| [`TC-SOG-15887-07`](TC-SOG-15887-07.md) | Import Tepat 50 Baris SKU Bundle @2 Komponen (Boundary Test Limit 100 Detail Lines) | Edge | ✅ Passed | ❌ | 2026-09-29 (manual) |
| [`TC-SOG-15887-08`](TC-SOG-15887-08.md) | Import Kombinasi 25 Baris Bundle dan 50 Baris Single (Total 100 Detail Lines) | Edge | ✅ Passed | ❌ | 2026-09-29 (manual) |
| [`TC-SOG-15887-09`](TC-SOG-15887-09.md) | Import Terpisah (Multi-File / Sequential Import) dalam 1 Dokumen Sales Order | Edge | ✅ Passed | ❌ | 2026-09-29 (manual) |

### ETM-16269: Price Before VAT tidak Menghitung Komponen Bundle Variant 'Random'

Card terkait: [ETM-16269](https://erpintegration.atlassian.net/browse/ETM-16269) (Origin: [ETM-16216](https://erpintegration.atlassian.net/browse/ETM-16216))

| Kode TC | Judul | Tipe | Status | Automated | Terakhir Dieksekusi |
| :--- | :--- | :--- | :--- | :--- | :--- |
| [`TC-SOG-16269-01`](TC-SOG-16269-01.md) | Akumulasi Price Before VAT pada Header Bundle yang Memiliki Komponen Variant Random | Happy | ❌ Failed | ❌ | 2026-10-12 (manual) |
| [`TC-SOG-16269-02`](TC-SOG-16269-02.md) | Verifikasi Breakdown Nilai Price Komponen Random Child pada Modal Detail Bundle | Functional | ✅ Passed | ❌ | 2026-10-12 (manual) |
| [`TC-SOG-16269-03`](TC-SOG-16269-03.md) | Verifikasi Nilai Grand Total Header SO Bebas dari Double-Counting Komponen Random Child | Regression | ❌ Failed | ❌ | 2026-10-12 (manual) |
| [`TC-SOG-16269-04`](TC-SOG-16269-04.md) | Tampilan Detail Price Before VAT dan VAT Amount pada Single Random SKU Mandiri | Functional | ✅ Passed | ❌ | 2026-10-12 (manual) |
| [`TC-SOG-16269-05`](TC-SOG-16269-05.md) | Cascade Delete Random Child saat Baris Bundle Dihapus dari Sales Order | Regression | ✅ Passed | ❌ | 2026-10-12 (manual) |
| [`TC-SOG-16269-06`](TC-SOG-16269-06.md) | Perhitungan Price, DPP, dan VAT pada Detail Sales Order Berupa SKU Bundle Random Setelah Send to Default Waves | Edge | ❌ Failed | ❌ | 2026-10-12 (manual) |
