# Test Cases — All Sales Order

Konvensi penamaan file: **`TC-ASO-[CREATE|READ|UPDATE|DELETE]-NNN.md`**. DRAFT baru: `TC-ASO-JENNI-DRAFT-{timestamp}.md`.

Urutan tabel mengikuti **urutan pertama → terakhir dijalankan**.

Card terkait: [ETM-15350](https://erpintegration.atlassian.net/browse/ETM-15350), [ETM-15446](https://erpintegration.atlassian.net/browse/ETM-15446), [ETM-15605](https://erpintegration.atlassian.net/browse/ETM-15605). Home folder TC = All Sales Order.

Prefix folder: `ASO`.

| TC Code | Title | Status | Automated | Last Updated |
|---------|-------|--------|-----------|-------------|
| TC-ASO-001 | RECHECK ALL FAILED PROCESS — Trigger button recheck dari sidebar; verifikasi modal konfirmasi | draft | ❌ | 2026-08-19 |
| TC-ASO-002 | RECHECK ALL FAILED PROCESS — Eksekusi recheck; verifikasi background worker & notifikasi selesai | draft | ❌ | 2026-08-19 |
| TC-ASO-003 | RECHECK ALL FAILED PROCESS — Verifikasi log audit & perubahan error flag setelah recheck | draft | ❌ | 2026-08-19 |
| TC-ASO-004 | Memastikan Visibility, Counter & Posisi Pill Button Net Sales < COGS | **passed** | ✅ | 2026-08-20 |
| TC-ASO-005 | Memastikan Akurasi Filter Datalist saat Pill Net Sales < COGS Aktif (Positive Filter) | **passed** | ✅ | 2026-08-20 |
| TC-ASO-006 | Memastikan Deaktivasi Filter Pill (Toggle OFF) Mengembalikan Seluruh Data Sales Order | **passed** | ✅ | 2026-08-20 |
| TC-ASO-007 | Memastikan Interaksi Single-Active Toggle / Mutual Exclusive dengan Pill Button Lain | **passed** | ✅ | 2026-08-20 |
| TC-ASO-008 | Memastikan Kondisi Batas (Boundary: Net Sales == COGS, Net Sales > COGS, dan COGS = 0) Tidak Lolos Filter | **passed** | ✅ | 2026-08-20 |
| TC-ASO-009 | Memastikan Penanganan Empty State saat 0 Data Memenuhi Kriteria Filter Net Sales < COGS | **passed** | ✅ | 2026-08-20 |
| TC-ASO-010 | Memastikan Tampilan Icon Under Benchmark COGS (cogs-error) pada Kolom Error Flag & Baris Detail Item Order | **passed** | ✅ | 2026-08-20 |
| TC-ASO-011 | UI Visibility: Tombol Extract This Bundle hanya muncul pada SKU ter-flagging BUNDLE | draft | ❌ | 2026-08-21 |
| TC-ASO-012 | Extract SKU Bundle tipe Single pada Detail Sales Order | draft | ❌ | 2026-08-21 |
| TC-ASO-013 | Extract SKU Bundle tipe VARIANT pada Detail Sales Order | draft | ❌ | 2026-08-21 |
| TC-ASO-014 | Extract SKU Bundle tipe VARIANT RANDOM pada Detail Sales Order | draft | ❌ | 2026-08-21 |
| TC-ASO-015 | Extract SKU Bundle pada Sales Order dengan > 100 baris detail SKU | draft | ❌ | 2026-08-21 |

`TC-ASO-004` s/d `TC-ASO-010` — Dibuat untuk pengujian fitur Pill Filter `Net Sales < COGS` pada card origin [ETM-15446](https://erpintegration.atlassian.net/browse/ETM-15446).
`TC-ASO-011` s/d `05` — Dibuat oleh Jenni untuk pengujian fitur Extract This Bundle pada card origin [ETM-15605](https://erpintegration.atlassian.net/browse/ETM-15605).
