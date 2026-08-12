# Failed Ship — Dokumentasi QA

Menu **Failed Ship** (Supply Chain / OmniChannel / Accounting).

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator, Support | review |
| Requirement | [requirement.md](./requirement.md) | PM, QA | review |
| Technical | [technical.md](./technical.md) | Developer | review |
| User Guide | [user-guide.md](./user-guide.md) | Publish eksternal (Notion/Lark) | review |

**Sumber requirement bisnis:** `failed_ship_requirement.md` (23 Juni 2026)  
**User-guide:** v1.1 · `source_version` 2.6  
**Version (3 layer):** 2.6 · **Last updated:** 2026-07-23  
**Import E2E brief:** `~/Downloads/failed-ship-import-e2e-implementer-brief.md`

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 2.0–2.3 | 2026-06-26 | Konsolidasi FS, eligibility, cross-menu stock flow |
| 2.4 | 2026-07-15 | Relasi Sales Platform |
| 2.5 / ug-1.0 | 2026-07-23 | User-guide v1.0; KB Mermaid |
| 2.6 / ug-1.1 | 2026-07-23 | **TO-BE Import FS** (§5.5 / technical §12); G-05 approve + import |

## Menu terkait (pergerakan stok)

| # | Menu | Alasan relasi |
|---|------|---------------|
| 1 | [Transfer Internal](../supplychain-mutation-transfer-internal/technical.md#8-relasi-failed-ship--rantai-fulfillment) | Audit TF virtual (Show Virtual) |
| 2 | [Picking Process](../omni-picking-process/requirement.md#relasi-failed-ship) | Tahap #1 fulfillment |
| 3 | [Checking Process](../omni-checking-process/requirement.md#relasi-failed-ship) | Tahap #2 |
| 4 | [Packing Process](../omni-packing-process/requirement.md#relasi-failed-ship) | Tahap #3 + Collecting |
| 5 | [Delivery Order](../supplychain-delivery-order/technical.md#8-relasi-failed-ship--collecting--shipped-3pl) | Shipped ke 3PL — prasyarat FS |
| 6 | [Sales Order](../sales-order-general/requirement.md) | Referensi order & status FS |
| 7 | [Instant Settlement](../accounting-settlement-upload/requirement.md) | Block FS open; qty net setelah FS |
| 8 | [Sales Return](../accounting-sales-return/README.md) | Jalur pasca-settlement |

Alur lengkap: [requirement.md §3.6](./requirement.md#36-peta-relasi-menu-fulfillment--failed-ship--settlement) · Import: [§5.5](./requirement.md#55-import-failed-ship--to-be)

**Maintenance owner:** QA — Yemima
