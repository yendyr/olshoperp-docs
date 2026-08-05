---
doc_type: technical
menu: omni-shipping-service
menu_name: "Master Shipping Service"
version: 2.0
last_updated: 2026-08-03
owner: QA - Yemima
status: review
related_docs:
  - ./knowledge-base.md
  - ./requirement.md
---

# Master Shipping Service — Technical Documentation

> **Review** — AS-IS 2026-08-03. Behavior: [requirement v2.0](./requirement.md).

---

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 2.0 | 2026-08-03 | QA - Yemima | File map, CRUD, binding typo key, destroy usage check, export, 3PL gate, gaps |

---

## 1. File Map

### Backend

| Layer | Path |
|-------|------|
| Controller | `Modules/OmniChannel/Http/Controllers/ShippingServiceController.php` |
| Entity | `Entities/ShippingService.php` (`omni_shipping_services`) |
| Type pivot | `Entities/ShippingServiceType.php` + `MasterShippingServiceType` |
| Binding | `Entities/ShippingServiceBindingPivot.php` |
| Export | `Services/ShippingServiceExportService.php`, `Jobs/ShippingServiceDetailExportJob.php`, `Exports/ShippingServiceDetailExportAll.php` |
| 3PL gate | `Http/Controllers/TransferShippingDoController.php` + `Company3PLWarehousePivot` |
| Shipper select2 | `GeneralCompanyController@select2Shipper` |
| Policy | `Policies/ShippingServicePolicy.php` (pola MainModel) |
| Routes | `Routes/api.php` prefix `shipping-service` |

### Frontend

| Item | Path |
|------|------|
| Datalist | `olshoperp-frontend/src/pages/Omni/master/ShippingService/DataList.vue` |
| Form | `Form.vue` |
| Binding | `BindingForm.vue` |
| WH tree | `DataListShipperWarehouse.vue` |
| Select | `components/ShippingServiceSelect.vue` |

---

## 2. API Routes (ringkas)

| Method | Path | Action |
|--------|------|--------|
| GET/POST | `shipping-service` | index / store |
| GET/PUT/DELETE | `shipping-service/{id}` | show / update / destroy |
| GET/POST | binding endpoints (show_binding / save_binding) | lihat routes group |
| GET | select2, select2-shipper, select2-shipping-service-type, select2-shipping-service-platform | helpers |
| Export | `export-file`, `export-progress`, detail export jobs | Advanced Export |

---

## 3. Model invariants

| Rule | Implementasi |
|------|----------------|
| Fillable | code, name, dims, weight/min_weight, status, is_all_company, owned_by, available_insurance, is_default_shipping_service, shipping_id — **no logistic label** |
| Type | `shipping_service_type_id` array max 1 on create; update tidak rewrite type pivot (UI locked) |
| Default | Saat set default=1, clear default lain `owned_by` = token company |
| Units | cm / gr di-resolve dari `Unit` saat store |
| Search select2 | `name`/`code` `likeContains` |

---

## 4. Binding (`save_binding`)

**Request key (typo AS-IS, jangan “perbaiki” tanpa migrasi FE):** `shipping_service_platfrom` (array of platform row ids).

```mermaid
sequenceDiagram
    participant FE as BindingForm
    participant C as save_binding
    participant P as ShippingServiceBindingPivot
    FE->>C: shipping_service_platfrom[]
    C->>C: Store.default_company_owner = token company?
    alt not owner
        C-->>FE: Binding failed... default owner...
    end
    C->>P: conflict same platform + other master same owned_by?
    alt conflict
        C-->>FE: already bound to shipping service (codes)
    end
    C->>P: delete removed; restore/create added
```

- Diff delete soft-deletes removed pivots.  
- Create sets `platform_id` from Platform Shipping Service row.  
- Conflict check **scoped** `owned_by` current company — multi-owner bind possible from Master; Platform menu still 1:1 global.

---

## 5. Destroy usage check (GAP-MSS-03)

```php
SalesOrder::where('shipping_platform_system_id', $shipping_service)->exists();
```

`$shipping_service` model/id Master. SO Platform sering menyimpan **Platform Shipping Service id** di kolom yang sama → false negative.

**Inactive (GAP-MSS-02):** `update` set `status` 0/1 tanpa cek SalesOrder dan tanpa hapus pivot.

---

## 6. Export

| Variant | Method | Rows |
|---------|--------|------|
| With Details | `export_chunk_shipping_service_with_details` | Per binding (+ empty binding → one dash row) |
| Without Details | `export_chunk_shipping_service_without_details` | One row; platform cols `-` |

Shared columns: code, name, shipper, type, L/W/H, weight, min_weight, insurance, is_default, status, description, created by/at, platform_* .

---

## 7. Downstream gates

| Point | Behavior |
|-------|----------|
| Shipping DO approve | `Company3PLWarehousePivot::where('company_id', $delivery_order->shipper_id)->first()` atau ValidationException message 3PL warehouse |
| SO shipper autofill | Dari `Master.shipping_id` (General); Platform via binding resolve |
| Warning datalist | Master `weight`/`length|width|height` **>** bound platform values → icon + tooltip |

---

## 8. Known Issues

[requirement §11](./requirement.md#11-gap-registry) `GAP-MSS-01` … `05`.  
Technical debt: request key `shipping_service_platfrom` (typo) — keep FE/BE sync.

---

## Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| User Guide | [user-guide.md](./user-guide.md) |
| Platform Shipping | [../omni-shipping-service-platform/technical.md](../omni-shipping-service-platform/technical.md) |
