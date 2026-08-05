---
doc_type: requirement
menu: supplychain-purchase-order
menu_name: "Purchase Order"
version: 2.8
last_updated: 2026-08-05
owner: QA - Yemima
status: review
aliases: [PO requirement, purchase order docs, pembelian, PO validation]
---

# Purchase Order — Requirement Documentation

**Modul:** Supply Chain Management (SCM) / Procurement  
**Prefix transaksi:** `PO-`  
**Audience:** PM, Operations, QA  
**Status:** AS-IS + Rounding SoT **final** + **Import VAT columns TO-BE locked** (5 Agu 2026)

**UI route:** `/supplychain/purchase-order`  
**PM source:** `purchase_order_requirement.md` v1.0 (2026-07-05); Import VAT brief locked 5 Agu 2026  
**Rounding SoT:** [../_meta/dpp-vat-rounding-calculation.md](../_meta/dpp-vat-rounding-calculation.md) (**27 Jul 2026** — known behavior UI + resolusi export 4dp)

---

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-06-19 | QA - Yemima | Initial draft (AS-IS codebase auto-analysis) |
| 2.0 | 2026-07-05 | QA - Yemima | Full rewrite: merge PM requirement v1.0, import/export/print, pricing formulas, UI buttons, gaps §19–§20 |
| 2.1 | 2026-07-05 | QA - Yemima | GAP clarifications; import §12 expanded; §21 Pending Items Major |
| 2.2 | 2026-07-10 | QA - Yemima | Clarifikasi: COA Other Cost/Disc di PO = default; di PI bisa di-override; koreksi posisi jurnal PI |
| 2.3 | 2026-07-17 | QA - Yemima | Compliance qa-docs-standard: Prasyarat/FAQ; trim import teknis ke technical; hapus §20 DEV (rumah technical); stateDiagram |
| 2.4 | 2026-07-22 | QA - Yemima | DPP/VAT precision: detail & Totals memakai truncate 4dp × qty (`ETM-15313`); AC konsistensi; GAP-PO-08 sort residual |
| 2.5 | 2026-07-23 | QA - Yemima | SoT rounding DPP/VAT (variable, tie ±1 sen, regresi qty non-kelipatan); rantai PO→Inbound→PI jurnal |
| 2.6 | 2026-07-27 | QA - Yemima | Rounding SoT **final**: selisih 1 sen = known behavior UI only; Total/Net/Journal exact 4dp; resolusi export DPP/VAT 4dp (GAP-PO-10) |
| 2.7 | 2026-07-27 | QA - Yemima | Contoh Case 4/5 siap Lingo/UG (SF-PRICE-01); pointer di §9.2 |
| 2.8 | 2026-08-05 | QA - Yemima | Import Detail: kolom VAT / VAT Code / VAT Type (TO-BE locked); partial success per-row; align tax Allocate Full / bulk Use; GAP-PO-11 |

---

## 1. Ringkasan Eksekutif

**Purchase Order (PO)** adalah dokumen pembelian formal ke **Supplier**. PO bisa **With PR** (berbasis Purchase Requisition outstanding) atau **Without PR** (produk langsung dari System Product). Setelah PO di-approve, barang diterima via **Purchase Inbound (GRN)**.

| Kebutuhan Bisnis | Bagaimana PO Menjawab |
|------------------|----------------------|
| Traceability PR → PO → Inbound | Field `prepared_to_po_quantity` / `processed_to_po_quantity` di PR; `processed_to_grn_quantity` di PO detail |
| Multi-currency | Currency + Exchange Rate per transaksi |
| Kontrol partial receiving | **Complete** (auto full inbound) vs **Closed** (manual stop sisa qty) |
| Harga & pajak per baris | Unit price, discount %, VAT include/exclude, DPP per pivot tax |
| Biaya/diskon header | Other Cost / Other Discount → grand total + jurnal Purchase Invoice |

### 1.1 Dua tipe PO

| Tipe | `with_pr` | Sumber detail |
|------|-----------|---------------|
| **Without PR** | `0` | System Product aktif (Single/Variant, punya COA group) |
| **With PR** | `1` | Baris PR outstanding (status approved/processed, sisa qty) |

---


## 1.2 Prasyarat

| Prasyarat | Sumber | Catatan |
|-----------|--------|---------|
| Supplier accounting lengkap | General Company | Select2 filter — tidak 100% → tidak muncul |
| With PR: PR approved/processed + sisa qty | Purchase Requisition | Tanggal PR sebelum tanggal PO |
| Without PR: produk aktif + COA group | System Product | Bukan bundle/random |
| Currency + exchange rate | Master Currency | Rate default 1; foreign diubah manual |
| Fiscal period terbuka | Accounting period | Validasi store/approve |

## 2. Siklus Status Transaksi

### 2.1 Diagram (AS-IS)

```mermaid
stateDiagram-v2
    [*] --> open: Create
    open --> draft: User pilih Draft
    draft --> open: User pilih Open
    open --> approved: Approve
    open --> rejected: Reject
    rejected --> draft: Edit + Save
    approved --> processed: Inbound partial
    processed --> complete: Full inbound
    processed --> closed: User Closed
    approved --> void: Void (no GRN)
    open --> [*]: Delete
    draft --> [*]: Delete
    rejected --> [*]: Delete
    complete --> [*]
    closed --> [*]
    void --> [*]
```

### 2.2 Definisi status

| Status | Definisi | Bisa edit? |
|--------|----------|------------|
| **draft** | User switch manual dari Open; atau setelah reject + save | Ya |
| **open** | Default setelah create; siap approve | Ya |
| **approved** | Sudah disetujui (single-level) | Tidak |
| **rejected** | Ditolak approver | Ya |
| **processed** | Sebagian/seluruh qty sudah masuk Purchase Inbound | Tidak |
| **complete** | **Otomatis** — semua qty PO sudah diterima inbound approved | Tidak |
| **closed** | **Manual** — user close dari **processed** (sisa qty tidak dilanjutkan inbound) | Tidak |
| **void** | Dibatalkan dari **approved** (bukan draft/open) | Tidak |

### 2.3 PO selesai — dua jalur (tidak bisa inbound baru)

| # | Jalur | Trigger | Status UI |
|---|-------|---------|-----------|
| 1 | **Otomatis (system)** | Σ `order_quantity_in_base_unit` = Σ `processed_to_grn_quantity` | **`complete`** |
| 2 | **Manual (end user)** | Klik **Closed** saat PO **`processed`** | **`closed`** |

Keduanya: sisa qty tidak bisa dibuatkan Purchase Inbound baru; header & detail read-only.

### 2.3.1 Tujuan tombol **Closed** (codebase)

Tombol **Closed** muncul saat PO status **`processed`** — artinya **sudah ada** aktivitas Purchase Inbound (sebagian qty sudah diterima), tapi **belum** full (`complete`).

| Aspek | **Complete** (otomatis) | **Closed** (manual) |
|-------|-------------------------|---------------------|
| Trigger | Semua qty PO sudah inbound approved | User klik Closed dari **processed** |
| Sisa qty | 0 — semua terpenuhi | **Masih ada** sisa yang belum di-inbound |
| Inbound baru | Tidak perlu (sudah full) | **Diblok** — error `"Document purhase order has been closed."` |
| Use case bisnis | Supplier kirim semua | Supplier **tidak akan kirim sisa** / procurement putuskan stop receiving |


**Catatan:** PM dokumen menyebut Closed dari approved+partial; AS-IS inbound partial → **processed** dulu, baru Closed. Bukan bug — Close = stop sisa setelah pernah inbound.

### 2.4 Draft vs Open

- **Create:** backend selalu simpan **`open`** (radio draft di UI tidak apply saat first create).
- **Switch:** radio Draft / Open di sidebar form — `PUT` update `transaction_status`.
- **Reject + save:** header → **draft** (sama seperti PR); user harus set **Open** lalu save sebelum approve lagi.

### 2.5 Transisi otomatis lainnya

| Trigger | Status baru |
|---------|-------------|
| `store()` create | **open** |
| Detail add/delete (With PR, pre-approve) | Update PR `prepared_to_po_quantity` |
| PO approve + With PR | PR `processed_to_po_quantity` ↑, `prepared_to_po_quantity` ↓; PR header bisa → **complete** |
| Inbound partial | PO **processed** (observer detail) |
| Inbound full qty | PO **complete** |
| Inbound void semua qty | PO revert **approved** |
| Approve | **approved** |
| Reject | **rejected** |
| Close (`approval_status=closed`) | **closed** |
| Void (`approval_status=void`) | **void** |

---

## 3. Datalist — Kolom & Fitur

### 3.1 Kolom (AS-IS)

| Kolom | Visible default | Keterangan |
|-------|-----------------|------------|
| TRX. DATE | false | Sortable date |
| TRX. CODE / TRX. DATE | true | Link edit |
| PRODUCT | false | Search SKU dalam detail PO (Advanced Filter) |
| SUPPLIER | true | Nama supplier |
| YOUR REF. | true | `supplier_reference_document` |
| TRX. REF. | true | Nomor PR (comma-separated jika multiple) |
| Qty | true | Sum qty detail **tanpa konversi unit** |
| CURR. | true | Currency code |
| EXCHANGE | true | Exchange rate |
| Net Purchase | true | `grand_total_after_vat` (termasuk Other Cost/Disc) |
| Description | true | Header description |
| Trx. Status | true | Tooltip status lengkap |
| Data Owner, Created/Updated By | true | Default DataTablesV3 |
| Action | true | §3.2 |

### 3.2 Action button per status (AS-IS)

| Aksi | Kondisi |
|------|---------|
| **Edit** (Show read-only untuk approved+) | `can_update` atau status terminal dengan render_update |
| **Delete** | draft/open/rejected + privilege |
| **Approve** | **open** + `can_approve` |
| **Void** | **approved** + `can_void` + approval privilege |
| **Closed** | **processed** + `can_closed` |
| **Print** | Semua status (sidebar form + policy view) |
| **Bulk Approve / Bulk Delete** | Multi-select |

**Catatan PM vs AS-IS — Void:**
- PM: Void dari **draft/open/rejected** jika 0 inbound.
- **AS-IS:** Void hanya dari **approved** (`can_void`). Draft/open/rejected → gunakan **Delete**, bukan Void.

**Catatan PM vs AS-IS — Closed:** PM doc menyebut Closed dari **approved**. AS-IS: partial inbound → status **processed** dulu, baru tombol Closed tersedia. Lihat §2.3.1 untuk tujuan tombol.

### 3.3 Fitur datalist

| Fitur | AS-IS |
|-------|-------|
| Global Search | ✅ |
| Advanced Filter | ✅ — kolom Product (hidden) searchable |
| Show Deleted | ✅ |
| Column Show/Hide | ✅ |
| Export Advanced | ✅ **With Details**, **Without Details**, **This Page Only** — async + tab Export File |

---

## 4. Create / Edit — Basic Information

| Field | Wajib? | Default | Validasi AS-IS | Catatan |
|-------|--------|---------|----------------|---------|
| Transaction Code | — | Auto `PO-*` | Unique per company | Disabled saat edit |
| Transaction Date | **Required** | Now | ≤ today; fiscal period | **Terkunci** jika sudah ada detail (currency/supplier/payment/date) |
| Valid Until Date | Opsional | null | Date | |
| Estimated Arrival | Opsional | null | Date | |
| Supplier | **Required** | — | General Company `is_supplier=1`, active, **accounting setting 100%** | Select2 max 25 |
| Payment Type | Opsional | Dari supplier master (`payment_and_currency`) | Integer FK | Default FE fallback id **8** |
| Currency | **Required** | Dari supplier / id **1** | Active currency | |
| Exchange Rate | **Required** | User input; min **1** | = **1** wajib jika currency primer | **Tidak auto-fetch** rate saat ganti currency |
| Type (With/Without PR) | **Required** | — | `with_pr` 0/1 | FE **disable** jika sudah ada detail; import bisa overwrite `with_pr` |
| Your Ref | Opsional | — | Max **50** | `supplier_reference_document` |
| Description | Opsional | — | Max 150 | |
| Term & Condition | Opsional | — | Max 150 | |
| Shipping / Billing Address | Opsional | — | Text | |
| Upload Files | Opsional | — | xlsx, xls, docx, doc, pdf, jpeg, jpg | |

**Status radio (edit only):** Draft / Open — pilih sebelum Save All.

---

## 5. Section PO Detail — Tipe With PR

### 5.1 Konsep

SKU hanya dari PR **approved** atau **processed** dengan outstanding qty; PR `transaction_date` < PO `transaction_date`; baris parent tree only.

Endpoint outstanding: `GET purchase-order-detail/outstanding?purchase_order_id={id}`

### 5.2 Modal Available Product (Outstanding PR)

| Kolom | Visible default | Keterangan |
|-------|-----------------|------------|
| System Product SKU / Name | true | Tombol **Use** per row |
| Availability | true | Stok realtime all WH |
| Req. Qty | true | Qty PR |
| Unit | true | Unit PR |
| PO Status | true | Prepared / Processed qty ke PO |
| Code PR | false | Nomor PR |
| **Already Prepared** | false | **1** jika `prepared_to_po + processed_to_po = qty` (PR line full ke PO) |
| Action | true | **Use** → modal Single Use |

### 5.3 Modal Single Use (With PR)

| Field | Keterangan |
|-------|------------|
| Purchase Requisition Reference | Nomor PR |
| Request Quantity | Qty PR (converted ke unit terpilih) |
| Prepared / Processed to PO Qty | Tracking qty ke PO draft/approved |
| Highest / Lowest / Latest / Average / Avg 30 Days (IDR) | Dari `Product::highestPrice()` dll via `baseToPrimary()` |
| Unit | Primary + alternate — **bisa beda dari unit PR** |
| Purchase Order Quantity | Input qty PO — **integer** (manual) |
| Price (IDR) | Editable; autofill dari latest price logic |
| Qty in Base Unit / Price in Pieces | FE: `qty × conversion_rate`; `price / conversion_rate` |
| Warranty | Master Warranty (informatif) |
| Discount (%) | Per baris |
| VAT (%) | Autofill dari Purchase VAT Setting jika supplier `auto_add` + product tax pivot; toggle **Include/Exclude** |
| Required Delivery Date | Opsional |
| Net Purchase | Preview FE dari price × qty − disc + VAT |
| **Allocate Full Qty Clearing** | Set `order_quantity = round(poBalance)` — untuk sisa outstanding PR desimal. **AS-IS:** sering **tanpa** tax line. **TO-BE (GAP-PO-11):** tax via resolver empty3 (= add product / hormati supplier) |

**Backend:** flag `isFullAlocated` dikirim FE tapi **tidak diproses** server — qty sudah di-set client-side.

### 5.4 Datatable detail (PrimeDataTables)

| Kolom | Inline edit? | Keterangan |
|-------|--------------|------------|
| SKU / Name | — | |
| Availability | — | Realtime |
| Req Qty | — | Dari PR |
| PO Qty | ✅ | Selama `can_update` |
| Unit | ✅ | Konversi qty otomatis saat ganti unit |
| Unit Price | ✅ | |
| Disc (%) | ❌ | Hanya via modal Edit |
| DPP | — | `truncateAndRound(each_dpp_after_discount × order_quantity)` — **bukan** sum pivot `dpp_amount` |
| VAT | — | `truncateAndRound(each_vat × order_quantity)` |
| Total Price | — | `price_after_vat` |
| Action Edit/Delete | — | Hanya jika `can_update`; bundle child: edit ✓ delete ✗ |

### 5.5 Validasi konversi unit (With PR)

Saat ganti unit inline atau di modal:
- Qty PO dikonversi ke base unit dibanding outstanding PR.
- Jika melebihi sisa PR → error; qty auto-adjust saat unit berubah.

---

## 6. Section PO Detail — Tipe Without PR

| Aspek | Perbedaan vs With PR |
|-------|---------------------|
| Sumber SKU | Select2 product transaksi — active, COA group, exclude bundle/random |
| Modal Available Product | Master product (bukan PR outstanding) |
| Req Qty kolom | **Tidak ada** |
| Allocate Full Qty Clearing | **Tidak ada** |
| PR qty tracking | **Tidak** update PR |

Bulk add multiselect: qty default **1**, unit stock, `latestPrice()`, auto taxes.

---

## 7. Section Additional Cost

| Field | Rule |
|-------|------|
| Additional Cost | FK Master Other Cost **active** |
| Amount | Required, ≥ 0 |
| Cost Description | Max 150 |

- Tidak masuk perhitungan PPN per baris.
- Recalculate `grand_total_before_vat` / `grand_total_after_vat`.
- COA dari master di-copy ke line PO, lalu ke PI sebagai **default**.
- Di **Purchase Invoice**, COA baris Additional Cost **bisa di-override** sebelum approve; Amount dari PO **locked**. Lihat [PI §8.3](../accounting-supplier-invoice/requirement.md#83-coa-editable-per-baris-change-req-2026-07).
- Penjurnalan di PI: Other Cost → posisi **Debit** (expense COA baris PI).

---

## 8. Section Additional Disc

Struktur paralel Other Cost.

- Di PI: COA Additional Discount **editable**; Amount dari PO **locked**.
- Penjurnalan di PI: Other Discount → posisi **Credit**.

Guard: grand total before VAT tidak boleh < 0 setelah insert/update.

---

## 9. Section Totals

| Field | Kalkulasi |
|-------|-----------|
| Total Products | Σ harga produk (backend / Path B helpers) |
| Disc Products | Σ diskon produk |
| Total DPP (tooltip) | Mengikuti akumulasi backend (presisi 4dp) — **bukan** wajib = jumlah manual kolom DPP UI 2dp |
| Total VAT | Mengikuti akumulasi backend (presisi 4dp) |
| Total Additional Cost / Disc | Σ other costs / discounts |
| **Net Purchase / Total Price** | Mengikuti **backend exact** (4dp accumulate) — sumber kebenaran hutang |

**AC — kebenaran total (SoT final 27 Jul 2026):**

- **Net Purchase / Total Price / angka jurnal** = akumulasi backend pada presisi **4 desimal** (DPP+VAT komplemen → exact Net×Qty). **Tidak** boleh menyimpang karena rounding tie.
- Kolom DPP & VAT di datalist = **tampilan** dibulatkan **2 desimal** per baris (kebiasaan Rupiah). Jika user **menjumlahkan manual** DPP+VAT yang tampil, bisa dapat **+0,01** vs Total Price baris — **known behavior**, bukan bug kalkulasi/DB.
- Jangan “perbaiki” dengan mengubah round UI ke 4dp atau ubah rumus backend (ditolak end user). Solusi audit: **export 4dp** — §9.2b / GAP-PO-10.

### 9.1 Variable & presisi (SoT 27 Jul 2026)

| Variable | Formula (konsep, VAT **Include** 11%) | Presisi |
|----------|----------------------------------------|---------|
| Unit Price | Input | Biasanya integer Rupiah |
| Disc % | Input | Integer persen AS-IS FE `[VERIFY]` |
| Net Unit Price | `Unit × (100 − Disc) / 100` | 2dp clean jika Unit & Disc integer |
| DPP / unit | Net / 1,11 (atau `each_tax / fake_rate`) | **4dp** storage |
| VAT / unit | **Komplemen:** Net − DPP/unit | **4dp** storage |
| DPP total (backend) | DPP/unit × Qty | **4dp** accumulate (tidak dibulatkan ke 2dp di storage) |
| VAT total (backend) | VAT/unit × Qty | **4dp** accumulate |
| Total Price (backend / UI total) | DPP total + VAT total (4dp) | Exact = Net × Qty |
| DPP / VAT di **kolom UI** | Breakdown per baris | **2dp** display only |

**Identitas 4dp:** DPP/unit + VAT/unit = Net. Akumulasi backend 4dp → Total Price exact. Round independen ke 2dp **hanya di UI breakdown**.

Helpers code: lihat [technical §5](./technical.md#5-pricing--decimal-precision-etm-15313--rounding-sot-27-jul).

### 9.2 Rounding tie — selisih tampilan UI saja (final / accepted)

Dipicu Unit + Disc + **Qty bukan kelipatan 10/100/1000** (25, 75, 175…). Qty 500/1000 sering tidak memicu tie.

**Case referensi:** Unit 38.000, Disc 0, Qty 25 (atau Unit 40.000 Disc 5% → Net sama 38.000):

| Layer | DPP | VAT | Jumlah |
|-------|-----|-----|--------|
| Backend 4dp | 855.855,8550 | 94.144,1450 | **950.000,0000** (= Total Price / Net×Qty) |
| UI breakdown 2dp | 855.855,86 | 94.144,15 | **950.000,01** jika dijumlah manual |

**Status:** **Final — known behavior**, disetujui end user 27 Jul 2026. Bukan bug terbuka. DB / Section Total (Net) / Journal **tidak** kena selisih ini.

**Contoh siap Lingo / user-guide:** angka Case di atas (38.000×25 → DPP 855.855,86 + VAT 94.144,15 vs Total 950.000,00) — card [SF-PRICE-01](../_meta/shared-capabilities/dpp-vat-breakdown-display.md); jangan ubah angka tanpa update SoT.

**Do:** regresi Qty non-kelipatan tetap wajib (pastikan Total Price = Net×Qty; boleh assert Σ UI breakdown bisa +0,01).  
**Don't:** ubah kalkulasi backend atau paksa UI 4dp untuk menutup selisih visual.

### 9.2b Resolusi — export DPP/VAT 4 desimal (**TO-BE** GAP-PO-10)

| Item | Keputusan |
|------|-----------|
| UI | Tetap **2dp** untuk DPP/VAT breakdown |
| Backend | Tidak diubah |
| Export PO (dan turunan PI / Journal) | Kolom DPP & VAT export = **4 desimal** (bukan 2dp) untuk audit/rekonsiliasi |

### 9.3 Rantai ke Inbound & Purchase Invoice

```mermaid
flowchart LR
  PO[PO: DPP/VAT unit 4dp; Total exact] --> GRN[Inbound GRN]
  GRN -->|"Dr Inventory/… Cr Unbilled<br/>= price before VAT × qty"| UB[Unbilled Goods]
  GRN --> PI[Purchase Invoice]
  PI -->|"Dr Unbilled + VAT Cr AP<br/>angka mengikuti backend"| GL[Journal PI]
```

| Menu | Apa yang diwariskan / di-jurnal |
|------|----------------------------------|
| [Inbound](../supplychain-new-purchase-inbound/requirement.md) | Harga **sebelum VAT** dari PO → stok + Unbilled; **tanpa** VAT |
| [Purchase Invoice](../accounting-supplier-invoice/requirement.md) | Warisi unit DPP/VAT; UI breakdown 2dp; **Invoice Total / jurnal** mengikuti backend exact; export 4dp (TO-BE) |

Sort kolom DPP masih `SUM(dpp_amount)` — **GAP-PO-08**.

---

## 10. Section Approval

| Informasi | AS-IS |
|-----------|-------|
| Log | Slideover **Approval** |
| Approve/Reject | Modal approval — **Description** opsional (max 150) |
| Level | **Single-level** |
| Eligibility | Tab **Approval Eligibility** |
| Void / Closed | Dialog Void / Closed — description opsional |

**Catatan:** approve eligibility masih punya sisa cek status legacy multi-level; reject set status **rejected**.

---

## 11. Section Audit Log

Audit menampilkan header, detail (termasuk soft-deleted), attachments, other costs/discounts.

---

## 12. Import Detail Purchase Order

> **TO-BE Import VAT** locked 5 Agu 2026 — brief implementator: `Brief-Dev-PO-Import-VAT-Columns.md`. Status codebase: **belum** (GAP-PO-11). Bagian bertanda **AS-IS** = perilaku live hari ini.

### 12.1 Ringkasan perilaku

| Item | AS-IS | TO-BE (locked) |
|------|-------|----------------|
| Deteksi With/Without PR | Baris 2 kolom A: terisi → With PR; kosong → Without PR | Sama |
| Side effect tipe | Import sukses **overwrite** flag tipe PO | Sama (GAP-PO-07) |
| Max baris | **500** | Sama |
| Re-upload | Bisa ganti semua detail existing | Sama |
| VAT | Auto dari product + supplier `auto_add` — **bukan** kolom Excel | Kolom **I–K** opsional; Excel explicit mengalahkan supplier; ketiga blank → AS-IS |
| Partial success | Pre-val 1 error → **0 insert**; job gagal sering tidak akurat di history | Queue **semua** data row; gagal **per job**; history/notif `success`/`failed` akurat |
| Kontrak With & Without PR | Satu importer aktif; Without PR class dead | **Satu kontrak kolom** A–K; update **kedua** template xlsx |
| Wiring | [technical §9](./technical.md#9-import-detail) | + shared `PurchaseOrderDetailTaxResolver` |

**Out of scope TO-BE:** redesign tax picker form manual; multi-tax per baris Excel (tetap **maks 1 tax** per line).

### 12.2 Template Excel — struktur file

**Baris 1** = header. **Baris 2+** = data.

Mode With/Without PR dari isi kolom A di **seluruh file** (tidak boleh campur):

| Mode | Kolom A semua baris data |
|------|--------------------------|
| **With PR** | Semua baris **wajib** isi kode PR |
| **Without PR** | Semua baris **kosong** |

**Campuran** A kosong/isi → **gagal file-level** (bukan partial VAT):  
`Row {n}: PR Number is empty. When using PR references, every row must include a PR number.`

### 12.3 Kolom import

| Kolom | Header exact (baris 1) | Wajib? | Format / isi |
|-------|------------------------|--------|--------------|
| **A** | *(bebas / kosong di header)* | With PR: Ya per baris | Kode PR exact |
| **B** | `System Product SKU` | Ya | SKU exact |
| **C** | `PO Qty` | Ya | > 0 |
| **D** | `Unit` | Ya | Kode unit exact |
| **E** | `Unit Price` | Ya | ≥ 1 |
| **F** | `Disc.` | Opsional | ≥ 0 |
| **G** | `Description` | Opsional | Freetext |
| **H** | `Required Delivery Date` | Opsional | Excel serial date |
| **I** | **`VAT`** | Opsional (TO-BE) | Hanya `yes` \| `no` (case-insensitive). **Bukan** `Y/N`, `1/0` |
| **J** | **`VAT Code`** | Opsional (TO-BE) | `accounting_taxes.code` active + harus ada di **purchase** tax pivot SKU |
| **K** | **`VAT Type`** | Opsional (TO-BE) | Hanya `include` \| `exclude` (case-insensitive) |

**Header I–K:** opsional by presence. File lama tanpa I–K = ketiga NULL = tax AS-IS. Jika salah satu posisi I/J/K ada di header → label harus exact `VAT` / `VAT Code` / `VAT Type`.

Warranty / PR detail ID tetap sistem — bukan kolom Excel.

### 12.4 Resolver VAT (TO-BE) — keputusan terkunci

Shared helper (dipakai import + add product / bulk / **Allocate Full** / Use PR). Service SKU: **rules sama**.

| # | Keputusan |
|---|-----------|
| 1 | Excel explicit (`yes`/`no`/code/type) **mengalahkan** supplier `auto_add_transaction_supplier`. Hanya **ketiga kolom NULL** → hormati supplier (AS-IS). |
| 2 | `VAT=no` → **tanpa** tax line. Jika `no` + code/type terisi → **fail row** conflict. |
| 3 | `VAT=yes` **atau** (VAT kosong tapi code/type terisi) → effective YES → resolve tax. |
| 4 | Hanya type terisi (Rule 3): anggap YES → resolve tax → **override** `included` dari Excel. |
| 5 | Multi-tax, semua `auto_add=NO`: pilih purchase pivot **`id` terkecil** (deterministik). Juga seragamkan “first” di cabang empty3 → min pivot id. |
| 6 | Code terisi: Tax active by code + harus di purchase pivot SKU; `included` default dari pivot kecuali type override. |
| 7 | Satu tax line per baris (bukan multi-tax Excel). |

**Matriks ringkas:**

| VAT | Code | Type | Hasil |
|-----|------|------|-------|
| (kosong) | (kosong) | (kosong) | AS-IS supplier/product auto-pick |
| `no` | — | — | No tax |
| `no` | terisi / type terisi | | Fail: conflict |
| `yes` / kosong+code/type | — | — | Resolve tax; type override include/exclude |
| invalid `maybe` / type `incl` | | | Fail row English |

Pesan draft (EN): lihat [technical §9](./technical.md#9-import-detail). Testcase T01–T20: brief implementator §9.

### 12.5 Align non-Excel (TO-BE)

**AS-IS gap:** Allocate Full / sebagian bulk With PR memanggil `store` **tanpa** taxes.

**TO-BE:** path add product / bulk without PR / Allocate Full / Use PR (tanpa Excel) memanggil resolver dengan argumen VAT **null** → cabang empty3 (hormati supplier) — sama dengan add product. FE jangan kirim `taxes: []` yang men-override.

### 12.6 Template Without PR class

Class `PurchaseOrderWithoutPrImport` **belum di-wire** (GAP-PO-04). Mode Without PR tetap via kolom A kosong pada importer aktif. TO-BE VAT: jangan implement hanya di dead class — fokus importer aktif + **2 xlsx** kolom sama.

### 12.7 Validasi file-level (abort penuh — tetap)

| # | Kondisi | Pesan (AS-IS / tetap) |
|---|---------|------------------------|
| F-01 | Bukan `.xlsx`/`.xls` | format does not match |
| F-02 | Batch masih running | Please wait… |
| F-03 | Header B–H salah / VAT header present but wrong label | template mismatch |
| F-04 | Empty data | imported file is empty |
| F-05 | Type import not match | type of import not match |
| F-06 | > 500 details | Cannot add more than 500… |
| F-07 | Campuran With/Without PR | PR Number empty… |

### 12.8 Validasi per baris

AS-IS: PR / SKU / Qty / Unit / Price / Disc / Delivery / outstanding.  
**TO-BE tambahan:** invalid VAT tokens; VAT code not found/inactive/not on SKU; no purchase VAT setting; VAT=no conflict; SKU tanpa purchase tax saat effective YES.

### 12.9 Partial success (TO-BE)

| Fase | AS-IS | TO-BE |
|------|-------|-------|
| Pre-val bisnis/VAT per row | 1 error → **0 jobs** | Jangan abort queue untuk error per-row; **queue semua** data row |
| Job | Sering swallow → history bohong | Fail job propagates; log + `count_row_success` / `count_row_failed` akurat |
| Notif | — | all OK / **partial** `{n} succeeded, {m} failed` / all failed |

### 12.10 Duplicate SKU

Tidak merge — tiap baris valid = detail baru.

### 12.11 Download template (GAP-PO-05 + TO-BE)

Deploy **kedua** file: `Template-Import-PO-With-PR.xlsx` & `…-Without-PR.xlsx` dengan kolom I–K. File lama tanpa I–K tetap diterima.

### 12.12 Monitoring

Progress, import log, history — [technical §2 & §9](./technical.md).

---

## 13. Export

### 13.1 Export detail (single PO)

Export detail single PO (excel/csv):

Kolom: System Product SKU, Stok WH, Req Qty, Po Qty, Unit, Unit Price, Discount, VAT, Total Price

### 13.2 Export Advanced (datalist)

| Mode | Kolom utama |
|------|-------------|
| **With Details** | Trx Date, Code, Supplier, Currency, SKU, Unit Price, Qty, Unit, Disc %, Disc IDR, VAT, Total Price, Status, Created/Updated/Approved metadata |
| **Without Details** | Header only (~11 kolom) |
| **This Page Only** | Filter halaman aktif |

Async job → tab Export File.

---

## 14. Print Detail

**Output:** PDF

**Header:** Supplier, currency, your ref, PO number, dates, company logo/NPWP, QR = PO code.

**Detail columns:** No, Product Name, SKU, Qty, Unit (**dari PR detail unit** — Without PR bisa kosong), Cond., Delivery, Price, Extended Price.

**Totals di print:** Sub Total, Discount Total, VAT Total, Grand Total — **hanya dari detail lines**; **Other Cost/Discount TIDAK ikut**.

**Footer:** T&C, addresses, remark, creator + first approver signature.

---

## 15. Validasi yang Berjalan

| # | Validasi | Behavior |
|---|----------|----------|
| V-01 | Transaction date ≤ today | 422 |
| V-02 | Exchange rate min 1; primary currency = 1 | Error "Invalid rate" |
| V-03 | Supplier accounting complete | Excluded dari select2 |
| V-04 | With PR — SKU outside outstanding | Blocked / not in list |
| V-05 | Unit conversion vs PR outstanding | Error jika qty > sisa |
| V-06 | Approve | Status **open** only; min 1 detail |
| V-07 | Void | **Approved** only; block if **processed** (GRN exists) |
| V-08 | Close | **Processed** + approval privilege |
| V-09 | Delete header | **draft, open, rejected** |
| V-10 | Edit | Blocked approved/processed/complete/closed/void |
| V-11 | Max detail | **500** rows |
| V-12 | Fiscal period | create/update/approve |
| V-13 | Approval | Single-level; reject description opsional |
| V-14 | Qty manual | Integer — import allows angka > 0 (termasuk desimal) |
| V-15 | Grand total | Other cost/disc cannot make total before VAT < 0 |

---

## 16. Relasi Menu Lain

```mermaid
flowchart LR
    PR[Purchase Requisition] -->|with_pr=1| PO[Purchase Order]
    SP[System Product] -->|without_pr| PO
    GC[General Company Supplier] --> PO
    PO -->|GRN| INB[Purchase Inbound]
    INB -->|full qty| PO
    PO -->|other cost/disc COA| PI[Purchase Invoice]
```

**GRN docs:** [supplychain-new-purchase-inbound requirement v2.0](../supplychain-new-purchase-inbound/requirement.md) (BETA UI + COLLI). Legacy UI: [supplychain-mutation-inbound](../supplychain-mutation-inbound/README.md).

Cross-ref PR: [supplychain-purchase-requisition requirement §2.3](../supplychain-purchase-requisition/requirement.md).

### 16.1 Behavior Void/Delete PO vs PR (AS-IS)

| Event | PR effect AS-IS |
|-------|-----------------|
| Detail delete (pre-approve) | `prepared_to_po_quantity` **decrement** ✓ |
| Header delete | **Bug:** formula revert prepared salah (`DEV-PO-02`) |
| **Void approved PO** | **`processed_to_po_quantity` TIDAK di-revert** (`GAP-PO-01`) |
| Approve PO With PR | `processed_to_po_quantity` increment; PR bisa → **complete** |

---

## 17. Do's and Don'ts (ringkas)

**Do:** lengkapi accounting supplier; set Open sebelum Approve; ubah kurs foreign manual; Closed hanya jika sisa qty memang tidak dilanjutkan.  
**Don't:** void PO processed; expect Void dari draft/open (pakai Delete); import file dengan baris error; andalkan print untuk total termasuk Other Cost/Disc.

## 18. Acceptance Criteria (AS-IS)

Create open + With/Without PR · supplier filter · outstanding/Single Use · pricing + Other Cost/Disc · single-level approval · complete/closed · import max 500 · export/print · GRN drives processed/complete.


## 19. Gap PM vs AS-IS — penjelasan

| ID | PM / expect | AS-IS | Klasifikasi | Penjelasan |
|----|-------------|-------|-------------|------------|
| **GAP-PO-01** | Void PO → qty PR kembali available | Void **tidak revert** `processed_to_po_quantity` | **Not implemented** | → **Pending Major P-PO-01** (Finance) |
| **GAP-PO-02** | Void draft/open/rejected (0 inbound) | Void hanya **approved**; draft/open → **Delete** | **Design differs — confirmed OK** | PM expectation tidak match; AS-IS by design |
| **GAP-PO-03** | Closed dari **approved** partial inbound | Closed dari **processed** | **Bukan gap fungsional** | Partial inbound ubah status ke **processed** dulu. Tombol Close = stop sisa inbound (§2.3.1) |
| **GAP-PO-04** | Import Without PR aktif | Class Without PR tidak di-wire | **Not wired** | Mode Without PR via kolom A kosong; detail §12 / technical |
| **GAP-PO-05** | Template xlsx tersedia | File **404** di FE `/files/` | **Asset missing** | Lihat penjelasan §19.1 |
| **GAP-PO-06** | Print = Net Purchase layar | Print **exclude** Other Cost/Disc | **Incomplete print** | → **Pending Major P-PO-02** (End user) |
| **GAP-PO-07** | Type PO locked setelah create | Import overwrite `with_pr`; BE update tidak lock | **Partial gap** | Lihat penjelasan §19.2 |
| **GAP-PO-08** | Sort kolom DPP/VAT = nilai tampilan | `orderColumn` masih `SUM(dpp_amount)` / `SUM(vat_amount)` | **Residual** | Display sudah Path B; sort masih pivot |
| **GAP-PO-09** | Σ manual DPP+VAT UI 2dp = Total Price | UI round independen → +0,01 pada tie | **Accepted — known behavior** (27 Jul 2026) | Backend/Total/Journal exact 4dp; bukan bug |
| **GAP-PO-10** | Export DPP/VAT pakai 4 desimal | Export masih 2dp seperti UI | **TO-BE** | Resolusi end user — audit/rekonsiliasi; UI tetap 2dp |
| **GAP-PO-11** | Import kolom VAT/VAT Code/VAT Type; partial success akurat; tax Align Allocate Full / bulk | Excel tidak baca VAT; pre-val all-or-nothing; Allocate Full tanpa tax | **TO-BE locked** (5 Agu 2026) | §12.3–§12.9; brief Dev PO Import VAT |

### 19.1 GAP-PO-05 — Template file missing (detail)

Link download template di panel Import mengarah ke asset static yang **sering belum di-deploy** (404). Workaround: Excel manual (§12.3). Perbaikan: deploy 2 file template atau generate dinamis di FE. Path/detail: [technical §1](./technical.md#1-file-map).


### 19.2 GAP-PO-07 — Type PO bisa berubah (detail)

**Apa maksudnya — 3 lapisan berbeda:**

| Lapisan | Perilaku AS-IS |
|---------|----------------|
| **UI form** | Radio With/Without PR **disabled** (`disable_relation_pr=true`) jika PO **sudah punya detail** — user tidak bisa klik ganti tipe |
| **API update** | `PUT purchase-order/{id}` **masih terima** field `with_pr` — **tidak ada** guard "reject if details exist" (beda dengan supplier/currency yang di-lock) |
| **Import sukses** | Import **overwrite** flag tipe PO di header berdasarkan deteksi kolom A file |

**Risiko:** import file With PR ke PO Without PR (kosong detail) bisa overwrite tipe meski radio UI terkunci; jika sudah ada detail + tipe mismatch → error type not match. **PM expect:** tipe fixed setelah create. **AS-IS:** UI lock, API/import bisa drift.

---

## 20. Dev follow-ups

Daftar DEV-PO-* (void PR qty, destroy formula, print unit, Without PR import wiring, max_child unify): [technical §15 Known Issues](./technical.md#15-known-issues).


## 21. Pending Items — Major (diskusi stakeholder)

Butuh keputusan bisnis sebelum implementasi:

| ID | Priority | Stakeholder | Item | Konteks AS-IS | Keputusan dibutuhkan |
|----|----------|-------------|------|---------------|---------------------|
| **P-PO-01** | 🔴 **Highest** | **Finance + Procurement** | **Void PO harus revert qty PR?** (GAP-PO-01) | Saat PO With PR di-**void** setelah approve, `processed_to_po_quantity` di PR **tidak dikembalikan** — PR tetap "terkunci" seolah qty masih di PO. Delete detail pre-approve revert `prepared_to_po` ✓ | Apakah void PO wajib release qty ke PR outstanding? Impact: PR status, laporan open commitment, audit trail PR→PO |
| **P-PO-02** | 🔴 **Major** | **End user / Procurement** | **Print PDF harus sama dengan Net Purchase di layar?** (GAP-PO-06) | Layar form: Net Purchase = detail + VAT + **Other Cost** − **Other Disc**. Print PDF: Sub Total / VAT / Grand Total **hanya dari detail lines** — Other Cost/Disc **tidak tampil** | Apakah printout resmi ke supplier/internal harus mirror Totals section? Atau print hanya ringkasan barang? |
| **P-PO-03** | 🟡 Medium | **Dev + QA** | Deploy template import xlsx (GAP-PO-05) | Download template 404 — operator tidak punya file resmi | IT deploy 2 file template atau FE generate template |
| **P-PO-04** | 🟡 Medium | **PM + Dev** | Lock `with_pr` di backend + import (GAP-PO-07) | UI lock tapi API/import bisa ubah tipe | Apakah `with_pr` immutable setelah first detail / setelah create? |
| **P-PO-05** | 🟡 Medium | **Dev** | Enable import Without PR terpisah (GAP-PO-04) | Mode class terpisah disabled | Satu alur cukup atau perlu split + unify max 500? |
| **P-PO-06** | 🟡 Medium | **Dev + QA** | Samakan sort DPP/VAT dengan rumus tampilan (GAP-PO-08) | Sort `SUM(dpp_amount)` vs cell display | Sort order bisa “salah” relatif ke angka yang user lihat |
| **P-PO-07** | ✅ Closed | **Finance + End user** | Kebijakan rounding tie | **Accepted** known behavior UI (GAP-PO-09) | Jangan ubah backend/UI round |
| **P-PO-08** | 🟡 Medium | **Dev** | Export DPP/VAT 4dp (GAP-PO-10) | Export PO (dan PI/Journal terkait) | Scope: format export saja |
| **P-PO-09** | 🔴 **High** | **Dev + QA** | Import VAT columns + partial success + Align Allocate Full (GAP-PO-11) | Template I–K; resolver shared; history/notif; tax path non-Excel | Locked 5 Agu 2026 — brief implementator |

**Confirmed OK (bukan pending):** GAP-PO-02 (Void draft/open = Delete); GAP-PO-03 (Closed dari processed intentional).

---


## 22. FAQ

**Q: Kenapa supplier tidak muncul?**  
A: Accounting setting supplier belum 100% lengkap di General Company.

**Q: Setelah reject, kenapa belum bisa approve?**  
A: Reject + save → Draft. Set **Open** lagi sebelum Approve.

**Q: Void vs Delete?**  
A: Draft/Open/Rejected → **Delete**. Approved (belum inbound) → **Void**.

**Q: Void mengembalikan qty PR?**  
A: Belum (GAP-PO-01 / P-PO-01) — butuh keputusan Finance + Procurement.

**Q: Print beda dengan Net Purchase layar?**  
A: Print belum include Other Cost/Disc (GAP-PO-06 / P-PO-02).

## Related Documents

| Doc | Path |
|-----|------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| Technical | [technical.md](./technical.md) |
| User Guide | [user-guide.md](./user-guide.md) |
| Purchase Requisition | [../supplychain-purchase-requisition/requirement.md](../supplychain-purchase-requisition/requirement.md) |
| Other Cost | [../omni-other-cost/requirement.md](../omni-other-cost/requirement.md) |
| Supplier Invoice | [../accounting-supplier-invoice/requirement.md](../accounting-supplier-invoice/requirement.md) |
