---
doc_type: menu-capability
menu: supplychain-mutation-transfer-internal
id: SF-TFI-02
title: Colli v2 (BETA)
aliases: [colli v2, BulkColliAction, New Colli, Existing Colli, multisku colli]
scope: menu
summary: >-
  Di menu BETA: assign wadah multi-SKU saat transfer — New Colli + Colli Type
  atau Existing Colli via toolbar bulk. Satu code colli = satu lokasi.
version: 1.0
last_updated: 2026-09-01
status: review
---

# Colli v2 (BETA)

## Apa ini

**Colli** = wadah (`COL-…`) yang bisa berisi **banyak SKU** di **satu lokasi**. Fitur ini hanya di menu **BETA** (`new-mutation-transfer-internal`), bukan legacy.

## Kapan dipakai

- Pindah barang **ke dalam** colli tujuan (Existing atau New).
- Gabung beberapa SKU loose ke **satu** colli baru.
- Barang **sudah** punya colli origin — qty maks = stok colli itu.

## Cara pakai

1. Tambah baris (Select Product / Available Product / Import).
2. Centang baris → toolbar **BulkColliAction**.
3. Pilih **New Colli** + **Colli Type** (Default biasanya sudah terpilih) **atau** **Existing Colli**.
4. **Save** — cek kolom Colli Origin / Colli Destination.
5. **Ganti Location Destination** baris → colli tujuan biasanya **kosong lagi** — assign ulang.
6. **Approve** — colli baru permanen di daftar Multisku Colli.

## Catatan

- **Satu code colli = satu lokasi** — tidak boleh terbelah di dua rak.
- Filter **Existing Colli** dari struktur gudang **asal** (beda dari Purchase Inbound); colli di lokasi **sama persis** dengan stok asal baris **tidak** boleh dipilih.
- Toolbar tidak menampilkan colli **origin baris yang sama** (anti assign ke diri sendiri).
- Loose + colli campur di bulk tetap bisa — Existing exclude colli origin terpilih.

## Contoh

| Given | Aksi | Hasil |
|-------|------|--------|
| 2 SKU loose | New Colli type Box | Satu COL baru; keduanya masuk |
| SKU sudah COL-A | Existing COL-B | Origin COL-A → dest COL-B |
| Ubah rak tujuan | Tanpa assign ulang colli | Colli dest harus NULL (assign lagi) |

## Lihat juga

- [Relocate whole colli](#sf-lingo:SF-TFI-03)
- [Select Product / Available Product / Import](#sf-lingo:SF-DET-01)
- Purchase Inbound [Colli v2](../../supplychain-new-purchase-inbound/capabilities/sf-inb-01-colli-group-view.md)
- [Requirement §7](../requirement.md)
