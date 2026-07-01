---
doc_type: knowledge-base
menu: generalsetting-region
menu_name: "Master Region"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
audience: operator
sections:
  core: [what-is, glossary, can-cannot, faq, help]
  modular: [data-source, status-badge, how-to, troubleshooting]
---

# Master Region — Knowledge Base

> **Draft — 2026-06-19** — Dokumentasi AS-IS dari kode production. Belum review QA/PM; jangan jadikan referensi final.

## 1. Apa itu Master Region?

**Master Region** menyimpan wilayah administratif berhierarki dengan **kode bertitik** (contoh: `{phone_code}.{province}.{city}...`). Dipakai cascade dropdown alamat: Province → City → District → Village.

## 2. Glosarium

| Istilah | Arti |
|---------|------|
| **Code** | Identifier unik hierarki (unique per table) |
| **Province** | Level 1 under country phone_code |
| **City / District / Village** | Level deeper — panjang code 8 / 11 / 16 chars |

## 3. Yang Bisa / Tidak Bisa Dilakukan

### Bisa
- CRUD region master
- Select2 cascade by type (city, district, village)
- Resolve full region path (`showRegion`)

### Tidak Bisa
- Duplicate code — unique validation

## 4. Cara Pakai (How-To)

1. Pastikan **Country** dengan phone_code benar sudah ada.
2. Create region dengan **code** unik dan **name**.
3. Di form alamat company, pilih country → province → city → dst via select2 API.

## 5. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| "Invalid Country" di province | phone_code format | Fix country phone_code |
| Dropdown city kosong | code parent salah | Cek hierarchy code segments |

## 6. FAQ

**Q: Apa arti panjang code?**
A: AS-IS: city CHAR_LENGTH 8, district 11, village 16 — filter di `select2Region`.
