---
doc_type: knowledge-base
menu: general-ledger
menu_name: "General Ledger Report"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: review
audience: operator
sections:
  core: [what-is, filters, columns, faq]
---

# General Ledger Report — Knowledge Base

## 1. Apa itu General Ledger?

Laporan **buku besar** — menampilkan semua transaksi jurnal per **Chart of Account (COA)** dalam periode yang dipilih. Hanya journal berstatus **Approved** yang muncul.

**Menu:** FA → Report → General Ledger (`/accounting/general-ledger`)

## 2. Filter yang perlu diketahui

| Filter | Default | Catatan |
|--------|---------|---------|
| Periode (Trx Date) | Bulan berjalan | Via Advanced Filter |
| COA | Opsional | Bisa filter satu atau beberapa akun |
| Company | Otomatis | Sesuai company login |

## 3. Kolom utama

| Kolom | Arti |
|-------|------|
| TRX. DATE | Tanggal transaksi journal |
| TRX. CODE | Nomor journal (klik → buka journal) |
| JOURNAL TYPE | Asal journal (manual, sales invoice, payment, dll.) |
| TRX. REF. | Nomor dokumen sumber (invoice, payment, stock mutation) |
| DESCRIPTION | Keterangan baris jurnal |
| FOREIGN | Nilai mata uang asing (jika journal foreign currency) |
| DEBIT / CREDIT | Nilai dalam mata uang utama perusahaan |

**Opening / Ending Balance** (export): saldo awal & akhir per COA dalam periode — saat ini nilai sama di setiap baris dalam satu COA (bukan running balance per transaksi di UI).

## 4. Export Excel

- Tombol export di datalist
- Proses async — cek tab Export File untuk download
- Kolom export lebih lengkap (termasuk Opening/Ending Balance numerik)

## 5. Yang perlu diwaspadai (AS-IS)

| Gejala | Penjelasan singkat |
|--------|-------------------|
| Group header COA tanpa total | Header hanya kode+nama COA, belum ada total debit/credit grup |
| Saldo tidak running per baris | Opening/Ending sama di semua baris satu COA |
| COA Passiva | Perhitungan saldo bisa berbeda antara UI dan export |

Improvement TO-BE sedang didokumentasikan di requirement.md §5–7.

## 6. FAQ

**Q: Kenapa transaksi saya tidak muncul?**  
A: Cek status journal — harus **Approved**. Cek juga filter periode dan company.

**Q: Dari mana data GL?**  
A: Dari detail journal (`Journal Detail`) yang terhubung ke COA.

**Q: Apa hubungan dengan Trial Balance?**  
A: Keduanya dari journal approved; Trial Balance agregasi per COA, GL menampilkan baris transaksi.
