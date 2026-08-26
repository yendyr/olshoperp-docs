# Hasil Automate Testing — ETM-8618

**Tanggal run:** 19 Agustus 2026  
**Environment:** Staging (`https://staging.olshoperp.com`)  
**Company:** PT Huawei Tech Investment / HUAWEI (id 915)  
**Menu:** Warehouse Structure (`/supplychain/warehouse-structure`)  
**Spec:** `tests/specs/warehouse-structure/etm-8618-prefix-type-per-level.spec.ts`  
**Perintah:**

```
OLSHOP_COMPANY_CODE=HUAWEI npx playwright test tests/specs/warehouse-structure/etm-8618-prefix-type-per-level.spec.ts --project=authenticated -g "@ETM-8618"
```

Kartu: [ETM-8618](https://erpintegration.atlassian.net/browse/ETM-8618)

---

## Ringkasan

**Sebagian PASS.** Validasi header Warehouse Structure (code, name, type, prefix non-alphabet) sesuai requirement. **AC utama kartu belum terbukti:** Prefix Type Numeric + Alphabet di **dua level** tidak bisa diotomasi sampai selesai karena baris generator kedua tidak muncul di UI setelah isi baris pertama.

Type yang terpakai di Huawei: **9. Region**.

---

## Detail vs expected (komentar staging + kartu)

| TC | Skenario | Expected | Result | Bukti |
|----|----------|----------|--------|-------|
| TC-01 | Code >50 tanpa spasi, lalu code <50 pakai spasi | Gagal; pesan code tidak boleh spasi | **PASS** | `The code field must not be greater than 50 characters.` lalu `Field code cannot contain spaces.` |
| TC-02 | Name > 150 karakter | Gagal; error field Name | **PASS** | `The name field must not be greater than 150 characters.` |
| TC-03 | Type dibiarkan kosong | Gagal; Type wajib | **PASS** | `The warehouse space type field is required.` |
| TC-04 | Prefix duplikat sama persis di 2 level | Ditolak: `Prefix must be unique` | **FAIL (blocker otomasi)** | Baris Prefix ke-2 tidak tampil |
| TC-05 | Prefix duplikat beda kapital (ABCD vs abcd) | Ditolak unique tanpa bedakan kapital | **FAIL (blocker otomasi)** | Sama seperti TC-04 |
| TC-06 | Prefix non-alphabet (huruf+angka) | Ditolak: `Prefix must be alphabet` | **PASS** | Satu baris `AB1` cukup untuk memicu validasi |
| TC-07 | Prefix Type beda antar level (Numeric + Alphabet) | Save sukses — **inti ETM-8618** | **FAIL (blocker otomasi)** | Baris ke-2 generator tidak tampil |
| TC-08 | 2 baris Numeric, 1 prefix invalid | Gagal karena 1 baris tak valid | **FAIL (blocker otomasi)** | Butuh ≥2 baris |

**AS-IS (docs):** `qa-docs/supplychain-warehouse-structure/requirement.md` V-07 (status **draft**) — prefix unique + alphabet. Kartu: Prefix Type boleh beda per level.

---

## Actual Result

1. Login Playwright + switch company **PT Huawei Tech Investment (915)** berhasil.
2. Create Warehouse Structure Type **9. Region**.
3. Child Warehouse Generator tampil: Level, Prefix, Amount, Format (Numeric/Alphabet).
4. Satu baris generator bisa diisi (contoh: Level **Building**, Prefix **LT**, Amount **2**, Format **Numeric**).
5. Isi baris kedua (nth Prefix) **tidak tersedia** — otomasi berhenti sebelum Save untuk skenario 2 level.

Data sisa dari iterasi (sudah tersimpan di Huawei): warehouse `WH8618476247` / `automation playwright ETM-8618 476462` (hasil save saat uji prefix beda kapital, 1 baris).

---

## Catatan QA

- TC-01 s.d. TC-03 dan TC-06 bisa dijadikan bukti validasi header + prefix alphabet di Huawei.
- **TC-07 (requirement after kartu) belum di-sign-off** dari run ini. Perlu retest manual atau lanjut otomasi: setelah isi baris 1, klik tombol Add pada baris kosong sampai textbox Prefix kedua muncul, lalu set Format **Alphabet**.
- Docs layer requirement masih **draft**; pesan error actual dari API dipakai sebagai expected TC-01–03/06.

---

## Isi folder

| File | Isi |
|------|-----|
| `HASIL.md` | Ringkasan ini |
| `screenshots/01-tc01-code-over-50.png` | Code >50 |
| `screenshots/02-tc01-code-space.png` | Code berisi spasi |
| `screenshots/03-tc02-name-over-150.png` | Name >150 |
| `screenshots/04-tc03-type-empty.png` | Type kosong |
| `screenshots/05-tc04-prefix-duplicate.png` | Generator 1 baris Prefix ABCD |
| `screenshots/07-tc06-prefix-non-alpha.png` | Prefix AB1 |
| `screenshots/08-tc07-generator-second-row.png` | Baris 1 Building/LT/Numeric; baris 2 belum terisi |
