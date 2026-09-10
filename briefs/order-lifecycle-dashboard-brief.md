# Brief — Order Lifecycle Dashboard (Sales Platform &amp; Sales Order General)

**Menu terdampak:** Dev - Sales Platform (`omnichannel/sales-order/edit/{id}`) dan Dev - Sales Order / General (`businessdevelopment/sales-order-general/edit/{id}`)
**Status dokumen:** TO-BE (usulan requirement) + AS-IS (verifikasi codebase `olshoperp-frontend` dan qa-docs per 09-09-2026)
**Mockup:** https://claude.ai/code/artifact/022e8aa9-f1aa-4446-a09a-8a4ab48041b2 (4 screen: Entry Point · Platform Order · General Order · Mapping)
**Acuan pola UI:** Completion Summary Failed Ship — https://claude.ai/code/artifact/3f60e9e8-b275-45b0-b568-227c627050f0
**Dibuat:** 09-09-2026 · Author: QA - Yemima

---

## 1. Tujuan

Satu order menyentuh belasan menu: sync platform, approval, wave, picking, checking, packing, collect, delivery order, transfer ke 3PL, failed ship, sales return, settlement, sales invoice, outbound, account receive. Hari ini tidak ada satu layar pun yang bisa menjawab pertanyaan operasional paling sering:

- order ini sekarang sampai mana, dan **kenapa berhenti** di situ;
- dokumen apa saja yang lahir dari order ini, dan berapa nilainya;
- dari nilai order, **berapa yang akhirnya jadi uang masuk** dan ke mana sisanya hilang.

**Order Lifecycle** menjawab ketiganya dalam satu slideover di halaman order, tanpa user harus membuka menu lain satu per satu.

### Bukan pengganti Order Processing Trace

| | Order Processing Trace (`supplychain/order-processing-trace`, ETM-15713) | Order Lifecycle (dokumen ini) |
|---|---|---|
| POV | 1 baris = 1 SO, banyak order sekaligus | 1 panel = 1 order |
| Isi | Kode ref + tanggal per stage (Skip Wave, Picking, Checking, Packing, DO, FS, Outbound) | Timeline kronologis + nilai uang + penyebab tertahan |
| Fungsi | Report & export lintas order | Drill-down investigasi satu order |
| Relasi | Trx Code di grid → buka SO → panel Order Lifecycle | Balik ke OPT untuk lihat order lain |

Keduanya saling melengkapi, **jangan digabung**.

---

## 2. Penamaan

**Nama final: `Order Lifecycle`.**

| Kandidat | Kenapa tidak dipakai |
|---|---|
| Completion Summary | Mengesankan proses sudah selesai; order harus bisa dilihat saat masih jalan |
| Order Trace | Bentrok dengan menu Order Processing Trace |
| Order Summary / Order Journey | Terlalu generik / tidak konsisten dengan istilah ERP lain |

Di dalam panel, blok ringkasan kartu diberi judul **"Where This Order Stands"** — bukan label teknis, karena persis itu pertanyaan yang dijawab.

---

## 3. Entry point &amp; kondisi kemunculan

### 3.1 Letak

Item baru **paling atas** di section nav kanan pada form order, berdampingan dengan item yang sudah ada:

| Menu | File form | Item nav existing | Item baru |
|---|---|---|---|
| Sales Platform | `src/pages/Omni/SalesOrder/Form.vue` | BasicInformation, SalesOrderDetail, OtherCost, OtherDiscount, ApprovalLog, AuditLog, Histories, APIDataLog | **OrderLifecycle** |
| Sales Order General | `src/pages/BusinessDevelopment/SalesOrderGeneral/Form.vue` | BasicInformation, SalesOrderDetail, OtherCost, OtherDiscount, ApprovalLog, AuditLog, Histories | **OrderLifecycle** |

Dibuka sebagai `Slideover size="xl"` (pola sama dengan Completion Summary Failed Ship dan `OrderHistory.vue`). Panel **read-only**, hanya ada tombol **Print** dan **Done**.

### 3.2 Kondisi kemunculan — beda dari Failed Ship

**Tidak ada gate status.** Failed Ship butuh `approved` karena panelnya merangkum hasil approve; Order Lifecycle justru dipakai saat order masih jalan.

| Status order | Panel bisa dibuka? | Yang ditampilkan |
|---|---|---|
| draft | ✅ | Fase intake saja; fase lain dirender sebagai *not started* |
| open | ✅ | Intake + approval pending |
| approved / processed | ✅ | Kondisi normal, semua fase terisi progresif |
| closed | ✅ | Lengkap, semua fase selesai |
| rejected | ✅ | Banner terminal state: order ditolak, tanggal + alasan |
| void | ✅ | Banner terminal state: order divoid; dokumen turunan yang sudah terbentuk tetap ditampilkan |

**Aturan:** tombol selalu ada selama order-nya ada. Yang berubah hanya isi panel.

### 3.3 Permission &amp; hyperlink

- Panel ikut permission read menu order-nya.
- **Semua kode dokumen wajib clickable** ke menu asalnya (lihat §8). Kalau user tidak punya permission menu tujuan, kode dirender sebagai teks biasa (bukan link mati, bukan disembunyikan).
- Nilai uang tetap tampil apa adanya — tidak ada masking khusus di panel ini.

---

## 4. Struktur panel

Urutan section (sama untuk kedua tipe order, blok platform-only otomatis hilang di general):

1. Header identitas + status rail
2. Summary count — strip Quantity dan strip Money
3. Order Lifecycle Timeline
4. Related Transactions
5. Marketplace Connection (platform) / Customer &amp; Terms (general)
6. Money Trail
7. What Held This Order Up

### 4.1 Header + status rail

| Elemen | Platform | General |
|---|---|---|
| Judul | "Order lifecycle" + chip **Platform order** | "Order lifecycle" + chip **General order** |
| Baris identitas | Trx Code, Platform Order ID, Booking Number, Store, Buyer | Trx Code, Customer PO, Customer, Sales person |
| Baris tanggal | Trx Date + Platform Date, SKU count, qty | Trx Date, payment term, requested delivery, SKU count, qty |
| Status pill | Internal · **Platform** · **Booking** · Failed ship · Invoice | Internal · **Approval level** · **Delivery** · Invoice · **Payment due** |

Aturan tanggal mengikuti Order Processing Trace: order **general** → Trx Date = `transaction_date` SO, Platform Date `-`; order **platform** → Trx Date = tanggal order masuk sistem (`created_at`), Platform Date = tanggal transaksi di marketplace.

### 4.2 Summary count — dibaca kiri ke kanan

Prinsip (revisi dari review): **angka total di paling kiri**, lalu tiap kartu berikutnya adalah operasi terhadap kartu sebelumnya, dengan operator `−` dan `=` dirender di antara kartu. User membaca sebagai satu kalimat hitung, bukan sebagai kumpulan angka lepas.

**Strip Quantity — platform (contoh mockup):**

```
Total Order Qty 20  −  Failed ship 8  =  Delivered & invoiced 12  −  Returned by buyer 3  =  Kept by buyer 9
```

**Strip Money — platform:**

```
Total Order Amount 1.268.000  −  Failed ship value 564.000  =  Invoiced 704.000
  −  Platform fee 70.400  =  Received in bank 633.600  −  Refunded 219.000  =  Money kept 414.600
```

**Strip Quantity — general:**

```
Total Order Qty 120  −  Delivered 80  −  Returned 0  =  Still to deliver 40
```

**Strip Money — general:**

```
Total Order Amount 7.050.000  −  Not yet invoiced 2.440.000  =  Invoiced 4.610.000
  −  Paid by customer 3.000.000  =  Outstanding receivable 1.610.000
```

Kartu terakhir selalu kesimpulan: uang yang benar-benar tinggal (platform) atau sisa tagihan (general).

---

## 5. Sumber data per section

Semua sumber di bawah sudah ada di sistem; yang baru hanya **agregasinya** dalam satu endpoint.

### 5.1 Header, status rail, summary count

| Field | Sumber |
|---|---|
| Trx Code, Platform Order ID, Booking Number, Store, Buyer, tanggal | Header order (`omni_sales_orders`), sama dengan yang dipakai HeaderBasicInformation |
| Customer, Customer PO, sales person, payment term, requested delivery | Header order general |
| Internal status | `transaction_status` (draft/open/approved/rejected/closed/void) |
| Platform status | Status order dari marketplace hasil sync |
| Booking status | `booking_sn` + booking status (MATCHED / belum) |
| Approval level | Log approval (`DatalistLogApproval.vue` — general &amp; platform) |
| Total Order Qty / Amount | `omni_sales_order_details` (qty &amp; harga) + Other Cost / Other Discount header |
| Failed ship qty | `processed_to_failed_ship_quantity` (approved) dan `prepared_to_failed_ship_quantity` (belum approved), accessor `failedShippedQuantity` |
| Delivered / outbound qty | Dokumen Outbound (`OT…`) per order |
| Returned qty | Sales Return per order |
| Invoiced / paid / outstanding | Sales Invoice + Account Receive (§5.5) |

### 5.2 Timeline — fase intake (platform only)

| Baris timeline | Sumber |
|---|---|
| Booking received | Event webhook booking (`booking_sn`), tercatat di API Data Log / histories order |
| Buyer paid | Perubahan status platform UNPAID → PAID (webhook / sync update) |
| Order number matched | Saat `platform_order_id` terisi pada SO booking (booking status MATCHED) |
| Order recorded in OlshopERP | `created_at` header SO + entry Log Data batch sync (Action `Sync Order`) |
| Order held (error flag) | Error flag order + waktu muncul &amp; hilangnya, dari histories order |
| Order approved | Log approval / auto approve |

Untuk **general**, fase ini diganti: Order created (manual/import) → Submitted for approval → Approved level 1..n, sumbernya histories + log approval.

### 5.3 Timeline — fase warehouse &amp; shipping (dua tipe order)

Semua tahap fulfillment tercatat sebagai transfer internal di `scm_stock_mutations` dengan `transaction_reference` = SO, dibedakan `process_type`:

| Baris timeline | `process_type` | Prefix | Pergerakan |
|---|---|---|---|
| Assigned to wave | `in wave` | TFI (virtual) | Rack → Rack-Waves |
| Picking complete | `picking` | **PL** | Rack → Outrack |
| Checking complete | `checking` | **CL** | Outrack → Checking (virtual) |
| Packing complete | `packing` | **PK** | Checking → Packing (virtual) |
| Collected | `shipping` | **SL** | Packing → Collected (virtual) |
| Delivery order approved | dokumen Delivery Order | **DO** | — |
| Stock moved to 3PL / delivered | `shipping do` | **TFI** | Collected → WH 3PL (platform) atau serah terima ke customer (general) |

Pelaku tiap tahap (picked by / checked by / packed by / approved by) diambil dari dokumen masing-masing.

Offset waktu antar tahap fulfillment (AS-IS, dipakai di contoh mockup): Picking = SO date + 10 menit; Checking = Picking + 10 detik; Packing = Checking + 10 detik; Collected = Packing + 10 detik; Shipped DO = Collected + 10 detik.

### 5.4 Timeline — fase failed ship &amp; return

| Baris | Sumber |
|---|---|
| Failed ship created / approved | Header FS: `scm_stock_mutations` `process_type = failed ship`, prefix **FS** |
| Dokumen turunan FS | TFI (restock) · SD (`process_type = lost`) · TFS (`process_type = scrap`) — detail lengkap ada di brief Failed Ship |
| Partial FS | Qty FS < qty order → sisa qty tetap di 3PL dan lanjut ke settlement (1 SO tetap **1 dokumen FS**, partial per SKU bukan multi dokumen) |
| Return request (platform) | Status return dari marketplace |
| Sales return received | Dokumen Sales Return (SCM), qty di-cap ke qty outbound terakhir |
| Credit note | Credit note atas sales return |

### 5.5 Timeline — fase invoice &amp; payment

| Baris | Platform | General |
|---|---|---|
| Pemicu invoice | Upload **Instant Settlement** (batch), match by `platform_order_id`; diblokir selama FS masih `open`; settlement date harus > FS date | **Approve Outbound** (`OT…`) otomatis membuat Customer Invoice + jurnal |
| Sales Invoice | Qty netto per baris SKU (`invoicable_quantity_in_base_unit`), baris qty 0 di-skip | Qty yang benar-benar dikirim pada DO/outbound tersebut |
| Outbound | Qty = stok fisik tersisa di WH 3PL | Qty pada delivery order tersebut |
| Other cost / discount | Dari **Platform Account Mapping** pada file settlement | Dari header order (Other Cost / Other Discount) |
| Payout platform | Escrow release dari marketplace, selisih = fee platform | — |
| Account Receive | Import AR multi-sheet: Sheet 1 Bank Mutation, Sheet 2 detail SI yang dilunasi, Sheet 3 adjustment (over/underpayment) | Sama |
| Adjustment | Underpayment/overpayment; referensi **debit note** (kekurangan, mis. fee platform) atau **credit note** (kelebihan / retur) | Sama |

### 5.6 Marketplace Connection (platform only)

| Kartu | Sumber | Catatan penulisan |
|---|---|---|
| Last update from marketplace | Entry terakhir sync/webhook untuk order ini | Tulis sebagai kalimat: "09-09 13:20 — return request received", **bukan** counter Created/Updated/Skipped/Failed |
| How this order stays updated | Konfigurasi sync store | Kalimat awam. Nama job (`sales-order:sync-create` / `sync-update`), interval cron, dan lookback **tidak ditampilkan** — itu tetap di Log Data |
| Order holds | Error flag order + waktu muncul/hilang | Pakai label ramah (§7) |
| Booking | `booking_sn` + status MATCHED | Sebutkan bahwa tidak ada order duplikat yang dibuat |
| Shipment tracking | Nomor resi + update status kurir | — |
| Return on the marketplace | Status persetujuan retur + tanggal refund | — |

Kartu **Shortcuts** yang sempat ada dihapus — sudah ada di section nav order.

### 5.7 Customer &amp; Terms (general only)

| Kartu | Sumber |
|---|---|
| Customer | Header order: customer, customer PO |
| Ordered through | Cara order dibuat: manual / import Excel / clone, + user pembuat |
| Delivery commitment | Requested delivery date vs tanggal terima aktual, plus estimasi pengiriman berikutnya |
| Payment term | Term (mis. Net 30) + due date invoice + berapa yang sudah dibayar |
| Pricing agreement | Price list / kontrak + Other Cost &amp; Other Discount header |
| Returns | Ada/tidaknya sales return + batas qty retur (qty outbound) |

### 5.8 Money Trail

Baris-barisnya adalah turunan strip Money, ditampilkan vertikal dengan nilai rata kanan supaya bisa dibaca seperti kertas rekap:

| Baris | Platform | General |
|---|---|---|
| Order amount | ✅ | ✅ |
| − Failed ship value | ✅ | ✅ (kalau ada FS) |
| − Not yet invoiced | — | ✅ (qty belum dikirim) |
| = Invoiceable value | ✅ | ✅ |
| Sales invoice | ✅ | ✅ |
| − Platform fee (debit note) | ✅ | — |
| + Received in bank (AR) | ✅ | ✅ |
| − Refund retur (credit note) | ✅ (kalau ada) | ✅ (kalau ada) |
| = Money kept / Outstanding receivable | ✅ | ✅ |

### 5.9 What Held This Order Up

Bukan sekadar daftar error — ini jawaban atas "kenapa order ini lama?". Tiap item: judul dari sisi order, penjelasan singkat, dan status (**released + waktu** atau **open + next action**).

Sumber: riwayat error flag, status booking, status FS terhadap settlement, status pembayaran invoice, dan ketersediaan stok (general: qty yang belum bisa direservasi).

---

## 6. Platform vs General — matriks lengkap

| Section / elemen | Platform | General |
|---|---|---|
| Status pill Platform &amp; Booking | ✅ | ❌ |
| Status pill Approval level, Delivery, Payment due | ❌ | ✅ |
| Fase timeline "Order arrives from the marketplace" | ✅ | ❌ diganti "Order created &amp; approved" |
| Approval berjenjang di timeline | jarang (mostly auto approve) | ✅ wajib, per level + catatan approver |
| Error flag → Order holds | ✅ | sebagian (paritas TO-BE, mis. Below Benchmark COGS) |
| Booking axis (anti-duplikat Shopee) | ✅ | ❌ |
| Tracking &amp; kurir | ✅ | ✅ tapi berbentuk serah terima / armada sendiri |
| Pemicu invoice | Upload settlement | Approve outbound |
| Sumber other cost / discount | Platform Account Mapping | Header order |
| Platform fee di money trail | ✅ | ❌ |
| Partial delivery beberapa DO | jarang | ✅ umum, jadi ada "not yet invoiced" |
| Panel ke-5 | Marketplace Connection | Customer &amp; Terms |
| Failed ship, sales return, AR, credit/debit note | ✅ | ✅ |

**Aturan render:** blok yang tidak berlaku **disembunyikan**, bukan ditampilkan kosong.

---

## 7. Aturan penulisan teks (wajib)

Panel ini dibaca operator gudang, CS, dan finance — bukan developer.

| Jangan | Pakai |
|---|---|
| "Error flag `stock-error` raised" | **"Order held: stock not available"** — "marked as unprocessed order because the process warehouse was short by 4 pcs" |
| "`bind-error`" | "Order held: product not linked to the store yet" |
| "`coa-error`" | "Order held: product accounting setup incomplete" |
| "`price-error` / `unknown-price-error`" | "Order held: price not received from the marketplace" |
| "`cogs-error`" | "Order held: selling price below benchmark COGS — needs manual approval" |
| "`warehouse-error`" | "Order held: process warehouse not set for this store" |
| "Sync job `sales-order:sync-update`, lookback 10 days" | "The store is re-checked automatically every hour in case a notification is missed" |
| "Created 0 · Updated 1 · Skipped 0 · Failed 0" | "Order data has not changed since 06-09" |
| "process_type = failed ship" | "Failed ship approved — 8 of 20 pcs came back" |

Label hold **mengikuti wording tooltip error flag yang sudah dikenal operator**, jangan bikin istilah baru.

---

## 8. Peta hyperlink dokumen

| Prefix | Dokumen | Menu tujuan |
|---|---|---|
| `WV` | Wave | Waves Management / Unassign Wave |
| `PL` | Picking | Picking Process |
| `CL` | Checking | Checking Process |
| `PK` | Packing | Packing Process |
| `SL` | Collected | Transfer Internal (Show Virtual) |
| `DO` | Delivery Order | Delivery Order |
| `TFI` | Transfer internal (shipped ke 3PL / restock FS) | Transfer Internal |
| `FS` | Failed Ship | Failed Ship |
| `SD` | Stock Deduction (lost) | Adjustment Deduction / Stock Deduction |
| `TFS` | Transfer Scrap | Transfer Scrap |
| `SR` | Sales Return | Sales Return (SCM) |
| `OT` | Outbound | Mutation Outbound |
| `STL` | Batch settlement | Settlement Upload |
| `SI` | Sales Invoice | Customer Invoice |
| `AR` | Account Receive | Account Receive |
| `BM` | Bank mutation | Cash &amp; Bank / Account Receive |
| `CN` / `DN` | Credit Note / Debit Note | Credit Note / Debit Note |

Backend mengirim pasangan `code` + `url` supaya frontend tidak perlu menyusun route sendiri.

---

## 9. Endpoint &amp; payload

| Endpoint | Menu |
|---|---|
| `GET omnichannel/sales-order/{id}/lifecycle` | Sales Platform |
| `GET businessdevelopment/sales-order/{id}/lifecycle` | Sales Order General |
| `GET .../{id}/print-lifecycle` | Versi cetak (pola sama dengan print completion summary) |

Satu bentuk payload, dibedakan `order_type`:

```json
{
  "order_type": "platform",
  "trx_code": "SO-2608-01187",
  "platform_order_id": "250831ABCD9KLM",
  "booking_number": "24083000ABCD",
  "store": "Olshop Official Store - Shopee ID",
  "buyer_name": "Rani Kusuma",
  "trx_date": "31-08-2026 09:12:04",
  "platform_date": "31-08-2026 09:08:40",
  "status": {
    "internal": "Processed", "platform": "Partially returned", "booking": "Matched",
    "failed_ship": "Partial - 8 pcs", "invoice": "Paid"
  },
  "quantity_flow": [
    { "label": "Total Order Qty", "value": 20, "op": null,    "role": "total" },
    { "label": "Failed ship",     "value": 8,  "op": "minus",  "ref": "FS-2609-00042", "url": "/supplychain/failed-ship/edit/44540" },
    { "label": "Delivered & invoiced", "value": 12, "op": "equals", "ref": "OT-2609-00402" },
    { "label": "Returned by buyer",    "value": 3,  "op": "minus",  "ref": "SR-2609-00061" },
    { "label": "Kept by buyer",        "value": 9,  "op": "equals", "role": "total" }
  ],
  "money_flow": [
    { "label": "Total Order Amount", "value": 1268000, "op": null,     "role": "total" },
    { "label": "Failed ship value",  "value": 564000,  "op": "minus",  "ref": "FS-2609-00042" },
    { "label": "Invoiced",           "value": 704000,  "op": "equals", "ref": "SI-2609-00519" },
    { "label": "Platform fee",       "value": 70400,   "op": "minus",  "ref": "DN-2609-00087" },
    { "label": "Received in bank",   "value": 633600,  "op": "equals", "ref": "AR-2609-00233" },
    { "label": "Refunded to buyer",  "value": 219000,  "op": "minus",  "ref": "CN-2609-00112" },
    { "label": "Money kept",         "value": 414600,  "op": "equals", "role": "total" }
  ],
  "timeline": [
    { "phase": "intake", "source": "platform", "stage": "Buyer paid",
      "at": "31-08-2026 09:08:40", "amount": 1268000 },
    { "phase": "intake", "source": "erp", "stage": "Order held: stock not available",
      "at": "31-08-2026 09:11:30", "released_at": "31-08-2026 09:11:55",
      "hold_label": "Stock not available" },
    { "phase": "warehouse", "source": "erp", "stage": "Picking complete",
      "code": "PL-2608-00921", "url": "/omnichannel/picking-process/edit/921",
      "at": "31-08-2026 09:22:04", "from": "Rack R.10.03, R.11.08", "to": "Outrack",
      "actor": "Anisa Rahmawati" },
    { "phase": "failed_ship", "source": "erp", "stage": "Failed ship approved",
      "code": "FS-2609-00042", "url": "...", "at": "05-09-2026 14:22:10", "quantity": 8 },
    { "phase": "return", "source": "erp", "stage": "Credit note issued",
      "code": "CN-2609-00112", "at": "10-09-2026 10:45:20", "amount": 219000 },
    { "phase": "ahead", "source": "erp", "stage": "Second delivery - 40 pcs",
      "expected_at": "25-09-2026", "state": "pending" }
  ],
  "related_transactions": {
    "approval":  [ { "level": 1, "actor": "Intan Prameswari", "at": "12-09-2026 14:20:33", "note": "..." } ],
    "warehouse": [ { "type": "Picking", "code": "PL-2608-00921", "url": "...", "quantity": 20, "at": "..." } ],
    "exception": [
      { "type": "Failed Ship", "code": "FS-2609-00042", "url": "...", "quantity": 8, "partial": true,
        "children": ["TFI-2609-00311", "SD-2609-00088", "TFS-2609-00057"] },
      { "type": "Sales Return", "code": "SR-2609-00061", "url": "...", "quantity": 3,
        "amount": 219000, "credit_note": "CN-2609-00112" }
    ],
    "financial": [
      { "type": "Sales Invoice", "code": "SI-2609-00519", "url": "...", "amount": 704000,
        "created_by": "settlement",          // atau "outbound" untuk general
        "breakdown": {
          "lines": [
            { "sku": "SKU-BTL-500", "qty": 6, "price": 78000, "amount": 468000 },
            { "sku": "SKU-CUP-CRM", "qty": 4, "price": 45000, "amount": 180000 },
            { "sku": "SKU-STR-MTL", "qty": 2, "price": 63000, "amount": 126000 }
          ],
          "product_value": 774000,
          "other_discount": [ { "label": "Platform voucher", "amount": -88000, "source": "settlement_mapping" } ],
          "other_cost":     [ { "label": "Shipping charged to buyer", "amount": 18000, "source": "settlement_mapping" } ],
          "total": 704000
        } },
      { "type": "Account Receive", "code": "AR-2609-00233", "url": "...", "received": 633600,
        "bank_mutation": "BM-2609-0091",
        "adjustments": [
          { "kind": "underpayment",  "label": "Platform fee", "amount": -70400,
            "ref": "DN-2609-00087", "ref_type": "debit_note",  "url": "..." },
          { "kind": "return_credit", "label": "Return after settlement", "amount": -219000,
            "ref": "CN-2609-00112", "ref_type": "credit_note", "url": "..." }
        ],
        "outstanding": 0, "due_date": null }
    ]
  },
  "marketplace": {
    "last_update_at": "09-09-2026 13:20:05", "last_update_label": "Return request received",
    "holds": [ { "label": "Stock not available", "held_at": "31-08-2026 09:11:30",
                 "released_at": "31-08-2026 09:11:55" } ],
    "booking_state": "Matched",
    "tracking_number": "JP0038117295",
    "tracking_label": "1 colli delivered, 1 colli returned to sender",
    "return_state": "Approved by marketplace - refund completed"
  },
  "customer_terms": null,                    // terisi untuk order general, marketplace null
  "holds": [
    { "label": "Waiting for the second approval level", "state": "released",
      "at": "12-09-2026 09:05:00", "released_at": "13-09-2026 09:02:10" },
    { "label": "40 pcs still owed to the customer", "state": "open",
      "next_action": "Waiting for inbound expected 25-09", "amount_blocked": 2440000 }
  ]
}
```

Catatan implementasi:

- `hold_label` dikirim backend dalam bentuk **label ramah**, bukan kode error flag — supaya wording konsisten di semua channel (panel, print, ekspor nanti).
- Baris timeline dengan `state: "pending"` dirender bergaris putus-putus (fase "Still ahead").
- `op` (`minus` / `equals`) yang menentukan operator di antara kartu summary — frontend tidak menghitung sendiri.

---

## 10. Edge case

| Kasus | Ekspektasi panel |
|---|---|
| Order draft, belum apa-apa | Hanya fase intake; strip qty menampilkan Total Order Qty dan sisanya 0; money trail hanya baris Order amount |
| Order platform booking belum MATCHED | Booking pill "Unmatched"; hold open "Waiting for the marketplace to send the order number"; Platform Order ID `-` |
| Order void / rejected | Banner terminal state di header; dokumen turunan yang sudah terlanjur ada tetap ditampilkan apa adanya |
| Failed ship penuh (qty FS = qty order) | Strip money: invoiceable 0; blok settlement menjelaskan Sales Invoice only (Other Cost &amp; Other Discount saja) — lihat brief Failed Ship §4 |
| Failed ship partial | Sisa qty lanjut ke settlement; timeline menampilkan keduanya |
| Tidak ada failed ship | Fase failed ship tidak dirender sama sekali |
| Retur setelah settlement | Fase "Return after settlement" + credit note + baris refund di money trail; qty retur di-cap ke qty outbound |
| Pembayaran parsial (general) | Outstanding receivable + due date; hold open "Invoice not fully paid" |
| Overpayment | Adjustment positif di kartu AR, kelebihan ditahan terhadap credit note |
| Underpayment | Adjustment negatif + referensi debit note; invoice belum bisa ditutup sebelum adjustment ada |
| Multi delivery order (general) | Baris DO/outbound/invoice lebih dari satu; strip qty memakai akumulasi |
| Order tanpa dokumen sama sekali | Related Transactions menampilkan empty state per grup, bukan grup kosong tanpa keterangan |

---

## 11. Frontend — file &amp; komponen

| File | Perubahan |
|---|---|
| `src/pages/Omni/SalesOrder/OrderLifecycle.vue` | **Baru** — komponen panel, props `summary`, `orderType`, `isSidebar` |
| `src/pages/Omni/SalesOrder/Form.vue` | Item nav `OrderLifecycle` + state `lifecycleOpen` + `fetchLifecycle(id)` + `Slideover size="xl"` |
| `src/pages/BusinessDevelopment/SalesOrderGeneral/Form.vue` | Idem, memakai komponen yang sama dengan `orderType = 'general'` |
| `src/components/project/.../OrderMovementTimeline.vue` | **Baru** — diangkat dari Completion Summary Failed Ship supaya dua menu tidak drift |
| `src/components/project/.../DocumentTrailCard.vue` | **Baru** — kartu dokumen expandable, dipakai FS dan Order Lifecycle |

Token &amp; pola visual mengikuti konvensi existing: panel header bar abu, kartu ringkasan, badge status, slideover xl, font Roboto.

---

## 12. QA test notes

| # | Skenario | Ekspektasi |
|---|---|---|
| 1 | Buka panel di order draft | Tampil, hanya fase intake, tidak error |
| 2 | Buka panel di order void / rejected | Tampil dengan banner terminal state |
| 3 | Order platform vs general | Blok platform-only hilang total di general, dan sebaliknya — bukan kosong |
| 4 | Strip qty | Total di kartu paling kiri; hasil tiap operasi sama dengan kartu berikutnya |
| 5 | Strip money | Total Order Amount − FS value − fee − refund konsisten dengan money trail; tidak ada selisih pembulatan |
| 6 | Money trail vs kartu | Angka identik antara strip dan money trail |
| 7 | Timeline urut | Kronologis naik; event platform dan ERP tercampur sesuai waktunya (payment sebelum matched, dst.) |
| 8 | Hyperlink | Semua kode dokumen membuka menu yang benar; tanpa permission → teks biasa, bukan link mati |
| 9 | Wording | Tidak ada kode error flag / nama job / counter teknis muncul di panel |
| 10 | Partial failed ship | Qty FS &lt; qty order; sisa qty muncul sebagai delivered/invoiced |
| 11 | Retur setelah settlement | Credit note tampil di kartu AR dan money trail; qty retur ≤ qty outbound |
| 12 | Under/overpayment | Nilai adjustment + referensi debit/credit note tampil di kartu Account Receive |
| 13 | Sales invoice breakdown | Total baris SKU + other cost − other discount = nilai invoice |
| 14 | Holds | Item released menampilkan waktu lepas; item open menampilkan next action |
| 15 | Order tanpa FS/retur | Fase terkait tidak dirender; tidak ada kartu 0 yang menyesatkan |
| 16 | Print | Versi cetak berisi angka identik dengan panel |
| 17 | Cross-link Order Processing Trace | Trx Code di grid OPT membuka order, panel bisa dibuka dari sana |

---

## 13. Urutan pengerjaan yang disarankan

1. **Fase 1 — Platform**: endpoint `lifecycle` + komponen panel + Marketplace Connection. Order platform paling sering ditanyakan CS dan paling banyak titik gagalnya.
2. **Fase 2 — General**: mode `general` (Customer &amp; Terms, approval berjenjang, partial delivery, outstanding AR) memakai komponen yang sama.
3. **Fase 3 — Refactor bersama**: angkat timeline &amp; kartu dokumen jadi komponen bersama, lalu pakai ulang di Completion Summary Failed Ship.
4. **Fase 4 — Print &amp; cross-link**: versi cetak + link dua arah dengan Order Processing Trace.

---

## 14. Catatan

- Semua angka, kode dokumen, dan nama orang di mockup adalah **contoh**, bukan data produksi.
- Endpoint `lifecycle` **belum ada** — masih TO-BE. Yang sudah ada dan bisa jadi sumber: `omnichannel/sales-order/{id}/histories` (dipakai `OrderHistory.vue`), API Data Log per order, Log Data batch sync, log approval, dan dokumen-dokumen turunan di menunya masing-masing.
- Referensi requirement: qa-docs `omni-sales-platform` (§3 siklus status &amp; booking, §5.2 error flag, §5.3–5.4 log &amp; sync, §7 relasi menu), `sales-order-general` (§3 siklus status, §6.5–6.7 fulfillment, finance, dampak stok), `order-processing-trace` (§2–4 kolom &amp; kardinalitas), `supplychain-failed-ship` (§3.4–3.6), `accounting-settlement-upload`, dan `ETM-Account-Receive-Req.md` (§3 struktur sheet, §4 over/underpayment, §7 smart settlement adjustment).
