---
doc_type: technical
menu: supplychain-delivery-order
menu_name: "Delivery Order"
version: 1.0
last_updated: 2026-10-05
owner: QA - Yemima
status: review
audience: developer
---

# Delivery Order — Technical Documentation

**SoT:** `_meta/sot/supplychain-delivery-order-source-of-truth.md` v1.0

---

## 1. Generate Collecting (dari packing)

`TransferShippingController::generateShippingList`  
- `process_type` = `PROCESS_TYPE_SHIPPING` · prefix `SL` · origin = packing dest · dest = WH `PROCESS_GROUP_SHIP` · status **Open** · SO collecting.

---

## 2. Insert

| Method | File | Behavior |
|--------|------|----------|
| By order | `DeliveryOrderDetailController::storeSalesOrder` | Approve collecting `SL` jika belum Approved |
| By TF | `storeTransferInternal` + `outstanding_transfer_internal_group` | List `process_type` shipping; filter `!= approved` **commented out** |
| Approve SL Open | `StockMutationTransferController::approve` | Saat attach |

Qty: increment `prepared_to_do_quantity` pada SO detail / outbound detail.

---

## 3. Approve DO

`DeliveryOrderController::approveDeliveryOrder` (SupplyChain):

1. Prepared → processed qty.  
2. `TransferShippingDoController::generateShippingList` — `PROCESS_TYPE_SHIPPING_DO`, dest `Company3PLWarehousePivot` by **`$delivery_order->shipper_id`**.  
3. Approve TF `SHIPPING_DO`.  
4. SO `processing_status_id` = `SHIPPED_ID`.

Tanpa pivot 3PL: `Approval failed because the shipper doesn’t have a 3PL warehouse.`

---

## 4. GAP-DO-01

Tidak ada sync `platform_logistic` / `shipper_id` SO vs baris DO setelah insert. Approve **tidak** re-resolve 3PL dari SO terkini.

---

## 5. FE

- Datalist: `SCM/DeliveryOrder/DataList.vue` — `trx_date_and_deadline_time_formatted` default visible.  
- Available TF: `AvailableTransferInternal.vue`.  
- Available SO: `AvailableSalesOrder.vue`.  
- Omni `DeliveryOrder/` masih ada mirror — SCM path = live fulfillment.

---

## 6. Skip Processing

`DeliveryOrderProcessTrait`: attach SO ke DO + approve collecting; approve DO kemudian TF 3PL — selaras urutan manual.

---

## 7. code_globs

Backend: `**/DeliveryOrder*` · `TransferShippingController` · `TransferShippingDoController`  
Frontend: `**/SCM/DeliveryOrder/**`
