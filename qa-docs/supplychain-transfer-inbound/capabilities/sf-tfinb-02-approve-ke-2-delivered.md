---
doc_type: menu-capability
menu: supplychain-transfer-inbound
id: SF-TFINB-02
title: Approve ke-2 & Delivered
aliases: [approve ke-2, delivered, approval penerima, dual approve inbound]
scope: menu
summary: >-
  Approve di Transfer Inbound menyelesaikan penerimaan: Delivery Status jadi
  Delivered, stok masuk tujuan, Lost/Broken memicu dokumen Open di menu lain.
version: 1.0
last_updated: 2026-09-01
status: review
---

# Approve ke-2 & Delivered

## Apa ini

Persetujuan **penerima** atas Transfer External yang sudah In Transit. Setelah sukses, Delivery Status = **Delivered** dan stok yang diterima resmi di gudang tujuan.

## Kapan dipakai

- Qty Received / Lost / Broken sudah benar.
- Delivery masih **In Transit**.

## Cara pakai

1. Isi / review [Qty Received / Lost / Broken](#sf-lingo:SF-TFINB-01).
2. Klik **Approve**.
3. Tunggu proses selesai (refresh jika muncul jam pasir).
4. Cek Delivery **Delivered**.
5. Jika ada Lost → lanjut approve di **Adjustment Deduction** (masih Open).
6. Jika ada Broken → lanjut approve dokumen scrap (masih Open).

## Catatan

- **Tidak ada reject** penerimaan — koreksi angka sebelum Approve.
- Lost memakai referensi **kode TF utama** (bukan kode dokumen tersembunyi).
- Broken menuju gudang scrap **gedung tujuan**, bukan asal pengirim.
- Lost/Broken **tidak** auto-approve (beda Failed Ship).

## Contoh

TF001 In Transit, received 900 / lost 100 / broken 0 → Approve → Delivered; 900 di SDA; deduction Open 100 ref TF001.

## Lihat juga

- [Qty Received / Lost / Broken](#sf-lingo:SF-TFINB-01)
- [Requirement §6.2](../requirement.md)
- [Transfer External — Dual approve](../../supplychain-mutation-transfer-external/capabilities/sf-tfe-01-dual-approve-in-transit.md)
