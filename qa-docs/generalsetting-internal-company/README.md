# Internal Company — Dokumentasi

Menu **Internal Company** — perusahaan internal (`company_type = internal`) dalam struktur tree, termasuk kontak, alamat, dokumen, dan setup akuntansi.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator, admin | draft |
| Requirement | [requirement.md](./requirement.md) | PM, QA, Dev | draft |
| Technical | [technical.md](./technical.md) | Developer | draft |

**Maintenance owner:** QA — Yemima

## Route & code

- FE: `/generalsetting/internal-company` → `olshoperp-frontend/src/pages/master/company/InternalCompanyList.vue`, `Form.vue`
- BE: `Modules/GeneralSetting/Http/Controllers/InternalCompanyController.php`

## Sidebar

- Group: **General Setting** → submenu **Master Company**
- `menu_link`: `generalsetting/internal-company`
