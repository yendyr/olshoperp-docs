# Store — Dokumentasi

Menu **Store** (Omni Channel) — registrasi toko marketplace/offline, OAuth authorize, konfigurasi gudang & COA, sinkronisasi produk/order/warehouse, dan pricelist per store.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator, ops | draft |
| Requirement | [requirement.md](./requirement.md) | PM, QA, Dev | draft |
| Technical | [technical.md](./technical.md) | Developer | draft |

**Maintenance owner:** QA — Yemima  
**Versi dokumen:** 2.0 (2026-06-25) — konsolidasi requirement bisnis + verifikasi codebase

## Route & code

- **FE route:** `/omni/store-binding` → `olshoperp-frontend/src/pages/Omni/master/StoreBinding/`
- **BE controller:** `Modules/OmniChannel/Http/Controllers/StoreController.php`
- **Primary table:** `omni_stores`

## Related menus

| Menu | Relasi |
|------|--------|
| [Warehouse Binding](../omni-warehouse-binding/README.md) | Mapping WH platform ↔ WH sistem per store (Process/Stock/Return) |
| [Manage Platform Product](../manage-platform-product/README.md) | Sync & bind produk per store |
| [Dev - Sales Platform](../omni-sales-platform/README.md) | Sync order platform |
| [Dev - Sales Order](../sales-order-general/README.md) | Import SO General (store Others) |
| [Waves Management](../omni-waves-management/README.md) | Wave filter by store |
| [Instant Settlement](../accounting-settlement-upload/README.md) | COA & cash/bank store untuk Approve settlement |
| [Settlement Mapping](../accounting-settlement-mapping/README.md) | Mapping kolom settlement per platform/store |
| [Other Cost](../omni-other-cost/README.md) | Field Applied to Store (tipe Others) — import |
| [Other Discount](../omni-other-discount/README.md) | Field Applied to Store (tipe Others) — import |
| [Omni Channel Settings](../omni-global-settings/README.md) | Fallback default warehouse & building stock |
| [Failed Ship](../supplychain-failed-ship/README.md) | Relasi `store_id` pada failed order |
| [Sales Return](../accounting-sales-return/README.md) | Sync return per store |
| [Credit Note](../accounting-credit-note/README.md) | Import dengan kolom Store opsional |

## Catatan penting

- Menu **Store tidak memiliki fitur import master data** — tidak ada template Excel/CSV untuk create/update store.
- Template import yang **mereferensikan** store ada di menu lain (Instant Settlement, Sales Order General, Other Cost/Discount, Credit Note) — detail di [requirement.md §6](./requirement.md#6-import--referensi-store-di-menu-lain).
