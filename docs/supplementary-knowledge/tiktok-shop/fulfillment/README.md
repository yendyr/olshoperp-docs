# TikTok Shop API — Fulfillment

Snapshot dari [API Reference](https://partner.tiktokshop.com/docv2/) · 29 endpoint + 2 overview/guide.

## Overview / guide

- [UK & EU: Purchase shipping labels from TikTok](./i83mvdfg.md)
- [Fulfillment API overview](./fulfillment-api-overview.md)

## Endpoints

| Method | Path | File |
| --- | --- | --- |
| `POST` | `/fulfillment/202309/packages/ship` | [Batch Ship Packages](./batch-ship-packages-202309.md) |
| `GET` | `/fulfillment/202508/tts_tracking_validation` | [Check TikTok Shipping and Collection by TikTok Coverage](./check-tiktok-shipping-and-collection-by-tiktok-coverage-202508.md) |
| `POST` | `/fulfillment/202309/packages/combine` | [Combine Package](./combine-package-202309.md) |
| `POST` | `/fulfillment/202309/orders/{order_id}/split` | [Confirm Order Split](./confirm-order-split-202309.md) |
| `POST` | `/fulfillment/202407/bundles` | [Create First Mile Bundle](./create-first-mile-bundle-202407.md) |
| `POST` | `/fulfillment/202510/first_mile_bundle` | [Create First Mile Bundle(V2)](./create-first-mile-bundle-v2-202510.md) |
| `POST` | `/fulfillment/202512/packages` | [Create Packages](./create-packages-202512.md) |
| `POST` | `/fulfillment/202309/orders/{order_id}/shipping_services/query` | [Get Eligible Shipping Services](./get-eligible-shipping-services-202309.md) |
| `POST` | `/fulfillment/202607/orders/customs_info/query` | [Get Order Customs Requirements](./get-order-customs-requirements-202607.md) |
| `GET` | `/fulfillment/202309/orders/split_attributes` | [Get Order Split Attributes](./get-order-split-attributes-202309.md) |
| `GET` | `/fulfillment/202309/orders/{order_id}/tracking` | [Get Order Tracking](./get-order-tracking-202309.md) |
| `POST` | `/fulfillment/202606/pod_details/get` | [Get POD Customization Details](./get-pod-customization-details-202606.md) |
| `GET` | `/fulfillment/202309/packages/{package_id}` | [Get Package Detail](./get-package-detail-202309.md) |
| `GET` | `/fulfillment/202309/packages/{package_id}/handover_time_slots` | [Get Package Handover Time Slots](./get-package-handover-time-slots-202309.md) |
| `GET` | `/fulfillment/202309/packages/{package_id}/shipping_documents` | [Get Package Shipping Document](./get-package-shipping-document-202309.md) |
| `POST` | `/fulfillment/202610/orders/{order_id}/packages` | [Mark Package As Shipped](./mark-package-as-shipped-202610.md) |
| `GET` | `/fulfillment/202309/combinable_packages/search` | [Search Combinable Packages](./search-combinable-packages-202309.md) |
| `POST` | `/fulfillment/202309/packages/search` | [Search Package](./search-package-202309.md) |
| `POST` | `/fulfillment/202309/packages/{package_id}/ship` | [Ship Package](./ship-package-202309.md) |
| `POST` | `/fulfillment/202607/orders/customs_info/submit` | [Submit Customs Clearance Information](./submit-customs-clearance-information-202607.md) |
| `POST` | `/fulfillment/202601/redeem_info/callback` | [Submit Redemption Information](./submit-redemption-information-202601.md) |
| `POST` | `/fulfillment/202609/order/sof/track/update` | [Tracking status update](./tracking-status-update-202609.md) |
| `POST` | `/fulfillment/202309/packages/{package_id}/uncombine` | [Uncombine Packages](./uncombine-packages-202309.md) |
| `POST` | `/fulfillment/202309/orders/{order_id}/shipping_info/update` | [Update Order Shipping Info](./update-order-shipping-info-202309.md) |
| `POST` | `/fulfillment/202309/packages/deliver` | [Update Package Delivery Status](./update-package-delivery-status-202309.md) |
| `POST` | `/fulfillment/202610/packages/{package_id}/shipping_info/update` | [Update Package Shipping Info](./update-package-shipping-info-202610.md) |
| `POST` | `/fulfillment/202502/invoice/upload` | [Upload Invoice](./upload-invoice-202502.md) |
| `POST` | `/fulfillment/202309/files/upload` | [Upload Proof of Delivery File](./upload-proof-of-delivery-file-202309.md) |
| `POST` | `/fulfillment/202309/images/upload` | [Upload Proof of Delivery Image](./upload-proof-of-delivery-image-202309.md) |
