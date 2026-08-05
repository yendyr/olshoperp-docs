# General Company — Dokumentasi

Menu **General Company** (alias: Master Customer, Customer, Master Supplier, Supplier, Shipper, Manufacturer) — master partner bisnis eksternal (`company_type = general`).

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator | review |
| Requirement | [requirement.md](./requirement.md) | PM, QA, Dev | review |
| Technical | [technical.md](./technical.md) | Developer | review |
| User Guide | [user-guide.md](./user-guide.md) | Publish eksternal | review |
| Test Cases | [test-cases/README.md](./test-cases/README.md) | QA, Manual Tester | review |

**PM source:** Source of Truth General Company **v1.0** (30 Juli 2026)  
**3 layer version:** 2.4 (2026-08-04) · **User-guide:** 1.1 (`source_version` 2.4)  
**Maintenance owner:** QA — Yemima

## Navigasi

| Item | Nilai |
|------|-------|
| Sidebar | General Setting → Master Company → **General Company** |
| Route UI | `/generalsetting/general-company` |
| `menu_link` | `generalsetting/general-company` |
| Menu ID (Gate) | 118 |

## File utama

- FE datalist: `olshoperp-frontend/src/pages/master/company/DataListGeneralCompany.vue`
- FE form (shared internal/general): `olshoperp-frontend/src/pages/master/company/Form.vue`
- BE controller: `Modules/GeneralSetting/Http/Controllers/GeneralCompanyController.php`

## Relasi menu terkait

| Menu | Hubungan |
|------|----------|
| [Dev - Sales Order](../sales-order-general/README.md) | Default Shipper autofill |
| [Dev - Sales Platform](../omni-sales-platform/README.md) | Default Customer saat clone / create dari platform |
| [All Sales Order](../all-sales-order/README.md) | Create gabungan memakai default yang sama |
| [Instant Settlement](../accounting-settlement-upload/README.md) | Shipper → rantai DO → WH 3PL |
| [Purchase Order](../supplychain-purchase-order/README.md) | Supplier, alamat primary, currency & payment type default |
| [Internal Company](../generalsetting-internal-company/README.md) | Pola nested CRUD (contact/address/document) sama |

## Changelog ringkas

| Tanggal | Perubahan |
|---------|-----------|
| 2026-08-04 | TO-BE: COA vs Cash/Bank exclusion semua slot Accounting Setting — `GAP-GC-CB-01`; 3 layer v2.4 |
| 2026-07-30 | Selaras SoT v1.0: FE Import kini wired (resolve G-01); Gap Registry `GAP-GC-NN`; user-guide baru; status 3 layer → review |
| 2026-06-24 | Konsolidasi requirement PM + verifikasi codebase (import, COA class, UI/UX, gap analysis) |
| 2026-06-23 | Cross-reference Instant Settlement |
| 2026-06-19 | Draft AS-IS awal |
