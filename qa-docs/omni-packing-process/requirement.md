---
doc_type: requirement
menu: omni-packing-process
menu_name: "Packing Process"
version: 1.1
last_updated: 2026-06-26
owner: QA - Yemima
status: draft
---

# Packing Process — Requirement Documentation

> **DRAFT** — Cross-reference Instant Settlement (Fase 3). Konten requirement penuh menu ini masih disusun.

**Modul:** OmniChannel  
**UI route:** `/omni/packing-process`  
**API:** `omnichannel/transfer-packing/*`  
**Controller:** `TransferPackingController` → delegates to `StockMutationTransferController`

---

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-06-23 | QA - Yemima | Cross-reference Relasi Instant Settlement (Fase 3) |
| 1.1 | 2026-06-26 | QA - Yemima | Relasi Failed Ship — pergerakan stok tahap packing & collecting |

---

## 1. Ringkasan Eksekutif

**Packing Process** approve **Stock Mutation Transfer** packing → virtual WH shipping/collected. Setelah approve packing, sistem siapkan **Collecting/Shipping List** (`PROCESS_TYPE_SHIPPING`) — prasyarat [Delivery Order](../supplychain-delivery-order/requirement.md).

**Bukan** menu Packing List (`omni-packing-list`).

> Auto-outbound saat packing approve sudah **dinonaktifkan** (ETM-10761). Outbound settlement/manual terpisah setelah Shipped.

---

## Relasi Instant Settlement

**Dampak ke menu ini:** Tahap **Pack** sebelum collecting & DO. Order yang macet di packing **belum bisa Shipped** → gagal settlement.

**Prasyarat dari menu ini agar settlement lolos:** Checking approved; packing transfer eligible; setelah pack → collecting → DO → Shipped WH 3PL.

**Independensi:** Packing approve **tidak** generate outbound settlement. Delete settlement tidak revert packing transfer.

**Detail alur bulk:** [Instant Settlement](../accounting-settlement-upload/requirement.md)

Diagram integrasi: [Instant Settlement §10](../accounting-settlement-upload/requirement.md#10-relasi-menu--integrasi).

---

## Relasi Failed Ship

**Posisi dalam rantai:** Packing = langkah **#3 approve**. Stok **virtual Checking → virtual Packing** (`process_type = packing`, prefix **PK**).

Setelah packing approve, sistem menyiapkan **Collecting / Shipping List** (`process_type = shipping`, prefix **SL**, status **open**) — masuk [Delivery Order](../supplychain-delivery-order/technical.md) sebelum TFI `shipping do` ke 3PL.

| Tahap setelah pack | Menu | `process_type` |
|--------------------|------|----------------|
| Collecting | (auto SL) | `shipping` |
| Shipped 3PL | DO approve | `shipping do` |
| Gagal kirim pasca-3PL | [Failed Ship](../supplychain-failed-ship/requirement.md) | `failed ship` |

Audit pergerakan: [Transfer Internal §8](../supplychain-mutation-transfer-internal/technical.md#8-relasi-failed-ship--rantai-fulfillment).

---

## Related Documents

| Doc | Path |
|-----|------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| Technical | technical.md *(pending)* |
| Packing List | [../omni-packing-list/README.md](../omni-packing-list/README.md) |
| Delivery Order | [../supplychain-delivery-order/requirement.md](../supplychain-delivery-order/requirement.md) |
| Instant Settlement | [../accounting-settlement-upload/requirement.md](../accounting-settlement-upload/requirement.md) |
