# Test Cases — Sales Order Invoicing

Card terkait: [ETM-15922](https://erpintegration.atlassian.net/browse/ETM-15922) [Sales Order Invoicing] - Kolom AR Menampilkan Total Header Transaksi Saat 1 AR Terdiri dari Multiple Sales Invoice.

Prefix folder: `SOI`.

| TC Code | Title | Test Type | Status | Automated | Origin Jira |
|---------|-------|-----------|--------|-----------|-------------|
| TC-SOI-001 | Verifikasi Nilai Kolom AR pada Relasi 1 AR Melunasi 1 SI | happy | draft | ❌ | ETM-15922 |
| TC-SOI-002 | Verifikasi Nilai Kolom AR pada Relasi 1 AR Melunasi Multiple SI | regression | draft | ❌ | ETM-15922 |
| TC-SOI-003 | Verifikasi Nilai Kolom AR pada Relasi 1 SI Dilunasi Multiple AR Secara Bertahap | happy | draft | ❌ | ETM-15922 |
| TC-SOI-004 | Verifikasi Nilai Kolom AR pada Relasi Kompleks Many-to-Many Multi-SI dan Multi-AR | edge | draft | ❌ | ETM-15922 |
| TC-SOI-005 | Verifikasi Penanganan Nilai Kolom AR untuk Sales Invoice yang Belum Memiliki Pembayaran AR | negative | draft | ❌ | ETM-15922 |
| TC-SOI-006 | Verifikasi Konsistensi Nilai Kolom AR pada Fitur Export All Excel untuk Seluruh Skenario Relasi | happy | draft | ❌ | ETM-15922 |
