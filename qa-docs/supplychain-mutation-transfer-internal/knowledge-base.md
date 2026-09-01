---
doc_type: knowledge-base
menu: supplychain-mutation-transfer-internal
menu_name: "Transfer Internal"
version: 2.0
last_updated: 2026-09-01
owner: QA - Yemima
status: review
audience: operator
---

# Transfer Internal — Knowledge Base

## 1. Apa itu Transfer Internal?

Memindahkan barang antar **rak/lokasi dalam gedung yang sama** (contoh: SKUPENSIL dari RAK001 Lantai 1 ke RACK005 Lantai 2). Kode dokumen **`TFI-*`**.

| Item | Nilai |
|------|-------|
| Menu | Supply Chain → Transfer Internal |
| Route legacy | `/supplychain/mutation-transfer-internal` |
| Route BETA Colli | `/supplychain/new-mutation-transfer-internal` |
| API | `mutation-transfer` · type `tf internal` |

Selain input manual, banyak TFI **otomatis** dari order/assembly — lihat kolom **Trx. Ref**; aktifkan **Show Virtual WH** di datalist untuk melihatnya.

## 2. Glosarium

| Istilah | Arti |
|---------|------|
| Fulfill-after-FIFO | Sistem coba ambil cukup dari **satu batch/rak** dulu; kalau tidak cukup, ambil dari beberapa batch terlama |
| Stock ID | Satu batch stok (SKU sama bisa punya banyak stock ID) |
| Group View / Detail View | Ringkas per SKU vs per batch stok |
| Reserved | Qty sudah “dipegang” TF draft/open — availability berkurang |
| Colli (COL) | Wadah multi-SKU di **satu lokasi** — fitur **Colli v2** hanya di route BETA |
| Show Virtual WH | Tampilkan TF otomatis dari proses order |

## 3. Yang Bisa / Tidak Bisa

### Bisa
- Buat/edit/hapus TFI (Draft/Open/Rejected) selama belum Approved
- Tambah detail lewat **Select Product**, **Import**, atau **Available Product**
- Bulk Delete & Approve dari datalist
- Export with/without detail; Show Deleted; Show Virtual WH
- **BETA:** assign **New Colli** / **Existing Colli** via toolbar bulk

### Tidak Bisa
- Edit setelah Approved
- Tanggal transaksi di masa depan
- Approve tanpa detail atau saat import masih jalan
- **Available Product:** qty melebihi availability **stock ID** yang dipilih (pakai Select Product untuk multi batch)
- **Relocate whole colli** jika masih ada qty **reserved** di transaksi lain untuk colli yang sama
- Void — status TF Internal manual tidak punya Void

## 4. Cara Pakai

### 4.1 TFI biasa (legacy)

1. **Create** → isi Origin (gedung), Location Destination default, tanggal.
2. Tambah SKU: **Select Product** (qty default 1) atau **Import** atau **Available Product**.
3. Per baris, sesuaikan **Location Destination** jika perlu.
4. **Approve** → stok pindah; reserved hilang.

### 4.2 Colli v2 (BETA)

1. Buka route **new-mutation-transfer-internal**.
2. Tambah baris seperti biasa.
3. Centang baris → toolbar **New Colli** (pilih Colli Type) atau **Existing Colli**.
4. **Ganti lokasi tujuan** → Colli Destination **kosong lagi** — assign ulang (kecuali lokasi masih sama dengan colli).
5. **Pindah seluruh colli:** Available Product → pilih semua SKU dalam colli → bulk **Use** → set colli tujuan (code sama, lokasi baru).

### Contoh alokasi FIFO (Select Product / Import)

Stok SKUPENSIL: 1 Jan rack A 50, 2 Jan B 100, 3 Jan C 150, 4 Jan D 200.

| Pindah | Dari rack |
|--------|-----------|
| 50 | A saja |
| 75 | B saja |
| 250 | A + B + C (gabungan batch) |

## 5. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Qty Available Product ditolak | Melebihi stock ID terpilih | Kurangi qty atau pakai Select Product |
| Insufficient product stock | Stok tidak cukup di origin | Cek Stock Monitoring |
| Colli hilang setelah ganti lokasi | Aturan: colli dest reset | Assign colli lagi |
| Approve colli gagal | Reserved di TF lain untuk colli sama | Selesaikan TF lain atau pakai colli baru |
| Import baris colli gagal | Code colli ada di lokasi lain | Perbaiki baris; baris lain tetap bisa sukses |
| TF order tidak kelihatan | Filter default | Aktifkan **Show Virtual WH** |

## 6. FAQ

**Q: Legacy vs BETA?**  
A: End-user pakai **legacy**; Colli v2 hanya di **BETA** sampai cutover.

**Q: Wajib pakai colli?**  
A: Tidak — kosong = barang loose.

**Q: Beda dengan Manual Picking List?**  
A: PL prefix `PL-*`, auto approve saat Complete Picking — bukan TFI manual. Lihat [requirement § Relasi MPL](./requirement.md).

**Q: Kapan colli muncul di menu Multisku Colli?**  
A: Setelah transaksi (inbound atau TF) yang membuat colli di-**Approve**.
