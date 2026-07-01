---
doc_type: knowledge-base
menu: supplychain-dimension-and-weight-label
menu_name: "Dimension and Weight Label"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
audience: operator
---

# Dimension and Weight Label — Knowledge Base

> **DRAFT** — Dokumen ini adalah draft awal hasil analisis codebase otomatis per 2026-06-19. Perlu direview PM/QA sebelum final.

## 1. Apa itu Dimension and Weight Label?

**Dimension and Weight Label (DnW Label)** adalah master **profil kemasan/pengiriman** (mis. "Small Box", "Platform Default") yang dipasang ke produk beserta ukuran (L×W×H) dan berat. Master label di `scm_dimension_and_weights`; assignment per produk di `scm_product_dn_ws`.

| Item | Nilai |
|------|-------|
| Menu | Supply Chain → Master → Dimension and Weight Label |
| Route UI | `/supplychain/dimension-and-weight-label` |
| API prefix | `supplychain/dimension-and-weight` |
| Tabel master | `scm_dimension_and_weights` |
| Tabel assignment | `scm_product_dn_ws` |

## 2. Glosarium

| Istilah | Arti |
|---------|------|
| DnW Label | Master label dimensi/berat (code, name) |
| `is_primary` | Label utama per company — hanya satu yang boleh primary |
| Product DnW | Assignment label + ukuran aktual ke SKU/unit |
| `is_unit_default` | Default untuk unit produk |
| `is_platform_default` | Default untuk sync platform |
| `is_trx_default` | Default untuk transaksi |
| Shipping Information | Panel produk tempat mengisi Product DnW |

## 3. Yang Bisa / Tidak Bisa Dilakukan

### Bisa

- CRUD master label DnW
- Menandai satu label sebagai **Primary** (auto-unset label primary lain)
- Assign label + ukuran ke produk via Shipping Information
- Pilih label di select2 produk (General/Inventory Configuration)
- Lihat audit log master label

### Tidak Bisa

- Menghapus label yang masih dipakai produk (`ProductDnW`)
- Menghapus label **Primary** tanpa menetapkan primary baru
- Menonaktifkan primary sebagai satu-satunya label primary tanpa pengganti
- Duplikasi `code` per company

## 4. Cara Pakai (How-To)

### Buat label master

1. Buka **Dimension and Weight Label** → **Create**.
2. Isi Code (unik), Name, Description.
3. Centang **Primary** jika label ini default global (hanya satu primary aktif).
4. Simpan.

### Assign ke produk

1. Buka **Product General/Inventory Configuration** → edit SKU.
2. Buka panel **Shipping Information**.
3. Pilih label DnW, isi length/width/height/weight per baris.
4. Tentukan default flags jika perlu.
5. Simpan — sistem propagate ke variant child jika applicable.

### Ganti primary label

1. Edit label baru → set Primary = Yes.
2. Sistem otomatis unset primary pada label lama.

## 5. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Gagal delete label | Masih dipakai produk atau label primary | Lepas dari produk / assign primary baru |
| Dua label primary | Race/manual DB | Edit salah satu → unset primary |
| Label tidak muncul di select2 | Status inactive | Aktifkan label |
| UI path vs API beda | UI `dimension-and-weight-label`, API `dimension-and-weight` | Normal — gunakan API path di integrasi |

## 6. FAQ

**Q: Apakah name label harus unik?**  
A: Tidak divalidasi unique di controller (hanya code unique).

**Q: Di mana ukuran fisik diisi?**  
A: Di panel Shipping Information produk, bukan di menu master label.

**Q: Siapa pakai data DnW?**  
A: Failed Ship (hitung berat/dimensi), shipping SO, platform sync.

## 7. Relasi Menu

| Menu | Hubungan |
|------|----------|
| Product General Configuration | Shipping Information + select2 DnW |
| Product Inventory Configuration | Shipping Information + select2 DnW |
| Failed Ship | Perhitungan berat/dimensi paket |
| Sales Order | Dimension stacking via `generateTotalDimension` |

## Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Technical | [technical.md](./technical.md) |
