---
doc_type: knowledge-base
menu: system-product
menu_name: "System Product"
version: 2.1
last_updated: 2026-07-05
owner: QA - Yemima
status: review
audience: operator
sections:
  core: [what-is, types, datalist, unit-dw, variant, bundle, rules, import, troubleshooting, faq]
---

# System Product — Knowledge Base

## 1. Apa itu System Product?

Master data **SKU** internal — identitas produk, satuan, dimensi/berat, variant, bundle, inventori, pajak, dan pengiriman.

| Item | Nilai |
|------|-------|
| Menu | Supply Chain → Master → **System Product** |
| Route UI | `/supplychain/product` |
| API | `supplychain/product` |

**Related menus (subset):**

| Menu | Route | Isi |
|------|-------|-----|
| Product General Configuration | `/supplychain/product-general-configuration` | Basic, unit, D&W, variant, bundle, sales, tax |
| Product Inventory Configuration | `/supplychain/product-inventory-configuration` | Expired, serial, batch, min-max gudang |

Import/export Excel **hanya** di menu System Product full.

---

## 2. Tipe produk

| Tipe | Keterangan | Bisa dijual / distock? |
|------|------------|------------------------|
| **Single** | SKU standar | Ya |
| **Variant (Parent)** | Pembungkus data (warna, ukuran, dll.) | **Tidak** — hanya child |
| **Variant (Child)** | Turunan auto-generate `Parent-Option` | Ya |
| **Bundle** | Paket beberapa SKU | Ya di **Sales Order** saja; stok dari komponen |

**BOM (Assembly)** ≠ Bundle — BOM di menu [Bill of Material](../bill-of-material/), bukan toggle bundle.

---

## 3. Datalist — kolom & tombol

### Kolom utama

| Kolom | Arti operator |
|-------|---------------|
| **Images** | Foto utama produk |
| **Product** | SKU, nama, satuan utama, harga retail |
| **Type / Bundle / Active** | SINGLE / VARIANT / PARENT · apakah bundle · aktif/tidak |
| **Availability** | Stok bisa dipakai sekarang |
| **On Hand** | Stok fisik di gudang |
| **ATS** | Available to Sell — stok bersih untuk dijual |
| **Data Owner** | Perusahaan pemilik + siapa/kapan buat/ubah |

**Bundle:** angka stok = komponen **paling sedikit** (bottleneck). Contoh: butuh 2 A + 1 B, stok A=10 B=3 → bundle max 3.

**Parent variant:** tooltip UI menyebut stok `-`; sistem tetap bisa tampilkan angka — yang dijual hanya **child**.

### Tombol toolbar

| Tombol | Fungsi |
|--------|--------|
| **+ Create** | Buat SKU baru |
| **Delete** (bulk) | Hapus SKU tanpa relasi transaksi |
| **Unbind** | Lepas platform binding (bulk) |
| **Import** | Upload Excel (new/update/bundle/random/VAT) |
| **Export** | Download data |
| **Show deleted / archived** | Filter SKU terhapus/inactive |

---

## 4. Unit Configuration & D&W

> Sejak refactor **7 Mei 2026**, dimensi & berat (**D&W**) diatur **per satuan**, bukan satu nilai flat di Shipping.

### Primary Unit

- Satuan dasar stok (biasanya **Pieces** saat create)  
- **Tidak bisa dihapus**  
- **Tidak bisa diganti** jika SKU sudah dipakai di PR, PO, inbound, outbound, atau BoM  

### Alternate Unit

- Satuan lain (Box, Lusin, …) dengan konversi ke primary  
- Bisa tambah unit baru meski unit lama sudah terkunci transaksi  
- Unit yang sudah dipakai transaksi: **unit & konversi terkunci**, tapi D&W masih bisa diedit  

### D&W per unit (klik Edit)

Setiap satuan punya **profil D&W** (bisa lebih dari satu):

| Kolom | Keterangan |
|-------|------------|
| D&W Label | Nama profil (After Packing, Gross Weight, …) |
| L × W × H (cm) | Dimensi |
| Weight (g) | Berat |
| **Unit Default** | Default untuk satuan ini |
| **Platform Default** | **Global** — dipakai sync stok ke marketplace |
| **Trx & Report Default** | **Global** — dipakai transaksi & laporan |

**Penting:** Platform Default dan Trx Default **hanya satu** untuk seluruh produk — pilih di Box otomatis lepas di Pieces.

**Shipping section:** hanya **asuransi pengiriman** (Required/Optional). D&W **tidak ada** di sana lagi.

---

## 5. Product Details — media & variant

### Foto & video

| Media | Batas |
|-------|-------|
| Foto | Max **10**; JPG/PNG; disarankan min 300×300 px |
| Video | Max **5**; upload **mp4** (sistem terima mp4/mov) |

### Variant

1. Aktifkan **Enable Variations**  
2. Pilih tipe variant (max **3** tipe, mis. Warna + Ukuran)  
3. Sistem buat SKU child otomatis: `PARENT-MERAH-L`  
4. Opsi **random** → lihat [Random SKU](../random-sku/knowledge-base.md)  

Hanya **child** yang muncul di PO/SO/inbound.

### Bundle

1. Aktifkan **Set as Product Bundle**  
2. Isi komponen + qty  
3. **Valid:** minimal 2 baris ATAU 1 baris dengan qty **≥ 2**  
4. **Invalid:** 1 baris qty = 1 saja  

**Pajak parent bundle:** Section **Accounting & Tax Setting** **tidak tampil** saat bundle aktif — pajak dihitung per **komponen detail**, bukan header.

Bundle **Variant:** resep berbeda per varian header (accordion).

Saat order terkirim, stok yang berkurang = **isi paket**, bukan header bundle.

---

## 6. Sales, Inventory, Tax (ringkas)

| Section | Isi |
|---------|-----|
| **Sales Management** | Hazardous, warranty, warranty policy, pre-order |
| **Inventory Management** | Expired date, serial no, batch, min stock, warning merah, min-max per gudang |
| **Shipping** | Asuransi wajib/opsional |
| **Processing** | SOP QC packing & checking |
| **Accounting & Tax** | COA binding + tabel pajak jual/beli — **hidden jika header = Product Bundle** |

**Pajak saat transaksi:** setting **Company** menang atas setting produk. Jika Company = Default, lihat flag **Auto add trx** di produk.

---

## 7. Aturan penting

| Rule | Detail |
|------|--------|
| SKU unik | Per **Data Owner** (Internal Company) — *catatan: saat create perlu QA verify scope* |
| Hapus SKU | Tidak bisa jika sudah ada transaksi — gunakan **Inactive** |
| Ganti Primary Unit | Tidak bisa jika sudah transaksi |
| Inactive | Total stok **0** di semua gudang |
| Bundle inbound | **Tidak** — inbound komponen masing-masing |
| Bundle di SO | Bisa; harga detail dipecah otomatis berdasarkan **Price Before VAT** komponen |

---

## 8. Import (operator)

Hanya dari menu **System Product** full:

| Tipe | Kegunaan |
|------|----------|
| New Product | Bulk create SKU |
| Update Product | Bulk update field |
| Product Bundle | Import resep bundle |
| Insert Random | Tambah opsi random ke variant |
| Alternative Unit | Bulk satuan alternatif |
| Update Variant | Bulk update variant |
| Bulk Update VAT | Update pajak massal |

Max **5000** baris per file. Pantau progress bar setelah upload.

---

## 9. Troubleshooting

| Gejala | Penyebab umum | Solusi |
|--------|---------------|--------|
| SKU duplicate error | SKU sama di company yang sama | Ubah SKU atau cek Data Owner |
| Tidak bisa inactive | Masih ada stok / reserved | Pastikan Availability & ATS = 0 |
| Bundle tidak bisa active | Resep invalid (1 item qty 1) | Tambah item atau naikkan qty ≥ 2 |
| Primary unit locked | Sudah ada PR/PO/inbound | Expected — buat SKU baru jika perlu ganti satuan |
| Platform sync dimensi salah | Platform Default belum di-set | Set Platform Default di D&W profil yang benar |
| Video upload gagal | Format mkv | Konversi ke **mp4** |
| Parent tidak muncul di PO | Parent non-transactable | Pilih **child variant** |
| Harga bundle aneh di SO | Proporsi pakai Price Before VAT, bukan retail gross | Cek pajak komponen (Include/Exclude/Coefficient); lihat Modal Detail Bundle di SO |

---

## 10. FAQ

**Q: Beda System Product vs Platform Product?**  
A: System Product = master internal. Platform Product = mirror marketplace (menu terpisah).

**Q: Kenapa parent variant tidak bisa dijual?**  
A: Hanya SKU child yang stockable. Parent hanya grouping.

**Q: Bundle bisa inbound?**  
A: Tidak. Inbound komponen satu per satu.

**Q: Beda Bundle vs BOM?**  
A: Bundle = paket jual di SO (`is_bom=0`). BOM = resep produksi Assembly (`is_bom=1`, menu Bill of Material).

**Q: D&W di mana sekarang?**  
A: **Unit Configuration** → Edit unit → profil D&W. Bukan di Shipping.

**Q: Random SKU di bundle?**  
A: Header random tidak dipilih manual di transaksi; sistem pick saat proses kirim. Lihat [Random SKU](../random-sku/knowledge-base.md).

**Q: Dampak ke Instant Settlement?**  
A: Produk harus **Active**, stok cukup, COA Group terisi. Lihat [Instant Settlement](../accounting-settlement-upload/knowledge-base.md).

---

## Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Technical | [technical.md](./technical.md) |
| Bill of Material | [../bill-of-material/knowledge-base.md](../bill-of-material/knowledge-base.md) |
| Master Unit | [../supplychain-unit/knowledge-base.md](../supplychain-unit/knowledge-base.md) |
