# Warehouse Binding — Dokumentasi

Menu **Warehouse Binding** (Omni Channel) — mapping gudang platform → gudang sistem (Process, Stock, Return).

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator | review |
| Requirement | [requirement.md](./requirement.md) | PM, QA, Dev | review |
| Technical | [technical.md](./technical.md) | Developer | review |
| User Guide | [user-guide.md](./user-guide.md) | Publish | review |

**Last updated:** 2026-10-09 · **Maintenance:** QA — Yemima

## Route & code

- **FE:** `/omni/warehouse-binding`
- **BE:** `WarehouseBindingController`
- **Table:** `omni_warehouse_binding_pivot`

## Related

| Menu | Relasi |
|------|--------|
| [Store](../omni-store-binding/README.md) | Sync WH platform |
| [Waves Management](../omni-waves-management/README.md) | `createTransferWave` saat bind Process |
| [Picking Process](../omni-picking-process/README.md) | Transfer ke virtual WH wave |
