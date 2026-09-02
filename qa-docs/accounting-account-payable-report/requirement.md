---
doc_type: requirement
menu: accounting-account-payable-report
menu_name: "Account Payable Report"
version: 1.0
last_updated: 2026-09-02
owner: QA - Yemima
status: draft
aliases: [Account Payable Report, AP report, laporan hutang, ETM-15728]
---

# Account Payable Report — Requirement Documentation

**Modul:** Accounting → Report  
**UI route:** `/accounting/account-payable-report`  
**Audience:** PM, QA  
**Status:** **draft** — dokumentasi penuh menu masih pending; section di bawah mengunci kebijakan supplier display.

**Jira:** [ETM-15728](https://erpintegration.atlassian.net/browse/ETM-15728) · parent [ETM-15721](https://erpintegration.atlassian.net/browse/ETM-15721)

---

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-09-02 | QA - Yemima | Stub + Supplier display **code-only** (ETM-15728) |

---

## 1. Supplier Display (code-only) — ETM-15728

Identitas operasional supplier = **Supplier Code**. Nama sensitif — tidak ditampilkan di UI/export. Berlaku **semua role**.

| Surface | Rule |
|---------|------|
| Datalist / detail / modal (jika ada) | Tampil **code** saja |
| Column Show/Hide (ColVis) | **Tanpa** opsi Supplier Name |
| Select2 / Search / Advanced Filter | Match **code + name**; tampilan = **code**; **tanpa** hover/tooltip nama |
| Export | **Tanpa** name |
| Print (jika ada) | Name **boleh** |
| Basic Information | N/A untuk report read-only — **jangan** menambah surface Name di UI |

Foundation: flag `SUPPLIER_DISPLAY_MODE=code_only` + shared helpers via ETM-15721.

---

## 2. Catatan scope docs

Aging / settlement / kolom outstanding penuh: **belum** di-expand (status draft). Bukan sama dengan [Purchase Report](../accounting-purchase-report/).
