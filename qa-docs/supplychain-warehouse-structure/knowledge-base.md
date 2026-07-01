---
doc_type: knowledge-base
menu: supplychain-warehouse-structure
menu_name: "Warehouse Structure"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
audience: operator
sections:
  core: [what-is, glossary, can-cannot, faq, help]
  modular: [data-source, status-badge, how-to, troubleshooting]
---

# Warehouse Structure — Knowledge Base

> **DRAFT** — Dokumen ini adalah draft awal hasil analisis codebase otomatis per 2026-06-19. Perlu direview PM/QA sebelum final.

## 1. Apa itu Warehouse Structure?

**Warehouse Structure** mengelola hierarki lokasi fisik gudang: dari entity company/building hingga rack/bin. Setiap node punya **Warehouse Level**, parent, alamat (opsional), owner company, dan dapat memicu **generator** child otomatis (prefix + jumlah).

## 2. Glosarium

| Istilah | Arti |
|---------|------|
| **Node / Warehouse** | Satu record struktur (`scm_warehouses`) |
| **Parent** | Node induk di pohon (`scm_warehouse_trees`) |
| **Virtual warehouse** | Child otomatis `is_virtual=1` untuk proses (picking, scrap, dll.) |
| **Generator** | Job batch membuat child warehouse dari prefix/amount |
| **Manage by** | Internal vs external (3PL) |
| **Drop-off** | Flag khusus parent inbound |

## 3. Yang Bisa / Tidak Bisa Dilakukan

### Bisa
- Buat/edit node dengan code (tanpa spasi), name, level, parent
- Konfigurasi alamat (country → village), phone
- Generate child warehouses via prefix (alphabet) + amount
- Lihat tree structure; audit header + address
- Hapus leaf warehouse tanpa child (dan tanpa relasi stok)

### Tidak Bisa
- Ubah parent jika node masih punya stok (`have_stocks`)
- Hapus parent yang masih punya child warehouse
- Parent yang dipakai Warehouse Setting (void/scrap/out rack) sebagai target tertentu — diblok saat create child
- Code mengandung spasi

## 4. Cara Pakai (How-To)

### Membuat building baru
1. **SCM → Master → Warehouse Structure** → **Create**.
2. Isi Code, Name, pilih **Warehouse Level** dan **Parent** (jika bukan root).
3. Pilih **Owner Company**, **Manage By**.
4. Opsional: isi alamat; konfigurasi generator (space type id, prefix, amount).
5. Simpan — job generator dapat berjalan di background.

### Menghapus node
1. Pastikan tidak ada child dan tidak ada stok.
2. Delete dari datalist — virtual children ikut dibersihkan.

## 5. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Parent field disabled | Masih ada stok | Kosongkan stok dulu |
| "Parent data can't be deleted..." | Masih ada child | Hapus child dulu |
| Generator tidak jalan | Batch job pending | Cek Horizon `warehouse-generator` |
| Code error spasi | Regex validation | Hapus spasi dari code |

## 6. FAQ

**Q: Kenapa route `warehouse-structure` tapi API `warehouse`?**
A: Frontend route alias; backend resource `Route::resource('/warehouse', WarehouseController)`.

**Q: Apa hubungannya dengan Warehouse Setting?**
A: Building level 19 dipakai untuk mapping scrap/void/out rack di menu Setting.
