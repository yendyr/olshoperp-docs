---
doc_type: requirement
menu: accounting-settlement-mapping
menu_name: "Settlement Mapping"
version: 1.0
last_updated: 2026-06-23
owner: QA - Yemima
status: draft
---

# Settlement Mapping — Requirement Documentation

> **DRAFT** — Cross-reference Instant Settlement (Fase 1). Konten requirement penuh menu ini masih disusun.

**Modul:** Accounting  
**UI route:** `/accounting/settlement-mapping`  
**Audience:** PM, Operations, QA, Support, Developer

---

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-06-23 | QA - Yemima | Cross-reference Relasi Instant Settlement (Fase 1) |

---

## 1. Ringkasan Eksekutif

**Settlement Mapping** mendefinisikan pemetaan kolom biaya/pendapatan dari file settlement marketplace ke COA dan tipe biaya di OlshopERP. Mapping ini dibaca saat **Instant Settlement** mengimpor CSV per platform/store.

---

## Relasi Instant Settlement

**Dampak ke menu ini:** Kolom biaya di file CSV platform (Shopee, Lazada, TikTok, Others) harus punya entri mapping yang valid agar jurnal SI dan breakdown total penghasilan benar. Mapping yang kosong/salah → error import atau selisih **Difference Settlement-SI**.

**Prasyarat dari menu ini agar settlement lolos:** Sebelum upload file settlement, pastikan mapping platform + store (atau template perusahaan) sudah mencakup semua kolom biaya yang muncul di export marketplace terbaru.

**Independensi:** Perubahan mapping **tidak** otomatis mengubah settlement batch yang sudah di-upload. Batch baru memakai mapping aktif saat import. Doc Settlement Mapping independen dari doc Outbound/SI/AR — hanya menyediakan master referensi kolom.

**Detail alur bulk:** [Instant Settlement](../accounting-settlement-upload/requirement.md)

Diagram integrasi lengkap: [Instant Settlement §10](../accounting-settlement-upload/requirement.md#10-relasi-menu--integrasi).

---

## Related Documents

| Doc | Path |
|-----|------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| Technical | technical.md *(pending)* |
| Instant Settlement | [../accounting-settlement-upload/requirement.md](../accounting-settlement-upload/requirement.md) |
