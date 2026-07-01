---
doc_type: knowledge-base
menu: supplychain-warehouse-layout
menu_name: "Warehouse Layout"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
audience: operator
sections:
  core: [what-is, glossary, can-cannot, faq, help]
  modular: [data-source, status-badge, how-to, troubleshooting]
---

# Warehouse Layout — Knowledge Base

> **DRAFT** — Dokumen ini adalah draft awal hasil analisis codebase otomatis per 2026-06-19. Perlu direview PM/QA sebelum final.

## 1. Apa itu Warehouse Layout?

**Warehouse Layout** menyimpan snapshot/layout struktur gudang yang di-**import** dari file Excel. Setiap layout punya nama, deskripsi, file arsip, dan detail baris yang mereferensi node **Warehouse Structure** yang sudah ada.

## 2. Glosarium

| Istilah | Arti |
|---------|------|
| **Layout** | Header record import (`scm_warehouse_layouts`) |
| **Layout Detail** | Baris warehouse dalam layout (`scm_warehouse_layout_details`) |
| **Template** | File `warehouse-layout-default.xlsx` di FE public |

## 3. Yang Bisa / Tidak Bisa Dilakukan

### Bisa
- Import layout baru via upload Excel (create + validasi + import)
- Lihat datalist name/description
- Edit name/description layout existing
- Lihat detail tree/grid per layout
- Hapus layout (detail + file dihapus via job)
- Download template Excel dari datalist

### Tidak Bisa
- Create layout manual tanpa file Excel (tidak ada `store` CRUD biasa — hanya `import`)
- Import file non-xlsx atau melebihi ukuran config upload

## 4. Cara Pakai (How-To)

1. **SCM → Master → Warehouse Layout**.
2. Download **template** jika perlu.
3. **Create** / Import → isi Name, Description, upload file `.xlsx`.
4. Setelah sukses, buka detail untuk melihat tree warehouse dalam layout.
5. Edit metadata atau hapus layout jika tidak dipakai.

## 5. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Import gagal validasi | Format Excel salah | Ikuti template |
| File too large | > config upload size | Perkecil file |
| Layout kosong | Warehouse code di Excel tidak match | Pastikan struktur sudah ada |

## 6. FAQ

**Q: Apakah import mengubah Warehouse Structure?**
A: Import memetakan ke warehouse existing (`WhLayoutImport`) — bukan membuat struktur baru (verifikasi di QA).
