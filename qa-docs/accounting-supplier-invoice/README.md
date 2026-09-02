# Purchase Invoice — Dokumentasi QA

Menu **Purchase Invoice** (Accounting / Account Payable).

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator, Support | review |
| Feature Map | [feature-map.md](./feature-map.md) | Operator, QA (Lingo index) | review |
| Requirement | [requirement.md](./requirement.md) | PM, QA | review |
| Technical | [technical.md](./technical.md) | Developer | review |
| User Guide | [user-guide.md](./user-guide.md) | Publish eksternal (Notion/Lark) | review |
| Capability cards (pilot) | [capabilities/](./capabilities/) | Lingo-style SF Entry | review |

**UI route:** `/accounting/supplier-invoice`  
**Feature Map:** [feature-map.md](./feature-map.md) (tab MenuDoc)  
**Shared capabilities:** [../_meta/shared-capabilities/](../_meta/shared-capabilities/)  
**Proposal:** [../_meta/proposals/feature-map-and-capability-lingo.md](../_meta/proposals/feature-map-and-capability-lingo.md)  
**User-guide:** v1.6 · `source_version` 3.8  
**Help Center overview:** [ID](../_meta/docs-hub/menus/accounting-supplier-invoice/overview.id.md) · [EN](../_meta/docs-hub/menus/accounting-supplier-invoice/overview.en.md) (`authored`, review)  
**Version (requirement):** 3.7 · **KB:** 3.8 · **Technical:** 3.6 · **Feature Map:** 1.1 · **Last updated:** 2026-09-02

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 3.7–3.8 | 2026-09-02 ~16:30 | Supplier tampil **kode saja** di daftar/form/export (cari tetap by nama+kode; nama boleh di Print). Parent ETM-15721 / ETM-15724 |
| status | 2026-08-12 14:58 | Promote 5-file + Feature Map/Lingo + Help Center overview ke **review** (paket sudah lengkap; update berikutnya hanya bila ada improvement / change requirement) |
| 3.3 | 2026-07-23 | TO-BE Supplier's Invoice Amount + Invoice Diff |
| 3.4 | 2026-07-24 | Pilot Feature Map + SF Entry (shared + capabilities/) |
| 3.5 | 2026-07-24 | Restore full KB; MenuDoc layer links (no SPA .md 404) |
| 3.5b | 2026-07-27 | Feature Map → tab `feature-map.md`; Label UI = Lingo click; auto-highlight lintas layer |
| 3.6 | 2026-07-27 | Rounding SoT **final**: GAP-PI-05 Accepted (UI-only); Invoice Total/jurnal exact; export 4dp GAP-PI-07; UG v1.4 |
| 3.7 | 2026-07-27 | Contoh Case 4/5 di KB/UG/Lingo; SF-PRICE-01 shared; SF-TOT-01 contoh angka |
| HC-ID 1.1 | 2026-07-29 | Help Center Purchase Invoice versi Indonesia diperbarui agar lebih ramah dan mudah dipahami pengguna |

## Related menus

| Menu | Link |
|------|------|
| Purchase Inbound | [../supplychain-new-purchase-inbound/](../supplychain-new-purchase-inbound/) — eligible SKU |
| Purchase Order | [../supplychain-purchase-order/](../supplychain-purchase-order/) — harga, tax, cost/disc |
| Account Payment | [../accounting-supplier-payment/](../accounting-supplier-payment/) — pelunasan |
| Debit Note | [../accounting-debit-note/](../accounting-debit-note/) — potong hutang via AP; DN dari PR billed |
| Purchase Return | [../accounting-purchase-return/](../accounting-purchase-return/) — retur billed → DN |

**Maintenance owner:** QA — Yemima
