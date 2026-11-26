---
doc_type: gemini-generation-brief
target_menu: "Transfer Inbound"
menu_slug: supplychain-transfer-inbound
paired_menu: "Transfer External (supplychain-mutation-transfer-external) — approval ke-1"
source_of_truth: docs/qa-docs/supplychain-transfer-inbound/ (repo olshoperp — dibaca 2026-09-02)
purpose: >
  Brief lengkap untuk di-paste ke Gemini agar generate SATU dokumen
  konsolidasi "Transfer Inbound" bergaya Pentaho — bukan wireframe, bukan kode.
  Pasangan kirim = menu Transfer External (brief terpisah).
status: ready-to-send-to-gemini
source_doc_status: >
  KB review v2.0 · requirement review v2.0 · technical review v2.0 ·
  user-guide review v1.0 · feature-map review v1.0 · 4 Lingo cards ·
  approval ke-2; Received/Lost/Broken; pairing TF Ext; Show Virtual TO-BE hide.
---

# BRIEF UNTUK GEMINI — Generate Dokumentasi "Transfer Inbound"

> **Cara pakai:** copy/upload file ini ke Gemini. **PART 1** = instruksi.
> **PART 2** = SELURUH fakta sumber. Gemini wajib pakai Part 2 saja — dilarang mengarang.
> **Pasangan:** dokumen Help Center Transfer External digenerate dari brief terpisah — di sini cukup rujuk singkat (approve ke-1 → In Transit), jangan duplikasi FIFO/Import/Create pengirim.

---

# PART 0 — Kenapa struktur ini seperti ini / beda dari menu lain

1. **Bukan create transaksi baru** — surface penerimaan atas dokumen **Transfer External** yang sudah Approved + **In Transit**. **Tidak ada Create**, tidak ada Select Product / Import.
2. **Approval ke-2** — mengubah Delivery Status **In Transit → Delivered**. Status transaksi header sudah Approved sejak ke-1; yang berubah Delivery + qty Received/Lost/Broken.
3. **Received + Lost + Broken = Qty Transfered** — rumus wajib; Received tidak boleh > Transfered.
4. **Lost / Broken tidak auto-finalize** — generate Adjustment Deduction **Open** / TF scrap **Open** — user approve manual di menu lain (beda Failed Ship).
5. **Tidak ada Void / reject penerimaan** — koreksi angka **sebelum** Approve ke-2.
6. Share UI keluarga TF Ext + flag inbound; Colli & Show Virtual mengikuti keputusan TF Ext (tidak di produksi / TO-BE hide).
7. Cross-ref **Transfer External** wajib di alur & Lihat Juga — tanpa menyalin detail create/FIFO pengirim.

---

# PART 1 — Instruksi untuk Gemini

## 1.1 Peran

Kamu = technical writer bergaya pentaho.com: definisi → prosedur → tabel referensi; langkah bernomor; callout **Note / Tip / Warning**; tanpa marketing. **Sumber = PART 2 saja.**

## 1.2 Bahasa & tone

- Bahasa Indonesia + istilah EN (Transfer Inbound, Qty Received, Lost Items, Broken Items, Delivered, In Transit).
- Definisikan istilah sebelum dipakai.
- **NOL** path file / class / kolom DB / ID gap (GAP-TFINB-xx, V-TFINB-xx).
- Boleh sebut ID Lingo: SF-TFINB-01..03, SF-VIEW-01.

## 1.3 Struktur dokumen WAJIB (20 section)

1. Judul & Ringkasan Singkat (penerimaan TF Ext; tidak Create)
2. Istilah Kunci
3. Kapan & Kenapa Dipakai
4. Prasyarat (TF Ext Approved + In Transit; scrap jika Broken)
5. Posisi dalam Alur Bisnis (`flowchart LR` dari TF Ext → Inbound → Delivered)
6. Lokasi Menu + placeholder
7. Siklus Delivery Status (`stateDiagram-v2` In Transit → Delivered) — bukan Draft/Open create
8. Langkah Penggunaan — terima & Approve ke-2
9. Qty Received / Lost / Broken — rumus + contoh angka
10. Side effect setelah Approve (availability, Deduction Open, scrap Open)
11. Group View vs Detail View
12. Referensi Field form inbound
13. Export
14. Aturan Bisnis & Validasi
15. Show Virtual WH — TO-BE hide
16. Keterbatasan & Hal dalam Tinjauan
17. Hubungan Menu Lain (`flowchart TB`) — **wajib** Transfer External
18. Troubleshooting
19. FAQ
20. Lihat Juga — **Transfer External** (pengirim)

## 1.4 Mermaid

- **Wajib:** §5 `flowchart LR`; §7 `stateDiagram-v2` (Delivery saja); §17 `flowchart TB`.
- **Jangan** stateDiagram Draft→Open untuk create — menu ini tidak create.
- Tiap diagram + fallback teks numbered list.

## 1.5 Placeholder gambar (min 5)

1. Sidebar → Transfer Inbound
2. Datalist In Transit / Delivered (tanpa Create)
3. Form edit — Qty Transfered / Received / Lost / Broken
4. Delivery Status Delivered setelah approve
5. (Opsional) Adjustment Deduction Open setelah Lost

## 1.6 Checklist penutup

- [ ] Tidak ada Create / Select Product / Import
- [ ] Rumus Received+Lost+Broken = Transfered + contoh
- [ ] Lost/Broken 0 sah jika semua diterima
- [ ] Deduction/scrap tetap Open — approve manual
- [ ] Tidak ada Void/reject penerimaan
- [ ] Relasi TF Ext tanpa duplikasi FIFO/create
- [ ] FAQ: dokumen tidak muncul?, Broken ke WH mana?

---

# PART 2 — SUMBER FAKTA LENGKAP (jangan menambah di luar ini)

> **Transfer Inbound** · SupplyChain · Route `/supplychain/transfer-inbound`  
> Share UI Transfer External + flag inbound · **Tidak ada Create**  
> Pasangan: **Transfer External** (`/supplychain/mutation-transfer-external`) — approval ke-1; nomor **TF** sama

## §A. Ringkasan

Menu **penerimaan** untuk Transfer External yang sudah di-approve pengirim. Operator gudang tujuan:

1. Lihat dokumen dengan Delivery **In Transit** (atau sudah **Delivered**).
2. Isi **Qty Received / Lost / Broken**.
3. **Approve** (approval ke-2) → Delivery **Delivered**.

Tanpa langkah ini, barang tetap In Transit dan belum resmi masuk stok tujuan.

FIFO, Import, Select Product, Create header, Colli produksi: **ikut Transfer External** — tidak diulang di menu ini.

## §B. Kapan & Kenapa

| Pakai jika | Jangan jika |
|------------|-------------|
| Menerima barang TF Ext In Transit | Mau buat transfer baru → Transfer External |
| Konfirmasi qty diterima / hilang / rusak | Mau pindah dalam satu gedung → Transfer Internal |
| Menutup Delivery Status ke Delivered | Expect Void/reject penerimaan |

## §C. Prasyarat

- Dokumen TF External **Approved** + Delivery **In Transit** (tidak muncul jika masih Draft/Open di pengirim).
- Privilege view/approve (share surface TF External).
- Jika Broken > 0: Warehouse Setting **scrap** pada building **destination** (bukan origin pengirim).
- Received + Lost + Broken = Qty Transfered sebelum approve ke-2.

## §D. Istilah Kunci

| Istilah | Arti |
|---------|------|
| **Qty Transfered** | Qty dikirim pengirim (disabled — tidak diubah penerima) |
| **Qty Received** | Qty diterima baik; default = semua transferred |
| **Lost Items** | Hilang di jalan → Adjustment Deduction **Open** (approve manual) |
| **Broken Items** | Rusak → TF Internal scrap ke WH scrap **Open** (approve manual) |
| **In Transit** | Menunggu penerimaan di menu ini |
| **Delivered** | Penerimaan selesai |
| **Approve ke-2** | Approve penerima di Transfer Inbound |
| **TF utama** | Kode dokumen yang terlihat (bukan kode TF hidden sistem) |

## §E. Siklus Delivery Status

Dokumen yang diedit = **header TF External utama**. Status transaksi sudah **Approved** sejak approve ke-1. Yang berubah: **Delivery Status** + qty received/lost/broken.

```text
In Transit → Delivered (Approve ke-2)
```

| Delivery | Edit Received/Lost/Broken | Delete header | Approve ke-2 |
|----------|---------------------------|---------------|--------------|
| In Transit | Ya | Tidak | Ya |
| Delivered | Tidak | Tidak | Tidak |

**Tidak ada Void. Tidak ada reject approval ke-2.** Koreksi angka **sebelum** Approve.

**Action datalist:** Update (form inbound); Approve jika eligible; **tidak** Create; Delete tidak untuk dokumen sudah Approved di pengirim.

## §F. Langkah penggunaan

1. Buka **Transfer Inbound** — cari nomor TF **In Transit**.
2. Buka edit. Header Basic Information **read-only operasional**.
3. Per baris: sesuaikan Qty Received / Lost / Broken (default biasanya received = semua, lost/broken kosong/0).
4. Pastikan **Received + Lost + Broken = Qty Transfered**.
5. Klik **Approve**.
6. Cek Delivery **Delivered**. Jika Lost/Broken > 0 → lanjut approve di Adjustment Deduction / Transfer scrap.

**Boleh approve tanpa ubah qty** — artinya semua diterima baik (received = transferred, lost/broken 0).

## §G. Contoh penerimaan

TF Ext kirim SKUPENSIL **1.000**:

| Received | Lost | Broken | Hasil setelah approve ke-2 |
|----------|------|--------|----------------------------|
| 1.000 | 0 | 0 | Semua masuk destination; Delivered |
| 900 | 100 | 0 | 900 availability tujuan; Deduction Open 100 (ref kode TF utama) |
| 850 | 50 | 100 | 850 tujuan; Deduction 50 Open; TF scrap 100 Open |
| 1.001 | — | — | Ditolak — received tidak boleh > transferred |

Lost/Broken **0 atau kosong sah** jika received = transferred (meski UI ada tanda required).

## §H. Side effect setelah Approve ke-2

1. Validasi jumlah vs transferred.
2. Update pergerakan In Transit → destination untuk qty **received** (boleh 0).
3. Lost > 0 → Stock Deduction **Open**, process lost, **Trx Ref = kode TF Ext utama** (bukan TF hidden). Approve deduction **manual**.
4. Broken > 0 → wajib scrap WH; TF Internal scrap In Transit → scrap destination; status **Open** — **bukan** auto-approve. UI hint: qty Broken otomatis transfer ke virtual broken warehouse; Lost otomatis create adjustment out form.
5. Delivery Status dokumen utama → **Delivered**.

**Stock Monitoring:** incoming In Transit hilang; availability destination = received. Lost tidak jadi availability. Broken menunggu approve TF scrap.

## §I. Group View / Detail View

- Group View default (agregasi SKU).
- Detail View untuk stock ID.
- Colli: **tidak** di form inbound produksi.

## §J. Field form inbound

| Kolom | Aturan |
|-------|--------|
| Qty Transfered | Disabled |
| Qty Received | Editable; default = transferred |
| Lost Items | Editable; default kosong/0 |
| Broken Items | Editable; default kosong/0 |

Tidak menambah SKU. Tidak Import. Tidak Select Product / Available Products.

## §K. Export

With / without details — keluarga TF Ext; with-details berisi Qty Received / Lost / Broken.

## §L. Validasi (inti — bahasa UI)

| Kondisi | Behavior |
|---------|----------|
| Received > transferred | *Quantity received cannot be greater than transfer quantity* |
| Received + lost + broken ≠ transferred (saat set qty) | Harus sama dengan transferred |
| Saat approve, jumlah tidak match | Cek lagi lost/defect vs received |
| Broken > 0 tanpa scrap WH | Gagal resolve scrap |
| Ubah qty setelah Delivered | Ditolak — sudah approved |
| Approve job lock | Tunggu + refresh |
| Detail WH tidak lengkap | Pilih warehouse di semua detail |

Catatan: ada **dua** pesan validasi jumlah (saat set qty vs saat approve) — samakan angka lalu approve lagi.

## §M. Show Virtual & Colli

| Topik | Status |
|-------|--------|
| Show Virtual WH | TO-BE hide (sama keputusan TF Ext); produksi `is_show_virtual=false` |
| Colli di inbound | Tidak ada; BETA Colli TF Ext tidak mengalir ke form inbound |

## §N. Yang Bisa / Tidak Bisa

**Bisa:** Lihat In Transit / Delivered; edit Received/Lost/Broken selama In Transit; Approve ke-2 (satu atau bulk jika eligible); Export.

**Tidak bisa:** Create dokumen; tambah SKU / Import / Select Product; Void atau reject penerimaan; edit setelah Delivered; hapus dokumen yang sudah Approved di pengirim.

## §O. Menu terkait

| Menu | Relasi |
|------|--------|
| **Transfer External** | Sumber dokumen; approval ke-1; Trx Code sama |
| Adjustment Deduction | Lost; ref kode TF Ext **utama**; Open sampai user approve |
| Transfer Scrap / TF Internal scrap | Broken ke WH scrap destination; Open |
| Stock Monitoring / Product Mutation | Incoming selesai setelah Delivered |
| Warehouse Setting | Scrap building **tujuan** |

```text
TF External approve ke-1 → In Transit → Transfer Inbound
Approve ke-2 → Delivered + availability dest
Lost → Adjustment Deduction Open
Broken → TF scrap Open
```

## §P. Troubleshooting

| Gejala | Solusi |
|--------|--------|
| Dokumen tidak muncul | Selesaikan approve ke-1 di Transfer External dulu |
| Broken ditolak | Scrap WH destination di Warehouse Setting |
| Deduction tidak ketemu | Cari **kode TF Ext utama**, bukan TF hidden |
| Incoming masih ada setelah approve | Refresh; cek Delivery Delivered |
| Pesan jumlah beda set vs approve | Samakan Received+Lost+Broken = Transfered, approve lagi |

## §Q. FAQ

**Q: Kenapa dokumen tidak muncul?**  
A: Pengirim belum approve di Transfer External (masih Draft/Open).

**Q: Boleh approve tanpa ubah qty?**  
A: Ya — default received = transferred, lost/broken 0.

**Q: Lost sudah ada deduction, kenapa stok belum potong final?**  
A: Deduction masih **Open** — approve manual di Adjustment Deduction.

**Q: Broken ke gudang mana?**  
A: Gudang scrap di Warehouse Setting untuk **destination** (bukan origin pengirim).

**Q: Bisa reject penerimaan?**  
A: Tidak. Koreksi angka sebelum Approve ke-2.

**Q: Di mana buat dokumen kirim?**  
A: Menu **Transfer External** — nomor TF yang sama.
