# Hasil Automate Testing — ETM-15556 / TC-SYSPROD-006

**Tanggal run:** 19 Agustus 2026  
**Environment:** Staging (`https://staging.olshoperp.com/supplychain/product`)  
**Company:** Dev Staging / DEV-STG (id 13)  
**Menu:** System Product  
**Spec:** `tests/specs/system-product/etm-15556-import-new-default.spec.ts`  
**Perintah:** `npx playwright test tests/specs/system-product/etm-15556-import-new-default.spec.ts --project=authenticated -g "@TC-SYSPROD-006"`  
**Kartu:** [ETM-15556](https://erpintegration.atlassian.net/browse/ETM-15556)

---

## Ringkasan

**FAIL.** Import New Product untuk 1 row Single-eligible **gagal** (status Import History = Failed, 1 failed row, 0 success). Expected parent `{sku}-(PARENT)` + child = SKU file **tidak tercapai**.

---

## Detail vs kartu / requirement §6.3.1

| AC | Hasil | Bukti |
|----|-------|-------|
| Master Default ON ada (prasyarat GAP-VAR-01) | **PASS** — Variant Group `STD` / **Standard** (id 2970) | `measurements.json` `defaultVariant` |
| Import → New Product 1 row, Variant Type/Option/Parent/Type kosong | **PASS** (file ter-upload sebagai Import New Product) | `screenshots/04-import-history-failed.png` |
| Import sukses | **FAIL** — Failed, 1 failed row, 0 success | row `ETM15556-IN-20260819082904.xlsx` 19-08-2026 15:29:50 |
| Parent = `{sku}-(PARENT)` | **FAIL** — tidak diverifikasi (import gagal) | — |
| Child = `{sku}` tanpa suffix opsi Default | **FAIL** — tidak diverifikasi (import gagal) | — |
| Enable Variations ON + Default group | **FAIL** — tidak diverifikasi (import gagal) | — |

File run terakhir: `ETM15556-IN-20260819082904.xlsx` (Playwright User). Run sebelumnya `ETM15556-IN-20260819031138.xlsx` juga Failed 1/0.

---

## Alur yang dijalankan

1. Login + switch company **Dev Staging** (13).
2. Buka System Product datalist.
3. Download template New Product (API `download-template`).
4. Isi 1 row: SKU + Name + Unit `Pieces` + Category `Hobbies & Collections`. Kolom Variant Type / Variant Option / Type / Parent dikosongkan.
5. Import History → Import → **Upload File**.
6. Cek Import History: action **Import New Product**, status **Failed**.

---

## Catatan QA

- File TC `qa-docs/system-product/test-cases/TC-SYSPROD-006.md` **tidak ada** di repo; skenario diambil dari kartu Jira ETM-15556 + requirement §6.3.1.
- Template New Product **tidak punya** kolom Product COA Group. Kolom aktual: System Product SKU, System Product Name, Variant Type, Variant Option, Type, Parent, Unit, Category, Price, Dimension & Weight.
- Pesan error baris gagal **belum** dibaca di tab **View Error Logs** — automation timeout di poll `GET /progress` (progress API tidak menandai done setelah import Failed).
- UI Import: datalist **Import** membuka modal **Import History**; dropdown di modal = **Upload File** / **Download Template** (bukan langsung New Product).

**Rekomendasi:** Buka tab View Error Logs untuk `ETM15556-IN-20260819082904.xlsx` agar alasan 1 row gagal diketahui (validasi Category/Unit, Default Variant, atau kolom wajib lain).
