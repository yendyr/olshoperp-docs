---
doc_type: knowledge-base
menu: supplychain-mutation-outbound
menu_name: "Outbound External"
version: 2.0
last_updated: 2026-10-11
owner: QA - Yemima
status: review
audience: operator
aliases: [outbound external, inventory out, keluarkan stok, OT]
---

# Outbound External — Knowledge Base (Operator)

**Audience:** Warehouse, ops, finance support  
**Menu:** Supply Chain → Outbound External  
**Route:** `/supplychain/mutation-outbound`  
**Kode:** `OT-…`

---

## 1. Apa itu Outbound External?

Menu untuk **mengeluarkan barang dari gudang** supaya stok berkurang dan pembukuan ikut (jurnal saat approve).

Dua tipe:

| Type | Kapan dipakai | Gudang asal |
|------|---------------|-------------|
| **Sales Order** | Order general/internal keluar dari **3PL** | Hanya 3PL |
| **Other** | Pemakaian operasional **tanpa** nomor order (contoh: HRD ambil ATK/buku dari stok) | Bebas, **bukan** 3PL |

OT dari **Instant Settlement** atau **Assembly** dibuat otomatis & langsung approved — **jangan diedit** di sini.

---

## 2. Kapan buat OT?

| ✅ Buat | ❌ Jangan |
|---------|-----------|
| Mau kurangi stok manual (Other) atau dari order di 3PL (Sales Order) | Coba edit OT yang sudah dari Settlement/Assembly |
| Fiscal period & COA produk sudah siap | Approve tanpa detail / stok tidak cukup |

---

## 3. Cara pakai singkat

1. **Create** — sering langsung ke edit (mengikuti gudang + tipe transaksi terakhir). Belum pernah ada OT → isi tanggal, tipe, gudang dulu.
2. Pilih tipe **Sales Order** atau **Other**.
3. Tambah barang: Select Product, modal Available Products (Use / Bulk Use), atau Import.
4. Pastikan status **Open** → **Approve**.
5. Cek stok & jurnal.

🎬 [Interactive demo akan ditambahkan di sini]

---

## 4. Group View vs Detail View (contoh)

SKU-PENSIL datang 2 kali: 1.500 pcs lalu 500 pcs. Outbound **1.700** pcs:

- **Group View:** satu baris SKU-PENSIL **1.700**
- **Detail View:** **1.500** + **200** (pecahan stock id)

**Is FIFO = ya** → sistem pilih batch (Select Product / Import).  
**Is FIFO = tidak** → kamu pilih stock id di modal Use / Bulk Use; qty max = stock id itu.

---

## 5. Setelah approve

- Stok berkurang.
- Jurnal: persediaan kredit; debit biaya operasional (Other), HPP/COGS (Sales Order), atau WIP (dari Assembly).
- Order terkait bisa memicu Sales Invoice otomatis (kondisional).
- **Tidak ada unapprove** di staging/production. OT dari settlement dihapus lewat **delete Instant Settlement**.

---

## 6. Troubleshooting

| Gejala | Cek |
|--------|-----|
| Gudang 3PL tidak muncul (Other) / sebaliknya | Tipe radio salah |
| Stok SKU kosong di select | WH origin & availability |
| Approve gagal “related with Sales Order” | OT terikat header SO / jalur platform — diskusikan dengan QA (aturan campur) |
| DO Status hanya Prepared / `-` | AS-IS belum nomor DO — improvement terpisah |
| Import gagal | Format 4 kolom; baca import log `Row N` |
| Create tidak autosave | Belum pernah ada OT di company |

---

## 7. FAQ

**Q: Beda Other dan Sales Order?**  
Other = tanpa order (ATK, pemakaian dept). Sales Order = keluar untuk order dari gudang 3PL saja.

**Q: Satu OT banyak order?**  
Ya, selama origin/store selaras (type Sales Order).

**Q: Export daftar?**  
Bisa with details atau without details.

**Q: Print / Show di Approved?**  
Tetap bisa; edit/delete tidak.

---

## Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Technical | [technical.md](./technical.md) |
| User Guide | [user-guide.md](./user-guide.md) |
| Instant Settlement | [../accounting-settlement-upload/knowledge-base.md](../accounting-settlement-upload/knowledge-base.md) |
