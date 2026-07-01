---
doc_type: knowledge-base
menu: generalsetting-currency
menu_name: "Master Currency"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
audience: operator
sections:
  core: [what-is, glossary, can-cannot, faq, help]
  modular: [data-source, status-badge, how-to, troubleshooting]
---

# Master Currency — Knowledge Base

> **Draft — 2026-06-19** — Dokumentasi AS-IS dari kode production. Belum review QA/PM; jangan jadikan referensi final.

## 1. Apa itu Master Currency?

**Master Currency** mendefinisikan mata uang (code, symbol, name) dan relasi ke satu atau lebih **Country** (max 10 per currency). **Primary currency** (config `currency.primary.id`) dilindungi — tidak bisa edit/delete dari UI.

## 2. Glosarium

| Istilah | Arti |
|---------|------|
| **Primary Currency** | Mata uang utama sistem (IDR default) |
| **Country mapping** | Pivot currency ↔ countries |
| **has_relation** | Currency dipakai di company bank / employee bank |

## 3. Yang Bisa / Tidak Bisa Dilakukan

### Bisa
- CRUD currency non-primary
- Link hingga 10 countries per currency
- Audit log

### Tidak Bisa
- Edit/delete primary currency
- Delete currency yang sudah dipakai (companyBank/employeeBank)
- Update/delete jika relasi aktif — delete button hidden di datalist

## 4. Cara Pakai (How-To)

1. **General Setting → Master Currency** → Create.
2. Isi Code, Name, Symbol; pilih countries (opsional, max 10).
3. Save — currency tersedia di select2 transaksi/company payment.

## 5. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Delete disabled | Relasi bank atau primary | Lepas relasi / bukan primary |
| "limited to 10 data options" | Terlalu banyak country | Kurangi pilihan country |

## 6. FAQ

**Q: Kenapa baris primary tidak punya edit/delete?**
A: `CurrencyController@index` render custom action "Primary Currency".
