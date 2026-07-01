---
doc_type: knowledge-base
menu: accounting-trial-balance
menu_name: "Trial Balance"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
audience: operator
sections:
  core: [what-is, glossary, can-cannot, faq, help]
  modular: [filters, columns, troubleshooting]
---

# Trial Balance — Knowledge Base

> **DRAFT** — Dokumentasi AS-IS dari codebase (19 Juni 2026). Belum final review QA/PM.

## 1. Apa itu Trial Balance?

**Trial Balance** (Neraca Saldo) menampilkan ringkasan saldo debit/kredit per **Chart of Account (COA)** untuk periode yang dipilih. Laporan **read-only** — tidak ada create/edit/delete transaksi dari menu ini.

**Menu:** FA → Report → Trial Balance (`/accounting/trial-balance`)

Data bersumber dari journal berstatus **Approved**, dihitung oleh helper `JournalReport`.

## 2. Glosarium

| Istilah | Arti |
|---------|------|
| Beginning balance | Saldo awal periode (mutasi sebelum `start_date`) |
| In-period | Mutasi debit/kredit antara `start_date` dan `end_date` |
| Ending balance | Beginning + in-period per kolom debit/credit |
| COA class | Kelompok akun: Assets, Liabilities, Equity, Revenue, Expense, COGS, Other Revenue & Expenses |
| Parent COA | Akun induk — saldo di-rollup dari anak via `JournalReport` parent helpers |
| Current Profit/Loss | COA khusus laba rugi berjalan — perhitungan khusus di `JournalReport` |

## 3. Yang Bisa / Tidak Bisa Dilakukan

### Bisa

- Pilih **periode** (date range) lalu **Apply**
- Lihat 7 tabel terpisah per COA class (Assets, Liabilities, Equity, Revenues, Other Revenues & Expenses, Expenses, COGS)
- Lihat hierarki COA (indentasi & bold untuk parent)
- Footer total per tabel (via flag `trial_balance` di DataTables)

### Tidak Bisa

- Buat / edit / hapus transaksi dari menu ini
- Export Excel dari UI Trial Balance (tidak ada endpoint export di controller AS-IS)
- Filter per COA individual di UI (hanya filter periode global)

## 4. Kolom laporan

Setiap tabel punya sub-header tiga blok:

| Blok | Kolom Debit | Kolom Credit |
|------|-------------|--------------|
| **Beginning Balance** | Debit awal | Credit awal |
| **In-Period** | Mutasi debit periode | Mutasi credit periode |
| **Ending Balance** | Debit akhir | Credit akhir |

Baris **CODE** dan **NAME** (COA); nama parent ditampilkan **bold** dengan indentasi.

## 5. Cara Pakai

1. Buka menu Trial Balance
2. Pilih **Period** (range tanggal)
3. Klik **Apply**
4. Scroll per section COA class — bandingkan total footer Beginning vs Ending
5. Untuk detail transaksi per akun → buka **General Ledger** dengan filter COA & periode sama

## 6. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Semua nol | Periode salah / belum Apply | Pilih periode & klik Apply |
| Angka tidak sesuai GL | GL = baris transaksi; TB = agregasi | Normal; cross-check total per COA |
| Parent & child double-count | Parent = rollup anak | Jangan jumlahkan parent + child manual |
| COA tidak muncul | Tidak ada mutasi & bukan parent dengan anak | Cek COA master & journal approved |

## 7. FAQ

**Q: Apakah Trial Balance bisa mengubah jurnal?**  
A: Tidak. Menu ini hanya laporan baca.

**Q: Kenapa ada 7 tabel?**  
A: Satu tabel per **COA class** master (7 class di seeder).

**Q: Hubungan dengan Balance Sheet / P&L?**  
A: Sumber data sama (journal approved); laporan lain menyajikan format berbeda.

## Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Technical | [technical.md](./technical.md) |
