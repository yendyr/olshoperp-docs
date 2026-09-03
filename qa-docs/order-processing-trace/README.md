# Order Processing Trace — Dokumentasi QA

Menu **Order Processing Trace** — laporan read-only referensi proses fulfillment per **Sales Order** (general + platform).

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator, Support | draft |
| Requirement | [requirement.md](./requirement.md) | PM, QA | draft |
| Technical | [technical.md](./technical.md) | Developer | draft |
| Feature Map | [feature-map.md](./feature-map.md) | QA, PM, Operator (Lingo) | draft |
| Capability (Lingo) | [capabilities/](./capabilities/) | Operator (modal `?`) | draft |
| User Guide | user-guide.md | Publish eksternal | pending |

**SoT:** [`_meta/sot/order-processing-trace-source-of-truth.md`](../_meta/sot/order-processing-trace-source-of-truth.md) v1.4  
**Jira:** [ETM-15713](https://erpintegration.atlassian.net/browse/ETM-15713)  
**Route:** `/supplychain/order-processing-trace` (modul **SupplyChain → Report** saja)  
**3 layer:** v1.1 draft · **Last updated:** 2026-09-03 09:23

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.1 | 2026-09-03 09:23 | Entry sidebar **SCM Report saja** (hapus dual Omni); SoT v1.4 |
| 1.1.1 | 2026-09-02 13:11 | Hapus referensi dev/QA brief lokal; AC → SoT §10 + Jira ETM-15713 |
| 1.1 | 2026-09-02 10:10 | Feature Map + 6 capability Lingo cards (SF-OPT-01..06) untuk modal Help & Docs Page |
| 1.0 | 2026-09-02 10:00 | Split SOT v1.3 → 5-file canonical; manifest entry; TO-BE spec ETM-15713 |

## Menu terkait

| Menu | Peran |
|------|--------|
| [All Sales Order](../all-sales-order/) | Monitor SO gabungan — bukan trace ref proses |
| [Dev - Sales Order](../sales-order-general/) | Sumber baris general |
| [Dev - Sales Platform](../omni-sales-platform/) | Sumber baris platform |
| [Skip Wave Process](../omni-skip-wave-process/) | Skip Wave Process No |
| Picking / Checking / Packing Process | Ref upstream |
| Delivery Order, Failed Ship, Outbound | Ref downstream |
| [Sales Order Report](../omni-sales-order-report/) | **Bukan** menu ini (revenue harian) |

**Maintenance owner:** QA — Yemima
