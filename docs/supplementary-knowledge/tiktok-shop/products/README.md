# TikTok Shop API — Products

Snapshot dari [API Reference](https://partner.tiktokshop.com/docv2/) · 70 endpoint + 4 overview/guide.

## Overview / guide

- [Common mistakes](./common-mistakes.md)
- [Listing quality diagnosis](./listing-quality-diagnosis.md)
- [Product pricing](./product-pricing.md)
- [Products API overview](./products-api-overview.md)

## Endpoints

| Method | Path | File |
| --- | --- | --- |
| `POST` | `/product/202309/products/activate` | [Activate Products](./activate-products-202309.md) |
| `GET` | `/product/202312/prerequisites` | [Check Listing Prerequisites](./check-listing-prerequisites-202312.md) |
| `POST` | `/product/202309/products/listing_check` | [Check Product Listing](./check-product-listing-202309.md) |
| `POST` | `/product/202407/products/category_upgrade_task` | [Create Category Upgrade Task](./create-category-upgrade-task-202407.md) |
| `POST` | `/product/202309/brands` | [Create Custom Brands](./create-custom-brands-202309.md) |
| `POST` | `/product/202604/products/gpa_upgrade_task` | [Create GPA Upgrade Task](./create-gpa-upgrade-task-202604.md) |
| `POST` | `/product/202309/global_products` | [Create Global Product](./create-global-product-202309.md) |
| `POST` | `/product/202505/images/translation_tasks` | [Create Image Translation Tasks](./create-image-translation-tasks-202505.md) |
| `POST` | `/product/202409/compliance/manufacturers` | [Create Manufacturer](./create-manufacturer-202409.md) |
| `POST` | `/product/202309/products` | [Create Product](./create-product-202309.md) |
| `POST` | `/product/202409/compliance/responsible_persons` | [Create Responsible Person](./create-responsible-person-202409.md) |
| `POST` | `/product/202610/size_charts` | [Create Size Chart V2](./create-size-chart-v2-202610.md) |
| `POST` | `/product/202309/products/deactivate` | [Deactivate Products](./deactivate-products-202309.md) |
| `DELETE` | `/product/202309/global_products` | [Delete Global Products](./delete-global-products-202309.md) |
| `DELETE` | `/product/202309/products` | [Delete Products](./delete-products-202309.md) |
| `POST` | `/product/202411/products/diagnose_optimize` | [Diagnose and Optimize Product](./diagnose-and-optimize-product-202411.md) |
| `PUT` | `/product/202309/global_products/{global_product_id}` | [Edit Global Product](./edit-global-product-202309.md) |
| `PUT` | `/product/202509/products/{product_id}` | [Edit Product](./edit-product-202509.md) |
| `POST` | `/product/202610/size_charts/edit` | [Edit Size Chart V2](./edit-size-chart-v2-202610.md) |
| `GET` | `/product/202309/brands` | [Get Brands](./get-brands-202309.md) |
| `GET` | `/product/202309/categories` | [Get Categories](./get-categories-202309.md) |
| `GET` | `/product/202309/categories/{category_id}/attributes` | [Get Category Attributes](./get-category-attributes-202309.md) |
| `GET` | `/product/202309/categories/{category_id}/rules` | [Get Category Rules](./get-category-rules-202309.md) |
| `GET` | `/product/202309/categories/{category_id}/global_attributes` | [Get Global Attributes](./get-global-attributes-202309.md) |
| `GET` | `/product/202309/global_categories` | [Get Global Categories](./get-global-categories-202309.md) |
| `GET` | `/product/202309/categories/{category_id}/global_rules` | [Get Global Category Rules](./get-global-category-rules-202309.md) |
| `GET` | `/product/202507/global_listing_rules` | [Get Global Listing Rules](./get-global-listing-rules-202507.md) |
| `GET` | `/product/202309/global_products/{global_product_id}` | [Get Global Product](./get-global-product-202309.md) |
| `GET` | `/product/202507/products/{product_id}/replicated_products` | [Get Global Replicated Products ](./get-global-replicated-products-202507.md) |
| `GET` | `/product/202506/images/translation_tasks` | [Get Image Translation Tasks](./get-image-translation-tasks-202506.md) |
| `GET` | `/product/202604/opportunities/{opportunity_id}` | [Get Opportunity Detail](./get-opportunity-detail-202604.md) |
| `GET` | `/product/202309/products/{product_id}` | [Get Product](./get-product-202309.md) |
| `GET` | `/product/202405/products/diagnoses` | [Get Product Diagnoses](./get-product-diagnoses-202405.md) |
| `POST` | `/product/202602/packages/recommend` | [Get Product Package Recommendations](./get-product-package-recommendations-202602.md) |
| `GET` | `/product/202606/skpps/{product_id}` | [Get Product SKPP Detail](./get-product-skpp-detail-202606.md) |
| `GET` | `/product/202405/products/seo_words` | [Get Products SEO Words](./get-products-seo-words-202405.md) |
| `GET` | `/product/202405/products/suggestions` | [Get Recommended Product Title And Description](./get-recommended-product-title-and-description-202405.md) |
| `GET` | `/product/202606/skpps/sum` | [Get Shop SKPP Summary](./get-shop-skpp-summary-202606.md) |
| `GET` | `/product/202604/opportunities/submissions` | [Get Submission Records](./get-submission-records-202604.md) |
| `POST` | `/product/202309/inventory/search` | [Inventory Search](./inventory-search-202309.md) |
| `POST` | `/product/202604/opportunities/query` | [List Opportunities](./list-opportunities-202604.md) |
| `POST` | `/product/202606/skpps/search` | [List Product SKPP Statuses](./list-product-skpp-statuses-202606.md) |
| `POST` | `/product/202404/images/optimize` | [Optimize Images](./optimize-images-202404.md) |
| `PUT` | `/product/202509/global_products/{global_product_id}/partial_edit` | [Partial Edit Global Product](./partial-edit-global-product-202509.md) |
| `POST` | `/product/202409/compliance/manufacturers/{manufacturer_id}/partial_edit` | [Partial Edit Manufacturer](./partial-edit-manufacturer-202409.md) |
| `POST` | `/product/202509/products/{product_id}/partial_edit` | [Partial Edit Product](./partial-edit-product-202509.md) |
| `POST` | `/product/202409/compliance/responsible_persons/{responsible_person_id}/partial_edit` | [Partial Edit Responsible Person](./partial-edit-responsible-person-202409.md) |
| `POST` | `/product/202609/products/package/predict` | [Predict Product Package Dimensions and Weight](./predict-product-package-dimensions-and-weight-202609.md) |
| `POST` | `/product/202309/global_products/{global_product_id}/publish` | [Publish Global Product](./publish-global-product-202309.md) |
| `POST` | `/product/202309/categories/recommend` | [Recommend Category](./recommend-category-202309.md) |
| `POST` | `/product/202309/global_categories/recommend` | [Recommend Global Categories](./recommend-global-categories-202309.md) |
| `POST` | `/product/202609/products/properties/recommend` | [Recommend Required Product Properties](./recommend-required-product-properties-202609.md) |
| `POST` | `/product/202309/products/recover` | [Recover Products](./recover-products-202309.md) |
| `POST` | `/product/202507/products/{product_id}/global_replicate` | [Replicate Product](./replicate-product-202507.md) |
| `POST` | `/product/202312/global_products/search` | [Search Global Products](./search-global-products-202312.md) |
| `POST` | `/product/202501/compliance/manufacturers/search` | [Search Manufacturers](./search-manufacturers-202501.md) |
| `POST` | `/product/202502/products/search` | [Search Products](./search-products-202502.md) |
| `POST` | `/product/202601/compliance/auditing/research` | [Search Products for Compliance Auditing](./search-products-for-compliance-auditing-202601.md) |
| `POST` | `/product/202501/compliance/responsible_persons/search` | [Search Responsible Persons](./search-responsible-persons-202501.md) |
| `POST` | `/product/202407/sizecharts/search` | [Search Size Charts](./search-size-charts-202407.md) |
| `POST` | `/product/202604/opportunities/{opportunity_id}/submit` | [Submit Product via Opportunity](./submit-product-via-opportunity-202604.md) |
| `POST` | `/product/202604/appeals/submit` | [Submit Size Chart Appeal](./submit-size-chart-appeal-202604.md) |
| `POST` | `/product/202609/products/{product_id}/strikethrough_price/submit` | [Submit Strikethrough Price](./submit-strikethrough-price-202609.md) |
| `POST` | `/product/202609/brands/suggest` | [Suggest Brands](./suggest-brands-202609.md) |
| `POST` | `/product/202309/global_products/{global_product_id}/inventory/update` | [Update Global Inventory](./update-global-inventory-202309.md) |
| `POST` | `/product/202309/products/{product_id}/inventory/update` | [Update Inventory](./update-inventory-202309.md) |
| `POST` | `/product/202309/products/{product_id}/prices/update` | [Update Price](./update-price-202309.md) |
| `POST` | `/product/202608/inventory/operation/settings` | [Update Stock Operation Settings](./update-stock-operation-settings-202608.md) |
| `POST` | `/product/202309/files/upload` | [Upload Product File](./upload-product-file-202309.md) |
| `POST` | `/product/202309/images/upload` | [Upload Product Image](./upload-product-image-202309.md) |
