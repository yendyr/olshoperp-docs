---
doc_type: requirement
menu: accounting-fiscal-period
menu_name: "Fiscal Period"
version: 1.0
last_updated: 2026-06-23
owner: QA - Yemima
status: draft
---

# Fiscal Period — Requirement Documentation

> **DRAFT** — Cross-reference Instant Settlement (Fase 2). Konten requirement penuh menu ini masih disusun.

**Modul:** Accounting  
**UI route:** `/accounting/fiscal-period`  
**Audience:** PM, Operations, QA, Support, Developer

---

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-06-23 | QA - Yemima | Cross-reference Relasi Instant Settlement (Fase 2) |

---

## 1. Ringkasan Eksekutif

**Fiscal Period** mendefinisikan periode akuntansi terbuka/tutup. Transaksi accounting & SCM memvalidasi `transaction_date` terhadap periode aktif via `validate_fiscal_period()`.

---

## Relasi Instant Settlement

**Dampak ke menu ini:** Tanggal transaksi pada upload settlement, generate SI/OB/AR, dan approve batch harus jatuh dalam **fiscal period terbuka**. Periode tutup → error validasi saat import atau approve.

**Prasyarat dari menu ini agar settlement lolos:** Pastikan periode mencakup tanggal settlement di file CSV (dan tanggal dokumen generate jika berbeda). Admin buka periode atau sesuaikan tanggal sebelum upload/approve.

**Independensi:** Menutup periode **tidak** menghapus batch settlement yang sudah approved. Batch draft/open yang tanggalnya di periode lama bisa terblokir edit/approve — reversal manual jika perlu.

**Detail alur bulk:** [Instant Settlement](../accounting-settlement-upload/requirement.md)

Diagram integrasi: [Instant Settlement §10](../accounting-settlement-upload/requirement.md#10-relasi-menu--integrasi).

---

## Related Documents

| Doc | Path |
|-----|------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| Technical | technical.md *(pending)* |
| Instant Settlement | [../accounting-settlement-upload/requirement.md](../accounting-settlement-upload/requirement.md) |
| Journal | [../journal/requirement.md](../journal/requirement.md) |
