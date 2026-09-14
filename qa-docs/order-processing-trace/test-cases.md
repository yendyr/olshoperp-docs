# Test Case Plan — Order Processing Trace (ETM-15713)

**Modul:** SupplyChain → Report  
**Menu:** Order Processing Trace  
**Route:** `/supplychain/order-processing-trace`  
**Jira Card:** [ETM-15713](https://erpintegration.atlassian.net/browse/ETM-15713)  
**Status:** Ready for Review / Testing  
**Source of Truth:** [`_meta/sot/order-processing-trace-source-of-truth.md`](../_meta/sot/order-processing-trace-source-of-truth.md) v1.4  

---

## 1. Ringkasan Ruang Lingkup Pengujian

Test plan ini disusun berdasarkan requirement dan Acceptance Criteria (AC) pada card Jira **ETM-15713** serta dokumen Source of Truth (SoT). Pengujian mencakup:
1. **Hak Akses & Navigasi**: Menu hanya di SCM Report, single route, privilege `viewAny`, multi-company isolation.
2. **Datalist / Grid Display**: Urutan kolom wajib (9 kolom), format Ref | Date, fallback `-`, tooltip tanggal, aturan Trx Date vs Platform Date, Skip Wave Process No, dan hyperlink.
3. **Kardinalitas & Aturan Referensi**: Failed Ship & Outbound strictly single ref (maks 1 doc per SO, tanpa koma), edge case Picking–DO multi-ref (koma), dokumen soft-delete tidak muncul.
4. **Pencarian & Filter**: Default Trx Date bulan berjalan (sort DESC), Global Search, Advanced Filter (SearchBuilder), Column Show/Hide.
5. **Export Without Detail**: 1 baris = 1 SO (mirror grid), async vs this page, respect filter.
6. **Export With Detail**: 1 baris = 1 SO detail line (SKU), pengulangan header order, kolom produk & Bundle SKU, serta 4 skenario wajib (**Case A, Case B, Case C, Case D**).
7. **Non-Functional**: Async export non-blocking UI, performa grid, isolasi token company.

---

## 2. Tabel Test Case Plan

| No | Test Case ID | Modul / Kategori | Skenario Pengujian | Precondition & Test Data | Langkah Pengujian | Expected Result | Status |
|:--:|:------------:|:----------------:|:-------------------|:-------------------------|:------------------|:----------------|:------:|
| 1 | `TC-OPT-NAV-001` | Navigasi & Hak Akses | Verifikasi menu Order Processing Trace tampil di SupplyChain → Report dengan privilege `viewAny` | User login memiliki privilege `viewAny` untuk menu Order Processing Trace | 1. Buka sidebar menu.<br>2. Navigasi ke modul **SupplyChain → Report**.<br>3. Cari submenu **Order Processing Trace**. | Submenu **Order Processing Trace** tampil di bawah SupplyChain → Report dan dapat diakses (membuka halaman grid). | Draft |
| 2 | `TC-OPT-NAV-002` | Navigasi & Routing | Verifikasi tidak ada route atau entry menu Order Processing Trace di modul OmniChannel | User login memiliki akses OmniChannel & SCM | 1. Periksa sidebar OmniChannel.<br>2. Coba akses URL `/omni/order-processing-trace` secara langsung di browser. | 1. Tidak ada entry menu di sidebar OmniChannel.<br>2. Direct URL `/omni/order-processing-trace` mengembalikan 404 (Not Found). Sesuai keputusan single route `/supplychain/order-processing-trace`. | Draft |
| 3 | `TC-OPT-NAV-003` | Hak Akses & Keamanan | Verifikasi penolakan akses untuk user yang tidak memiliki privilege `viewAny` | User login tanpa privilege `viewAny` menu Order Processing Trace | Akses URL `/supplychain/order-processing-trace`. | Sistem menampilkan halaman 403 Forbidden atau toast peringatan hak akses dari Gate. | Draft |
| 4 | `TC-OPT-SEC-004` | Data Isolation | Verifikasi isolasi data order multi-company (Company Scope) | Siapkan data SO di Company A (`Dev Staging`) dan Company B (`FAT`) | 1. Login sebagai user Company A.<br>2. Buka menu Order Processing Trace.<br>3. Amati seluruh data yang tampil di grid. | Grid hanya menampilkan data Sales Order dan dokumen proses milik Company A. Data Company B tidak boleh muncul sama sekali. | Draft |
| 5 | `TC-OPT-GRID-005` | Tampilan Grid | Verifikasi penggabungan data Sales Order General dan Sales Order Platform dalam satu grid | Terdapat minimal 1 SO General dan 1 SO Platform pada company yang login | 1. Buka menu Order Processing Trace.<br>2. Periksa tipe data order yang tampil. | Data SO General dan SO Platform tampil bersamaan dalam satu datalist/grid tanpa perlu switch tab/filter khusus. | Draft |
| 6 | `TC-OPT-GRID-006` | Struktur Kolom | Verifikasi urutan 9 kolom wajib pada datalist Order Processing Trace | Data SO tersedia di grid | Buka menu dan amati urutan header tabel dari kiri ke kanan. | Urutan header tepat sesuai spesifikasi:<br>1. Trx Code \| Trx Platform<br>2. Trx Date \| Platform Date<br>3. Skip Wave Process No<br>4. Picking Ref \| Date<br>5. Checking Ref \| Date<br>6. Packing Ref \| Date<br>7. Delivery Order Ref \| Date<br>8. Failed Ship \| Date<br>9. Outbound \| Date | Draft |
| 7 | `TC-OPT-GRID-007` | Format Pasangan Kolom | Verifikasi format pasangan Ref \| Date dan fallback `-` saat data kosong | SO yang baru dibuat (belum diproses picking s/d outbound) | Amati baris SO baru pada kolom stage 4 s/d 9. | Kolom menampilkan kode ref di sisi kiri dan tanggal di sisi kanan. Jika stage belum dijalankan, kedua nilai menampilkan tanda strip `-`. | Draft |
| 8 | `TC-OPT-GRID-008` | Tooltip Tanggal | Verifikasi keberadaan dan teks tooltip pada header Trx Date dan Platform Date | Halaman grid Order Processing Trace terbuka | Hover mouse ke icon info/header pada kolom Trx Date dan Platform Date. | 1. Tooltip Trx Date menampilkan: *"Tanggal transaksi order. Order general: tanggal transaksi Sales Order. Order platform: tanggal order pertama kali tercatat di OlshopERP (created at)."*<br>2. Tooltip Platform Date menampilkan: *"Tanggal transaksi order di platform/marketplace. Hanya untuk order platform; order general menampilkan '-'."* | Draft |
| 9 | `TC-OPT-DATE-009` | Aturan Tanggal | Verifikasi aturan tanggal untuk tipe order General | SO bertipe General dengan `transaction_date` = 10-09-2026 | Cari dan amati baris SO General tersebut di grid. | 1. Kolom Trx Platform menampilkan `-`.<br>2. Kolom Platform Date menampilkan `-`.<br>3. Kolom Trx Date menampilkan `10-09-2026` (mengacu pada `transaction_date` internal SO). | Draft |
| 10 | `TC-OPT-DATE-010` | Aturan Tanggal | Verifikasi aturan tanggal untuk tipe order Platform | SO Platform dengan order date marketplace = 08-09-2026 dan masuk OlshopERP (`created_at`) = 09-09-2026 | Cari dan amati baris SO Platform tersebut di grid. | 1. Kolom Trx Platform menampilkan nomor order marketplace.<br>2. Kolom Trx Date menampilkan `09-09-2026` (`created_at` di OlshopERP).<br>3. Kolom Platform Date menampilkan `08-09-2026` (`transaction_date` marketplace). | Draft |
| 11 | `TC-OPT-GRID-011` | Skip Wave Column | Verifikasi kolom Skip Wave Process No untuk order jalur Skip Wave vs Jalur Reguler | 1 SO diproses via Skip Wave (`batch_code`: `SWP-20260901-001`) dan 1 SO via Unassign Wave reguler | Amati kolom Skip Wave Process No pada kedua order. | 1. Order Skip Wave: menampilkan nomor batch code `SWP-20260901-001`.<br>2. Order Reguler / Unassign Wave: menampilkan `-`. | Draft |
| 12 | `TC-OPT-CARD-012` | Kardinalitas Stage | Verifikasi kardinalitas Failed Ship (maksimal 1 dokumen FS, single ref tanpa koma) | SO yang memiliki transaksi Failed Ship (misal `FS-01`) | Amati kolom Failed Ship \| Date pada SO tersebut. | Menampilkan **single ref** `FS-01` beserta tanggalnya. Tidak boleh ada koma meskipun berisi multi SKU/partial. | Draft |
| 13 | `TC-OPT-CARD-013` | Kardinalitas Stage | Verifikasi kardinalitas Outbound (maksimal 1 dokumen Outbound, single ref tanpa koma) | SO yang telah dibuatkan Outbound (misal `OT-01`) | Amati kolom Outbound \| Date pada SO tersebut. | Menampilkan **single ref** `OT-01` beserta tanggalnya. Tidak boleh ada pemisahan koma (AS-IS guard: 1 SO = maks 1 Outbound). | Draft |
| 14 | `TC-OPT-CARD-014` | Kardinalitas Stage | Verifikasi tampilan edge-case multi-ref koma pada Picking s/d Delivery Order | SO yang mengalami re-process picking/packing (jika ada data historis multi-ref) | Amati kolom Picking / Checking / Packing / DO. | Jika terdapat lebih dari 1 ref pada stage picking s/d DO akibat re-process, kode ref dipisahkan tanda koma (`, `). | Draft |
| 15 | `TC-OPT-DATA-015` | Integritas Data | Verifikasi dokumen yang berstatus soft-delete tidak ditampilkan di grid | Siapkan SO yang dokumen picking/outbound-nya di-soft delete di database | Cari SO tersebut di grid Order Processing Trace. | Kolom stage dokumen yang ter-soft-delete tidak muncul dan menampilkan `-`. SO yang berstatus soft delete tidak muncul di datalist. | Draft |
| 16 | `TC-OPT-LINK-016` | Hyperlink Navigasi | Verifikasi hyperlink pada Trx Code dan setiap kode referensi dokumen proses | Order dengan status full flow (sudah ada ref picking s/d outbound) | 1. Klik Trx Code SO.<br>2. Klik kode ref Picking, Checking, Packing, DO, Failed Ship, Outbound. | 1. Trx Code membuka tab/halaman edit dokumen Sales Order terkait.<br>2. Setiap kode ref membuka tab/halaman edit dokumen sumber yang bersangkutan secara tepat. | Draft |
| 17 | `TC-OPT-FLTR-017` | Default Filter & Sort | Verifikasi default filter tanggal dan default sorting saat pertama kali halaman dimuat | Datalist dimuat pertama kali | Periksa filter tanggal dan urutan baris data. | 1. Filter Trx Date otomatis terpasang rentang awal s/d akhir bulan berjalan.<br>2. Sorting data default adalah Trx Date DESC (transaksi terbaru di atas). | Draft |
| 18 | `TC-OPT-FLTR-018` | Global Search | Verifikasi fungsi Global Search terhadap berbagai atribut dokumen | Data SO dan referensi proses tersedia | Lakukan pencarian di kolom Global Search menggunakan:<br>a. Trx Code SO<br>b. Trx Platform<br>c. Batch code Skip Wave<br>d. Kode ref Picking / DO / Outbound | Grid secara dinamis memfilter dan menampilkan baris data yang cocok dengan keyword pencarian. | Draft |
| 19 | `TC-OPT-FLTR-019` | Advanced Filter | Verifikasi Advanced Filter (SearchBuilder) dengan kombinasi multi-kriteria | Berbagai variasi data SO | Uji kombinasi filter SearchBuilder:<br>- Order Type (General / Platform)<br>- Store / Customer<br>- Range Platform Date<br>- Keberadaan Skip Wave No | Grid menampilkan data yang memenuhi seluruh kondisi filter gabungan secara akurat. | Draft |
| 20 | `TC-OPT-FLTR-020` | Column Visibility | Verifikasi fitur Columns Show/Hide pada tabel | Halaman grid terbuka | Buka modal/dropdown Column Visibility, lalu uncheck salah satu kolom (misal: Failed Ship). | Kolom yang di-uncheck disembunyikan dari grid. Saat di-check kembali, kolom tampil sesuai urutan semula. | Draft |
| 21 | `TC-OPT-EXP-021` | Export Without Detail | Verifikasi Export Without Detail menghasilkan data 1:1 mirror grid | Grid menampilkan data terfilter (misal 15 baris SO) | 1. Klik tombol **Export Without Detail**.<br>2. Pilih **This Page Only** atau **Export All**.<br>3. Buka file hasil download. | 1. Granularitas file: 1 baris = 1 Sales Order.<br>2. Jumlah baris sesuai dengan data terfilter.<br>3. Kolom dan data mirror 1:1 dengan grid (termasuk nilai `-` dan single ref FS/OB). | Draft |
| 22 | `TC-OPT-EXP-022` | Export With Detail | Verifikasi granularitas dan kolom wajib pada Export With Detail | SO dengan beberapa baris SKU detail | 1. Lakukan **Export With Detail**.<br>2. Buka file hasil export. | 1. Granularitas file: 1 baris = 1 SO detail line (SKU).<br>2. Header info order (Trx Code, Trx Date, dll) diulang pada setiap baris SKU.<br>3. Terdapat kolom produk wajib: **SKU**, **Product Name**, **Qty**, dan **Bundle SKU**. | Draft |
| 23 | `TC-OPT-CASE-023` | Export Detail (Case A) | **[Wajib] Case A**: SO 5 SKU — 2 SKU di Failed Ship (`FS-01`), 3 SKU di Outbound (`OT-01`) | Siapkan SO berisi 5 SKU: SKU-1 & SKU-2 diproses ke Failed Ship `FS-01`, SKU-3, SKU-4, SKU-5 diproses ke Outbound `OT-01` | Lakukan Export With Detail dan periksa baris ke-5 SKU tersebut. | 1. Header order: kolom Failed Ship menampilkan `FS-01` (single ref) dan Outbound menampilkan `OT-01` (single ref).<br>2. Baris detail SKU-1 & SKU-2: kolom Failed Ship = `FS-01`, kolom Outbound = `-`.<br>3. Baris detail SKU-3, SKU-4, & SKU-5: kolom Failed Ship = `-`, kolom Outbound = `OT-01`. | Draft |
| 24 | `TC-OPT-CASE-024` | Export Detail (Case B) | **[Wajib] Case B**: SO dengan produk Bundle yang meledak (explode) ke item child | SO berisi item Bundle induk `BDL-01` yang terdiri dari child `SKU-A` dan `SKU-B` | Lakukan Export With Detail dan periksa baris detail bundle. | 1. Setiap baris child bundle (`SKU-A` dan `SKU-B`) memiliki kolom **Bundle SKU** terisi kode bundle induk (`BDL-01`).<br>2. Produk non-bundle menampilkan `-` pada kolom Bundle SKU. | Draft |
| 25 | `TC-OPT-CASE-025` | Export Detail (Case C) | **[Wajib] Case C**: SO yang diproses melalui alur Skip Wave Process | SO yang diproses via Skip Wave (`batch_code`: `SWP-9901`) | Lakukan Export With Detail dan periksa baris data SO tersebut. | Kolom **Skip Wave Process No** terisi `SWP-9901` baik pada header order maupun di setiap baris detail produk SO tersebut. | Draft |
| 26 | `TC-OPT-CASE-026` | Export Detail (Case D) | **[Wajib] Case D**: 1 line SKU dengan qty partial — sebagian Failed Ship dan sebagian Outbound | SO memiliki 1 line SKU (misal `SKU-X`, qty 10). 4 pcs masuk Failed Ship `FS-02` dan 6 pcs masuk Outbound `OT-02` | Lakukan Export With Detail dan periksa baris untuk `SKU-X`. | **HANYA SATU BARIS** untuk `SKU-X` (tidak menduplikasi baris SKU). Pada baris yang sama, kolom Failed Ship terisi `FS-02` **DAN** kolom Outbound terisi `OT-02` (*both filled on same row*). | Draft |
| 27 | `TC-OPT-EXP-027` | Export Detail Integrity | Verifikasi tidak ada duplikasi baris untuk skenario multi outbound per SKU | SO yang telah diproses outbound | Periksa file Export With Detail. | Tidak ditemukan duplikasi baris untuk satu SKU yang sama dalam satu dokumen outbound (kepatuhan pada kardinalitas AS-IS 1 SO = maks 1 outbound). | Draft |
| 28 | `TC-OPT-NFR-028` | Non-Functional | Verifikasi background job asynchronous export tidak memblokir antarmuka pengguna (non-blocking UI) | Volume data SO terfilter cukup besar | Klik tombol Export All (With Detail / Without Detail). | 1. Tampil notifikasi/toast bahwa proses export sedang berjalan di background queue.<br>2. UI tidak freeze / terblokir; user tetap dapat menavigasi menu lain.<br>3. Saat selesai, status file menjadi *Ready to Download*. | Draft |
| 29 | `TC-OPT-NFR-029` | Performa & Responsivitas | Verifikasi waktu pemuatan datalist (P95 < 5s) pada rentang data default bulan berjalan | Dataset SO pada company aktif mencapai ratusan/ribuan transaksi | Buka menu Order Processing Trace dan ukur waktu render data. | Grid berhasil me-load dan merender data dalam waktu < 5 detik secara responsif tanpa error timeout. | Draft |

---

## 3. Matriks Keterlacakan (Traceability Matrix)

| Komponen Requirement (ETM-15713) | Test Case ID Terkait |
|-----------------------------------|----------------------|
| Akses Menu SCM Report & Privilege `viewAny` | `TC-OPT-NAV-001`, `TC-OPT-NAV-003` |
| Peniadaan Route / Menu OmniChannel | `TC-OPT-NAV-002` |
| Isolasi Data Multi-Company | `TC-OPT-SEC-004` |
| Gabungan SO General & Platform dalam Satu Grid | `TC-OPT-GRID-005` |
| Struktur & Urutan 9 Kolom Wajib | `TC-OPT-GRID-006`, `TC-OPT-GRID-007` |
| Tooltip Informasi Trx Date & Platform Date | `TC-OPT-GRID-008` |
| Logika Penentuan Tanggal (General vs Platform) | `TC-OPT-DATE-009`, `TC-OPT-DATE-010` |
| Tampilan Skip Wave Process No | `TC-OPT-GRID-011`, `TC-OPT-CASE-025` |
| Aturan Kardinalitas Single Ref (FS & Outbound) | `TC-OPT-CARD-012`, `TC-OPT-CARD-013` |
| Aturan Fallback Multi-Ref Koma (Picking s/d DO) | `TC-OPT-CARD-014` |
| Filter Dokumen Soft Delete | `TC-OPT-DATA-015` |
| Hyperlink Edit Dokumen Sumber | `TC-OPT-LINK-016` |
| Default Filter (Bulan Berjalan) & Default Sort (DESC) | `TC-OPT-FLTR-017` |
| Pencarian & Advanced Filter (SearchBuilder) | `TC-OPT-FLTR-018`, `TC-OPT-FLTR-019` |
| Column Visibility Control | `TC-OPT-FLTR-020` |
| Export Without Detail (1:1 Mirror Grid) | `TC-OPT-EXP-021` |
| Export With Detail: Format & Kolom Bundle SKU | `TC-OPT-EXP-022`, `TC-OPT-CASE-024` (Case B) |
| Export With Detail: Case A (Partial FS & OB) | `TC-OPT-CASE-023` (Case A) |
| Export With Detail: Case C (Skip Wave) | `TC-OPT-CASE-025` (Case C) |
| Export With Detail: Case D (Partial SKU Same Row) | `TC-OPT-CASE-026` (Case D) |
| Validasi Larangan Duplikasi Baris Multi Outbound | `TC-OPT-EXP-027` |
| Asynchronous Export & Performa Load Grid | `TC-OPT-NFR-028`, `TC-OPT-NFR-029` |
