# Test Case — ETM-15495 Expand Variant Group (Leftover + Stok)

**Referensi card:** [ETM-15495](https://erpintegration.atlassian.net/browse/ETM-15495)  
**Scope kartu:** `GAP-SP-18` — expand Variant Group pada System Product **existing** yang child-nya sudah punya **stok / relasi**

**Bukan scope kartu ini:** Default Variant create/import (`GAP-SP-17`) → [ETM-15512](https://erpintegration.atlassian.net/browse/ETM-15512)

**Menu:** SCM → **System Product** — Edit **Enable Variations**  
**URL:** https://staging.olshoperp.com/supplychain/product  
**Environment:** Staging only (comment dev 13/08/26)

**Docs:** `qa-docs/system-product/requirement.md` §6.3.2 · `qa-docs/accounting-stock-remapping/requirement.md`

---

## Overview (ringkas)

### Pain point user
SKU variant yang **sudah punya stock** harus tetap bisa ditambah **Variant Group/type** baru. **Stock ID** pada SKU lama **tidak boleh berubah nilainya**.

### AS-IS
- Tambah Variant Group ditolak jika child `haveRelations()` → `Cannot add variant, Product already have relations`
- Tanpa relasi: child lama soft delete + regenerate (ID baru)

### TO-BE
| Child lama | Soft delete? | Generate kombinasi baru | Hasil |
|------------|--------------|-------------------------|--------|
| Zero relation | Ya | Ya | Bersih (ID/SKU baru) |
| Punya relasi / stok dipakai transaksi | Tidak | Ya — semua kombinasi | **Leftover Active** + SKU baru |

Aturan kunci: **no auto-rename**, **no auto stock remap**, **confirm popup** wajib saat leftover, max **3** variant types.

### Contoh expand
Produk 1 group Warna (`biru`, `hijau`), child sudah stok. Tambah Motif (`doraemon`, `pikacu`):

```text
PARENT-biru                 ← leftover (stok tetap)
PARENT-hijau                ← leftover
PARENT-biru-doraemon        ← new (stok 0)
PARENT-hijau-doraemon       ← new
PARENT-biru-pikacu          ← new
PARENT-hijau-pikacu         ← new
```

---

## Daftar TC (file terpisah)

| TC | File | Fokus | Priority |
|----|------|-------|----------|
| TC-01 | [TC-01.md](./TC-01.md) | Expand + stok → tidak hard-block, leftover + SKU baru | High |
| TC-02 | [TC-02.md](./TC-02.md) | Confirm popup leftover — Cancel vs Confirm | High |
| TC-03 | [TC-03.md](./TC-03.md) | Stok tetap di leftover; SKU baru stok 0; tidak auto-rename | **Highest** |
| TC-04 | [TC-04.md](./TC-04.md) | Naming SKU baru `{parent}-{opt}` existing | Medium |
| TC-05 | [TC-05.md](./TC-05.md) | Max 3 variant types setelah expand | Medium |
| TC-06 | [TC-06.md](./TC-06.md) | Zero relation → soft delete + regenerate (bukan leftover) | High |
| TC-07 | [TC-07.md](./TC-07.md) | Stok saja tanpa relasi dokumen → soft delete (bukan leftover) | High |
| TC-08 | [TC-08.md](./TC-08.md) | Regresi: hard-block lama tidak muncul | High |

---

## Precondition global

| Item | Nilai |
|------|-------|
| Environment | Staging |
| Login | `playwright@gmail.com` / `12345678` |
| Company uji | FAT (112) — atau lumicharmsid (153) jika data staging tersedia |
| User | Privilege create/update System Product |
| Master Variant | Group **Warna** (min 2 opsi) + **Motif** atau **Ukuran** (min 2 opsi) |
| SKU uji | **Baru** — prefix `ETM15495-P{n}-{stamp}`; jangan pakai produk produksi |

---

## Matriks AC kartu → TC

| Acceptance Criteria | TC |
|---------------------|-----|
| Add group + related/stock children → confirm + leftover + new combos | 01, 02, 03 |
| Add group + zero-relation → soft delete + regenerate | 06, 07 |
| Leftover Active; no auto-rename | 03, 04 |
| No auto stock remap | 03 |
| Confirm popup wajib | 02 |
| Max 3 variant types | 05 |
| Tidak hard-block `Cannot add variant…` | 01, 08 |

---

## Catatan QA

- **Stock Remapping:** pindah stok leftover → SKU kombinasi baru = **manual**, 1 parent.
- **Default-origin** (`SKU-(PARENT)`, omit segment Default): overlap [ETM-15512](https://erpintegration.atlassian.net/browse/ETM-15512) — TC-04 uji pola existing non-Default.
- **Known residual:** rename SKU → SO `detail_sku_name` bisa tetap string lama.
