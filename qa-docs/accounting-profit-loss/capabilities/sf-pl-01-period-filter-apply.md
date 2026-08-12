---
doc_type: menu-capability
menu: accounting-profit-loss
id: SF-PL-01
title: Period filter & Apply
aliases: [period filter, apply P&L, preset tanggal, filter periode]
scope: menu
summary: >-
  Pilih rentang tanggal (default bulan berjalan) dan preset 1/2/3 minggu atau
  1 bulan, lalu klik Apply agar tabel Profit & Loss terisi.
version: 1.0
last_updated: 2026-08-12
status: review
---

# Period filter & Apply

## Apa ini

Kontrol **Period** menentukan rentang tanggal laporan. Tanpa klik **Apply**, tabel belum terisi / belum memuat data periode itu.

## Kapan dipakai

- Melihat laba rugi bulan berjalan (default saat buka menu).
- Mempersempit ke 1–3 minggu atau 1 bulan lewat preset.
- Mengganti tanggal bebas lalu me-refresh angka.

## Cara pakai

1. Buka **Profit & Loss**.
2. Isi **tanggal awal** dan **tanggal akhir** (default = bulan berjalan).
3. Opsional: pilih preset **1 week / 2 weeks / 3 weeks / 1 month**.
4. Opsional: set [Compared Period](#sf-lingo:SF-PL-02).
5. Klik **Apply** — tabel muncul dengan kolom periode.
6. **Refresh** hanya menggambar ulang tanpa mengubah URL filter (sesuai UI).

## Catatan

- Belum Apply → jangan kira data kosong; coba Apply dulu.
- Preset AS-IS = week/month dari start bulan berjalan — belum ada dropdown “Bulan Lalu / Kuartal” (masih keputusan product).
- Kalau filter = **satu bulan kalender penuh**, cara banding periode ikut path khusus — lihat tips whole-month di User Guide.

## Contoh

| Given | Aksi | Hasil |
|-------|------|--------|
| Baru buka menu | Apply tanpa ubah | Tabel bulan berjalan |
| Ingin 1–15 Mei | Set tanggal → Apply | Satu kolom (jika Compared None) untuk 1–15 Mei |
| Lupa Apply | Hanya ubah tanggal | Tabel belum update |

## Lihat juga

- [Compared Period](#sf-lingo:SF-PL-02)
- [How amounts are calculated](#sf-lingo:SF-PL-03)
- Feature Map: [feature-map.md](../feature-map.md)
