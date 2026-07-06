---
doc_type: knowledge-base
menu: supplychain-unit
menu_name: "Unit"
version: 2.0
last_updated: 2026-07-04
owner: QA - Yemima
status: review
audience: operator
sections:
  core: [what-is, glossary, workflow, ui-buttons, conversion-helper, troubleshooting, faq]
---

# Unit — Knowledge Base

## Apa itu Unit?

**Unit** (Master Unit) mendefinisikan satuan pengukuran produk dan transaksi — PCS, Box, KG, Meter, dll. Setiap unit masuk ke **Unit Class** dengan **1 Base Unit** sebagai acuan konversi.

| Item | Nilai |
|------|-------|
| Menu | Supply Chain → Master → Unit |
| Route UI | `/supplychain/unit` |
| API | `supplychain/unit` |

### Nilai Bisnis

- Standarisasi satuan di seluruh PO, SO, Inbound, Outbound, BoM, Assembly
- Konversi otomatis ke base unit saat transaksi disimpan
- Fleksibilitas rate per produk (jika rate master kosong)

---

## Glosarium

| Istilah | Arti |
|---------|------|
| Unit Class | Kelompok satuan sejenis (Pieces, Mass, Length, Volume, Time, dll.) |
| Base Unit | Satuan acuan dalam class; conversion rate = 1 |
| Conversion Rate | Faktor ke base unit (≤ 1). Contoh: 1 KG = 1000 Gr → rate KG = 0.001 |
| Default Primary Unit | Unit default saat buat System Product baru |
| Active | Unit muncul di dropdown transaksi |
| Show for All Company | Unit visible ke semua company (public) |

---

## Prasyarat

- **Unit Class** sudah ada (menu terpisah, 15 class default dari seeder)
- Pahami class mana yang dipakai produk (Pieces untuk qty, Mass untuk berat, Length untuk dimensi, dll.)

---

## Alur Kerja Operator

### Langkah 1 — Buat Unit Baru

1. Buka **Supply Chain → Master → Unit → Create**
2. Isi **Code*** dan **Name***
3. Pilih **Unit Class***
4. Isi **Conversion Rate** (kosongkan jika ingin flexible di System Product nanti)
5. Baca **notice kuning**: jika ini unit pertama di class, sistem otomatis jadi **Base Unit**
6. Klik **Save & Next**

### Langkah 2 — Edit / Toggle (halaman Edit)

| Field | Perilaku |
|-------|----------|
| Code / Name | Locked jika base unit, deleted, atau tidak punya `can_update` |
| Unit Class | Locked jika unit sudah punya relasi transaksi |
| Conversion Rate | Locked jika sudah punya relasi — tooltip: hanya affect produk baru |
| Active | Auto-save — OFF = tidak muncul di selector transaksi baru |
| Show for All Company | Auto-save — hanya untuk data milik company sendiri |
| Set as Default to System Product | Auto-save — max 1 per scope |

### Langkah 3 — Hapus Unit

- **Base unit:** tombol Delete **tidak tampil** di datalist
- **Non-base:** bisa delete jika belum dipakai System Product (primary atau alternate unit)
- Bulk delete tersedia di datalist

---

## UI/UX — Tombol & Fitur

### Datalist

| Tombol/Fitur | Fungsi |
|--------------|--------|
| **Create** | Form unit baru |
| **Edit** | Edit unit |
| **Delete** | Hapus (hidden untuk base unit) |
| **Conversion Helper** | Kalkulator konversi antar unit (breadcrumb) |
| **Advanced Filter** | Filter kolom |
| **Show Deleted** | Tampilkan soft-deleted |
| **Export Excel** | Export kolom visible + default audit columns |
| **Bulk Delete** | Hapus banyak row sekaligus |

Row **grouped by Unit Class name**.

### Form Create

| Field | Wajib | Catatan |
|-------|-------|---------|
| Code | ✓ | Max 50 karakter, unique |
| Name | ✓ | Max 50 karakter |
| Unit Class | ✓ | Tidak bisa diubah jika sudah relasi |
| Conversion Rate | — | > 0, ≤ 1; kosong = flexible di produk |
| Description | — | Max 150 karakter |
| Default Primary | — | Toggle |
| Active | — | Default ON |
| Show for All Company | — | Hanya jika `own_data` |

**Notice kuning (Create only):**

> *If you create the first unit in this class, the system will automatically set it as the base unit.*

---

## Conversion Helper

Tool kalkulator di datalist (ikon breadcrumb):

1. Masukkan **Origin Value**
2. Pilih **Origin Unit**
3. Pilih **Destination Unit** (hanya unit dalam class yang sama)
4. Hasil muncul real-time

**Contoh:** 2 Meter → Centimeter = 200 (jika base Length = Millimeter)

---

## Default Data Sistem (Ringkas)

| Class | Base | Contoh lain |
|-------|------|-------------|
| Pieces | PCS | EA, BX (0.1), UNT, KIT, SET (rate 1) |
| Mass | Gr | Kg (0.001), T (0.000001), Ons |
| Length | MM* | Cm (0.1), M (0.001) |

\* Fresh install: MM base. Environment yang menjalankan `FixUnitSeeder` bisa punya base **Cm** — tanyakan admin jika konversi Length terasa aneh.

---

## Yang Bisa / Tidak Bisa

### Bisa

- Buat unit dengan code, name, class, rate
- Set default primary unit
- Edit unit tanpa relasi transaksi
- Hapus non-base yang belum dipakai produk
- Nonaktifkan unit (tidak muncul di dropdown baru)
- Lihat audit log

### Tidak Bisa

- Hapus base unit dari UI
- Ubah conversion rate / unit class jika sudah punya relasi
- Hapus unit yang dipakai System Product
- Konversi lintas Unit Class di helper tool

---

## Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Conversion Rate tidak bisa diedit | Unit sudah dipakai transaksi | Buat unit baru; jangan ubah rate lama |
| Unit tidak muncul di dropdown | Status **Inactive** | Aktifkan toggle Active |
| Delete gagal "already have relations" | Dipakai di System Product | Lepas dari produk dulu atau nonaktifkan |
| Unit pertama langsung jadi Base | By design — class belum punya base | Pastikan pilihan class benar sebelum save |
| Konversi Length aneh | Base unit environment berbeda (MM vs Cm) | Cek dengan admin / Conversion Helper |

---

## FAQ

**Q: Apa beda rate diisi vs kosong di master?**  
A: Diisi = fixed saat assign ke produk. Kosong = bisa diisi per produk di alternate unit.

**Q: Kenapa EA/UNT/KIT rate-nya 1 padahal bukan base?**  
A: Diizinkan — satuan setara 1:1 dengan PCS dalam class Pieces.

**Q: Apa beda Base Unit vs Default Primary?**  
A: Base = acuan konversi dalam class. Default Primary = default saat create System Product.

**Q: Nonaktifkan unit yang sudah dipakai transaksi lama?**  
A: Bisa — histori tetap; hanya tidak bisa dipilih di transaksi baru.

---

## Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Technical | [technical.md](./technical.md) |
| System Product | [../system-product/requirement.md](../system-product/requirement.md) |
| Bill of Material | [../bill-of-material/requirement.md](../bill-of-material/requirement.md) |
| Assembly | [../supplychain-assembly/requirement.md](../supplychain-assembly/requirement.md) |
