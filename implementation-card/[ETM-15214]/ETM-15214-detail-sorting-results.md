# ETM-15214 — Regresi Sorting Tabel Detail Transaksi SCM

**Environment:** staging.olshoperp.com · Company **Dev Staging (DEV-STG, id 13)**
**Credentials:** playwright@gmail.com
**Expected (kriteria PASS):** *last-in-first-row* — baris yang terakhir ditambahkan muncul di **baris paling atas**. Setelah menambah `[A, B, C]`, urutan tabel atas→bawah harus `[C, B, A]`.
**Klarifikasi test data:**
- PO Select SKU pertama = **SKU112** (bukan `SKU122`).
- Purchase Inbound SKU aktual di staging pakai zero-pad: `sku-testing-041, 046, 033, 037, 028` (test data `sku-testting-41` dll. adalah typo).

## Ringkasan hasil

| # | Menu | Hasil | Perilaku aktual |
|---|------|-------|-----------------|
| 1 | Purchase Order | **PASS** | Baris terbaru di paling atas |
| 2 | Outbound External | **FAIL** | Baris terbaru jatuh di **bawah** (first-in-first-row) |
| 3 | Purchase Inbound (legacy) | **FAIL** | Baris terbaru **tidak** di atas |
| 4 | BETA New Purchase Inbound | **PASS** | Baris terbaru di paling atas |
| 5 | Transfer Internal | **FAIL** | Baris terbaru di **bawah** |
| 6 | Transfer External | **FAIL** | Baris terbaru di **bawah** |
| 7 | Assembly | **PASS** | Baris terbaru di atas (termasuk pass ke-2 urutan dibalik) |

> Catatan: #3 dan #4 menunjuk dokumen backend yang sama (`IN-6A461222` / id 86830). Legacy Purchase Inbound menampilkan urutan salah, sedangkan **BETA New Purchase Inbound menampilkan urutan benar** untuk data yang sama → BETA adalah tampilan yang sudah diperbaiki.

## Actual result per menu (FAIL)

### 2. Outbound External — `OT-6A4E1B87`
- Tambah: `SO-6JJHMV4V` → `SO-7F1FYJKV`
- Expected (atas→bawah): `SO-7F1FYJKV → SO-6JJHMV4V`
- **Actual: `SO-6JJHMV4V → SO-7F1FYJKV`** — last added @ index 1 (bawah)

### 3. Purchase Inbound (legacy) — `IN-6A461222`
- Tambah: `sku-testing-041` → `sku-testing-046` → `sku-testing-033`
- Expected: `sku-testing-033 → sku-testing-046 → sku-testing-041`
- **Actual: `sku-testing-046 → sku-testing-041 → sku-testing-033`** — last added @ index 2 (paling bawah)

### 5. Transfer Internal — `TFI-6A472C53`
- Tambah: `SKU-0708` → `SKU112`
- Expected: `SKU112 → SKU-0708`
- **Actual: `SKU-0708 → SKU112`** — last added @ index 1 (bawah)

### 6. Transfer External — `TFE-6A4DA2E2`
- Tambah: `JOGGER485` → `JOGGER500`
- Expected: `JOGGER500 → JOGGER485`
- **Actual: `JOGGER485 → JOGGER500`** — last added @ index 1 (bawah)

## Menu PASS

- **Purchase Order** (`PO-6A437282`): SKU112, SKU66200, BIP-HJOV9, SKU-0708, SKU1, SKU6620 — newest selalu di atas.
- **BETA New Purchase Inbound** (`IN-6A461222`): newest di atas.
- **Assembly** (`AS-6A4C78DD`): MTRS-WTR, DRAWKIT-KIDZ — newest di atas; pass ke-2 dengan urutan dibalik juga benar.

## Automation

- **Spec:** `tests/specs/regression/etm-15214/detail-sorting.spec.ts` (tag `@ETM-15214`, tiap menu test independen)
- **Helpers:** `tests/helpers/detail-sorting.ts`, `tests/helpers/shared/detail-table.ts`

Menjalankan:

```powershell
cd d:\olshoperp\olshoperp-docs
$env:OLSHOP_COMPANY_CODE="DEV-STG"
npx playwright test tests/specs/regression/etm-15214/detail-sorting.spec.ts --retries=0

# per menu:
npx playwright test tests/specs/regression/etm-15214/detail-sorting.spec.ts -g "2. Outbound External" --retries=0
```

FAIL = regresi masih ada (baris terbaru tidak di paling atas); pesan assertion memuat expected vs actual + posisi baris terakhir.

## Catatan teknis automation

- Pemilihan opsi multiselect memakai **exact match** pada kode/SKU (mencegah `SKU112` salah pilih `SKU11238`).
- Matching baris memakai batas non-alfanumerik (mencegah `SKU1` match `SKU112`).
- Outstanding Purchase Inbound: kolom search **tidak** mencari SKU → helper memakai page size 100 + scan baris.
- Legacy `mutation-inbound`: tombol **Use** membuka modal "Create Inbound Product" → helper klik **Save**.
- Section detail dibersihkan dulu (per-row / bulk delete) agar baseline urutan bersih & outstanding tersedia.
