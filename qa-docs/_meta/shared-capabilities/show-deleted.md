---
doc_type: shared-capability
id: SF-DL-03
title: Show Deleted
aliases: [tampilkan terhapus, show deleted data, deleted data]
scope: global
summary: >-
  Toggle di datalist untuk menampilkan baris yang sudah dihapus, tanpa
  mengembalikan data ke daftar aktif.
version: 0.2
last_updated: 2026-07-27
status: draft
---

# Show Deleted

## Apa ini

Saklar di daftar transaksi untuk **melihat** data yang sudah dihapus. Mengaktifkannya tidak mengembalikan data ke status aktif.

## Kapan dipakai

- Mencari transaksi yang “hilang” setelah dihapus.
- Mengecek apakah dokumen sudah pernah dibuat lalu di-soft-delete.
- Audit cepat tanpa membuka log khusus.

## Cara pakai

1. Buka datalist menu terkait.
2. Aktifkan toggle **Show Deleted** (biasanya di area filter / toolbar tabel).
3. Tabel di-refresh — baris terhapus ikut tampil (sering ada indikator visual).
4. Matikan toggle untuk kembali hanya ke data aktif.

## Catatan

| State | Hasil |
|-------|--------|
| Off (default) | Hanya data aktif |
| On | Data terhapus ikut tampil |

- Baris terhapus biasanya **tidak** bisa diubah / di-approve — hanya dilihat. Perilaku aksi bisa berbeda per menu.
- Ini bukan tombol *restore*; mengembalikan data butuh alur/izin terpisah (jika menu mendukung).

## Contoh

| Given | Show Deleted | Hasil |
|-------|--------------|--------|
| Draft dihapus user | ON | Baris muncul lagi di daftar |
| Sama | OFF | Baris tidak muncul |

## Lihat juga

- Override per menu: Feature Map menu terkait (jika tidak ada catatan → ikuti default ini)
