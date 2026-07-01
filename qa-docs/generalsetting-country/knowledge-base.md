---
doc_type: knowledge-base
menu: generalsetting-country
menu_name: "Master Country"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
audience: operator
sections:
  core: [what-is, glossary, can-cannot, faq, help]
  modular: [data-source, status-badge, how-to, troubleshooting]
---

# Master Country — Knowledge Base

> **Draft — 2026-06-19** — Dokumentasi AS-IS dari kode production. Belum review QA/PM; jangan jadikan referensi final.

## 1. Apa itu Master Country?

**Master Country** menyimpan referensi negara: kode ISO, ISO-3, nama, phone code, dll. Dipakai di alamat company, region hierarchy, currency-country mapping, dan select2 di form lain.

## 2. Glosarium

| Istilah | Arti |
|---------|------|
| **ISO / ISO-3** | Kode negara 2 & 3 huruf |
| **Phone code** | Prefix telepon (dipakai sebagai segmen pertama kode region) |
| **Nice name** | Nama tampilan (select2 pakai nice_name) |

## 3. Yang Bisa / Tidak Bisa Dilakukan

### Bisa
- CRUD country (add/update/delete per role menu)
- Soft delete dengan deleted_by
- Select2 active countries (`status = 1`)
- Audit log per country

### Tidak Bisa
- Hapus country yang masih direferensi modul lain — cek relasi di QA (AS-IS: soft delete langsung)

## 4. Cara Pakai (How-To)

1. **General Setting → Master Country**.
2. Create: isi ISO, ISO-3, Name, Phone Code (wajib numerik).
3. Toggle Status & All Company sesuai kebijakan.
4. Save — country muncul di dropdown alamat & region.

## 5. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Country tidak muncul di select2 | status inactive | Aktifkan status |
| Region provinsi error | phone_code invalid | Perbaiki phone_code country |

## 6. FAQ

**Q: Phone code dipakai untuk apa selain telepon?**
A: `RegionController@select2Province` memakai `country.phone_code` sebagai prefix kode region.
