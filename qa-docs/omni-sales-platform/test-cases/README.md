# Test Cases — Platform Sales Order (Sales Platform)

Konvensi penamaan file: **`TC-SPLG-NNN.md`**. DRAFT baru: `TC-SPLG-DRAFT-{timestamp}.md`.

Urutan tabel mengikuti **urutan pertama → terakhir dijalankan**.

Card terkait: [ETM-15447](https://erpintegration.atlassian.net/browse/ETM-15447), [ETM-15733](https://erpintegration.atlassian.net/browse/ETM-15733). Home folder TC = Platform Sales Order.

Prefix folder: `SPLG`.

| TC Code | Title | Status | Jira | Assignee | Automated | Last Updated |
|---------|-------|--------|------|----------|-----------|-------------|
| TC-SPLG-001 | Memverifikasi Datalist Platform Sales Order | draft | - | - | ✅ | 2026-07-09 |
| TC-SPLG-002 | Memverifikasi Detail Order Platform | draft | - | - | ✅ | 2026-07-09 |
| TC-SPLG-003 | Memastikan Visibility, Counter & Posisi Pill Button Net Sales < COGS di Sales Platform | **passed** | [ETM-15447](https://erpintegration.atlassian.net/browse/ETM-15447) | - | ✅ | 2026-08-20 |
| TC-SPLG-004 | Memastikan Akurasi Filter Datalist saat Pill Net Sales < COGS Aktif di Sales Platform (Positive Filter) | **passed** | [ETM-15447](https://erpintegration.atlassian.net/browse/ETM-15447) | - | ✅ | 2026-08-20 |
| TC-SPLG-005 | Memastikan Deaktivasi Filter Pill (Toggle OFF) Mengembalikan Seluruh Data Platform Sales Order | **passed** | [ETM-15447](https://erpintegration.atlassian.net/browse/ETM-15447) | - | ✅ | 2026-08-20 |
| TC-SPLG-006 | Memastikan Interaksi Single-Active Toggle antar Pill Buttons di Sales Platform | **passed** | [ETM-15447](https://erpintegration.atlassian.net/browse/ETM-15447) | - | ✅ | 2026-08-20 |
| TC-SPLG-007 | Memastikan Kondisi Batas (Boundary: Net Sales == COGS, Net Sales > COGS, dan COGS = 0) Tidak Lolos Filter di Sales Platform | **passed** | [ETM-15447](https://erpintegration.atlassian.net/browse/ETM-15447) | - | ✅ | 2026-08-20 |
| TC-SPLG-008 | Memastikan Penanganan Empty State saat 0 Data Memenuhi Kriteria Filter di Sales Platform | **passed** | [ETM-15447](https://erpintegration.atlassian.net/browse/ETM-15447) | - | ✅ | 2026-08-20 |
| TC-SPLG-009 | Memastikan Tampilan Icon Under Benchmark COGS (cogs-error) pada Kolom Error Flag & Baris Detail Order di Sales Platform | **passed** | [ETM-15447](https://erpintegration.atlassian.net/browse/ETM-15447) | - | ✅ | 2026-08-20 |
| TC-SPLG-010 | Memastikan Platform SKU yang Belum Terbinding (Unbound) Tidak Memicu Filter Net Sales < COGS (benchmark_cogs = 0) | **passed** | [ETM-15447](https://erpintegration.atlassian.net/browse/ETM-15447) | - | ✅ | 2026-08-20 |
| TC-SPLG-011 | Memastikan Deteksi Realtime Under Benchmark COGS (Icon cogs-error & Counter Update) Pasca Binding Platform SKU | **passed** | [ETM-15447](https://erpintegration.atlassian.net/browse/ETM-15447) | - | ✅ | 2026-08-20 |
| TC-SPLG-012 | [Penolakan Extract SKU Bundle saat Price bernilai 0 pada order platform booking](./TC-SPLG-012.md) | **passed** | [ETM-15740](https://erpintegration.atlassian.net/browse/ETM-15740) | Jeiniffer | ✅ | 2026-09-02 |
| TC-SPLG-013 | [Ekstraksi SKU Bundle berhasil saat Price bernilai lebih dari 0 (Price > 0)](./TC-SPLG-013.md) | **passed** | [ETM-15741](https://erpintegration.atlassian.net/browse/ETM-15741) | OlshopERP | ✅ | 2026-09-03 |
| TC-SPLG-014 | [Boundary test Price desimal sangat kecil (0.0001) vs Price negatif (-1000)](./TC-SPLG-014.md) | **passed** | [ETM-15742](https://erpintegration.atlassian.net/browse/ETM-15742) | Jeiniffer | ❌ | 2026-09-03 |
| TC-SPLG-015 | [Multi-bundle dalam 1 order platform dengan kombinasi Price = 0 dan Price > 0](./TC-SPLG-015.md) | **passed** | [ETM-15743](https://erpintegration.atlassian.net/browse/ETM-15743) | OlshopERP | ✅ | 2026-09-03 |
| TC-SPLG-016 | [Verifikasi regresi guard status order (Approved / Void) pada SKU Bundle berharga valid](./TC-SPLG-016.md) | **passed** | [ETM-15744](https://erpintegration.atlassian.net/browse/ETM-15744) | Jeiniffer | ❌ | 2026-09-03 |
| TC-SPLG-017 | [Lifecycle Booking Platform: Tertahan saat Price = 0 dan Berhasil setelah Convert (Price > 0)](./TC-SPLG-017.md) | draft | [ETM-15745](https://erpintegration.atlassian.net/browse/ETM-15745) | OlshopERP | ❌ | 2026-09-02 |

`TC-SPLG-003` s/d `TC-SPLG-011` — Dibuat untuk pengujian fitur Pill Filter `Net Sales < COGS` pada card origin [ETM-15447](https://erpintegration.atlassian.net/browse/ETM-15447) di Company **FAT**.  
`TC-SPLG-012` s/d `TC-SPLG-017` — Dibuat untuk validasi Price > 0 pada tombol Extract Bundle di menu Dev - Sales Platform pada card origin [ETM-15733](https://erpintegration.atlassian.net/browse/ETM-15733).
### ETM-15717 — [Sales Platform] Order hasil cloned dari proses void seharusnya tetap bertipe Sales Platform, bukan berubah menjadi Sales Order Internal/General

| Kode Draf | Judul Test Case | File | Status |
|---|---|---|---|
| `PENDING-JENNI-2026090701` | Void & Clone Order Sales Platform — Tipe Order Baru Tetap Sales Platform & Mempertahankan Platform Order ID | [`TC-SPO-JENNI-DRAFT-2026090701.md`](./TC-SPO-JENNI-DRAFT-2026090701.md) | DRAFT 🟡 |
| `PENDING-JENNI-2026090702` | Verifikasi Halaman Datalist & Detail Sales Platform untuk Order Hasil Void & Clone | [`TC-SPO-JENNI-DRAFT-2026090702.md`](./TC-SPO-JENNI-DRAFT-2026090702.md) | DRAFT 🟡 |
| `PENDING-JENNI-2026090703` | Fitur Re-sync Marketplace pada Order Sales Platform Hasil Void & Clone | [`TC-SPO-JENNI-DRAFT-2026090703.md`](./TC-SPO-JENNI-DRAFT-2026090703.md) | DRAFT 🟡 |
| `PENDING-JENNI-2026090704` | Regresi Pemrosesan Void & Clone untuk Sales Order Internal / General (Non-Platform) | [`TC-SPO-JENNI-DRAFT-2026090704.md`](./TC-SPO-JENNI-DRAFT-2026090704.md) | DRAFT 🟡 |
| `PENDING-JENNI-2026090705` | End-to-End Processing Order Sales Platform Hasil Void & Clone (Send to Default Waves hingga Shipped) | [`TC-SPO-JENNI-DRAFT-2026090705.md`](./TC-SPO-JENNI-DRAFT-2026090705.md) | DRAFT 🟡 |
