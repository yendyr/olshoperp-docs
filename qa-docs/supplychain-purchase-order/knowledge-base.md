---
doc_type: knowledge-base
menu: supplychain-purchase-order
menu_name: "Purchase Order"
version: 2.1
last_updated: 2026-07-05
owner: QA - Yemima
status: review
audience: operator
---

# Purchase Order — Knowledge Base

**Path:** SCM → **Purchase Order** (`/supplychain/purchase-order`)  
**Prefix dokumen:** `PO-`

---

## 1. Apa itu Purchase Order?

**Purchase Order (PO)** adalah pesanan pembelian resmi ke **supplier**. PO bisa dibuat **With PR** (dari Purchase Requisition) atau **Without PR** (produk langsung). Setelah PO **disetujui**, barang diterima lewat **Purchase Inbound**.

---

## 2. Alur singkat

1. Buat PO → pilih **With PR** atau **Without PR** → isi supplier, currency, kurs
2. Tambah **Detail** (dari outstanding PR atau pilih produk)
3. (Opsional) Other Cost / Other Discount
4. Set status **Open** → **Approve**
5. Buat **Purchase Inbound** dari PO approved
6. Saat semua qty diterima → **Complete**; atau **Close** manual jika sisa qty tidak dilanjutkan

---

## 3. Status — arti untuk operator

| Status | Arti | Bisa ubah data? |
|--------|------|-----------------|
| **Draft** | Belum siap approve / setelah reject + save | Ya |
| **Open** | Siap diajukan approve | Ya |
| **Approved** | Disetujui — siap inbound | Tidak |
| **Rejected** | Ditolak — perbaiki lalu set Open | Ya |
| **Processed** | Sebagian qty sudah masuk inbound | Tidak |
| **Complete** | **Selesai otomatis** — semua qty sudah diterima | Tidak |
| **Closed** | **Selesai manual** — sisa qty tidak akan di-inbound | Tidak |
| **Void** | Dibatalkan dari **Approved** (bukan draft) | Tidak |

> **Complete vs Closed:** keduanya artinya proses PO **selesai** untuk sisa inbound — trigger berbeda.
>
> **Kapan pakai Closed?** Saat PO sudah **Processed** (sudah pernah terima barang sebagian via Inbound), tapi supplier **tidak akan kirim sisa qty**. Klik Closed → Inbound baru untuk sisa qty **ditolak sistem**.

---

## 4. Tipe PO

| Tipe | Kapan dipakai |
|------|---------------|
| **With PR** | Pembelian berdasarkan PR yang sudah approved/processed |
| **Without PR** | Pembelian langsung tanpa PR |

Tipe **tidak bisa diubah** di form jika sudah ada baris detail. Import Excel bisa mengubah flag `with_pr` (hati-hati).

---

## 5. Tombol & fungsi UI

### 5.1 Form create / edit (sidebar)

| Tombol / aksi | Fungsi |
|---------------|--------|
| **Save & Next** | Simpan header baru lalu lanjut ke detail |
| **Save All** | Simpan header (Draft/Open dari radio) |
| **Approve** | Setujui — hanya status **Open**, min 1 detail |
| **Print** (ikon) | Unduh PDF PO |
| **Void** (ikon) | Batalkan PO **Approved** (belum ada inbound/processed) |
| **Closed** (ikon) | Tutup PO **Processed** — sisa qty tidak dilanjutkan |
| **Radio Draft / Open** | Pilih sebelum save; create selalu mulai **Open** di backend |

### 5.2 Section Detail

| Tombol / aksi | Fungsi |
|---------------|--------|
| **Available Product** | Modal outstanding PR (With PR) atau daftar produk (Without PR) |
| **Use** (per baris modal) | Buka form input qty, harga, unit, VAT |
| **Allocate Full Qty Clearing** | Isi sisa qty PR sekaligus (With PR, qty desimal) |
| **Import Detail** | Upload Excel massal |
| **Export Detail** | Download detail PO (xlsx/csv) |
| Edit inline | PO Qty, Unit, Unit Price (sebelum approved) |
| Edit modal | Diskon, VAT, warranty, delivery date |
| Delete baris | Hapus detail (revert qty PR jika With PR) |

### 5.3 Datalist row actions

| Aksi | Kapan |
|------|-------|
| Edit | Draft, Open, Rejected |
| Approve | Open |
| Delete | Draft, Open, Rejected |
| Void | **Approved** (bukan draft/open) |
| Closed | **Processed** |
| Print | Semua status |

**Penting:** Untuk batalkan PO yang masih draft/open → **Delete**, bukan Void.

---

## 6. Import detail — panduan operator

### Template

Download dari panel import:
- **With PR:** `Template-Import-PO-With-PR.xlsx`
- **Without PR:** `Template-Import-PO-Without-PR.xlsx`

> Jika file tidak tersedia — laporkan ke IT (asset belum di-deploy).

### Kolom (baris 1 = header — jangan ubah label B–H)

| Kolom | Isi | Wajib? |
|-------|-----|--------|
| A | Kode PR (contoh `PR-xxx`) — **semua baris** isi atau **semua kosong** | Wajib jika With PR |
| B | System Product SKU | **Ya** |
| C | PO Qty (> 0) | **Ya** |
| D | Unit (kode exact) | **Ya** |
| E | Unit Price (≥ 1) | **Ya** |
| F | Disc. (%) | Opsional |
| G | Description | Opsional |
| H | Required Delivery Date (format **Excel date**, bukan ketik manual) | Opsional |

VAT & warranty **tidak** ada di template — sistem isi otomatis dari master product.

### Download template (penting)

Tombol download mengarah ke `/files/Template-Import-PO-With-PR.xlsx` — **file ini belum di-deploy** di server FE (404). Buat manual ikuti kolom di atas, atau minta IT menambahkan file template.

### Aturan penting

- Maksimal **500 baris** detail per PO
- **Satu baris salah** di fase validasi → **seluruh file batal** — perbaiki lalu upload ulang
- Tipe import (ada/tidak PR Code di baris 2) harus **match** dengan detail PO yang sudah ada
- Bundle / Random SKU ditolak

### Setelah import

Cek **Import Log** jika gagal. PR **Rejected** → PO jadi **Draft**.

---

## 7. Basic Information — tips

| Field | Tips |
|-------|------|
| Supplier | Hanya muncul jika accounting setting **100% lengkap** |
| Currency / Payment | Auto dari supplier saat pilih supplier |
| Exchange Rate | Default **1** — ubah manual untuk mata uang asing |
| Your Ref | Max 50 karakter |

Setelah ada detail, **tanggal, supplier, currency, payment** terkunci.

---

## 8. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Supplier tidak muncul | Accounting belum lengkap | Lengkapi di General Company |
| Tidak bisa approve | Status Draft / belum Open | Set **Open** + save |
| Reject tidak langsung approve | Flow reject → draft | Set **Open** + save |
| Void tidak muncul | PO masih draft/open | Gunakan **Delete** |
| Void gagal "prepared at purchase" | Sudah ada inbound | Tidak bisa void — gunakan Close jika processed |
| Closed tidak muncul | PO masih approved (belum inbound) | Buat inbound dulu → **Processed** |
| Import type not match | File With PR vs PO Without PR | Kosongkan detail atau sesuaikan file |
| Kurs invalid | Currency primer tapi rate ≠ 1 | Set rate = 1 |
| PR tidak muncul di outstanding | PR closed/complete atau qty habis | Cek status PR |

---

## 9. FAQ

**Q: Apakah qty boleh desimal?**  
A: Input manual: **bilangan bulat**. Import: boleh int/double > 0.

**Q: Berapa maksimal baris detail?**  
A: **500** baris.

**Q: Apakah void mengembalikan qty ke PR?**  
A: **Belum** — void approved PO saat ini **tidak revert** `processed_to_po` di PR (known gap). Delete detail sebelum approve akan revert `prepared_to_po`.

**Q: Apakah print PDF sama dengan Net Purchase di layar?**  
A: **Belum selalu** — print **tidak include** Other Cost/Discount.

---

## Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Technical | [technical.md](./technical.md) |
| Purchase Requisition | [../supplychain-purchase-requisition/knowledge-base.md](../supplychain-purchase-requisition/knowledge-base.md) |
| Purchase Inbound | `supplychain/new-purchase-inbound` (BETA) / `mutation-inbound` (legacy) | [GRN v2.0](../supplychain-new-purchase-inbound/requirement.md) |
