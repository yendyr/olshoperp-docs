---
doc_type: technical
menu: omni-global-settings
menu_name: "Omni Channel Settings"
version: 1.0
last_updated: 2026-07-31
owner: QA - Yemima
status: review
related_docs:
  - ./knowledge-base.md
  - ./requirement.md
---

# Omni Channel Settings — Technical Documentation

> **Review** — AS-IS diverifikasi 2026-07-31. Behavior: [requirement v1.0](./requirement.md).

**Stack:** Laravel 13 · Vue 3 · MariaDB

---

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-07-31 | QA - Yemima | Technical awal: controllers, routes, select2 filters, upsert scopes, orphan/stub components, GAP refs |

---

## 1. File Map

### Backend

| Layer | Path |
|-------|------|
| Warehouse Setting | `Modules/OmniChannel/Http/Controllers/DefaultWarehouseController.php` |
| Omni Setting (min_order_date + audits) | `Http/Controllers/OmniSettingController.php` |
| Auto Approve delay | `Http/Controllers/OrderAutomationSettingController.php` |
| Orphan Sales Return config | `Http/Controllers/SalesReturnConfigurationController.php` |
| Policy | `Policies/GlobalSettingPolicy.php` |
| Entities | `Entities/DefaultWarehouse.php`, `DefaultWarehouseStock.php`, `OmniSetting.php`, `OrderAutomationSetting.php`, `GlobalSetting.php`, `SalesReturnConfiguration.php` |
| Select2 WH | reuse `Modules/SupplyChain/Http/Controllers/WarehouseController@select2WarehouseTransactionWithParent` |
| Side effect wave | `WaveController@createTransferWave` |
| Routes | `Modules/OmniChannel/Routes/api.php` |

### Frontend

| Item | Path |
|------|------|
| Form utama | `olshoperp-frontend/src/pages/Omni/master/GlobalSetting/Form.vue` |
| Order Settings | `OrderSettings.vue` |
| Orphan | `SalesReturnConfiguration.vue` (tidak di-import Form) |
| Stub | `DatalistOrderSplit.vue` |
| Router | `/omni/global-settings` |

---

## 2. API Routes

| Method | Path | Controller | Notes |
|--------|------|------------|-------|
| GET | `omnichannel/default-warehouse/show` | DefaultWarehouse@show | Detail WH setting company |
| POST | `omnichannel/default-warehouse` | @store | Upsert WH + stocks + createTransferWave |
| GET | `omnichannel/default-warehouse/select2/warehouse` | @select2Warehouse | `under_31` + `for_wh_binding` + company |
| GET | `omnichannel/default-warehouse/select2/warehouseVoid` | @select2WarehouseVoid | Void picker (UI hidden) |
| GET | `omnichannel/default-warehouse/{id}/audit` | @audit | Legacy merge audit (juga OtherCostOwner dll.) |
| GET | `omnichannel/settings` | OmniSetting@index | min_order_date (+ fields entity) |
| PATCH | `omnichannel/settings` | @update | field=`min_order_date` |
| GET | `omnichannel/settings/audits` | @audits | Audit gabungan — dipakai FE Slideover |
| GET/POST | `omnichannel/order-automation-setting` | OrderAutomationSetting | show latest / store delay_time **global** |
| resource | `omnichannel/sales-return-configuration` | SalesReturnConfiguration | API ada; UI tidak mount |

---

## 3. Database / Entities

| Entity | Scope | Key fields |
|--------|-------|------------|
| `DefaultWarehouse` | `owned_by` company | `default_warehouse_id`, `default_warehouse_void_id`, alternatives (legacy) |
| `DefaultWarehouseStock` | via `default_warehouse_id` | `warehouse_id` multi-row |
| `OmniSetting` | `owned_by` | `min_order_date` |
| `OrderAutomationSetting` | **no company** (`withoutCompanyScope`, `updateOrCreate([])`) | `delay_time` |
| `SalesReturnConfiguration` | tanpa UI | auto approve return (orphan) |

---

## 4. Select2 Warehouse filters (AS-IS)

`DefaultWarehouseController@select2Warehouse` → `WarehouseController::select2WarehouseTransactionWithParent(..., under_31: true, for_wh_binding: true, with_company_id: true)`:

| Flag | Efek |
|------|------|
| `with_company_id` | `owned_by` = company request/token |
| `under_31` | `warehouseSpaceType.level < config('warehouse.rack_level')` |
| `for_wh_binding` | Ada `settingWarehouseOutRacks.warehouse_out_rack_id`; Scrap+Return di `settingWarehouseScrapVoid`; **`level = config('warehouse.building_level')`** |

FE Process & Stock memanggil endpoint yang **sama** (Stock tanpa flag berbeda untuk skip binding filter).

Store tambahan: reject Process jika tidak `level <= 30` → `Warehouse process level must be under 31.`

---

## 5. Flow — Warehouse save

```mermaid
sequenceDiagram
    participant FE as Form.vue Save
    participant C as DefaultWarehouseController@store
    participant W as WaveController
    FE->>C: default_warehouse_id + default_warehouse_stock_id[]
    C->>C: validate required; level <= 30
    C->>C: upsert DefaultWarehouse by owned_by
    C->>W: createTransferWave(process id)
    C->>C: sync DefaultWarehouseStock (keep process WH; add/remove others)
    C-->>FE: UPDATED_MSG
```

---

## 6. Invariants

- Satu baris `DefaultWarehouse` aktif per company (upsert latest by `owned_by`).
- Process WH selalu ada di `DefaultWarehouseStock` (tidak soft-delete via remove list).
- `min_order_date` ≥ now−14 days (startOfDay).
- `delay_time` integer; **satu row global** untuk seluruh company.
- `is_all_company` / void field: void hidden FE.

---

## 7. Failure Modes

- Create Store tanpa DefaultWarehouse company → error arahkan lengkapi settings (Store controller).
- Concurrent update settings vs create Store — race autofill: `[VERIFY]` operational.
- WH Process dihapus/dinonaktifkan setelah di-set — referensi ID bisa stale: `[VERIFY]`.
- Sync order gagal "complete data in global settings" meski form OCS lengkap → OtherCost/Discount Owner (GAP-OCS-04).

---

## 8. Known Issues

Lihat [requirement §11](./requirement.md#11-gap-registry) `GAP-OCS-01` … `GAP-OCS-06`.

---

## Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| User Guide | [user-guide.md](./user-guide.md) |
