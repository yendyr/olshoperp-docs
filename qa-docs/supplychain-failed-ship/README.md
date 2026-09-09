# Failed Ship — Dokumentasi QA

Menu **Failed Ship** (Supply Chain / OmniChannel / Accounting).

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) (v2.7) | Operator, Support | review |
| Requirement | [requirement.md](./requirement.md) (v2.7) | PM, QA | review |
| Technical | [technical.md](./technical.md) (v2.7) | Developer | review |
| User Guide | [user-guide.md](./user-guide.md) (v1.2) | Publish eksternal (Notion/Lark) | review |

**Sumber requirement bisnis:** `failed_ship_requirement.md` (23 Juni 2026)  
**User-guide:** v1.2 · `source_version` 2.7  
**Version (3 layer):** 2.7 · **Last updated:** 2026-09-09  
**Import E2E brief:** `~/Downloads/failed-ship-import-e2e-implementer-brief.md`  
**Completion Summary mockup:** [Claude Artifact](https://claude.ai/code/artifact/3f60e9e8-b275-45b0-b568-227c627050f0)

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 2.0–2.3 | 2026-06-26 | Konsolidasi FS, eligibility, cross-menu stock flow |
| 2.4 | 2026-07-15 | Relasi Sales Platform |
| 2.5 / ug-1.0 | 2026-07-23 | User-guide v1.0; KB Mermaid |
| 2.6 / ug-1.1 | 2026-07-23 | **TO-BE Import FS** (§5.5 / technical §12); G-05 approve + import |
| 2.7 / ug-1.2 | 2026-09-09 16:02 | **TO-BE Completion Summary** pasca-approve (A-32 / §5.4) — [ETM-15889](https://erpintegration.atlassian.net/browse/ETM-15889); slideover qty 3 arah, timeline, dokumen TFI/SD/TFS, dampak Instant Settlement |

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

Alur lengkap: [requirement.md §3.6](./requirement.md#36-peta-relasi-menu-fulfillment--failed-ship--settlement) · Import: [§5.5](./requirement.md#55-import-failed-ship--to-be) · Completion Summary: [§5.4](./requirement.md#54-completion-summary--to-be)

**Maintenance owner:** QA — Yemima
