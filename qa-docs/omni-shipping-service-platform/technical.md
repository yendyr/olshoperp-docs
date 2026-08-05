---
doc_type: technical
menu: omni-shipping-service-platform
menu_name: "Platform Shipping Service"
version: 2.0
last_updated: 2026-08-03
owner: QA - Yemima
status: review
related_docs:
  - ./knowledge-base.md
  - ./requirement.md
---

# Platform Shipping Service — Technical Documentation

> **Review** — AS-IS 2026-08-03. Behavior: [requirement v2.0](./requirement.md).

---

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 2.0 | 2026-08-03 | QA - Yemima | File map, routes, sync job, Shopee/TikTok field mapping, binding API, gaps |

---

## 1. File Map

### Backend

| Layer | Path |
|-------|------|
| Controller | `Modules/OmniChannel/Http/Controllers/ShippingServicePlatformController.php` |
| Sync log API | `Http/Controllers/ShippingServiceSyncLogController.php` |
| Job | `Jobs/ShippingServiceSyncJob.php` |
| Entity | `Entities/ShippingServicePlatform.php`, `ShippingServicePlatformGroup.php`, `ShippingServiceBindingPivot.php`, `ShippingServiceSyncLog.php` |
| Shopee sync | `Services/OmniShopeeService@sync_logistic_all` |
| TikTok sync | `Services/OmniTikTokService@sync_logistic_all` |
| Lazada stub | `Services/OmniLazadaService@getLogistics` (no `sync_logistic_all`) |
| Facade | `Services/OmniService` (`sync_logistic_all`, Tokopedia deprecated) |
| Policy | `Policies/ShippingServicePlatformPolicy.php` |
| Unique lock | `Constants/UniqueJobKey::sync_shipping($store_id)` |
| Routes | `Routes/api.php` prefix `shipping-service-platform` |

### Frontend

| Item | Path |
|------|------|
| Datalist | `olshoperp-frontend/src/pages/Omni/master/ShippingServicePlatform/DataList.vue` |
| Show/Form | `Form.vue` |
| Bulk Sync | `components/BulkSyncSidePage.vue` |
| Binding | `components/BindingModal.vue` |
| Sync log UI | `components/SyncLogTable.vue`, `PlatformLogisticsLog.vue` |

---

## 2. API Routes

| Method | Path | Action |
|--------|------|--------|
| GET | `shipping-service-platform` | index datalist |
| GET/PUT/DELETE | `shipping-service-platform/{id}` | show / update / destroy |
| POST | `shipping-service-platform` | store (API; bukan UX list Create) |
| GET | `shipping-service-platform/sync-all` | Bulk Sync dispatch |
| GET | `shipping-service-platform/queues/validate` | queue lock check |
| GET | `shipping-service-platform/preview-stores` | preview store ids |
| GET/POST | `{id}/bindings` | list / bind |
| POST | `{id}/bindings/unbind` | unbind |
| GET | `{id}/audit` | audit |
| GET | select2-* | shipper / type helpers |

---

## 3. Sync pipeline

```mermaid
sequenceDiagram
    participant FE as BulkSyncSidePage
    participant C as ShippingServicePlatformController@sync
    participant J as ShippingServiceSyncJob
    participant S as OmniShopee/TikTok sync_logistic_all
    FE->>C: GET sync-all
    C->>C: collect active Shopee+TikTok stores; create ShippingServiceSyncLog
    loop per store
        C->>J: dispatch(store_id, sync_log_id)
        J->>S: sync_logistic_all
        S-->>J: upsert DO/PU rows
        J->>J: addSuccess / addFailed; complete log when done
    end
```

**Upsert key (aktif, non-deleted):** `platform_id` + `shipping_platform_id` (`{channelId}-DO|PU`) + `owned_by` (`store.data_owner_id`).

**Shopee notes:** skip `!enabled`; weight kg→gram (`*1000`); SPX Hemat/Standard empty dim → 120; `shippingServiceType.shipping_service_type_id = 1`.

**TikTok notes:** requires `WarehousePlatform` per store; dim cross-map `length=max_height`, `width=max_length`, `height=max_width`; same type id `1`.

---

## 4. Binding

| Method | Rule |
|--------|------|
| `binds` | Require `shipping_service_id`; reject if pivot exists for platform row |
| `unbind` | Require id or ids; delete pivot(s) |
| Pivot | `ShippingServiceBindingPivot` (`shipping_service_id`, `shipping_service_platform_id`, `platform_id`) |

Datalist `binding_status_formatted` = `withExists('shippingServiceBindingPivot')`.

---

## 5. Store Name column (GAP-PSP-04)

```php
Store::where('platform_id', $row->platform_id)
    ->where('authorization_status', 1)->where('status', 1)->first();
```

First active store for that platform — **not** the store that synced the row.

---

## 6. Invariants & failure modes

- AS-IS max **one** active binding per Platform Shipping Service row.
- Active rows default status true until soft-delete.
- Sync lock per store via `UniqueJobKey::sync_shipping`; Bulk Sync errors aggregate reauthorize + dispatch failures.
- Empty store list → log completed with total 0.
- Tokopedia: constructing `OmniService(PL_TOKOPEDIA)` throws deprecated — not in sync list.

---

## 7. Known Issues

[requirement §11](./requirement.md#11-gap-registry) `GAP-PSP-01` … `07`.

---

## Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| User Guide | [user-guide.md](./user-guide.md) |
