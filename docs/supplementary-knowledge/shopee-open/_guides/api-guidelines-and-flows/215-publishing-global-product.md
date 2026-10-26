# Publishing global product

> **Source:** [https://open.shopee.com/developer-guide/215](https://open.shopee.com/developer-guide/215)
> **Type:** Developer Guide / Overview
> **document_id:** `215`
> **Section:** API Guidelines and Flows

## Content

*This article applies to cross-border sellers who have upgraded CNSC/KRSC
After creating a global product, you can publish the global product to each market, but the global product can only have one shop product in each market.
 
Below we will explain the API call flow.
Step 1: Getting the list of publishable shopsAPI: v2.global_product.get_publishable_shop (https://open.shopee.com/documents/v2/v2.global_product.get_publishable_shop?module=90&type=1)
You can get the list of publishable shops for global products through this API, but we will not return the corresponding shops for the following cases:
- shops that have not done the shop authorization
- SIP affiliated shops
- Shops of published market
Step 2: Getting the shop channelAPI: v2.logistics.get_channel_list (https://open.shopee.com/documents/v2/v2.logistics.get_channel_list?module=95&type=1)
You need to call v2.logistics.get_channel_list (https://open.shopee.com/documents/v2/v2.logistics.get_channel_list?module=95&type=1) API and select the channel with enable=true and mask_channel_id=0 for shop products. If you publish global products without uploading shop channels, we will choose the enabled and available shop channels for you by default.
Step 3: Publishing global productAPI: v2.global_product.create_publish_task (https://open.shopee.com/documents/v2/v2.global_product.create_publish_task?module=90&type=1)
For the optional fields of v2.global_product.create_publish_task (https://open.shopee.com/documents/v2/v2.global_product.create_publish_task?module=90&type=1) , if you do not upload, Shopee will do some processing and upload to shop products. If you upload, it will be a custom value and Shopee will not do any processing. The specific logic is as follows:
Field NameUpload the custom valueitem_nameYES: Seller need to translate into local language then upload 
NO: Shopee will help translate into the local language
description_info/descriptionYES: Seller need to translate into local language then upload
NO: Shopee will help translate into the local language
original_priceYES: Seller need to upload the price in local currency
NO: Shopee calculates local prices based on the price of global products and calculation formulas.
tier_variation--nameYES: Seller need to translate into local language then upload
NO: Shopee will help translate into the local language
tier_variation--option_list--optionYES: Seller need to translate into local language then upload
NO: Shopee will help translate into the local language
imageYES: Seller uploads the custom images
NO: Shopee will copy the images of global products
 
After a successful API call, you will get a publish_task_id.
API: v2.global_product.get_publish_task_result (https://open.shopee.com/documents/v2/v2.global_product.get_publish_task_result?module=90&type=1)
This API will return whether the publish task was successful or not. If it succeeds, it will return the item_id, shop_id, and region information, if it fails, it will return the specific reason for the failure.
 
Please note: If the published shop is the SIP primary shop, then after the successful publication, Shopee will automatically publish the global product to the affiliated shops under the SIP primary shop.
Step 4: Getting the list of published shop productsAPI: v2.global_product.get_published_list (https://open.shopee.com/documents/v2/v2.global_product.get_published_list?module=90&type=1)
API will return the item_id and shop_id of all the shops that have been successfully published for this global product, including the shop products that Shopee automatically publishes to the affiliated shops.
 
Please note: This API does not return shop products that have been published but have not done the shop authorization.

## Content (raw HTML)

```html
<p><span style="color:#EE4D2D;"><i>*This article applies to cross-border sellers who have upgraded CNSC/KRSC</i></span></p><p>After creating a global product, you can publish the global product to each market, but the global product can only have one shop product in each market.</p><p>&nbsp;</p><p>Below we will explain the API call flow.</p><h1>Step 1: Getting the list of publishable shops</h1><p>API: <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.global_product.get_publishable_shop?module=90&amp;type=1"><u>v2.global_product.get_publishable_shop</u></a></p><p>You can get the list of publishable shops for global products through this API, but we will not return the corresponding shops for the following cases:</p><ul><li>shops that have not done the shop authorization</li><li>SIP affiliated shops</li><li>Shops of published market</li></ul><h1>Step 2: Getting the shop channel</h1><p>API: <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.logistics.get_channel_list?module=95&amp;type=1"><u>v2.logistics.get_channel_list</u></a></p><p>You need to call <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.logistics.get_channel_list?module=95&amp;type=1"><u>v2.logistics.get_channel_list</u></a> API and select the channel with <strong>enable=true and mask_channel_id=0 </strong>for shop products. If you publish global products without uploading shop channels, we will choose the enabled and available shop channels for you by default.</p><h1>Step 3: Publishing global product</h1><p>API: <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.global_product.create_publish_task?module=90&amp;type=1"><u>v2.global_product.create_publish_task</u></a></p><p>For the optional fields of <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.global_product.create_publish_task?module=90&amp;type=1"><u>v2.global_product.create_publish_task</u></a> , if you do not upload, Shopee will do some processing and upload to shop products. If you upload, it will be a custom value and Shopee will not do any processing. The specific logic is as follows:</p><figure class="table"><table><tbody><tr><td>Field Name</td><td>Upload the custom value</td></tr><tr><td><strong>item_name</strong></td><td><p><strong>YES</strong>: Seller need to translate into local language then upload&nbsp;</p><p><strong>NO</strong>: Shopee will help translate into the local language</p></td></tr><tr><td>description_info/description</td><td><p><strong>YES</strong>: Seller need to translate into local language then upload</p><p><strong>NO</strong>: Shopee will help translate into the local language</p></td></tr><tr><td>original_price</td><td><p><strong>YES</strong>: Seller need to upload the price in local currency</p><p><strong>NO</strong>: Shopee calculates local prices based on the price of global products and calculation formulas.</p></td></tr><tr><td>tier_variation--name</td><td><p><strong>YES</strong>: Seller need to translate into local language then upload</p><p><strong>NO</strong>: Shopee will help translate into the local language</p></td></tr><tr><td>tier_variation--option_list--option</td><td><p><strong>YES</strong>: Seller need to translate into local language then upload</p><p><strong>NO</strong>: Shopee will help translate into the local language</p></td></tr><tr><td>image</td><td><p><strong>YES</strong>: Seller uploads the custom images</p><p><strong>NO</strong>: Shopee will copy the images of global products</p></td></tr></tbody></table></figure><p>&nbsp;</p><p>After a successful API call, you will get a publish_task_id.</p><p>API: <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.global_product.get_publish_task_result?module=90&amp;type=1"><u>v2.global_product.get_publish_task_result</u></a></p><p>This API will return whether the publish task was successful or not. If it succeeds, it will return the item_id, shop_id, and region information, if it fails, it will return the specific reason for the failure.</p><p>&nbsp;</p><p>Please note: If the published shop is the SIP primary shop, then after the successful publication, Shopee will automatically publish the global product to the affiliated shops under the SIP primary shop.</p><h1>Step 4: Getting the list of published shop products</h1><p>API: <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.global_product.get_published_list?module=90&amp;type=1"><u>v2.global_product.get_published_list</u></a></p><p>API will return the item_id and shop_id of all the shops that have been successfully published for this global product, including the shop products that Shopee automatically publishes to the affiliated shops.</p><p>&nbsp;</p><p>Please note: This API does not return shop products that have been published but have not done the shop authorization.</p><p>&nbsp;</p>
```
