# Stock & Price Management

> **Source:** [https://open.shopee.com/developer-guide/223](https://open.shopee.com/developer-guide/223)
> **Type:** Developer Guide / Overview
> **document_id:** `223`
> **Section:** API Guidelines and Flows

## Content

1. Getting product price- If a product has no variants, please use v2.product.get_item_base_info (https://open.shopee.com/documents/v2/v2.product.get_item_base_info?module=89&type=1) API to get price information.
- If a product has variants, please use v2.product.get_model_list (https://open.shopee.com/documents/v2/v2.product.get_model_list?module=89&type=1) API to get price information.
 
 
API response:
 
"price_info": [
                    {
                        "current_price": 7678,
                        "original_price": 13960,
                        "inflated_price_of_current_price": 9137,
                        "inflated_price_of_original_price": 16612,
                        "currency": "COP"
                    }
 
 
Please note that:
1. If your product has ongoing promotion, current_price will show the promotion price during the promotion period. If not, current_price=original_price. original_price indicates the original price of the product.
 
2.If your product has multiple promotions, you can get each promotion price through v2.product.get_item_promotion (https://open.shopee.com/documents/v2/v2.product.get_item_promotion?module=89&type=1) API.
 
3. If you are an ID / CO / PL seller, inflated_price_of_current_price/inflated_price_of_original_price means the price with tax; if you are a seller from other regions, inflated_price_of_current_price=current_price, inflated_price_of_original_price=original_price.
 
2. Updating product priceAPI: v2.product.update_price (https://open.shopee.com/documents/v2/v2.product.update_price?module=89&type=1)
- If a product has variants, you can upload multiple variants of this product to update the price in one call.
- This API only supports updating one item_id in one call. if you need to update more than one item_id, you can request them multiple times.
- Please check that the range of price can be updated by price_limit in the v2.product.get_item_limit (https://open.shopee.com/documents/v2/v2.product.get_item_limit?module=89&type=1) API.
 
 
2.1 Example of updating the price of a product without variants.
{
"item_id": 1000,
"price_list": [{"original_price": 11.11}]
}
 
2.2 Example of updating the price of a product with variants.
{
"item_id": 2000,
"price_list": [{"model_id": 3456, "original_price": 11.11}, {"model_id": 1234, "original_price": 22.22}]
}
 
Note that if you are an ID / CO / PL seller, the original_price is updated to be the untaxed price.
 
3. Updating global product price*The following is only applicable to cross-border sellers who have upgraded CNSC/KRSC.
 
API: v2.global_product.update_price (https://open.shopee.com/documents/v2/v2.global_product.update_price?module=90&type=1)
- If a global product has variants, you can update the price of multiple variants of this global product in one call.
- This API only supports updating one global_item_id in one call, if you need to update more than one global_item_id, you can request it multiple times.
- For the price of the global product, please check the price currency first through the v2.merchant.get_merchant_info (https://open.shopee.com/documents/v2/v2.merchant.get_merchant_info?module=93&type=1) API.
- If you want the price of global products automatically synchronized to shop products, please set the price synchronization toggle open through the v2.global_product.set_sync_field (https://open.shopee.com/documents/v2/v2.global_product.set_sync_field?module=90&type=1) API . Shopee will automatically update based on the formula. If not, you can update the price through v2.product.update_price (https://open.shopee.com/documents/v2/v2.product.update_price?module=89&type=1) API.
 
4. Getting product stock 
- If a product has no variants, please use v2.product.get_item_base_info (https://open.shopee.com/documents/v2/v2.product.get_item_base_info?module=89&type=1) API to get the stock information.
- If a product has variants, please use v2.product.get_model_list (https://open.shopee.com/documents/v2/v2.product.get_model_list?module=89&type=1) API to get the stock information.
 
API response:
{      

                "stock_info_v2": {

                    "summary_info": {

                        "total_reserved_stock": 0,

                        "total_available_stock": 389

                    },

                    "seller_stock": [

                        {

                            "location_id": "IDZ",

                            "stock": 90

                        }

                    ],

                    "shopee_stock": [

                        {

                            "location_id": "IDG",

                            "stock": 99

                        },

                        {

                            "location_id": "IDM",

                            "stock": 200

                        }

                    ]

                }

            } 
Please note:
- Product may have both seller_stock and shopee_stock, or it may have stock from multiple locations.
- For more stock calculation logic, please refer to the FAQ (https://open.shopee.com/faq?top=162&sub=166&page=1&faq=230)
 
5. Updating product stockAPI: v2.product.update_stock (https://open.shopee.com/documents/v2/v2.product.update_stock?module=89&type=1)
- If a product has variants, you can upload multiple variants of this product to update the stock in one call.
- This API only supports updating one item_id in one call, if you need to update more than one item_id, you can request it multiple times.
- Sellers can only update seller_stock, cannot update shopee_stock.
- Please check the stock_limit in the v2.product.get_item_limit (https://open.shopee.com/documents/v2/v2.product.get_item_limit?module=89&type=1) API for the range of stock that can be updated.
 
5.1 Example of updating the stock of a product with no variants.
{
"item_id": 1000,
"stock_list": [{"seller_stock": [{"stock": 100}]}]
}
 
5.2 Example of updating the stock of a product with variants.
{
"item_id": 2000,
"stock_list": [{"model_id": 3456, "seller_stock": [{"stock": 100}]}, {"model_id": 1234, "seller_stock": [{"stock": 100}]}]
}
 
Please note：
- If a product has variants, the price difference between the variations cannot exceed a certain multiple. For example, BR product, the price of the most expensive variations divided by the price of the cheapest variations cannot exceed 4.
RegionmultipleBR4SG/VN/TW/TH/PH/MX5ID/MY7CL/CO9CNSC7- The product participates in certain promotion, sellers are not allow to modify the original price of the product. More detail please check FAQ: https://open.shopee.com/faq/140 (https://open.shopee.com/faq/140)

 
6. Updating global product stock*The following is only applicable to cross-border sellers who have upgraded CNSC/KRSC.
 
API: v2.global_product.update_stock (https://open.shopee.com/documents/v2/v2.global_product.update_stock?module=90&type=1)
- If a global product has variants, you can update the stock of multiple variants of the global product in one call.
- Since cross-border sellers who have upgraded CNSC/KRSC can only manage shop product stock through global product, it means you can only call the v2.global_product.update_stock (https://open.shopee.com/documents/v2/v2.global_product.update_stock?module=90&type=1) API to update stock. After updating global product stock, it will be automatically synchronized to shop products. Using the v2.product.update_stock (https://open.shopee.com/documents/v2/v2.product.update_stock?module=89&type=1) API to update the stock will result in an error.
- This API only supports updating one global_item_id at a time, if you need to update more than one global_item_id, you can request it multiple times.
- Please check the stock_limit in the v2.global_product.get_global_item_limit (https://open.shopee.com/documents/v2/v2.global_product.get_global_item_limit?module=90&type=1) API for the range of stock that can be updated.

## Content (raw HTML)

```html
<h1>1. Getting product price</h1><ul><li>If a product has no variants, please use <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.get_item_base_info?module=89&amp;type=1"><u>v2.product.get_item_base_info</u></a> API to get price information.</li><li>If a product has variants, please use <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.get_model_list?module=89&amp;type=1"><u>v2.product.get_model_list</u></a> API to get price information.</li></ul><p>&nbsp;</p><p>&nbsp;</p><p>API response:</p><p>&nbsp;</p><p>"price_info": [</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"current_price": 7678,</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"original_price": 13960,</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"inflated_price_of_current_price": 9137,</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"inflated_price_of_original_price": 16612,</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"currency": "COP"</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}</p><p>&nbsp;</p><p>&nbsp;</p><p><strong>Please note that:</strong></p><p>1. If your product has ongoing promotion, <strong>current_price</strong> will show the promotion price during the promotion period. If not, current_price=original_price. <strong>original_price</strong> indicates the original price of the product.</p><p>&nbsp;</p><p>2.If your product has multiple promotions, you can get each promotion price through <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.get_item_promotion?module=89&amp;type=1"><u>v2.product.get_item_promotion</u></a> API.</p><p>&nbsp;</p><p>3. If you are an ID / CO / PL seller, <strong>inflated_price_of_current_price</strong>/<strong>inflated_price_of_original_price</strong> means the price with tax; if you are a seller from other regions, inflated_price_of_current_price=current_price, inflated_price_of_original_price=original_price.</p><p>&nbsp;</p><h1>2. Updating product price</h1><p><strong>API: </strong><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.update_price?module=89&amp;type=1"><strong><u>v2.product.update_price</u></strong></a></p><ul><li>If a product has variants, you can upload multiple variants of this product to update the price in one call.</li><li>This API only supports updating one item_id in one call. if you need to update more than one item_id, you can request them multiple times.</li><li>Please check that the range of price can be updated by price_limit in the <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.get_item_limit?module=89&amp;type=1"><u>v2.product.get_item_limit</u></a> API.</li></ul><p>&nbsp;</p><p>&nbsp;</p><p>2.1 <i>Example of updating the price of a product without variants.</i></p><p><i>{</i></p><p><i>"item_id": 1000,</i></p><p><i>"price_list": [{"original_price": 11.11}]</i></p><p><i>}</i></p><p>&nbsp;</p><p>2.2 <i>Example of updating the price of a product with variants.</i></p><p><i>{</i></p><p><i>"item_id": 2000,</i></p><p><i>"price_list": [{"model_id": 3456, "original_price": 11.11}, {"model_id": 1234, "original_price": 22.22}]</i></p><p><i>}</i></p><p>&nbsp;</p><p>Note that if you are an ID / CO / PL seller, the original_price is updated to be the untaxed price.</p><p>&nbsp;</p><h1>3. Updating global product price</h1><p><i>*The following is only applicable to cross-border sellers who have upgraded CNSC/KRSC.</i></p><p>&nbsp;</p><p>API: <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.global_product.update_price?module=90&amp;type=1"><u>v2.global_product.update_price</u></a></p><ul><li>If a global product has variants, you can update the price of multiple variants of this global product in one call.</li><li>This API only supports updating one global_item_id in one call, if you need to update more than one global_item_id, you can request it multiple times.</li><li>For the price of the global product, please check the price currency first through the <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.merchant.get_merchant_info?module=93&amp;type=1"><u>v2.merchant.get_merchant_info</u></a> API.</li><li>If you want the price of global products automatically synchronized to shop products, please set the price synchronization toggle open through the <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.global_product.set_sync_field?module=90&amp;type=1"><u>v2.global_product.set_sync_field</u></a> API . Shopee will automatically update based on the formula. If not, you can update the price through <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.update_price?module=89&amp;type=1"><u>v2.product.update_price</u></a> API.</li></ul><p>&nbsp;</p><h1>4. Getting product stock</h1><p>&nbsp;</p><ul><li>If a product has no variants, please use <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.get_item_base_info?module=89&amp;type=1"><u>v2.product.get_item_base_info</u></a> API to get the stock information.</li><li>If a product has variants, please use <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.get_model_list?module=89&amp;type=1"><u>v2.product.get_model_list</u></a> API to get the stock information.</li></ul><p>&nbsp;</p><p>API response:</p><pre><code class="json hljs">{&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"stock_info_v2": {

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"summary_info": {

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"total_reserved_stock": 0,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"total_available_stock": 389

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"seller_stock": [

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"location_id": "IDZ",

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"stock": 90

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;],

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"shopee_stock": [

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"location_id": "IDG",

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"stock": 99

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"location_id": "IDM",

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"stock": 200

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}</code></pre><p>&nbsp;</p><p>Please note:</p><ul><li>Product may have both <strong>seller_stock</strong> and <strong>shopee_stock</strong>, or it may have stock from multiple locations.</li><li>For more stock calculation logic, please refer to the <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/faq?top=162&amp;sub=166&amp;page=1&amp;faq=230"><u>FAQ</u></a></li></ul><p>&nbsp;</p><h1>5. Updating product stock</h1><p>API: <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.update_stock?module=89&amp;type=1"><u>v2.product.update_stock</u></a></p><ul><li>If a product has variants, you can upload multiple variants of this product to update the stock in one call.</li><li>This API only supports updating one item_id in one call, if you need to update more than one item_id, you can request it multiple times.</li><li>Sellers can only update <strong>seller_stock</strong>, cannot update <strong>shopee_stock</strong>.</li><li>Please check the stock_limit in the <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.get_item_limit?module=89&amp;type=1"><u>v2.product.get_item_limit</u></a> API for the range of stock that can be updated.</li></ul><p>&nbsp;</p><p>5.1 <i>Example of updating the stock of a product with no variants.</i></p><p><i>{</i></p><p><i>"item_id": 1000,</i></p><p><i>"stock_list": [{"seller_stock": [{"stock": 100}]}]</i></p><p><i>}</i></p><p>&nbsp;</p><p>5.2<i> Example of updating the stock of a product with variants.</i></p><p><i>{</i></p><p><i>"item_id": 2000,</i></p><p><i>"stock_list": [{"model_id": 3456, "seller_stock": [{"stock": 100}]}, {"model_id": 1234, "seller_stock": [{"stock": 100}]}]</i></p><p><i>}</i></p><p>&nbsp;</p><p>Please note：</p><ul><li>If a product has variants, the price difference between the variations cannot exceed a certain multiple. For example, BR product, the price of the most expensive variations divided by the price of the cheapest variations cannot exceed 4.</li></ul><figure class="table"><table><tbody><tr><td>Region</td><td>multiple</td></tr><tr><td>BR</td><td>4</td></tr><tr><td>SG/VN/TW/TH/PH/MX</td><td>5</td></tr><tr><td>ID/MY</td><td>7</td></tr><tr><td>CL/CO</td><td>9</td></tr><tr><td>CNSC</td><td>7</td></tr></tbody></table></figure><ul><li>The product participates in certain promotion, sellers are not allow to modify the original price of the product. More detail please check FAQ: <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/faq/140">https://open.shopee.com/faq/140</a></li></ul><p><br>&nbsp;</p><h1>6. Updating global product stock</h1><p><i>*The following is only applicable to cross-border sellers who have upgraded CNSC/KRSC.</i></p><p>&nbsp;</p><p>API: <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.global_product.update_stock?module=90&amp;type=1"><u>v2.global_product.update_stock</u></a></p><ul><li>If a global product has variants, you can update the stock of multiple variants of the global product in one call.</li><li>Since cross-border sellers who have upgraded CNSC/KRSC can only manage shop product stock through global product, it means you can only call the <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.global_product.update_stock?module=90&amp;type=1"><u>v2.global_product.update_stock</u></a> API to update stock. After updating global product stock, it will be automatically synchronized to shop products. Using the <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.update_stock?module=89&amp;type=1"><u>v2.product.update_stock</u></a> API to update the stock will result in an error.</li><li>This API only supports updating one global_item_id at a time, if you need to update more than one global_item_id, you can request it multiple times.</li><li>Please check the stock_limit in the <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.global_product.get_global_item_limit?module=90&amp;type=1"><u>v2.global_product.get_global_item_limit</u></a> API for the range of stock that can be updated.</li></ul>
```
