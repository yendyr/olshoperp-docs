---
doc_type: knowledge-base
menu: supplychain-product-general-configuration
menu_name: "Product General Configuration"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
audience: operator
sections:
  core: [what-is, glossary, can-cannot, faq, help]
  modular: [data-source, status-badge, how-to, troubleshooting]
---

# Product General Configuration — Knowledge Base

> **DRAFT** — Dokumen ini adalah draft awal hasil analisis codebase otomatis per 2026-06-19. Perlu direview PM/QA sebelum final.

## 1. Apa itu Product General Configuration?

Menu ini mengelola **aspek umum master produk (SKU)** di Supply Chain: identitas produk, kategori, unit dasar, variasi, bundle/BOM, pengaturan pajak, dan mapping akuntansi. Data disimpan di tabel produk yang sama dengan menu System Product, tetapi form UI **hanya menampilkan panel General** (tanpa shipping, processing, dan inventory management detail).

| Item | Nilai |
|------|-------|
| Menu | SCM → Master → Product General Configuration |
| Route UI | `/supplychain/product-general-configuration` |
| API prefix | `supplychain/product-general-configuration` |
| Tabel utama | `scm_products` |

## 2. Glosarium

| Istilah | Arti |
|---------|------|
| SKU | Kode unik produk per data owner (internal company) |
| Parent / Variant | Produk induk dengan turunan SKU child otomatis |
| Bundle | Produk paket; stok mengikuti komponen terendah |
| BOM | Bill of Material — resep produksi/assembly |
| Product COA Group | Grup akun jurnal dari modul Accounting |
| Platform Binding | Link SKU internal ke produk marketplace (OmniChannel) |

## 3. Yang Bisa / Tidak Bisa Dilakukan

### Bisa

- Buat/edit produk single, variant, atau bundle
- Konfigurasi variant, spesifikasi, gambar, dan BOM
- Atur tax config dan accounting COA per produk
- Binding/unbinding ke platform product (jika punya hak akses)
- Import/export Excel, duplicate produk, archive (inactive)
- Lihat kolom stok ringkas (Availability, On Hand, ATS) di datalist

### Tidak Bisa

- Mengubah primary unit jika produk sudah punya transaksi
- Menghapus produk yang sudah bertransaksi (hanya inactive)
- Inactive produk jika total stok ≠ 0
- SKU mengandung kata `random` (khusus random SKU sistem)
- Mengakses panel Shipping / Processing / Inventory Management penuh (ada di menu Inventory Configuration)

## 4. Cara Pakai (How-To)

### Buat produk baru

1. Buka **Product General Configuration** → **Create**.
2. Isi SKU, nama, kategori, Product COA Group, primary unit, conversion rate.
3. (Opsional) Aktifkan variasi, bundle, atau alias name.
4. Simpan header → lanjut isi spesifikasi, variant, BOM, tax, accounting di panel form.
5. Set status **Active** jika siap dipakai transaksi.

### Edit / inactive

1. Cari SKU di datalist → klik edit.
2. Ubah field yang diizinkan (primary unit terkunci jika ada transaksi).
3. Untuk inactive: pastikan stok 0 di semua gudang → toggle status.

### Binding platform

1. Di datalist, klik ikon link pada baris produk (jika role mengizinkan).
2. Pilih platform product → simpan binding.

## 5. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| SKU already taken | Duplikat di company yang sama | Gunakan SKU lain |
| Primary unit cannot be updated | Ada transaksi PR/PO/inbound/outbound | Buat produk baru atau hubungi admin |
| Cannot inactive | Stok belum 0 | Kosongkan stok dulu |
| Conversion rate must be 1 | Unit adalah base unit | Set conversion rate = 1 |
| Binding icon tidak muncul | Mode inventory / tanpa hak update platform | Gunakan menu General Configuration |

## 6. FAQ

**Q: Apa bedanya dengan Product Inventory Configuration?**  
A: Menu ini fokus konfigurasi umum (variant, bundle, tax, accounting). Menu Inventory Configuration menampilkan panel unit lanjutan, shipping, processing, dan inventory management.

**Q: Apa bedanya dengan System Product?**  
A: Keduanya memakai `ProductController` yang sama. Perbedaan utama: route API, policy class, dan section form yang ditampilkan (`typeProduct = general`).

## Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Technical | [technical.md](./technical.md) |
| System Product | [../system-product/README.md](../system-product/README.md) |
