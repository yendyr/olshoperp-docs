---
doc_type: knowledge-base
menu: accounting-purchase-return
menu_name: "Purchase Return"
version: 1.2
last_updated: 2026-09-09
owner: QA - Yemima
status: draft
audience: operator
---

# Purchase Return — Knowledge Base

> Dokumentasi menu ini sebagian besar masih disusun. Section **Supplier tampilan** di bawah sudah mengunci kebijakan code-only.

## Ringkasan

Menu **Purchase Return** adalah bagian dari modul **Accounting** di OlshopERP (retur pembelian; retur billed dapat menghasilkan Debit Note).

## Supplier tampilan (code-only)

Di daftar, detail, modal, dan export, supplier tampil sebagai **kode** saja (semua role). Kamu tetap bisa **cari** by nama atau kode. Nama supplier boleh muncul di **Print**. Tidak ada field nama tambahan di Basic Information.

## Unit Price & Total Price Return (TO-BE)

Di **edit** dan **show**, section detail menampilkan:

- **Unit Price (Before VAT)** — harga satuan after discount, before VAT (ikut unit transaksi return).
- **Total Price Return** — Qty Return × Unit Price.

Saat **add SKU** (modal Available Product) dan **edit detail SKU**, Unit Price (Before VAT) juga terlihat (read-only). Total Price Return khusus di tabel detail.

Detail: [requirement §2](./requirement.md).

## Relasi Account Payment

Purchase Return dapat menghasilkan **Debit Note** yang dipakai sebagai sumber dana di [Account Payment](../accounting-supplier-payment/knowledge-base.md).

Kolom **Purchase Return** di outstanding PI (Account Payment) menampilkan referensi retur terkait invoice.

Detail: [Account Payment requirement §14](../accounting-supplier-payment/requirement.md#14-relasi-purchase-return-detail)

## Status dokumentasi

- Knowledge Base: **draft** (supplier code-only + Unit Price TO-BE)
- Requirement: **draft** — [requirement.md](./requirement.md)
- Technical: **draft** — [technical.md](./technical.md)
