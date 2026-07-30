---
doc_type: menu-capability
menu: supplychain-new-purchase-inbound
id: SF-INB-02
title: Partial receiving
aliases: [partial GRN, terima sebagian, multiple inbound]
scope: menu
summary: >-
  Satu PO boleh diterima bertahap lewat beberapa Purchase Inbound.
  Setelah approve, PO jadi Processed (sebagian) atau Complete (penuh).
version: 1.0
last_updated: 2026-07-28
status: draft
---

# Partial receiving

## Apa ini

Satu Purchase Order tidak harus diterima sekaligus. Kamu boleh membuat **beberapa GRN** sampai seluruh qty ter-cover. Qty di GRN draft/open mengunci sisa; setelah approve, qty itu final diterima.

## Kapan dipakai

- Supplier kirim bertahap.
- Gudang hanya mampu terima sebagian hari ini.
- Melanjutkan sisa setelah GRN sebelumnya approved.

## Cara pakai

1. Buat GRN dari Outstanding PO dengan qty sebagian ([Bulk/Single Use](#sf-lingo:SF-DET-01)).
2. **Approve** — stok + jurnal post; PO biasanya **Processed**.
3. Buat GRN berikutnya dari sisa outstanding sampai habis.
4. Saat semua baris PO penuh diterima → PO **Complete** otomatis.
5. Jika sisa tidak akan datang: di sisi PO gunakan **Closed** (dari Processed) — sisa tidak bisa di-inbound lagi.

## Catatan

- Qty tidak boleh melebihi sisa PO per baris (termasuk yang sudah di GRN lain).
- PO **Closed** / void → tidak bisa inbound sisa.
- Pajak/PPN tetap tidak di GRN — lanjut Purchase Invoice dari inbound approved.

## Contoh

| Langkah | Qty PO | GRN | Status PO (setelah approve GRN) |
|---------|--------|-----|----------------------------------|
| Awal | 100 | — | Approved |
| GRN A qty 40 | 100 | Approved 40 | Processed |
| GRN B qty 60 | 100 | Approved 60 | **Complete** |

## Lihat juga

- [Allocate Full Qty](#sf-lingo:SF-DET-02)
- Purchase Order: [Complete vs Closed](../../supplychain-purchase-order/capabilities/sf-po-02-complete-vs-closed.md)
- Purchase Invoice: partial invoicing di Feature Map PI
