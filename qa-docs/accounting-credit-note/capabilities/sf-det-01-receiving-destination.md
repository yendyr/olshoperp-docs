---
doc_type: menu-capability
menu: accounting-credit-note
id: SF-DET-01
title: Receiving Destination — Use / Bulk Use
aliases: [receiving destination, cash bank CN, bulk use credit note]
scope: menu
summary: >-
  Isi rekening Cash/Bank tujuan pada Credit Note. Use = satu rekening;
  Bulk Use = banyak sekaligus (amount sering mulai 0 — wajib diisi sebelum Approve).
version: 1.0
last_updated: 2026-07-29
status: draft
---

# Receiving Destination — Use / Bulk Use

## Apa ini

Section **Receiving Destination** memilih rekening **Cash/Bank** yang menampung nilai Credit Note. Tanpa minimal satu baris dengan **amount > 0**, Approve ditolak.

## Kapan dipakai

- Membuat CN manual (setelah header tersimpan).
- Melengkapi CN hasil import sebelum Approve (jika perlu koreksi).
- **Bulk Use** untuk banyak rekening sekaligus.

## Cara pakai

1. Simpan header CN (customer, tanggal, mata uang, kurs).
2. Buka **Receiving Destination**.
3. Pilih Cash/Bank lewat modal:
   - **Use** — satu rekening, isi amount.
   - **Bulk Use** — beberapa rekening; **amount sering mulai 0** → edit manual tiap baris.
4. Opsional isi memo per baris.
5. Cek total di footer → **Approve** (Deposit COA customer harus sudah terisi di master).

## Catatan

- Mata uang rekening harus sama dengan mata uang header.
- Rekening/COA yang sama tidak boleh duplikat dalam satu CN.
- Setelah ada baris fund, **customer / currency / kurs / tanggal** terkunci — hapus semua baris dulu jika perlu diganti.
- Approve gagal jika Deposit COA customer/store kosong di master.

## Contoh

| Given | Aksi | Hasil |
|-------|------|--------|
| Satu bank IDR | Use amount 1.000.000 | Total CN 1.000.000; siap Approve |
| Bulk Use 3 rekening | Amount masih 0 | Isi amount manual → baru Approve |
| Ganti customer setelah ada fund | Langsung ubah header | Ditolak — clear Receiving Destination dulu |

## Lihat juga

- [How CN is created](#sf-lingo:SF-CN-01)
- [Total / Paid / Outstanding](#sf-lingo:SF-CN-02)
- Knowledge Base: [§3 Alur kerja](../knowledge-base.md)
