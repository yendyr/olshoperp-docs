---
doc_type: menu-capability
menu: supplychain-colli-type
id: SF-CT-04
title: Delete when unused
aliases: [hapus colli type, soft delete, show deleted colli]
scope: menu
summary: >-
  Delete hanya jika belum ada colli code. Soft delete; baris muncul di
  Show deleted dengan keterangan already deleted.
version: 1.0
last_updated: 2026-08-14
status: review
---

# Delete when unused

## Apa ini

**Delete** menghapus Colli Type dari daftar aktif **hanya** jika belum dipakai colli code. Penghapusan = soft delete — masih terlihat di **Show deleted**.

## Kapan dipakai

- Type salah buat dan belum pernah dipakai New Colli.
- Membersihkan master yang tidak terpakai.
- Type sudah dipakai → **jangan** hapus; ganti Code/Name atau biarkan Active.

## Cara pakai

1. Pastikan belum ada colli code untuk type itu.
2. Klik **Delete** pada baris.
3. Cek **Show deleted** — baris tampil dengan keterangan *already deleted*.
4. Jika delete ditolak → type masih dipakai; buat type baru untuk ke depan.

## Catatan

- Sudah dipakai → delete ditolak (pesan: cannot be deleted because already used by one or more Colli codes).
- Tidak sama dengan Active OFF — delete menghilangkan dari list aktif; Inactive masih ada di list tapi tidak dipilih di transaksi.

## Contoh

| Given | Aksi | Hasil |
|-------|------|--------|
| Type belum dipakai | Delete | Soft delete; Show deleted |
| Type sudah punya colli code | Delete | Ditolak |

## Lihat juga

- [Active vs used](#sf-lingo:SF-CT-03)
- [Create Colli Type](#sf-lingo:SF-CT-01)
- Feature Map: [feature-map.md](../feature-map.md)
