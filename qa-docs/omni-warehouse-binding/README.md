# Warehouse Binding — Dokumentasi

Menu **Warehouse Binding** (Omni Channel) — mapping gudang platform marketplace ke gudang sistem internal (Process, Stock, Return).

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator | draft |
| Requirement | [requirement.md](./requirement.md) | PM, QA, Dev | draft |
| Technical | [technical.md](./technical.md) | Developer | draft |

**Maintenance owner:** QA — Yemima

## Route & code

- **FE route:** `/omni/warehouse-binding` → `olshoperp-frontend/src/pages/Omni/master/WarehouseBinding/`
- **BE controller:** `Modules/OmniChannel/Http/Controllers/WarehouseBindingController.php`
- **Primary table:** `omni_warehouse_binding_pivot`

## Related menus

| Menu | Relasi |
|------|--------|
| [Store](../omni-store-binding/README.md) | Sumber WH platform via sync warehouse |
| [Waves Management](../omni-waves-management/README.md) | `createTransferWave` saat bind Process |
| [Picking Process](../omni-picking-process/README.md) | Transfer internal ke virtual WH wave |
