# Instant Settlement — Dokumentasi

Menu **Instant Settlement** (Accounting) — juga dikenal sebagai Upload Settlement, Settlement Order, atau Platform Settlement.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator | review |
| Requirement | [requirement.md](./requirement.md) (v1.6) | PM, QA | review |
| Technical | [technical.md](./technical.md) | Developer | review |

**UI route:** `/accounting/settlement-upload`  
**Note (2026-07-15):** Booking Shopee unmatched (`platform_order_id` null) tidak match Instant Settlement — lihat [Sales Platform](../omni-sales-platform/README.md) GAP-BOOK-01.  
**Menu terkait (Fase 1):** [Settlement Mapping](../accounting-settlement-mapping/README.md) · [Store](../omni-store-binding/README.md) · [Outbound](../supplychain-mutation-outbound/README.md) · [Sales Invoice](../accounting-customer-invoice/README.md) · [Account Receive](../accounting-customer-payment/README.md) · [Failed Ship](../supplychain-failed-ship/README.md) · [Other Cost](../omni-other-cost/README.md) · [Other Discount](../omni-other-discount/README.md) (template General `OC:`/`OD:` — [§4.6](./requirement.md))

**Menu terkait (Fase 2):** [Dev - Sales Order](../sales-order-general/README.md) · [Dev - Sales Platform](../omni-sales-platform/README.md) · [All Sales Order](../all-sales-order/README.md) · [Waves](../omni-waves-management/README.md) · [Picking Process](../omni-picking-process/README.md) · [Delivery Order](../supplychain-delivery-order/README.md) · [Product COA Group](../accounting-product-coa-group/README.md) · [Fiscal Period](../accounting-fiscal-period/README.md) · [Journal](../journal/README.md)

**Rantai stok fulfillment (audit TF Internal + Show Virtual):** Picking → Checking → Packing → Collecting → DO → 3PL → optional [Failed Ship](../supplychain-failed-ship/requirement.md#36-peta-relasi-menu-fulfillment--failed-ship--settlement)

**Menu terkait (Fase 3):** [General Company](../generalsetting-general-company/README.md) · [System Product](../system-product/README.md) · [Checking Process](../omni-checking-process/README.md) · [Packing Process](../omni-packing-process/README.md) · [Checking List](../omni-checking-list/README.md) · [Packing List](../omni-packing-list/README.md)

Diagram integrasi: [requirement.md §10](./requirement.md#10-relasi-menu--integrasi)

**Maintenance owner:** QA — Yemima
