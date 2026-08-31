---
doc_type: menu-capability
menu: accounting-customer-invoice
id: SF-IMP-01
title: Import saldo awal
aliases: [import sales invoice, import SI, ETM-14976, template SI]
scope: menu
summary: >-
  Import Excel 3 kolom untuk SI dari SO General. Hasil status Open saja —
  jurnal baru terbit saat Approve manual. Satu baris rusak menggagalkan batch.
version: 1.0
last_updated: 2026-08-31
status: review
---

# Import saldo awal

## Apa ini

**Import** mengunggah file Excel agar banyak Sales Invoice dibuat dari Sales Order General (saldo awal / massal). Template **3 kolom**: Transaction Date · Order Number · Platform Order ID.

## Kapan dipakai

- Migrasi / saldo awal banyak SO sekaligus.
- Tidak ingin klik Use satu per satu untuk tiap SO.

## Cara pakai

1. Unduh template Import di datalist Sales Invoice.
2. Isi tanggal + **Order Number atau Platform Order ID** (salah satu — jangan keduanya kosong/terisi).
3. Upload file (.XLSX).
4. Cek hasil: tiap SO valid → **satu SI status Open** (semua outstanding line ikut).
5. Buka SI → **Approve** agar jurnal terbit.

## Catatan

| Aturan | Detail |
|--------|--------|
| Tipe SO | Hanya **General/internal** — platform ditolak |
| Sudah pernah di-invoice | Ditolak |
| Partial success | **Tidak** — 1 baris invalid → seluruh import gagal |
| Setelah import | Status **Open** — belum Approve |

## Contoh

| File | Hasil |
|------|--------|
| SO General valid | SI Open; Approve → jurnal |
| SO platform | Ditolak |
| Satu baris tanggal kosong | Import failed all + log |

## Lihat juga

- [How SI is created](#sf-lingo:SF-SI-01)
- [Outstanding SO Use](#sf-lingo:SF-DET-01)
- [Platform SI limits](#sf-lingo:SF-SI-04)
