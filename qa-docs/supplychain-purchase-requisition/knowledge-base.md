---
doc_type: knowledge-base
menu: supplychain-purchase-requisition
menu_name: "Purchase Requisition"
version: 2.1
last_updated: 2026-07-05
owner: QA - Yemima
status: review
audience: operator
---

# Purchase Requisition — Knowledge Base

**Path:** SCM → **Purchase Requisition** (`/supplychain/purchase-requisition`)  
**Prefix dokumen:** `PR-`

---

## 1. Apa itu Purchase Requisition?

**Purchase Requisition (PR)** adalah permintaan pembelian barang internal. Setelah PR **disetujui**, team procurement bisa membuat **Purchase Order (PO)** yang mengacu ke PR tersebut.

PR **bukan** pesanan ke supplier — PR adalah langkah persetujuan internal sebelum PO.

---

## 2. Alur singkat

1. Buat PR → isi **Basic Information** → tambah **Detail** (SKU + qty)
2. Pastikan status **Open** → klik **Approve**
3. Setelah **Approved**, buat PO (With PR) dan ambil baris outstanding PR
4. Saat PR masuk PO → status **Processed**
5. PR **selesai** (tidak bisa ke PO baru lagi) lewat **dua jalur**:
   - **Complete** — otomatis sistem saat semua qty sudah ke PO approved
   - **Closed** — manual: klik **Closed** dari datalist saat masih **Processed** (sisa qty tidak dilanjutkan)

---

## 3. Status — arti untuk operator

| Status | Arti | Bisa ubah data? |
|--------|------|-----------------|
| **Draft** | Masih disusun / baru duplicate / setelah reject + ada perubahan detail | Ya |
| **Open** | Siap diajukan approve | Ya |
| **Approved** | Sudah disetujui — siap diproses ke PO | Tidak |
| **Rejected** | Ditolak approver — perlu perbaikan | Ya |
| **Processed** | Sudah masuk PO (sebagian atau seluruhnya) | Tidak |
| **Complete** | **Selesai otomatis** — semua qty sudah terpenuhi di PO approved | Tidak |
| **Closed** | **Selesai manual** — Anda menutup PR yang masih Processed | Tidak |
| **Void** | Dibatalkan dari Approved | Tidak |

> **Complete vs Closed — keduanya artinya PR selesai:**
> - **Complete** = sistem mendeteksi semua qty PR sudah masuk PO yang approved (tidak perlu klik apa pun).
> - **Closed** = Anda sengaja menutup PR yang masih **Processed** karena sisa qty tidak akan dilanjutkan ke PO.
>
> Setelah **Complete** atau **Closed**, PR **tidak muncul lagi** di outstanding PO dan tidak bisa diedit.

---

## 4. Datalist — fitur utama

- **Cari SKU di dalam PR:** gunakan Advanced Filter kolom **Product** (kolom tersembunyi)
- **Export:** With Details / Without Details / This Page Only — cek tab Export File untuk download
- **Bulk Approve:** centang beberapa PR Open → approve massal
- **Show Deleted:** tampilkan PR yang sudah dihapus

---

## 5. Tombol & fungsi UI

### 5.1 Halaman create / edit

| Tombol | Fungsi |
|--------|--------|
| **Save All** | Simpan header (termasuk pilihan Draft/Open) |
| **Save & Next** | Simpan lalu pindah section |
| **Approve** | Setujui PR — hanya saat status **Open** dan ada minimal 1 detail |
| **Import Detail** | Upload Excel template detail |
| **Export Detail** | Download detail PR (xlsx/csv) |
| **Print** (ikon) | Unduh PDF PR |
| **Duplicate** (ikon) | Salin PR → PR baru status **Draft** (kode baru, tanpa lampiran) |
| **Void** | Batalkan PR **Approved** |
| **Close** | Tutup PR **Processed** — **gunakan aksi Closed di datalist** (lihat catatan §7) |

**Radio Draft / Open:** Pilih **Open** sebelum approve. Setelah **Reject**, sistem bisa menampilkan Draft — ubah ke **Open** lalu save sebelum approve lagi.

### 5.2 Section Detail

| Tombol / aksi | Fungsi |
|---------------|--------|
| Pilih product (multiselect) | Tambah SKU cepat (qty 1) |
| Edit inline / modal | Ubah qty, unit, description |
| Delete baris | Hapus detail |
| Import | Mass upload dari template |

Edit/Delete detail **hanya** sebelum PR **Approved**.

### 5.3 Datalist row actions

| Aksi | Kapan muncul |
|------|--------------|
| Edit | Draft, Open, Rejected |
| Approve | Open |
| Delete | Draft, Open |
| Void | Approved |
| Closed | Processed |
| Print | Semua status |

---

## 6. Import detail — panduan operator

### Template

Download: **Template-Import-Detail-PR.xlsx** (tombol download di panel import).

Baris 1 = header (jangan diubah). Baris 2 ke bawah = data produk.

| Kolom | Header exact | Wajib? | Cara isi |
|-------|--------------|--------|----------|
| A | `Product ID` | Salah satu A atau B | ID angka dari System Product |
| B | `System Product SKU` | Salah satu A atau B | Kode SKU — dipakai jika ID tidak ketemu |
| C | `Qty` | **Ya** | Angka minimal 1 (boleh desimal) |
| D | `Unit` | **Ya** | Kode unit sesuai master product |
| E | `Description` | Opsional | Catatan baris detail |

### Validasi file (sebelum baris diproses)

| Kondisi | Apa yang terjadi |
|---------|------------------|
| File bukan `.xlsx` / `.xls` | Upload ditolak |
| Header bukan 5 kolom persis | Gagal — "The file format doesn't match the system template." |
| Label header salah | Gagal — "Import failed. The file format doesn't match the system template." |
| Hanya header, tidak ada data | Gagal — "The imported file is empty. Please add at least one product." |
| Baris import + detail existing > **100** | Gagal — "This transaction have more than 100 details." |
| Import lain masih berjalan | Tunggu selesai — "Please wait, other import is being process" |

### Validasi per baris

Semua baris dicek dulu. **Jika ada satu baris salah, seluruh file dibatalkan** — tidak ada baris yang masuk.

| Kesalahan | Contoh pesan di Import Log |
|-----------|---------------------------|
| Product ID & SKU kosong | `row 3: Product ID or System Product SKU is empty.` |
| Product ID bukan angka | `row 2: abc Please fill in this column using the product_id...` |
| Produk tidak ditemukan | `row 4: SKU123 Product is not found.` |
| Qty kosong | `row 5: Qty is empty.` |
| Qty bukan angka | `row 6: 'abc' Invalid data type. The value must be an integer or a double.` |
| Qty < 1 | `row 7: '0' The quantity field must be at least 1.` |
| Unit kosong | `row 8: Unit is empty.` |
| Unit tidak terdaftar di product | `row 9: 'BOX' The unit entered is not available or not set up...` |
| Alternate unit nonaktif | `row 10: The selected unit is inactive.` |

**Produk yang tidak boleh:** bundle child, SKU random — tidak akan ditemukan di lookup import.

### Duplicate SKU

| Situasi | Perilaku |
|---------|----------|
| SKU sama 2× dalam 1 file | **2 baris detail terpisah** — qty tidak digabung |
| SKU sudah ada di PR + import SKU sama | **Baris baru** ditambah — tidak merge ke baris lama |

### Dua fase import

1. **Validasi (langsung):** Semua baris dicek. Ada error → 0 insert, cek **Import Log**.
2. **Proses queue (background):** Baris valid di-insert satu per satu. Jika job individual gagal di database, baris lain yang sudah sukses **tetap tersimpan**.

### Setelah import

- Sukses: notifikasi "Purchase Requisition imported successfully"
- Gagal validasi: "The import failed. Please check the import log for details."
- PR sebelumnya **Rejected** → status berubah ke **Draft**

---

## 7. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Tidak bisa approve | Status Draft / belum Open / tidak ada detail | Set Open + save; tambah detail |
| Reject tidak bisa langsung approve lagi | Flow: reject → edit → draft | Set **Open** + save, lalu approve |
| Tidak bisa ubah tanggal / priority | Sudah ada detail | Hapus detail dulu atau buat PR baru |
| Import gagal format | Header template salah | Pakai template resmi |
| Import melebihi limit | >100 baris total | Split ke beberapa PR |
| Close dari form gagal | Known issue dialog form | Gunakan **Closed** di **datalist** |
| Duplicate tidak pindah halaman | By design FE | Buka PR baru manual dari datalist |
| PR kembali Approved setelah PO dihapus | Revert otomatis | Normal jika qty PO kembali 0 |

---

## 8. FAQ

**Q: Berapa maksimal SKU per PR?**  
A: **100 baris detail** (manual add + import digabung).

**Q: Apakah qty boleh desimal?**  
A: Input manual di grid: **hanya bilangan bulat**. Import Excel: boleh desimal asal ≥ 1.

**Q: Bisakah hapus PR Rejected?**  
A: **Tidak** — delete hanya Draft/Open.

**Q: Kapan PR dianggap selesai?**  
A: **Complete** (otomatis, qty full ke PO) atau **Closed** (manual dari Processed). Keduanya tidak bisa diproses ke PO baru.

**Q: Apakah priority mempengaruhi sistem?**  
A: Tidak — hanya informasi untuk procurement.

---

## Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Technical | [technical.md](./technical.md) |
| Purchase Order | [../supplychain-purchase-order/knowledge-base.md](../supplychain-purchase-order/knowledge-base.md) |
