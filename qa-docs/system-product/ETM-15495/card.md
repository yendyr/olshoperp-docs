# ETM-15495 — Requirement Before / After

Sumber: [ETM-15495](https://erpintegration.atlassian.net/browse/ETM-15495)  
Tipe: Improvement · Status: QA Review (antrian `test-queue.yaml`)  
Judul: `[System Product] Bisa menambahkan new variant type atau group ke dalam existing system product yang sudah punya stock.`

## Tujuan utama

Operator harus bisa **menambah Variant Type / Variant Group baru** pada System Product yang **sudah punya stok**, tanpa di-hard-block. Child lama tetap hidup (leftover) beserta stoknya; kombinasi SKU baru digenerate; stok **tidak** pindah otomatis (remap manual di Stock Remapping).

Kartu ini **bukan** Default Variant create/import — itu [ETM-15512](https://erpintegration.atlassian.net/browse/ETM-15512). ETM-15495 fokus **expand** pada produk existing yang sudah ada stok.

## Requirement Before (AS-IS)

- Edit System Product → tambah Variant Group ditolak jika child `haveRelations()`  
- Pesan: **Cannot add variant, Product already have relations**
- Tanpa relasi: child lama sering **soft delete** + regenerate (ID baru)
- Stok pada child existing **mengunci** alur expand secara praktis (karena inbound/transaksi = relasi)

## Requirement After (TO-BE) — `GAP-SP-18`

Sumber: `qa-docs/system-product/requirement.md` §6.3.2

| Child lama | Soft delete obsolete? | Generate kombinasi baru | Hasil |
|------------|------------------------|-------------------------|--------|
| Zero relation | Ya | Ya (SKU/ID baru) | Bersih |
| Punya relasi **atau** sudah dipakai (stok/transaksi) | Tidak | Ya — **semua** kombinasi baru | Leftover Active + SKU baru |

Aturan terkunci:

- **Cabut** hard-block add Variant Group
- **Tidak ada auto-rename**
- **Tidak ada auto stock remap** — stok tetap di leftover; pindah via **Stock Remapping** (1 parent)
- Confirm popup **wajib** sebelum commit expand yang menghasilkan leftover
- Leftover tetap Active di bawah parent yang sama
- Max **3** variant types (termasuk yang sudah ada)
- Naming kombinasi baru mengikuti fungsi existing `{parent}-{opt1}-{opt2}` (untuk produk Default-origin, omit segment opsi Default — overlap ETM-15512)

## Contoh (kartu / docs)

Produk existing 1 group Warna (`biru`, `hijau`), child sudah ada stok. Tambah group Motif (`doraemon`, `pikacu`):

```
PARENT-biru                 ← leftover (stok tetap di sini)
PARENT-hijau                ← leftover
PARENT-biru-doraemon        ← new (stok 0)
PARENT-hijau-doraemon       ← new
PARENT-biru-pikacu          ← new
PARENT-hijau-pikacu         ← new
```

## Relasi kartu

| Kartu | Peran |
|-------|--------|
| ETM-15495 (ini) | Expand group pada produk **sudah punya stock** |
| [ETM-15512](https://erpintegration.atlassian.net/browse/ETM-15512) | Default create/import + leftover (relasi, bukan stok-only) |
| Stock Remapping | Remap stok leftover → SKU kombinasi baru (manual, 1 parent) |

## Out of scope

- Auto-rename leftover ke opsi pertama group baru
- Auto pindah stok ke SKU kombinasi baru
- Cascade rewrite SKU di history SO
- Toggle Master Variant Default (ETM-15511)
- Create/import Default `-(PARENT)` (ETM-15512)

## Referensi docs

`qa-docs/system-product/requirement.md` — §6.3.2 (`GAP-SP-18`)  
`qa-docs/system-product/technical.md` — §11.2 expand block `ProductSpecificationController`  
`qa-docs/accounting-stock-remapping/requirement.md` — remap stok 1 parent
