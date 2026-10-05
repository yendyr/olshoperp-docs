---
doc_type: user-guide
menu: supplychain-delivery-order
menu_name: "Delivery Order"
version: 1.0
last_updated: 2026-10-05
owner: QA - Yemima
status: review
audience: end-user
---

# Delivery Order — User Guide

**Alamat:** `/supplychain/delivery-order`

---

## 1. Buat Delivery Order

1. Isi tanggal, customer/store, **shipper** (harus sudah terikat gudang 3PL).  
2. Simpan header.  
3. **Available to Delivery Order** → pilih **by order** (cara yang dipakai sehari-hari).  
4. Order yang muncul adalah yang sudah **Collecting** setelah packing selesai.

---

## 2. Apa yang terjadi saat memasukkan order

- Collecting (`SL-…`) yang masih Open menjadi Approved.  
- Status pengiriman di order menjadi **Prepared**.  
- Barang **belum** pindah ke gudang kurir.

---

## 3. Approve

Klik approve DO → sistem memindahkan stok ke **gudang 3PL** shipper dan order menjadi **Shipped**.

Jika muncul pesan shipper tidak punya 3PL warehouse — perbaiki binding shipper dulu.

---

## 4. Tips

- Beberapa order boleh dalam satu DO asal **shipper sama**.  
- By Transfer Internal menampilkan kode **SL** (Collecting), Open maupun Approved.  
- Kalau kurir di platform berubah **setelah** order sudah masuk DO, jangan anggap gudang 3PL ikut pindah — kabari QA/dev.
