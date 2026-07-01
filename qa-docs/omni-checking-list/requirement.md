---
doc_type: requirement
menu: omni-checking-list
menu_name: "Checking List"
version: 1.0
last_updated: 2026-06-23
owner: QA - Yemima
status: draft
---

# Checking List — Requirement Documentation

> **DRAFT** — Cross-reference Instant Settlement (Fase 3). Konten requirement penuh menu ini masih disusun.

**Modul:** SupplyChain / OmniChannel  
**UI route:** `/omni/checking-list`

---

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-06-23 | QA - Yemima | Cross-reference Relasi Instant Settlement (Fase 3) |

---

## 1. Ringkasan Eksekutif

**Checking List** adalah dokumen operasional daftar barang yang harus di-QC setelah picking. Approve list/transfer terkait memicu lanjut ke **Packing List**. Berbeda dari [Checking Process](../omni-checking-process/requirement.md) (approve transfer by scan).

---

## Relasi Instant Settlement

**Dampak ke menu ini:** Bagian operasional tahap **Check** — jika checking list/transfer tidak selesai, rantai gudang terhenti sebelum DO & Shipped WH 3PL.

**Prasyarat dari menu ini agar settlement lolos:** Picking selesai; checking list di-approve sesuai SOP gudang; lanjut pack → collect → DO.

**Independensi:** Dokumen checking list **independen** dari batch settlement accounting.

**Detail alur bulk:** [Instant Settlement](../accounting-settlement-upload/requirement.md) · [Sales Order §2.4](../sales-order-general/requirement.md)

Diagram integrasi: [Instant Settlement §10](../accounting-settlement-upload/requirement.md#10-relasi-menu--integrasi).

---

## Related Documents

| Doc | Path |
|-----|------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| Technical | technical.md *(pending)* |
| Checking Process | [../omni-checking-process/requirement.md](../omni-checking-process/requirement.md) |
| Instant Settlement | [../accounting-settlement-upload/requirement.md](../accounting-settlement-upload/requirement.md) |
