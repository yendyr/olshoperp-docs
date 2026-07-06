---
doc_type: knowledge-base
menu: accounting-supplier-invoice
menu_name: "Purchase Invoice"
version: 2.0
last_updated: 2026-07-05
owner: QA - Yemima
status: review
---

# Purchase Invoice — Knowledge Base (Operator)

**Audience:** Finance, AP clerk, Operations support  
**Route:** `/accounting/supplier-invoice`

---

## 1. Apa itu Purchase Invoice?

Purchase Invoice (PI) adalah dokumen **pengakuan hutang** ke supplier setelah barang sudah **diterima (Purchase Inbound approved)**. PI:

- Menagihkan barang yang sudah masuk gudang
- **Mencatat PPN Masukan** (VAT) — tidak lagi di saat inbound
- Memindahkan saldo dari **Unbilled Goods** ke **Account Payable**
- Menjadi dasar **Account Payment** (pelunasan)

**Kode transaksi:** `PI-XXXXX`

---

## 2. Kapan membuat PI?

| ✅ Buat PI jika | ❌ Jangan buat PI jika |
|----------------|------------------------|
| Inbound sudah **Approved** | Inbound masih draft/open |
| Supplier & mata uang sama dengan PO/inbound | Mata uang PO berbeda dengan PI |
| Tanggal PI **setelah** tanggal inbound | Inbound belum ada |
| COA Unbilled Goods, Tax, AP sudah di-setup | Product COA belum lengkap |

---

## 3. Alur kerja standar

```
1. Buka Accounting → Purchase Invoice → Create
2. Isi Supplier, Tanggal, Mata Uang, Kurs (Due Date opsional)
3. Pilih status Open (bukan Draft) sebelum approve
4. Klik "Inbound Transaction" → pilih barang outstanding
   - Bulk Use (checkbox) ATAU Single Use (modal qty)
5. (Opsional) Tambah Additional Cost / Discount dari PO
6. Cek Total panel — Net Purchase Invoice
7. Save All → Approve
8. Lanjut Account Payment untuk bayar supplier
```

---

## 4. Panel Inbound Transaction

Tombol **Inbound Transaction** (icon box) membuka panel outstanding.

| Fitur | Cara pakai |
|-------|------------|
| **Bulk Use** | Centang beberapa baris → Bulk Use |
| **Single Use** | Klik baris → modal → isi Invoice Qty → Save |
| **Group** | Pilih seluruh inbound sekaligus (group view) |

**Max Invoice Qty** = qty inbound − yang sudah disiapkan/diproses invoice − retur.

Pesan error umum:
- *"Invoice Qty must not exceed Inbound Qty..."* — kurangi qty
- *"already included in this purchase invoice"* — baris sudah ada di PI ini
- *"different currency"* — PO beda mata uang

---

## 5. Additional Cost & Discount

**Dynamic allocation (Okt 2025):** Biaya/diskon PO tidak harus ditagih sekaligus.

| Skenario | Contoh |
|----------|--------|
| Barang saja | PI 1: tagih qty barang; cost ditunda |
| Barang + cost | PI 1: barang + freight |
| Cost saja | PI 2: freight saja (barang sudah PI 1) |

**Cara tambah:**
1. Tab **Additional Cost** / **Additional Discount**
2. Pilih dari dropdown PO (outstanding costs) ATAU entry manual
3. Cost otomatis muncul saat line pertama ditambah (dari PO)

---

## 6. Tombol & status

| Tombol | Kapan muncul | Fungsi |
|--------|--------------|--------|
| **Save & Next** | Halaman create | Simpan header |
| **Save All** | Edit, belum approved | Simpan perubahan |
| **Approve** | Status Open + ada detail | Posting jurnal + AP |
| **Void** | Sudah approved | Batalkan (⚠️ lihat §9) |
| **Print** | Edit | ⚠️ Saat ini **tidak berfungsi** dengan benar |
| **Draft / Open** | Side panel | Harus **Open** sebelum approve |

**Status:**
- **Draft** — masih edit, belum siap approve
- **Open** — siap approve
- **Approved** — jurnal sudah jalan; tidak bisa edit
- **Rejected** — ditolak approver; tampil sebagai draft di UI

---

## 7. Panel Total (kanan bawah)

| Baris | Arti |
|-------|------|
| Total Products | Σ harga baris (DPP) |
| Disc Products | Total diskon baris |
| Total VAT | Total PPN baris |
| Additional Cost / Disc | Biaya & diskon header |
| **Net Purchase Invoice** | Total yang jadi hutang (termasuk PPN) |

Mata uang asing: angka konversi ke mata uang primary company ditampilkan di bawah.

---

## 8. Hubungan dengan Purchase Inbound

| Inbound | PI |
|---------|-----|
| Barang masuk gudang | Tagihan resmi ke supplier |
| Jurnal: Dr Inventory Cr **Unbilled Goods** (DPP saja) | Jurnal: Dr **Unbilled Goods** + **PPN** Cr **AP** |
| Tidak ada PPN di inbound | PPN di PI |

**Qty tracking:** Setiap baris inbound punya batas berapa qty yang masih bisa di-invoice. Setelah PI approve, qty inbound ter-mark **processed to invoice**.

Detail teknis: [requirement §10](./requirement.md#10-relasi-purchase-inbound-detail)

---

## 9. Hubungan dengan Account Payment

Setelah PI **Approved**, muncul di **Account Payment → Outstanding Invoice**.

| Langkah | Efek |
|---------|------|
| Buat payment, alokasi ke PI | `prepared_to_payment` naik |
| Approve payment | `processed_to_payment` naik; hutang berkurang |
| Bayar penuh | Outstanding PI = 0 |

**Penting:** Jangan void PI yang sudah ada payment — sistem **belum** memblokir void otomatis (GAP-PI-04). Batalkan/reject payment dulu secara manual jika perlu koreksi.

Detail: [Account Payment KB](../accounting-supplier-payment/knowledge-base.md)

---

## 10. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Supplier tidak muncul | Tidak ada inbound approved | Approve inbound dulu |
| Outstanding kosong | Currency/date mismatch | Samakan currency; PI date > inbound date |
| Approve gagal — COA | Unbilled Goods / Tax / AP kosong | Setup Product COA Group |
| Approve gagal — fiscal | Periode tutup | Ubah tanggal atau buka periode |
| Total negatif | Discount > subtotal | Kurangi discount/cost |
| Print salah/kosong | Bug template | Export Excel sementara (GAP-PI-01) |
| Void tidak kembalikan qty | Bug void | Hubungi dev; jangan void sembarangan (GAP-PI-02) |
| PI auto-terbuat saat buka create | Auto-submit create | Hapus draft atau lanjut edit (GAP-PI-08) |

---

## 11. FAQ

**Q: Apakah harga bisa diubah di PI?**  
A: Tidak. Harga & PPN mengikuti PO.

**Q: Bisa partial invoice per inbound?**  
A: Ya — isi Invoice Qty < Max Qty.

**Q: PPN kapan dijurnal?**  
A: Saat **Approve PI**, bukan saat inbound.

**Q: Satu PI bisa beberapa inbound?**  
A: Ya — bulk use dari beberapa GRN.

**Q: Due date otomatis dari TOP supplier?**  
A: Belum — isi manual (GAP-PI-06).

---

## Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Technical | [technical.md](./technical.md) |
| Purchase Inbound | [../supplychain-new-purchase-inbound/knowledge-base.md](../supplychain-new-purchase-inbound/knowledge-base.md) |
| Account Payment | [../accounting-supplier-payment/knowledge-base.md](../accounting-supplier-payment/knowledge-base.md) |
