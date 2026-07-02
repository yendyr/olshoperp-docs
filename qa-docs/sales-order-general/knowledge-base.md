---
doc_type: knowledge-base
menu: sales-order-general
menu_name: "Sales Order General (Internal)"
version: 1.1
last_updated: 2026-07-02
owner: QA - Yemima
status: review
audience: operator
sections:
  core: [what-is, lifecycle, import, failed-process, faq]
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

## 5. Failed Process (icon error di datalist)

Kolom **Failed Process** muncul saat pill merah **Failed Process** diklik di:

- **Dev - Sales Platform** (`/omni/sales-order`)
- **All Sales Order** (`/businessdevelopment/all-sales-order`)

### Icon yang umum muncul

| Icon | Arti | Tindakan operator |
|------|------|-------------------|
| 🔗 merah (link-slash) | Produk platform belum di-bind ke System Product | Bind di Platform Product |
| 🔀 orange (share-nodes) | COA produk belum lengkap | Set COA di System Product |
| 📦 merah (boxes-stacked) | Stok tidak cukup di gudang proses | Cek ATS / inbound / tunggu stok |
| 🏭 biru (`#2F6495`, warehouse) | Store belum punya Warehouse Process | Set di Omni Settings / Warehouse Binding |

**AS-IS:** Hover icon hanya menampilkan pesan error — **belum** ada timestamp "Last checked".

**TO-BE (planned):** Tombol **Re-check Failed Process** di All Sales Order + tooltip Last checked. Detail: [requirement.md §9](./requirement.md#9-improvement-to-be--re-check-failed-process--log).

### Cara flag hilang (AS-IS)

| Kondisi | Cara hilang |
|---------|-------------|
| Unbinded Product | Bind produk platform |
| Unavailable Stock | Stok tersedia + screening harian 04:00 WIB, atau Refresh Stock di **Unassign Wave** |
| COA not set | Lengkapi COA produk |
| No Warehouse Process | Konfigurasi warehouse process store |

> **Bukan Failed Ship:** Menu Failed Ship (SCM) untuk order COD gagal kirim pasca-shipped — berbeda dari Failed Process di datalist SO.

## 6. FAQ

**Q: Beda dengan Sales Order Platform?**  
A: SO Platform dari sync marketplace (Shopee/TikTok). SO General dibuat manual/import internal.

**Q: Bisa approve langsung setelah import?**  
A: Ya, SO import status Open — bisa langsung approve jika data lengkap.

**Q: Kapan Customer Invoice terbentuk?**  
A: Saat outbound approve, settlement upload, atau manual di menu Sales Invoice — bukan otomatis saat approve SO.

**Q: Platform Order ID wajib?**  
A: Tidak wajib untuk semua skenario, tapi dipakai untuk grouping import & referensi eksternal.
