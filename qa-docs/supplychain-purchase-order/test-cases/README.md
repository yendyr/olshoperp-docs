# Test Cases — Purchase Order

Konvensi penamaan file: **`TC-PO-[CREATE|READ|UPDATE|DELETE]-NNN.md`**. DRAFT baru: `TC-PO-DRAFT-{timestamp}.md`.

Urutan tabel mengikuti **urutan pertama → terakhir dijalankan**.

Card terkait: [ETM-15469](https://erpintegration.atlassian.net/browse/ETM-15469) — standardisasi UI export sidebar (12 menu Farrel). Home folder TC lintas-menu = Purchase Order.

Prefix folder: `PO`.

Referensi rekomendasi automation: [`POM-AUTOMATION-RECOMMENDATIONS.md`](../../../POM-AUTOMATION-RECOMMENDATIONS.md) (lihat **REC-02** untuk temuan sesi PO).

| TC Code | Title | Status | Automated | Last Updated |
|---------|-------|--------|-----------|-------------|
| TC-PO-CREATE-001 | Membuat Purchase Order With PR dari available products — status Draft | draft | ✅ | 2026-07-09 |
| TC-PO-UPDATE-001 | Set PO-6A4F5E97 status Open dari show datalist | draft | ✅ | 2026-07-09 |
| TC-PO-UPDATE-002 | Menyetujui dokumen PO-6A4F5E97 melalui datalist | draft | ✅ | 2026-07-09 |
| PENDING-20260817200300 | DATALIST — UI export standar sidebar Export (tanpa Export CSV / Export Excel di halaman utama) — 12 menu Farrel | **passed** | ❌ | 2026-08-17 |
| PENDING-20260819130801 | Memastikan Template Import PO Memiliki Kolom VAT dan File Template Lama Tetap Berhasil Diimport (Backward Compatibility) | draft | ✅ | 2026-08-19 |
| PENDING-20260819130802 | Memastikan Penentuan VAT Melalui Import Excel Berfungsi Eksplisit (Override Auto Add dan VAT No) | draft | ❌ | 2026-08-19 |
| PENDING-20260819130803 | Memastikan Import Detail PO Bersifat Partial Success Ketika Terdapat Baris Invalid | draft | ❌ | 2026-08-19 |
| PENDING-20260819130804 | Memastikan Konsistensi Penerapan Pajak (Tax) pada Fitur Allocate Full Qty Clearing dan Bulk Use PR | draft | ❌ | 2026-08-19 |
| PENDING-20260819130805 | Memastikan Kegagalan Global Format File Excel Membatalkan Seluruh Proses Import | draft | ❌ | 2026-08-19 |
| PENDING-20260817200310 | DATALIST — trigger export dari sidebar Export; hasil tercatat di history (Purchase Order) | **passed** | ❌ | 2026-08-17 |

`PENDING-20260817200300` / `PENDING-20260817200310` — **PASSED** (17 Agu 2026). 12 menu Farrel memakai sidebar **Export**. Observasi: Outbound External **Export** ON (Farrel sempat catat dimatikan). [ETM-15469](https://erpintegration.atlassian.net/browse/ETM-15469).
