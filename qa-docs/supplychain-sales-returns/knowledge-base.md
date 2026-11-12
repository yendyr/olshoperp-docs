---
doc_type: knowledge-base
menu: supplychain-sales-returns
menu_name: "Sales Return"
version: 2.5
last_updated: 2026-11-12
owner: QA - Yemima
status: review
audience: operator
sections:
  core: [what-is, vs-failed-ship, workflow, ui-buttons, export, qty-rules, troubleshooting, faq]
---

# Sales Return — Knowledge Base (Team Gudang)

## 1. Apa itu Sales Return?

Fitur untuk memproses **pengembalian barang dari customer** setelah order sudah **Outbound** dan **Sales Invoice** terbit.

| Item | Nilai |
|------|-------|
| Menu | Supply Chain → Operations → **Sales Return** |
| Route | `/supplychain/sales-returns` |
| Kode dokumen | `SR-…` |
| Tim | **Gudang** — input qty; **Finance** approve di menu terpisah |

> **Bukan Failed Ship.** Failed Ship untuk paket gagal kirim **sebelum** invoice/outbound. Sales Return untuk retur **setelah** barang sudah keluar dan di-invoice.

---

## 2. Kapan dipakai?

- Customer kirim balik barang (retur marketplace / internal).
- Platform status refund/cancelled — muncul di pill **Sales Return Platform**.
- Order sudah punya **Outbound Approved** + **Sales Invoice**.

**Tidak bisa dipakai jika:**

- Order belum outbound → gunakan **Failed Ship**
- Invoice masih foreign currency (non-IDR) → manual settlement
- Masih ada pending payment di invoice

---

## 3. Langkah operator gudang

### Step 1 — Siapkan lokasi

1. Buka **Sales Return**.
2. Pilih **Return WH Location** — hanya gudang yang di-set **Return Location** di Warehouse Setting.
3. Pilih **CCTV Location** — lokasi kamera saat proses retur.
4. Pilihan tersimpan otomatis untuk session berikutnya.
5. **Reset** — kosongkan WH & CCTV jika perlu.

### Step 2 — Scan order

1. Scan/ketik **nomor SO internal** atau **platform order ID**.
2. Sistem validasi outbound, invoice, currency IDR.
3. Jika valid → redirect ke halaman edit SR.

**Alternatif:** buka pill **Sales Return Platform** → pilih order refund/cancelled → **Continue**.

### Step 3 — Input qty retur (per SKU)

| Kolom | Arti |
|-------|------|
| **Product Qty** | Qty order asli |
| **Restock Qty** | Barang layak → masuk gudang return |
| **Broken Items** | Rusak → otomatis pindah ke gudang scrap saat Finance approve |
| **Lost Items** | Hilang → otomatis deduction + biaya saat Finance approve |
| **Total SR Qty** | Restock + Broken + Lost — **tidak boleh > Product Qty** |

Qty auto-save setelah edit (~1 detik). Satu SKU yang Restock, Broken, dan Lost-nya semuanya 0 tetap tersimpan. Itu normal untuk retur parsial.

**Pesan sukses:** *"Return data saved. Waiting for Finance team to review and complete the approval process."*

### Step 4 — Selesai (gudang)

- **Tidak ada tombol Complete** di menu SCM — itu tugas Finance.
- Bisa **Back to Datalist** atau lanjut order lain.
- Bisa **Delete** SR jika belum di-approve Finance.

---

## 4. Tombol toolbar datalist

| Tombol | Fungsi |
|--------|--------|
| **Sales Return Platform** | Toggle daftar order platform refund/cancelled |
| **Sync** | Tarik data retur terbaru dari marketplace API |
| **Reset** | Clear WH + CCTV selection |
| **Export** | Unduh Excel. Pilih ringkasan dokumen atau rincian per SKU — lihat §4.1 |
| **Continue** | Lanjut proses SR yang sudah ter-create |
| **Delete** | Hapus SR open (belum approved) |
| **Show** | Lihat SR yang sudah approved (read-only) |

### 4.1 Export Excel

**Export** mengunduh Excel dari daftar. Ada dua pilihan.

**Without Details** (tanpa rincian): satu baris Excel = satu dokumen retur, sama dengan baris di daftar.

**With Details** (dengan rincian): satu baris Excel = satu SKU. Kalau satu dokumen punya dua SKU, misalnya `HOME-DEC-CORTRAYWOOD` dan `TECH-ACC-MULTICARDREADER`, file berisi **dua baris**. Kode transaksi, pembeli, dan data dokumen lain diulang di tiap baris. Rincian yang ikut: SKU, nama produk, varian, harga dan HPP order, qty produk, harga dan HPP retur, qty yang masih outstanding, Restock, Lost, Broken, total qty retur, dan satuan.

Di **menu gudang ini**, keempat nilai harga dan HPP tertulis **0**. Kolomnya tetap ada. Angka harga terisi di menu Finance.

Dokumen yang tidak punya baris SKU tetap muncul **satu baris**, tidak hilang. Seharusnya seluruh kolom rincian berisi tanda strip. Saat ini nama, SKU, varian, dan satuan sudah strip, tetapi angka qty dan harga masih 0. Perbaikan sudah terdaftar.

**Show/Hide Column** (pilih kolom mana yang terlihat di daftar) seharusnya ikut ke file: kolom yang kamu sembunyikan tidak boleh ada di judul maupun isi Excel. Saat ini kolom yang disembunyikan, misalnya Assignee atau Trx. Ref, masih ikut terunduh. Perbaikan sudah terdaftar.

---

## 5. Aturan qty

```
Total SR Qty = Restock + Broken + Lost
Total SR Qty ≤ (Qty outbound - retur sebelumnya)
```

Minimal **satu** dari Restock/Broken/Lost di **seluruh dokumen** harus lebih dari 0 sebelum Finance bisa menyelesaikan retur. Satu baris SKU boleh 0/0/0 dan tetap tersimpan.

---

## 6. Troubleshooting

| Gejala | Penyebab | Tindakan |
|--------|----------|----------|
| SO tidak ditemukan | Kode salah | Cek SO code / platform order ID |
| "please use Failed Ship" | Belum outbound | Proses Failed Ship dulu |
| "not been fully processed to invoice" | Belum SI | Selesaikan invoice/settlement |
| Foreign currency error | SI non-IDR | Manual settlement |
| Pending payment | AR/payment belum selesai | Selesaikan payment dulu |
| Pending SR exists | Ada SR open | Selesaikan atau delete SR lama |
| Total qty exceed | Restock+Broken+Lost > order qty | Kurangi qty |
| "Not Authorized" di datalist | Belum create SR | Scan order dulu |
| Complete tidak muncul | Menu SCM | Normal — Finance yang Complete |

---

## 7. FAQ

**Q: Apakah gudang bisa approve sendiri?**  
A: Tidak. Approve/Complete hanya di menu **Accounting → Sales Return**.

**Q: Satu SR bisa beberapa order?**  
A: Saat ini **scan per order**. Bulk multi-order belum aktif.

**Q: Satu SKU saya isi 0 semua, kenapa tetap tersimpan?**  
A: Normal. Misalnya order dua SKU: SKU A Restock 2, SKU B Restock 0, Broken 0, Lost 0. Keduanya tersimpan. Syarat minimal satu qty dicek saat Finance menyelesaikan **seluruh dokumen**, bukan tiap baris. Kalau semua baris 0, simpan tetap berhasil dan Finance tidak bisa Complete.

**Q: Barang rusak/hilang kemana stoknya?**  
A: Saat Finance approve: rusak → transfer ke scrap WH; hilang → stock deduction + jurnal expense.

**Q: Apa beda Billed vs Unbilled?**
A: **Billed** = barang retur **sudah punya Sales Invoice (SI)** → generate Credit Note (sama pola Purchase Return → Debit Note). **Unbilled** = **belum punya SI** → tanpa Credit Note; jurnal hanya mengembalikan persediaan dan HPP (tidak ada jurnal penjualan atau piutang karena belum ada invoice). Bukan dari status bayar AR.

**Q: Sync platform untuk apa?**  
A: Update status retur dari marketplace (refund/cancelled) ke datalist pill.

**Q: Kenapa file With Details masih satu baris padahal ada dua SKU?**  
A: Seharusnya tidak. With Details memecah satu baris per SKU. Contoh dua SKU di atas harus menjadi dua baris, dengan data dokumen diulang.

**Q: Saya sembunyikan kolom, kenapa masih ada di Excel?**  
A: Export belum mengikuti Show/Hide Column. Kolom yang disembunyikan masih ikut. Perbaikan sudah terdaftar.

**Q: Kenapa harga di Excel gudang nol?**  
A: Di menu gudang, harga dan HPP memang tertulis 0. Lihat angkanya di menu Finance Sales Return.

---

## Related Documents

| Doc | Path |
|-----|------|
| Feature Map | [feature-map.md](./feature-map.md) |
| User Guide | [user-guide.md](./user-guide.md) |
| Requirement (full) | [requirement.md](./requirement.md) |
| Finance menu | [../accounting-sales-return/knowledge-base.md](../accounting-sales-return/knowledge-base.md) |
| Failed Ship | [../supplychain-failed-ship/knowledge-base.md](../supplychain-failed-ship/knowledge-base.md) |
