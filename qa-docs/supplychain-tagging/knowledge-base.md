---
doc_type: knowledge-base
menu: supplychain-tagging
menu_name: "Tagging"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
audience: operator
---

# Tagging — Knowledge Base

> **DRAFT** — Dokumen ini adalah draft awal hasil analisis codebase otomatis per 2026-06-19. Perlu direview PM/QA sebelum final.

## 1. Apa itu Tagging?

**Tagging** adalah master data **label/kategori** yang bisa dipasang ke produk untuk keperluan klasifikasi, filter, atau konfigurasi di Supply Chain. Satu produk dapat memiliki lebih dari satu tagging via relasi `scm_product_taggings`.

| Item | Nilai |
|------|-------|
| Menu | Supply Chain → Master → Tagging |
| Route UI | `/supplychain/tagging` |
| API prefix | `supplychain/tagging` |
| Tabel utama | `scm_taggings` |
| Relasi produk | `scm_product_taggings` |

## 2. Glosarium

| Istilah | Arti |
|---------|------|
| Tagging | Master label (code + name) yang bisa di-assign ke SKU |
| Product Tagging | Relasi many-to-many produk ↔ tagging |
| `status` | 1 = Active (muncul di select2); 0 = Inactive |
| `is_all_company` | Tagging dibagikan ke semua company dalam grup (jika diaktifkan) |
| Select2 Tagging | Dropdown pencarian tagging aktif di form produk |

## 3. Yang Bisa / Tidak Bisa Dilakukan

### Bisa

- Buat, edit, dan hapus (soft delete) master tagging
- Aktif/nonaktifkan tagging (`status`)
- Atur sharing antar company (`is_all_company`)
- Lihat audit log perubahan
- Assign tagging ke produk via **Product General Configuration** atau **Product Inventory Configuration**

### Tidak Bisa

- Menghapus tagging yang masih direferensi produk (`ProductTagging`) — sistem blokir via `relations()`
- Menggunakan tagging inactive di select2 (hanya `status = 1`)
- Duplikasi `code` atau `name` dalam company yang sama

## 4. Cara Pakai (How-To)

### Buat tagging baru

1. Buka **Tagging** → **Create**.
2. Isi **Code** (unik, max 50), **Name** (unik, max 50), **Description** (opsional, max 150).
3. Set **Status** Active jika siap dipakai di produk.
4. Simpan.

### Edit / nonaktifkan

1. Cari baris di datalist → **Edit**.
2. Ubah name/description/status sesuai kebutuhan.
3. Untuk menonaktifkan: toggle status ke Inactive — tagging hilang dari select2 produk.

### Assign ke produk

1. Buka **Product General Configuration** atau **Product Inventory Configuration**.
2. Di panel spesifikasi/tagging produk, pilih tagging dari select2.
3. Simpan konfigurasi produk.

## 5. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Tagging tidak muncul di select2 produk | Status inactive | Aktifkan tagging |
| Gagal simpan — code/name already taken | Duplikat per company | Gunakan code/name lain |
| Gagal delete | Masih dipakai produk | Lepas dari produk dulu, lalu hapus |
| Select2 kosong | Tidak ada tagging active | Buat tagging baru dengan status Active |

## 6. FAQ

**Q: Apa bedanya Tagging dengan Item Category?**  
A: Item Category adalah hierarki kategori produk. Tagging adalah label fleksibel yang bisa banyak per produk.

**Q: Apakah satu produk bisa punya banyak tagging?**  
A: Ya, via tabel `scm_product_taggings`.

**Q: Di menu mana tagging di-assign ke produk?**  
A: Product General Configuration, Product Inventory Configuration, dan form Product legacy (`select2-tagging`).

## 7. Relasi Menu

| Menu terkait | Route | Hubungan |
|--------------|-------|----------|
| Product General Configuration | `supplychain/product-general-configuration` | Assign tagging ke SKU |
| Product Inventory Configuration | `supplychain/product-inventory-configuration` | Assign tagging ke SKU |
| System Product | `supplychain/product` | Select2 tagging legacy |

## Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Technical | [technical.md](./technical.md) |
