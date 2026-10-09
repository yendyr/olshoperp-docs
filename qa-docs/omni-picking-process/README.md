# Picking Process — Dokumentasi

Menu **Picking Process** (Omni Channel) — approve transfer internal ke virtual WH wave (`sequence = 1`). **Bukan** Picking List.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator gudang | review |
| Requirement | [requirement.md](./requirement.md) | PM, QA, Dev | review |
| Technical | [technical.md](./technical.md) | Developer | review |
| User Guide | [user-guide.md](./user-guide.md) | Publish | review |

**Last updated:** 2026-10-09 · **Maintenance:** QA — Yemima

## Route & code

- **FE:** `/omni/picking-process`
- **BE:** `TransferPickingController` → `StockMutationTransferController`
- **Scope:** destination `warehouse.sequence = 1`

## Bukan menu ini / pasangan List

| Menu | Perbedaan |
|------|-----------|
| [Picking List](../omni-picking-list/README.md) | Dokumen picklist operasional (scan item, pause, complete) — TO-BE review |
| [Waves Management](../omni-waves-management/README.md) | Konfigurasi wave |

**Relasi Failed Ship:** tahap #1 (PL) — [requirement](./requirement.md)
