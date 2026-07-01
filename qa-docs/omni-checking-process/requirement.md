---
doc_type: requirement
menu: omni-checking-process
menu_name: "Checking Process"
version: 1.1
last_updated: 2026-06-26
owner: QA - Yemima
status: draft
---

# Checking Process — Requirement Documentation

> **DRAFT** — Cross-reference Instant Settlement (Fase 3). Konten requirement penuh menu ini masih disusun.

**Modul:** OmniChannel  
**UI route:** `/omni/checking-process`  
**API:** `omnichannel/transfer-checking/*`  
**Controller:** `TransferCheckingController` → delegates to `StockMutationTransferController`

---

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-06-23 | QA - Yemima | Cross-reference Relasi Instant Settlement (Fase 3) |
| 1.1 | 2026-06-26 | QA - Yemima | Relasi Failed Ship — pergerakan stok tahap checking |

---

## 1. Ringkasan Eksekutif

**Checking Process** adalah menu operasional approve **Stock Mutation Transfer** dari virtual WH picking/checking ke tahap berikutnya (checking → packing). Pola sama dengan [Picking Process](../omni-picking-process/requirement.md): scan QR / kode TF / SO / `platform_order_id`.

**Bukan** menu Checking List (`omni-checking-list`) — dokumen daftar QC vs approve transfer.

---

## Relasi Instant Settlement

**Dampak ke menu ini:** Tahap **Check** dalam rantai Wave → Pick → **Check** → Pack → Collect → DO → Shipped WH 3PL. Approve checking transfer wajib agar packing & collecting bisa lanjut — tanpa Shipped, settlement V-04 gagal.

**Prasyarat dari menu ini agar settlement lolos:** Picking sudah approved; transfer checking eligible (`approval-eligibility`); lanjutkan sampai DO approved.

**Independensi:** Approve checking **tidak** memicu accounting. Settlement hanya membaca status akhir SO + stok, bukan dokumen checking individual.

**Detail alur bulk:** [Instant Settlement](../accounting-settlement-upload/requirement.md) · [Sales Order §2.4](../sales-order-general/requirement.md)

Diagram integrasi: [Instant Settlement §10](../accounting-settlement-upload/requirement.md#10-relasi-menu--integrasi).

---

## Relasi Failed Ship

**Posisi dalam rantai:** Checking = langkah **#2 approve** setelah picking. Stok berpindah **Outrack → virtual Checking**.

| Field / konsep | Nilai |
|----------------|-------|
| Dokumen | TF internal `process_type = checking`, prefix **CL** |
| Prasyarat | Picking (PL) sudah approved |
| Menu berikutnya | [Packing Process](../omni-packing-process/requirement.md) |
| Audit trail | [Transfer Internal](../supplychain-mutation-transfer-internal/technical.md#8-relasi-failed-ship--rantai-fulfillment) + Show Virtual |

Failed Ship hanya relevan setelah DO mengirim stok ke **3PL** — checking adalah tahap awal rantai, bukan titik FS.

**Doc FS:** [supplychain-failed-ship §3.2](../supplychain-failed-ship/requirement.md#32-tahap-transfer-internal-as-is-codebase)

---

## Related Documents

| Doc | Path |
|-----|------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| Technical | technical.md *(pending)* |
| Picking Process | [../omni-picking-process/requirement.md](../omni-picking-process/requirement.md) |
| Checking List | [../omni-checking-list/README.md](../omni-checking-list/README.md) |
| Instant Settlement | [../accounting-settlement-upload/requirement.md](../accounting-settlement-upload/requirement.md) |
