---
doc_type: knowledge-base
menu: order-processing-trace
menu_name: "Order Processing Trace"
version: 1.0
last_updated: 2026-09-02
owner: QA - Yemima
status: draft
audience: operator
---

# Order Processing Trace — Knowledge Base

## 1. Apa itu Order Processing Trace?

Laporan **read-only** untuk melihat **nomor transaksi proses** atas satu Sales Order — dari Skip Wave (jika ada), Picking, Checking, Packing, Delivery Order, Failed Ship, sampai Outbound — **tanpa** buka menu satu per satu.

**Path:** SupplyChain → Report **atau** OmniChannel → Report → **Order Processing Trace**  
**Routes:** `/supplychain/order-processing-trace` · `/omni/order-processing-trace` (halaman sama)

POV grid: **1 baris = 1 order** (general + platform).

---

## 2. Alur kerja standar

1. Buka menu dari sidebar SCM atau Omni.  
2. Grid default filter **Trx Date = bulan ini**.  
3. Cari order (Global Search / Advanced Filter).  
4. Baca kolom ref — klik hyperlink untuk buka dokumen sumber.  
5. Export **Without Detail** untuk ringkasan per order; **With Detail** untuk audit per SKU.

---

## 3. Kolom penting

| Kolom | Arti singkat |
|-------|----------------|
| Trx Code \| Trx Platform | Nomor internal + marketplace (`-` jika general) |
| Trx Date \| Platform Date | Tanggal internal vs tanggal platform (lihat tooltip) |
| Skip Wave Process No | Batch Skip Wave; `-` jika order reguler |
| Picking … Outbound | Ref + tanggal tiap tahap proses |
| `-` | Tahap belum ada / tidak relevan |

**Tooltip Trx Date (platform):** tanggal order **pertama masuk OlshopERP**, bukan tanggal marketplace (itu **Platform Date**).

---

## 4. Bisa / Tidak bisa

| Bisa | Tidak bisa |
|------|------------|
| Lihat general + platform sekali layar | Edit/approve transaksi dari report |
| Trace ref proses per order | Campur dengan Sales Order Report (revenue) |
| Export per order atau per SKU | Buat Failed Ship / Outbound kedua untuk SO yang sama (AS-IS) |
| Dual entry SCM & Omni | Dua dataset berbeda per modul |

---

## 5. Contoh kasus operator

### Case partial order (5 SKU)

- 2 SKU masuk **satu** Failed Ship; 3 SKU masuk **satu** Outbound.  
- Header: satu kode FS, satu kode OB — **bukan** koma.  
- Export With Detail: baris SKU FS terisi ref FS; baris SKU outbound terisi ref OB.

### Case partial qty satu SKU (qty 10)

- Sebagian qty → Failed Ship, sebagian → Outbound dalam doc masing-masing.  
- Export With Detail: **satu baris** SKU — kolom Failed Ship **dan** Outbound keduanya terisi.

---

## 6. Troubleshooting

| Gejala | Cek |
|--------|-----|
| Outbound `-` padahal sudah kirim | Partial — SKU lain sudah OB; pakai export With Detail |
| Failed Ship `-` | Order belum FS atau full outbound tanpa FS |
| Skip Wave `-` | Order lewat Unassign/Wave reguler |
| Platform Date `-` | Order **general** — normal |

---

## 7. FAQ

**Bedanya dengan All Sales Order?**  
All Sales Order untuk monitor + aksi (sync, recheck). Order Processing Trace khusus **lacak ref proses**.

**Kenapa 1 order cuma satu kode Failed Ship?**  
AS-IS sistem: **1 SO = 1 dokumen Failed Ship**. Partial = beberapa SKU dalam doc yang sama.

**Related:** [All Sales Order](../all-sales-order/) · [Failed Ship](../supplychain-failed-ship/) · [Outbound External](../supplychain-mutation-outbound/)
