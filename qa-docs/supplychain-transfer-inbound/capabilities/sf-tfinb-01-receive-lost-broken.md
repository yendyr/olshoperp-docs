---
doc_type: menu-capability
menu: supplychain-transfer-inbound
id: SF-TFINB-01
title: Qty Received / Lost / Broken
aliases: [qty received, lost items, broken items, penerimaan]
scope: menu
summary: >-
  Di Transfer Inbound, isi Qty Received, Lost Items, dan Broken Items. Jumlah ketiganya
  harus sama dengan Qty Transfered. Lost/Broken 0 sah jika semua diterima baik.
version: 1.0
last_updated: 2026-09-01
status: review
---

# Qty Received / Lost / Broken

## Apa ini

Kolom penerimaan di Transfer Inbound:

- **Qty Transfered** — jumlah dikirim pengirim (tidak diubah).
- **Qty Received** — diterima baik.
- **Lost Items** — hilang di jalan.
- **Broken Items** — rusak (nanti ke gudang scrap).

## Kapan dipakai

- Dokumen TF Ext sudah **In Transit**.
- Sebelum klik **Approve** penerima.

## Cara pakai

1. Buka dokumen di **Transfer Inbound**.
2. Default biasanya **Qty Received** = semua transferred; Lost/Broken kosong atau 0.
3. Sesuaikan angka bila ada selisih.
4. Pastikan **Received + Lost + Broken = Qty Transfered**.
5. Lanjut [Approve ke-2](#sf-lingo:SF-TFINB-02).

## Catatan

- Received tidak boleh lebih dari Transfered.
- Lost/Broken **0 atau kosong sah** jika semua diterima baik (meski form menandai required).
- Setelah Delivered, kolom ini tidak bisa diubah.
- Tidak menambah SKU baru di menu ini.

## Contoh

Kirim 1.000 pensil:

| Received | Lost | Broken | Hasil setelah approve |
|----------|------|--------|------------------------|
| 1.000 | 0 | 0 | Semua masuk tujuan |
| 900 | 100 | 0 | 900 di tujuan + potongan Lost Open |
| 850 | 50 | 100 | 850 di tujuan + Lost Open + scrap Open |
| 1.001 | — | — | **Ditolak** |

## Lihat juga

- [Approve ke-2 & Delivered](#sf-lingo:SF-TFINB-02)
- [Requirement §5–§6](../requirement.md)
