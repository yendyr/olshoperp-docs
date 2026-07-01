---
doc_type: requirement
menu: accounting-customer-payment
menu_name: "Account Receive"
version: 1.0
last_updated: 2026-06-26
owner: QA - Yemima
status: draft
---

# Account Receive — Requirement Documentation

> **DRAFT** — Cross-reference Instant Settlement (Fase 1). Konten requirement penuh menu ini masih disusun.

**Modul:** Accounting  
**UI route:** `/accounting/customer-payment`  
**Audience:** PM, Operations, QA, Support, Developer

---

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.1 | 2026-06-26 | QA - Yemima | Test cases AR detail insert (single/bulk use, bulk select) — lihat test-cases/ |
| 1.0 | 2026-06-23 | QA - Yemima | Cross-reference Relasi Instant Settlement (Fase 1) |

---

## 1. Ringkasan Eksekutif

**Account Receive** (Customer Payment / AR receipt) mencatat penerimaan pembayaran dari customer dan mengalokasikannya ke Sales Invoice outstanding. Satu dokumen AR bisa mereferensikan banyak invoice.

---

## Relasi Instant Settlement

**Dampak ke menu ini:** Saat user **Approve** batch Instant Settlement, sistem dispatch job generate **satu AR per settlement upload** yang mengalokasikan pembayaran ke SI hasil generate. **Smart AR:** invoice yang sudah punya AR manual (`payment_details_exists`) **di-skip** — tidak dobel AR.

**Prasyarat dari menu ini agar settlement lolos:** Store harus punya **Cash/Bank Receiving** (`cash_bank_account_id`) sebelum Approve settlement — error V-15 jika kosong. Fiscal period harus terbuka pada tanggal settlement.

**Independensi:** AR manual di menu ini **tidak** dihapus saat Reject settlement (Reject hanya menolak generate AR batch). AR manual **memblokir Delete** settlement jika terhubung ke SI hasil upload. AR dan jurnal AR bisa dibuat/di-approve manual tanpa settlement.

**Detail alur bulk:** [Instant Settlement](../accounting-settlement-upload/requirement.md) — § Approve Progress, Smart AR, Reject vs Delete.

Diagram integrasi: [Instant Settlement §10](../accounting-settlement-upload/requirement.md#10-relasi-menu--integrasi).

---

## Related Documents

| Doc | Path |
|-----|------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| Technical | technical.md *(pending)* |
| Sales Invoice | [../accounting-customer-invoice/requirement.md](../accounting-customer-invoice/requirement.md) |
| Instant Settlement | [../accounting-settlement-upload/requirement.md](../accounting-settlement-upload/requirement.md) |
