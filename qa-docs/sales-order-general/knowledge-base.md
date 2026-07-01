---
doc_type: knowledge-base
menu: sales-order-general
menu_name: "Sales Order General (Internal)"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: review
audience: operator
sections:
  core: [what-is, lifecycle, import, faq]
---

# Sales Order General — Knowledge Base

## 1. Apa itu Sales Order General?

Sales Order **General** adalah pesanan penjualan **internal** (bukan dari marketplace). Dibuat lewat input manual, import Excel, atau POS.

**Menu:** Dev - Sales Order (`/businessdevelopment/sales-order-general`)

## 2. Kapan dipakai?

| Kebutuhan | Cara |
|-----------|------|
| Penjualan B2B/offline | Buat manual → isi customer & produk |
| Banyak order dari Excel | Import 2 sheet (header+detail + biaya/diskon) |
| Kasir toko | POS (otomatis jadi SO general) |

## 3. Siklus status

```
Draft/Open → Approve → Wave → Picking → Delivery → Outbound → Invoice
```

- **Approve** memicu proses gudang (wave assignment)
- **Invoice** terbentuk saat outbound approve atau settlement

## 4. Import Excel (ringkas)

### Template

Download dari tombol Export/Template di datalist — file 2 sheet:

1. **Sheet 1** — header + detail produk (satu baris = satu SKU per order)
2. **Sheet 2** — other cost & discount (by Platform Order ID)

### Aturan penting

| Rule | Nilai |
|------|-------|
| Max SKU per order | **100 baris** |
| Format file | `.xlsx` / `.xls` |
| Status SO hasil import | **Open** (siap approve) |
| Grouping 1 order | Customer + Store + Tanggal + Platform Order ID + Shipper + Tracking |

### Jika import gagal

1. Buka **Import History** di datalist
2. Klik sesi import → lihat **Import Log** (nomor baris + pesan error)
3. Perbaiki file Excel → upload ulang

> **Catatan:** Import file besar (>~2.000 baris) saat ini bisa stuck — improvement sedang direncanakan (lihat technical.md §5).

## 5. FAQ

**Q: Beda dengan Sales Order Platform?**  
A: SO Platform dari sync marketplace (Shopee/TikTok). SO General dibuat manual/import internal.

**Q: Bisa approve langsung setelah import?**  
A: Ya, SO import status Open — bisa langsung approve jika data lengkap.

**Q: Kapan Customer Invoice terbentuk?**  
A: Saat outbound approve, settlement upload, atau manual di menu Sales Invoice — bukan otomatis saat approve SO.

**Q: Platform Order ID wajib?**  
A: Tidak wajib untuk semua skenario, tapi dipakai untuk grouping import & referensi eksternal.
