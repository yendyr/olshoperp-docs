---
doc_type: knowledge-base
menu: accounting-sales-return
menu_name: "Sales Return"
version: 2.5
last_updated: 2026-11-12
owner: QA - Yemima
status: review
audience: operator
sections:
  core: [what-is, workflow, price-columns, complete, journals, export, faq]
---

# Sales Return Approval — Knowledge Base (Team Finance)

## 1. Apa itu menu ini?

**Sales Return Approval** adalah menu Finance untuk **menyelesaikan (Complete)** retur yang sudah diinput team gudang.

| Item | Nilai |
|------|-------|
| Menu | Finance Accounting → **Sales Return** |
| Route | `/accounting/sales-return` |
| Tim | Finance — approve & jurnal |

Gudang input qty di menu SCM terpisah: [Sales Return SCM](../supplychain-sales-returns/knowledge-base.md).

---

## 2. Alur Finance

1. Gudang scan order & input Restock/Broken/Lost → save (status **open**).
2. Finance buka **Sales Return** → cari SR atau scan order yang sama.
3. Review kolom **Order Price/COGS** dan **Return Price/COGS** (proporsional qty retur).
4. Klik **Complete** → sistem:
   - Post stok restock ke gudang return
   - Transfer broken ke scrap (otomatis)
   - Deduction lost + jurnal expense (otomatis)
   - Generate jurnal + **Credit Note** (jika **Billed**)

---

## 3. Kolom harga & COGS

| Kolom | Arti |
|-------|------|
| Order Price / Order COGS | Total nilai order & HPP untuk qty order penuh |
| Return Price / Return COGS | Nilai proporsional untuk qty retur (Restock+Broken+Lost) |

**COGS retur (since 7 Mei 2026):** rata-rata nilai outbound order, bukan stock ID terbaru.

---

## 4. Billed vs Unbilled

Sama seperti Purchase Return: yang menentukan adalah **sudah ada invoice penjualan (SI) atau belum** — **bukan** apakah customer sudah bayar (AR).

| Type | Kapan | Dampak finance |
|------|-------|----------------|
| **Unbilled** | Barang retur **belum punya Sales Invoice** | Jurnal hanya mengembalikan persediaan dan HPP (Return Inventory / COGS). Tidak ada jurnal Sales & AR karena belum ada invoice, dan tanpa Credit Note |
| **Billed** | Barang retur **sudah punya Sales Invoice** | **Credit Note** otomatis + jurnal (mirip Debit Note di Purchase Return billed) |

**Contoh:** dua SKU di satu order, keduanya sudah punya SI; satu SI sudah dilunasi, satu belum ada penerimaan. Keduanya tetap **Billed**.

---

## 5. Tombol Complete

- Hanya muncul jika status **open** dan user punya privilege **approval**.
- Minimal satu qty (Restock/Broken/Lost) lebih dari 0 **di seluruh dokumen**. Satu SKU boleh 0/0/0 dan tetap tersimpan (retur parsial).
- Jika ada **Lost Items** → produk wajib punya **Return Expense COA** di Product COA Group.

Setelah Complete, dokumen **read-only** — tidak bisa edit qty.

---

## 6. Export Excel

**Export** di daftar mengunduh Excel. Dua pilihan:

| Pilihan | Hasil |
|---------|-------|
| **Without Details** (tanpa rincian) | Satu baris Excel = satu dokumen, sama dengan daftar |
| **With Details** (dengan rincian) | Satu baris Excel = satu SKU. Data dokumen diulang di tiap baris |

Contoh: satu dokumen berisi `HOME-DEC-CORTRAYWOOD` dan `TECH-ACC-MULTICARDREADER`. Tanpa rincian = 1 baris. Dengan rincian = 2 baris, masing-masing satu SKU, plus qty, harga, dan HPP.

Di menu Finance ini, harga dan HPP **terisi**. Di menu gudang, keempat angka itu tertulis 0.

Dokumen tanpa baris SKU tetap satu baris. Nama, SKU, varian, dan satuan sudah tanda strip. Angka qty dan harga masih 0, padahal seharusnya strip juga. Perbaikan sudah terdaftar.

**Show/Hide Column** (atur kolom yang terlihat) seharusnya membuat kolom tersembunyi hilang dari Excel, judul maupun isi. Saat ini kolom yang kamu sembunyikan, misalnya Assignee atau Trx. Ref, masih ikut. Perbaikan sudah terdaftar.

---

## 7. FAQ

**Q: Kenapa tidak bisa Complete?**  
A: Cek status masih open, ada minimal satu qty lebih dari 0 di seluruh dokumen, fiscal period terbuka, COA lengkap, lost expense COA jika ada lost. Satu baris SKU yang nol semua bukan penyebabnya.

**Q: Satu SKU 0 semua, boleh?**  
A: Boleh disimpan. Misalnya SKU A Restock 2 dan SKU B 0/0/0. Complete ditolak hanya jika semua baris masih nol.

**Q: Apakah Finance bisa input qty?**  
A: Ya — form sama dengan gudang; tapi best practice: gudang input, Finance review & Complete.

**Q: Credit Note di mana?**  
A: Auto-create saat Complete untuk type **Billed**. Lihat menu [Credit Note](../accounting-credit-note/knowledge-base.md).

**Q: Auto-approve?**  
A: Bisa aktif via Global Setting Sales Return Configuration — SR open lama auto-complete.

**Q: File With Details kok cuma satu baris?**  
A: Kalau dokumen punya lebih dari satu SKU, With Details harus satu baris per SKU. Dua SKU di contoh di atas harus dua baris.

**Q: Kolom yang saya sembunyikan masih ada di Excel?**  
A: Benar, saat ini masih ikut. Show/Hide Column belum diterapkan ke file unduhan. Perbaikan sudah terdaftar.

---

## Related Documents

| Doc | Path |
|-----|------|
| Feature Map | [feature-map.md](./feature-map.md) |
| User Guide | [user-guide.md](./user-guide.md) |
| Requirement Finance | [requirement.md](./requirement.md) |
| Canonical (full flow) | [../supplychain-sales-returns/requirement.md](../supplychain-sales-returns/requirement.md) |
| Failed Ship vs SR | [../supplychain-failed-ship/knowledge-base.md](../supplychain-failed-ship/knowledge-base.md) |
| Credit Note | [../accounting-credit-note/knowledge-base.md](../accounting-credit-note/knowledge-base.md) |
