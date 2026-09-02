---
doc_type: requirement
menu: accounting-purchase-report
menu_name: "Purchase Report"
version: 2.1
last_updated: 2026-09-02
owner: QA - Yemima
status: review
aliases: [Purchase Report, laporan pembelian SKU, PO PI report supplier, ETM-15673, ETM-15674, ETM-15729]
---

# Purchase Report — Requirement Documentation

**Modul:** Accounting → Report  
**Menu UI:** **Purchase Report** (`/accounting/purchase-report`)  
**Audience:** PM, QA, Procurement, Finance, Developer  
**Status:** **AS-IS** v2.0  
**SoT:** [`_meta/sot/accounting-purchase-report-source-of-truth.md`](../_meta/sot/accounting-purchase-report-source-of-truth.md) v1.0  
**Jira SoT:** [ETM-15673](https://erpintegration.atlassian.net/browse/ETM-15673) (POV PO) · [ETM-15674](https://erpintegration.atlassian.net/browse/ETM-15674) (POV PI)

---

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-08-12 | QA - Yemima | TO-BE awal (belum implementasi) |
| 2.0 | 2026-08-31 | QA - Yemima | AS-IS dari ETM-15673/15674 + verifikasi kode; shell = dual tab |
| 2.1 | 2026-09-02 | QA - Yemima | Supplier display **code-only** (ETM-15729): group header = **Supplier Code** + total; ColVis/export tanpa name |

---

## 1. Ringkasan Eksekutif

**Purchase Report** adalah report **read-only** yang menampilkan pembelian **per SKU**, digroup per **Supplier**, dengan **dua POV** dalam satu menu:

| Tab (POV) | Sumber baris |
|-----------|--------------|
| **Purchase Order** | Detail PO (With PR + Without PR) |
| **Purchase Invoice** | Detail Purchase Invoice / Supplier Invoice |

Satu load API = satu POV — **tidak** menampilkan PO dan PI bersamaan. **Tidak** terkait Account Payable Report. POV PO **tidak** mereferensikan PI (dan sebaliknya).

```mermaid
flowchart LR
  PO[Purchase Order] --> TabPO[Tab PO]
  PI[Purchase Invoice] --> TabPI[Tab PI]
  TabPO --> R[Purchase Report]
  TabPI --> R
```

---

## 2. UI / UX (AS-IS)

### 2.1 Shell Type — dual tab (implementasi sekarang)

| Control | Rule AS-IS |
|---------|------------|
| **Tab Purchase Order / Purchase Invoice** | Satu menu; ganti tab = ganti dataset (`select_menu`) |
| Default tab | **Purchase Order** (tab pertama) — data load langsung |
| Trx. Date filter | Advanced Filter default: **awal–akhir bulan berjalan** (boleh diubah) |
| Global Search | Ya |
| Advanced Filter | Ya (SearchBuilder) |
| Columns Show/Hide | Ya |
| Export | Export All (async) · This Page · file list **per** tab |

> Draft card menyebut “blank sampai Type” + default **30 hari**. AS-IS shell = tab (bukan blank). Default tanggal: lihat **GAP-PURREP-01**.

### 2.2 Grouping & Total Tagihan

- Group header = **Supplier Code** + nominal total supplier (kanan header) — **bukan** nama supplier (ETM-15729 / parent ETM-15721).
- Total supplier = sum line amounts terfilter untuk supplier itu.
- Kolom **Total Tagihan** per baris = amount line (bukan running Excel per row) — **GAP-PURREP-02**.
- Group/sort key konsisten ke `supplier_code` saat mode code-only.

**Contoh konsep (card PI):** baris TROLIK100 → TROLIK80 → … Total Price bertambah; di UI, penjumlahan supplier tampil di **header group** berlabel **kode** supplier.

### 2.2b Supplier Display (code-only) — ETM-15729

Berlaku **semua role**. Exception nama: **Print** saja (jika ada).

| Surface | Rule |
|---------|------|
| Data List (tab PO & PI) | Kolom Supplier = **code only** |
| **Group header supplier** | **Supplier Code** + total (bukan name) |
| Column Show/Hide (ColVis) | **Tanpa** opsi Supplier Name |
| Advanced Filter / Search | Match **code + name**; tampilan grid/header = **code**; **tanpa** hover nama |
| Export per tab | **Tanpa** name |
| Print (jika ada) | Name **boleh** |

Jangan menambah field/surface Supplier Name di UI report.

### 2.3 Kolom

| Kolom | Keterangan |
|-------|------------|
| ID. Trx | Id detail |
| Trx. Date | Tanggal transaksi header |
| Type Transaction | Purchase Order / Purchase Invoice |
| Trx. Code | Hyperlink ke dokumen sumber |
| SKU / Name | System Product |
| Description | PO: header; PI: line |
| Qty / Unit | PO order qty / PI invoice qty |
| DPP / VAT / Currency | Currency **as-is** |
| Unit Price | Line before disc before VAT |
| Total Price | Line product — **tanpa** Other Cost/Disc |
| Total Tagihan | Line amount (+ total di header group) |
| Trx. Status | Semua status dokumen sumber |

---

## 3. Business rules

| ID | Rule | Sumber |
|----|------|--------|
| R-01 | Tab PO → hanya data PO; tab PI → hanya data PI | ETM-15673/15674 |
| R-02 | PO: With PR + Without PR | ETM-15673 |
| R-03 | Semua status dokumen masuk | ETM-15673/15674 |
| R-04 | Currency as-is | ETM-15673/15674 |
| R-05 | Tidak join/relasi PO↔PI di report | ETM-15673/15674 |
| R-06 | Tidak relasi Account Payable Report | ETM-15673/15674 |
| R-07 | Total Price exclude Other Cost & Other Disc | ETM-15673/15674 |
| R-08 | Hyperlink Trx. Code ke edit PO / PI | ETM-15673/15674 |
| R-09 | Company scope `owned_by` | Kode |
| R-10 | Soft-deleted tidak tampil | Kode |
| R-11 | Supplier UI/export = code only; group header = code + total | ETM-15729 / ETM-15721 |

---

## 4. Sumber field (mapping)

| Kolom | Purchase Order | Purchase Invoice |
|-------|----------------|------------------|
| Trx. Date | PO transaction date | PI transaction date |
| Trx. Code | PO code → edit PO | PI code → edit supplier-invoice |
| SKU / Qty / Unit / DPP / VAT / Unit Price | PO Detail | PI Detail |
| Description | PO header | PI detail line |
| Total Price | Line PO (product) | Line invoice total (product) |
| Status | PO header | PI header |
| Supplier | PO supplier (**code** display) | PI supplier (**code** display) |

---

## 5. Export

| Mode | Behavior |
|------|----------|
| Export All | Async batch; filter aktif; terpisah per `select_menu` |
| This Page Only | Halaman aktif |
| Progress / file list | Per tab (PO vs PI) |

---

## 6. Out of scope

- Chart / KPI dashboard  
- Campur PO+PI satu load  
- AP aging / settlement  
- Kolom linkage PO→PI atau PI→PO  
- Bug summary Total Tagihan kanan atas vs global search (bukan bagian SOT ini)

---

## 7. Acceptance Criteria (AS-IS)

- [x] Menu Accounting → Report → Purchase Report + privilege  
- [x] Dual tab PO / PI; dataset terisolasi  
- [x] Group Supplier (**code**) + total di header group  
- [x] All status; PO With+Without PR; currency as-is  
- [x] Hyperlink; Search/Filter/Columns/Export per tab  
- [x] Tidak ada relasi AP atau PO↔PI  
- [ ] Supplier ColVis tanpa Name; export tanpa name; group header code-only (ETM-15729)

---

## 8. Gap Registry

| ID | Ringkas | Status |
|----|---------|--------|
| GAP-PURREP-01 | Card: default 30 hari · FE: bulan berjalan | Open — docs ikuti FE |
| GAP-PURREP-02 | Card: running Excel per row · FE/BE: line + sum header | Open — docs ikuti kode |

---

## 9. Related Documents

| Doc | Path |
|-----|------|
| SoT | [../_meta/sot/accounting-purchase-report-source-of-truth.md](../_meta/sot/accounting-purchase-report-source-of-truth.md) |
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| Technical | [technical.md](./technical.md) |
| User Guide | [user-guide.md](./user-guide.md) |
| Feature Map | [feature-map.md](./feature-map.md) |
| Purchase Order | [../supplychain-purchase-order/](../supplychain-purchase-order/) |
| Purchase Invoice | [../accounting-supplier-invoice/](../accounting-supplier-invoice/) |
