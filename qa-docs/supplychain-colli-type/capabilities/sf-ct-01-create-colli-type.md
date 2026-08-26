---
doc_type: menu-capability
menu: supplychain-colli-type
id: SF-CT-01
title: Create Colli Type
aliases: [buat colli type, code name colli, jenis wadah]
scope: menu
summary: >-
  Buat jenis wadah (Code + Name wajib). Active default ON; Show for all
  company default OFF. Type pertama otomatis Default ON.
version: 1.0
last_updated: 2026-08-14
status: review
---

# Create Colli Type

## Apa ini

Form **Create / Edit** untuk mendaftarkan jenis wadah colli. Yang wajib: **Code** dan **Name**. Description opsional.

## Kapan dipakai

- Gudang mulai pakai Colli v2 (wadah multi-SKU).
- Perlu jenis baru (Box, Pallet, …) sebelum New Colli di inbound.
- Rename Code/Name type yang sudah ada — tetap boleh meski sudah dipakai colli code.

## Cara pakai

1. Buka **Colli Type** → **Create**.
2. Isi **Code** dan **Name**.
3. Biarkan **Active** ON. **Show for all company** OFF kecuali type perlu dipakai company lain.
4. Opsional centang [Default](#sf-lingo:SF-CT-02).
5. **Save**.

## Catatan

- Code harus unik per company.
- Type **pertama** di company otomatis Default ON.
- Code/Name **boleh diubah** setelah type dipakai colli code.
- Inactive / hapus mengikuti [Active vs used](#sf-lingo:SF-CT-03) dan [Delete](#sf-lingo:SF-CT-04).

## Contoh

| Given | Aksi | Hasil |
|-------|------|--------|
| Belum ada type | Create `BOX` / Box | Tersimpan; Default ON; Active ON |
| Sudah ada Box | Create `PLT` / Pallet tanpa Default | Default OFF |
| Type sudah dipakai | Ganti Name jadi `Karton` | Sukses |

## Lihat juga

- [Set as Default Data](#sf-lingo:SF-CT-02)
- [Use in New Colli](#sf-lingo:SF-CT-05)
- Feature Map: [feature-map.md](../feature-map.md)
