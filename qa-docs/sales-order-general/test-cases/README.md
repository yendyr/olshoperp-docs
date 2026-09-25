# Test Cases: Dev - Sales Order (Sales Order General)

Dokumen test case untuk menu **Dev - Sales Order** (`sales-order-general`).

## Daftar Test Case

### ETM-15887: Informasi Total Detail Lines (Termasuk Komponen Bundle) pada Form Sales Order

| Kode TC | Judul | Tipe | Status | Automated | Terakhir Dieksekusi |
| :--- | :--- | :--- | :--- | :--- | :--- |
| [`TC-SOG-15887-01`](TC-SOG-15887-01.md) | Akurasi Label Counter Total Detail Lines pada Input Single & Bundle SKU | Happy | ✅ Passed | ❌ | 2026-09-25 (manual) |
| [`TC-SOG-15887-02`](TC-SOG-15887-02.md) | Verifikasi Bahasa Teks Counter dan Penolakan Input Manual saat Mencapai Kapasitas Maksimal | Edge | ❌ Failed | ❌ | 2026-09-25 (manual) |
| [`TC-SOG-15887-03`](TC-SOG-15887-03.md) | Perhitungan Total Detail Lines untuk SKU Header Assembly | Happy | ✅ Passed | ❌ | 2026-09-25 (manual) |
| [`TC-SOG-15887-04`](TC-SOG-15887-04.md) | Import Tepat 100 Baris SKU Single (Boundary Test Limit 100 Detail Lines) | Edge | ✅ Passed | ❌ | 2026-09-25 (manual) |
| [`TC-SOG-15887-05`](TC-SOG-15887-05.md) | Penolakan Penambahan Produk saat Kapasitas Sudah Mencapai 100 Detail Lines | Negative | ✅ Passed | ❌ | 2026-09-25 (manual) |
| [`TC-SOG-15887-06`](TC-SOG-15887-06.md) | Proteksi Backend Approval terhadap Race Condition Penambahan Produk saat Import Sedang Berjalan | Edge | ✅ Passed | ❌ | 2026-09-25 (manual) |
| [`TC-SOG-15887-07`](TC-SOG-15887-07.md) | Import Tepat 50 Baris SKU Bundle @2 Komponen (Boundary Test Limit 100 Detail Lines) | Edge | ❌ Failed | ❌ | 2026-09-25 (manual) |
| [`TC-SOG-15887-08`](TC-SOG-15887-08.md) | Import Kombinasi 25 Baris Bundle dan 50 Baris Single (Total 100 Detail Lines) | Edge | ❌ Failed | ❌ | 2026-09-25 (manual) |
| [`TC-SOG-15887-09`](TC-SOG-15887-09.md) | Import Terpisah (Multi-File / Sequential Import) dalam 1 Dokumen Sales Order | Edge | ❌ Failed | ❌ | 2026-09-25 (manual) |
