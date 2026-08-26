# Hasil Automate Testing — ETM-15549

**Tanggal run:** 19 Agustus 2026  
**Environment:** Staging (`https://staging.olshoperp.com`)  
**Company:** PT Huawei Tech Investment (id 915)  
**Menu:** Colli Type (`/supplychain/colli-type`)  
**Spec:** `tests/specs/colli-type/etm-15549-show-deleted-recreate.spec.ts`  
**Perintah:** `npx playwright test tests/specs/colli-type/etm-15549-show-deleted-recreate.spec.ts -g "@ETM-15549"`

---

## Ringkasan

**PASS.** Soft delete Colli Type yang belum dipakai berhasil. **Show deleted data** menampilkan **Already deleted** (bukan link **Deleted**). Create ulang dengan code+name yang sama juga berhasil — finding REOPEN *Data conflict* tidak muncul di company Huawei.

Kartu: [ETM-15549](https://erpintegration.atlassian.net/browse/ETM-15549)

---

## Detail vs acceptance criteria kartu

| AC | Skenario | Hasil | Bukti |
|----|----------|-------|-------|
| AC-01 | Soft delete unused type → hilang dari list default → Show deleted data = *already deleted* | **PASS** — toast `The data has been success deleted`; list default kosong; kolom Action = **Already deleted**; bukan link Deleted | `screenshots/03-after-delete-active-list.png`, `screenshots/04-show-deleted.png` |
| AC-02 (REOPEN) | Create Colli Type dengan data yang sama seperti yang sudah di-delete | **PASS** — toast `The new data has been successfully saved.` → [edit/17](https://staging.olshoperp.com/supplychain/colli-type/edit/17) | `screenshots/05-recreate.png` |

**AS-IS (SOT, bukan folder menu canonical):** expected *already deleted* + unique code selaras master SCM / soft delete dari card [ETM-15543](https://erpintegration.atlassian.net/browse/ETM-15543) (SOT Colli Type §4.2 / §6.4 kasus 6). Slug `supplychain-colli-type` **belum** ada di `qa-docs/_meta/manifest.yaml`.

---

## Fixture run

| Item | Nilai |
|------|--------|
| Code | `CT-QA-15549-545782` |
| Name | `QA ETM-15549 545782` |
| Description | `automation playwright` |
| Create pertama | https://staging.olshoperp.com/supplychain/colli-type/edit/16 (lalu di-delete) |
| Recreate | https://staging.olshoperp.com/supplychain/colli-type/edit/17 |
| Login | playwright@gmail.com |

---

## Catatan QA

- Label UI aktual kolom Action: **Already deleted** (huruf kapital A). Kartu menulis _already deleted_ — match case-insensitive.
- Ikon Delete di datalist = trash (a11y `Show Delete Modal`), bukan teks **Delete**. Modal konfirmasi tetap **Are you sure?** → **Delete**.
- Repo `olshoperp-frontend` sibling **tidak ada** di mesin ini — selector diverifikasi dari run staging.
- Leftover run gagal sebelumnya: `CT-QA-15549-311998` (edit/15) masih aktif di Huawei — bukan fixture AC.
- **Rekomendasi:** kartu ETM-15549 (QA Review) bisa dilanjutkan ke Done/Closed setelah QA lead review screenshot 04 vs 05.

---

## Isi folder

| File | Isi |
|------|-----|
| `HASIL.md` | Ringkasan ini |
| `screenshots/01-datalist.png` | Datalist awal Huawei |
| `screenshots/02-created.png` | Create fixture sukses |
| `screenshots/03-after-delete-active-list.png` | Type hilang dari list default |
| `screenshots/04-show-deleted.png` | Show deleted data = Already deleted |
| `screenshots/05-recreate.png` | Create ulang code terhapus sukses |
| `measurements.json` | AC + verdict PASS |
| `results.json` | Playwright JSON reporter |
| `playwright-report/` | HTML report (jika ter-generate) |
| `test-results/` | Artifact Playwright |
