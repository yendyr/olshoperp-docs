# ETM-15512 — Requirement Before / After

Sumber: [ETM-15512](https://erpintegration.atlassian.net/browse/ETM-15512)  
Tipe: Improvement · Status: QA Review · Env: Staging only (per 13/08/26)  
Judul: `[System Product] Implementasi Default variant on create/import and expand with leftover SKUs`

## Tujuan utama

Membuat **produk baru otomatis jadi Variant** jika Master Variant punya **Set as Default System Product = ON**, tanpa user harus Enable Variations manual. Saat produk sudah punya child yang dipakai transaksi lalu user menambah Variant Group baru, sistem **tidak hard-block** lagi — child lama tetap hidup sebagai **leftover**, kombinasi baru digenerate, tanpa auto-rename / auto stock remap.

## Requirement Before (AS-IS)

- Create: tetap **Single** kecuali user Enable Variations manual; parent SKU = kode user; child naming `{parent}-{opt}…`
- Import: Type `single` ditolak / blank; parent/child lewat kolom Parent + variant types
- Edit: add Variant Group **ditolak** jika child `haveRelations()` → `Cannot add variant, Product already have relations`
- Tanpa relasi: soft delete / regenerate child (ID baru) saat opsi berubah
- Master Variant `is_default` **belum** dikonsumsi System Product

## Requirement After (TO-BE)

### Create / import (`GAP-SP-17`)

| Kondisi | Hasil |
|---------|--------|
| Default ON + create manual | Parent `{SKU}-(PARENT)`, child = SKU user; Variations ON + default option |
| Default ON + import kandidat Single | Sama seperti create |
| Row sudah isi variant / SKU dipakai sebagai Parent row lain | **Skip** auto-default |
| Semua Default OFF | Single tetap mungkin |
| OFF Enable Variations | Confirm popup → jadi Single |

### Expand (`GAP-SP-18`)

| Child lama | Soft delete? | Hasil |
|------------|--------------|--------|
| Zero relation | Ya | Soft delete obsolete + regenerate ID baru |
| Punya relasi | Tidak | Leftover Active + semua kombinasi baru; confirm popup wajib |

- Naming SKU baru **omit** segment opsi Default
- Kolom Default group di datatable variant **hidden**
- Max 3 variant types **termasuk** Default group
- **Tidak** ada auto-rename / auto stock remap

## Contoh data (kartu)

Create Default ON, input `SKUPENSIL`:

| Role | SKU |
|------|-----|
| Parent | `SKUPENSIL-(PARENT)` |
| Child | `SKUPENSIL` |

Expand Default → Warna (biru, hijau) + Motif (doraemon, pikacu), child sudah di SO:

```
SKUPENSIL                 ← leftover
SKUPENSIL-biru-doraemon   ← new
SKUPENSIL-hijau-doraemon  ← new
SKUPENSIL-biru-pikacu     ← new
SKUPENSIL-hijau-pikacu    ← new
```

## Prasyarat

- [ETM-15511](https://erpintegration.atlassian.net/browse/ETM-15511) — Master Variant toggle Default
- Related: [ETM-15495](https://erpintegration.atlassian.net/browse/ETM-15495) — expand variant saat sudah punya stock/relasi

## Referensi docs

`qa-docs/system-product/requirement.md` — §6.3.1 (`GAP-SP-17`), §6.3.2 (`GAP-SP-18`)  
`qa-docs/supplychain-variant/requirement.md` — `GAP-VAR-01`
