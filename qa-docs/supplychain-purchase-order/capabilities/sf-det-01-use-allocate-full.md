---
doc_type: menu-capability
menu: supplychain-purchase-order
id: SF-DET-01
title: Use / Allocate Full / Select Multiple
aliases:
  [
    use,
    allocate full,
    available product,
    outstanding PR,
    Select Multiple Products,
    Select Outstanding PR Products,
  ]
scope: menu
summary: >-
  Isi detail PO: Select Product, Available Products (Use / Allocate Full),
  Select Outstanding PR Products (checkbox With PR), atau Select Multiple Products (Without PR).
version: 1.2
last_updated: 2026-08-12
status: draft
---

# Use / Allocate Full / Select Multiple

## Apa ini

Cara mengisi detail Purchase Order. Ada jalur **satu-satu** (Select Product / Available Products → Use) dan jalur **checkbox bulk** (label berbeda per tipe PO).

## Kapan dipakai

- **With PR:** ambil dari outstanding PR — Use (isi qty/harga) **atau** centang banyak via **Select Outstanding PR Products**.
- **Without PR:** Select Product **atau** **Select Multiple Products** (qty 1).
- Butuh menghabiskan sisa qty PR di Single Use → **Allocate Full Qty Clearing**.

## Cara pakai

1. Pastikan header PO sudah tersimpan (supplier & tipe sudah dipilih) — halaman **edit**.
2. **With PR:**
   - **Available Products** → **Use** → isi qty/harga/VAT, atau
   - **Select Outstanding PR Products** → centang baris → Add (qty = sisa outstanding; harga otomatis).
3. **Without PR:**
   - **Select Product** (satu) atau **Select Multiple Products** (centang banyak, qty 1).
4. Ulangi sampai lengkap (max **500** baris).

## Catatan

- With PR: qty tidak boleh melebihi sisa outstanding PR.
- Input manual qty di form = **bilangan bulat**; import boleh desimal > 0.
- Jika pilihan modal membuat total > 500 → sistem **menolak seluruh** batch.
- Tombol multi-select tidak muncul di Show setelah Approved.
- Setelah PO approved, detail terkunci — edit/hapus hanya sebelum approve.
- **Pajak (TO-BE GAP-PO-11):** Allocate Full / bulk Use harus memakai **resolver tax yang sama** dengan add product — **AS-IS** Allocate Full sering **tanpa** tax line.

## Contoh

| Given | Aksi | Hasil |
|-------|------|--------|
| PR sisa 100 pcs | Use qty 40 | 40 masuk detail; sisa 60 |
| PR sisa 60 pcs | Select Outstanding PR Products (centang) | 60 masuk; outstanding habis |
| Without PR | Select Multiple Products → 3 SKU | 3 baris qty 1 |
| 498 baris + centang 5 | Add | Ditolak seluruhnya (>500) |

## Lihat juga

- [With PR / Without PR](#sf-lingo:SF-PO-01)
- [Import Detail](#sf-lingo:SF-IMP-01)
- Knowledge Base: [§6.2 Section Detail](../knowledge-base.md)
- Requirement [§5.6](../requirement.md#56-select-outstanding-pr-products--checkbox-bulk-to-be--gap-po-12) · [§6.1](../requirement.md#61-select-multiple-products--checkbox-bulk-to-be--gap-po-12)
