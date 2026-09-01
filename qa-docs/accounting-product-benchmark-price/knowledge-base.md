---
doc_type: knowledge-base
menu: accounting-product-benchmark-price
menu_name: "Benchmark COGS"
version: 1.4
last_updated: 2026-09-01
owner: QA - Yemima
status: review
audience: operator
aliases: [Benchmark COGS, HPP Acuan, COGS benchmark menu, Below Benchmark COGS, Manual COGS, Manual COGS Expiry, Bundle Sum, Highest Bundle Variant, Product Bundle]
sections:
  core: [what-is, how-to-read, manual-cogs, product-bundle, calculate, show-detail, integration, troubleshooting, faq]
---

# Benchmark COGS — Knowledge Base

## 1. Apa itu Benchmark COGS?

Menu **Finance Accounting → Report → Benchmark COGS** menampilkan **nilai acuan HPP** per System Product — bukan stok accounting, melainkan referensi operasional harian.

| Item | Nilai |
|------|-------|
| Route | `/accounting/product-benchmark-price` |
| Update otomatis | Setiap hari **00:00 WIB** |
| COGS dari rumus | Highest Price (30 hari) → Last Inbound → 0 · **paket Bundle** → jumlah komponen (TO-BE) |
| Override manual (TO-BE) | Kolom **Manual COGS** + **Manual COGS Expiry** — lihat §3 |

**Dipakai untuk:**

1. **Stock Opname** — harga default saat stok surplus jika Anda tidak isi harga manual  
2. **Sales Order** — kolom Benchmark COGS (snapshot) + cek margin auto-approval  
3. **Monitoring** — lihat COGS per SKU + riwayat perubahan (Calculate Log)

---

## 2. Cara membaca datalist

| Kolom | Arti |
|-------|------|
| **System Product SKU / Name** | Produk internal |
| **Type** | Single · Parent (header variant) · Variant (child) |
| **Retail Price** | Harga jual master saat ini |
| **COGS** | Nilai acuan HPP **efektif** (hasil rumus, atau Manual COGS jika override aktif) |
| **Manual COGS** (TO-BE) | Override yang Anda set — kosong = pakai rumus |
| **Manual COGS Expiry** (TO-BE) | Batas berlaku override; kosong = permanen sampai Manual COGS dikosongkan |
| **Description** | **Highest Price** · **Last Inbound** · **No Inbound** · **Manual Input** · **Bundle Sum** · **Highest Bundle Variant** (dua terakhir TO-BE) |
| **COGS Last Updated** | Kapan baris ini terakhir di-update |

### Description — maksudnya apa?

| Label | Arti |
|-------|------|
| **Highest Price** | Ada transaksi masuk stok valid dalam **30 hari terakhir** — sistem ambil harga **tertinggi** (sebelum pajak) |
| **Last Inbound** | Tidak ada transaksi 30 hari terakhir — ambil harga transaksi **terakhir** sebelum periode itu |
| **No Inbound** | Belum ada transaksi valid — COGS = **0** |
| **Manual Input** | COGS sedang di-override lewat **Manual COGS** (belum expired) |
| **Bundle Sum** (TO-BE) | Header **Product Bundle** — COGS = jumlah acuan komponen × qty di resep paket |
| **Highest Bundle Variant** (TO-BE) | Header Bundle **random** — ambil nilai tertinggi dari sibling header paket (bukan dari detail) |

### Sumber data rumus (per 2026-07-09)

Sistem menghitung dari **empat jenis transaksi** approved (Price Before VAT) untuk SKU biasa:

| Sumber | Menu |
|--------|------|
| Purchase Inbound (PO) | Mutation Inbound dari PO |
| Stock Addition | Adjustment Addition (manual) |
| Stock Opname IN | Penambahan otomatis dari Stock Opname surplus |
| Opening Stock | Penambahan otomatis dari Opening Stock |

Header **Product Bundle** biasanya **tidak** punya transaksi itu — makanya pakai Bundle Sum (lihat §3b).

---

## 3. Manual COGS (TO-BE — belum live)

Untuk kasus khusus (koreksi, promo, temporary cost), Anda bisa set **Manual COGS** agar kolom **COGS** menampilkan nilai itu, bukan rumus (termasuk bukan Bundle Sum).

| Aturan | Arti untuk operator |
|--------|---------------------|
| Manual terisi + belum expired | **COGS** = Manual; Description = **Manual Input** |
| **Manual COGS Expiry** kosong | Override **permanen** sampai Anda kosongkan Manual COGS |
| Expiry diisi (DD-MM-YYYY) | Berlaku sampai akhir hari itu (**23:59:59 WIB**), lalu kembali ke rumus |
| Kosongkan Manual COGS | Langsung kembali ke rumus (tidak perlu tunggu expiry) |
| Nilai **0** | Boleh — artinya Anda sengaja set COGS = 0 |
| Nilai negatif | Tidak boleh |
| Siapa yang bisa di-edit | **Single** dan **Variant** saja (termasuk header paket Bundle) — **Parent** tidak bisa |
| Import massal | Excel 3 kolom: **SKU Code** \| **Manual COGS** \| **Manual COGS Expiry** |

### Contoh singkat

| Situasi | Manual COGS | Expiry | Yang terlihat di COGS |
|---------|-------------|--------|------------------------|
| Override tetap | 15000 | (kosong) | 15000 · Manual Input |
| Override sampai akhir tahun | 0 | 31-12-2026 | 0 · Manual Input |
| Kembali ke rumus | (dikosongkan) | — | Highest Price / Last Inbound / No Inbound / Bundle Sum / … |

**Cara edit:** inline seperti Price List, atau **Import** template. Setiap set/clear tercatat di **Calculate Log** dan memperbarui Updated by / COGS Last Updated.

> Status: requirement sudah disetujui (v1.3); di produksi saat ini menu masih **read-only** rumus — tunggu rilis fitur.

---

## 3b. Product Bundle — COGS paket (TO-BE)

Paket (**Product Bundle**) tidak punya stok sendiri dan tidak masuk pembelian/opname sebagai header. Acuan COGS-nya digabung dari **komponen** di resep paket.

| Situasi | Yang terjadi |
|---------|----------------|
| Header paket biasa (bukan random) | COGS = jumlah (COGS tiap komponen × qty di resep) · Description **Bundle Sum** |
| Header paket **random** | Tidak hitung detail — ambil **tertinggi** dari sibling header paket · **Highest Bundle Variant** |
| Komponen di resep yang random | Pakai COGS komponen itu dulu (sudah mengikuti sibling), baru dijumlah |
| Qty komponen lebih dari 1 | Dikalikan — mis. 100.000 × 2 = 200.000 ke total |
| Manual COGS di header paket | Tetap boleh — angka Manual yang dipakai, bukan jumlah komponen |
| **Barang rakitan / BOM** (bisa distok) | **Bukan** paket — COGS seperti produk biasa dari transaksi masuk stok |

### Contoh cepat (paket keyboard)

- Blue: keyboard biru 650rb + alas 50rb + mouse biru 130rb → **830rb** (Bundle Sum)  
- White → **835rb** · Random header paket → **835rb** (tertinggi sibling)  
- Manual 900rb di Blue → tampil **900rb** (Manual Input)

Detail aturan: [requirement §3.6](./requirement.md#36-product-bundle-header-to-be-v14).

---

## 4. Toggle Show Detail

| Show Detail | Baris yang tampil |
|-------------|-------------------|
| **Off (default)** | **Single** + **Parent** saja |
| **On** | Termasuk semua **Variant** (child SKU) |

Gunakan **On** jika perlu cek COGS per varian (mis. Warna/Ukuran) atau edit Manual COGS per variant.

---

## 5. Tombol Calculate (manual)

Setiap baris punya aksi **Calculate** (icon sync):

- Menghitung ulang COGS **rumus** untuk SKU tersebut (+ variant terkait jika parent)  
- Berguna setelah transaksi masuk stok baru approved — tidak perlu tunggu midnight  
- Jika **Manual COGS** masih aktif, nilai **COGS** efektif tetap Manual (job tidak menimpa override)  
- Untuk **paket Bundle**, pastikan komponen sudah terhitung dulu (job harian sudah mengurutkan ini)  
- Proses berjalan di background — **refresh halaman** setelah beberapa detik jika nilai belum berubah

**Calculate Log** (toolbar): buka riwayat perubahan COGS (nilai lama → baru, tanggal, aksi System/manual/import).

---

## 6. Integrasi ke menu lain

### Sales Order (General & Platform)

Di **detail order**, kolom (default **hidden** — aktifkan lewat column picker):

| Kolom | Fungsi |
|-------|--------|
| **Price Before VAT** | Harga jual satuan sebelum pajak |
| **Benchmark COGS** | Snapshot COGS **saat order dibuat** — tidak ikut berubah meskipun master COGS berubah |

Jika **Price Before VAT** (nilai setara primary currency) **lebih kecil** dari Benchmark COGS yang tersimpan di line, order **tidak ikut schedule auto-approve** — tetap bisa di-approve manual.

**Error Flag (TO-BE improve):** label **Below Benchmark COGS** — icon merah di kolom Error Flag (header order + baris SKU yang under). Bisa di-filter lewat advanced filter Error Flag.

Detail: [requirement §6.4–§6.5](./requirement.md#64-auto-approval-validation) · [Sales Platform](../omni-sales-platform/knowledge-base.md) · [Sales Order](../sales-order-general/knowledge-base.md) · [All Sales Order](../all-sales-order/knowledge-base.md)

### Stock Opname

- **Konsumen:** surplus tanpa input harga → pakai COGS dari menu ini sebagai default  
- **Sumber (v1.1):** transaksi opname IN yang approve **bisa mempengaruhi** benchmark pada perhitungan berikutnya

### Stock Addition & Opening Stock

Transaksi penambahan stok manual (Addition) dan Opening Stock — setelah approve — **ikut** menjadi sumber nilai benchmark.

### Product Bundle & Random SKU

- **Header paket (master, TO-BE):** Bundle Sum / Highest Bundle Variant — §3b  
- **Di Sales Order:** snapshot mengikuti aturan binding/line (sering parent/header) — nilai master header setelah v1.4 sudah dari jumlah komponen  
- **Random SKU biasa (bukan header paket):** di master, variant random **mengikuti** COGS sibling/parent — [Random SKU](../random-sku/knowledge-base.md)

---

## 7. Troubleshooting

| Gejala | Penyebab umum | Solusi |
|--------|---------------|--------|
| COGS = 0, No Inbound | Belum ada transaksi valid (SKU biasa) | Pastikan PO / Addition / Opname IN / Opening Stock sudah approved |
| Header paket COGS = 0 | Fitur Bundle Sum belum live, atau komponen masih 0 | Cek COGS tiap komponen; tunggu rilis v1.4 / klik Calculate setelah komponen terisi |
| COGS = 0, Manual Input | Anda set Manual COGS = 0 | Expected — clear Manual jika ingin rumus |
| COGS tidak update setelah transaksi baru | Job belum jalan / queue · atau Manual override masih aktif | Klik **Calculate**; cek Manual COGS masih terisi? |
| COGS beda dari ekspektasi | Allowlist 4 sumber · Manual · atau Bundle Sum | Cek transaksi 30 hari / Manual / resep paket + qty |
| COGS naik setelah opname tanpa input harga | Opname pakai fallback benchmark → masuk balik | **Expected** — isi harga manual di opname jika ingin nilai riil |
| Parent COGS ≠ variant tertentu | Parent = **MAX** seluruh variant | Normal — cek variant dengan Show Detail |
| Tidak bisa edit Manual di Parent | By design | Edit di Variant, atau biarkan Parent dari MAX |
| Import Parent gagal, row lain sukses | Partial success | Expected — hanya Single/Variant |
| SO Benchmark COGS tidak berubah setelah edit menu | **Snapshot** by design | Expected — nilai di order = history |
| Auto-approve ditolak / Below Benchmark COGS | Price Before VAT (primary) di bawah snapshot | Unhide kolom; naikkan harga atau approve manual |
| Bingung paket vs rakitan | Rakitan bisa distok; paket tidak | Rakitan = COGS dari transaksi masuk; paket = jumlah komponen |

---

## 8. FAQ

**Q: Apakah saya bisa edit COGS manual di menu ini?**  
A: **TO-BE ya** — lewat **Manual COGS** (bukan mengedit rumus). Saat ini AS-IS masih read-only; setelah rilis v1.3, isi Manual COGS / Expiry atau import Excel. Berlaku juga untuk header paket Bundle.

**Q: Expiry dikosongkan artinya apa?**  
A: Override **permanen** sampai Anda kosongkan Manual COGS. Bukan “kembali ke rumus otomatis”.

**Q: Apakah sama dengan HPP di jurnal accounting?**  
A: Tidak. Benchmark COGS = **acuan operasional**; jurnal pakai aturan COA/inventory terpisah.

**Q: Kenapa variant random tidak muncul di perhitungan MAX parent?**  
A: Variant `-random` di-exclude dari MAX; baris random tetap dapat nilai **sama dengan parent** (kecuali header paket random → Highest Bundle Variant setelah v1.4).

**Q: Kenapa header Product Bundle sering 0?**  
A: Header paket tidak dibeli lewat inbound. Setelah improvement Bundle (TO-BE), sistem menjumlahkan COGS komponen. Sebelum rilis, sering tampil No Inbound.

**Q: Apa bedanya Bundle Sum dengan barang rakitan (BOM)?**  
A: Rakitan/assembly **bisa distok** dan punya harga masuk sendiri. Paket Bundle **tidak** — acuan-nya dari jumlah komponen.

**Q: Apakah stock opname inbound mempengaruhi COGS menu ini?**  
A: **Ya** (sejak v1.1) untuk SKU stockable. Transaksi opname IN yang approved ikut dihitung — selain PO, Stock Addition, dan Opening Stock.

**Q: Apakah Stock Addition manual mempengaruhi COGS?**  
A: **Ya** (v1.1). Harga di detail addition setelah approve menjadi sumber kalkulasi.

**Q: Bagaimana jika opname surplus pakai harga default dari benchmark?**  
A: Nilai benchmark bisa **mengulang dirinya** pada perhitungan berikutnya. Ini expected — keputusan di tangan operator untuk input harga manual atau pakai fallback.

**Q: Export data COGS?**  
A: Gunakan **Export All** di toolbar datalist.

---

## Related Documents

| Doc | Path |
|-----|------|
| Requirement (PM + QA rules) | [requirement.md](./requirement.md) |
| Technical (developer) | [technical.md](./technical.md) |
| Manual COGS rules | [requirement.md §3.5](./requirement.md#35-manual-cogs-override-to-be-v13) |
| Product Bundle COGS | [requirement.md §3.6](./requirement.md#36-product-bundle-header-to-be-v14) |
| Pending items | [requirement.md §13](./requirement.md#13-hal-yang-perlu-diperhatikan--pending-items) |
