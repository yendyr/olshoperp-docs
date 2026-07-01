---
doc_type: knowledge-base
menu: supplychain-warranty
menu_name: "Master Warranty"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
audience: operator
---

# Master Warranty — Knowledge Base

> **DRAFT** — Dokumen ini adalah draft awal hasil analisis codebase otomatis per 2026-06-19. Perlu direview PM/QA sebelum final.

## 1. Apa itu Master Warranty?

**Master Warranty** adalah data referensi **jenis garansi** produk yang dipakai bersama modul Supply Chain dan OmniChannel. Data disimpan di tabel `omni_warranties` meskipun menu berada di SCM Master.

| Item | Nilai |
|------|-------|
| Menu | Supply Chain → Master → Master Warranty |
| Route UI | `/supplychain/warranty` |
| API prefix | `supplychain/warranty` |
| Tabel utama | `omni_warranties` |

## 2. Glosarium

| Istilah | Arti |
|---------|------|
| Warranty | Master garansi (code, name, description) |
| `status` | 1 = Active; 0 = Inactive |
| `is_all_company` | Dibagikan ke semua company dalam grup |
| Select2 Warranty | Dropdown garansi aktif di form produk/PO |

## 3. Yang Bisa / Tidak Bisa Dilakukan

### Bisa

- Buat, edit, hapus (soft delete) master warranty
- Aktif/nonaktifkan warranty
- Assign warranty ke produk via Product Configuration
- Pilih warranty di Purchase Order detail (select2)
- Lihat audit log per record

### Tidak Bisa

- Menggunakan warranty inactive di select2
- Duplikasi `code` atau `name` dalam company yang sama
- Mengubah struktur garansi per transaksi (hanya master reference)

## 4. Cara Pakai (How-To)

### Buat warranty baru

1. Buka **Master Warranty** → **Create**.
2. Isi **Code** (unik), **Name** (unik), **Description** (opsional).
3. Set status **Active**.
4. Simpan.

### Assign ke produk

1. Buka **Product General Configuration** atau **Product Inventory Configuration**.
2. Di panel spesifikasi, pilih warranty dari select2.
3. Simpan produk.

### Nonaktifkan

1. Edit warranty → toggle status Inactive.
2. Warranty tidak lagi muncul di dropdown produk/PO.

## 5. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Warranty tidak muncul di select2 | Status inactive | Aktifkan warranty |
| Code/name already taken | Duplikat | Gunakan nilai unik lain |
| Data warranty beda di Omni vs SCM | Satu tabel `omni_warranties` | Perubahan di menu mana pun memengaruhi keduanya |

## 6. FAQ

**Q: Kenapa tabelnya `omni_warranties` padahal menu di SCM?**  
A: Entity SCM `Warranty` extends model OmniChannel — shared master data.

**Q: Di mana warranty dipakai selain master?**  
A: Product configuration, Purchase Order detail (`select2-warranty`).

## 7. Relasi Menu

| Menu terkait | Route | Hubungan |
|--------------|-------|----------|
| Product General Configuration | `supplychain/product-general-configuration` | Assign warranty ke SKU |
| Product Inventory Configuration | `supplychain/product-inventory-configuration` | Assign warranty ke SKU |
| Purchase Order | `supplychain/purchase-order` | Select2 warranty di detail PO |
| Omni Master Warranty | `omni/warranty` (legacy) | Controller duplikat, tabel sama |

## Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Technical | [technical.md](./technical.md) |
