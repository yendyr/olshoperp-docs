# ETM-15532 — Hasil automate testing

**Card:** [ETM-15532](https://erpintegration.atlassian.net/browse/ETM-15532)  
**Menu:** Skip Wave Process (`/omni/skip-wave-process`)  
**Environment:** staging.olshoperp.com · company **Lumi Charms.id** (`lumicharmsid`, id 153)  
**Login:** playwright@gmail.com  
**Waktu run:** 2026-08-14 (UTC)  
**Perintah:**

```
npx playwright test tests/specs/omni-skip-wave-process/etm-15532-empty-date-confirm.spec.ts --project=authenticated --retries=0
```

**Spec:** `tests/specs/omni-skip-wave-process/etm-15532-empty-date-confirm.spec.ts`  
**Status Playwright (run terakhir):** 2 failed (lihat detail di bawah — skenario empty-date sempat PASS di run sebelumnya)

> Cloud Agent **tidak bisa menulis** ke `C:\Users\garment\Desktop\Automate Testing by Cursor`. Salin folder ini ke path itu di PC lokal.

---

## Expected (dari card)

1. Import saat Processing Order Date **kosong/null** → popup confirmation dengan teks:
   > Processing Order Date is empty. All transaction dates for the imported sales orders will automatically use the current date and time. Are you sure you want to proceed?
2. Jika tanggal **sudah diisi** → confirmation dialog itu **tidak** muncul.

Docs `qa-docs/omni-skip-wave-process/requirement.md` masih **draft** dan menyatakan tanggal selalu ada (default today 23:59:59). Expected di atas mengikuti **card ETM-15532**, bukan requirement lama.

---

## Ringkasan hasil vs card

| # | Skenario | Expected | Actual | Hasil |
|---|----------|----------|--------|-------|
| 1 | Import, tanggal kosong | Dialog wording resmi card | Dialog **muncul** (judul **Are you sure?**, tombol **Proceed**, wording = teks card) | **PASS** (terbukti di run yang berhasil upload file) |
| 2 | Import, tanggal terisi di UI | Dialog empty-date **tidak** muncul | Dialog empty-date **tetap muncul** padahal combobox menampilkan `14-08-2026 02:59:00` | **FAIL** |
| — | Tombol dialog | (card tidak sebut Cancel) | Hanya **Proceed**; tidak ada Cancel | Catatan QA |
| — | Set tanggal `23:59:59` hari ini | (tidak di card) | Toast **Sales Order processing date cannot set to future time.** | Catatan QA |

**Verdict QA untuk card:** fitur popup **sudah ada** dan wording-nya sesuai Request Data. Poin 2 card **belum terpenuhi** — sistem masih menganggap tanggal empty meskipun field UI terisi.

---

## Actual result

### 1. Tanggal kosong → confirmation

- Field UI: combobox placeholder **Default to current time** (bukan label "Processing Order Date").
- Clear tanggal → toast hijau **Sales Order processing date successfully updated**.
- Import → **Upload File** (bukan langsung file picker).
- Dialog:
  - Judul: **Are you sure?**
  - Isi: *Processing Order Date is empty. All transaction dates for the imported sales orders will automatically use the current date and time. Are you sure you want to proceed?*
  - Tombol: **Proceed** saja

Screenshot: `screenshots/01-empty-date-import.png` (run terakhir: toast update tanggal; dialog terlihat di run upload yang sukses — lihat juga `02-…` untuk foto dialog yang sama).

### 2. Tanggal terisi → dialog tetap empty-date — FAIL

- Combobox menampilkan **14-08-2026 02:59:00**.
- Setelah Import → Upload File, modal yang sama tetap muncul: *Processing Order Date is empty…*
- Screenshot: `screenshots/02-filled-date-still-shows-confirm.png`

**Catatan QA:** kemungkinan import tidak memakai nilai yang terlihat di combobox (belum tersimpan / dicek empty di sisi lain). Perlu konfirmasi dev apakah PUT `processing-order-date` dipakai saat upload.

### Temuan samping

| Temuan | Detail |
|--------|--------|
| Future time | Isi `14-08-2026 23:59:59` ditolak: *Sales Order processing date cannot set to future time.* Default requirement (today 23:59:59) bentrok dengan validasi ini jika jam server belum sampai 23:59. |
| Import UI | Tombol **Import** membuka dropdown **Upload File** / **Download Template**. Klik Import saja tanpa Upload File → toast *The file field is required.* |
| Tidak ada Cancel | Operator tidak bisa menolak dari tombol di modal (hanya Proceed). Escape menutup overlay di automation. |

---

## File automation

| File | Isi |
|------|-----|
| `tests/pom-registry/skip-wave-process.yaml` | Registry elemen |
| `tests/helpers/skip-wave-process.ts` | POM |
| `tests/specs/omni-skip-wave-process/etm-15532-empty-date-confirm.spec.ts` | Spec `@ETM-15532` |
| `tests/fixtures/skip-wave-process/etm-15532-dummy-orders.xlsx` | File dummy `SO-ETM15532-DUMMY` (jangan Proceed) |
| `tests/helpers/company-access.ts` | Dialog Switch Company staging sekarang **Proceed**, bukan "Are you sure?" |

Dummy order **tidak** di-Proceed agar batch skip wave tidak terproses.

---

## Cara salin ke Desktop Windows

1. Download folder `implementation-card/[ETM-15532]/` dari PR / workspace.
2. Paste ke `C:\Users\garment\Desktop\Automate Testing by Cursor\ETM-15532\`.
