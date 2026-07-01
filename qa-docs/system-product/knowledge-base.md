---
doc_type: knowledge-base
menu: system-product
menu_name: "System Product"
version: 1.0
last_updated: 2026-06-23
owner: QA - Yemima
status: review
audience: operator
sections:
  core: [what-is, types, stock-columns, bundle-variant, rules, faq]
---

# System Product — Knowledge Base

## 1. Apa itu System Product?

Master data **SKU** utama — menyimpan info produk, stok, harga, variant, bundle, BOM flag, pajak, dan pengiriman.

**Menu:** SCM → System Product (`/supplychain/system-product`)

## 2. Tipe produk

| Tipe | Keterangan |
|------|------------|
| **Single** | SKU tunggal standar |
| **Variant** | Parent + child SKU (warna, ukuran, dll.) — hanya **child** yang bisa ditransaksikan & punya stok |

## 3. Kolom stok di datalist

| Kolom | Arti singkat |
|-------|--------------|
| **Availability** | Stok bisa dipakai: Inbound − Used − Reserved |
| **On Hand** | Stok fisik di gudang |
| **ATS** | Available to Sell: On Hand − Outstanding SO − Reserved Out |

## 4. Variant

- Aktifkan **Enable Variations** → pilih Variant Type & Option
- Sistem auto-generate SKU child: `PrefixParent-Option`
- Opsi **random** → lihat [random-sku](../random-sku/) (virtual SKU, auto-pick saat kirim)

## 5. Bundle

- **Bundle Single:** satu resep komponen
- **Bundle Variant:** resep berbeda per varian header
- Hanya bisa dijual di Sales Order; stok mengikuti komponen terendah
- Saat outbound, yang berkurang = **komponen**, bukan header bundle

## 6. BOM flag

Jika **BOM = YES** → SKU ini barang jadi untuk menu [Bill of Material](../bill-of-material/) & transaksi Assembly.

## 7. Aturan penting

| Rule | Detail |
|------|--------|
| SKU unik | Per Internal Company (Data Owner) |
| Hapus SKU | Tidak bisa jika sudah ada transaksi — hanya inactive |
| Ganti Primary Unit | Tidak bisa jika sudah ada transaksi |
| Inactive | Total stok semua gudang harus **0** |
| Pajak | Prioritas: setting Company → setting Product |

## 8. FAQ

**Q: Beda System Product vs Platform Product?**  
A: System Product = master internal. Platform Product = mirror dari marketplace (menu terpisah).

**Q: Kenapa parent variant tidak bisa dijual?**  
A: Hanya SKU child yang stockable & transactable.

**Q: Bundle bisa inbound?**  
A: Tidak — bundle non-stockable; yang distock = komponen.

## 9. Relasi Instant Settlement (operator)

| Cek sebelum settle | Alasan |
|--------------------|--------|
| Produk **Active** | Inactive → SO/validasi gagal |
| Stok cukup di tanggal settle | Error `checkShipping` di settlement |
| **Product COA Group** terisi | Jurnal SI/OB butuh mapping COA per SKU |

Detail: [Instant Settlement](../accounting-settlement-upload/requirement.md)
