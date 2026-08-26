# RESULT ETM-15526 — lumicharmsid — 2026-08-19

## Environment

| Field | Nilai |
|-------|--------|
| Account | `playwright@gmail.com` |
| Company | **Lumi Charms.id** (lumicharmsid / id: 153) |
| Building | **Dropoff Gayungsari** |
| SKU Origin | `sku-spidol-biru`, `sku-spidol-hijau`, `sku-spidol-hitam` |
| Spec | `tests/specs/stock-remapping/etm-15526-*.spec.ts` |

## Run #1 (Playwright CLI)

**Command:** `OLSHOP_COMPANY_CODE=lumicharmsid npx playwright test -g "@ETM-15526"`

### Summary

| TC | Status | Catatan |
|----|--------|---------|
| TC-01 | **FAIL** | Bulk Use biru hanya 1 baris (1 Stock ID), spec expect ≥2 |
| TC-02 | NOT RUN | Serial — blocked by TC-01 |
| TC-04 | NOT RUN | Serial — blocked by TC-01 |
| TC-05 | NOT RUN | Serial — blocked by TC-01 |
| TC-06 | NOT RUN | Serial — blocked by TC-01 |
| TC-07 | NOT RUN | Serial — blocked by TC-01 |
| TC-13 | **FAIL** | `setRemappedToOnRow(sku-spidol-hijau)` — opsi tidak ketemu (selector/timing) |
| TC-14 | **FAIL** | Same root cause Remapped To dropdown |
| TC-15 | **FAIL** | Import API **404** — route tidak ada di staging |

**Total:** 4 failed · 5 skipped · 0 passed

### Evidence positif

- ✅ Login + switch company lumicharmsid berhasil (`tests/.auth/lumicharmsid.json`)
- ✅ Building **Dropoff Gayungsari** terpilih
- ✅ SKU **sku-spidol-biru** muncul di Available Products & detail table
- ✅ Dropdown Remapped To menampilkan **SKU-SPIDOL-hijau** (terlihat di screenshot failure TC-13)

### Root cause

1. **TC-01 / TC-04:** Data biru di Gayungsari hanya punya **1 Stock ID**, bukan 2 seperti RM-Variant-Mix di DEV-STG.
2. **TC-13 / TC-14:** Helper `setRemappedToOnRow` gagal klik opsi meskipun UI sudah render — fixed pakai `OlshopMultiselect.selectOption` + filter token (`hijau`, `biru`, dll).
3. **TC-15:** Backend staging — endpoint import 404:
   ```
   POST /api/accounting/stock-remapping-detail/{id}/import-history/upload → 404
   ```

## Fix applied (Run #2 pending)

| File | Perubahan |
|------|-----------|
| `tests/helpers/stock-remapping.ts` | `setRemappedToOnRow` → pakai `multiselect.selectOption` + partial filter token |
| `etm-15526-happy-path.spec.ts` | TC-01: biru + hijau untuk 2 baris, duplicate Remapped To = hitam |
| `etm-15526-happy-path.spec.ts` | TC-04: expect ≥1 biru, ≥2 total (biru+hijau) |
| `etm-15526-failed-tcs.spec.ts` | TC-13 valid remap target → hitam |

## Re-run

```powershell
cd d:\olshoperp-docs
$env:OLSHOP_COMPANY_CODE="lumicharmsid"
npx playwright test --project=authenticated -g "@ETM-15526"
```

Happy path saja:

```powershell
npx playwright test tests/specs/stock-remapping/etm-15526-happy-path.spec.ts --project=authenticated
```

## Rekomendasi

- **TC-15:** Perlu fix route import di backend staging, atau konfirmasi path API yang benar.
- **TC-01 (opsional):** Seed stock biru dengan 2 Stock ID jika ingin mirror skenario manual DEV-STG persis.

---

**Status keseluruhan:** ⚠️ **PARTIAL** — environment lumicharmsid siap; automation perlu re-run setelah fix helper/spec.
