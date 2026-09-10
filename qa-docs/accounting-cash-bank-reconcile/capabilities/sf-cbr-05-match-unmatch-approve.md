---
doc_type: menu-capability
menu: accounting-cash-bank-reconcile
id: SF-CBR-05
title: Match, Unmatch & Approve
aliases: [unmatch, approve reconcile, difference zero]
scope: menu
summary: >-
  Match menandai baris bank dan journal sudah cocok (nominal exact).
  Unmatch hanya sebelum Approve dokumen BR. Approve mengunci dokumen, bukan membuat jurnal.
version: 1.0
last_updated: 2026-09-10
status: review
---

# Match, Unmatch & Approve

## Apa ini

Tiga aksi inti siklus reconcile: **Match** (pasangan final), **Unmatch** (batalkan pasangan), **Approve** (kunci dokumen `BR-`).

## Kapan dipakai

| Aksi | Kapan |
|------|--------|
| **Match** | Total pasangan sudah exact (Difference 0 di panel matching) |
| **Unmatch** | Salah pilih pasangan, dokumen masih Draft/Open |
| **Approve** | Matching & Difference sudah masuk akal; siap kunci |

## Cara pakai

1. **Match** dari saran tab process atau dari panel matching setelah Difference = 0.
2. Cek status Reconciled di Bank Statement / Internal Transaction.
3. Salah? **Unmatch** (sebelum Approve) — kedua sisi kembali Not Reconciled.
4. Siap kunci → **Approve** dokumen `BR-` (bukan membuat jurnal baru).

## Catatan

- Match final **tanpa** toleransi 5% — harus nominal sama.
- Approve **dokumen BR** ≠ membuat journal. Journal dibuat di menu Journal atau lewat [Quick Journal](#sf-lingo:SF-CBR-04).
- Setelah Approve: tidak unmatch/edit; kunci periode ideal masih dalam perbaikan — cek Difference dulu.
- (TO-BE) Setelah Quick Journal di-approve: baris hanya **auto-selected**; **Match tetap klik manual**.

## Contoh

| Langkah | Hasil |
|---------|--------|
| Match bank 3.000.000 + journal 3.000.000 | Kedua sisi Reconciled |
| Unmatch | Kembali Not Reconciled |
| Approve BR | Dokumen terkunci |

## Lihat juga

- [Reconcile Process & Suggestion](#sf-lingo:SF-CBR-02)
- [Matching Slideover](#sf-lingo:SF-CBR-03)
- User guide: [../user-guide.md](../user-guide.md) §5–6
