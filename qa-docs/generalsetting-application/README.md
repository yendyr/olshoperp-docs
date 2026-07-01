# Application (General Settings) — Dokumentasi

Menu **Application** — toggle pengaturan per company: batas tampilan transaksi, stok virtual void, dan Sales Order automation.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator, admin | draft |
| Requirement | [requirement.md](./requirement.md) | PM, QA, Dev | draft |
| Technical | [technical.md](./technical.md) | Developer | draft |

**Maintenance owner:** QA — Yemima

## Route & code

- FE: `/generalsetting/application` → `olshoperp-frontend/src/pages/master/Application/Form.vue`
- BE: `RenderTransactionLimitController`, `OrderProcessSettingController`, `GenerateSalesOrderSettingController`

## Sidebar

- Group: **General Setting**
- `menu_link`: `generalsetting/application`
- Entity menu class: `RenderTransactionLimit`
