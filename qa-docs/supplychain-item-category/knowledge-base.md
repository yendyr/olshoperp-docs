---
doc_type: knowledge-base
menu: supplychain-item-category
menu_name: "Item Category"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
audience: operator
sections:
  core: [what-is, glossary, can-cannot, faq, help]
  modular: [data-source, status-badge, how-to, troubleshooting]
---

# Item Category — Knowledge Base

> **DRAFT** — Dokumen ini adalah draft awal hasil analisis codebase otomatis per 2026-06-19. Perlu direview PM/QA sebelum final.

## 1. Apa itu Item Category?

**Item Category** mengelompokkan produk sistem (system product) dalam hierarki parent–child. Kategori dipakai saat membuat/mengedit produk, konfigurasi COA, dan filter select2 di modul Supply Chain.

## 2. Glosarium

| Istilah | Arti |
|---------|------|
| **Parent Group** | Kategori induk dalam pohon hierarki |
| **Default System Product** | Kategori otomatis untuk produk baru (`is_default`) |
| **All Company** | Data terlihat lintas perusahaan jika aktif |
| **View only** | Data sistem (`created_by = 0`, `is_all_company`) — tidak bisa diedit/dihapus |

## 3. Yang Bisa / Tidak Bisa Dilakukan

### Bisa
- Buat kategori dengan code, name, parent opsional, description
- Set satu kategori sebagai default per company
- Aktif/nonaktif status; toggle all company (data milik company sendiri)
- Lihat audit log per record
- Hapus kategori (soft delete) jika bukan default dan tidak punya child

### Tidak Bisa
- Edit/hapus kategori sistem global (`created_by = 0` + `is_all_company`)
- Hapus kategori yang masih jadi default
- Hapus kategori yang punya child di pohon
- Set parent yang membuat siklus hierarki

## 4. Cara Pakai (How-To)

### Membuat kategori baru
1. Buka **SCM → Master → Item Category** → **Create**.
2. Isi **Code** dan **Name** (wajib).
3. Pilih **Parent Group Name** jika perlu sub-kategori.
4. Opsional: aktifkan **Set as Default System Product**, **Active**, **Show for all company**.
5. Simpan.

### Mengubah kategori
1. Datalist → **Edit** pada baris kategori.
2. Ubah field yang diizinkan; parent mengikuti aturan pohon.
3. Jika menonaktifkan default terakhir, sistem menolak.

## 5. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| "Item category cannot be changed" | Data sistem global | Buat kategori baru milik company |
| "Cannot delete... default" | `is_default = 1` | Set default ke kategori lain dulu |
| "Parent Not found" | Parent tidak valid | Pilih parent aktif dari select2 |
| Kategori tidak muncul di dropdown | Status inactive / scope company | Aktifkan status; cek all company |

## 6. FAQ

**Q: Berapa level hierarki yang didukung?**
A: Mengikuti `TreeHandlerTrait` — parent tidak boleh menutup siklus; child mengikuti status parent saat update.

**Q: Apakah kategori terhubung ke akuntansi?**
A: Field `coa_id` ada di model; form Vue saat ini fokus code/name/parent — integrasi COA lewat modul terkait.
