# Test Cases — All Sales Order

Konvensi penamaan file: **`TC-ASO-[CREATE|READ|UPDATE|DELETE]-NNN.md`**. DRAFT baru: `TC-ASO-DRAFT-{timestamp}.md`.

Urutan tabel mengikuti **urutan pertama → terakhir dijalankan**.

Card terkait: [ETM-15350](https://erpintegration.atlassian.net/browse/ETM-15350), [ETM-15446](https://erpintegration.atlassian.net/browse/ETM-15446). Home folder TC = All Sales Order.

Prefix folder: `ASO`.

| TC Code | Title | Status | Automated | Last Updated |
|---------|-------|--------|-----------|-------------|
| PENDING-20260819112201 | RECHECK ALL FAILED PROCESS — Trigger button recheck dari sidebar; verifikasi modal konfirmasi | draft | ❌ | 2026-08-19 |
| PENDING-20260819112202 | RECHECK ALL FAILED PROCESS — Eksekusi recheck; verifikasi background worker & notifikasi selesai | draft | ❌ | 2026-08-19 |
| PENDING-20260819112203 | RECHECK ALL FAILED PROCESS — Verifikasi log audit & perubahan error flag setelah recheck | draft | ❌ | 2026-08-19 |
| PENDING-20260820153001 | Memastikan Visibility, Counter & Posisi Pill Button Net Sales < COGS | **passed** | ✅ | 2026-08-20 |
| PENDING-20260820153002 | Memastikan Akurasi Filter Datalist saat Pill Net Sales < COGS Aktif (Positive Filter) | **passed** | ✅ | 2026-08-20 |
| PENDING-20260820153003 | Memastikan Deaktivasi Filter Pill (Toggle OFF) Mengembalikan Seluruh Data Sales Order | draft | ❌ | 2026-08-20 |
| PENDING-20260820153004 | Memastikan Interaksi Single-Active Toggle / Mutual Exclusive dengan Pill Button Lain | draft | ❌ | 2026-08-20 |
| PENDING-20260820153005 | Memastikan Kondisi Batas (Boundary: Net Sales == COGS, Net Sales > COGS, dan COGS = 0) Tidak Lolos Filter | draft | ❌ | 2026-08-20 |
| PENDING-20260820153006 | Memastikan Penanganan Empty State saat 0 Data Memenuhi Kriteria Filter Net Sales < COGS | draft | ❌ | 2026-08-20 |
| PENDING-20260820153007 | Memastikan Tampilan Icon Under Benchmark COGS (cogs-error) pada Kolom Error Flag & Baris Detail Item Order | draft | ❌ | 2026-08-20 |

`PENDING-20260820153001` s/d `PENDING-20260820153007` — Dibuat untuk pengujian fitur Pill Filter `Net Sales < COGS` pada card origin [ETM-15446](https://erpintegration.atlassian.net/browse/ETM-15446).
