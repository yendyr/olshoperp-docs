# QA Menu Documentation

Dokumentasi requirement & knowledge base per menu OlshopERP — dioptimalkan untuk agent, RAG, dan Cursor.

> **Agent/Cursor:** Protokol wajib di `.cursor/rules/09-menu-documentation.mdc` (**alwaysApply**). Skill: `.cursor/skills/qa-menu-documentation/SKILL.md`. Jangan pakai `_legacy/` sebagai canonical.

## Agent protocol (ringkas)

| Aksi | Wajib |
|------|-------|
| Jawab pertanyaan menu/fitur | Baca `manifest.yaml` → `{menu-slug}/README.md` → layer doc |
| Buat menu doc baru | Folder `{menu-slug}/` + template + entry manifest |
| Update doc | Edit canonical di folder menu; sync `status` manifest ↔ frontmatter |
| Implementasi kode | Baca requirement + technical; ingatkan update doc jika behavior berubah |

**Larangan:** flat file di root `qa-docs/` · `_legacy/` sebagai sumber · manifest tanpa update commit.

## Mulai di sini (agent / human)

1. Baca **`_meta/manifest.yaml`** — source of truth semua menu, status doc, legacy sources, code globs
2. Buka folder `{menu-slug}/README.md` untuk menu yang relevan
3. Pilih layer doc sesuai audience:
   - `knowledge-base.md` — operator / ops
   - `requirement.md` — PM, QA, support
   - `technical.md` — developer

## Struktur

```
docs/qa-docs/
├── _meta/
│   ├── manifest.yaml          ← WAJIB dibaca agent dulu
│   ├── MERMAID_STYLE_GUIDE.md ← standar penulisan diagram Mermaid
│   └── templates/             ← template doc baru
├── _legacy/                   ← reference only (jangan jadi canonical)
├── {menu-slug}/
│   ├── README.md
│   ├── knowledge-base.md
│   ├── requirement.md
│   └── technical.md
└── README.md                  ← file ini
```

## Menu terdaftar

**Total:** 118 menu di `_meta/manifest.yaml` — in-app help aktif untuk modul `OmniChannel`, `Accounting`, `SupplyChain`, `Gate`, `GeneralSetting`.

| Modul | Jumlah menu | Contoh slug |
|-------|-------------|-------------|
| OmniChannel | 12 | [manage-platform-product](./manage-platform-product/), [omni-sales-platform](./omni-sales-platform/), [sales-order-general](./sales-order-general/), [all-sales-order](./all-sales-order/) |
| Accounting | 42 | [journal](./journal/), [general-ledger](./general-ledger/) |
| SupplyChain | 55 | [system-product](./system-product/), [bill-of-material](./bill-of-material/) |
| Gate | 3 | [gate-user](./gate-user/), [gate-role](./gate-role/) |
| GeneralSetting | 6 | [generalsetting-country](./generalsetting-country/), [generalsetting-application](./generalsetting-application/) |

Menu dengan konten lengkap (review/draft):

| Slug | Menu | KB | Req | Tech |
|------|------|----|-----|------|
| [manage-platform-product](./manage-platform-product/) | Manage Platform Product | review | review | review |
| [general-ledger](./general-ledger/) | General Ledger Report | review | draft | draft |
| [journal](./journal/) | Journal | review | review | draft |
| [omni-sales-platform](./omni-sales-platform/) | Dev - Sales Platform | review | review | review |
| [sales-order-general](./sales-order-general/) | Dev - Sales Order | review | review | draft |
| [all-sales-order](./all-sales-order/) | All Sales Order | review | review | review |
| [system-product](./system-product/) | System Product | review | draft | draft |
| [bill-of-material](./bill-of-material/) | Bill of Material | review | review | draft |
| [random-sku](./random-sku/) | Random SKU (cross-menu) | review | review | draft |

**Draft batch 2026-06-19** (hasil analisis codebase, perlu review PM/QA):

| Batch | Slug |
|-------|------|
| SCM fulfillment | [supplychain-purchase-order](./supplychain-purchase-order/), [supplychain-delivery-order](./supplychain-delivery-order/), [supplychain-stock-opname](./supplychain-stock-opname/) |
| SCM lengkap (41 menu) | Semua folder `supplychain-*` — KB + requirement + technical **draft** |
| Accounting operasional | [accounting-customer-invoice](./accounting-customer-invoice/), [accounting-supplier-invoice](./accounting-supplier-invoice/), [accounting-trial-balance](./accounting-trial-balance/) |
| Omni prioritas tinggi | [omni-store-binding](./omni-store-binding/), [omni-warehouse-binding](./omni-warehouse-binding/), [omni-waves-management](./omni-waves-management/), [omni-picking-process](./omni-picking-process/) |
| Gate + General Settings | [gate-user](./gate-user/), [gate-role](./gate-role/), [gate-global-audit-log](./gate-global-audit-log/), [generalsetting-*](./generalsetting-country/) (6 menu) |

Sisanya: stub `knowledge-base.md` status **pending** — konten diisi berkala oleh QA.

Status detail semua menu: lihat `_meta/manifest.yaml`.

## Dokumentasi lain di repo

| Path | Isi | Untuk agent |
|------|-----|-------------|
| `docs/api/{module}/routes.md` | API route listing per modul | Cek endpoint & controller |
| `docs/db-schema/{module}/*.md` | Schema per tabel | Cek kolom & relasi DB |
| `docs/workflow.json` | n8n RAG chatbot workflow | Integrasi Telegram docs bot |

**Catatan:** Laravel Boost MCP tidak mengindeks `docs/qa-docs/` — gunakan manifest + glob rule `.cursor/rules/09-menu-documentation.mdc`.

## Menambah menu baru

1. Copy template dari `_meta/templates/`
2. Buat folder `{menu-slug}/` + `README.md`
3. Update `_meta/manifest.yaml` (commit yang sama)
4. Sinkronkan `status` frontmatter dengan manifest

**Maintenance owner:** QA — Yemima
