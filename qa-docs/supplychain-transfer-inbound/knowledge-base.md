---
doc_type: knowledge-base
menu: supplychain-transfer-inbound
menu_name: "Transfer Inbound"
version: 2.0
last_updated: 2026-09-01
owner: QA - Yemima
status: review
audience: operator
---

# Transfer Inbound — Knowledge Base

## 1. Apa itu Transfer Inbound?

Menu **penerimaan** untuk Transfer External yang sudah di-approve pengirim. Kamu mengisi Qty Received / Lost / Broken lalu **Approve** (approval ke-2). Setelah itu Delivery Status jadi **Delivered**.

| Item | Nilai |
|------|-------|
| Menu | Supply Chain → Transfer Inbound |
| Route | `/supplychain/transfer-inbound` |
| Pasangan | [Transfer External](../supplychain-mutation-transfer-external/knowledge-base.md) |

**Tidak ada Create** di sini — dokumen dibuat di Transfer External.

## 2. Glosarium

| Istilah | Arti |
|---------|------|
| Qty Transfered | Jumlah yang dikirim pengirim (tidak diubah penerima) |
| Qty Received | Jumlah yang diterima baik |
| Lost Items | Hilang di jalan → jadi Stock Deduction **Open** (masih perlu approve) |
| Broken Items | Rusak → pindah ke gudang scrap (**Open**, perlu approve TF scrap) |
| Delivered | Penerimaan selesai |
| In Transit | Menunggu penerimaan di menu ini |

## 3. Yang Bisa / Tidak Bisa

### Bisa
- Lihat dokumen TF Ext dengan Delivery **In Transit** atau **Delivered**
- Edit Qty Received / Lost / Broken selama masih In Transit
- Approve ke-2 (satu dokumen atau bulk jika eligible)
- Export with/without details

### Tidak Bisa
- Create dokumen baru
- Tambah SKU baru / Import / Select Product
- Void atau reject penerimaan — koreksi angka **sebelum** Approve ke-2
- Edit qty setelah Delivered
- Hapus dokumen yang sudah Approved di pengirim

## 4. Cara Pakai

1. Buka **Transfer Inbound** — cari nomor TF yang In Transit.
2. Buka edit. Qty Received default = semua yang dikirim; Lost/Broken default 0/kosong.
3. Sesuaikan angka: **Received + Lost + Broken harus sama** dengan Qty Transfered.
4. **Approve**.

### Contoh penerimaan

TF Ext kirim SKUPENSIL 1.000:

| Received | Lost | Broken | Hasil |
|----------|------|--------|-------|
| 1.000 | 0 | 0 | Semua masuk destination; Delivered |
| 900 | 100 | 0 | 900 di tujuan; Deduction Open 100 (ref kode TF utama) |
| 850 | 50 | 100 | 850 di tujuan; Deduction 50 Open; TF scrap 100 Open |
| 1.001 | — | — | Ditolak — received tidak boleh lebih dari transferred |

Lost/Broken **0 atau kosong sah** jika received = transferred (meski UI ada tanda required).

## 5. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Dokumen tidak muncul | Belum approve ke-1 / masih Draft | Selesaikan di Transfer External dulu |
| Broken ditolak | Scrap WH destination belum di-set | Warehouse Setting struktur **tujuan** |
| Deduction tidak ketemu | Cari salah kode | Cari **kode TF Ext utama**, bukan kode TF hidden |
| Incoming masih ada setelah approve | Job belum selesai | Refresh; cek Delivery Status Delivered |
| Pesan jumlah beda saat set vs approve | Dua endpoint validasi | Samakan Received+Lost+Broken = Transfered, approve lagi |

## 6. FAQ

**Q: Boleh approve tanpa ubah qty?**  
A: Ya — default received = transferred, lost/broken 0.

**Q: Lost sudah ada deduction, kenapa stok belum potong final?**  
A: Deduction masih Open — approve manual di Adjustment Deduction.

**Q: Broken ke gudang mana?**  
A: Gudang scrap di Warehouse Setting untuk **destination** (bukan origin pengirim).

**Q: Bisa reject penerimaan?**  
A: Tidak. Koreksi angka sebelum Approve.
