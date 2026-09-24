# Instant Settlement — Dokumentasi

Menu **Instant Settlement** (Accounting) — juga dikenal sebagai Upload Settlement, Settlement Order, atau Platform Settlement.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) (v1.9) | Operator | review |
| Requirement | [requirement.md](./requirement.md) (v1.9) | PM, QA | review |
| Technical | [technical.md](./technical.md) (v1.8) | Developer | review |
| User Guide | [user-guide.md](./user-guide.md) (v1.3) | Publish eksternal | review |

**UI route:** `/accounting/settlement-upload`  
**Note (2026-09-23):** Shopee Instant Settlement pakai format **Penghasilan** (header row 3, hanya baris `Lihat berdasarkan`=`Order`) — format `Income` lama tidak didukung — [ETM-16058](https://erpintegration.atlassian.net/browse/ETM-16058) · sample [GDrive](https://docs.google.com/spreadsheets/d/1kgz3P6ucScl4Uxr6iiZOa8bbV2d0OdooZU4JTD5qmaw/edit?usp=sharing).  
**Note (2026-09-09):** Delete/Revert bedakan AR dari Approve Instant Settlement vs AR luar; bulk Delete ikut eligibility — [ETM-15886](https://erpintegration.atlassian.net/browse/ETM-15886).  
**Note (2026-09-04):** Booking Shopee unmatched tidak match Instant Settlement sampai **MATCHED** / Platform Order ID terisi — dual-path anti-dupe di [Sales Platform](../omni-sales-platform/README.md) § Booking (GAP-BOOK-01 / GAP-BOOK-02).  
**Note (2026-09-01):** Approve wajib same calendar date pada semua SI batch (V-23); tanggal/jam AR dari SI — [ETM-15701](https://erpintegration.atlassian.net/browse/ETM-15701).  
**Help Center overview:** belum ada di `_meta/docs-hub/menus/accounting-settlement-upload/` (skip sampai dibuat).

**Menu terkait (Fase 1):** [Settlement Mapping](../accounting-settlement-mapping/README.md) · [Store](../omni-store-binding/README.md) · [Outbound](../supplychain-mutation-outbound/README.md) · [Sales Invoice](../accounting-customer-invoice/README.md) · [Account Receive](../accounting-customer-payment/README.md) · [Failed Ship](../supplychain-failed-ship/README.md) · [Other Cost](../omni-other-cost/README.md) · [Other Discount](../omni-other-discount/README.md) (template General `OC:`/`OD:` — [§4.6](./requirement.md))

**Menu terkait (Fase 2):** [Dev - Sales Order](../sales-order-general/README.md) · [Dev - Sales Platform](../omni-sales-platform/README.md) · [All Sales Order](../all-sales-order/README.md) · [Waves](../omni-waves-management/README.md) · [Picking Process](../omni-picking-process/README.md) · [Delivery Order](../supplychain-delivery-order/README.md) · [Product COA Group](../accounting-product-coa-group/README.md) · [Fiscal Period](../accounting-fiscal-period/README.md) · [Journal](../journal/README.md)

**Rantai stok fulfillment (audit TF Internal + Show Virtual):** Picking → Checking → Packing → Collecting → DO → 3PL → optional [Failed Ship](../supplychain-failed-ship/requirement.md#36-peta-relasi-menu-fulfillment--failed-ship--settlement)

**Menu terkait (Fase 3):** [General Company](../generalsetting-general-company/README.md) · [System Product](../system-product/README.md) · [Checking Process](../omni-checking-process/README.md) · [Packing Process](../omni-packing-process/README.md) · [Checking List](../omni-checking-list/README.md) · [Packing List](../omni-packing-list/README.md)

Diagram integrasi: [requirement.md §10](./requirement.md#10-relasi-menu--integrasi)

## Changelog

| Date | Changes |
|------|---------|
| 2026-09-23 17:03 | Shopee: format **Penghasilan** (row 3 header, hanya baris Order, mapping dari header order) — GAP-SETU-01 / ETM-16058; format Income lama dihentikan |
| 2026-09-09 13:14 | Delete/Revert: boleh untuk rantai murni IS (termasuk AR Approve); block AR luar; bulk Delete ikut eligibility (ETM-15886) |
| 2026-09-04 11:53 | Cross-ref booking **MATCHED** / dual-path anti-dupe (SP §3b · GAP-BOOK-02) |
| 2026-09-01 17:05 | Approve Instant Settlement: SI dalam batch wajib same calendar date; AR date/time dari SI (ETM-15701) — sync KB/requirement/technical/UG |
| 2026-07-15 | Booking unmatched tidak match Instant Settlement |

**Maintenance owner:** QA — Yemima
