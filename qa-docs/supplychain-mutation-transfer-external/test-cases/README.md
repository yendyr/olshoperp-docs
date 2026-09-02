# Test Cases — External Transfer

| TC Code | Title | Status | Automated | Last Updated |
|---|---|---|---|---|
| TC-MTEX-001 | Create External Transfer header (TFE*) | draft | ✅ | 2026-07-15 |
| TC-MTEX-002 | Update header + tambah detail Select Product | draft | ✅ | 2026-07-15 |
<<<<<<< HEAD
| `TC-MTEX-003.md` / TC-MTEX-003 | Regresi Urutan Baris Detail Transaksi SCM (LIFO / Last-In-First-Row) - External Transfer | draft | ✅ | 2026-08-27 |
=======
| `TC-MTEX-DRAFT-20260827083406.md` / PENDING-20260827083406 | Regresi Urutan Baris Detail Transaksi SCM (LIFO / Last-In-First-Row) - External Transfer | draft | ✅ | 2026-08-27 |
| `TC-MTEX-004.md` / TC-MTEX-004 | Retest ETM-15596: Verifikasi Cetakan PDF dengan Urutan Default (LIFO) - Transfer External | draft | ❌ | 2026-08-27 |
| `TC-MTEX-005.md` / TC-MTEX-005 | Retest ETM-15596: Verifikasi Cetakan PDF dengan Sorting SKU (Ascending & Descending) - Transfer External | draft | ❌ | 2026-08-27 |
| `TC-MTEX-006.md` / TC-MTEX-006 | Retest ETM-15596: Verifikasi Cetakan PDF dengan Sorting Qty (Ascending & Descending) - Transfer External | draft | ❌ | 2026-08-27 |
| `TC-MTEX-007.md` / TC-MTEX-007 | Retest ETM-15596: Verifikasi Cetakan PDF Setelah Sorting Dinonaktifkan (Reset to LIFO) - Transfer External | draft | ❌ | 2026-08-27 |
| `TC-MTEX-008.md` / TC-MTEX-008 | Retest ETM-15648: Validasi Reset Colli Destination dan Notifikasi Error saat Ubah Qty Transfer | draft | ❌ | 2026-08-31 |

| `TC-MTEX-009.md` / TC-MTEX-009 | Validasi Lokasi Destination Baris Detail Mengikuti Header (Available Product Modal) - Transfer External | draft | ❌ | 2026-08-31 |
| `TC-MTEX-010.md` / TC-MTEX-010 | Otomatis Sembunyikan SKU dari List/Dropdown saat Full Allocated (Outstanding Qty = 0) - Transfer External | draft | ❌ | 2026-08-31 |
| `TC-MTEX-011.md` / TC-MTEX-011 | Konsistensi Konversi Unit (UOM) dan Validasi Stok saat Penyuntingan Baris Detail - Transfer External | draft | ❌ | 2026-08-31 |
| `TC-MTEX-012.md` / TC-MTEX-012 | Validasi Penghapusan Colli Destination saat Perubahan Location Destination Inline (Partial Transfer of a Colli) - Transfer External | draft | ❌ | 2026-08-31 |
| `TC-MTEX-013.md` / TC-MTEX-013 | Validasi Pembatasan 1 Colli untuk 1 Location Destination - Transfer External | draft | ❌ | 2026-08-31 |
>>>>>>> 0af2646 (update test case fitur colli multi-sku)

## Cross-menu

**Transfer Inbound** (`supplychain-transfer-inbound`) memakai dokumen External Transfer yang sudah **Approve ship** (in transit) sebagai fixture receive.

Fixture aktif: **`TFE-5TU41QH5`** — lihat `qa-docs/supplychain-transfer-inbound/test-cases/TC-TIB-001.md`.

Description (standing rule): `automation playwright`.

Skenario TI e2e: Origin DropOFF Gayungsari → Destination DropOFF Tunjungan Plaza; SKU `AUTO-SKU001` / `AUTO-SKU002`; Description TE = `automation playwright`.
