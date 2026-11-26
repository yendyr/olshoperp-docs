---
doc_type: gemini-generation-brief
target_menu: "Transfer External"
menu_slug: supplychain-mutation-transfer-external
paired_menu: "Transfer Inbound (supplychain-transfer-inbound) — approval ke-2"
source_of_truth: docs/qa-docs/supplychain-mutation-transfer-external/ (repo olshoperp — dibaca 2026-09-02)
purpose: >
  Brief lengkap untuk di-paste ke Gemini agar generate SATU dokumen
  konsolidasi "Transfer External" bergaya Pentaho — bukan wireframe, bukan kode.
  Pasangan penerimaan = menu Transfer Inbound (brief terpisah).
status: ready-to-send-to-gemini
source_doc_status: >
  KB review v2.0 · requirement review v2.0 · technical review v2.0 ·
  user-guide review v1.0 · feature-map review v1.0 · 6 Lingo cards ·
  dual approve + FIFO + import; Colli produksi out; Show Virtual TO-BE hide.
---

# BRIEF UNTUK GEMINI — Generate Dokumentasi "Transfer External"

> **Cara pakai:** copy/upload file ini ke Gemini. **PART 1** = instruksi.
> **PART 2** = SELURUH fakta sumber. Gemini wajib pakai Part 2 saja — dilarang mengarang.
> **Pasangan:** dokumen Help Center Transfer Inbound digenerate dari brief terpisah — di sini cukup rujuk singkat (approval ke-2), jangan duplikasi detail Received/Lost/Broken.

---

# PART 0 — Kenapa struktur ini seperti ini / beda dari menu lain

1. **Transaksi SCM dual-approve** — pengirim di Transfer External, penerima di **Transfer Inbound**. Setelah approve ke-1: **In Transit**; setelah ke-2: **Delivered**. Butuh `stateDiagram-v2` + flowchart rantai ke Inbound.
2. **Beda gedung / struktur warehouse** — bukan Transfer Internal (satu gedung, satu approve).
3. **Tidak ada Void** setelah approve ke-1 — harus lanjut sampai Delivered. Reject hanya sebelum approve pengirim.
4. **Tiga sumber insert** + **Single Rack FIFO → FIFO klasik** (Select Product / Import); Available Products = stock ID spesifik.
5. **Produksi tanpa Colli**; route BETA Colli experimental — jangan expected produksi.
6. **Show Virtual WH** — TO-BE hide di produksi; dokumen In Transit hidden otomatis.
7. **Side effect ke-2** (Lost → Deduction Open, Broken → scrap Open) terjadi di Inbound — sebut di relasi, detail di brief Inbound.

---

# PART 1 — Instruksi untuk Gemini

## 1.1 Peran

Kamu = technical writer bergaya pentaho.com: definisi → prosedur → tabel referensi; langkah bernomor; callout **Note / Tip / Warning**; tanpa marketing. **Sumber = PART 2 saja.**

## 1.2 Bahasa & tone

- Bahasa Indonesia + istilah EN (Transfer External, In Transit, Delivered, Approve, Select Product, Available Products, Import).
- Definisikan istilah sebelum dipakai.
- **NOL** path file / class / kolom DB / ID gap internal (GAP-TFEXT-xx, V-TFE-xx).
- Boleh sebut ID Lingo navigasi: SF-DET-01, SF-TFE-01..03, SF-VIEW-01, SF-IMP-01.

## 1.3 Struktur dokumen WAJIB (22 section)

1. Judul & Ringkasan Singkat (beda gedung; dual approve; prefix TF)
2. Istilah Kunci
3. Kapan & Kenapa Dipakai (+ beda Transfer Internal)
4. Prasyarat (origin, destination leaf + scrap, fiscal, privilege)
5. Posisi dalam Alur Bisnis (`flowchart LR` ke Inbound → Delivered)
6. Lokasi Menu — produksi vs BETA Colli + placeholder
7. Siklus Status (`stateDiagram-v2`) + Delivery Status — **tanpa Void**
8. Dual Approve & In Transit (dokumen utama vs dokumen hidden)
9. Langkah Penggunaan — buat & approve pengirim
10. Tiga Cara Tambah Barang (Select / Available / Import)
11. Single Rack FIFO lalu FIFO klasik (+ contoh)
12. Group View vs Detail View
13. Referensi Field header + detail
14. Export (with / without details)
15. Aturan Bisnis & Validasi (pesan UI penting, tanpa ID internal)
16. Colli BETA — experimental only
17. Show Virtual WH — TO-BE hide
18. Keterbatasan & Hal dalam Tinjauan
19. Hubungan Menu Lain (`flowchart TB`) — **wajib** Transfer Inbound
20. Troubleshooting
21. FAQ
22. Lihat Juga — **Transfer Inbound** (penerima)

## 1.4 Mermaid

- **Wajib:** §5 `flowchart LR`; §7 `stateDiagram-v2`; §19 `flowchart TB`.
- Label berkoma/spasi → kutip; tiap diagram + fallback teks numbered list.

## 1.5 Placeholder gambar (min 5)

1. Sidebar Supply Chain → Transfer External
2. Form Create (Origin + Location Destination)
3. Detail + Select Product / Available Products
4. Datalist Delivery Status In Transit
5. (Opsional) Warning: jangan pakai BETA Colli untuk produksi

## 1.6 Checklist penutup

- [ ] Dual approve + In Transit / Delivered jelas
- [ ] Tidak ada Void setelah approve ke-1
- [ ] Beda TF Internal dijelaskan
- [ ] FIFO + tiga sumber insert
- [ ] Colli & Show Virtual ditandai bukan produksi / TO-BE
- [ ] Relasi ke Transfer Inbound tanpa menduplikasi form penerimaan
- [ ] FAQ: stok tujuan belum bisa dipakai?, Available Products ditolak?

---

# PART 2 — SUMBER FAKTA LENGKAP (jangan menambah di luar ini)

> **Transfer External** · SupplyChain · Prefix **TF** · type `tf external`  
> Produksi: `/supplychain/mutation-transfer-external` · BETA Colli: `/supplychain/new-mutation-transfer-external` (**experimental**)  
> Pasangan: **Transfer Inbound** (`/supplychain/transfer-inbound`) — approval ke-2

## §A. Ringkasan

Memindahkan stok **antar gedung / struktur warehouse berbeda** (contoh: GD Surabaya → GD Sidoarjo). Butuh **dua kali approve**:

1. **Pengirim** di Transfer External → Delivery **In Transit**; stok origin ke kolom **Transfer**.
2. **Penerima** di Transfer Inbound → Delivery **Delivered**; availability tujuan = qty diterima.

Stok di gudang tujuan **belum** bisa dipakai penuh sampai Delivered.

## §B. Kapan & Kenapa

| Pakai jika | Jangan jika |
|------------|-------------|
| Pindah stok beda gedung / struktur WH | Pindah antar rak **satu** gedung → **Transfer Internal** |
| Butuh jejak In Transit + penerimaan | Expect satu approve saja |
| Ada setting scrap di WH tujuan | Destination tanpa scrap (Broken di inbound akan gagal) |

**vs Transfer Internal:** External = beda gedung, dua approve, In Transit & Delivery Status. Internal = satu struktur, satu approve, tanpa Delivery Status In Transit/Delivered.

## §C. Prasyarat

- Origin: level ≥ 20 (drop-off ke rack). FIFO **tidak** mengambil stok di Outrack & WIP.
- Destination: level 20, **leaf** (tanpa sub-lokasi), **beda struktur** dari origin, **wajib** punya gudang scrap di Warehouse Setting.
- Origin ≠ destination; destination tidak boleh child tree origin.
- Virtual WH In Transit pada destination — wajib sebelum approve ke-1.
- Stok availability > 0 di origin.
- Fiscal period valid; privilege create/approve.
- First time: isi origin & destination manual; berikutnya autosave bisa isi dari TF Ext terakhir (visible).

## §D. Istilah Kunci

| Istilah | Arti |
|---------|------|
| **TF** | Prefix kode Transfer External |
| **Approve ke-1** | Approve pengirim di menu ini |
| **Approve ke-2** | Approve penerima di Transfer Inbound |
| **In Transit** | Sudah keluar origin, belum resmi di destination |
| **Delivered** | Penerimaan selesai |
| **Single Rack FIFO** | Satu batch/rak lama yang qty-nya cukup |
| **FIFO klasik** | Gabung batch dari terlama jika satu batch tidak cukup |
| **Stock ID** | Satu batch inbound; Available Products mengikat satu stock ID |
| **Reserved** | Stok dikunci di dokumen belum approve |
| **Hidden TF** | Dokumen sistem ke/dari In Transit — tidak muncul di daftar biasa |

## §E. Siklus Status

**Tidak ada Void** setelah approve ke-1 — alur harus dilanjut sampai Delivered. Reject hanya **sebelum** approve ke-1.

```text
Draft → Open → Approved (+ In Transit) → Delivered (via Transfer Inbound)
Open → Rejected → Open (sebelum approve ke-1)
Draft/Open/Rejected → Delete (belum approve)
```

| Status / Delivery | Edit detail | Delete | Approve |
|-------------------|-------------|--------|---------|
| Draft / Open / Rejected | Ya | Ya | Approve ke-1 jika eligible |
| Approved + **In Transit** | Qty received/lost/broken di **Transfer Inbound** | Tidak | Tombol Approve ke-1 hilang |
| **Delivered** | Tidak | Tidak | Tidak |

**Reserved / Stock Monitoring:**
- Insert/edit qty (belum approve): reserved ↑, availability ↓.
- Delete header (belum approve): reserved ↓, availability ↑.
- Setelah approve ke-1: qty origin → kolom **Transfer**; destination incoming, belum availability penuh.

## §F. Dual approve & dokumen hidden (contoh)

Kirim SKUPENSIL 1.000: origin `GD.SBY → Rack-001` → destination `GD-SDA → Drop OFF`.

| Dokumen | Kapan | Origin → Destination | Visible |
|---------|-------|----------------------|---------|
| TF001 (utama) | Create | SBY Rack-001 → SDA Drop OFF | Ya |
| TF002 (hidden) | Setelah approve ke-1 | SBY Rack-001 → **In Transit** | Tidak |
| TF003 (hidden) | Setelah approve ke-2 | In Transit → SDA Drop OFF | Tidak |

Setelah approve ke-2: Lost > 0 → Adjustment Deduction **Open** (ref kode TF utama); Broken > 0 → TF Internal scrap **Open** ke WH scrap destination — detail di panduan Transfer Inbound.

## §G. Tiga sumber insert

| Sumber | Default qty | Alokasi | Edit qty |
|--------|-------------|---------|----------|
| **Select Product** | 1 | Single Rack FIFO → FIFO klasik | Re-run aturan |
| **Import** | Dari file | Sama | Sama |
| **Available Products Use** | Availability stock ID | **Tidak** FIFO — ikat stock ID | Max = availability stock ID itu |

**Pesan Available Products over:** qty melebihi stock ID terpilih — arahkan ke Add Product / Import.

**Contoh:** total SKU 80 = stock 10:00 (50) + 11:00 (30). Use 11:00 lalu edit qty 40 → ditolak.

## §H. Single Rack FIFO → FIFO klasik

Exclude WIP & Outrack dari kandidat; exclude WH destination.

1. Cari satu batch terlama dengan availability ≥ qty → Single Rack FIFO.
2. Else → FIFO klasik (gabung batch terlama).
3. Else → *Insufficient stock*.

**Contoh:** A 50 · B 100 · C 150 · D 200

| Pindah | Dari |
|--------|------|
| 50 | A saja |
| 75 | B saja |
| 250 | A+B+C (FIFO klasik) |

## §I. Group View / Detail View

- **Group View (default):** agregasi per SKU.
- **Detail View:** per stock ID saat multi-batch.

## §J. Field header (ringkas)

| Field | Aturan |
|-------|--------|
| Transaction Code | Auto prefix **TF** setelah save |
| Transaction Date | Fiscal valid; **lock** setelah ada detail |
| Origin | Level ≥ 20; **lock** setelah ada detail |
| Location Destination | Level 20 leaf, beda struktur, wajib scrap; tooltip sistem |

**Tidak ada di produksi:** Colli; picking list UI (selalu 0). Manual Picking List generate TF Internal — bukan TF Ext.

## §K. Import Excel

Template header exact: `Product ID` \| `System Product SKU` \| `Qty` \| `Unit`.

- Alokasi = Single Rack FIFO dari origin; partial success via history.
- Tidak mengisi Colli / Lost / Broken.
- Approve diblok jika import masih jalan.

## §L. Export

| Opsi | Isi |
|------|-----|
| Without Details | Header: Trx Code, Date, SKU, Building Origin, Location Destination, Qty, Status, Delivery Status, audit… |
| With Details | + Availability, Qty Transfered, Qty Received, Lost, Broken, Unit, Is Fifo |
| Active Page Only | Subset halaman |

Building Origin di export = nama building (bukan full path rack).

## §M. Validasi (inti — bahasa UI)

| Kondisi | Behavior |
|---------|----------|
| Origin = destination / dest child origin | Harus berbeda |
| Destination bukan leaf | Hanya destination tanpa child |
| Ubah origin/tanggal setelah ada detail | Ditolak |
| Approve tanpa detail | Ditolak |
| Dest detail = origin | Ditolak |
| Origin level < 20 | Ditolak saat approve ke-1 |
| Insufficient stock | Select/Import |
| Qty AP > stock ID | Pesan exceed stock ID |
| Import template/baris invalid | Pesan template / Product ID / SKU / Qty / Unit |
| Approve job lock | Tunggu + refresh |
| Delete setelah approve / auto-gen In Transit | Ditolak |

## §N. Colli & Show Virtual

| Topik | Status |
|-------|--------|
| Colli di produksi | **Tidak ada** |
| Route BETA Colli | Experimental — jangan standar produksi |
| Show Virtual WH | TO-BE **hide** di produksi; dokumen In Transit memang disembunyikan |

## §O. Yang Bisa / Tidak Bisa

**Bisa:** CRUD Draft/Open/Rejected; Select Product / Import / Available Products; Bulk Delete & Approve; Export; lanjut proses di Transfer Inbound.

**Tidak bisa:** Void setelah approve ke-1; Reject setelah approve ke-1; ubah origin/tanggal setelah ada detail; Colli produksi; hapus dokumen Approved; Show Virtual di produksi.

## §P. Menu terkait

| Menu | Relasi |
|------|--------|
| **Transfer Inbound** | Approval ke-2; list In Transit / Delivered |
| Adjustment Deduction | Auto Lost setelah inbound (Open, approve manual) |
| Transfer Scrap / TF Internal scrap | Auto Broken (Open) |
| Warehouse Setting | Scrap destination wajib |
| Stock Monitoring | Reserved → Transfer → availability setelah Delivered |
| Transfer Internal | Pola FIFO mirip — **bukan** pasangan dual-approve |
| Product Mutation | Receiving Process selama In Transit |

## §Q. Troubleshooting

| Gejala | Solusi |
|--------|--------|
| Destination ditolak | Leaf, beda struktur, scrap setting |
| Insufficient stock | Cek Stock Monitoring; stok bukan hanya WIP/Outrack |
| Qty Available Products ditolak | Kurangi atau Select Product / Import |
| Approve stuck hourglass | Refresh; tunggu job |
| Import gagal | Template 4 kolom exact |
| Tidak bisa hapus setelah approve | Tidak ada Void — lanjut Inbound |
| Stok tujuan belum bisa dipakai | Masih In Transit — tunggu Transfer Inbound |

## §R. FAQ

**Q: Bedanya Transfer Internal?**  
A: External = beda gedung, dua approve, In Transit. Internal = satu struktur, satu approve.

**Q: Kenapa stok tujuan belum bisa dipakai setelah approve pengirim?**  
A: Masih In Transit — tunggu Transfer Inbound.

**Q: Kenapa tidak bisa hapus setelah approve?**  
A: Tidak ada Void. Lanjut sampai Delivered.

**Q: Qty Available Products ditolak padahal total SKU cukup?**  
A: Terikat satu stock ID. Pakai Select Product / Import.

**Q: Colli / Show Virtual?**  
A: Produksi tidak memakai keduanya untuk menu ini.

**Q: Di mana penerimaan?**  
A: Menu **Transfer Inbound** — nomor TF yang sama.
