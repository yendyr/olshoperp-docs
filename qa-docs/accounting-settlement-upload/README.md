# Instant Settlement — Dokumentasi

Menu **Instant Settlement** (Accounting) — juga dikenal sebagai Upload Settlement, Settlement Order, atau Platform Settlement.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) (v2.1) | Operator | review |
| Requirement | [requirement.md](./requirement.md) (v2.1) | PM, QA | review |
| Technical | [technical.md](./technical.md) (v2.1) | Developer | review |
| User Guide | [user-guide.md](./user-guide.md) (v2.1) | Publish eksternal | review |
| Feature Map | [feature-map.md](./feature-map.md) (v1.1) | Operator (Lingo index) | review |
| Capability Lingo | [capabilities/](./capabilities/) | Operator (modal cards) | review |

**UI route:** `/accounting/settlement-upload`  
**Note (2026-10-29):** Antrean **In Queue** (1 generate global + jeda 10 menit) — [ETM-16060](https://erpintegration.atlassian.net/browse/ETM-16060) QA Review; penyempurnaan [ETM-16910](https://erpintegration.atlassian.net/browse/ETM-16910) / stuck [ETM-16911](https://erpintegration.atlassian.net/browse/ETM-16911); SI kosong [ETM-16895](https://erpintegration.atlassian.net/browse/ETM-16895) Done.  
**Note (2026-09-23):** Shopee Instant Settlement pakai format **Penghasilan** — [ETM-16058](https://erpintegration.atlassian.net/browse/ETM-16058).  
**Note (2026-09-09):** Delete/Revert AR luar vs IS — [ETM-15886](https://erpintegration.atlassian.net/browse/ETM-15886).  
**Help Center overview:** belum ada di `_meta/docs-hub/menus/accounting-settlement-upload/` (skip sampai dibuat).  
**TO-BE plan (terpisah):** [Platform Generate API→CSV→batch](../../superpowers/plans/2026-10-28-instant-settlement-platform-generate.md) — belum di layer requirement sampai implementasi.

**Menu terkait (Fase 1):** [Settlement Mapping](../accounting-settlement-mapping/README.md) · [Store](../omni-store-binding/README.md) · [Outbound](../supplychain-mutation-outbound/README.md) · [Sales Invoice](../accounting-customer-invoice/README.md) · [Account Receive](../accounting-customer-payment/README.md) · [Failed Ship](../supplychain-failed-ship/README.md) · [Other Cost](../omni-other-cost/README.md) · [Other Discount](../omni-other-discount/README.md)  
**Acuan antrean:** [Skip Wave Process](../omni-skip-wave-process/README.md)

## Changelog

| Date | Changes |
|------|---------|
| 2026-10-29 | v2.1 antrean In Queue ETM-16060 + TO-BE 16910/16911 + guard 16895 |
| 2026-10-22 | v2.0 ETM-16763 OC/OD SI settlement |
| 2026-09-28 | Feature Map + Lingo cards |
| 2026-09-23 | Shopee Penghasilan ETM-16058 |
| 2026-09-09 | Delete/Revert ETM-15886 |
| 2026-09-01 | Approve same calendar date ETM-15701 |

**Maintenance owner:** QA — Yemima
