# Hasil retest ΓÇö ETM-15526 TC-13 / TC-14 / TC-15

**Tanggal:** 2026-08-18  
**Company:** DEV-STG (13)  
**Akun:** playwright@gmail.com  
**Spec:** `tests/specs/stock-remapping/etm-15526-failed-tcs.spec.ts`  
**Acuan:** [komentar 40137](https://erpintegration.atlassian.net/browse/ETM-15526?focusedCommentId=40137) (FAILED) dan [komentar 40219](https://erpintegration.atlassian.net/browse/ETM-15526?focusedCommentId=40219) (Jeiniffer, staging done)

```bash
OLSHOP_COMPANY_CODE=DEV-STG npx playwright test tests/specs/stock-remapping/etm-15526-failed-tcs.spec.ts --project=authenticated --retries=0
```

## Ringkasan

| TC | Expected (40137) | Hasil retest 18 Agu 2026 |
|----|------------------|--------------------------|
| TC-13 | Origin Γëá Remapped To di insert / update Origin / update Qty / approve | **BLOCKED** ΓÇö tidak ada baris Origin yang bisa diedit |
| TC-14 | Edit Remapped To / Qty / Description tidak memindahkan baris | **BLOCKED** ΓÇö tidak ada 2 baris Origin Mix + Pink |
| TC-15 | Qty non-numerik ditolak; semua error required tampil; failed row = jumlah baris gagal | **BLOCKED / tidak sampai skenario** ΓÇö upload import 404 |

Catatan silang komentar 40219 (tester Jeiniffer, hari yang sama): TC-13 **PASSED** (inline + import self-remap); TC-14 **FAILED** (baris pindah ke atas); TC-15 belum diisi.

## Data uji

SKU `RM-Variant-Mix` / `RM-Variant-White` / `RM-Variant-Pink` di company DEV-STG.

Real Time Stock (cek sebelumnya di sesi yang sama): Mix / Pink / White **ATS = 0** (On Hand = Booked). Available Products di building **Seruni DROP OFF** tidak menampilkan Mix.

Contoh RM Open existing: [RM-5U3DKHWT](https://staging.olshoperp.com/accounting/stock-remapping/edit/129865) ΓÇö building Seruni DROP OFF, tabel detail **no data available in table**.

Seed Stock Addition gagal: SKU Mix tidak muncul di Select Product menu Stock Addition (`AI-5U5XBB7C`).

## TC-13

Tidak sampai assert bisnis. Tidak bisa insert Origin Mix via Available Products. Header GET `/accounting/stock-remapping/{id}` tidak berisi array detail; dokumen Open existing tampil kosong di UI.

## TC-14

Sama seperti TC-13. Tidak ada dua baris Mix + Pink untuk diukur urutan setelah ubah Remapped To.

## TC-15

Dokumen: [RM-5U5XCWRK](https://staging.olshoperp.com/accounting/stock-remapping/edit/130412)

Dialog **Import History** terbuka. File ter-set ke `input[type=file]`. Response:

`POST /api/accounting/stock-remapping-detail/130412/import-history/upload` ΓåÆ **404**  
_The route api/accounting/stock-remapping-detail/130412/import-history/upload could not be found._

History tetap kosong (failed row / success row tidak terisi). Skenario template kosong, Qty `I5`, dan required kosong **belum bisa diuji ulang** sampai endpoint upload hidup.

Ini **bukan** pengulangan FAIL 40137 (saat itu import berhasil; yang salah adalah validasi I5 / jumlah error / failed row).

## Artifact

`implementation-card/[ETM-15526]/retest-failed-tc/` ΓÇö `tc15-result.json`, screenshot import, screenshot RM-5U3DKHWT kosong.
