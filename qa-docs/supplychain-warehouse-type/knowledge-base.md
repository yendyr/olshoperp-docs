---
doc_type: knowledge-base
menu: supplychain-warehouse-type
menu_name: "Warehouse Level"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
audience: operator
sections:
  core: [what-is, glossary, can-cannot, faq, help]
  modular: [data-source, status-badge, how-to, troubleshooting]
---

# Warehouse Level — Knowledge Base

> **DRAFT** — Dokumen ini adalah draft awal hasil analisis codebase otomatis per 2026-06-19. Perlu direview PM/QA sebelum final.

## 1. Apa itu Warehouse Level?

**Warehouse Level** (backend: Warehouse Space Type) mendefinisikan tingkatan hierarki struktur gudang — misalnya Company, Building, Floor, Zone, Rack. Setiap level punya angka **Level** unik yang menentukan urutan parent–child di **Warehouse Structure**.

## 2. Glosarium

| Istilah | Arti |
|---------|------|
| **Level** | Angka urutan hierarki (unik per company pada create) |
| **Show in Report** | Level muncul di laporan / select2 report |
| **Warehouse Space Type** | Nama entitas di database (`scm_warehouse_space_types`) |

## 3. Yang Bisa / Tidak Bisa Dilakukan

### Bisa
- Buat level dengan name, level number, description
- Toggle status, all company, show in report
- Edit level (level number dapat diubah jika `owned_by != null`)
- Hapus level yang belum dipakai warehouse structure

### Tidak Bisa
- Hapus level yang sudah punya record di `scm_warehouses` (delete button disembunyikan)
- Duplikasi angka level saat create

## 4. Cara Pakai (How-To)

1. **SCM → Master → Warehouse Level**.
2. **Create** → isi Name, **Level** (angka), Description.
3. Konfigurasi **Active**, **Show in Report**, **All Company**.
4. Gunakan level ini saat membuat node di **Warehouse Structure**.

## 5. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Tidak bisa hapus | Sudah ada warehouse | Hapus/pindahkan warehouse dulu |
| Level duplicate | `level` sudah ada | Pilih angka lain |

## 6. FAQ

**Q: Mengapa menu disebut Warehouse Level bukan Space Type?**
A: Label UI di seeder `menu_text = Warehouse Level`; API route tetap `warehouse-type`.
