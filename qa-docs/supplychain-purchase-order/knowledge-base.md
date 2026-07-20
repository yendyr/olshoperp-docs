---
doc_type: knowledge-base
menu: supplychain-purchase-order
menu_name: "Purchase Order"
version: 2.3
last_updated: 2026-07-17
owner: QA - Yemima
status: review
aliases: [PO, purchase order, pembelian, pesanan pembelian, outstanding PR]
---

# Purchase Order — Knowledge Base

**Audience:** Operator, Support  
**Path:** SCM → **Purchase Order** (`/supplychain/purchase-order`)  
**Prefix dokumen:** `PO-`

---

## 1. Apa itu Purchase Order?

**Purchase Order (PO)** adalah pesanan pembelian resmi ke **supplier**. PO bisa dibuat **With PR** (dari Purchase Requisition) atau **Without PR** (produk langsung). Setelah PO **disetujui**, barang diterima lewat **Purchase Inbound**, lalu ditagih di **Purchase Invoice**.

---

## 2. Kapan dipakai?

| ✅ Buat PO jika | ❌ Jangan buat PO jika |
|-----------------|------------------------|
| Ada kebutuhan beli ke supplier (dengan atau tanpa PR) | Supplier belum lengkap accounting setting — tidak muncul di daftar |
| With PR: masih ada sisa qty PR outstanding | Qty PR sudah habis / PR sudah closed-complete |
| Without PR: produk aktif dengan COA group | Produk bundle / random (tidak bisa dipilih) |

---

## 3. Alur kerja standar

Setelah kebutuhan beli jelas, buat PO lalu approve agar bisa diterima di inbound.

```mermaid
flowchart TD
    A["SCM → Purchase Order → Create"] --> B["Pilih With PR / Without PR"]
    B --> C["Isi supplier, currency, kurs"]
    C --> D["Tambah Detail\n(+ Cost/Disc opsional)"]
    D --> E["Status Open → Approve"]
    E --> F["Purchase Inbound"]
    F --> G["Complete atau Closed"]
    G --> H["Purchase Invoice"]
```

**Keterangan langkah:**

- **Create:** pilih tipe With/Without PR; isi supplier, mata uang, kurs. Create biasanya mulai status **Open**.
- **Detail:** With PR → ambil dari outstanding PR; Without PR → pilih produk. Opsional: Additional Cost / Discount (nominal ikut ke PI; di PI COA masih bisa diganti sebelum approve).
- **Approve:** status harus **Open** + minimal 1 baris detail.
- **Inbound:** setelah approved, buat Purchase Inbound.
- **Selesai:** **Complete** (otomatis jika semua qty diterima) atau **Closed** (manual dari Processed jika sisa tidak dilanjutkan).
- **Invoice:** tagih di Purchase Invoice dari inbound.

---

## 4. Status — arti untuk operator

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
> **Kapan pakai Closed?** Saat PO sudah **Processed** (sudah pernah terima barang sebagian), tapi supplier **tidak akan kirim sisa**. Klik Closed → Inbound baru untuk sisa qty **ditolak sistem**.

---

## 5. Tipe PO

| Tipe | Kapan dipakai |
|------|---------------|
| **With PR** | Pembelian berdasarkan PR yang sudah approved/processed |
| **Without PR** | Pembelian langsung tanpa PR |

Tipe **tidak bisa diubah** di form jika sudah ada baris detail. Import Excel bisa mengubah tipe PO (hati-hati — sesuaikan file dengan tipe yang diinginkan).

---

## 6. Tombol & fungsi UI

### 6.1 Form create / edit (sidebar)

| Tombol / aksi | Fungsi |
|---------------|--------|
| **Save & Next** | Simpan header baru lalu lanjut ke detail |
| **Save All** | Simpan header (Draft/Open dari radio) |
| **Approve** | Setujui — hanya status **Open**, min 1 detail |
| **Print** (ikon) | Unduh PDF PO |
| **Void** (ikon) | Batalkan PO **Approved** (belum ada inbound) |
| **Closed** (ikon) | Tutup PO **Processed** — sisa qty tidak dilanjutkan |
| **Radio Draft / Open** | Pilih sebelum save; create biasanya mulai **Open** |

### 6.2 Section Detail

| Tombol / aksi | Fungsi |
|---------------|--------|
| **Available Product** | Modal outstanding PR (With PR) atau daftar produk (Without PR) |
| **Use** (per baris modal) | Buka form input qty, harga, unit, VAT |
| **Allocate Full Qty Clearing** | Isi sisa qty PR sekaligus (With PR) |
| **Import Detail** | Upload Excel massal |
| **Export Detail** | Download detail PO |
| Edit / Delete baris | Sebelum approved |

### 6.3 Datalist row actions

| Aksi | Kapan |
|------|-------|
| Edit / Delete | Draft, Open, Rejected |
| Approve | Open |
| Void | **Approved** (bukan draft/open) |
| Closed | **Processed** |
| Print | Semua status |

**Penting:** batalkan PO yang masih draft/open → **Delete**, bukan Void.

---

## 7. Import detail — panduan operator

Download template dari panel import (With PR / Without PR). Jika file tidak tersedia (404) — buat Excel manual mengikuti kolom di bawah, atau minta IT deploy template.

| Kolom | Isi | Wajib? |
|-------|-----|--------|
| A | Kode PR — **semua baris** isi atau **semua kosong** | Wajib jika With PR |
| B | System Product SKU | **Ya** |
| C | PO Qty (> 0) | **Ya** |
| D | Unit (kode exact) | **Ya** |
| E | Unit Price (≥ 1) | **Ya** |
| F | Disc. (%) | Opsional |
| G | Description | Opsional |
| H | Required Delivery Date (**Excel date**, bukan ketik teks) | Opsional |

VAT & warranty **tidak** di template — sistem isi otomatis.

**Aturan:** maks **500** baris; **satu baris salah** di validasi awal → **seluruh file batal**; tipe file harus cocok dengan detail PO yang sudah ada; bundle/random ditolak.

---

## 8. Basic Information — tips

| Field | Tips |
|-------|------|
| Supplier | Hanya muncul jika accounting setting **100% lengkap** |
| Currency / Payment | Auto dari supplier saat dipilih |
| Exchange Rate | Default **1** — ubah manual untuk mata uang asing |
| Your Ref | Max 50 karakter |

Setelah ada detail, **tanggal, supplier, currency, payment** terkunci.

---

## 9. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Supplier tidak muncul | Accounting belum lengkap | Lengkapi di General Company |
| Tidak bisa approve | Status Draft / belum Open | Set **Open** + save |
| Setelah reject sulit approve | Flow reject → draft | Set **Open** + save lagi |
| Void tidak muncul | PO masih draft/open | Gunakan **Delete** |
| Void gagal (sudah prepared) | Sudah ada inbound | Tidak bisa void — Close jika processed |
| Closed tidak muncul | Belum pernah inbound | Buat inbound dulu → **Processed** |
| Import type not match | File With PR vs PO Without PR | Kosongkan detail atau sesuaikan file |
| Kurs invalid | Currency primer tapi rate ≠ 1 | Set rate = 1 |
| PR tidak muncul | PR closed/complete atau qty habis | Cek status PR |

---

## 10. FAQ

**Q: Apakah qty boleh desimal?**  
A: Input manual: **bilangan bulat**. Import: boleh angka > 0 (termasuk desimal).

**Q: Berapa maksimal baris detail?**  
A: **500** baris.

**Q: Apakah void mengembalikan qty ke PR?**  
A: **Belum** — void PO approved saat ini **tidak** mengembalikan qty yang sudah dikunci di PR. Hapus detail sebelum approve akan mengembalikan qty yang masih direservasi.

**Q: Apakah print PDF sama dengan Net Purchase di layar?**  
A: **Belum selalu** — print **tidak include** Other Cost/Discount.

---

## Related Documents

| Doc | Path |
|-----|------|
| User Guide | [user-guide.md](./user-guide.md) |
| Requirement | [requirement.md](./requirement.md) |
| Technical | [technical.md](./technical.md) |
| Purchase Requisition | [../supplychain-purchase-requisition/knowledge-base.md](../supplychain-purchase-requisition/knowledge-base.md) |
| Purchase Inbound | [../supplychain-new-purchase-inbound/knowledge-base.md](../supplychain-new-purchase-inbound/knowledge-base.md) |
| Purchase Invoice | [../accounting-supplier-invoice/knowledge-base.md](../accounting-supplier-invoice/knowledge-base.md) |
