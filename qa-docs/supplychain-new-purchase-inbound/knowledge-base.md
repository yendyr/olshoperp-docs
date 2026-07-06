---
doc_type: knowledge-base
menu: supplychain-new-purchase-inbound
menu_name: "BETA - New Purchase Inbound"
version: 2.1
last_updated: 2026-07-05
owner: QA - Yemima
status: review
audience: operator
sections:
  core: [what-is, workflow, colli, ui-buttons, import, troubleshooting, faq]
---

# Purchase Inbound (GRN) — Knowledge Base

## 1. Apa itu Purchase Inbound?

**Purchase Inbound** (GRN — Goods Receipt Note) mencatat **barang masuk ke gudang** dari supplier berdasarkan **Purchase Order** yang sudah disetujui.

| Item | Nilai |
|------|-------|
| Menu (BETA) | Supply Chain → Inbound → **BETA - New Purchase Inbound** |
| Route | `/supplychain/new-purchase-inbound` |
| Kode dokumen | `IN-…` |
| API | `supplychain/mutation-inbound` |

> Menu **Purchase Inbound** lama (`/supplychain/mutation-inbound`) memakai API yang sama — UI berbeda.

---

## 2. Kapan dipakai?

- Barang dari supplier sudah datang fisik ke gudang.
- Ada **PO approved/processed** dengan sisa qty belum diterima.
- **Setelah PO approve** — bukan saat PR saja.

---

## 3. Alur operator

### Step 1 — Buat header

1. Klik **Create**.
2. Isi **Supplier** (hanya yang punya PO outstanding).
3. Pilih **Warehouse** tujuan (gudang fisik level terendah).
4. Set **Transaction Date** (≤ hari ini, dalam periode fiskal aktif).
5. Simpan sebagai **Open** (atau Draft dulu).

### Step 2 — Tambah barang dari PO

1. Panel **Outstanding PO** — cari SKU/PO.
2. **Bulk Use** — pilih banyak baris, qty auto max sisa PO.
3. **Single Use** — modal untuk input detail (batch, serial, expired).
4. Atau **Select Product** — shortcut tambah 1 SKU.

### Step 3 — Isi detail keranjang

- Edit **Inbound Qty**, unit, batch, lokasi di tabel.
- Validasi: qty tidak boleh melebihi **sisa PO**.
- Produk serial: 1 baris per 1 pcs (max 50 sekaligus).

### Step 4 — Approve

1. Klik **Approve** — stok masuk + jurnal otomatis.
2. PO partial → status **Processed**; full semua baris → **Complete**.

---

## 4. Fitur COLLI (kemasan koli)

Untuk barang dikemas per **koli** (box/pallet):

1. Aktifkan **Group view** di detail section.
2. Kolom **COLLI & Inbound Qty**:
   - Atas: `10 COLLI @ 5 [Unit]`
   - Bawah: Inbound Qty (auto = 10 × 5 = 50)
3. **Isi per Colli** auto dari transaksi terakhir SKU yang sama.
4. Saat Approve — sistem buat **1 Stock ID per koli** (background job).
5. Pantau kolom **Item Stock Status** di datalist (% progress).
6. Jika gagal → notifikasi error → status kembali Open → **Approve ulang**.

**Tanpa COLLI (colli = 0):** input Inbound Qty manual seperti biasa.

---

## 5. Tombol & aksi

| Tombol | Fungsi |
|--------|--------|
| **Create** | Header GRN baru |
| **Approve** | Post stok + jurnal (open only) |
| **Reject** | Tolak dokumen open |
| **Delete** | Hapus draft/open (revert qty prepared di PO) |
| **Export** | Excel with/without details |
| **Import** | Upload Excel (standard atau template colli) |
| **Print** | PDF GRN |
| **Print RIR** | Receiving Inspection Report |
| **Allocate Full Qty** | Ambil sisa PO penuh (modal) — atasi selisih desimal unit |

---

## 6. Import Excel

Template:
- Standard — kolom PO, SKU, Qty, Unit, (+ batch/serial/expired)
- **Colli** — `Template-Import-Inbound-colli.xlsx`

Aturan: PO harus approved, SKU harus ada di PO, qty ≤ sisa.

---

## 7. Aturan penting

| Rule | Detail |
|------|--------|
| Supplier lock | Tidak bisa ganti supplier/WH/tanggal jika sudah ada detail |
| Qty cap | Tidak melebihi sisa PO per baris |
| Expired | Wajib jika product flag ON |
| Batch | Wajib jika product default batch ON |
| Serial | Auto SN atau input manual |
| Pajak | **Tidak** di GRN — di Supplier Invoice |
| Jurnal | By Product COA Group type — lihat tabel di bawah |
| **Service** | **Tidak** generate Stock ID — jasa |
| **Fix Asset** | Generate Stock ID + jurnal Dr **Assets** / Cr Unbilled Goods |
| **Purchased/Manufactured** | Generate Stock ID + jurnal Dr **Inventory** / Cr Unbilled Goods |

### Jurnal per Product COA Group type

| Type | Stock ID? | Debit | Credit |
|------|-----------|-------|--------|
| Purchased / Manufactured Item | ✅ | Inventory | Unbilled Goods |
| Fix Asset | ✅ | **Assets** | Unbilled Goods |
| Service | ❌ | Operational Expense | Unbilled Goods |

---

## 8. Troubleshooting

| Gejala | Penyebab | Tindakan |
|--------|----------|----------|
| Supplier kosong | Tidak ada PO approved | Approve PO dulu |
| Qty exceed outstanding | Input > sisa PO | Kurangi qty / cek GRN lain |
| Approve: no detail | Keranjang kosong | Tambah baris dari outstanding |
| Approve: COA error | Product COA Group incomplete | Lengkapi Inventory + Unbilled Goods |
| COLLI stuck loading | Background job | Tunggu / cek Item Stock Status; re-approve jika error |
| Cannot delete detail | Linked colli | Hapus colli dulu atau edit colli=0 |
| PO sudah closed | Sisa qty di-close manual | Tidak bisa inbound sisa |
| Void tidak jalan | Bug UI | Hubungi dev — void belum wired di API |

---

## 9. FAQ

**Q: Beda BETA vs Purchase Inbound lama?**  
A: BETA punya fitur **COLLI** + UI baru. Backend sama.

**Q: Partial receiving?**  
A: Ya — beberapa GRN per PO sampai qty penuh.

**Q: Kapan PO complete?**  
A: Otomatis saat semua baris PO fully received (processed_to_grn = order qty).

**Q: Apakah GRN posting VAT?**  
A: Tidak. VAT di **Supplier Invoice**.

**Q: SKU type Service — ada Stock ID?**  
A: **Tidak.** Jasa tidak generate stok; jurnal Dr Operational Expense / Cr Unbilled Goods.

**Q: SKU type Fix Asset — jurnal beda?**  
A: Ya. Dr **Assets** (bukan Inventory), Cr Unbilled Goods — tetap generate Stock ID dengan flag fix asset.

**Q: Random SKU bisa inbound?**  
A: Tidak.

---

## Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Purchase Order | [../supplychain-purchase-order/knowledge-base.md](../supplychain-purchase-order/knowledge-base.md) |
