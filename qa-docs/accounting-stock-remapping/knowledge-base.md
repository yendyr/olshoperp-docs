---
doc_type: knowledge-base
menu: accounting-stock-remapping
menu_name: "Stock Remapping"
version: 1.0
last_updated: 2026-07-09
owner: QA - Yemima
status: review
audience: operator
aliases: [Stock Remapping, Stock Acak, Stock Conversion, remapping stok, RM]
sections:
  core: [what-is, how-to, warehouse, sku-rules, approval, import, troubleshooting, faq]
---

# Stock Remapping — Knowledge Base

> **Audience:** Tim **Finance / Accounting** dan supervisor gudang yang diberi akses FA. Menu ini **bukan** menu SCM biasa — mengandung **nilai unit price** yang tidak ditampilkan ke operator gudang tanpa permission FA.

---

## 1. Apa itu Stock Remapping?

**Stock Remapping** (alias **Stock Acak**) adalah transaksi untuk **memindahkan identitas stok** dari satu SKU variant ke SKU variant lain **dalam parent yang sama** — tanpa membuat Stock Deduction dan Stock Addition manual terpisah.

| Item | Nilai |
|------|-------|
| Menu | Finance Accounting → **Stock Remapping** |
| Route | `/accounting/stock-remapping` |
| Kode transaksi | Prefix **`RM-`** |
| Use case utama | Sortir barang impor SKU acak (mixed container) menjadi variant sesungguhnya |

**Bukan ini:** Unit Conversion (konversi satuan, mis. Lusin → PCS). Stock Remapping = ubah **identitas SKU**, bukan satuan.

### Contoh operasional

```
Pembelian: 1.000 pcs SKUPENSIL-acak
Setelah sortir:
  200 → SKUPENSIL-pink
  300 → SKUPENSIL-blue
  500 → SKUPENSIL-white

→ 1 transaksi Stock Remapping dengan 3 baris detail
→ sistem generate 6 dokumen (3× Deduction + 3× Addition) otomatis
```

---

## 2. Siapa yang pakai menu ini?

| Role | Akses tipikal |
|------|----------------|
| **Finance / Accounting** | Full — termasuk kolom **Unit Price** dan total amount |
| **Operasional gudang (SCM)** | **Tidak** memiliki menu ini di modul SCM — hindari exposure nilai barang |
| **Supervisor** | Sesuai role privilege FA |

---

## 3. Cara membuat transaksi

### Basic Information

| Field | Keterangan |
|-------|------------|
| Transaction Code | Auto `RM-` |
| Transaction Date | Auto = sekarang |
| **Warehouse Origin** | **Wajib** — autofill dari transaksi terakhir |
| Trx Ref | Opsional |
| Description | Opsional |

**Autosave:** Mengikuti pola Purchase Inbound — transaksi tersimpan saat create jika field wajib terisi. Jika warehouse belum pernah dipakai (NULL), sistem minta isi Warehouse Origin dulu.

### Baris detail (Remapping Detail)

| Field | Editable? | Keterangan |
|-------|-----------|------------|
| SKU Origin | Ya | Variant asal — boleh duplikat antar baris |
| Remapped To | Ya | Variant tujuan — 1 parent, bukan random, tidak self-remap |
| Qty | Ya | Tidak boleh melebihi sisa stok origin |
| Unit | Ya | Default primary unit parent |
| **Unit Price** | **Tidak** | Otomatis dari nilai stock ID origin — **hanya tampil di FA** |
| Description | Ya | Opsional |

---

## 4. Aturan SKU

| Rule | Detail |
|------|--------|
| Tipe | Hanya **Variant** dalam 1 **Parent** |
| Status | SKU **Active** saja |
| COA Group | Hanya **Purchased Item** & **Manufactured Item** |
| Random (`-random`) | **Diblok** — tidak bisa origin maupun remapped to |
| Self-remap | Origin = Remapped To → **ditolak** |
| Remapped To unik | Satu variant tujuan hanya sekali per transaksi |

---

## 5. Approve — apa yang terjadi?

Setelah **Approve**, per baris (berurutan, tidak paralel):

1. **Stock Deduction** (`AO`) auto-approved — SKU Origin, qty berkurang
2. **Stock Addition** (`AI`) auto-approved — SKU Remapped To, stock ID baru dengan **unit price sama** origin

Trx date Addition = trx date transaksi RM **+ 10 detik** per baris.

Sebelum approve, qty origin masuk kolom **`reserved`** di stock ID (stok di-hold).

---

## 6. Import detail

Template **5 kolom** (tanpa Unit Price):

| Kolom | Wajib |
|-------|-------|
| SKU Origin | Ya |
| Remapped To SKU | Ya |
| Qty | Ya |
| Unit | Opsional |
| Description | Opsional |

- Validasi **sequential** atas ke bawah — quota origin diakumulasi per baris
- Partial import: baris valid tetap masuk, baris gagal di error log
- File upload disimpan max **1 hari** untuk reproduce

---

## 7. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Autosave gagal saat create | Warehouse Origin NULL | Isi warehouse |
| Qty ditolak | Melebihi availability origin | Kurangi qty atau cek baris lain pakai SKU origin sama |
| Remapped To tidak muncul | Random, self-remap, atau sudah dipakai baris lain | Pilih variant lain |
| SKU ditolak | Inactive / Service / Asset / random | Cek master System Product & COA Group |
| Import baris akhir gagal | Total qty melebihi stok (sequential) | Urutkan qty besar dulu atau split transaksi |
| Tidak lihat Unit Price | Role tanpa akses FA | Menu hanya di modul Accounting |

---

## 8. FAQ

**Q: Kenapa menu ada di Finance Accounting, bukan Supply Chain?**  
A: Karena ada **nilai unit price** per baris. Tim gudang operasional tidak boleh melihat nilai persediaan — kontrol akses lewat modul FA.

**Q: Apakah sama dengan Stock Opname atau Adjustment manual?**  
A: Tidak. Remapping khusus **ubah identitas variant** dalam 1 parent; sistem yang generate Deduction + Addition.

**Q: Bisa remap ke parent berbeda?**  
A: **Tidak.** Origin dan Remapped To harus variant dari **parent yang sama**.

**Q: Bisa pakai SKU `-random`?**  
A: **Tidak** — random diblok di semua posisi. Lihat [Random SKU](../random-sku/knowledge-base.md).

**Q: Apakah saya bisa edit Unit Price?**  
A: **Tidak** — diisi otomatis dari stock ID origin.

**Q: Dokumen AO/AI bisa diedit manual?**  
A: Diharuskan auto-generated dari approve Stock Remapping — jangan buat manual untuk kasus yang sama (hindari double movement).

---

## Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Technical | [technical.md](./technical.md) |
| Pending items | [requirement.md §15](./requirement.md#15-hal-yang-perlu-diperhatikan--pending-items) |
