---
doc_type: menu-capability
menu: supplychain-colli-type
id: SF-CT-05
title: Use in New Colli
aliases: [new colli, colli code, inbound colli type]
scope: menu
summary: >-
  Colli Type dipilih saat New Colli di Purchase Inbound. Type Default
  terpilih otomatis. Hanya type Active yang muncul. Lokasi colli dari
  destinasi transaksi, bukan dari master type.
version: 1.0
last_updated: 2026-08-14
status: review
---

# Use in New Colli

## Apa ini

Tujuan Colli Type: saat user di **Purchase Inbound** membuat **New Colli**, sistem minta jenis wadah. Type **Default** langsung terpilih. Colli code yang terbentuk = wadah aktual (bisa berisi banyak SKU di lokasi yang sama).

## Kapan dipakai

- Terima barang ke satu box/pallet di lokasi yang sama.
- Perlu colli code baru, bukan pakai colli existing.
- Memastikan jenis wadah konsisten di gudang.

## Cara pakai

1. Siapkan type [Active](#sf-lingo:SF-CT-03) di master ([Create](#sf-lingo:SF-CT-01)).
2. Set [Default](#sf-lingo:SF-CT-02) untuk jenis yang paling sering.
3. Di Purchase Inbound, pilih SKU + **New Colli**.
4. Dropdown Colli Type: Default sudah terpilih; ganti jika perlu.
5. Simpan — colli code terbit; type terkunci dari Inactive/Delete.

## Catatan

- Hanya type **Active** yang muncul di dropdown.
- Lokasi colli = Location Destination inbound — **bukan** field di Colli Type.
- Beda dari Unit (pcs/kg) dan dari Colli ID lama (satu colli = satu stock id).
- Fitur inbound New Colli menyusul; master type harus siap dulu.

## Contoh

| Given | Aksi | Hasil |
|-------|------|--------|
| Default = Box | New Colli | Type Box terpilih |
| Type Pallet Active OFF | Cari Pallet di New Colli | Tidak muncul |
| New Colli sukses | Coba Inactive type | Ditolak — sudah dipakai |

## Lihat juga

- [Set as Default Data](#sf-lingo:SF-CT-02)
- [Active vs used](#sf-lingo:SF-CT-03)
- Purchase Inbound: [../supplychain-new-purchase-inbound/](../supplychain-new-purchase-inbound/)
