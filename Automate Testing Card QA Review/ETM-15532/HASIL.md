# Hasil Automate Testing — ETM-15532 (re-run xlsx)

**Tanggal run:** 14 Agustus 2026  
**Environment:** Staging (`https://staging.olshoperp.com`)  
**Company:** FAT (id 112)  
**Menu:** Skip Wave Process (`/omni/skip-wave-process`)  
**File import:** `fixtures/etm-15532-dummy-order-no.xlsx`  
**Spec:** `tests/specs/skip-wave-process/etm-15532-import-empty-date-confirm.spec.ts`  
**Perintah:** `npx playwright test tests/specs/skip-wave-process/etm-15532-import-empty-date-confirm.spec.ts -g "@ETM-15532"`

Kartu: [ETM-15532](https://erpintegration.atlassian.net/browse/ETM-15532)

---

## Ringkasan

**PASS.** Setelah import memakai file **.xlsx**, popup confirmation muncul saat Processing Order Date kosong. Wording **persis** sesuai kartu. Jika tanggal sudah diisi, popup tidak muncul.

Run sebelumnya **FAIL** karena dummy file bukan xlsx/xls/csv yang diterima sistem — bukan karena fitur kartu rusak.

---

## Detail vs kartu

| AC (dari kartu) | Hasil | Bukti |
|-----------------|-------|-------|
| Tanggal bisa Null / empty di UI | **PASS** — placeholder **Default to current time** | `screenshots/01-date-cleared.png` |
| Import .xlsx saat tanggal empty → popup confirmation | **PASS** | `screenshots/02-import-empty-date.png` |
| Wording sesuai kartu (EN) | **PASS** — lihat kutipan di bawah | `measurements.json` `confirmTextWhenEmpty` |
| Tanggal sudah diisi → tidak ada confirmation | **PASS** | `screenshots/04-import-filled-date.png` · `confirmWhenFilled: false` |

**Wording aktual (verbatim):**

> Processing Order Date is empty. All transaction dates for the imported sales orders will automatically use the current date and time. Are you sure you want to proceed?

Tombol di modal: **Proceed**. Judul: **Are you sure?**

---

## Alur yang dijalankan

1. Buka Skip Wave Process (FAT).
2. Kosongkan Processing Order Date (placeholder Default to current time).
3. Import → Upload File → `etm-15532-dummy-order-no.xlsx`.
4. Popup confirmation muncul → **tidak** diklik Proceed (dummy order tidak diproses sampai shipped).
5. Isi tanggal → Import lagi → confirmation **tidak** muncul.

---

## Catatan QA

- **AS-IS docs** (`qa-docs/omni-skip-wave-process/requirement.md` §5.1, draft) masih bilang tanggal selalu ada nilai. Perilaku staging mengikuti **kartu** (boleh empty + confirmation).
- File harus **xlsx / xls / csv** yang valid; format salah → error *"The file field must be a file of type: xlsx, xls, csv"* dan confirmation tidak sempat tampil.
- Field tanggal **shared Unassign Wave** per company. Setelah run, tanggal FAT ter-set `14-08-2026 00:00:00` (nilai restore dari sesi tes).
- Modal confirmation hanya tombol **Proceed** (tidak ada Cancel di UI).

**Rekomendasi:** AC kartu lolos re-test otomatis dengan file .xlsx. Kartu bisa dilanjutkan setelah QA lead cek screenshot 02.

---

## Isi folder

| File | Isi |
|------|-----|
| `HASIL.md` | Ringkasan ini (re-run xlsx) |
| `fixtures/etm-15532-dummy-order-no.xlsx` | File import tes |
| `screenshots/00-page-loaded.png` | Halaman awal |
| `screenshots/01-date-cleared.png` | Tanggal empty |
| `screenshots/02-import-empty-date.png` | Popup confirmation setelah upload xlsx |
| `screenshots/03-date-filled.png` | Tanggal terisi |
| `screenshots/04-import-filled-date.png` | Import saat tanggal terisi (tanpa popup) |
| `measurements.json` | Verdict PASS + wording verbatim |
| `results.json` | Playwright JSON |
| `test-results/` | Artifact Playwright |
