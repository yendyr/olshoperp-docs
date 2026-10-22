# Test Cases — Transfer Internal

| TC Code | Title | Status | Automated | Last Updated |
|---|---|---|---|---|
| TC-MTIN-001 | Create Transfer Internal header (TFI*) | draft | ✅ | 2026-07-15 |
| TC-MTIN-002 | Update header + tambah detail Select Product | draft | ✅ | 2026-07-15 |
| TC-MTIN-003 | BETA route terpisah & kolom Colli Code di Available Product | draft | ❌ | 2026-09-01 |
| TC-MTIN-004 | BulkColliAction — Existing, New Colli, dan loose (null colli) | draft | ❌ | 2026-09-01 |
| TC-MTIN-005 | Filter Existing Colli (struktur origin) & kolom Full Trf / Group View | draft | ❌ | 2026-09-01 |
| TC-MTIN-006 | Approve TFI Colli v2 & verifikasi mutasi stok (Stock Monitoring) | draft | ❌ | 2026-09-01 |
| TC-MTIN-007 | Regresi Urutan Baris Detail Transaksi SCM (LIFO / Last-In-First-Row) - Transfer Internal | draft | ✅ | 2026-08-27 |
| TC-MTIN-008 | Validasi Lokasi Destination Baris Detail Mengikuti Header (Available Product Modal) | draft | ❌ | 2026-08-30 |
| TC-MTIN-009 | Otomatis Sembunyikan SKU dari List/Dropdown saat Full Allocated (Outstanding Qty = 0) | draft | ❌ | 2026-08-30 |
| TC-MTIN-010 | Konsistensi Konversi Unit (UOM) dan Validasi Stok saat Penyuntingan Baris Detail | draft | ❌ | 2026-08-30 |
| TC-MTIN-011 | Validasi Penghapusan Colli Destination saat Perubahan Location Destination Inline (Partial Transfer of a Colli) | draft | ❌ | 2026-08-30 |
| TC-MTIN-012 | Validasi Pembatasan 1 Colli untuk 1 Location Destination | draft | ❌ | 2026-08-30 |
| TC-MTIN-013 | Pembersihan Colli Code saat Hapus Header Dokumen TFI Unapproved | draft | ❌ | 2026-09-14 |
| TC-MTIN-014 | Proteksi Merging Stock ID & Preservasi Colli Destination pada Modal Inline Update | draft | ❌ | 2026-09-14 |
| TC-MTIN-015 | Validasi Larangan Self-Assignment Colli Destination pada Partial Transfer (V-TFI-11) | draft | ❌ | 2026-09-14 |
| TC-MTIN-016 | Edit QTY langsung di tabel detail Transfer Internal tersimpan tanpa muat ulang seluruh tabel | draft | ❌ | 2026-10-19 |

**Requirement ref:** [requirement.md v2.0](../requirement.md) · Colli BETA §7 · GAP-TFI-01/03/04


**Re-test:** TC-MTIN-004 & 006 `last_execution: not_run` setelah align 2026-09-01 — chain 004→006.

### ETM-16361 — [Transfer Internal] Edit QTY di tabel detail tanpa refresh seluruh tabel

Origin Card: [ETM-16361](https://erpintegration.atlassian.net/browse/ETM-16361)

| TC Code | Judul Test Case | File | Status |
|---|---|---|---|
| `TC-MTIN-016` | Edit QTY langsung di tabel detail Transfer Internal tersimpan tanpa muat ulang seluruh tabel | [`TC-MTIN-016.md`](./TC-MTIN-016.md) | PASSED 🟢 (19-10-2026) |
