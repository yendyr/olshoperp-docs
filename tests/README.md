# Playwright E2E — Panduan Tim QA

Automation staging: **https://staging.olshoperp.com**

SOP eksekusi lengkap: **`C:\Users\p\Documents\playwright-e2e-execution-standard.md`** (v1.2) — di luar repo.

---

## Struktur folder (slug-first)

Folder spec mengikuti **slug manifest** (`qa-docs/_meta/manifest.yaml`), bukan nama modul UI.

```
tests/
├── global-setup.ts              # Login + switch company sekali per run → .auth/
├── specs/
│   ├── gate-user/
│   │   └── company-access.spec.ts       # Login & switch company (tanpa session)
│   ├── system-product/
│   │   ├── system-product.spec.ts       # lumicharmsid — TC-SYSPROD-001/002
│   │   └── system-product-dev-stg.spec.ts # DEV-STG — SKU-PLUSHIE, SKU-TRUZV1
│   └── pricelist-category/
│       └── category-price.spec.ts       # Category Price — lumicharmsid
└── helpers/                     # POM & flow reusable (bukan skenario)
    ├── company-access.ts
    ├── system-product.ts
    └── pricelist-category.ts
```

| Folder | Isi | Bukan untuk |
|--------|-----|-------------|
| `specs/{slug}/` | File `*.spec.ts` — langkah test | Helper, config, kode di `qa-docs/` |
| `helpers/` | Login, POM, flow bersama | Skenario TC utuh |
| `.auth/` | Session tersimpan (gitignored) | Commit ke Git |

**Root repo:**

```
olshoperp-docs/
├── playwright.config.ts         # Project login-flow vs authenticated
├── package.json
└── qa-docs/                     # TC & requirement (dokumentasi saja)
```

---

## Dua mode project Playwright

| Project | Spec | Login UI |
|---------|------|----------|
| `login-flow` | `specs/gate-user/company-access.spec.ts` | Ya — uji login & switch company |
| `authenticated` | Semua spec lain | Tidak — pakai session `tests/.auth/lumicharmsid.json` |

---

## Artefak (headless default)

| Artefak | Setting | Kapan tersedia |
|---------|---------|----------------|
| Screenshot | `only-on-failure` | Gagal → `test-results/.../test-failed-1.png` |
| Trace | `retain-on-failure` | Gagal → buka via `npx playwright show-trace <zip>` |
| Video | `off` | — |
| HTML report | `playwright-report/` | `npm run test:report` |

Mode **SIGN-OFF** (demo visual): `npm run test:headed` atau set `PW_HEADLESS=false` + `PW_SLOW_MO=1000`.

---

## Setup cepat

```powershell
cd d:\olshoperp-docs
npm install
npm run test:preflight    # install chromium + list tests
```

Akun default: `playwright@gmail.com` / `12345678`

| Code | ID | Label UI |
|------|----|----------|
| FAT | 112 | FAT |
| lumicharmsid | 153 | Lumi Charms.id |
| DEV-STG | 13 | Dev Staging |

---

## Menjalankan test

```powershell
# Semua (authenticated)
npm test

# Satu TC (disarankan)
npm run test:tc -- "@TC-SYSPROD-001"

# Satu skenario by judul
npm run test:tc -- "SKU-GELAS"

# Sign-off visual
npm run test:headed -- "SKU-GELAS"

# Login saja
npx playwright test --project=login-flow

# Laporan HTML
npm run test:report
```

---

## Mapping TC docs ↔ spec

| TC | Dokumentasi | Spec |
|----|-------------|------|
| TC-GATE-001 | `qa-docs/gate-user/test-cases/TC-GATE-001.md` | `specs/gate-user/company-access.spec.ts` |
| TC-SMENU-001..003 | `qa-docs/sidebar-menu/test-cases/` | `specs/gate-user/company-access.spec.ts` |
| TC-SYSPROD-001..002 | `qa-docs/system-product/test-cases/` | `specs/system-product/system-product.spec.ts` |
| DEV-STG demo | — | `specs/system-product/system-product-dev-stg.spec.ts` |
| Category Price | route `/businessdevelopment/pricelist-category` | `specs/pricelist-category/category-price.spec.ts` |

Playwright **tidak membaca** file TC saat runtime — TC = dokumentasi QA; yang dijalankan = `.spec.ts`.

---

## Variabel environment

| Variabel | Default |
|----------|---------|
| `OLSHOP_BASE_URL` | `https://staging.olshoperp.com` |
| `OLSHOP_COMPANY_CODE` | `lumicharmsid` |
| `OLSHOP_TEST_EMAIL` | `playwright@gmail.com` |
| `OLSHOP_TEST_PASSWORD` | `12345678` |
| `PW_HEADLESS` | `true` (set `false` untuk SIGN-OFF) |
| `PW_SLOW_MO` | `0` (set `1000` untuk SIGN-OFF) |

---

## Troubleshooting (QA)

| Gejala | Arti | Langkah |
|--------|------|---------|
| `Executable doesn't exist` | Browser belum terinstall | `npm run test:preflight` |
| `localStorage` / `SecurityError` | Session dibaca sebelum staging terbuka | Pull terbaru; jalankan ulang |
| Muncul `/login` di test menu | Session expired | Hapus `tests/.auth/`, run ulang |
| `Switch Company` tidak ketemu | Label UI salah | Pakai **Lumi Charms.id**, bukan `lumicharmsid` |
| SKU sudah ada | Normal (idempotent) | Test lewati create, cek datalist saja |

Folder tidak di-commit: `node_modules/`, `test-results/`, `playwright-report/`, `tests/.auth/`
