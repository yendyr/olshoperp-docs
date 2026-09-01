# Test Cases — External Transfer

| TC Code | Title | Status | Automated | Last Updated |
|---|---|---|---|---|
| TC-MTEX-001 | Create External Transfer header (TFE*) | draft | ✅ | 2026-07-15 |
| TC-MTEX-002 | Update header + tambah detail Select Product | draft | ✅ | 2026-07-15 |
<<<<<<< HEAD
| `TC-MTEX-003.md` / TC-MTEX-003 | Regresi Urutan Baris Detail Transaksi SCM (LIFO / Last-In-First-Row) - External Transfer | draft | ✅ | 2026-08-27 |
=======
| `TC-MTEX-DRAFT-20260827083406.md` / PENDING-20260827083406 | Regresi Urutan Baris Detail Transaksi SCM (LIFO / Last-In-First-Row) - External Transfer | draft | ✅ | 2026-08-27 |
| `TC-MTEX-DRAFT-20260827162401.md` / PENDING-20260827162401 | Retest ETM-15596: Verifikasi Cetakan PDF dengan Urutan Default (LIFO) - Transfer External | draft | ❌ | 2026-08-27 |
| `TC-MTEX-DRAFT-20260827162402.md` / PENDING-20260827162402 | Retest ETM-15596: Verifikasi Cetakan PDF dengan Sorting SKU (Ascending & Descending) - Transfer External | draft | ❌ | 2026-08-27 |
| `TC-MTEX-DRAFT-20260827162403.md` / PENDING-20260827162403 | Retest ETM-15596: Verifikasi Cetakan PDF dengan Sorting Qty (Ascending & Descending) - Transfer External | draft | ❌ | 2026-08-27 |
| `TC-MTEX-DRAFT-20260827162404.md` / PENDING-20260827162404 | Retest ETM-15596: Verifikasi Cetakan PDF Setelah Sorting Dinonaktifkan (Reset to LIFO) - Transfer External | draft | ❌ | 2026-08-27 |
| `TC-MTEX-DRAFT-20260831092401.md` / PENDING-20260831092401 | Retest ETM-15648: Validasi Reset Colli Destination dan Notifikasi Error saat Ubah Qty Transfer | draft | ❌ | 2026-08-31 |

| `TC-MTEX-DRAFT-20260831140601.md` / PENDING-20260831140601 | Validasi Lokasi Destination Baris Detail Mengikuti Header (Available Product Modal) - Transfer External | draft | ❌ | 2026-08-31 |
| `TC-MTEX-DRAFT-20260831140602.md` / PENDING-20260831140602 | Otomatis Sembunyikan SKU dari List/Dropdown saat Full Allocated (Outstanding Qty = 0) - Transfer External | draft | ❌ | 2026-08-31 |
| `TC-MTEX-DRAFT-20260831140603.md` / PENDING-20260831140603 | Konsistensi Konversi Unit (UOM) dan Validasi Stok saat Penyuntingan Baris Detail - Transfer External | draft | ❌ | 2026-08-31 |
| `TC-MTEX-DRAFT-20260831140604.md` / PENDING-20260831140604 | Validasi Penghapusan Colli Destination saat Perubahan Location Destination Inline (Partial Transfer of a Colli) - Transfer External | draft | ❌ | 2026-08-31 |
| `TC-MTEX-DRAFT-20260831140605.md` / PENDING-20260831140605 | Validasi Pembatasan 1 Colli untuk 1 Location Destination - Transfer External | draft | ❌ | 2026-08-31 |
>>>>>>> 0af2646 (update test case fitur colli multi-sku)

## Cross-menu

**Transfer Inbound** (`supplychain-transfer-inbound`) memakai dokumen External Transfer yang sudah **Approve ship** (in transit) sebagai fixture receive.

Fixture aktif: **`TFE-5TU41QH5`** — lihat `qa-docs/supplychain-transfer-inbound/test-cases/TC-TIB-001.md`.

Description (standing rule): `automation playwright`.

Skenario TI e2e: Origin DropOFF Gayungsari → Destination DropOFF Tunjungan Plaza; SKU `AUTO-SKU001` / `AUTO-SKU002`; Description TE = `automation playwright`.
