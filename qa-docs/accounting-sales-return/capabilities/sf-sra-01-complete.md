---
doc_type: menu-capability
menu: accounting-sales-return
id: SF-SRA-01
title: Complete
aliases: [complete sales return, approve sales return, selesai retur]
scope: menu
summary: >-
  Tombol Complete di menu Finance menyelesaikan retur open: post stok,
  jurnal, dan Credit Note jika Billed. Hanya muncul di Sales Return Accounting.
version: 1.0
last_updated: 2026-07-29
status: draft
---

# Complete

## Apa ini

**Complete** adalah aksi Finance untuk **menyetujui dan menyelesaikan** Sales Return yang masih **open**. Setelah Complete, qty terkunci (read-only) dan sistem menjalankan stok + jurnal (+ Credit Note bila Billed).

## Kapan dipakai

- Gudang sudah input Restock/Broken/Lost dan menyimpan SR.
- Finance sudah review harga/COGS.
- Siap menutup retur secara keuangan.

## Cara pakai

1. Buka **Finance Accounting → Sales Return** (`/accounting/sales-return`).
2. Cari SR atau scan order yang sama dengan gudang.
3. Review [Order / Return Price & COGS](#sf-lingo:SF-SRA-03) dan qty [Restock / Broken / Lost](#sf-lingo:SF-SRA-04).
4. Pastikan status **open**, privilege **approval**, minimal satu qty > 0.
5. Klik **Complete** (isi catatan approval jika diminta).
6. Cek hasil: stok/jurnal; jika [Billed](#sf-lingo:SF-SRA-02) → Credit Note otomatis.

## Catatan

- Tombol **Complete** hanya di menu Finance — di SCM Sales Return disembunyikan.
- Ada **Lost** → produk wajib punya **Return Expense COA**.
- Periode fiskal harus terbuka; COA produk harus valid.
- **Reject** belum tersedia di UI.
- Setelah Complete, tidak bisa edit qty.

## Contoh

| Given | Aksi | Hasil |
|-------|------|--------|
| SR open, Restock 2 | Complete | Stok masuk return WH + jurnal |
| SR open Billed | Complete | + Credit Note auto |
| SR open, Lost tanpa expense COA | Complete | Ditolak |

## Lihat juga

- [Billed vs Unbilled](#sf-lingo:SF-SRA-02)
- [Auto-approve](#sf-lingo:SF-SRA-05)
- Credit Note: [../accounting-credit-note/](../accounting-credit-note/)
