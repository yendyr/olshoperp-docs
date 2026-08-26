# Matriks Deduplikasi TC — ETM-15495 vs ETM-15512

**Tujuan:** Hindari double-test skenario yang sama; jelas kartu mana yang **wajib** di-run untuk AC tertentu.

**Referensi:**
- [ETM-15495](https://erpintegration.atlassian.net/browse/ETM-15495) — expand + stok (`GAP-SP-18`, fokus stok leftover)
- [ETM-15512](https://erpintegration.atlassian.net/browse/ETM-15512) — Default create/import + expand Default-origin (`GAP-SP-17` + `GAP-SP-18`)

---

## Legenda overlap

| Simbol | Arti |
|--------|------|
| 🔴 **Full** | Skenario & expected sama — **cukup run 1 kartu** (pilih kartu yang punya setup lebih spesifik) |
| 🟡 **Partial** | Aturan sama, **setup atau assert berbeda** — run keduanya dengan variasi berbeda |
| 🟢 **None** | Hanya ada di 1 kartu — **wajib run kartu itu** |

| Run policy | Arti |
|------------|------|
| **15495 saja** | Cukup di ETM-15495; 15512 bisa **skip** atau cross-ref result |
| **15512 saja** | Cukup di ETM-15512; 15495 bisa **skip** |
| **Keduanya** | Setup/assert berbeda — run di kedua kartu |
| **15512 only (create)** | Hanya ETM-15512 punya TC |

---

## 1. Matriks per skenario (GAP-SP-18 — expand)

| # | Skenario / AC | 15495 TC | 15512 TC | Overlap | Run policy | Perbedaan setup / assert |
|---|---------------|----------|----------|---------|------------|---------------------------|
| E1 | Expand + child punya stok → tidak hard-block | TC-01, TC-08 | TC-06 | 🟡 Partial | **15495 saja** untuk assert **stok qty**; 15512 TC-06 cukup cross-ref jika 15495 TC-01/03 PASS | 15495: fokus **qty & Stock ID** before/after. 15512: fokus relasi dokumen + pola Default-origin |
| E2 | Confirm popup leftover — **Cancel** | TC-02 | TC-06 (A) | 🔴 Full | **15495 saja** (TC-02) | Popup text & rollback config sama |
| E3 | Confirm popup leftover — **Proceed** | TC-01 | TC-06 (B) | 🟡 Partial | **Keduanya** jika perlu bukti di 2 kartu Jira; praktis **15495 TC-01 + TC-03** sudah cover proceed + stok | 15512 assert naming omit Default; 15495 assert stok |
| E4 | Stok leftover tidak berubah; SKU baru stok 0 | TC-03 | TC-06 (implisit) | 🟡 Partial | **15495 saja** (TC-03) | **AC utama ETM-15495** — qty before/after wajib dicatat |
| E5 | Tidak auto-rename leftover | TC-03, TC-04 | TC-06, TC-07 | 🟡 Partial | **15495 TC-03** untuk leftover berstok; **15512 TC-07** untuk pola SKU Default-origin | 15495: leftover = SKU lama (`SYSPRO`). 15512: omit segment Default di SKU baru |
| E6 | Naming kombinasi baru `{base}-{opt}…` (non-Default) | TC-04 | — | 🟢 None | **15495 saja** | Parent **bukan** `SKU-(PARENT)` — pola `{parent}-biru-doraemon` |
| E7 | Naming omit segment Default + kolom Default hidden | — | TC-07 | 🟢 None | **15512 saja** | Produk Default-origin (`SYSPRO` / `SYSPRO-(PARENT)`) |
| E8 | Expand zero-relation → soft delete + regenerate | TC-06 | TC-05 | 🔴 Full | **15495 saja** (TC-06) atau **15512 saja** (TC-05) — pilih satu | Setup: child tanpa relasi & tanpa stok |
| E9 | Stok saja, zero relasi dokumen → soft delete | TC-07 | — | 🟢 None | **15495 saja** | Edge case: punya qty gudang tapi tidak ada relasi transaksi |
| E10 | Regresi: hard-block lama tidak muncul | TC-08 | TC-06 | 🔴 Full | **15495 saja** (TC-08) atau gabung dengan TC-01 | Pesan `Cannot add variant, Product already have relations` |
| E11 | Max 3 variant types setelah expand | TC-05 | TC-06/07 (implisit) | 🟡 Partial | **15495 saja** (TC-05) | Uji tolak group ke-4 eksplisit |
| E12 | Leftover Inactive hanya via rule existing | — | TC-06 (implisit) | 🟢 None | **15512** atau tambah TC 15495 jika perlu | Belum ada TC dedicated 15495 |

---

## 2. Matriks per skenario (GAP-SP-17 — create/import)

| # | Skenario / AC | 15495 TC | 15512 TC | Overlap | Run policy |
|---|---------------|----------|----------|---------|------------|
| C1 | Create Default ON → `SKU-(PARENT)` + child | — | TC-01 | 🟢 None | **15512 saja** |
| C2 | OFF Enable Variations → confirm → Single | — | TC-02 | 🟢 None | **15512 saja** |
| C3 | Import Single-eligible + Default ON | — | TC-03 | 🟢 None | **15512 saja** |
| C4 | Import skip explicit variant / parent-used | — | TC-04 | 🟢 None | **15512 saja** |
| C5 | Default OFF → Single create/import tetap mungkin | — | (belum TC dedicated) | 🟢 None | **15512** — tambah TC jika perlu |

**ETM-15495 tidak punya TC create/import** — semua C1–C5 **hanya ETM-15512**.

---

## 3. Rekomendasi run minimum (anti double-test)

### Jika ETM-15495 sudah di-run (fixture SYSPRO)

| Kartu | TC wajib run | TC boleh skip (sudah covered) |
|-------|--------------|-------------------------------|
| **ETM-15495** | TC-03 (stok assert eksplisit), TC-05 (max 3), TC-06/07 (zero-relation — **SKU baru**) | TC-08 jika TC-01 sudah PASS tanpa hard-block |
| **ETM-15512** | TC-01, TC-02, TC-03, TC-04 (create/import), **TC-07** (naming Default + hidden column) | TC-06 **partial skip** — cross-ref ETM-15495 TC-01/02/03 untuk expand+leftover; tetap run TC-06 jika butuh bukti di kartu 15512 |

### Jika belum run sama sekali

| Urutan | Kartu | TC |
|--------|-------|-----|
| 1 | ETM-15512 | TC-01 → TC-02 → TC-03 → TC-04 (create/import) |
| 2 | ETM-15495 | TC-01 → TC-02 → TC-03 (expand + stok — **fixture terpisah** disarankan) |
| 3 | ETM-15512 | TC-07 (naming Default-origin) |
| 4 | Salah satu | TC-05/TC-06 zero-relation (15495 TC-06 **atau** 15512 TC-05) |
| 5 | ETM-15495 | TC-05 max 3 groups |

---

## 4. Mapping TC nomor antar kartu (quick reference)

| Skenario | ETM-15495 | ETM-15512 | Catatan |
|----------|-----------|-----------|---------|
| Expand + stok, proceed | TC-01 | TC-06 B | 15495 = assert stok |
| Popup cancel | TC-02 | TC-06 A | 🔴 duplicate — run sekali |
| Stok tidak pindah | TC-03 | — | **Unique 15495** |
| Naming non-Default | TC-04 | — | Parent bukan `-(PARENT)` |
| Max 3 groups | TC-05 | — | **Unique 15495** |
| Zero-relation soft delete | TC-06 | TC-05 | 🔴 duplicate — run sekali |
| Stok tanpa relasi dokumen | TC-07 | — | **Unique 15495** |
| Regresi hard-block | TC-08 | TC-06 | 🔴 duplicate — run sekali |
| Create Default ON | — | TC-01 | **Unique 15512** |
| Variations OFF → Single | — | TC-02 | **Unique 15512** |
| Import Default | — | TC-03, TC-04 | **Unique 15512** |
| Omit Default segment + hidden col | — | TC-07 | **Unique 15512** |

---

## 5. Catatan fixture SYSPRO (run user 18/08/26)

Setup user memakai produk **Default-origin** (`SYSPRO` + `SYSPRO-(PARENT)`), sehingga:

| TC user | Map ke TC formal | Kartu primary | Kartu secondary |
|---------|------------------|---------------|-----------------|
| TC-02 (cancel popup) | 15495 TC-02 · 15512 TC-06 A | **ETM-15495** | cross-ref 15512 |
| TC-01 (proceed + 2 child) | 15495 TC-01, TC-03, TC-08 · 15512 TC-06 B | **ETM-15495** (stok) | **ETM-15512** (naming) |
| TC-04 (tambah motif → 5 child) | 15495 TC-04 partial · **15512 TC-07** | **ETM-15512** (naming omit Default) | 15495 (leftover `SYSPRO`) |

Detail hasil: [ETM-15495/results/RESULT-20260818-SYSPRO.md](../ETM-15495/results/RESULT-20260818-SYSPRO.md)

**Observasi QA:**
- Expand ke-2 (motif): child intermediate `SYSPRO-biru` / `SYSPRO-hijau` **hilang** → kemungkinan **soft delete** karena zero relation/stok (hanya `SYSPRO` yang punya stock 100). Perilaku ini **selaras TO-BE** jika intermediate tidak punya relasi; perlu konfirmasi apakah user expect intermediate tetap sebagai leftover juga.

---

## 6. Checklist sebelum close kartu

### ETM-15495
- [ ] TC-01 expand + stok PASS
- [ ] TC-02 cancel popup PASS
- [ ] TC-03 qty leftover before = after
- [ ] TC-05 max 3 groups
- [ ] TC-06 atau TC-07 (edge zero-relation) — **fixture baru**, jangan reuse SYSPRO yang sudah 3 group

### ETM-15512
- [ ] TC-01–TC-04 create/import
- [ ] TC-07 naming + hidden Default column
- [ ] TC-06: cross-ref 15495 **atau** run terpisah di kartu 15512
