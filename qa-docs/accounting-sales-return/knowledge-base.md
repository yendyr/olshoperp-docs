---
doc_type: knowledge-base
menu: accounting-sales-return
menu_name: "Sales Return"
version: 2.0
last_updated: 2026-07-05
owner: QA - Yemima
status: review
audience: operator
sections:
  core: [what-is, workflow, price-columns, complete, journals, faq]
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

| Type | Kapan | Dampak finance |
|------|-------|----------------|
| **Unbilled** | Invoice belum dibayar customer | Jurnal penyesuaian Sales & AR |
| **Billed** | Invoice sudah ada payment | **Credit Note** otomatis + jurnal persediaan |

---

## 5. Tombol Complete

- Hanya muncul jika status **open** dan user punya privilege **approval**.
- Minimal satu qty (Restock/Broken/Lost) > 0.
- Jika ada **Lost Items** → produk wajib punya **Return Expense COA** di Product COA Group.

Setelah Complete, dokumen **read-only** — tidak bisa edit qty.

---

## 6. FAQ

**Q: Kenapa tidak bisa Complete?**  
A: Cek status masih open, qty > 0, fiscal period terbuka, COA lengkap, lost expense COA jika ada lost.

**Q: Apakah Finance bisa input qty?**  
A: Ya — form sama dengan gudang; tapi best practice: gudang input, Finance review & Complete.

**Q: Credit Note di mana?**  
A: Auto-create saat Complete untuk type **Billed**. Lihat menu [Credit Note](../accounting-credit-note/knowledge-base.md).

**Q: Auto-approve?**  
A: Bisa aktif via Global Setting Sales Return Configuration — SR open lama auto-complete.

---

## Related Documents

| Doc | Path |
|-----|------|
| Requirement Finance | [requirement.md](./requirement.md) |
| Canonical (full flow) | [../supplychain-sales-returns/requirement.md](../supplychain-sales-returns/requirement.md) |
| Failed Ship vs SR | [../supplychain-failed-ship/knowledge-base.md](../supplychain-failed-ship/knowledge-base.md) |
