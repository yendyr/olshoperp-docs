---
doc_type: menu-capability
menu: accounting-supplier-invoice
id: SF-PI-01
title: Partial invoicing per SKU
aliases: [partial invoice, tagihan sebagian, prepared processed]
scope: menu
summary: >-
  Satu inbound boleh ditagih bertahap lewat beberapa Purchase Invoice.
  Qty di draft mengunci sisa; setelah approve, qty itu final ter-tagih.
version: 0.2
last_updated: 2026-07-27
status: review
---

# Partial invoicing per SKU

## Apa ini

Satu barang masuk (inbound) tidak harus ditagih sekaligus. Kamu bisa membuat beberapa Purchase Invoice untuk SKU yang sama sampai seluruh qty ter-cover. Qty di PI yang belum di-approve **mengunci** sisa; setelah approve, qty itu dianggap sudah ditagih.

## Kapan dipakai

- Supplier menagih bertahap (sebagian dulu, sisanya belakangan).
- Satu inbound besar dipecah ke beberapa faktur.
- Mengecek kenapa qty di modal inbound sudah berkurang padahal PI lain masih draft.

## Cara pakai

1. Buat PI dari inbound (lihat [Single / Bulk Use](#sf-lingo:SF-DET-01)) dengan qty sebagian.
2. Simpan — qty itu berstatus **Prepared** (mengurangi outstanding untuk user lain).
3. Approve PI — qty menjadi **Processed** (final ter-tagih).
4. Buat PI berikutnya dari sisa outstanding sampai habis (atau sesuai kebutuhan).

## Catatan

| Status qty di PI | Arti untuk kamu |
|------------------|-----------------|
| Prepared | Sudah masuk PI belum approve — mengunci outstanding |
| Processed | PI sudah approve — final ter-tagih |

- Yang boleh ditagih = inbound approved dikurangi yang sudah/sedang ditagih dan retur.
- Jangan menghapus PI draft sembarangan jika orang lain sedang menunggu sisa outstanding.

## Contoh

| Langkah | Inbound | PI A | PI B | Outstanding sisa |
|---------|---------|------|------|------------------|
| Awal | 100 pcs approved | — | — | 100 |
| Buat PI A draft qty 40 | 100 | Prepared 40 | — | 60 |
| Approve PI A | 100 | Processed 40 | — | 60 |
| Buat PI B qty 60 lalu approve | 100 | Processed 40 | Processed 60 | 0 |

## Lihat juga

- [Insert Inbound — Single / Bulk Use](#sf-lingo:SF-DET-01)
- Requirement: [§6 How It Works — SF-PI-01](../requirement.md#sf-pi-01-partial-invoicing-per-sku)
