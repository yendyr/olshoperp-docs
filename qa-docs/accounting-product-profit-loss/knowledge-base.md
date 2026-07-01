---
doc_type: knowledge-base
menu: accounting-product-profit-loss
menu_name: "Product Profit Loss"
version: 1.3
last_updated: 2026-06-29
owner: QA - Yemima
status: draft
audience: operator
sections:
  core: [what-is, glossary, can-cannot, faq, help]
  modular: [filters, columns, buttons, export, troubleshooting]
---

# Product Profit Loss — Knowledge Base

> **DRAFT** — Dokumentasi operator AS-IS dari codebase (29 Juni 2026). Belum final review QA/PM.

## 1. Apa itu Product Profit Loss?

**Product Profit Loss** menampilkan performa penjualan per **SKU** dalam periode yang Anda pilih: berapa qty terjual, penjualan kotor (Gross Sales), biaya pokok (Total COGS), laba bersih (Net Profit), dan margin (%).

Menu ini **hanya untuk melihat laporan** — tidak bisa menambah atau mengubah transaksi. Data diambil dari Sales Order dan Outbound yang sudah ada di sistem.

**Menu:** FA → Report → Product Profit Loss (`/accounting/product-profit-loss`)

---

## 2. Glosarium

| Istilah | Arti |
|---------|------|
| Qty Sold | Jumlah terjual dikonversi ke **Primary Unit** produk |
| Primary Unit | Satuan utama SKU di Master Product (bukan unit di order) |
| Gross Sales | Total harga jual per SKU setelah diskon item + PPN, **tanpa** diskon tambahan level summary order |
| Total COGS | Nilai stok keluar (HPP) dari Outbound yang sudah Approved |
| Net Profit | Gross Sales − Total COGS |
| Profit Margin (%) | Net Profit ÷ Gross Sales × 100% |
| Snapshot | Data laporan disimpan sementara di server agar loading berikutnya lebih cepat |
| SKU Bundle | Paket produk — angka masuk ke **komponen** bundle, bukan SKU bundle induk |
| SKU Random | Produk acak — **belum muncul** sampai order diproses Send to Default Waves |
| Warehouse Process (`wh_process_id`) | Gudang proses fulfillment — order tanpa ini **tidak masuk** laporan |

---

## 3. Yang Bisa / Tidak Bisa Dilakukan

### Bisa

- Filter **Period** (maks. 3 bulan), **Category**, **Variant Status**
- Cari data (global search) dan filter per kolom
- Sembunyikan/tampilkan kolom (column show/hide)
- Export Excel (**All** atau **This Page Only**)
- Lihat **Detail Orders** per SKU (modal)
- **Refresh Data** untuk hitung ulang periode aktif
- Klik SKU → buka Master Product (tab baru)

### Tidak Bisa

- Import file Excel/CSV dari marketplace ke menu ini
- Edit transaksi dari halaman ini
- Pilih mata uang selain IDR
- Melihat data real-time detik demi detik — data bersifat snapshot sementara

---

## 4. Layout Halaman & Tombol

```
┌─────────────────────────────────────────────────────────────┐
│ Breadcrumb: FA > Report > Product Profit Loss               │
├─────────────────────────────────────────────────────────────┤
│ [Period ▼] [Category ▼] [Variant Status ▼]  [Refresh Data] │
├─────────────────────────────────────────────────────────────┤
│ (Overlay loading jika sedang menghitung data)               │
│ DataTables: kolom SKU, Qty, Unit, Gross Sales, COGS, ...   │
│ Toolbar: Search | Column visibility | Export | ...          │
└─────────────────────────────────────────────────────────────┘
```

### 4.1 Filter panel

| Kontrol | Fungsi | Perilaku |
|---------|--------|----------|
| **Period** | Date range | Default: 3 bulan terakhir. Maks. 3 bulan — jika lebih, muncul pesan error *"The maximum period is 3 months."* |
| **Category** | Multi-select kategori produk | Kosong = semua kategori. Pilih satu/lebih → tabel reload |
| **Variant Status** | Dropdown | **All Variant Status** (default), **Non-Random**, **Random** — filter baris yang sudah ada di laporan |

### 4.2 Tombol Refresh Data

| Aspek | Detail |
|-------|--------|
| Lokasi | Kanan filter panel, ikon refresh |
| Fungsi | Menghapus snapshot periode aktif dan **menghitung ulang** dari Sales Order + Outbound |
| Kapan dipakai | Data terasa tidak update setelah ada perubahan transaksi |
| Saat proses | Tombol disabled; overlay loading + progress bar (%) |
| Catatan | Bukan tombol export — hanya regenerate data laporan |

### 4.3 DataTables toolbar (standar OlshopERP)

| Fitur | Fungsi |
|-------|--------|
| **Global Search** | Cari teks di seluruh kolom tabel utama |
| **Column filter** (ikon filter per header) | Filter per kolom (angka/teks sesuai tipe kolom) |
| **Column Show/Hide** | Tampilkan/sembunyikan kolom |
| **Export** (slider kanan) | Unduh Excel & lihat riwayat export |

> **Catatan:** Panel **Advanced Filter** (SearchBuilder) **belum aktif** — masuk backlog dev (G-02). Saat ini pakai global search + filter per kolom.

### 4.4 Kolom Action — Detail Orders

| Aspek | Detail |
|-------|--------|
| Label | **Detail Orders** (link biru) |
| Fungsi | Buka modal **Order Details** |
| Isi modal | Tabel order yang berkontribusi ke angka SKU tersebut |

**Kolom modal AS-IS:**

| Kolom | Keterangan |
|-------|------------|
| SO Code | Nomor Sales Order (klik → halaman edit SO) |
| Date | Tanggal transaksi order |
| Store | Nama toko |
| Platform | Nama platform (kosong untuk order internal) |
| Qty | Qty terjual (primary unit) untuk order tersebut |
| Gross Sales | Penjualan kotor order tersebut |

**Belum tersedia (rencana dev — G-01):** nomor order platform, Customer, Unit transaksi, Unit Price, Disc, VAT, Additional Disc/Cost, Outbound, Delivery Order, Sales Invoice.

### 4.5 Modal Order Details — tombol Close

Menutup modal tanpa mengubah data.

---

## 5. Kolom Laporan Utama

| Kolom | Arti singkat |
|-------|--------------|
| Product SKU / Product Name | Identitas produk; SKU bisa diklik ke master |
| Qty Sold | Total qty terjual (primary unit) dalam periode |
| Primary Unit | Satuan utama produk |
| Gross Sales | Penjualan kotor (after item discount, include VAT) |
| Total COGS | Total biaya pokok dari outbound approved |
| Net Profit | Gross Sales − Total COGS |
| Profit Margin (%) | Persentase margin |
| Avg. Selling Price | Rata-rata harga jual per unit |
| Avg. Buying Price | Rata-rata HPP per unit |

Tooltip (ikon ?) di header kolom menjelaskan formula singkat.

---

## 7. Menu Terkait — Sumber Data

Product Profit Loss **membaca** data dari 3 menu utama berikut. Jika data di menu sumber salah atau belum lengkap, angka di laporan ini ikut terpengaruh.

### 7.1 Sales Order General (Internal)

| | |
|---|---|
| **Menu** | Busdev → **Dev - Sales Order** |
| **Path** | `/businessdevelopment/sales-order-general` |
| **Doc** | [Sales Order General](../sales-order-general/knowledge-base.md) |

**Fungsi untuk PPL:** Sumber **Qty Sold** dan **Gross Sales** dari penjualan internal (manual, import Excel, POS).

**Peran operator:** Buat/approve SO → pastikan masuk alur gudang (wave, WH Process) → setelah outbound approve, COGS ikut terhitung.

---

### 7.2 Sales Platform (Marketplace)

| | |
|---|---|
| **Menu** | Omni Channel → **Dev - Sales Platform** |
| **Path** | `/omni/sales-order` |
| **Doc** | [Sales Order General / Platform](../sales-order-general/knowledge-base.md) *(satu modul SO)* |

**Fungsi untuk PPL:** Sumber **Qty Sold** dan **Gross Sales** dari order marketplace (Shopee, TikTok, Lazada, dll.) yang di-sync lewat **Store**.

**Peran operator:** Authorize store → sync order → approve SO platform → **Send to Default Waves** (penting untuk SKU random) → fulfillment sampai outbound approve.

Kolom **Platform** di modal detail PPL berasal dari order tipe ini.

---

### 7.3 Outbound External

| | |
|---|---|
| **Menu** | Supply Chain → **Outbound External** |
| **Path** | `/supplychain/mutation-outbound` |
| **Doc** | [Outbound External](../supplychain-mutation-outbound/knowledge-base.md) |

**Fungsi untuk PPL:** Sumber **Total COGS** (HPP) — hanya outbound **Approved** yang punya **referensi ke detail Sales Order**.

**Peran operator:** Pastikan outbound order sudah **Approved**. Outbound manual tanpa referensi SO **tidak** mempengaruhi COGS di laporan ini.

---

### 7.4 Ringkasan alur

```
Sales Order (General / Platform)  →  Qty Sold + Gross Sales
         ↓ fulfillment
Outbound External (ref SO, Approved)  →  Total COGS
         ↓
Product Profit Loss  →  Net Profit + Margin per SKU
```

**View gabungan order:** [All Sales Order](/businessdevelopment/all-sales-order) — dipakai saat klik SO Code di modal detail.

---

## 8. Export Excel

| Aspek | Detail |
|-------|--------|
| Akses | Panel Export di slider kanan DataTables |
| Opsi | **All** — seluruh baris sesuai filter aktif; **This Page Only** — halaman yang sedang ditampilkan |
| Filter ikut export | Period, Category, Variant Status, serta filter kolom yang aktif |
| Format file | `.xlsx` |
| Nama file | `Product Profit Loss_{tanggal waktu}.xlsx` |
| Proses | Background — cek status di tab riwayat export |
| Kolom file | Sama dengan kolom utama (tanpa kolom Action) |

**Tidak ada** opsi With/Without Details di menu ini.

---

## 9. Import File — Tidak Berlaku

Menu ini **tidak punya fitur import** template per platform (Shopee, Tokopedia, TikTok, dll.).

| Jika Anda perlu... | Gunakan menu... |
|--------------------|-----------------|
| Input order marketplace | Sales Order Platform / sync platform |
| Input order internal | Sales Order General |
| Lihat P/L per SKU | **Product Profit Loss** (menu ini) |

Data laporan otomatis terbentuk dari transaksi yang **sudah ada** di sistem.

---

## 10. Cara Pakai (How-To)

### Skenario: Cek margin produk terlaris bulan ini

1. Buka **Product Profit Loss**
2. Atur **Period** (mis. awal bulan – hari ini)
3. Tunggu overlay loading selesai (pertama kali bisa lama)
4. Urutkan kolom **Gross Sales** atau **Profit Margin (%)**
5. Klik **Detail Orders** pada SKU yang ingin diaudit

### Skenario: Filter kategori tertentu

1. Pilih satu atau lebih **Category**
2. Tabel otomatis reload

### Skenario: Data tidak sesuai setelah ada outbound baru

1. Klik **Refresh Data**
2. Tunggu progress 100%

---

## 11. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Loading lama pertama buka | Generate snapshot per hari | Tunggu; buka lagi nanti lebih cepat |
| Total COGS = 0, Qty/Gross terisi | Order belum Outbound Approved | Normal — proses outbound dulu |
| SKU bundle tidak muncul | Value di komponen | Cek komponen bundle |
| SKU random tidak muncul | Belum Send to Default Waves | Proses wave dulu |
| Order Approved tidak muncul sama sekali | `wh_process_id` masih kosong | Assign Warehouse Process di SO atau Send to Default Waves |
| Period error 3 bulan | Range terlalu panjang | Perpendek periode |
| Data hilang setelah ±1 jam | Scheduler hapus snapshot lama | Buka menu lagi atau Refresh Data |
| Advanced Filter tidak ada | Belum diimplementasi UI | Pakai global search + column filter |
| Angka tidak termasuk retur | Sales Return belum di kalkulasi | **Next MVP** — lihat requirement §7.3 |

---

## 12. FAQ

**Q: Apa beda Primary Unit di sini dengan unit di order?**  
A: Primary Unit dari Master Product. Di modal detail, Qty sudah dikonversi ke primary unit.

**Q: Kenapa additional discount di summary order tidak mengurangi Gross Sales?**  
A: Diskon summary tidak melekat ke SKU tertentu — desain perhitungan per produk.

**Q: Apakah data update otomatis setiap jam?**  
A: Snapshot **dibersihkan** tiap jam; **bukan** otomatis dihitung ulang. Buka menu atau Refresh Data untuk generate lagi.

**Q: Bisa import Excel Shopee di sini?**  
A: Tidak. Menu ini hanya laporan.

**Q: Order Platform dan General digabung?**  
A: Ya, per SKU dalam satu baris jika sama periode.

---

## Related Documents

| Doc | Untuk |
|-----|-------|
| [requirement.md](./requirement.md) | Aturan bisnis, related menus detail, gap |
| [technical.md](./technical.md) | API, database, jobs (developer) |
| [Sales Order General](../sales-order-general/) | SO internal — sumber qty & gross |
| [Outbound External](../supplychain-mutation-outbound/) | Outbound — sumber COGS |
| [Store](../omni-store-binding/) | Sync order platform |
