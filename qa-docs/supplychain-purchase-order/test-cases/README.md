# Test Cases — Purchase Order

Konvensi penamaan file: **`TC-PO-[CREATE|READ|UPDATE|DELETE]-NNN.md`**. DRAFT baru: `TC-PO-DRAFT-{timestamp}.md`.

Urutan tabel mengikuti **urutan pertama → terakhir dijalankan**.

Card terkait: [ETM-15469](https://erpintegration.atlassian.net/browse/ETM-15469), [ETM-15425](https://erpintegration.atlassian.net/browse/ETM-15425). Home folder TC = Purchase Order.

Prefix folder: `PO`.

| TC Code | Title | Status | Automated | Last Updated |
|---------|-------|--------|-----------|-------------|
| TC-PO-CREATE-001 | Membuat Purchase Order With PR dari available products — status Draft | draft | ✅ | 2026-07-09 |
| TC-PO-UPDATE-001 | Set PO-6A4F5E97 status Open dari show datalist | draft | ✅ | 2026-07-09 |
| TC-PO-UPDATE-002 | Menyetujui dokumen PO-6A4F5E97 melalui datalist | draft | ✅ | 2026-07-09 |
| TC-PO-001 | DATALIST — UI export standar sidebar Export (tanpa Export CSV / Export Excel di halaman utama) — 12 menu Farrel | **passed** | ❌ | 2026-08-17 |
| TC-PO-002 | DATALIST — trigger export dari sidebar Export; hasil tercatat di history (Purchase Order) | **passed** | ❌ | 2026-08-17 |
| TC-PO-003 | Memastikan Template Import PO Memiliki Kolom VAT dan File Template Lama Tetap Berhasil Diimport (Backward Compatibility) | **passed** | ✅ | 2026-08-19 |
| TC-PO-004 | Memastikan Penentuan VAT Melalui Import Excel Berfungsi Eksplisit (Override Auto Add dan VAT No) | **passed** | ✅ | 2026-08-19 |
| TC-PO-005 | Memastikan Import Detail PO Bersifat Partial Success Ketika Terdapat Baris Invalid | **passed** | ✅ | 2026-08-19 |
| TC-PO-006 | Memastikan Konsistensi Penerapan Pajak (Tax) pada Fitur Allocate Full Qty Clearing dan Bulk Use PR | **passed** | ✅ | 2026-08-19 |
| TC-PO-007 | Memastikan Kegagalan Global Format File Excel Membatalkan Seluruh Proses Import | **passed** | ✅ | 2026-08-19 |
| TC-PO-008 | Memastikan Penanganan Kolom VAT Type Terisi Saat System Product Tanpa Setting VAT atau Setting Auto Add Supplier = NO | **passed** | ✅ | 2026-08-19 |
| TC-PO-009 | Memastikan Mekanisme Fallback Cerdas Saat VAT=yes Dengan Kolom VAT Code / VAT Type Kosong Mengikuti Master Produk | **passed** | ✅ | 2026-08-19 |
| `TC-PO-DRAFT-20260826150611.md` / PENDING-20260826150611 | Error 'Failed to load PDF document' saat klik button Print Detail tanpa sorting | draft | ❌ | 2026-08-26 |

`TC-PO-003` (TC 1), `TC-PO-004` (TC 2), dan `TC-PO-005` (TC 3) — **PASSED** (19 Agu 2026 via Playwright E2E di Staging company `lumicharmsid`). Terkait card origin [ETM-15425](https://erpintegration.atlassian.net/browse/ETM-15425) & card error [ETM-15598](https://erpintegration.atlassian.net/browse/ETM-15598).
