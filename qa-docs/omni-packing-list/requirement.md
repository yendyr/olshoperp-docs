---
doc_type: requirement
menu: omni-packing-list
menu_name: "Packing List"
version: 1.0
last_updated: 2026-06-23
owner: QA - Yemima
status: draft
---

# Packing List — Requirement Documentation

> **DRAFT** — Cross-reference Instant Settlement (Fase 3). Konten requirement penuh menu ini masih disusun.

**Modul:** SupplyChain / OmniChannel  
**UI route:** `/omni/packing-list`

---

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-06-23 | QA - Yemima | Cross-reference Relasi Instant Settlement (Fase 3) |

---

## 1. Ringkasan Eksekutif

**Packing List** adalah dokumen operasional daftar barang yang harus dikemas setelah checking. Approve packing list/transfer lanjut ke **Collecting/Shipping List**. Berbeda dari [Packing Process](../omni-packing-process/requirement.md).

---

## Relasi Instant Settlement

**Dampak ke menu ini:** Tahap **Pack** operasional — blocking jika packing belum selesai; downstream collecting & DO tidak jalan → settlement V-04 Shipped gagal.

**Prasyarat dari menu ini agar settlement lolos:** Checking selesai; packing list approved; collecting (`PROCESS_TYPE_SHIPPING`) & DO mengikuti SOP.

**Independensi:** Outbound settlement **tidak** otomatis dari approve packing list (ETM-10761). Packing doc tetap ada setelah delete settlement.

**Detail alur bulk:** [Instant Settlement](../accounting-settlement-upload/requirement.md) · [Delivery Order](../supplychain-delivery-order/requirement.md)

Diagram integrasi: [Instant Settlement §10](../accounting-settlement-upload/requirement.md#10-relasi-menu--integrasi).

---

## Related Documents

| Doc | Path |
|-----|------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| Technical | technical.md *(pending)* |
| Packing Process | [../omni-packing-process/requirement.md](../omni-packing-process/requirement.md) |
| Instant Settlement | [../accounting-settlement-upload/requirement.md](../accounting-settlement-upload/requirement.md) |
