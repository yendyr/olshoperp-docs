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

| TC Code | Judul Test Case | File | Status |
|---|---|---|---|
| `TC-SPLG-025` | Void & Clone Order Sales Platform — Tipe Order Baru Tetap Sales Platform & Mempertahankan Platform Order ID | [`TC-SPLG-025.md`](./TC-SPLG-025.md) | DRAFT 🟡 |
| `TC-SPLG-026` | Verifikasi Halaman Datalist & Detail Sales Platform untuk Order Hasil Void & Clone | [`TC-SPLG-026.md`](./TC-SPLG-026.md) | DRAFT 🟡 |
| `TC-SPLG-027` | Fitur Re-sync Marketplace pada Order Sales Platform Hasil Void & Clone | [`TC-SPLG-027.md`](./TC-SPLG-027.md) | DRAFT 🟡 |
| `TC-SPLG-028` | Regresi Pemrosesan Void & Clone untuk Sales Order Internal / General (Non-Platform) | [`TC-SPLG-028.md`](./TC-SPLG-028.md) | DRAFT 🟡 |
| `TC-SPLG-029` | End-to-End Processing Order Sales Platform Hasil Void & Clone (Send to Default Waves hingga Shipped) | [`TC-SPLG-029.md`](./TC-SPLG-029.md) | DRAFT 🟡 |

### ETM-15749 — [Dev - Sales Platform] Edit detail sebelum approve (add/replace SKU, price, VAT; no delete)

| TC Code | Judul Test Case | File | Status |
|---|---|---|---|
| `TC-SPLG-030` | Edit Detail Sales Order Platform pada Status DRAFT | [`TC-SPLG-030.md`](./TC-SPLG-030.md) | DRAFT 🟡 |
| `TC-SPLG-031` | Edit Detail Sales Order Platform pada Status OPEN | [`TC-SPLG-031.md`](./TC-SPLG-031.md) | DRAFT 🟡 |
| `TC-SPLG-032` | Guard Read-Only Detail Sales Order Platform pada Status APPROVED | [`TC-SPLG-032.md`](./TC-SPLG-032.md) | DRAFT 🟡 |
| `TC-SPLG-033` | Add Product via Select Product Modal pada Sales Order Platform | [`TC-SPLG-033.md`](./TC-SPLG-033.md) | DRAFT 🟡 |
| `TC-SPLG-034` | Validasi Produk Non-Aktif pada Select Product Modal | [`TC-SPLG-034.md`](./TC-SPLG-034.md) | DRAFT 🟡 |
| `TC-SPLG-035` | Tambah Produk Bundle & Random SKU via Select Product Modal | [`TC-SPLG-035.md`](./TC-SPLG-035.md) | DRAFT 🟡 |
| `TC-SPLG-036` | Validasi Batas Maksimal 100 Line Detail pada Sales Order Platform | [`TC-SPLG-036.md`](./TC-SPLG-036.md) | DRAFT 🟡 |
| `TC-SPLG-037` | Replace SKU Produk pada Detail Sales Order Platform | [`TC-SPLG-037.md`](./TC-SPLG-037.md) | DRAFT 🟡 |
| `TC-SPLG-038` | Edit Valid Qty (>0) dan Recalculation Detail SO Platform | [`TC-SPLG-038.md`](./TC-SPLG-038.md) | DRAFT 🟡 |
| `TC-SPLG-039` | Validasi Penolakan Edit Qty <= 0 pada SO Platform | [`TC-SPLG-039.md`](./TC-SPLG-039.md) | DRAFT 🟡 |
| `TC-SPLG-040` | Edit Unit Price & Discount beserta Recalculation DPP dan Total | [`TC-SPLG-040.md`](./TC-SPLG-040.md) | DRAFT 🟡 |
| `TC-SPLG-041` | Edit VAT Rate berdasarkan System Product dan Store Auto Add VAT | [`TC-SPLG-041.md`](./TC-SPLG-041.md) | DRAFT 🟡 |
| `TC-SPLG-042` | No Row Delete Guard pada Detail Sales Order Platform | [`TC-SPLG-042.md`](./TC-SPLG-042.md) | DRAFT 🟡 |
| `TC-SPLG-043` | Exception Extract Bundle pada Detail Sales Order Platform | [`TC-SPLG-043.md`](./TC-SPLG-043.md) | DRAFT 🟡 |
| `TC-SPLG-044` | Sync Marketplace Refresh Field yang Belum Di-edit User | [`TC-SPLG-044.md`](./TC-SPLG-044.md) | DRAFT 🟡 |
| `TC-SPLG-045` | Sync Lock Matrix - Proteksi Field Detail yang Sudah Di-save User | [`TC-SPLG-045.md`](./TC-SPLG-045.md) | DRAFT 🟡 |
| `TC-SPLG-046` | Sync Lock Matrix - Booking Order dengan Price = 0 | [`TC-SPLG-046.md`](./TC-SPLG-046.md) | DRAFT 🟡 |
| `TC-SPLG-047` | Sync Lock Matrix - Booking Order dengan Price > 0 | [`TC-SPLG-047.md`](./TC-SPLG-047.md) | DRAFT 🟡 |
| `TC-SPLG-048` | Sync Lock Matrix - Perlindungan Baris Detail Manual Murni System | [`TC-SPLG-048.md`](./TC-SPLG-048.md) | DRAFT 🟡 |
| `TC-SPLG-049` | Set Flag prevent_auto_approve = 1 Saat Detail SO Di-edit | [`TC-SPLG-049.md`](./TC-SPLG-049.md) | DRAFT 🟡 |
| `TC-SPLG-050` | Pencatatan Audit Log Perubahan Detail Sales Order Platform | [`TC-SPLG-050.md`](./TC-SPLG-050.md) | DRAFT 🟡 |
| `TC-SPLG-051` | Paritas Perilaku Edit SO Platform via All Sales Order (ASO) | [`TC-SPLG-051.md`](./TC-SPLG-051.md) | DRAFT 🟡 |
| TC-SPLG-052 | Pembentukan Komponen Bundle & Detail Tree Saat Binding Platform Product via Single Binding | draft | [ETM-15945](https://erpintegration.atlassian.net/browse/ETM-15945) | Alvin | ❌ | 2026-09-16 |
| TC-SPLG-053 | Pembentukan Komponen Bundle & Detail Tree Saat Binding Platform Product via Bulk Binding | draft | [ETM-15945](https://erpintegration.atlassian.net/browse/ETM-15945) | Alvin | ❌ | 2026-09-16 |
| TC-SPLG-054 | Pembentukan Komponen Bundle & Detail Tree Saat Binding Platform Product via Scheduler Auto Binding Hourly | draft | [ETM-15945](https://erpintegration.atlassian.net/browse/ETM-15945) | Alvin | ❌ | 2026-09-16 |
| TC-SPLG-055 | Pembentukan Komponen Bundle & Detail Tree Saat Auto Binding pada Proses Pull Product Platform | draft | [ETM-15945](https://erpintegration.atlassian.net/browse/ETM-15945) | Alvin | ❌ | 2026-09-16 |
| TC-SPLG-056 | Verifikasi Regresi Binding Platform Product ke Master System Product Non-Bundle | draft | [ETM-15945](https://erpintegration.atlassian.net/browse/ETM-15945) | Alvin | ❌ | 2026-09-16 |
| TC-SPLG-057 | Verifikasi Remediasi Data Fix untuk Order Platform Existing Terdampak di Server Merdian | draft | [ETM-15945](https://erpintegration.atlassian.net/browse/ETM-15945) | Alvin | ❌ | 2026-09-16 |

### ETM-15859 / ETM-15798 / ETM-15971 — Void vs Void & Recreate platform orders (anti auto re-create)

| TC Code | Judul Test Case | File | Status |
|---|---|---|---|
| `TC-SPLG-018` | Verifikasi Void Murni Tanpa Prefix Platform Order ID pada Status APPROVED | [`TC-SPLG-018.md`](./TC-SPLG-018.md) | PASSED 🟢 |
| `TC-SPLG-019` | Verifikasi Sync Gate Anti Auto-Create SO Baru pada Order Void Ber-ID Asli | [`TC-SPLG-019.md`](./TC-SPLG-019.md) | PASSED 🟢 |
| `TC-SPLG-020` | Verifikasi Tombol dan Aksi Recreate pada Halaman Show SO Void | [`TC-SPLG-020.md`](./TC-SPLG-020.md) | PASSED 🟢 |
| `TC-SPLG-021` | Verifikasi Penanganan Prefix Bertingkat (void-2-) pada Multiple Recreate | [`TC-SPLG-021.md`](./TC-SPLG-021.md) | BLOCKED ⛔ |
| `TC-SPLG-022` | Verifikasi Aksi Void & Recreate Langsung dari Dialog Void | [`TC-SPLG-022.md`](./TC-SPLG-022.md) | SKIPPED ⚪ |
| `TC-SPLG-023` | Verifikasi Alur Void & Recreate pada Menu All Sales Order | [`TC-SPLG-023.md`](./TC-SPLG-023.md) | PASSED 🟢 |
| `TC-SPLG-024` | Verifikasi Paritas Alur Void Only pada Menu All Sales Order | [`TC-SPLG-024.md`](./TC-SPLG-024.md) | PASSED 🟢 |

### ETM-15893 — [Sales Platform / Sales Order] Order Lifecycle panel (Platform ≠ General)

Origin Card: [ETM-15893](https://erpintegration.atlassian.net/browse/ETM-15893)

| TC Code | Judul Test Case | File | Status |
|---|---|---|---|
| `TC-SOP-ORDLSC-01` | Entry Point Navigasi Form Edit dan Pembukaan Slideover Order Lifecycle XL | [`TC-SOP-ORDLSC-01.md`](./TC-SOP-ORDLSC-01.md) | PASSED 🟢 |
| `TC-SOP-ORDLSC-02` | Tampilan Layout dan Persona Mode Sales Platform pada Order Lifecycle | [`TC-SOP-ORDLSC-02.md`](./TC-SOP-ORDLSC-02.md) | PASSED 🟢 |
| `TC-SOP-ORDLSC-03` | Tampilan Layout dan Persona Mode Sales Order General pada Order Lifecycle | [`TC-SOP-ORDLSC-03.md`](./TC-SOP-ORDLSC-03.md) | PASSED 🟢 |
| `TC-SOP-ORDLSC-04` | Kalkulasi dan Integritas Strip Quantity dan Strip Money pada Order Lifecycle | [`TC-SOP-ORDLSC-04.md`](./TC-SOP-ORDLSC-04.md) | FAILED 🔴 |
| `TC-SOP-ORDLSC-05` | Card Dokumen Transaksi Terkait (Related Transactions) dan Validasi Hyperlink | [`TC-SOP-ORDLSC-05.md`](./TC-SOP-ORDLSC-05.md) | FAILED 🔴 |
| `TC-SOP-ORDLSC-06` | Humanized Wording pada Section What Held This Order Up | [`TC-SOP-ORDLSC-06.md`](./TC-SOP-ORDLSC-06.md) | PASSED 🟢 |
| `TC-SOP-ORDLSC-07` | Fungsionalitas Print Order Lifecycle dan Keselarasan Data Cetak | [`TC-SOP-ORDLSC-07.md`](./TC-SOP-ORDLSC-07.md) | FAILED 🔴 |
| `TC-SOP-ORDLSC-08` | Pembukaan Order Lifecycle pada Status Terminal VOID / REJECTED dan Status Awal (DRAFT / OPEN) | [`TC-SOP-ORDLSC-08.md`](./TC-SOP-ORDLSC-08.md) | PASSED 🟢 |
| `TC-SOP-ORDLSC-09` | Penanganan Order dengan Failed Ship (Partial FS dan Full FS) pada Strip Quantity dan Money | [`TC-SOP-ORDLSC-09.md`](./TC-SOP-ORDLSC-09.md) | PASSED 🟢 |
| `TC-SOP-ORDLSC-10` | Penanganan Retur Pasca-Settlement dan Pembentukan Credit Note (CN) pada Money Trail | [`TC-SOP-ORDLSC-10.md`](./TC-SOP-ORDLSC-10.md) | PASSED 🟢 |
| `TC-SOP-ORDLSC-11` | Penanganan Selisih Pembayaran (Under/Overpayment) dengan Penyesuaian Adjustment dan Debit/Credit Note pada Card AR | [`TC-SOP-ORDLSC-11.md`](./TC-SOP-ORDLSC-11.md) | PASSED 🟢 |
| `TC-SOP-ORDLSC-12` | Breakdown Rincian Nilai Sales Invoice (Line Items + Other Cost - Other Discount = Total Invoice) | [`TC-SOP-ORDLSC-12.md`](./TC-SOP-ORDLSC-12.md) | PASSED 🟢 |


### ETM-16030 — [Sales Platform] - Order Lifecycle slideover xl, data real, timeline link

Origin Card: [ETM-16030](https://erpintegration.atlassian.net/browse/ETM-16030)

| TC Code | Judul Test Case | File | Status |
|---|---|---|---|
| `TC-SOP-16030-01` | T01: Verifikasi Order Lifecycle Slideover XL pada Order Normal Fulfilled & Invoiced (Delivered) | [`TC-SOP-16030-01.md`](./TC-SOP-16030-01.md) | DRAFT ⚪ |
| `TC-SOP-16030-02` | T02: Verifikasi Order Lifecycle Slideover XL pada Order dengan Failed Ship | [`TC-SOP-16030-02.md`](./TC-SOP-16030-02.md) | DRAFT ⚪ |
| `TC-SOP-16030-03` | T03: Verifikasi Order Lifecycle Slideover XL pada Order dengan Sales Return | [`TC-SOP-16030-03.md`](./TC-SOP-16030-03.md) | DRAFT ⚪ |
| `TC-SOP-16030-04` | T04: Verifikasi Order Lifecycle Slideover XL pada Order Status Awal (Draft / Open) | [`TC-SOP-16030-04.md`](./TC-SOP-16030-04.md) | DRAFT ⚪ |

### ETM-16274 — [Sales Order] - Optimize slow query pencarian multi-value Code (LIKE) di datalist

Origin Card: [ETM-16274](https://erpintegration.atlassian.net/browse/ETM-16274) · TC per card turunan (ETM-16382, 16384, 16386, 16358, 16356, 16354)

| TC Code | Judul Test Case | File | Status |
|---|---|---|---|
| `TC-OSP-CODEEQ-001` | Filter Trx. Code = (equals) paste 50 kode SO tampil cepat dan lengkap ([ETM-16382](https://erpintegration.atlassian.net/browse/ETM-16382)) | [`TC-OSP-CODEEQ-001.md`](./TC-OSP-CODEEQ-001.md) | FAILED 🔴 |
| `TC-OSP-TRXCONT-001` | Filter Trx. Code Contains potongan pendek/panjang dan paste 500 kode ([ETM-16384](https://erpintegration.atlassian.net/browse/ETM-16384)) | [`TC-OSP-TRXCONT-001.md`](./TC-OSP-TRXCONT-001.md) | PASSED 🟢 |
| `TC-OSP-TRXCOND-001` | Kondisi filter Trx. Code lain dan logika OR sama seperti sebelum optimasi ([ETM-16386](https://erpintegration.atlassian.net/browse/ETM-16386)) | [`TC-OSP-TRXCOND-001.md`](./TC-OSP-TRXCOND-001.md) | FAILED 🔴 |
| `TC-OSP-POIDCOND-001` | Kondisi filter Platform Order Id lain dan logika OR sama seperti sebelum optimasi ([ETM-16358](https://erpintegration.atlassian.net/browse/ETM-16358)) | [`TC-OSP-POIDCOND-001.md`](./TC-OSP-POIDCOND-001.md) | FAILED 🔴 |
| `TC-OSP-POIDCONT-001` | Filter Platform Order Id Contains potongan pendek/panjang dan paste 500 ID ([ETM-16356](https://erpintegration.atlassian.net/browse/ETM-16356)) | [`TC-OSP-POIDCONT-001.md`](./TC-OSP-POIDCONT-001.md) | FAILED 🔴 |
| `TC-OSP-POIDEQ-001` | Filter Platform Order Id = (equals) paste 50/100 ID cepat dan lengkap ([ETM-16354](https://erpintegration.atlassian.net/browse/ETM-16354)) | [`TC-OSP-POIDEQ-001.md`](./TC-OSP-POIDEQ-001.md) | PASSED 🟢 |

### ETM-16115 — [Sales Order Platform] - Prevent Auto Approve jadi YES saat detail OPEN diedit

Origin Card: [ETM-16115](https://erpintegration.atlassian.net/browse/ETM-16115)

| TC Code | Judul Test Case | File | Status |
|---|---|---|---|
| `TC-SOP-PAA-001` | Prevent Auto Approve jadi YES saat detail SO Platform OPEN diedit (Unit Price / System SKU) + Audit Log old/new | [`TC-SOP-PAA-001.md`](./TC-SOP-PAA-001.md) | PASSED 🟢 |

### ETM-16429 — [Sales Order] Negative: Void/Closed tidak tersedia bila outbound sudah Approved

Origin Card: [ETM-16429](https://erpintegration.atlassian.net/browse/ETM-16429) · card asal [ETM-16276](https://erpintegration.atlassian.net/browse/ETM-16276)

| TC Code | Judul Test Case | File | Status |
|---|---|---|---|
| `TC-SPLG-058` | Negative: tombol Void/Closed tidak tersedia pada SO Platform yang sudah punya Mutation Outbound Approved | [`TC-SPLG-058.md`](./TC-SPLG-058.md) | PASSED 🟢 dengan catatan (run 16-10-2026, dikoreksi 19-10-2026) |

### ETM-16428 — [Sales Order] - Happy: datalist cepat + Void masih tersedia untuk SO tanpa outbound approved

Origin Card: [ETM-16428](https://erpintegration.atlassian.net/browse/ETM-16428) · card asal [ETM-16276](https://erpintegration.atlassian.net/browse/ETM-16276)

| TC Code | Judul Test Case | File | Status |
|---|---|---|---|
| `TC-SPLG-059` | Happy: datalist Sales Order muat cepat dan tombol Void tetap tersedia untuk SO tanpa outbound Approved | [`TC-SPLG-059.md`](./TC-SPLG-059.md) | PASSED 🟢 dengan catatan (19-10-2026) |

### ETM-16623 — [Sales Order] - Negative: Void/Closed di halaman edit diblokir validasi bila outbound sudah Approved

Origin Card: [ETM-16623](https://erpintegration.atlassian.net/browse/ETM-16623) · turunan [ETM-16429](https://erpintegration.atlassian.net/browse/ETM-16429) · temuan [ETM-16625](https://erpintegration.atlassian.net/browse/ETM-16625), [ETM-16626](https://erpintegration.atlassian.net/browse/ETM-16626)

| TC Code | Judul Test Case | File | Status |
|---|---|---|---|
| `TC-SPLG-060` | Negative: klik Void dan Closed di halaman edit SO yang sudah punya outbound Approved diblokir validasi dengan notifikasi | [`TC-SPLG-060.md`](./TC-SPLG-060.md) | PASSED 🟢 (19-10-2026) |

### ETM-16431 — [Sales Order] - Permission: tanpa izin Void tombol Void tidak muncul meski SO eligible

Origin Card: [ETM-16431](https://erpintegration.atlassian.net/browse/ETM-16431) · card asal [ETM-16276](https://erpintegration.atlassian.net/browse/ETM-16276) · akun uji: lihat `tests/TEST-ACCOUNTS.md`

| TC Code | Judul Test Case | File | Status |
|---|---|---|---|
| `TC-SPLG-061` | Permission: user tanpa izin Void dan Approve tidak melihat tombol Void di datalist maupun halaman edit meski SO eligible | [`TC-SPLG-061.md`](./TC-SPLG-061.md) | PASSED 🟢 (19-10-2026) |
