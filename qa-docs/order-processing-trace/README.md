# Order Processing Trace — Dokumentasi QA

Menu **Order Processing Trace** — laporan read-only referensi fulfillment per Sales Order (general + platform).

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator, Support | review |
| Requirement | [requirement.md](./requirement.md) | PM, QA | review |
| Technical | [technical.md](./technical.md) | Developer | review |
| Feature Map | [feature-map.md](./feature-map.md) | QA, PM, Operator | review |
| Capability (Lingo) | [capabilities/](./capabilities/) | Operator | draft |
| User Guide | [user-guide.md](./user-guide.md) | Publish | review |

**SoT:** [`_meta/sot/order-processing-trace-source-of-truth.md`](../_meta/sot/order-processing-trace-source-of-truth.md) v1.4  
**Jira:** [ETM-15713](https://erpintegration.atlassian.net/browse/ETM-15713) — **TO-BE** (belum di kode)  
**Route:** `/supplychain/order-processing-trace` (SCM → Report)  
**3 layer:** v1.1 review · **Last updated:** 2026-10-09

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.1-review | 2026-10-09 | Promote layers + UG ke review; tetap TO-BE implementasi |
| 1.1 | 2026-09-03 | Entry sidebar SCM Report saja |
| 1.0 | 2026-09-02 | Split SOT → canonical |

## Menu terkait

| Menu | Peran |
|------|--------|
| [Picking / Checking / Packing Process](../omni-picking-process/README.md) | Ref TF stage |
| [Picking / Checking / Packing List](../omni-picking-list/README.md) | Ref dokumen list operasional |
| [Delivery Order](../supplychain-delivery-order/README.md) · [Failed Ship](../supplychain-failed-ship/README.md) | Downstream |
| [Skip Wave Process](../omni-skip-wave-process/README.md) | Skip Wave ref |

**Maintenance owner:** QA — Yemima
