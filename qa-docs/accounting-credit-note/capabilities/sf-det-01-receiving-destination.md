---
doc_type: menu-capability
menu: accounting-credit-note
id: SF-DET-01
title: Receiving Destination — Cash/Bank & Free COA
aliases: [receiving destination, cash bank CN, bulk use credit note, free COA credit note]
scope: menu
summary: >-
  Isi destinasi nilai Credit Note: Cash/Bank (Use/Bulk Use) dan/atau Free COA
  (TO-BE). Amount > 0 wajib sebelum Approve. Boleh campur; no duplicate COA.
version: 1.1
last_updated: 2026-08-05
status: draft
---

# Receiving Destination — Cash/Bank & Free COA

## Apa ini

Section **Receiving Destination** menampung nilai Credit Note sebagai baris fund.

| Jalur | Status | Ringkas |
|-------|--------|---------|
| **Cash/Bank** | AS-IS | Modal Use / Bulk Use; filter currency header |
| **Free COA** | **TO-BE** | Picker COA leaf semua class (termasuk Equity); exclude Cash/Bank-bound & Deposit COA |

Tanpa minimal satu baris dengan **amount > 0**, Approve ditolak.

## Kapan dipakai

- Membuat CN manual (setelah header tersimpan).
- Melengkapi CN hasil import sebelum Approve (import hanya Cash/Bank).
- Destinasi non-kas (mis. modal awal / Equity) → Free COA setelah fitur live.
- **Bulk Use** untuk banyak rekening sekaligus.

## Cara pakai

1. Simpan header CN (customer, tanggal, mata uang, kurs). Create tetap butuh Cash/Bank aktif untuk currency.
2. Buka **Receiving Destination**.
3. Tambah baris:
   - **Cash/Bank — Use** — satu rekening, isi amount.
   - **Cash/Bank — Bulk Use** — beberapa rekening; **amount sering 0** → edit manual.
   - **Free COA (TO-BE)** — pilih COA + amount (+ memo); amount 0 di add OK, isi sebelum Approve.
4. Opsional isi memo per baris. Boleh campur Cash/Bank + free COA.
5. Cek total di footer → **Approve** (Deposit COA customer harus sudah terisi di master).

## Catatan

- Mata uang rekening Cash/Bank harus sama dengan header; free COA ikut currency header.
- `coa_id` sama tidak boleh duplikat dalam satu CN (lintas jalur).
- Free COA: jangan pilih COA yang sudah Master Cash Bank (pakai field Cash/Bank) atau Deposit customer/store.
- Setelah ada baris fund, **customer / currency / kurs / tanggal** terkunci — hapus semua baris dulu jika perlu diganti.
- Approve gagal jika Deposit COA customer/store kosong di master.
- CN hanya free COA (tanpa baris bank) **tidak** kena cash bank reconcile lock (TO-BE).

## Contoh

| Given | Aksi | Hasil |
|-------|------|--------|
| Satu bank IDR | Use amount 1.000.000 | Total CN 1.000.000; siap Approve |
| Bulk Use 3 rekening | Amount masih 0 | Isi amount manual → baru Approve |
| Equity leaf (TO-BE) | Free COA amount 500.000 | Fund type `COA`; journal Dr Equity |
| Campur bank + Equity | Kedua jalur | OK jika `coa_id` berbeda |
| Ganti customer setelah ada fund | Langsung ubah header | Ditolak — clear Receiving Destination dulu |

## Lihat juga

- [How CN is created](#sf-lingo:SF-CN-01)
- [Total / Paid / Outstanding](#sf-lingo:SF-CN-02)
- Knowledge Base: [§3 Alur kerja](../knowledge-base.md)
- Requirement: §5.2 · GAP-CN-05
