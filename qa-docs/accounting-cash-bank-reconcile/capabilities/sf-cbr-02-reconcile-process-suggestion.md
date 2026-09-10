---
doc_type: menu-capability
menu: accounting-cash-bank-reconcile
id: SF-CBR-02
title: Reconcile Process & Suggestion
aliases: [saran match, see other, reconcile process tab]
scope: menu
summary: >-
  Tab Reconcile Process menampilkan saran pasangan bank↔journal.
  Toleransi sekitar 5% hanya untuk saran; Match final harus nominal sama persis.
version: 1.0
last_updated: 2026-09-10
status: review
---

# Reconcile Process & Suggestion

## Apa ini

Tab di form reconcile yang menampilkan baris bank vs journal internal, plus **saran** pasangan yang mirip. Dari sini kamu Match langsung atau buka panel pencarian (**See Other……**).

## Kapan dipakai

- Setelah import bank statement.
- Saat ingin melihat kandidat Match otomatis sebelum memilih manual.

## Cara pakai

1. Buka tab **Reconcile Process** (dokumen masih boleh di-update).
2. Lihat saran di tengah: kalau sudah pas, klik **Match**.
3. Banyak kandidat → klik **See N other matching transactions**.
4. Tidak ada saran → **See Other……** / cari manual.
5. Panel matching lanjut: [Matching Slideover](#sf-lingo:SF-CBR-03) (TO-BE) atau modal yang ada sekarang.

## Catatan

- Saran boleh longgar (~5%); **Match** wajib total **sama persis**.
- Ada tip jika sisi debit/kredit berlawanan meskipun nominal mirip — cek dulu sebelum Match.
- Setelah Match, baris hilang dari daftar process dan status jadi Reconciled.

## Contoh

| Situasi | Yang kamu lihat | Aksi |
|---------|-----------------|------|
| Tanggal & nominal sama | Saran kuat | Match |
| Nominal mirip, tanggal beda | Saran longgar | Cek dulu, Match hanya jika total exact |
| Tidak ada kandidat | “No matching…” + See Other | Cari manual / buat journal |

## Lihat juga

- [Match, Unmatch & Approve](#sf-lingo:SF-CBR-05)
- [Quick Journal](#sf-lingo:SF-CBR-04)
- KB: [../knowledge-base.md](../knowledge-base.md) §5
