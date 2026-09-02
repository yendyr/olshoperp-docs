---
doc_type: menu-capability
menu: supplychain-transfer-inbound
id: SF-VIEW-01
title: Group View / Detail View
aliases: [group view, detail view, inbound view]
scope: menu
summary: >-
  Group View ringkas per SKU; Detail View per stock ID — dipakai saat review
  Qty Received / Lost / Broken sebelum Approve penerima.
version: 1.0
last_updated: 2026-09-01
status: review
---

# Group View / Detail View

## Apa ini

Tampilan grid yang sama keluarga Transfer External, dipakai di inbound untuk review qty penerimaan:

- **Group View** — ringkas per SKU (default).
- **Detail View** — pecahan per stock ID bila perlu.

## Kapan dipakai

| View | Pakai jika |
|------|------------|
| **Group View** | Isi Received / Lost / Broken per SKU |
| **Detail View** | Perlu pecahan batch saat selisih penerimaan |

## Cara pakai

1. Buka dokumen In Transit.
2. Isi kolom penerimaan di view yang nyaman.
3. Pastikan total Received + Lost + Broken = Transfered.
4. **Approve**.

## Catatan

- Tidak menambah SKU lewat view ini.
- Setelah Delivered, qty terkunci.

## Lihat juga

- [Qty Received / Lost / Broken](#sf-lingo:SF-TFINB-01)
- [TF Ext — Group / Detail View](../../supplychain-mutation-transfer-external/capabilities/sf-view-01-group-detail-view.md)
