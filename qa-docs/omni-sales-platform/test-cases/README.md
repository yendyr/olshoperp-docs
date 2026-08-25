# Test Cases — Platform Sales Order (Sales Platform)

Konvensi penamaan file: **`TC-SPLG-[CREATE|READ|UPDATE|DELETE]-NNN.md`**. DRAFT baru: `TC-SPLG-DRAFT-{timestamp}.md`.

Urutan tabel mengikuti **urutan pertama → terakhir dijalankan**.

Card terkait: [ETM-15447](https://erpintegration.atlassian.net/browse/ETM-15447). Home folder TC = Platform Sales Order.

Prefix folder: `SPLG`.

| TC Code | Title | Status | Automated | Last Updated |
|---------|-------|--------|-----------|-------------|
| TC-SPLG-001 | Memverifikasi Datalist Platform Sales Order | draft | ✅ | 2026-07-09 |
| TC-SPLG-002 | Memverifikasi Detail Order Platform | draft | ✅ | 2026-07-09 |
| TC-SPLG-003 | Memastikan Visibility, Counter & Posisi Pill Button Net Sales < COGS di Sales Platform | **passed** | ✅ | 2026-08-20 |
| TC-SPLG-004 | Memastikan Akurasi Filter Datalist saat Pill Net Sales < COGS Aktif di Sales Platform (Positive Filter) | **passed** | ✅ | 2026-08-20 |
| TC-SPLG-005 | Memastikan Deaktivasi Filter Pill (Toggle OFF) Mengembalikan Seluruh Data Platform Sales Order | **passed** | ✅ | 2026-08-20 |
| TC-SPLG-006 | Memastikan Interaksi Single-Active Toggle antar Pill Buttons di Sales Platform | **passed** | ✅ | 2026-08-20 |
| TC-SPLG-007 | Memastikan Kondisi Batas (Boundary: Net Sales == COGS, Net Sales > COGS, dan COGS = 0) Tidak Lolos Filter di Sales Platform | **passed** | ✅ | 2026-08-20 |
| TC-SPLG-008 | Memastikan Penanganan Empty State saat 0 Data Memenuhi Kriteria Filter di Sales Platform | **passed** | ✅ | 2026-08-20 |
| TC-SPLG-009 | Memastikan Tampilan Icon Under Benchmark COGS (cogs-error) pada Kolom Error Flag & Baris Detail Order di Sales Platform | **passed** | ✅ | 2026-08-20 |
| TC-SPLG-010 | Memastikan Platform SKU yang Belum Terbinding (Unbound) Tidak Memicu Filter Net Sales < COGS (benchmark_cogs = 0) | **passed** | ✅ | 2026-08-20 |
| TC-SPLG-011 | Memastikan Deteksi Realtime Under Benchmark COGS (Icon cogs-error & Counter Update) Pasca Binding Platform SKU | **passed** | ✅ | 2026-08-20 |

`TC-SPLG-003` s/d `TC-SPLG-011` — Dibuat untuk pengujian fitur Pill Filter `Net Sales < COGS` pada card origin [ETM-15447](https://erpintegration.atlassian.net/browse/ETM-15447) di Company **FAT**.
