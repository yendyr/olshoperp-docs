---
doc_type: knowledge-base
menu: gate-global-audit-log
menu_name: "Global Audit Log"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
audience: operator
sections:
  core: [what-is, glossary, can-cannot, faq, help]
  modular: [data-source, status-badge, how-to, troubleshooting]
---

# Global Audit Log — Knowledge Base

> **Draft — 2026-06-19** — Dokumentasi AS-IS dari kode production. Belum review QA/PM; jangan jadikan referensi final.

## 1. Apa itu Global Audit Log?

**Global Audit Log** menampilkan jejak perubahan data (**audit trail**) dari seluruh modul OlshopERP dalam satu datalist. Menu ini **read-only** — tidak ada create, edit, atau delete dari UI maupun API resource actions yang aktif.

Berguna untuk investigasi: siapa mengubah apa, kapan, nilai lama vs baru, dan sumber model (`auditable_type`).

## 2. Glosarium

| Istilah | Arti |
|---------|------|
| **Audit** | Record di tabel `audits` (package auditing) |
| **Event** | created / updated / deleted |
| **Old/New values** | JSON snapshot field yang berubah |
| **Trx code** | Kode transaksi terkait via `audit_codes` |
| **Source** | `auditable_type` — class model sumber |

## 3. Yang Bisa / Tidak Bisa Dilakukan

### Bisa
- Filter, sort, search kolom datalist (termasuk SearchBuilder advanced)
- Filter tanggal, user, event, trx code, old/new values

### Tidak Bisa
- Create / edit / delete audit record
- Export — tidak ada endpoint export dedicated di controller (cek FE jika ada generic export)

## 4. Cara Pakai (How-To)

1. Buka **Setting → Global Audit Log**.
2. Gunakan filter kolom (user, tanggal, event, source, trx code).
3. Klik baris untuk detail jika FE mendukung expand/modal.

## 5. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Log kosong | Filter terlalu ketat / rentang tanggal | Reset filter |
| User name aneh | User dihapus / pakai employee name | Normal — fallback ke HR employee concat |

## 6. FAQ

**Q: Beda dengan audit per menu?**
A: Audit per entitas (mis. `GET gate/user/{id}/audit`) scoped ke record itu. Global Audit Log = semua audit lintas sistem.
