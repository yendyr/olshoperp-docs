---
doc_type: knowledge-base
menu: general-ledger
menu_name: "General Ledger Report"
version: 1.1
last_updated: 2026-09-01
owner: QA - Yemima
status: review
audience: operator
sections:
  core: [what-is, filters, columns, store, faq]
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
| **Store** | Opsional | Global search atau Advanced Filter kolom **Store** — cari nama store di header journal |
| Company | Otomatis | Sesuai company login |

## 3. Kolom utama

| Kolom | Arti |
|-------|------|
| TRX. DATE | Tanggal transaksi journal |
| TRX. CODE | Nomor journal (klik → buka journal) |
| **STORE** | Nama store dari **header journal** (bukan langsung dari invoice/payment). Multi-store: hover tooltip untuk daftar lengkap |
| JOURNAL TYPE | Asal journal (manual, sales invoice, payment, dll.) |
| TRX. REF. | Nomor dokumen sumber (invoice, payment, stock mutation) |
| DESCRIPTION | Keterangan baris jurnal |
| FOREIGN | Nilai mata uang asing (jika journal foreign currency) |
| DEBIT / CREDIT | Nilai dalam mata uang utama perusahaan |

**Opening / Ending Balance** (export): saldo awal & akhir per COA dalam periode — saat ini nilai sama di setiap baris dalam satu COA (bukan running balance per transaksi di UI).

## 4. Kolom Store — operator perlu tahu

| Situasi | Tampilan Store di GL |
|---------|----------------------|
| Journal manual / auto-journal yang sudah isi store di header | Nama store (atau beberapa nama, dipisah koma) |
| Journal tanpa store di header | `-` |
| Settlement — baris SI/OB | Biasanya terisi (dari store sales order) |
| Settlement — baris AR (setelah Approve) | Saat ini sering `-` meski batch punya store — **gap sistem** (lihat requirement §9) |
| Reject settlement | Tidak ada journal AR; baris SI/OB yang sudah jurnal tetap ada |

**Aturan bisnis:** store di GL mengikuti **header journal**. Jika transaksi sumber punya store tapi belum masuk header journal, kolom GL tidak akan menampilkan store meskipun dokumen sumber (invoice/payment) punya store.

## 5. Export Excel

- Tombol export di datalist
- Proses async — cek tab Export File untuk download
- Kolom export lebih lengkap (termasuk **Store** kolom D, Opening/Ending Balance numerik)

## 6. Yang perlu diwaspadai (AS-IS)

| Gejala | Penjelasan singkat |
|--------|-------------------|
| Group header COA tanpa total | Header hanya kode+nama COA, belum ada total debit/credit grup |
| Saldo tidak running per baris | Opening/Ending sama di semua baris satu COA |
| COA Passiva | Perhitungan saldo bisa berbeda antara UI dan export |
| Store `-` padahal invoice/payment punya store | Pivot store belum ditulis ke header journal saat auto-journal — gap dev (AR, Credit Note, Debit Note) |

Improvement TO-BE saldo/grup sedang didokumentasikan di requirement.md §5–7.

## 7. FAQ

**Q: Kenapa transaksi saya tidak muncul?**  
A: Cek status journal — harus **Approved**. Cek juga filter periode dan company.

**Q: Dari mana data GL?**  
A: Dari detail journal (`Journal Detail`) yang terhubung ke COA.

**Q: Dari mana kolom Store?**  
A: Dari store yang tercatat di **header journal** (Basic Information menu Journal), bukan langsung dari menu invoice/payment.

**Q: Kenapa filter Store tidak menemukan transaksi yang saya tahu punya store?**  
A: Filter GL hanya membaca pivot header journal. Jika auto-journal belum menulis store ke header, baris tidak akan match filter Store.

**Q: Apa hubungan dengan Trial Balance?**  
A: Keduanya dari journal approved; Trial Balance agregasi per COA, GL menampilkan baris transaksi.

**Q: Apa hubungan dengan Instant Settlement?**  
A: Upload settlement menghasilkan journal SI/OB (store biasanya terisi). Journal AR hanya saat **Approve** batch; **Reject** tidak membuat journal AR.
