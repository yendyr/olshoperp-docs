---
doc_type: menu-capability
menu: supplychain-colli-type
id: SF-CT-02
title: Set as Default Data
aliases: [default colli type, default data, preselect new colli]
scope: menu
summary: >-
  Hanya satu Colli Type Default ON per company. Type pertama otomatis
  Default. Default dipakai sebagai preselect saat New Colli di inbound.
version: 1.0
last_updated: 2026-08-14
status: review
---

# Set as Default Data

## Apa ini

**Set as Default Data** menandai jenis wadah yang paling sering dipakai. Saat user buat **New Colli** di inbound, dropdown Colli Type **langsung terpilih** type Default.

## Kapan dipakai

- Create type pertama (otomatis Default ON).
- Ganti default ke jenis yang lebih sering (mis. Pallet menggantikan Box).
- Mempercepat inbound supaya tidak pilih type setiap kali.

## Cara pakai

1. Buka type yang ingin jadi default → centang **Set as Default Data** → **Save**.
2. Type yang sebelumnya Default **otomatis OFF**.
3. Di Purchase Inbound, **New Colli** → type ini sudah terpilih.

## Catatan

- Maksimal **satu** Default ON per company.
- Tidak wajib selalu ada Default. Kalau satu-satunya Default dimatikan tanpa meng-ON-kan type lain, New Colli bisa tanpa preselect.
- Default hanya mempercepat pilih type — tidak membuat colli code sendiri.

## Contoh

| Given | Aksi | Hasil |
|-------|------|--------|
| Hanya `BOX` | Create pertama | Default ON otomatis |
| `BOX` Default ON, buat `PLT` | Tidak centang Default | `PLT` Default OFF |
| Set `PLT` Default ON | Save | `BOX` Default OFF; `PLT` ON |

## Lihat juga

- [Create Colli Type](#sf-lingo:SF-CT-01)
- [Use in New Colli](#sf-lingo:SF-CT-05)
- Purchase Inbound: [../supplychain-new-purchase-inbound/](../supplychain-new-purchase-inbound/)
