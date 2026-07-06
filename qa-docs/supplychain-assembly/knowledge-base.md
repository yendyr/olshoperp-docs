---
doc_type: knowledge-base
menu: supplychain-assembly
menu_name: "Assembly"
version: 2.1
last_updated: 2026-07-04
owner: QA - Yemima
status: review
audience: operator
sections:
  core: [what-is, glossary, workflow, ui-buttons, import, troubleshooting, faq]
---

# Assembly — Knowledge Base

## Apa itu Assembly?

**Assembly** (kode dokumen `AS-*`) adalah transaksi produksi internal untuk merakit **barang jadi** (Header BOM / finish goods) dari **komponen** yang didefinisikan di Bill of Material. Di backend sistem, fitur ini diimplementasikan sebagai **Work Order**.

| Item | Nilai |
|------|-------|
| Menu | Supply Chain → Operations → Assembly |
| Route UI | `/supplychain/assembly` |
| Kode dokumen | `AS-*` (auto-generate) |
| API | `supplychain/work-order` |

### Nilai Bisnis

- Mencatat konversi bahan baku/komponen menjadi barang jadi
- Audit trail lengkap: 1 Assembly → Transfer Internal + Outbound + Inbound
- Snapshot BoM saat transaksi — edit BoM tidak mengubah Assembly yang sudah Open

---

## Glosarium

| Istilah | Arti |
|---------|------|
| Finish Goods (FG) | Produk jadi / Header BOM yang dirakit |
| Building Origin | Gudang building tempat komponen diambil (field form) |
| WIP Warehouse | Work In Progress — buffer produksi; dari Warehouse Setting |
| Finish Good Warehouse | Tujuan stok barang jadi; dari Warehouse Setting |
| BoM Snapshot | Copy komposisi BoM di `scm_work_order_bill_of_materials` |
| Progress Status | Persentase detail yang selesai diproses job approval |
| Max Assembly Qty | Qty maksimum yang bisa dirakit berdasarkan stok komponen |

---

## Prasyarat

Sebelum buat Assembly, pastikan:

1. **Bill of Material** — SKU FG sudah Header BOM **Active** dengan komposisi valid (min 2 komponen ATAU qty > 1)
2. **Warehouse Setting** — Building Origin punya WIP dan Finish Good warehouse dikonfigurasi
3. **Product COA** — FG dan semua komponen punya COA **Work In Progress** dan **Inventory**
4. **Stok komponen** — Tersedia di building tree (termasuk child warehouse, exclude In Transit & virtual)

---

## Alur Kerja Operator

### Langkah 1 — Buat Assembly (Draft)

1. Buka **Supply Chain → Assembly → Create**
2. Isi **Basic Information:**
   - Transaction Date (wajib, tidak boleh future)
   - **Building Origin** (wajib) — hanya building dengan WIP & FG configured
   - **Start Date** (wajib, ≥ transaction date)
   - **Type** (wajib) — Production / Service / Assembly / Other
   - Description (opsional, max 150)
3. Klik **Save & Next** → redirect ke halaman edit

### Langkah 2 — Tambah Detail Produk Jadi

1. Di section **Assembly Detail**, pilih produk FG dari dropdown **Select Product**
   - Sistem auto-add baris qty = 1 via bulk-fifo (validasi stok)
2. Atau **Import Excel** (hanya saat Draft):
   - Download template → isi Product ID/SKU, Qty, Unit → Upload
3. Edit **QTY** (integer only — tidak bisa desimal) dan **UNIT** per baris (inline edit, Draft only)
4. Expand baris → lihat **komponen BoM** + availability via BundleProductForm
5. **Max Assembly Qty** menunjukkan batas qty berdasarkan komponen paling sedikit

> 1 SKU FG hanya boleh 1 baris per Assembly. Qty input **bulat saja** — UI memblok desimal.

### Langkah 2b — Sub-Assembly (Nested BOM)

Jika komponen BoM juga Header BOM lain (sub-assembly):

1. **Assembly child BOM dulu** (mis. SKU-SUB-B) → hasilkan stok FG child
2. Baru **Assembly parent BOM** (mis. SKU-JADI-A) yang consume SKU-SUB-B sebagai komponen

Sistem **tidak** auto-bongkar sub-assembly menjadi komponen level lebih dalam.

### Langkah 3 — Set Status Open

1. Di sidebar kanan, pilih radio **Open**
2. Sistem akan:
   - Validasi stok semua komponen
   - Snapshot BoM
   - Generate **Transfer Internal** (Building → WIP), status open
3. Jika stok tidak cukup → status tetap/revert **Draft** + pesan error

> **Penting:** Detail tidak bisa diedit setelah Open. Hanya bisa Approve atau Reject.

### Langkah 4 — Approve

1. Pastikan tidak ada **error flag** di detail
2. Klik **Approve** (sidebar) → isi approval modal → Submit
3. Sistem dispatch job async per detail:
   - Approve Transfer Internal
   - Generate + approve Outbound (konsumsi komponen di WIP)
   - Generate + approve Other Inbound (barang jadi masuk FG warehouse)
4. Monitor **Progress Status** — target 100%
5. Jika stuck → tunggu 2 menit, gunakan **Retry** dari datalist

### Langkah 5 — Monitor & Cetak

- **Histories** (sidebar) — timeline dokumen generated (TFI, Outbound, Inbound)
- **Approval** (sidebar) — log approval
- **Print** — label SKU / BOX / SID (Stock ID, approved only)

---

## Panduan Tombol & Fitur UI

### Datalist

| Tombol | Fungsi |
|--------|--------|
| **Create** | Buat Assembly baru |
| **Edit** (✏️) | Buka form edit |
| **Delete** (🗑️) | Hapus Assembly Draft/Open |
| **Approve** (✓✓) | Approve Assembly status Open |
| **Print** | Cetak header PDF |
| **Retry** | Ulangi job approval jika progress < 100% |
| **Export All** | Export with/without details / active page |
| **Bulk Approve / Delete** | Multi-select checkbox |

### Form — Basic Information

| Field | Keterangan |
|-------|------------|
| Transaction Code | Kosongkan untuk auto `AS-*` |
| Transaction Date | Wajib; butuh fiscal period active |
| Building Origin | WIP tooltip: FIFO tidak apply ke outrack & WIP |
| Start Date | Tanggal mulai produksi |
| Type | Kategori assembly |
| Progress Status | Auto — jangan edit manual |
| Draft / Open radio | Switch status; Open trigger validasi stok |

| Tombol | Fungsi |
|--------|--------|
| **Save & Next** | Simpan header baru |
| **Save All** | Update header |
| **Approve** | Buka modal approval (hanya status Open) |

### Form — Assembly Detail

| Fitur | Draft | Open | Approved |
|-------|-------|------|----------|
| Select Product (add) | ✓ | ✗ | ✗ |
| Edit QTY/UNIT | ✓ | ✗ | ✗ |
| Delete row | ✓ | ✗ | ✗ |
| Import Excel | ✓ | ✗ | ✗ |
| Download Template | ✓ | ✗ | ✗ |
| Print SKU/BOX/SID | ✓ | ✓ | ✓ |
| Expand BoM components | ✓ | ✓ (snapshot) | ✓ (snapshot) |

---

## Import Detail Excel

### Template

File: **`Template-Import-Assembly.xlsx`** (download dari form detail, Draft only)

| Kolom | Isi |
|-------|-----|
| Product ID | ID numerik dari System Product |
| System Product SKU | SKU (fallback jika Product ID invalid) |
| Qty | Angka bulat > 0 (desimal diblok di UI) |
| Unit | Kode unit (harus primary/alternate unit produk) |

### Aturan

- Header row **harus exact match** — jangan ubah nama kolom
- Minimal 1 baris data
- SKU harus Header BOM Active
- SKU duplikat dalam 1 Assembly → error
- Max baris = `config max_child` (default cek dengan admin)
- Import hanya saat status **Draft**
- Monitor progress via Import Log / Import History

> **Tidak ada template per platform** — hanya tipe `general`.

---

## Do's and Don'ts

### Do's

| Do | Alasan |
|----|--------|
| Konfigurasi WIP + FG di Warehouse Setting dulu | Wajib sebelum Open/Approve |
| Pastikan COA WIP & Inventory lengkap | Validasi saat Open & Approve |
| Set Open sebelum Approve | TFI harus di-generate dulu |
| Cek Max Assembly Qty sebelum set qty besar | Batasi oleh komponen paling sedikit |
| Gunakan Retry jika progress stuck > 2 menit | Job async bisa gagal partial |

### Don'ts

| Don't | Alasan |
|-------|--------|
| Jangan edit detail setelah Open | Locked — harus Reject/revert Draft dulu |
| Jangan expect nested BoM auto-explode | Sub-assembly harus di-Assembly terpisah dulu |
| Jangan pilih building tanpa WIP/FG | Tidak muncul di selector |
| Jangan approve jika ada error flag merah | Blocked by validation |
| Jangan input qty desimal | UI memblok; gunakan unit alternate jika perlu qty berbeda |

---

## Troubleshooting

| Gejala | Kemungkinan Penyebab | Tindakan |
|--------|---------------------|----------|
| SKU tidak muncul di selector | BoM inactive / COA belum lengkap / composition rule violated | Perbaiki di Bill of Material & Product COA |
| Tidak bisa set Open | Stok komponen kurang | Cek inbound/transfer ke building; lihat availability di expand row |
| Open gagal: WIP/FG belum configured | Warehouse Setting kosong | Atur di Warehouse Setting untuk building tersebut |
| Approve gagal: COA | Produk tanpa WIP/Inventory COA | Perbaiki Product COA Group |
| Approve gagal: inactive component | BoM berisi produk inactive | Aktifkan produk atau update BoM |
| Progress stuck / generating | Job masih berjalan atau gagal | Tunggu 2 menit → Retry; cek error flag per detail |
| Transfer qty does not match | Inkonsistensi TFI vs BoM qty | Revert Draft → fix qty → Open ulang |
| Import gagal format | Header kolom diubah | Download ulang template, jangan edit header |
| Tidak bisa delete | Status bukan Draft/Open | Hanya Draft/Open yang bisa dihapus |

---

## FAQ

**Q: Apa beda Building Origin dengan Finish Good warehouse?**  
A: Building Origin = gudang komponen (user pilih). Finish Good = gudang barang jadi (otomatis dari Warehouse Setting, bukan field form).

**Q: Kenapa harus Open dulu sebelum Approve?**  
A: Open membuat Transfer Internal untuk memindahkan/reserve komponen ke WIP. Approve menyelesaikan konsumsi + penerimaan FG.

**Q: Apa yang terjadi jika BoM diedit setelah Assembly dibuat?**  
A: Saat Open/Approve, snapshot di-update dari live BoM. Assembly Approved tidak terpengaruh.

**Q: Bisa assembly beberapa FG sekaligus?**  
A: Ya — tambah multiple detail lines (1 SKU unik per line).

**Q: Apakah Assembly dipicu dari Sales Order?**  
A: Tidak — saat ini standalone; tidak ada auto-trigger dari SO.

**Q: Bisa import bulk create Assembly dari datalist?**  
A: Belum — pending development. Saat ini import hanya **detail FG** dari form edit (Draft).

**Q: Bisa input qty desimal?**  
A: Tidak dari UI. Max Assembly Qty dihitung sistem via konversi multi-unit lalu di-round ke bulat.

---

## Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Technical | [technical.md](./technical.md) |
| Bill of Material | [../bill-of-material/knowledge-base.md](../bill-of-material/knowledge-base.md) |
| Transfer Internal | [../supplychain-mutation-transfer-internal/knowledge-base.md](../supplychain-mutation-transfer-internal/knowledge-base.md) |
| Other Inbound | [../supplychain-other-inbound/knowledge-base.md](../supplychain-other-inbound/knowledge-base.md) |
| Warehouse Setting | [../supplychain-setting/knowledge-base.md](../supplychain-setting/knowledge-base.md) |
| Master Unit | [../supplychain-unit/knowledge-base.md](../supplychain-unit/knowledge-base.md) |
