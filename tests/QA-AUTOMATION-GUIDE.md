# Panduan QA — Automation tanpa Codebase

Dokumen ini untuk tim QA yang **hanya** membuka repo `olshoperp-docs`.

> Roadmap fase, checklist progress, template prompt: **[POM-AUTOMATION-ROADMAP.md](./POM-AUTOMATION-ROADMAP.md)**

Staging: https://staging.olshoperp.com

---

## Apa yang sudah tersedia (mulai hari ini)

| Asset | Lokasi | Fungsi |
|-------|--------|--------|
| **Shared UI helpers** | `tests/helpers/shared/` | Pola datalist, multiselect, tombol Save — tidak perlu tebak selector |
| **POM registry** | `tests/pom-registry/*.yaml` | Kamus elemen per menu (dari Vue, bukan generator) |
| **Menu POM** | `tests/helpers/{menu}.ts` | Method siap pakai untuk Playwright |
| **Smoke test** | `tests/specs/smoke/pom-smoke.spec.ts` | Cek 4 menu bisa dibuka + Create |
| **TC docs** | `qa-docs/{menu}/test-cases/` | Skenario bisnis (steps + expected) |

### Menu dengan POM siap

| Menu | Registry | POM | TC automated |
|------|----------|-----|--------------|
| System Product | `pom-registry/system-product.yaml` | `helpers/system-product.ts` | Ya |
| Purchase Requisition | `pom-registry/purchase-requisition.yaml` | `helpers/purchase-requisition.ts` | Ya |
| Pricelist Category | `pom-registry/pricelist-category.yaml` | `helpers/pricelist-category.ts` | Ya |
| Purchase Order | `pom-registry/purchase-order.yaml` | `helpers/purchase-order.ts` | Smoke only |

---

## Setup sekali

```powershell
cd d:\olshoperp-docs
npm install
npm run test:preflight
```

Kredensial default:

| Item | Nilai |
|------|--------|
| Email | `playwright@gmail.com` |
| Password | `12345678` |
| Company | `lumicharmsid` (153) |

---

## Perintah yang dipakai sehari-hari

```powershell
# Smoke — cek POM 4 menu (cepat, ~2 menit)
npm run test:smoke

# Satu TC by tag
npm run test:tc -- "@TC-SYSPROD-003"

# Satu menu
npm run test:system-product:tc -- "SKU-WENTER"

# Laporan HTML jika FAIL
npm run test:report
```

---

## Cara kerja: prompt → hasil (tanpa codebase)

### 1. Cek menu sudah punya POM?

Buka `tests/pom-registry/` — jika ada `{menu-slug}.yaml`, selector sudah dibekukan.

Jika **belum ada** → minta tim dev/lead tambahkan POM dulu (jangan automate dengan tebak selector).

### 2. Prompt ke Cursor (template)

```
[@automate]
Menu: system-product
Company: lumicharmsid

Steps:
1. Klik Create di datalist
2. ...

Test data:
- SKU: SKU-TEST-001
- Name: Produk Test

Expected: (dari requirement §X)
- SKU muncul di datalist

Tolong:
1. Cek pom-registry + helpers — jangan tulis selector baru di spec
2. Buat/update TC di qa-docs jika perlu (konfirmasi dulu)
3. Tulis spec tipis di tests/specs/
4. Run: npm run test:tc -- "@TC-XXX"
5. Laporkan PASS/FAIL
```

### 3. Aturan emas

| ✅ Lakukan | ❌ Jangan |
|-----------|----------|
| Panggil method POM di spec | Tulis `page.locator('div.xxx')` di spec |
| Baca `pom-registry/*.yaml` untuk nama elemen | Pakai POM generator extension mentah |
| Run scoped `-g "@TC-XXX"` | Run full suite untuk satu TC |
| Expected dari `requirement.md` | Tebak expected dari pengalaman ERP lain |

---

## Kalau test FAIL

1. Buka `npm run test:report` → screenshot + trace
2. Cek apakah label tombol berubah di staging
3. Laporkan ke QA lead — update **POM/registry**, bukan TC steps
4. Re-run scoped test

---

## Menambah menu baru (minta ke agent/dev)

Checklist menu baru:

- [ ] `tests/pom-registry/{slug}.yaml`
- [ ] `tests/helpers/{slug}.ts` (pakai `shared/`)
- [ ] Smoke di `tests/specs/smoke/pom-smoke.spec.ts`
- [ ] Minimal 1 TC + spec dengan tag `@TC-XXX`

---

## Perbedaan vs sebelumnya

| Sebelum | Sekarang |
|---------|----------|
| Selector dari POM generator / DOM | Selector dari Vue → registry YAML |
| Setiap TC tebak elemen baru | Reuse `shared/` + menu POM |
| 3 menu, tidak ada standar | 4 menu + registry + shared + smoke |
| QA butuh codebase untuk debug selector | QA cukup baca registry + panggil POM |

Maintenance: jika UI berubah, update `pom-registry` + `helpers` — QA tidak perlu buka folder `olshoperp-frontend` kecuali ada perubahan besar.
