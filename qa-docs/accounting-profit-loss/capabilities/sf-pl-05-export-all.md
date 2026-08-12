---
doc_type: menu-capability
menu: accounting-profit-loss
id: SF-PL-05
title: Export All
aliases: [export P&L, export excel profit loss, unduh laba rugi]
scope: menu
summary: >-
  Export laporan Profit & Loss ke Excel secara async sesuai filter period
  dan Compared Period yang aktif; pantau progress/log sampai file siap.
version: 1.0
last_updated: 2026-08-12
status: review
---

# Export All

## Apa ini

**Export All** mengunduh isi laporan (sesuai filter yang sudah di-Apply) ke file Excel. Proses berjalan di belakang layar — cek progress/log sampai file siap diunduh.

## Kapan dipakai

- Arsip bulanan / kirim ke auditor atau management.
- Analisa offline setelah bandingkan beberapa periode di layar.
- Snapshot angka setelah journal periode sudah Approved.

## Cara pakai

1. Set [Period](#sf-lingo:SF-PL-01) + [Compared Period](#sf-lingo:SF-PL-02) → **Apply** dan pastikan tabel terisi.
2. Klik **Export All**.
3. Pantau **progress / export log** sampai selesai.
4. Unduh file Excel.

## Catatan

- Jika tidak ada data untuk diexport, sistem menolak dengan pesan tidak ada data.
- Butuh privilege melihat menu Profit & Loss.
- Export mengikuti filter period & compared yang aktif — samakan dulu dengan yang kamu lihat di layar.
- Compared Period besar + rentang panjang bisa membuat export lebih lama.

## Contoh

| Given | Aksi | Hasil |
|-------|------|--------|
| Tabel Mei sudah Apply, ada angka | Export All | Job jalan → file Excel |
| Filter tanpa journal Approved | Export All | Pesan tidak ada data |
| Compared = 3, tabel terisi | Export All | Excel memuat kolom sesuai compare |

## Lihat juga

- [Period filter & Apply](#sf-lingo:SF-PL-01)
- [Compared Period](#sf-lingo:SF-PL-02)
- Knowledge Base: [knowledge-base.md](../knowledge-base.md)
