# Supplementary Knowledge Base — OlshopERP

Folder ini menyimpan dokumentasi suplemen dan referensi sistem eksternal/legacy (khususnya UPFOS) yang mendukung pemahaman domain, integrasi, dan arsitektur OlshopERP, namun berada di luar `qa-docs/` sesuai aturan immutability dokumentasi QA.

---

## 📚 Modul Dokumentasi UPFOS Open API (Lengkap)

Seluruh 46 sub-dokumen dari buku dokumentasi resmi UPFOS API telah diekstraksi, diterjemahkan ke Bahasa Indonesia, dan dikelompokkan ke dalam modul-modul berikut:

| Modul | File Dokumentasi | Cakupan Endpoint / Fitur |
| :--- | :--- | :--- |
| **0. Master Index & Keamanan** | [upfos-api-jianjie.md](./upfos-api-jianjie.md)<br>[upfos/00-arsitektur-dan-keamanan.md](./upfos/00-arsitektur-dan-keamanan.md) | Gateway URLs, parameter publik, algoritma Double MD5 + Secret, source code Java/PHP, paginasi & rate limits. |
| **1. Katalog & Produk** | [upfos/01-item-produk-api.md](./upfos/01-item-produk-api.md) | `item.add` (SPU), `item.sku.add` (SKU), `item.getlist`, `item.combine.detail.get` (bundel), `barcode.add`, `barcode.getlist`. |
| **2. Pesanan & Logistik** | [upfos/02-order-transaksi-api.md](./upfos/02-order-transaksi-api.md) | `trade.add`, `trade.getlist`, `trade.getdetail`, `trade.update`, `delivery.logistics.detail.getlist`, `delivery.getlist`, `delivery.getdetail`, `delivery.getbatchunique`, `delivery.update`, handover `zqhk2a` & `lgg74t`. |
| **3. Retur & Purna Jual** | [upfos/03-after-sale-retur-api.md](./upfos/03-after-sale-retur-api.md) | `after.sale.add`, `after.sale.getdetail`, `after.sale.entry` (inbound retur), `after.sale.getlist`, `after.sale.getbatchunique`. |
| **4. Pengadaan / PO** | [upfos/04-purchasing-pengadaan-api.md](./upfos/04-purchasing-pengadaan-api.md) | `purchase.add`, `purchase.detail.add`, `purchase.approve`, `purchase.finish`, `purchase.getlist`. |
| **5. Pergudangan & Stok** | [upfos/05-inventory-gudang-stok-api.md](./upfos/05-inventory-gudang-stok-api.md) | Outbound (`outstorage.add`, `detail.add`, `approve`, `outstorage`, `getlist`, `getbatchunique`), Inbound (`instorage.add`, `detail.add`, `instorage`, `getlist`, `kffzr6yz03i2ktp8`, `getbatchunique`), Stok real-time (`stock.qty.getlist`). |
| **6. Webhook Notifikasi** | [upfos/06-webhook-notifikasi-api.md](./upfos/06-webhook-notifikasi-api.md) | Mekanisme push HTTP POST asinkron, retry policy, push event Sales Order (`uabgkv24s790eh97`) dan Surat Jalan (`hws10xf7h0c7rrdi`). |

---

## 📦 TikTok Shop Partner API (API Reference snapshot)

Dokumentasi resmi TikTok Shop Open API (Partner Center) — snapshot markdown seluruh tab **API Reference**.

| Item | Detail |
| :--- | :--- |
| **Folder** | [tiktok-shop/](./tiktok-shop/) |
| **Sumber** | [partner.tiktokshop.com/docv2](https://partner.tiktokshop.com/docv2/) |
| **Isi** | ~318 endpoint schema (setara *Download Markdown*) + ~26 overview/guide |
| **Indeks** | [tiktok-shop/README.md](./tiktok-shop/README.md) · [`_meta/api-index.json`](./tiktok-shop/_meta/api-index.json) |

Kategori utama: Authorization, Event, Seller, Products, Promotion, Orders, Fulfillment, FBT, Logistics, Return and refund, Finance, Analytics, Customer service/engagement, Affiliate (creator/partner/seller), Supply chain, Tools.

---

## 🛒 Shopee Open Platform API (v2 snapshot)

Dokumentasi resmi Shopee Open API v2 — snapshot markdown seluruh endpoint API Reference + Developer Guides.

| Item | Detail |
| :--- | :--- |
| **Folder** | [shopee-open/](./shopee-open/) |
| **Sumber** | [open.shopee.com/documents/v2](https://open.shopee.com/documents/v2/) |
| **Isi** | 455 endpoint schema + 64 developer guides |
| **Indeks** | [shopee-open/README.md](./shopee-open/README.md) · [`_meta/api-index.json`](./shopee-open/_meta/api-index.json) |

Modul utama: Product, Order, Logistics, Returns, Payment, GlobalProduct, Ads, AMS, Push, SBS/FBS, Livestream, dll.

---

## 🎯 Korelasi dengan OlshopERP

UPFOS adalah sistem ERP omnichannel pendahulu yang menjadi acuan arsitektur bisnis bagi OlshopERP. Referensi di atas berguna untuk:
1. **Validasi Guard Anti-Duplikasi (`GAP-BOOK-02`):** Pencegahan duplikasi pesanan Shopee jalur *advance package* tanpa `booking_sn`.
2. **State Transition Gudang:** Memverifikasi alur multi-stage (Draft $\rightarrow$ Input Detail $\rightarrow$ Approval $\rightarrow$ Eksekusi).
3. **Standar Keamanan Integrasi:** Penerapan toleransi waktu `timestamp` $\le 3$ menit dan `nonce` unik untuk mencegah *replay attack*.
