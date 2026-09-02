---
doc_type: requirement
menu: accounting-purchase-return
menu_name: "Purchase Return"
version: 1.0
last_updated: 2026-09-02
owner: QA - Yemima
status: draft
aliases: [Purchase Return, retur beli, PR billed, ETM-15726]
---

# Purchase Return — Requirement Documentation

**Modul:** Accounting / Account Payable  
**UI route:** `/accounting/purchase-return`  
**Audience:** PM, QA  
**Status:** **draft** — dokumentasi penuh menu masih pending; section di bawah mengunci kebijakan supplier display.

**Jira:** [ETM-15726](https://erpintegration.atlassian.net/browse/ETM-15726) · parent [ETM-15721](https://erpintegration.atlassian.net/browse/ETM-15721)

---

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-09-02 | QA - Yemima | Stub + Supplier display **code-only** (ETM-15726) |

---

## 1. Supplier Display (code-only) — ETM-15726

Identitas operasional supplier = **Supplier Code**. Nama sensitif — tidak ditampilkan di UI/export. Berlaku **semua role**.

| Surface | Rule |
|---------|------|
| Datalist / detail / modal | Tampil **code** saja |
| Column Show/Hide (ColVis) | **Tanpa** opsi Supplier Name |
| Select2 / Search / Advanced Filter | Match **code + name**; tampilan = **code**; **tanpa** hover/tooltip nama |
| Basic Information » Supplier | Code only; **jangan** tambah field read-only Supplier Name |
| Export | **Tanpa** name |
| Print | Name **boleh** (exception) |

Foundation: flag `SUPPLIER_DISPLAY_MODE=code_only` + shared helpers via ETM-15721 — menu wajib pakai helper, jangan hardcode.

---

## 2. Catatan scope docs

Alur retur billed → Debit Note, validasi qty, dan state machine penuh: **belum** di-expand di file ini (status draft). Cross-ref sementara: [Purchase Invoice](../accounting-supplier-invoice/), [Debit Note](../accounting-debit-note/), [Account Payment](../accounting-supplier-payment/).
