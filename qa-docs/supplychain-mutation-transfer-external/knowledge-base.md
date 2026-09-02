---
doc_type: knowledge-base
menu: supplychain-mutation-transfer-external
menu_name: "Transfer External"
version: 2.0
last_updated: 2026-09-01
owner: QA - Yemima
status: review
audience: operator
---

# Transfer External — Knowledge Base

## 1. Apa itu Transfer External?

Memindahkan stok **antar gedung / struktur warehouse berbeda** (contoh: GD Surabaya ke GD Sidoarjo). Butuh **dua kali approve**: pengirim di menu ini, penerima di **Transfer Inbound**. Kode transaksi diawali **TF**.

| Item | Nilai |
|------|-------|
| Menu | Supply Chain → Transfer External |
| Route produksi | `/supplychain/mutation-transfer-external` |
| Route BETA Colli | `/supplychain/new-mutation-transfer-external` — **experimental, bukan produksi** |
| Pasangan | [Transfer Inbound](../supplychain-transfer-inbound/knowledge-base.md) |

Setelah pengirim approve, barang masuk status **In Transit**. Stok di gudang tujuan baru bisa dipakai penuh setelah penerima approve di Transfer Inbound (**Delivered**).

## 2. Glosarium

| Istilah | Arti |
|---------|------|
| Single Rack FIFO | Ambil satu rak/batch lama yang qty-nya cukup |
| FIFO klasik | Ambil bertahap dari stok paling lama |
| Stock ID | Satu batch inbound; Available Products = pilih satu stock ID |
| In Transit | Barang sudah keluar origin, belum resmi di destination |
| Delivered | Penerima sudah approve ke-2 |
| Reserved | Stok dikunci di dokumen belum approve |
| Hidden TF | Dokumen sistem ke/dari In Transit; tidak muncul di daftar biasa |

## 3. Yang Bisa / Tidak Bisa

### Bisa
- Buat / edit / hapus dokumen Draft, Open, atau Rejected (belum approve)
- Tambah SKU lewat **Select Product**, **Import**, atau **Available Products**
- Bulk Delete & Approve dari datalist
- Export with / without details
- Setelah approve ke-1: lanjut proses di Transfer Inbound sampai Delivered

### Tidak Bisa
- Void setelah approve ke-1 — harus lanjut sampai Delivered
- Reject setelah approve ke-1 (hanya sebelum approve)
- Ubah origin atau tanggal transaksi setelah ada baris detail
- Colli di route produksi (hanya BETA experimental)
- Hapus dokumen yang sudah Approved
- Pakai **Show Virtual WH** di produksi — toggle tidak dipakai; dokumen In Transit memang disembunyikan

## 4. Cara Pakai

### 4.1 Buat Transfer External (produksi)

1. **Create** → isi **Origin** (level 20 ke atas / drop-off ke rack) dan **Location Destination** (level 20, tanpa sub-lokasi, beda struktur dari origin, **wajib** sudah punya gudang scrap di Warehouse Setting).
2. Isi tanggal (periode fiskal valid).
3. Tambah SKU: **Select Product** (qty default 1), **Import**, atau **Available Products**.
4. Simpan Open → **Approve** (approve ke-1).
5. Serahkan ke penerima: proses lanjut di **Transfer Inbound**.

**First time** (belum pernah ada TF Ext): origin & destination diisi manual. Berikutnya, autosave bisa mengisi dari transaksi terakhir.

### 4.2 Contoh alokasi FIFO (Select Product / Import)

Stok SKUPENSIL: 1 Jan rack A 50, 2 Jan B 100, 3 Jan C 150, 4 Jan D 200.

| Pindah | Dari rack |
|--------|-----------|
| 50 | A saja |
| 75 | B saja |
| 150 | C saja |
| 200 | D saja |
| 250 | A + B + C (FIFO klasik) |

**Available Products:** terikat **satu stock ID**. Contoh total SKU 80 = stock 10:00 (50) + 11:00 (30). Use stock 11:00 lalu edit qty 40 → ditolak; pakai Select Product / Import untuk gabung batch.

### 4.3 Contoh dokumen (user)

Kirim SKUPENSIL 1.000 dari `GD.SBY → Rack-001` ke `GD-SDA → Drop OFF`:

1. **TF001** (terlihat): origin SBY Rack-001 → Drop OFF SDA.
2. Setelah approve pengirim: stok origin masuk kolom **Transfer**; destination masih incoming.
3. Setelah approve penerima di Inbound: **Delivered**; availability di SDA = yang diterima.

## 5. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Destination tidak muncul / ditolak | Bukan leaf, sama struktur origin, atau scrap belum di-set | Cek Master Warehouse + Warehouse Setting scrap |
| Insufficient stock | Stok origin tidak cukup (FIFO skip WIP & Outrack) | Cek Stock Monitoring; pastikan stok bukan di WIP/Outrack saja |
| Qty Available Products ditolak | Melebihi availability **stock ID** terpilih | Kurangi qty atau pakai Select Product / Import |
| Approve stuck hourglass | Job approve masih jalan | Refresh; tunggu selesai |
| Import gagal | Template / isi baris salah | Template 4 kolom: Product ID \| System Product SKU \| Qty \| Unit |
| Tidak bisa hapus setelah approve | Tidak ada Void | Lanjut Transfer Inbound sampai Delivered |
| Stok SDA belum bisa dipakai | Masih In Transit | Tunggu approve di Transfer Inbound |

## 6. FAQ

**Q: Bedanya dengan Transfer Internal?**  
A: TF Ext = beda gedung, dua approve, ada In Transit & Delivery Status. TF Internal = satu struktur, satu approve.

**Q: Kenapa tidak bisa hapus setelah approve?**  
A: Tidak ada Void. Lanjut sampai Delivered di Transfer Inbound.

**Q: Show Virtual?**  
A: Tidak dipakai di produksi TF Ext. Dokumen In Transit disembunyikan otomatis.

**Q: Colli?**  
A: Belum untuk produksi. Route BETA Colli hanya experimental.
