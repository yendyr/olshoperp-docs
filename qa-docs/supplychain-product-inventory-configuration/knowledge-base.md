---
doc_type: knowledge-base
menu: supplychain-product-inventory-configuration
menu_name: "Product Inventory Configuration"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
audience: operator
sections:
  core: [what-is, glossary, can-cannot, faq, help]
  modular: [data-source, status-badge, how-to, troubleshooting]
---

# Product Inventory Configuration — Knowledge Base

> **DRAFT** — Dokumen ini adalah draft awal hasil analisis codebase otomatis per 2026-06-19. Perlu direview PM/QA sebelum final.

## 1. Apa itu Product Inventory Configuration?

Menu ini mengelola **aspek inventori dan operasional gudang** pada master produk: konfigurasi unit, shipping (dimensi/berat), processing (packing/checking/supporting), inventory management (expired date, serial number, batch, stock alert), serta BOM. Form UI menampilkan panel **Inventory** (`showInventory=true`, `showGeneral=false`).

| Item | Nilai |
|------|-------|
| Menu | SCM → Master → Product Inventory Configuration |
| Route UI | `/supplychain/product-inventory-configuration` |
| API prefix | `supplychain/product-inventory-configuration` |
| Tabel utama | `scm_products` |

## 2. Glosarium

| Istilah | Arti |
|---------|------|
| Inventory Management | Pengaturan kontrol stok (ED, SN, batch, min stock) |
| Packing Standardization | SOP packing per produk |
| Checking Standardization | SOP QC checking per produk |
| Supporting Packing | Material pendukung packing |
| Stock Alert | Minimum stock global/per gudang |

## 3. Yang Bisa / Tidak Bisa Dilakukan

### Bisa

- Konfigurasi unit alternatif dan conversion rate
- Atur dimensi, berat, warranty (shipping information)
- Definisikan packing/checking procedure dan supporting product
- Aktifkan kontrol expired date, serial number, batch number
- Kelola BOM dan bundle (sama seperti general menu)
- Import/export Excel produk
- Update inventory management settings per produk

### Tidak Bisa

- Mengakses panel Accounting Setting (hanya di General Configuration)
- Platform binding icon di datalist (disembunyikan di mode inventory)
- Mengubah primary unit jika sudah ada transaksi
- Inactive produk dengan stok ≠ 0

## 4. Cara Pakai (How-To)

### Konfigurasi inventori produk

1. Buka produk dari datalist → **Edit**.
2. Di **Unit Configuration**, pastikan primary/alternate unit benar.
3. Setelah header tersimpan, isi **Shipping Information** (dimensi & berat).
4. Isi **Processing Configuration**: packing, checking, supporting packing.
5. Buka **Inventory Management**: toggle ED/SN/batch, set stock alert.

### BOM / Bundle

1. Dari form produk, buka panel Bill of Material.
2. Tambah komponen → aktifkan bundle jika diperlukan.
3. Bundle hanya bisa ditransaksikan lewat Sales Order (bukan inbound langsung).

## 5. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Panel shipping tidak muncul | Produk belum di-save (belum edit mode) | Simpan header dulu |
| Processing config kosong | QC Procedure belum di master | Setup di menu QC Procedure |
| Import gagal | Template/kolom tidak valid | Download template terbaru, cek import log |
| Bulk delete gagal | Produk punya transaksi | Inactive, jangan delete |

## 6. FAQ

**Q: Kenapa tidak ada ikon binding platform?**  
A: AS-IS codebase menyembunyikan binding icon saat `isProductInventoryMode=true`.

**Q: Apakah data terpisah dari General Configuration?**  
A: Tidak. Keduanya mengedit record yang sama di `scm_products`; hanya section form dan route API yang berbeda.

## Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Technical | [technical.md](./technical.md) |
