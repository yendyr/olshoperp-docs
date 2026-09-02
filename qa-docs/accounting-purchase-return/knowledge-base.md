---
doc_type: knowledge-base
menu: accounting-purchase-return
menu_name: "Purchase Return"
version: 1.1
last_updated: 2026-09-02
owner: QA - Yemima
status: pending
audience: operator
---

# Purchase Return — Knowledge Base

> Dokumentasi menu ini sebagian besar masih disusun. Section **Supplier tampilan** di bawah sudah mengunci kebijakan code-only.

## Ringkasan

Menu **Purchase Return** adalah bagian dari modul **Accounting** di OlshopERP (retur pembelian; retur billed dapat menghasilkan Debit Note).

## Supplier tampilan (code-only)

Di daftar, detail, modal, dan export, supplier tampil sebagai **kode** saja (semua role). Kamu tetap bisa **cari** by nama atau kode. Nama supplier boleh muncul di **Print**. Tidak ada field nama tambahan di Basic Information.

## Relasi Account Payment

Purchase Return dapat menghasilkan **Debit Note** yang dipakai sebagai sumber dana di [Account Payment](../accounting-supplier-payment/knowledge-base.md).

Kolom **Purchase Return** di outstanding PI (Account Payment) menampilkan referensi retur terkait invoice.

Detail: [Account Payment requirement §14](../accounting-supplier-payment/requirement.md#14-relasi-purchase-return-detail)

## Status dokumentasi

- Knowledge Base: **pending** (plus aturan supplier code-only)
- Requirement: **draft** — lihat [requirement.md](./requirement.md) § Supplier Display
- Technical: **draft** — lihat [technical.md](./technical.md) (`SUPPLIER_DISPLAY_MODE`)
