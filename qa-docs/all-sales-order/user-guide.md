---
doc_type: user-guide
menu: all-sales-order
menu_name: "All Sales Order"
version: 1.5
last_updated: 2026-09-04
source_docs: [requirement.md, knowledge-base.md, technical.md]
source_version: 1.9
owner: QA - Yemima
status: review
---

# All Sales Order — Panduan Pengguna

**Siapa yang baca:** ops, busdev, finance ops, support  
**Menu:** Business Development → **All Sales Order**  
**Untuk apa:** Melihat **semua** pesanan (internal + marketplace) dalam satu layar

Detail import internal & Fulfillment Mode → [Dev - Sales Order](../sales-order-general/user-guide.md) · [Store](../omni-store-binding/user-guide.md).

---

## 1. Apa Itu & Kenapa Penting

All Sales Order menampilkan pesanan **general** dan **platform** bersama-sama untuk monitoring, Failed Process, Recheck, export, dan import internal (**Import Processed** / **Import Non-Processed**).

**(TO-BE)** Edit detail order **platform** (Draft/Open) dari ASO — tambah/ganti SKU, harga, disc, VAT — sama seperti Dev - Sales Platform. Setelah Approved, terkunci.

ASO tidak membuat aturan status baru — tiap baris mengikuti tipe SO-nya.

---

## 2. Overview Flow & Proses Bisnis

```mermaid
flowchart LR
    SP[Dev Sales Platform] --> ASO[All Sales Order]
    SOG[Dev Sales Order] --> ASO
    ASO --> MON[Monitor / Recheck / Import]
```

**Versi teks:**

1. Order masuk dari Dev - Sales Order atau Dev - Sales Platform.  
2. Keduanya tampil di All Sales Order.  
3. Ops memantau, Recheck, atau import internal dengan dua tombol yang sama seperti Dev - Sales Order.  
4. Proses gudang / tagihan tetap di menu hilir (kecuali jalur Non-Processed yang auto dari import).

🎬 [Interactive demo akan ditambahkan di sini]

### Siklus status

Mengikuti sumber: Draft → Open → Approved / Rejected / Void. ASO tidak menambah status.

---

## 3. Sebelum Mulai (Flow Sebelum)

- [ ] Hak akses All Sales Order.  
- [ ] Import: atur **Fulfillment Mode** store (**Processed** / **Non Processed**).  
- [ ] Create manual: customer, store Others, produk siap.

🎬 [Interactive demo akan ditambahkan di sini]

---

## 4. Setelah Selesai (Flow Sesudah)

- Approved terkunci sesuai tipe.  
- Recheck sukses → error flag diperbarui.  
- Import Non-Processed sukses → outbound + tagihan otomatis (lihat panduan Dev - Sales Order).

🎬 [Interactive demo akan ditambahkan di sini]

---

## 5. Yang Perlu Diperhatikan

- Create dari ASO = alur Sales Order General.  
- **Import Processed** vs **Import Non-Processed** harus cocok dengan Fulfillment Mode store.  
- Recheck hanya di All Sales Order, bukan list Dev - Sales Platform.  
- Template Excel import **tidak berubah**.  
- Di detail, tombol **Extract** pada SKU **bundle** hanya berhasil jika **Price** baris bundle **lebih dari 0**. Kalau masih 0 (sering di order booking), Extract ditolak sampai harga terisi.
- **(TO-BE)** Order ID Shopee yang menunggu match ke booking → cek **Log Data → Pending Orders**. Booking tanpa Order ID → pill **Unmatched Bookings**.

---

## 6. Langkah-Langkah (Step by Step)

### A. Monitoring

1. Buka All Sales Order → filter / pill Failed Process bila perlu.  
2. Buka detail sesuai tipe baris.

### A2. Log Data — Pending Orders (TO-BE)

1. Dari datalist, buka **Log Data**.  
2. Tab **Pending Orders** — lihat Order ID yang di-hold menunggu Shopee MATCHED ke booking.  
3. Pill **Unmatched Bookings** — list booking yang sudah masuk tapi Platform Order ID masih kosong.  
4. Setelah MATCHED, Order ID hilang dari Pending Orders (nempel ke baris booking).

### B. Import internal

1. Pastikan Fulfillment Mode store.  
2. Pilih **Import Processed** atau **Import Non-Processed**.  
3. Upload template yang sama → pantau history/progress/log.

### C. Create

1. **Create** → lengkapi seperti Dev - Sales Order → Open → Approve.

### D. Recheck

1. Jalankan **Recheck Failed Process** → cek ulang icon/error.

🎬 [Interactive demo akan ditambahkan di sini]

---

## 7. Tips & Hal yang Sering Bikin Bingung

- ASO = jendela; aturan bisnis di menu sumber + Store.  
- Tombol import di ASO **identik** dengan Dev - Sales Order.  
- Platform Order ID di baris general ≠ nomor order marketplace.  
- Error Flag **Below Benchmark COGS** (harga sebelum pajak di bawah HPP acuan) berlaku di ASO sama seperti di Sales Platform / Dev Sales Order — filter lewat label Error Flag; auto-approve bisa ditahan, approve manual tetap boleh.

---

## 8. Referensi

| Untuk | Dokumen |
|-------|---------|
| Aturan QA ASO | [requirement.md](./requirement.md) |
| Troubleshooting | [knowledge-base.md](./knowledge-base.md) |
| Teknis | [technical.md](./technical.md) |
| Dev - Sales Order | [../sales-order-general/user-guide.md](../sales-order-general/user-guide.md) |
| Store | [../omni-store-binding/user-guide.md](../omni-store-binding/user-guide.md) |
