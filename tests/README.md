# Playwright E2E — Panduan Tim QA

Automation staging: **https://staging.olshoperp.com**

| Dokumen | Isi |
|---------|-----|
| **`POM-AUTOMATION-ROADMAP.md`** | Roadmap fase, checklist, progress, template prompt Notion-style |
| **`QA-AUTOMATION-GUIDE.md`** | Panduan QA tanpa codebase — prompt, perintah, aturan |
| `.cursor/rules/14-playwright-e2e.mdc` | SOP eksekusi lengkap untuk agent |
| `pom-registry/README.md` | Kamus elemen per menu |

---

## Struktur folder

```
tests/
├── QA-AUTOMATION-GUIDE.md       # Mulai di sini (QA)
├── global-setup.ts              # Login + switch company → .auth/
├── pom-registry/                # Kamus selector (dari Vue, bukan generator)
│   ├── system-product.yaml
│   ├── purchase-requisition.yaml
│   ├── pricelist-category.yaml
│   └── purchase-order.yaml
├── specs/
│   ├── smoke/pom-smoke.spec.ts  # @smoke — 4 menu datalist + PO create
│   ├── system-product/
│   ├── pricelist-category/
│   └── purchase-requisition/
└── helpers/
    ├── shared/                  # datalist, multiselect, form-actions, toast
    ├── company-access.ts
    ├── system-product.ts
    ├── pricelist-category.ts
    ├── purchase-requisition.ts
    └── purchase-order.ts        # baru — smoke + form dasar
```

---

## Menjalankan test

```powershell
cd d:\olshoperp-docs
npm install
npm run test:preflight

# Smoke POM — 4 menu (QA daily check)
npm run test:smoke

# System Product — satu skenario
npm run test:system-product:tc -- "SKU-WENTER"

# Satu TC by tag
npm run test:tc -- "@TC-SYSPROD-001"

# Laporan HTML
npm run test:report
```

---

## Mapping menu ↔ POM

| Menu | Registry | POM | Spec | Status |
|------|----------|-----|------|--------|
| System Product | `pom-registry/system-product.yaml` | `helpers/system-product.ts` | `specs/system-product/` | TC automated |
| Purchase Requisition | `pom-registry/purchase-requisition.yaml` | `helpers/purchase-requisition.ts` | `specs/purchase-requisition/` | TC automated |
| Pricelist Category | `pom-registry/pricelist-category.yaml` | `helpers/pricelist-category.ts` | `specs/pricelist-category/` | TC automated |
| Purchase Order | `pom-registry/purchase-order.yaml` | `helpers/purchase-order.ts` | `specs/smoke/` | Smoke only |

---

## Kredensial & company default

| Item | Nilai |
|------|--------|
| Email | `playwright@gmail.com` |
| Password | `12345678` |
| Company default | `lumicharmsid` (153) |

Folder tidak di-commit: `node_modules/`, `test-results/`, `playwright-report/`, `tests/.auth/`
