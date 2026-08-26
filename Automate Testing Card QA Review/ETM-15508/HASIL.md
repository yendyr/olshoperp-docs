# Hasil Automate Testing — ETM-15508

**Tanggal run:** 14 Agustus 2026  
**Environment:** Staging (`https://staging.olshoperp.com`)  
**Company:** FAT (id 112)  
**Menu:** Warehouse Setting (`/supplychain/setting`)  
**Spec:** `tests/specs/warehouse-setting/etm-15508-column-show-hide.spec.ts`  
**Perintah:** `npx playwright test tests/specs/warehouse-setting/etm-15508-column-show-hide.spec.ts -g "@ETM-15508"`

---

## Ringkasan

**PASS.** Modal **Columns Show/Hide** di Warehouse Setting **tidak terpotong** saat global search `KEBOAN` menyisakan 1 baris. Ukuran overlay sama dengan kondisi all rows (283×224 px). Kartu ETM-15508 (QA Review) lolos re-test otomatis terhadap AC utama.

Kartu: [ETM-15508](https://erpintegration.atlassian.net/browse/ETM-15508)

---

## Detail vs acceptance criteria kartu

| AC | Skenario | Hasil | Bukti |
|----|----------|-------|-------|
| AC-01 | Buka Columns Show/Hide saat all rows (3 baris) | **PASS** — overlay penuh, 9 opsi kolom, di dalam viewport, tidak ter-clip parent | `screenshots/01-all-rows-modal.png` |
| AC-02 | Search `KEBOAN` → 1 baris → buka overlay | **PASS** — tinggi/lebar identik baseline (283×224), tidak terpotong | `screenshots/02-search-few-rows-modal.png` |
| AC-03 | Search lain 1–3 baris | **PASS (tercover AC-02)** — KEBOAN sudah 1 baris, tidak perlu fallback | measurements.json `searchTerm=KEBOAN` |
| AC-04 | Clear search → buka overlay lagi | **PASS** — ukuran tetap 283×224 | `screenshots/03-cleared-search-modal.png` |
| AC-05 | Toggle kolom (Data Owner) saat 1 baris | **PASS** — kolom berubah sesuai klik | `toggleWorked: true` |
| AC-06 | Scroll halaman saat overlay terbuka | **Tidak diotomasi** | Gap vs kartu — perlu cek manual jika diminta |

**AS-IS (docs):** Warehouse Setting = datalist building level 19, inline edit (`qa-docs/supplychain-setting/requirement.md`, status **draft**). Perilaku Column Show/Hide mengikuti shared capability SF-DL-04. Bug clip overflow tidak tertulis di requirement — expected kartu dipakai sebagai AC re-test.

---

## Metrik overlay (px)

| Kondisi | Baris | height | width | clippedByParent | fullyInViewport |
|---------|-------|--------|-------|-----------------|-----------------|
| All rows | 3 | 283 | 224 | tidak | ya |
| Search KEBOAN | 1 | 283 | 224 | tidak | ya |
| Clear search | 3 | 283 | 224 | tidak | ya |

---

## Catatan QA

- Label UI aktual: **Columns Show/Hide** (bukan "Column Show/Hide"). Search box placeholder: `find something ...`.
- Repo `olshoperp-frontend` sibling **tidak ada** di mesin ini — selector diverifikasi dari run staging.
- AC-06 (scroll) tidak masuk spec; jika PM/QA butuh sign-off penuh kartu, cek manual 1x.
- **Rekomendasi:** status kartu bisa dilanjutkan ke Done/Closed setelah QA lead review screenshot 01 vs 02.

---

## Isi folder

| File | Isi |
|------|-----|
| `HASIL.md` | Ringkasan ini |
| `screenshots/01-all-rows-modal.png` | Overlay saat all rows |
| `screenshots/02-search-few-rows-modal.png` | Overlay setelah search KEBOAN (1 baris) |
| `screenshots/03-cleared-search-modal.png` | Overlay setelah clear search |
| `measurements.json` | Metrik + verdict PASS |
| `results.json` | Playwright JSON reporter |
| `playwright-report/` | HTML report (run sebelumnya; verdict resmi = measurements.json) |
| `test-results/` | Artifact Playwright |
