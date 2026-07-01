---
doc_type: knowledge-base
menu: generalsetting-internal-company
menu_name: "Internal Company"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
audience: operator
sections:
  core: [what-is, glossary, can-cannot, faq, help]
  modular: [data-source, status-badge, how-to, troubleshooting]
---

# Internal Company — Knowledge Base

> **Draft — 2026-06-19** — Dokumentasi AS-IS dari kode production. Belum review QA/PM; jangan jadikan referensi final.

## 1. Apa itu Internal Company?

**Internal Company** adalah entitas perusahaan **internal** (`company_type = internal`) — organisasi yang memakai OlshopERP (bukan partner/customer). Mendukung **parent tree**, business field, logo, kontak, alamat, dokumen, COA setup, dan inisialisasi data gudang/akuntansi saat create.

Company dengan `owned_by = null` ditampilkan sebagai **Super Company** di datalist.

## 2. Glosarium

| Istilah | Arti |
|---------|------|
| **Internal Company** | `gs_companies.company_type = internal` |
| **Company Tree** | `gs_internal_company_trees` — parent-child |
| **Business Field** | Klasifikasi industri (multi via pivot) |
| **Public Data** | Sharing data antar internal company |

## 3. Yang Bisa / Tidak Bisa Dilakukan

### Bisa
- CRUD internal company (scoped + own company bypass)
- Logo upload
- Sub-resource: contacts, addresses, documents (bulk delete)
- Tree view parent company
- Audit comprehensive (tree, contacts, addresses, documents, accounting)

### Tidak Bisa
- Sembarang user lihat semua internal company — scoped by token company
- Create duplicate code — unique validation

## 4. Cara Pakai (How-To)

### Buat internal company baru
1. **General Setting → Master Company → Internal Company** → Create.
2. Isi Code, Name; pilih parent (opsional), business field, NPWP/GST.
3. Save — sistem dapat trigger seed COA, warehouse, fiscal period (AS-IS heavy create flow).

### Kelola alamat
1. Edit company → tab Address → country wajib, province & city wajib on create.
2. Cascade region select2.

## 5. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Company tidak di list | Company scope | Login company yang benar / super admin |
| Create lambat | Background jobs COA/warehouse | Tunggu / cek Horizon |

## 6. FAQ

**Q: Beda Internal vs General Company?**
A: Internal = organisasi sendiri; General = partner (customer/supplier/shipper). Lihat [generalsetting-general-company](../generalsetting-general-company/knowledge-base.md).
