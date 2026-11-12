# Sales Return Approval — Dokumentasi (Finance)

Menu **Sales Return** di modul **Finance Accounting** — review harga/COGS dan **Complete** approval.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator Finance | review |
| Feature Map | [feature-map.md](./feature-map.md) | Operator, QA (Lingo index) | draft |
| Requirement | [requirement.md](./requirement.md) | PM, QA | review |
| Technical | [technical.md](./technical.md) | Developer | review |
| User Guide | [user-guide.md](./user-guide.md) | Publish eksternal (Notion/Lark) | review |
| Capability cards | [capabilities/](./capabilities/) | Lingo-style SF Entry | draft |

**UI route:** `/accounting/sales-return`  
**Help Center overview:** [`_meta/docs-hub/menus/accounting-sales-return/`](../_meta/docs-hub/menus/accounting-sales-return/)  
**Canonical E2E:** [supplychain-sales-returns/](../supplychain-sales-returns/)  
**3 layer version:** 2.8 · **User-guide:** v1.4 · `source_version` 2.8 · **Feature Map:** 1.0 · **Last updated:** 2026-11-12

**Maintenance owner:** QA — Yemima

---

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2026-11-12 | 2.8 | GAP-SR-16: contoh angka yang jelas (retur dulu lalu SI = piutang 48.000; SI dulu lalu retur Unbilled lama = 50.000), pembanding Purchase Return, Failed Ship vs retur pada qty SI. Gate di Complete dilacak di ETM-17365 |
| 2026-11-12 | 2.7 | Koreksi GAP-SR-16: jalur pembuat SI setelah retur ada sudah mengurangi qty retur; yang terbukti adalah Complete tanpa gate status SI sehingga retur Unbilled lama ber-SI approved (18 di Staging) bisa di-Complete tanpa pembalik Sales/AR. Deskripsi header SR tidak bisa diedit lewat aplikasi |
| 2026-11-12 | 2.6 | GAP-SR-16 dilengkapi kronologi dan skenario: SI Open ditolak saat Create Return; retur Unbilled tanpa pembalik Sales/AR bila SI approve setelah retur dibuat atau retur lama (definisi lama) masih Open. Staging: 64 dari 66 retur Unbilled (97,0%) bertaut SI approved, 18 Open. Docs saja, belum ada card Jira. User-guide tidak berubah konten (hanya `source_version`) |
| 2026-11-12 | 2.5 | Jurnal retur Unbilled (belum ada SI) hanya Return Inventory / COGS, tanpa jurnal Sales/AR dan tanpa Credit Note; selaras Purchase Return Unbilled. Gap kode GAP-SR-16 (ETM-17064, TC ETM-17291) |
| 2026-11-04 16:37 | 2.4 | Export All: tanpa rincian satu baris per dokumen, dengan rincian satu baris per SKU dan harga terisi. Dokumen tanpa SKU tetap satu baris, tetapi angka rincian masih 0 bukan tanda strip. Kolom yang disembunyikan di daftar masih ikut ke Excel (ETM-17067) |
| 2026-11-04 13:30 | 2.3 | Syarat minimal satu qty retur berlaku untuk seluruh dokumen saat Complete, bukan untuk tiap baris saat simpan (ETM-17054) |
| 2026-11-04 | 2.2 | Billed = ada SI / Unbilled = belum SI (bukan AR); parity Purchase Return; ETM-17064 |
| 2026-07-05 | 2.0 | Finance layer docs created; canonical flow di supplychain-sales-returns v2.0 |
| 2026-07-29 | 2.0b | Feature Map + 5 capability cards; user-guide v1.0 (review); Help Center overview en/id |

---

## Route & code

| Item | Path |
|------|------|
| UI | `/accounting/sales-return` |
| API | `accounting/sales-returns` |
| FE | `olshoperp-frontend/src/pages/Accounting/Return/SalesReturn/` |

**Canonical E2E requirement:** [supplychain-sales-returns/requirement.md](../supplychain-sales-returns/requirement.md)

---

## Relasi Failed Ship & Sales Return (SCM)

| Kondisi order | Menu |
|---------------|------|
| Shipped, **belum** SI & Outbound | [Failed Ship](../supplychain-failed-ship/requirement.md) |
| Sudah SI & Outbound | [Sales Return SCM](../supplychain-sales-returns/requirement.md) + **menu ini (Finance)** |

Qty return ≤ qty outbound per SKU. Pill platform di Failed Ship vs Sales Return: filter outbound terbalik — [FS §4.0.5](../supplychain-failed-ship/requirement.md).

---

## Related menus

- [Sales Return SCM](../supplychain-sales-returns/README.md) — input qty gudang
- [Credit Note](../accounting-credit-note/README.md) — auto-generated billed returns
- [Customer Invoice](../accounting-customer-invoice/) — source price & tax
- [Failed Ship](../supplychain-failed-ship/README.md) — pre-settlement
