# Internal Company — Dokumentasi

Menu **Internal Company** — perusahaan internal (`company_type = internal`) dalam struktur tree, termasuk kontak, alamat, dokumen, dan setup akuntansi.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator, admin | draft |
| Requirement | [requirement.md](./requirement.md) | PM, QA, Dev | draft |
| Technical | [technical.md](./technical.md) | Developer | draft |
| User Guide | user-guide.md | End-user publish | **pending** |

**PM source:** requirement v1.1 · KB/technical v1.1 (lockstep)

**Maintenance owner:** QA — Yemima

## Route & code

- FE: `/generalsetting/internal-company` → `olshoperp-frontend/src/pages/master/company/InternalCompanyList.vue`, `Form.vue`
- BE: `Modules/GeneralSetting/Http/Controllers/InternalCompanyController.php`
- Accounting COA: shared `CompanyAccountingController` — [General Company GAP-GC-CB-01](../generalsetting-general-company/requirement.md#gap-registry)

## Sidebar

- Group: **General Setting** → submenu **Master Company**
- `menu_link`: `generalsetting/internal-company`

## Changelog

| Version | Date | Perubahan |
|---------|------|-----------|
| 1.1 | 2026-08-04 | TO-BE Cash/Bank COA exclusion (GAP-IC-CB-01); cross-ref shared API GAP-GC-CB-01 |
| 1.0 | 2026-06-19 | Initial draft AS-IS |
