---
doc_type: user-guide
menu: omni-stock-shortage-monitoring
menu_name: "Stock Shortage Monitoring"
version: 1.0
last_updated: 2026-10-30
source_docs: [requirement.md, knowledge-base.md, technical.md]
source_version: "1.0"
owner: QA - Yemima
status: review
---

# Stock Shortage Monitoring — Panduan Pengguna

**Menu:** Omni Channel → Report Omni → Stock Shortage Monitoring  
**Route:** `/omni/stock-shortage-monitoring`

---

## 1. Apa itu

Laporan untuk melihat **SKU mana yang stoknya kurang** untuk order yang masih menunggu di Unassign Wave. Membantu purchasing / ops menentukan apa yang harus di-restock.

---

## 2. Cara baca layar

1. Pilih **toko** (lebih baik satu toko dulu) dan **rentang tanggal order**.
2. Lihat kartu ringkasan: berapa SKU kurang, total qty kurang, order tertua.
3. Tabel per SKU: Total Qty Order, Avail, Qty Kurang, Coverage.
4. Nyalakan **Show only SKU with shortage** untuk fokus yang perlu restock.
5. Klik angka **Order Count** → daftar order yang menunggu.
6. Klik **Inbound Count** → inbound yang masih menyisakan stok.
7. Export jika perlu analisis di Excel.

---

## 3. Tip penting

- **Bundle** tampil sebagai komponen (bukan nama bundle). Qty = qty bundle × isi paket.
- Kalau pilih banyak toko dengan gudang beda, angka Avail digabung — muncul peringatan di atas tabel.
- Data bisa **telat sampai ±5 menit** setelah order baru masuk.
- Bandingkan Avail dengan **Real Time Stock → By SKU** di gudang Process toko yang sama.

---

## 4. Apa yang tidak masuk laporan

Order yang sudah dikirim ke wave, sudah Skip Processing, sudah picking/shipped, atau void **tidak** dihitung di sini.

---

Referensi: [knowledge-base.md](./knowledge-base.md) · [Unassign Wave](../omni-unassign-wave/user-guide.md)
