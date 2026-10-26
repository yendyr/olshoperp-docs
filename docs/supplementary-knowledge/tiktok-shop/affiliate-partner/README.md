# TikTok Shop API — Affiliate partner

Snapshot dari [API Reference](https://partner.tiktokshop.com/docv2/) · 15 endpoint + 1 overview/guide.

## Overview / guide

- [Affiliate Partner API overview](./affiliate-partner-api-overview.md)

## Endpoints

| Method | Path | File |
| --- | --- | --- |
| `POST` | `/affiliate_partner/202405/campaigns` | [Create Affiliate Partner Campaign](./create-affiliate-partner-campaign-202405.md) |
| `POST` | `/affiliate_partner/202405/campaigns/{campaign_id}/partial_edit` | [Edit Affiliate Partner Campaign](./edit-affiliate-partner-campaign-202405.md) |
| `POST` | `/affiliate_partner/202405/campaigns/{campaign_id}/products/{product_id}/promotion_link/generate` | [Generate Affiliate Partner Campaign Product Link](./generate-affiliate-partner-campaign-product-link-202405.md) |
| `POST` | `/affiliate_partner/202505/campaigns/{campaign_id}/products/promotion_links/generate_batch` | [Generate Campaign Product Promotion Links in Batch](./generate-campaign-product-promotion-links-in-batch-202505.md) |
| `GET` | `/affiliate_partner/202508/campaigns/{campaign_id}/products/{product_id}/creator/{creator_temp_id}/content/statistics` | [Get Affiliate Campaign Creator Product Content Statistics](./get-affiliate-campaign-creator-product-content-statistics-202508.md) |
| `GET` | `/affiliate_partner/202508/campaigns/{campaign_id}/products/{product_id}/creator/{creator_temp_id}/content/statistics/sample/status` | [Get Affiliate Campaign Creator Product Sample Status](./get-affiliate-campaign-creator-product-sample-status-202508.md) |
| `GET` | `/affiliate_partner/202405/campaigns/{campaign_id}` | [Get Affiliate Partner Campaign Detail](./get-affiliate-partner-campaign-detail-202405.md) |
| `GET` | `/affiliate_partner/202405/campaigns` | [Get Affiliate Partner Campaign List](./get-affiliate-partner-campaign-list-202405.md) |
| `GET` | `/affiliate_partner/202405/campaigns/{campaign_id}/products` | [Get Affiliate Partner Campaign Product List](./get-affiliate-partner-campaign-product-list-202405.md) |
| `GET` | `/affiliate_partner/202501/campaigns/{campaign_id}/products/performance` | [Get Campaign Product Performance List](./get-campaign-product-performance-list-202501.md) |
| `GET` | `/affiliate_partner/202508/campaigns/{campaign_id}/products/{product_id}/performance` | [Get Creator Performance for Campaign Product](./get-creator-performance-for-campaign-product-202508.md) |
| `POST` | `/affiliate_partner/202405/campaigns/{campaign_id}/publish` | [Publish Affiliate Partner Campaign](./publish-affiliate-partner-campaign-202405.md) |
| `POST` | `/affiliate_partner/202405/campaigns/{campaign_id}/products/{product_id}/review` | [Review Affiliate Partner Campaign Product](./review-affiliate-partner-campaign-product-202405.md) |
| `POST` | `/affiliate_partner/202603/cap_order/search` | [Search CAP Affiliate Orders](./search-cap-affiliate-orders-202603.md) |
| `POST` | `/affiliate_partner/202603/orders/search` | [Search TAP Affiliate Orders](./search-tap-affiliate-orders-202603.md) |
