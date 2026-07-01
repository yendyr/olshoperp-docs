---
doc_type: knowledge-base
menu: supplychain-master-brand
menu_name: "Master Brand"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
audience: operator
sections:
  core: [what-is, glossary, can-cannot, faq, help]
  modular: [data-source, status-badge, how-to, troubleshooting]
---

# Master Brand — Knowledge Base

> **DRAFT** — Dokumen ini adalah draft awal hasil analisis codebase otomatis per 2026-06-19. Perlu direview PM/QA sebelum final.

## 1. Apa itu Master Brand?

**Master Brand** menyimpan merek produk yang dipakai di produk sistem dan integrasi omni-channel. Data disimpan di tabel `omni_brands` tetapi dikelola dari menu SCM. Datalist menampilkan nama brand dan platform terkait (jika ada).

## 2. Glosarium

| Istilah | Arti |
|---------|------|
| **Brand** | Nama merek produk |
| **Platform** | Marketplace/channel (kolom relasi `platform_id`) |
| **Active** | Brand dapat dipilih di transaksi jika status aktif |

## 3. Yang Bisa / Tidak Bisa Dilakukan

### Bisa
- Buat brand dengan name (wajib) dan description
- Aktif/nonaktif via toggle status
- Edit dan soft delete brand
- Bulk delete dari datalist
- Audit log per brand

### Tidak Bisa
- Set `is_all_company` dari form SCM (controller force `0`)
- Create brand dengan platform dari form SCM standar (field platform tidak di store SCM controller)

## 4. Cara Pakai (How-To)

1. Buka **SCM → Master → Brand**.
2. **Create** → isi **Name**, opsional **Description**, toggle **Active**.
3. Simpan — brand muncul di select2 produk (`product/select2-brand`).
4. Untuk edit/hapus gunakan action di datalist.

## 5. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Brand tidak muncul di dropdown produk | Status inactive | Aktifkan status |
| Kolom Platform kosong | Brand dibuat manual tanpa `platform_id` | Normal untuk brand internal |

## 6. FAQ

**Q: Apakah sama dengan menu Brand di Omni Channel?**
A: Model sama (`omni_brands`); menu Omni master-brand di-comment di seeder, SCM memakai `BrandController` modul SupplyChain.

**Q: Apakah bisa filter brand per platform?**
A: API `select2Brand` mendukung query `platform_id`; form SCM create tidak mengisi platform.
