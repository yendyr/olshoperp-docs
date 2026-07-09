---
doc_type: requirement
menu: accounting-product-coa-group
menu_name: "Product COA Group"
version: 1.2
last_updated: 2026-07-09
owner: QA - Yemima
status: draft
---

# Product COA Group — Requirement Documentation

> **DRAFT** — Cross-reference Instant Settlement (Fase 2). Konten requirement penuh menu ini masih disusun.

**Modul:** Accounting  
**UI route:** `/accounting/product-coa-group`  
**Audience:** PM, Operations, QA, Support, Developer

---

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-06-23 | QA - Yemima | Cross-reference Relasi Instant Settlement (Fase 2) |
| 1.1 | 2026-07-04 | QA - Yemima | Cross-reference Relasi Assembly (WIP + Inventory COA) |
| 1.2 | 2026-07-09 | QA - Yemima | Relasi Stock Remapping eligibility |

---

## 1. Ringkasan Eksekutif

**Product COA Group** memetakan produk (System Product) ke akun COA untuk posting jurnal — pendapatan, persediaan, HPP, dll. Dipakai saat auto journal Sales Invoice dan Outbound.

---

## Relasi Instant Settlement

**Dampak ke menu ini:** Saat settlement generate & approve **SI** dan **OB**, `JournalProcess` memakai COA dari Product COA Group per produk di baris order. Mapping kosong/salah → jurnal gagal (counter error di grid settlement, panel **SI Journal** / **Out Journal**).

**Prasyarat dari menu ini agar settlement lolos:** Semua produk pada SO yang akan di-settle punya Product COA Group lengkap **sebelum** upload. Outbound warning `zero_prevention` bisa muncul jika nilai persediaan/HPP = 0 — terpisah dari mapping missing.

**Independensi:** Ubah COA group **tidak** re-post journal batch lama. Retry settlement job memakai mapping **aktif saat retry**.

**Detail alur bulk:** [Instant Settlement](../accounting-settlement-upload/requirement.md) — Out Journal warnings, retry jurnal.

Diagram integrasi: [Instant Settlement §10](../accounting-settlement-upload/requirement.md#10-relasi-menu--integrasi).

---

## Relasi Stock Remapping

SKU dengan Product COA Group type **Service** atau **Asset** **tidak eligible** untuk [Stock Remapping](../accounting-stock-remapping/requirement.md). Hanya **Purchased Item** dan **Manufactured Item**.

---

## Relasi Assembly

**Dampak ke menu ini:** Assembly Approve job mem-posting jurnal via Outbound + Other Inbound. Mapping COA diambil dari Product COA Group per SKU:

| Transaksi | Akun yang dipakai | Produk |
|-----------|-------------------|--------|
| Outbound Other (WIP) | **Work In Progress** (Dr), **Inventory** (Cr) | Setiap komponen BoM |
| Other Inbound (FG) | **Inventory** (Dr), **Work In Progress** (Cr) | Finish goods |

**Prasyarat dari menu ini agar Assembly lolos:** FG **dan semua komponen** BoM snapshot punya Product COA Group lengkap dengan akun WIP + Inventory **sebelum** Open/Approve. Missing mapping → Open/Approve ditolak dengan pesan COA.

**Independensi:** Ubah COA group setelah Assembly Approved **tidak** re-post jurnal transaksi lama.

**Detail alur:** [Assembly requirement §6](../supplychain-assembly/requirement.md) — Journal Integration · [System Product](../system-product/requirement.md) — Product COA Group field.

---

## Related Documents

| Doc | Path |
|-----|------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| Technical | technical.md *(pending)* |
| System Product | [../system-product/README.md](../system-product/README.md) |
| Instant Settlement | [../accounting-settlement-upload/requirement.md](../accounting-settlement-upload/requirement.md) |
| Assembly | [../supplychain-assembly/requirement.md](../supplychain-assembly/requirement.md) |
