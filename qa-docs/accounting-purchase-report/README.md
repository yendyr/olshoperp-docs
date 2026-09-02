# Purchase Report — Dokumentasi QA

Menu **Purchase Report** (Accounting → Report) — laporan pembelian per SKU per supplier, dua POV (**Purchase Order** / **Purchase Invoice**) dalam satu menu.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator, Support | review |
| Feature Map | [feature-map.md](./feature-map.md) | PM, QA, Support | review |
| Requirement | [requirement.md](./requirement.md) | PM, QA | review |
| Technical | [technical.md](./technical.md) | Developer | review |
| User Guide | [user-guide.md](./user-guide.md) | Publish / onboarding | review |
| Capability cards | [capabilities/](./capabilities/) | Lingo / MenuDoc | review |

**Help Center overview:** [ID](../_meta/docs-hub/menus/accounting-purchase-report/overview.id.md) · [EN](../_meta/docs-hub/menus/accounting-purchase-report/overview.en.md) (`authored` ID + derived EN, review)

**UI route:** `/accounting/purchase-report`  
**SoT:** [`_meta/sot/accounting-purchase-report-source-of-truth.md`](../_meta/sot/accounting-purchase-report-source-of-truth.md) v1.0  
**Jira SoT:** [ETM-15673](https://erpintegration.atlassian.net/browse/ETM-15673) · [ETM-15674](https://erpintegration.atlassian.net/browse/ETM-15674)  
**3 layer + UG:** v2.1 / UG v1.1 · **Last updated:** 2026-09-02 ~16:30

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 2.1 | 2026-09-02 ~16:30 | Supplier tampil **kode saja**; header group = **Supplier Code** + total (bukan nama). Cari tetap by nama+kode; export tanpa nama. Parent ETM-15721 / ETM-15729 |
| HC 1.0 | 2026-09-01 13:07 | Help Center Purchase Report ID (authored) + EN translation — dual tab PO/PI, supplier grouping, export per tab |
| 2.1 | 2026-09-01 12:55 | Feature Map v1.0 + 3 capability Lingo (dual tab, supplier group, export per tab); Help Center ditunda sesi terpisah |
| 2.0 | 2026-08-31 17:00 | AS-IS dari ETM-15673/15674 + dual-tab shell; SOT + 5-file review |
| 1.0 | 2026-08-12 | Initial TO-BE (belum implementasi) |

## Key notes (AS-IS)

- Dual **tab** PO / PI (bukan radio blank)  
- Default tanggal FE: **bulan berjalan** (GAP vs card 30 hari)  
- Group supplier = **Supplier Code** + total di header; Total Tagihan kolom = line  
- Semua status; PO With+Without PR; currency as-is; no Other Cost/Disc; no AP / PO↔PI join  

## Related menus

| Menu | Peran |
|------|--------|
| [Purchase Order](../supplychain-purchase-order/) | Sumber tab PO |
| [Purchase Invoice](../accounting-supplier-invoice/) | Sumber tab PI |
| Account Payable Report | **Tidak** terkait |

**Maintenance owner:** QA — Yemima
