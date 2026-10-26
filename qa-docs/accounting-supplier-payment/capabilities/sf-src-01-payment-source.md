---
doc_type: menu-capability
menu: accounting-supplier-payment
id: SF-SRC-01
title: Payment Source — Cash/Bank & Debit Note
aliases: [payment source, cash bank, debit note source, multi source]
scope: menu
summary: >-
  Sumber dana pembayaran: Cash/Bank, Debit Note, atau kombinasi. TO-BE
  ETM-16761: baris DN stamp COA dari setting by asal DN (PR → Deposit of
  Purchase Return; regular → Deposit to Supplier).
version: 1.1
last_updated: 2026-10-26
status: review
---

# Payment Source — Cash/Bank & Debit Note

## Apa ini

Section **Payment Source** mendaftarkan dari mana uang/potongan diambil untuk membayar hutang. Bisa **Cash/Bank**, **Debit Note** (potong tagihan dari retur/kelebihan bayar), atau **gabungan** beberapa baris.

**COA baris Debit Note (TO-BE · [ETM-16761](https://erpintegration.atlassian.net/browse/ETM-16761)):** sistem identifikasi **asal DN** → baca **setting** (bukan COA di dokumen/jurnal DN):

| Asal DN | Setting |
|---------|---------|
| Purchase Return | **Deposit of Purchase Return** |
| Manual / AP import overpay | **Deposit to Supplier** |

**AS-IS:** semua baris DN stamp Deposit to Supplier → gap jika DN dari PR.

## Kapan dipakai

| Sumber | Pakai jika |
|--------|------------|
| **Cash/Bank** | Bayar keluar dari rekening kas/bank perusahaan |
| **Debit Note** | Memotong hutang dengan DN approved supplier yang sama |
| **Kombinasi** | Sebagian kas, sebagian potong DN |

## Cara pakai

1. Simpan header payment (Supplier, Tanggal, Mata Uang, Kurs) status **Open**.
2. Buka **Payment Source** / Account Payment Source.
3. Tambah **Cash/Bank** — pilih rekening, cek **Balance**, isi amount ≤ saldo tersedia.
4. Dan/atau tambah **Debit Note** — pilih DN approved (supplier & currency cocok), amount ≤ sisa DN.
5. Total Source nanti harus sama dengan total alokasi PI ([Strict balancing](#sf-lingo:SF-PAY-01)).

## Catatan

- Mata uang sumber = mata uang header — beda → ditolak.
- Amount kas tidak boleh melebihi saldo rekening (termasuk yang sudah direservasi payment lain).
- Amount DN tidak boleh melebihi sisa DN.
- **Bulk clearing DN** via FE saat ini bisa error (URL salah) — tambah DN **satu per satu** jika bulk gagal.
- Setelah ada source/detail, ubah header (supplier/currency/tanggal) ditolak — hapus detail dulu.

## Contoh

| Given | Aksi | Hasil |
|-------|------|--------|
| Saldo bank 50 jt, hutang 30 jt | Cash/Bank amount 30 jt | Source 30 jt siap dialokasi |
| DN sisa 5 jt + hutang 30 jt | DN 5 jt + kas 25 jt | Multi-source; total Source 30 jt |
| DN dari PR + DN manual | Kedua baris DN di Source | **TO-BE:** GL Account beda per asal (kolom / jurnal) |
| DN sisa 5 jt, input 6 jt | Simpan | Ditolak — melebihi sisa DN |

## Lihat juga

- [Outstanding PI — Use / Bulk Use / Allocate Full](#sf-lingo:SF-DET-01)
- [Strict balancing](#sf-lingo:SF-PAY-01)
- Feature Map: [feature-map.md](../feature-map.md)
