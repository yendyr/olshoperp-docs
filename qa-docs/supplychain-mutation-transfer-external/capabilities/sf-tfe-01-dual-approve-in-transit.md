---
doc_type: menu-capability
menu: supplychain-mutation-transfer-external
id: SF-TFE-01
title: Dual approve & In Transit
aliases: [dual approve, in transit, delivered, approval ke-1, transfer inbound]
scope: menu
summary: >-
  Transfer External butuh dua approve: pengirim di menu ini, penerima di Transfer
  Inbound. Setelah approve pengirim, Delivery Status menjadi In Transit.
version: 1.0
last_updated: 2026-09-01
status: review
---

# Dual approve & In Transit

## Apa ini

Alur wajib Transfer External: **approve pengirim** di menu ini, lalu **approve penerima** di **Transfer Inbound**. Setelah pengirim approve, Delivery Status = **In Transit**; setelah penerima approve = **Delivered**.

## Kapan dipakai

- Setiap kirim stok **antar gedung** (beda struktur warehouse).
- Setelah detail lengkap dan status Open siap dikirim.

## Cara pakai

1. Buat dokumen → isi Origin, Destination, detail SKU → simpan **Open**.
2. Klik **Approve** (approve pengirim / ke-1).
3. Cek Delivery Status **In Transit** — stok asal masuk kolom Transfer; tujuan masih incoming.
4. Penerima lanjut di menu **Transfer Inbound** sampai **Delivered**.

## Catatan

- **Tidak ada Void** setelah approve pengirim — harus dilanjut sampai Delivered.
- Reject hanya relevan **sebelum** approve pengirim.
- Dokumen sistem ke/dari In Transit tidak muncul di daftar biasa.

## Contoh

Kirim 1.000 pensil SBY Rack-001 → SDA Drop OFF:

1. **TF001** terlihat: origin → destination.
2. Setelah approve pengirim → **In Transit**.
3. Setelah approve di Transfer Inbound → **Delivered**; stok diterima masuk SDA.

## Lihat juga

- [Select Product / Available Products / Import](#sf-lingo:SF-DET-01)
- [Feature Map](../feature-map.md)
- [Requirement §3 & §6.4](../requirement.md)
- [Transfer Inbound — Qty Received / Lost / Broken](../../supplychain-transfer-inbound/capabilities/sf-tfinb-01-receive-lost-broken.md)
