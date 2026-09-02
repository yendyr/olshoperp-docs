# Test Cases — BETA - New Purchase Inbound

| TC Code | Title | Status | Automated | Last Updated |
|---------|-------|--------|-----------|--------------|
| TC-PI-CREATE-001 | Membuat dokumen inbound barang dari PO yang sudah di-approve — status Open | draft | ✅ | 2026-07-10 |
| TC-PI-APPROVE-001 | Approve dokumen inbound IN-6A506EAC dari halaman show — status Approved | draft | ✅ | 2026-07-10 |
| TC-PI-BULK-DELETE-001 | Bulk delete detail inbound — revert prepared qty | draft | ❌ | 2026-07-10 |
| TC-PI-002 | New Colli — satu colli berisi minimal dua SKU berbeda dengan Choose Colli Type | draft | ❌ | 2026-08-20 |
| TC-PI-003 | Validasi qty inbound melebihi sisa outstanding PO ditolak (termasuk alokasi per colli) | draft | ❌ | 2026-08-20 |
| TC-PI-004 | Validasi SKU di luar Purchase Order tidak bisa ditambahkan ke colli / detail inbound | draft | ❌ | 2026-08-20 |
| TC-PI-005 | Bulk Use — insert SKU ke colli existing vs create new colli code | draft | ❌ | 2026-08-20 |
| TC-PI-006 | Import inbound — nomor urut colli: kosong = tanpa colli; nomor sama = satu colli | draft | ❌ | 2026-08-20 |
| TC-PI-007 | Modal inbound — remove SKU dari colli dan move SKU ke colli lain | draft | ❌ | 2026-08-20 |
| TC-PI-008 | Choose Colli Type — Colli Type Active OFF tidak muncul di New Colli | draft | ❌ | 2026-08-20 |
| TC-PI-009 | Inline edit qty 1 → 0 → Save All | draft | ❌ | 2026-08-24 |
| TC-PI-010 | Single Use — Max Inbound Qty = 0 | draft | ❌ | 2026-08-24 |
| TC-PI-011 | Select Product — qty 0 → Save All | draft | ❌ | 2026-08-24 |
| TC-PI-012 | Import Inbound — Validasi Campuran Baris Excel (Edge/Negative cases) | draft | ❌ | 2026-08-24 |
<<<<<<< HEAD
| `TC-PI-015.md` / TC-PI-015 | Regresi Urutan Baris Detail Transaksi SCM (LIFO / Last-In-First-Row) - BETA New Purchase Inbound | draft | ✅ | 2026-08-27 |
=======
| `TC-PI-DRAFT-20260827083404.md` / PENDING-20260827083404 | Regresi Urutan Baris Detail Transaksi SCM (LIFO / Last-In-First-Row) - BETA New Purchase Inbound | draft | ✅ | 2026-08-27 |
| `TC-PI-016.md` / TC-PI-016 | Retest ETM-15611: Validasi Impor Colli Campuran, Notifikasi UI, dan Keakuratan Log Error | draft | ❌ | 2026-08-28 |
| `TC-PI-017.md` / TC-PI-017 | Retest ETM-15611: Validasi Kelancaran Operasi Downstream (Bulk Delete & Approve) Pasca Impor | draft | ❌ | 2026-08-28 |
| `TC-PI-018.md` / TC-PI-018 | Hapus Transaksi Inbound dengan New Colli (Multisku Colli Datalist) | draft | ❌ | 2026-08-30 |
>>>>>>> 0af2646 (update test case fitur colli multi-sku)

**Card Colli V2:** [ETM-15528](https://erpintegration.atlassian.net/browse/ETM-15528) & [ETM-15610](https://erpintegration.atlassian.net/browse/ETM-15610) & [ETM-15611](https://erpintegration.atlassian.net/browse/ETM-15611) — DRAFT `TC-PI-002` s/d `…1831` dan `TC-PI-009` s/d `…03`, serta `TC-PI-012` (belum renumber).

**Reuse master Colli Type:** [ETM-15543](https://erpintegration.atlassian.net/browse/ETM-15543) — `qa-docs/supplychain-colli-type/test-cases/`.
