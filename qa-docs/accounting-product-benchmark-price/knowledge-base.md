---
doc_type: knowledge-base
menu: accounting-product-benchmark-price
menu_name: "Benchmark COGS"
version: 1.1
last_updated: 2026-07-09
owner: QA - Yemima
status: review
audience: operator
aliases: [Benchmark COGS, HPP Acuan, COGS benchmark menu]
sections:
  core: [what-is, how-to-read, calculate, show-detail, integration, troubleshooting, faq]
---

# Benchmark COGS — Knowledge Base

## 1. Apa itu Benchmark COGS?

Menu **Finance Accounting → Report → Benchmark COGS** menampilkan **nilai acuan HPP** per System Product — bukan stok accounting, melainkan referensi operasional harian.

| Item | Nilai |
|------|-------|
| Route | `/accounting/product-benchmark-price` |
| Update otomatis | Setiap hari **00:00 WIB** |
| Input manual harga | **Tidak ada** — sistem hitung dari transaksi masuk stok |

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
| **COGS** | Nilai acuan HPP hasil kalkulasi |
| **Description** | Alasan nilai: **Highest Price** · **Last Inbound** · **No Inbound** |
| **COGS Last Updated** | Kapan baris ini terakhir di-update sistem |

### Description — maksudnya apa?

| Label | Arti |
|-------|------|
| **Highest Price** | Ada transaksi masuk stok valid dalam **30 hari terakhir** — sistem ambil harga **tertinggi** (sebelum pajak) |
| **Last Inbound** | Tidak ada transaksi 30 hari terakhir — ambil harga transaksi **terakhir** sebelum periode itu |
| **No Inbound** | Belum ada transaksi valid — COGS = **0** |

### Sumber data (per 2026-07-09)

Sistem menghitung dari **empat jenis transaksi** approved (Price Before VAT):

| Sumber | Menu |
|--------|------|
| Purchase Inbound (PO) | Mutation Inbound dari PO |
| Stock Addition | Adjustment Addition (manual) |
| Stock Opname IN | Penambahan otomatis dari Stock Opname surplus |
| Opening Stock | Penambahan otomatis dari Opening Stock |

---

## 3. Toggle Show Detail

| Show Detail | Baris yang tampil |
|-------------|-------------------|
| **Off (default)** | **Single** + **Parent** saja |
| **On** | Termasuk semua **Variant** (child SKU) |

Gunakan **On** jika perlu cek COGS per varian (mis. Warna/Ukuran).

---

## 4. Tombol Calculate (manual)

Setiap baris punya aksi **Calculate** (icon sync):

- Menghitung ulang COGS untuk SKU tersebut (+ variant terkait jika parent)  
- Berguna setelah transaksi masuk stok baru approved — tidak perlu tunggu midnight  
- Proses berjalan di background — **refresh halaman** setelah beberapa detik jika nilai belum berubah

**Calculate Log** (toolbar): buka riwayat perubahan COGS (nilai lama → baru, tanggal, aksi System/manual).

---

## 5. Integrasi ke menu lain

### Sales Order (General & Platform)

Di **detail order**, kolom (default **hidden** — aktifkan lewat column picker):

| Kolom | Fungsi |
|-------|--------|
| **Price Before VAT** | Harga jual satuan sebelum pajak |
| **Benchmark COGS** | Snapshot COGS **saat order dibuat** — tidak ikut berubah meskipun master COGS berubah |

Jika harga jual di bawah benchmark → order **tidak auto-approve** (icon peringatan dollar merah).

Detail: [Sales Order requirement §11](../sales-order-general/requirement.md#11-benchmark-cogs--price-before-vat-detail-order)

### Stock Opname

- **Konsumen:** surplus tanpa input harga → pakai COGS dari menu ini sebagai default  
- **Sumber (v1.1):** transaksi opname IN yang approve **bisa mempengaruhi** benchmark pada perhitungan berikutnya

### Stock Addition & Opening Stock

Transaksi penambahan stok manual (Addition) dan Opening Stock — setelah approve — **ikut** menjadi sumber nilai benchmark.

### Product Bundle & Random SKU

- **Bundle header:** COGS = nilai parent SKU  
- **Random SKU:** di master menu, variant random **mengikuti** COGS parent — validasi SO punya aturan khusus ([Random SKU](../random-sku/knowledge-base.md))

---

## 6. Troubleshooting

| Gejala | Penyebab umum | Solusi |
|--------|---------------|--------|
| COGS = 0, No Inbound | Belum ada transaksi valid (PO, Addition, Opname IN, Opening Stock) | Pastikan salah satu transaksi sudah approved |
| COGS tidak update setelah transaksi baru | Job harian belum jalan / queue | Klik **Calculate** manual pada SKU |
| COGS beda dari ekspektasi | Hanya transaksi dalam allowlist 4 sumber yang dihitung | Cek PO / Addition / Opname IN / Opening Stock 30 hari terakhir |
| COGS naik setelah opname tanpa input harga | Opname pakai fallback benchmark → masuk balik ke kalkulasi | **Expected** — isi harga manual di opname jika ingin nilai riil |
| Parent COGS ≠ variant tertentu | Parent = **MAX** seluruh variant | Normal — cek variant dengan Show Detail |
| SO Benchmark COGS tidak berubah setelah edit menu | **Snapshot** by design | Expected — nilai di order = history |
| Auto-approve ditolak padahal harga terasa cukup | Bandingkan kolom Price Before VAT vs Benchmark (unhide kolom) | Review margin per line |

---

## 7. FAQ

**Q: Apakah saya bisa edit COGS manual di menu ini?**  
A: Tidak. Nilai dihitung sistem. Anda hanya bisa trigger **Calculate** ulang.

**Q: Apakah sama dengan HPP di jurnal accounting?**  
A: Tidak. Benchmark COGS = **acuan operasional**; jurnal pakai aturan COA/inventory terpisah.

**Q: Kenapa variant random tidak muncul di perhitungan MAX parent?**  
A: Variant `-random` di-exclude dari MAX; baris random tetap dapat nilai **sama dengan parent**.

**Q: Apakah stock opname inbound mempengaruhi COGS menu ini?**  
A: **Ya** (sejak v1.1). Transaksi opname IN yang approved ikut dihitung — selain PO, Stock Addition, dan Opening Stock.

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
| Pending items | [requirement.md §13](./requirement.md#13-hal-yang-perlu-diperhatikan--pending-items) |
