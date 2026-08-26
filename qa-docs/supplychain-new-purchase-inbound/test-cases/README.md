# Test Cases — BETA - New Purchase Inbound

| TC Code | Title | Status | Automated | Last Updated |
|---------|-------|--------|-----------|--------------|
| TC-PI-CREATE-001 | Membuat dokumen inbound barang dari PO yang sudah di-approve — status Open | draft | ✅ | 2026-07-10 |
| TC-PI-APPROVE-001 | Approve dokumen inbound IN-6A506EAC dari halaman show — status Approved | draft | ✅ | 2026-07-10 |
| TC-PI-BULK-DELETE-001 | Bulk delete detail inbound — revert prepared qty | draft | ❌ | 2026-07-10 |
| PENDING-20260820091825 | New Colli — satu colli berisi minimal dua SKU berbeda dengan Choose Colli Type | draft | ❌ | 2026-08-20 |
| PENDING-20260820091826 | Validasi qty inbound melebihi sisa outstanding PO ditolak (termasuk alokasi per colli) | draft | ❌ | 2026-08-20 |
| PENDING-20260820091827 | Validasi SKU di luar Purchase Order tidak bisa ditambahkan ke colli / detail inbound | draft | ❌ | 2026-08-20 |
| PENDING-20260820091828 | Bulk Use — insert SKU ke colli existing vs create new colli code | draft | ❌ | 2026-08-20 |
| PENDING-20260820091829 | Import inbound — nomor urut colli: kosong = tanpa colli; nomor sama = satu colli | draft | ❌ | 2026-08-20 |
| PENDING-20260820091830 | Modal inbound — remove SKU dari colli dan move SKU ke colli lain | draft | ❌ | 2026-08-20 |
| PENDING-20260820091831 | Choose Colli Type — Colli Type Active OFF tidak muncul di New Colli | draft | ❌ | 2026-08-20 |
| PENDING-20260824113401 | Inline edit qty 1 → 0 → Save All | draft | ❌ | 2026-08-24 |
| PENDING-20260824113402 | Single Use — Max Inbound Qty = 0 | draft | ❌ | 2026-08-24 |
| PENDING-20260824113403 | Select Product — qty 0 → Save All | draft | ❌ | 2026-08-24 |
| PENDING-20260824124900 | Import Inbound — Validasi Campuran Baris Excel (Edge/Negative cases) | draft | ❌ | 2026-08-24 |

**Card Colli V2:** [ETM-15528](https://erpintegration.atlassian.net/browse/ETM-15528) & [ETM-15610](https://erpintegration.atlassian.net/browse/ETM-15610) & [ETM-15611](https://erpintegration.atlassian.net/browse/ETM-15611) — DRAFT `PENDING-20260820091825` s/d `…1831` dan `PENDING-20260824113401` s/d `…03`, serta `PENDING-20260824124900` (belum renumber).

**Reuse master Colli Type:** [ETM-15543](https://erpintegration.atlassian.net/browse/ETM-15543) — `qa-docs/supplychain-colli-type/test-cases/`.
