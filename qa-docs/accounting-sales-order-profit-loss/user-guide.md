---
doc_type: user-guide
menu: accounting-sales-order-profit-loss
menu_name: "Sales Order Profit Loss"
version: 1.0
last_updated: 2026-11-05
owner: QA - Yemima
status: review
source_version: "requirement 1.0 / knowledge-base 1.0 / technical 1.0"
audience: publish
---

# Sales Order Profit Loss — User Guide

## Tujuan

Melihat laba/rugi penjualan berdasarkan **Sales Order** dalam periode tertentu, lengkap dengan ringkasan chart dan tabel.

**Buka menu:** Accounting → Report → **Sales Order Profit Loss**  
**URL:** `/accounting/sales-order-profit-loss`

---

## Langkah cepat

1. Pilih **periode tanggal**.
2. (Opsional) Filter **platform** dan/atau **store**.
3. Baca chart di atas (tren harian & proporsi per platform/store).
4. Scroll ke tabel:
   - **Daily Total P/L in Period** — total per hari
   - Tabel per store / platform — agregat
   - **Daily Total P/L in Period per Store** — **detail per nomor Sales Order**

---

## Membaca baris per Sales Order

Di tabel detail order Anda melihat:

- Nomor SO (**Trx. Code**), store, platform  
- Qty, COGS, Total SO, Total SI, Total P/L, % P/L  

**Segera hadir (ETM-17074):** kolom **Trx. Code Outbound** dan **Trx. Date Outbound** agar nomor & tanggal outbound terkait langsung terlihat di baris yang sama.

---

## Tips

- Belum ada outbound → COGS biasanya 0; kolom outbound (nanti) kosong.  
- Butuh pecah per produk/SKU → menu **Product Profit Loss**.  
- Butuh laporan akun (COA) → menu **Profit & Loss**.
