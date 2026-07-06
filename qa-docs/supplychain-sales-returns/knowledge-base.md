---
doc_type: knowledge-base
menu: supplychain-sales-returns
menu_name: "Sales Return"
version: 2.0
last_updated: 2026-07-05
owner: QA - Yemima
status: review
audience: operator
sections:
  core: [what-is, vs-failed-ship, workflow, ui-buttons, qty-rules, troubleshooting, faq]
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

Qty auto-save setelah edit (~1 detik).

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
| **Export** | Download Excel (with/without details) |
| **Continue** | Lanjut proses SR yang sudah ter-create |
| **Delete** | Hapus SR open (belum approved) |
| **Show** | Lihat SR yang sudah approved (read-only) |

---

## 5. Aturan qty

```
Total SR Qty = Restock + Broken + Lost
Total SR Qty ≤ (Qty outbound - retur sebelumnya)
```

Minimal **satu** dari Restock/Broken/Lost harus > 0 sebelum Finance bisa approve.

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

**Q: Barang rusak/hilang kemana stoknya?**  
A: Saat Finance approve: rusak → transfer ke scrap WH; hilang → stock deduction + jurnal expense.

**Q: Apa beda Billed vs Unbilled?**  
A: **Billed** = invoice sudah ada pembayaran → generate Credit Note. **Unbilled** = jurnal sales/AR adjustment.

**Q: Sync platform untuk apa?**  
A: Update status retur dari marketplace (refund/cancelled) ke datalist pill.

---

## Related Documents

| Doc | Path |
|-----|------|
| Requirement (full) | [requirement.md](./requirement.md) |
| Finance menu | [../accounting-sales-return/knowledge-base.md](../accounting-sales-return/knowledge-base.md) |
| Failed Ship | [../supplychain-failed-ship/knowledge-base.md](../supplychain-failed-ship/knowledge-base.md) |
