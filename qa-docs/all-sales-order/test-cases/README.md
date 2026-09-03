# Test Cases — All Sales Order

Konvensi penamaan file: **`TC-ASO-NNN.md`**. DRAFT baru: `TC-ASO-DRAFT-{timestamp}.md`.

Card terkait: [ETM-15350](https://erpintegration.atlassian.net/browse/ETM-15350), [ETM-15446](https://erpintegration.atlassian.net/browse/ETM-15446), [ETM-15605](https://erpintegration.atlassian.net/browse/ETM-15605), [ETM-15637](https://erpintegration.atlassian.net/browse/ETM-15637), [ETM-15732](https://erpintegration.atlassian.net/browse/ETM-15732). Home folder TC = All Sales Order.

Prefix folder: `ASO`.

| TC Code | Title | Status | Jira | Assignee | Automated | Last Updated |
|---------|-------|--------|------|----------|-----------|-------------|
| TC-ASO-001 | RECHECK ALL FAILED PROCESS — Trigger button recheck dari sidebar; verifikasi modal konfirmasi | draft | - | - | ❌ | 2026-08-19 |
| TC-ASO-002 | RECHECK ALL FAILED PROCESS — Eksekusi recheck; verifikasi background worker & notifikasi selesai | draft | - | - | ❌ | 2026-08-19 |
| TC-ASO-003 | RECHECK ALL FAILED PROCESS — Verifikasi log audit & perubahan error flag setelah recheck | draft | - | - | ❌ | 2026-08-19 |
| TC-ASO-004 | Memastikan Visibility, Counter & Posisi Pill Button Net Sales < COGS | **passed** | [ETM-15446](https://erpintegration.atlassian.net/browse/ETM-15446) | - | ✅ | 2026-08-20 |
| TC-ASO-005 | Memastikan Akurasi Filter Datalist saat Pill Net Sales < COGS Aktif (Positive Filter) | **passed** | [ETM-15446](https://erpintegration.atlassian.net/browse/ETM-15446) | - | ✅ | 2026-08-20 |
| TC-ASO-006 | Memastikan Deaktivasi Filter Pill (Toggle OFF) Mengembalikan Seluruh Data Sales Order | **passed** | [ETM-15446](https://erpintegration.atlassian.net/browse/ETM-15446) | - | ✅ | 2026-08-20 |
| TC-ASO-007 | Memastikan Interaksi Single-Active Toggle / Mutual Exclusive dengan Pill Button Lain | **passed** | [ETM-15446](https://erpintegration.atlassian.net/browse/ETM-15446) | - | ✅ | 2026-08-20 |
| TC-ASO-008 | Memastikan Kondisi Batas (Boundary: Net Sales == COGS, Net Sales > COGS, dan COGS = 0) Tidak Lolos Filter | **passed** | [ETM-15446](https://erpintegration.atlassian.net/browse/ETM-15446) | - | ✅ | 2026-08-20 |
| TC-ASO-009 | Memastikan Penanganan Empty State saat 0 Data Memenuhi Kriteria Filter Net Sales < COGS | **passed** | [ETM-15446](https://erpintegration.atlassian.net/browse/ETM-15446) | - | ✅ | 2026-08-20 |
| TC-ASO-010 | Memastikan Tampilan Icon Under Benchmark COGS (cogs-error) pada Kolom Error Flag & Baris Detail Item Order | **passed** | [ETM-15446](https://erpintegration.atlassian.net/browse/ETM-15446) | - | ✅ | 2026-08-20 |
| TC-ASO-011 | UI Visibility: Tombol Extract This Bundle hanya muncul pada SKU ter-flagging BUNDLE | draft | [ETM-15605](https://erpintegration.atlassian.net/browse/ETM-15605) | - | ❌ | 2026-08-21 |
| TC-ASO-012 | Extract SKU Bundle tipe Single pada Detail Sales Order | draft | [ETM-15605](https://erpintegration.atlassian.net/browse/ETM-15605) | - | ❌ | 2026-08-21 |
| TC-ASO-013 | Extract SKU Bundle tipe VARIANT pada Detail Sales Order | draft | [ETM-15605](https://erpintegration.atlassian.net/browse/ETM-15605) | - | ❌ | 2026-08-21 |
| TC-ASO-014 | Extract SKU Bundle tipe VARIANT RANDOM pada Detail Sales Order | draft | [ETM-15605](https://erpintegration.atlassian.net/browse/ETM-15605) | - | ❌ | 2026-08-21 |
| TC-ASO-015 | Extract SKU Bundle pada Sales Order dengan > 100 baris detail SKU | draft | [ETM-15605](https://erpintegration.atlassian.net/browse/ETM-15605) | - | ❌ | 2026-08-21 |
| TC-ASO-016 | UI Visibility tombol "Extract this bundle" hanya muncul pada SKU yang ter-flagging sebagai BUNDLE | **passed** | [ETM-15637](https://erpintegration.atlassian.net/browse/ETM-15637) | - | ❌ | 2026-08-21 |
| TC-ASO-017 | Eksekusi "Extract this bundle" pada SKU Bundle tipe Single | **failed** | [ETM-15637](https://erpintegration.atlassian.net/browse/ETM-15637) | - | ❌ | 2026-08-21 |
| TC-ASO-018 | Eksekusi "Extract this bundle" pada SKU Bundle tipe VARIANT | **failed** | [ETM-15637](https://erpintegration.atlassian.net/browse/ETM-15637) | - | ❌ | 2026-08-21 |
| TC-ASO-019 | Eksekusi "Extract this bundle" pada SKU Bundle tipe VARIANT 'RANDOM' | **passed** | [ETM-15637](https://erpintegration.atlassian.net/browse/ETM-15637) | - | ❌ | 2026-08-21 |
| TC-ASO-020 | Ekstraksi bundle pada Sales Order dengan 100 baris detail SKU sehingga total baris > 100 rows | **failed** | [ETM-15637](https://erpintegration.atlassian.net/browse/ETM-15637) | - | ❌ | 2026-08-21 |
| TC-ASO-021 | [Penyuntingan Detail dan Penambahan SKU Pasca Ekstraksi Bundle](./TC-ASO-021.md) | draft | [ETM-15637](https://erpintegration.atlassian.net/browse/ETM-15637) | - | ❌ | 2026-08-27 |
| PENDING-20260902164801 | [Penolakan Extract SKU Bundle saat Price bernilai 0 (Price = 0)](./TC-ASO-DRAFT-20260902164801.md) | draft | [ETM-15734](https://erpintegration.atlassian.net/browse/ETM-15734) | Jeiniffer | ❌ | 2026-09-02 |
| PENDING-20260902164802 | [Ekstraksi SKU Bundle berhasil saat Price bernilai lebih dari 0 (Price > 0)](./TC-ASO-DRAFT-20260902164802.md) | draft | [ETM-15735](https://erpintegration.atlassian.net/browse/ETM-15735) | OlshopERP | ❌ | 2026-09-02 |
| PENDING-20260902164803 | [Boundary test Price desimal sangat kecil (0.0001) vs Price negatif (-1000)](./TC-ASO-DRAFT-20260902164803.md) | draft | [ETM-15736](https://erpintegration.atlassian.net/browse/ETM-15736) | Jeiniffer | ❌ | 2026-09-02 |
| PENDING-20260902164804 | [Multi-bundle dalam 1 order dengan kombinasi Price = 0 dan Price > 0](./TC-ASO-DRAFT-20260902164804.md) | draft | [ETM-15737](https://erpintegration.atlassian.net/browse/ETM-15737) | OlshopERP | ❌ | 2026-09-02 |
| PENDING-20260902164805 | [Verifikasi regresi guard status order (Approved / Void) pada SKU Bundle berharga valid](./TC-ASO-DRAFT-20260902164805.md) | draft | [ETM-15738](https://erpintegration.atlassian.net/browse/ETM-15738) | Jeiniffer | ❌ | 2026-09-02 |
| PENDING-20260902164806 | [Lifecycle Booking Order: Tertahan saat Price = 0 dan Berhasil setelah Convert (Price > 0)](./TC-ASO-DRAFT-20260902164806.md) | draft | [ETM-15739](https://erpintegration.atlassian.net/browse/ETM-15739) | OlshopERP | ❌ | 2026-09-02 |

`TC-ASO-004` s/d `TC-ASO-010` — Dibuat untuk pengujian fitur Pill Filter `Net Sales < COGS` pada card origin [ETM-15446](https://erpintegration.atlassian.net/browse/ETM-15446).  
`TC-ASO-011` s/d `TC-ASO-015` — Dibuat untuk pengujian fitur Extract This Bundle pada card origin [ETM-15605](https://erpintegration.atlassian.net/browse/ETM-15605).  
`TC-ASO-016` s/d `TC-ASO-021` — Dibuat untuk pengujian fitur Extract This Bundle pada card origin [ETM-15637](https://erpintegration.atlassian.net/browse/ETM-15637).  
`PENDING-20260902164801` s/d `PENDING-20260902164806` — Dibuat untuk validasi Price > 0 pada tombol Extract Bundle pada card origin [ETM-15732](https://erpintegration.atlassian.net/browse/ETM-15732).
