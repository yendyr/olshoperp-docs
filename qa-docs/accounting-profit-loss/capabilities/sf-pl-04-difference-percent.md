---
doc_type: menu-capability
menu: accounting-profit-loss
id: SF-PL-04
title: Difference %
aliases: [persentase selisih, difference percent, % vs previous period]
scope: menu
summary: >-
  Kolom % membandingkan amount periode lebih baru vs periode sebelah kanan
  (lebih lama). Naik = hijau; turun = merah; 0% disembunyikan.
version: 1.0
last_updated: 2026-08-12
status: review
---

# Difference %

## Apa ini

Kolom **difference / %** menunjukkan perubahan amount antara dua periode berdampingan: kolom lebih baru dibanding kolom di kanannya (lebih lama). Dipakai untuk melihat tren cepat tanpa hitung manual.

## Kapan dipakai

- Compared Period lebih dari None (minimal 2 kolom amount).
- Cek apakah performa naik atau turun vs periode sebelumnya.
- Baca warna: hijau = naik (% positif), merah = turun (% negatif).

## Cara pakai

1. Set [Compared Period](#sf-lingo:SF-PL-02) ≥ 1 → **Apply**.
2. Di antara kolom amount, baca nilai %.
3. Kolom amount **paling kanan** (paling lama) **tidak** punya %.
4. Jika selisih 0%, angka % **tidak ditampilkan**.

## Catatan

- Rumus konsep: selisih kolom baru vs lama, dibagi nilai absolut kolom lama, lalu persen.
- Warna saat ini mengikuti **tanda angka % saja**, belum mempertimbangkan “baik/buruk” menurut jenis akun (mis. beban turun = baik).
- Jika kolom lama = 0 dan kolom baru ≠ 0, sistem bisa menampilkan ±100%.
- Compared = None → tidak ada kolom %.

## Contoh

| Kolom baru | Kolom lama | % | Warna |
|------------|------------|---|-------|
| 8 jt | 6 jt | ≈ +33,3% | Hijau |
| 5 jt | 6 jt | ≈ −16,7% | Merah |
| 6 jt | 6 jt | (kosong) | — |

## Lihat juga

- [Compared Period](#sf-lingo:SF-PL-02)
- [How amounts are calculated](#sf-lingo:SF-PL-03)
- Feature Map: [feature-map.md](../feature-map.md)
