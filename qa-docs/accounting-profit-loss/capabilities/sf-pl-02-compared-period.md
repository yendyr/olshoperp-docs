---
doc_type: menu-capability
menu: accounting-profit-loss
id: SF-PL-02
title: Compared Period
aliases: [bandingkan periode, multi period, compare periods, compared period]
scope: menu
summary: >-
  Bandingkan sampai 11 periode ke belakang berdampingan (max 12 kolom).
  Kolom kiri = periode dipilih; kolom kanan = lebih lama.
version: 1.0
last_updated: 2026-08-12
status: review
---

# Compared Period

## Apa ini

**Compared Period** mengatur berapa banyak periode **pembanding** yang ditampilkan di samping periode yang kamu pilih. **None (0)** = hanya 1 kolom. Maksimal **11** pembanding → total **12** kolom amount.

## Kapan dipakai

- Bandingkan performa minggu/bulan ini vs beberapa periode sebelumnya.
- Melihat tren tanpa buka laporan berkali-kali.
- Memakai [Difference %](#sf-lingo:SF-PL-04) antar kolom.

## Cara pakai

1. Set [Period](#sf-lingo:SF-PL-01) (tanggal awal–akhir).
2. Pilih **Compared Period**: None … 11 periods.
3. **Apply**.
4. Baca kolom dari kiri (terbaru / selected) ke kanan (lebih lama).
5. Lihat kolom % di antara amount (kecuali kolom paling kanan).

## Catatan

- Durasi tiap kolom pembanding mengikuti panjang periode selected (jumlah hari inklusif), **tanpa tumpang tindih**.
- Kecuali filter pas **satu bulan kalender penuh** — sistem bandingkan per bulan kalender (panjang bulan bisa beda).
- Compared besar + rentang panjang bisa membuat laporan lambat — mulai dari 1–2 dulu.
- Filter TO-BE “Bandingkan dengan / Bandingkan periode / Urutan” belum ada terpisah; AS-IS = satu kontrol Compared Period.

## Contoh

| Given | Aksi | Hasil |
|-------|------|--------|
| 1 Apr–15 Mei (45 hari), Compared = 2 | Apply | 3 kolom × 45 hari mundur |
| Compared = None | Apply | 1 kolom, tanpa % |
| Compared = 11 | Apply | 12 kolom amount |

## Lihat juga

- [Period filter & Apply](#sf-lingo:SF-PL-01)
- [Difference %](#sf-lingo:SF-PL-04)
- [How amounts are calculated](#sf-lingo:SF-PL-03)
