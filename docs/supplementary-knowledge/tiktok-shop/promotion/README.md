# TikTok Shop API — Promotion

Snapshot dari [API Reference](https://partner.tiktokshop.com/docv2/) · 10 endpoint + 2 overview/guide.

## Overview / guide

- [Shipping discount supported areas](./shipping-discount-supported-areas.md)
- [Promotion API overview](./promotion-api-overview.md)

## Endpoints

| Method | Path | File |
| --- | --- | --- |
| `POST` | `/promotion/202309/activities` | [Create Promotion Activity](./create-promotion-activity-202309.md) |
| `POST` | `/promotion/202309/activities/{activity_id}/deactivate` | [Deactivate Activity](./deactivate-activity-202309.md) |
| `GET` | `/promotion/202309/activities/{activity_id}` | [Get Activity](./get-activity-202309.md) |
| `GET` | `/promotion/202406/coupons/{coupon_id}` | [Get Coupon ](./get-coupon-202406.md) |
| `DELETE` | `/promotion/202309/activities/{activity_id}/products` | [Remove Promotion Activity Products](./remove-promotion-activity-products-202309.md) |
| `POST` | `/promotion/202607/activities/{activity_id}/republish` | [Republish Activity](./republish-activity-202607.md) |
| `POST` | `/promotion/202406/coupons/search` | [Search Coupon List](./search-coupon-list-202406.md) |
| `POST` | `/promotion/202309/activities/search` | [Search Promotion Activities](./search-promotion-activities-202309.md) |
| `PUT` | `/promotion/202309/activities/{activity_id}` | [Update Promotion Activity](./update-promotion-activity-202309.md) |
| `PUT` | `/promotion/202309/activities/{activity_id}/products` | [Update Promotion Activity Products](./update-promotion-activity-products-202309.md) |
