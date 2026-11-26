# Brief — Completion Summary: Failed Ship

**Menu:** Failed Ship (Supply Chain) · `supplychain/failed-ship/edit/{id}`
**Status dokumen:** TO-BE (usulan requirement) + AS-IS (verifikasi codebase `olshoperp-frontend` & qa-docs `supplychain-failed-ship` v2.6)
**Mockup:** https://claude.ai/code/artifact/3f60e9e8-b275-45b0-b568-227c627050f0
**Acuan pola:** Completion Summary Manual Picking List — `src/pages/Omni/Processing/PickingList/CompletionSummary.vue`
**Dibuat:** 09-09-2026 · Author: QA - Yemima

---

## 1. Tujuan

Failed Ship adalah satu-satunya proses di rantai fulfillment yang **satu kali approve memecah stok ke 3 arah sekaligus** (restock, lost, broken) dan masing-masing menghasilkan dokumen turunan yang di-auto-approve tanpa campur tangan user. Setelah approve, user tidak punya satu layar pun yang menjawab:

- barangnya ke mana saja, dan sisanya berapa;
- dokumen apa saja yang otomatis terbentuk beserta kodenya;
- order ini sebenarnya sudah lewat proses apa saja sebelum gagal kirim;
- apa yang masih bisa/tidak bisa diproses di Instant Settlement setelah ini.

Completion Summary menjawab keempatnya dalam satu panel, sekaligus jadi bukti serah-terima saat rekonsiliasi stok dengan 3PL.

---

## 2. Entry point & kondisi kemunculan

### 2.1 Letak tombol

Tombol **Completion Summary** (`Button variant="outline-primary" size="sm"`) di baris "Order No" pada section **Order Details** — persis posisi yang dipakai Manual Picking List. Panelnya dirender di `Slideover size="xl"` sisi kanan, bukan halaman baru, bukan modal.

### 2.2 Validasi kemunculan tombol

| Kondisi | Sumber | Tombol tampil? | Alasan |
|---|---|---|---|
| `transaction_status = draft` (belum Set Location) | header FS | ❌ | Belum ada lokasi restock, belum ada qty apa pun |
| `transaction_status = open` (sudah Set Location, proses checking berjalan) | header FS | ❌ | Qty masih bisa berubah, belum ada dokumen turunan |
| `transaction_status = open` + sedang **pause** | `is_pause` | ❌ | Sama seperti open |
| **`transaction_status = approved`** | header FS | ✅ | Dokumen turunan sudah terbentuk — kondisi utama |
| `transaction_status = closed` | header FS | ✅ | Dokumen turunan tetap ada, summary tetap valid dibaca |
| `transaction_status = void` | header FS | ❌ | Dokumen turunan dibatalkan, summary menyesatkan |
| Setelah **unapprove** (via kolom FS Status di datalist) | `action.unapprovable` | ❌ | Dokumen turunan ikut dibatalkan, kembali ke `open` |

**Aturan singkat:** tombol muncul kalau `transaction_status ∈ {approved, closed}`. Di semua status lain tombol tidak dirender sama sekali (bukan disabled), sama seperti perilaku tombol lain di halaman ini.

### 2.3 Validasi tambahan

- Panel **read-only** — tidak ada input, tidak ada aksi yang mengubah data. Hanya **Print Summary** dan **Done** (tutup slideover).
- Permission: ikut permission read menu Failed Ship. Kode dokumen turunan (TFI/TFS/SD) ditampilkan sebagai teks; jadi link ke menu tujuan hanya kalau user punya permission menu tersebut, kalau tidak tampil plain text.
- Kalau endpoint gagal / data kosong, panel menampilkan empty state, bukan angka 0 palsu.

---

## 3. Struktur panel & sumber data

Semua sumber di bawah mengacu ke: header FS = `scm_stock_mutations` dengan `process_type = failed ship` (prefix kode **FS**), detail FS = `scm_transfer_mutation_details`, order = `omni_sales_orders` + `omni_sales_order_details`.

### 3.1 Header panel

| Elemen | Contoh | Sumber data |
|---|---|---|
| Judul | "Failed ship complete" | statis |
| FS Code | FS-2609-00042 | `scm_stock_mutations.code` |
| Approved At | 05-09-2026 14:22:10 | tanggal approve header FS (`transaction_date` / log approval) |
| Failed Ship By | Yoga Pratama | `failed_ship_by` (sudah tampil di HeaderInformation) |
| SO Code + Platform Order | SO-2608-01187 · 250831ABCD9KLM | `transaction_reference` → `omni_sales_orders.code`, `platform_order_id` |
| Origin | WH 3PL — JNE Cakung | `warehouse_origin` header FS (WH shipper hasil TFI shipping do) |
| Restock Location | RESTOCK-WH-01 · R.20.14 | `warehouse_destination` (dipilih saat Set Location, wajib Level 20) |

### 3.2 Summary count — urutan kartu

Kartu dibagi 2 grup. Grup pertama = bucket proses, grup kedua = angka ringkasan, dan **Total Order Qty berada paling ujung** sebagai basis semua angka lain.

**Grup 1 — Failed ship process**

| Kartu | Contoh | Sumber data | Keterangan bawah kartu |
|---|---|---|---|
| Restock | 10 | `SUM(packed_in_base_unit)` = kolom UI `failed_ship_restock_qty_formatted` | kode TFI + gudang tujuan |
| Lost | 5 | `SUM(picked_in_base_unit)` = `missing_quantity_formatted` | kode SD + "stock removed from 3PL" |
| Broken / Scrap | 3 | `SUM(checked_in_base_unit)` = `broken_quantity_formatted` | kode TFS + WH scrap |

**Grup 2 — Summary count**

| Kartu | Contoh | Sumber data | Keterangan |
|---|---|---|---|
| Remaining Qty | 2 | `total_order_quantity − total_fs_quantity` | pcs yang tidak masuk FS, tetap fisik di WH 3PL |
| Total FS Qty | 18 | `SUM(transfer_quantity)` = `total_fs_qty_formatted` (= restock + lost + broken) | posisinya di ringkasan, **bukan** di grup proses |
| **Total Order Qty** | 20 | `SUM(omni_sales_order_details.quantity)` (kolom UI `product_qty_formatted`) | kartu penutup, jadi basis pembanding |

SKU count = `COUNT(DISTINCT product_id)` pada detail FS.

### 3.3 Order Movement (timeline)

Menggantikan flowchart. Isinya riwayat pergerakan order dari dibuat sampai dokumen turunan FS, lengkap tanggal + jam. Semua tahap fulfillment tercatat sebagai transfer internal di `scm_stock_mutations` dengan `process_type` berbeda, jadi timeline ini **query satu tabel** difilter `transaction_reference = SO`.

| Fase | Baris timeline | `process_type` / sumber | Prefix kode | Pergerakan gudang |
|---|---|---|---|---|
| Order & fulfillment | Order created | `omni_sales_orders.created_at` + auto approve | SO | — |
| | Assigned to wave | `in wave` | TFI (virtual) | Rack → Rack-Waves |
| | Picking complete | `picking` | **PL** | Rack → Outrack |
| | Checking complete | `checking` | **CL** | Outrack → Checking (virtual) |
| | Packing complete | `packing` | **PK** | Checking → Packing (virtual) |
| | Collected | `shipping` | **SL** | Packing → Collected (virtual) |
| Shipping | Delivery order approved | `scm_delivery_orders` (approve date) | DO | — |
| | Shipped to 3PL | `shipping do` | **TFI** | Collected → WH 3PL (status order jadi *Shipped*) |
| | Picked up by courier | `picked_up_at` (sudah ada di header FS) | — | keluar gedung |
| Failed ship | Failed ship created | header FS `created_at`, status draft | **FS** | — |
| | Set location | log set-location; status draft → open | — | penetapan WH Destination + resolve WH Scrap |
| | Item checking | log check / inline edit detail (+ pause & resume) | — | pembagian qty per bucket |
| | **Failed ship approved** | approve header FS | **FS** | baris pivot, di-highlight |
| Follow-up documents | Restock transfer | `process_type = failed ship` (TF internal hasil approve) | **TFI** | WH 3PL → WH Destination |
| | Stock deduction | `process_type = lost` | **SD** | WH 3PL → keluar sistem |
| | Scrap transfer | `process_type = scrap` | **TFS** | WH 3PL → WH Scrap |
| | Instant Settlement (pending) | belum ada dokumen | — | menunggu proses settlement |

Offset waktu antar tahap fulfillment (AS-IS, dipakai di contoh mockup): Picking = SO date + 10 menit; Checking = Picking + 10 detik; Packing = Checking + 10 detik; Collected = Packing + 10 detik; Shipped DO = Collected + 10 detik.

Tiap baris menampilkan: waktu (tanggal + jam), nama tahap, kode dokumen, pergerakan `origin → destination`, dan pelaku (picked by / checked by / packed by / approved by).

### 3.4 Auto-Generated Documents + sub-flow

Empat kartu yang bisa dibuka; tiga pertama adalah dokumen nyata, kartu keempat menjelaskan qty yang tidak menghasilkan dokumen.

| Kartu | Dokumen | Dibuat oleh | Sumber qty | Isi sub-flow |
|---|---|---|---|---|
| Restock | TFI-… Transfer Internal | approve FS → transfer + approve transfer stok | `packed_in_base_unit` | approve FS → generate TF internal → auto-approve → stok masuk rack Level 20 → tampil di menu Transfer Internal |
| Lost | SD-… Stock Deduction (`process_type = lost`) | handler missing qty, auto-approve lewat proses deduction FA | `picked_in_base_unit` | approve FS → generate deduction → auto-approve → stok 3PL berkurang permanen → **jurnal Debit Return Expense / Kredit Persediaan** (COA dari Product COA Group SKU, beda dari deduction reguler yang pakai Expense biasa) → hanya bisa dibalik lewat unapprove FS |
| Broken | TFS-… Transfer Scrap (`process_type = scrap`) | handler broken qty | `checked_in_base_unit` | approve FS → resolve WH Scrap dari Setting Warehouse Scrap & Void milik parent restock location → generate TFS → auto-approve → stok jadi scrap, tetap tercatat aset |
| Remaining | — | — | order qty − total FS qty | tidak ada dokumen; qty lanjut ke Instant Settlement, dan Sales Return berikutnya dibatasi qty outbound terakhir |

**Aturan tampil kartu:** kartu hanya muncul kalau qty bucket-nya > 0. Contoh: FS tanpa lost qty → kartu Stock Deduction tidak muncul dan tidak ada kode SD di mana pun (termasuk di section Impact).

### 3.5 Breakdown by SKU

Tab filter: All SKU · Restock · Lost · Broken · Remaining. Satu baris = satu kombinasi **SKU × outcome** (pola sama dengan Completion Summary picking list); baris dengan qty 0 disembunyikan.

| Kolom | Sumber data |
|---|---|
| SKU / Product Name | `product_formatted` (System Product SKU + System Product Name) |
| Order Qty | `omni_sales_order_details.quantity` per SKU |
| Qty | qty bucket sesuai outcome baris |
| Outcome | derivasi dari bucket: Restock / Lost / Broken / Remaining |
| Stock Movement | `warehouse_origin` → tujuan sesuai outcome (WH Destination / keluar sistem / WH Scrap / tetap 3PL) |
| Document | kode dokumen turunan yang memuat baris itu; `—` untuk Remaining |

Urutan baris: SKU ascending, lalu `outcome_order` (Restock 1, Lost 2, Broken 3, Remaining 4).

### 3.6 Impact On Other Documents

Urutan kiri ke kanan, lalu blok settlement di bawahnya:

| # | Item | Isi | Sumber data |
|---|---|---|---|
| 1 | Transfer Internal | Kode TFI (restock) dan TFS (scrap) + qty + gudang tujuan | dokumen turunan hasil approve |
| 2 | Stock Deduction | Kode SD + qty, **diisi dari lost qty kalau ada**; kalau lost = 0 tampil catatan "tidak digenerate" | dokumen `process_type = lost` |
| 3 | Failed Ship Status | `Open → Approved`, qty terkunci | `transaction_status` header FS |
| 4 | Instant Settlement | Blok dinamis 2 kondisi (di bawah) | perhitungan order qty − total FS qty |

---

## 4. Instant Settlement — 2 kondisi

Ditentukan dari **Order Qty − Total FS Qty** pada SO yang sama.

### Kondisi 1 — hasil > 0 (masih ada barang)

- **Outbound ✓ dan Sales Invoice ✓ bisa diproses**, dengan **max qty = Order Qty − Total FS Qty**.
- Baris SKU yang qty netto-nya 0 di-skip dari invoice maupun outbound.
- Qty outbound mengikuti stok fisik yang masih ada di WH 3PL, jadi tidak akan melebihi qty netto.
- Sales Return berikutnya dibatasi ke qty outbound terakhir tersebut.
- Contoh mockup: 20 − 18 = **2 pcs**, tersebar di 2 SKU (1 pcs + 1 pcs), 1 SKU habis dan tidak muncul di invoice.

### Kondisi 2 — hasil = 0 (habis di failed ship)

- **Outbound tidak bisa diproses** — tidak ada stok tersisa untuk dikeluarkan; seluruh qty sudah jadi restock / lost / scrap.
- **Instant Settlement hanya bisa Sales Invoice only**, tanpa baris produk di belakangnya.
- Nilai yang boleh diisi/disesuaikan **hanya Other Cost & Other Discount** — untuk membukukan biaya platform, ongkir, atau penyesuaian atas order yang tidak mengirim barang apa pun.
- Tidak ada Sales Return setelahnya karena qty outbound = 0.

Selain 2 kondisi qty di atas, aturan settlement lain tetap berlaku: FS berstatus `open` memblokir seluruh batch upload settlement untuk SO tersebut, dan settlement date harus lebih besar dari FS date.

---

## 5. Endpoint & payload

| Endpoint | Fungsi |
|---|---|
| `GET supplychain/failed-ship/{id}/completion-summary` | Data panel |
| `GET supplychain/failed-ship/{id}/print-completion-summary` | HTML siap print, dibuka di tab baru lalu `window.print()` (pola sama dengan picking list) |

```json
{
  "trx_code": "FS-2609-00042",
  "sales_order_code": "SO-2608-01187",
  "platform_order_id": "250831ABCD9KLM",
  "approved_at": "05-09-2026 14:22:10",
  "failed_ship_by": "Yoga Pratama",
  "warehouse_origin": "WH 3PL - JNE Cakung",
  "warehouse_destination": "RESTOCK-WH-01 · R.20.14",
  "sku_count": 3,
  "restock_quantity": 10,
  "lost_quantity": 5,
  "broken_quantity": 3,
  "total_fs_quantity": 18,
  "remaining_quantity": 2,
  "total_order_quantity": 20,
  "settlement": {
    "case": "invoice_and_outbound",
    "max_outbound_quantity": 2,
    "editable_fields": ["product_lines", "other_cost", "other_discount"]
  },
  "timeline": [
    { "stage": "Order created", "code": "SO-2608-01187", "at": "31-08-2026 09:12:04",
      "from": null, "to": null, "actor": "System", "phase": "fulfillment" },
    { "stage": "Picking complete", "code": "PL-2608-00921", "at": "31-08-2026 09:22:04",
      "from": "Rack R.10.03, R.11.08", "to": "Outrack", "actor": "Anisa Rahmawati", "phase": "fulfillment" },
    { "stage": "Shipped to 3PL", "code": "TFI-2609-01988", "at": "01-09-2026 16:55:22",
      "from": "Collected (virtual)", "to": "WH 3PL - JNE Cakung", "actor": "System", "phase": "shipping" },
    { "stage": "Failed ship approved", "code": "FS-2609-00042", "at": "05-09-2026 14:22:10",
      "from": "WH 3PL - JNE Cakung", "to": null, "actor": "Yoga Pratama", "phase": "failed_ship" }
  ],
  "documents": [
    { "type": "Transfer Internal", "code": "TFI-2609-00311", "quantity": 10,
      "outcome": "Restock", "from": "WH 3PL - JNE Cakung", "to": "RESTOCK-WH-01" },
    { "type": "Stock Deduction", "code": "SD-2609-00088", "quantity": 5,
      "outcome": "Lost", "from": "WH 3PL - JNE Cakung", "to": null },
    { "type": "Transfer Scrap", "code": "TFS-2609-00057", "quantity": 3,
      "outcome": "Broken", "from": "WH 3PL - JNE Cakung", "to": "SCRAP-WH-JKT" }
  ],
  "rows": [
    { "sku": "SKU-BTL-500", "product_name": "Stainless Tumbler 500ml - Navy",
      "order_qty": 10, "qty": 6, "outcome": "Restock", "outcome_order": 1,
      "from": "WH 3PL - JNE Cakung", "to": "RESTOCK-WH-01 · R.20.14",
      "document_code": "TFI-2609-00311" }
  ]
}
```

`settlement.case` bernilai `invoice_and_outbound` (kondisi 1) atau `invoice_only` (kondisi 2), supaya frontend tidak menghitung sendiri.

---

## 6. Peta field UI → kolom DB

| Label UI | Field API datalist AS-IS | Kolom `scm_transfer_mutation_details` |
|---|---|---|
| Product Qty / Order Qty | `product_qty_formatted` | dari `omni_sales_order_details.quantity` |
| Restock Qty | `failed_ship_restock_qty_formatted` | `packed_in_base_unit` + `transfer_quantity` |
| Lost Items | `missing_quantity_formatted` | `picked_in_base_unit` |
| Broken / Defect Items | `broken_quantity_formatted` | `checked_in_base_unit` |
| Total FS Qty | `total_fs_qty_formatted` | `transfer_quantity` (computed sum) |
| Location / Restock Location | `warehouse_formatted`, `warehouse_destination_formatted` | `warehouse_destination` header |

Tracking di SO detail (tidak ditampilkan di panel, tapi ikut berubah saat approve): `prepared_to_failed_ship_quantity` → `processed_to_failed_ship_quantity`.

---

## 7. Frontend — file yang disentuh

| File | Perubahan |
|---|---|
| `src/pages/SCM/FailedShip/CompletionSummary.vue` | **Baru** — kembaran `Omni/Processing/PickingList/CompletionSummary.vue`, props `summary`, `showDone`, `apiBaseUrl`, `isSidebar` |
| `src/pages/SCM/FailedShip/HeaderInformation.vue` | Tambah tombol + `emit('openCompletionSummary')` di baris Order No, dirender hanya saat status approved/closed |
| `src/pages/SCM/FailedShip/Form.vue` | State `completionSummaryOpen`, `fetchCompletionSummary(id)`, dan `Slideover size="xl"` di akhir template |

Beda desain dari versi picking list: outcome jadi Restock/Lost/Broken/Remaining; ada kolom Stock Movement; kartu ringkasan dipisah 2 grup dengan Total Order Qty di ujung; ada timeline Order Movement; blok settlement bersifat kondisional.

---

## 8. QA test notes

| # | Skenario | Ekspektasi |
|---|---|---|
| 1 | FS status draft / open | Tombol Completion Summary tidak muncul |
| 2 | FS approved | Tombol muncul, panel terbuka, semua angka terisi |
| 3 | FS di-unapprove | Tombol hilang lagi; dokumen turunan ikut batal |
| 4 | FS void | Tombol tidak muncul |
| 5 | Lost qty = 0 | Kartu Lost & kartu Stock Deduction tidak muncul; item Stock Deduction di section Impact tampil catatan "tidak digenerate" |
| 6 | Broken qty = 0, WH scrap belum di-setup | FS memang sudah ditolak sejak create — tidak ada kasus approved tanpa setup scrap |
| 7 | Total FS Qty = Order Qty | Remaining Qty = 0; blok settlement menampilkan Kondisi 2 (invoice only + other cost/disc) |
| 8 | Total FS Qty < Order Qty | Remaining Qty > 0; blok settlement Kondisi 1 dengan max qty = selisih |
| 9 | Restock + Lost + Broken ≠ Total FS Qty | Bug — Total FS Qty wajib sama dengan penjumlahan 3 bucket |
| 10 | Total Order Qty ≠ jumlah Order Qty di tabel per SKU | Bug — kartu penutup harus konsisten dengan tabel |
| 11 | Tab filter outcome | Hanya baris outcome terkait yang tampil; tab All menampilkan semua baris non-zero |
| 12 | Timeline | Urut kronologis, tanggal-jam tiap tahap terisi, kode dokumen tiap tahap sesuai prefix (PL/CL/PK/SL/TFI/FS/SD/TFS) |
| 13 | Print Summary | Membuka tab baru berisi versi cetak dengan angka identik |
| 14 | FS lintas company / permission terbatas | Panel tetap tampil; kode dokumen yang menunya tidak dipermit tampil sebagai teks biasa |

---

## 9. Catatan

- Angka dan kode dokumen di mockup adalah **contoh**, bukan data produksi.
- Endpoint `completion-summary` untuk Failed Ship **belum ada** — masih usulan (TO-BE). Endpoint yang sudah ada baru untuk `omnichannel/picking-list`.
- Referensi requirement: `olshoperp/docs/qa-docs/supplychain-failed-ship/requirement.md` §2.4 (approval & konsekuensi stok), §3.2 (tahap transfer internal), §3.4 (konsekuensi per jenis qty), §3.5 (jurnal lost), §3.6 (peta relasi menu), §4.2–4.3 (validasi approve & settlement), §6 (tracking prepared/processed).
