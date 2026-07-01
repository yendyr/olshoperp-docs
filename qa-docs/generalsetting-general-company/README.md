# General Company — Dokumentasi

Menu **General Company** (alias: Master Customer, Customer, Master Supplier, Supplier, Shipper, Manufacturer) — master partner bisnis eksternal (`company_type = general`).

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator | draft |
| Requirement | [requirement.md](./requirement.md) | PM, QA, Dev | draft |
| Technical | [technical.md](./technical.md) | Developer | draft |
| Test Cases | [test-cases/README.md](./test-cases/README.md) | QA, Manual Tester | review |

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
| [Sales Order General](../sales-order-general/README.md) | Default Shipper autofill; Default Customer saat clone dari platform |
| [Instant Settlement](../accounting-settlement-upload/README.md) | Shipper → rantai DO → WH 3PL |
| [Purchase Order](../supplychain-purchase-order/README.md) | Supplier, alamat primary, currency & payment type default |
| [Internal Company](../generalsetting-internal-company/README.md) | Pola nested CRUD (contact/address/document) sama |

## Changelog ringkas

| Tanggal | Perubahan |
|---------|-----------|
| 2026-06-24 | Konsolidasi requirement PM + verifikasi codebase (import, COA class, UI/UX, gap analysis) |
| 2026-06-23 | Cross-reference Instant Settlement |
| 2026-06-19 | Draft AS-IS awal |
