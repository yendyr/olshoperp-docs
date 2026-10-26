# Creating global product

> **Source:** [https://open.shopee.com/developer-guide/213](https://open.shopee.com/developer-guide/213)
> **Type:** Developer Guide / Overview
> **document_id:** `213`
> **Section:** API Guidelines and Flows

## Content

*This article applies to cross-border sellers who have upgraded CNSC/KRSC
What is the global product?Global product is proposed for cross-border sellers, through which you can manage the product of multiple market shops in one stop. Its advantages are reflected in the following aspects.
- Language auto-translation: sellers can fill in the product name and description of a global product in Chinese or English, and set up to synchronize the update to the shop products, Shopee will automatically translate into the local language.
- Stock unified management: sellers can unify the management of multi-shop products stock through global products.
- Product information synchronization update: for some non-market differentiated product information, sellers can modify the global product, then Shopee will synchronize the update to the shop product information.
- Multi-shop product one-click pricing: Shopee provides pricing formula and formula factor configuration, sellers can update the price of global products and set the synchronous update to shop products, Shopee will update shop products’ price according to the results of the formula calculation.
 
Currently, cross-border sellers who have upgraded CNSC or KRSC need to additionally integrate to Merchant API and Global Product API, because you need to manage product information with global products. For other APIs such as order related api, no changes are needed.
- Click here (https://shopee.cn/edu/article/7258) to learn more about CNSC.
- Click here (https://shopee.kr/edu/article/10732) to learn more about KRSC.
CNSC/KRSC account systemBelow we will explain the concepts related to the upgraded CNSC or KRSC account system. (Only applicable to cross-border sellers)
 
 
Terminology Description:
- Main account : The seller account with highest authority, the account owner is usually a corporate entity, and this account can manage all shops and all sub-accounts of the seller. The login format of the main account is XXX: main, for example, maidehao:main.
- Merchant: The company under the main account, multiple companies can be added to a main account after it is activated.
- Shop: The shops under the main account. Shops in multiple markets can exist under one Merchant. The main account can authorize the shops to be managed by different sub-accounts.
 
 
1) When you upgrade the shops to CNSC/KRSC accounts, You will get the main account for authorization, and only the main account can do the shop authorization. Please refer to the article (https://open.shopee.com/developer-guide/20) on how to authorize using the main account.
2) Under one main account, there can be multiple Merchants, and under each Merchant, there can be multiple market shops, including SIP's shop. Moreover, there may be multiple shops of the same market under Merchant.
Global products and shop productsIn the following, we will explain the relationship with global products and shop products.
AbbreviationsCNSC/KRSC nameDescriptionMTSKUGlobal SKUSellers will manage some basic product information by MTSKU, including product categories, attributes, weights, etc. After publishing to diffremarkets, sellers only need to modify the global products, and Shopee will synchronize the changes to shop products.MPSKUShop SKUReal goods visible to buyers.Changes in product management processAfter the adoption of global product management, please note the following changes to the product management process:
1. Product creation Now you must create global products through v2.global_product.add_global_item (https://open.shopee.com/documents/v2/v2.global_product.add_global_item?module=90&type=1) API, and then call v2.global_product.create_publish_task (https://open.shopee.com/documents/v2/v2.global_product.create_publish_task?module=90&type=1) API to publish global products to each market then shop products will be generated. For more detail about the publishing process can click here (https://open.shopee.com/developer-guide/215).
2. Field management restrictionsWe divide the product-related fields into three categories.
1. Fields can only be managed by MTSKU: These fields have no market differences, such as categories, attributes, etc.. When the seller updates these field values of MTSKU, Shopee will update the value to MPSKU as well.
2. MTSKU and MPSKU jointly managed fields: These fields have market differentiation, such as product names and product descriptions. If sellers choose to update the field values through the MTSKU, then Shopee will translate or update the value to the MPSKU. If sellers choose to update the values of MPSKU alone, but do not modify the MTSKU, the update will only be effective for that MPSKU.
3. Fields can only be managed by MPSKU: These fields are not managed through the global product, like logistics info.
API FieldManage by MTSKUManage by MPSKUcategory_id✓
×
attribute✓
×
brand✓
×
item_name✓
✓
description✓
✓
weight✓
×
dimension✓
×
price✓
✓
stock✓
×
image/video✓
✓
days_to_ship✓
✓
item_status✓
✓
condition✓
×
item sku✓
×
tier_variation structure✓
×
tier_variation-name/option✓
✓
logistics×
✓
 
Please note that:
- Stock Logic: Assuming the stock of MTSKU is 10 and MTSKU has published MPSKU1 and MPSKU2, then the stock of MPSKU1 = MPSKU2 = 10. When the buyer purchased one MPSKU1, that is, the stock of MPSKU1=9 , then the stock of MTSKU= MPSKU2=9.
- Item Status Logic: If a global item is deleted, all shop products for which the global item has been published will also be deleted. However, shop products can be deleted and unlist individually without affecting global products.
3. Product basic data differencesIf you first connect to Shopee product management, it is recommended to read through the article "Product creation preparation (https://open.shopee.com/developer-guide/209)" first, because the fields of global products and shop products are basically the same. Here we will explain the difference.
3.1 Getting categoriesAPI: v2.global_product.get_category (https://open.shopee.com/documents/v2/v2.global_product.get_category?module=90&type=1)
 
Please note that:
- For different merchants, this API returns the same category tree data.
- V2.global_product.get_category (https://open.shopee.com/documents/v2/v2.global_product.get_category?module=90&type=1) API will return the available category for global product. But there may be a situation that category A is not available in Malaysia shop, but available in Brazil shop, we will prompt you not to publish the global product to Malaysia in the process of publishing global products, if you want to get the exactly available category for each market, you can call v2.product.get_category (https://open.shopee.com/documents/v2/v2.product.get_category?module=89&type=1) API.
3.2 Getting recommended categoriesAPI: v2.global_product.category_recommend (https://open.shopee.com/documents/v2/v2.global_product.category_recommend?module=90&type=1)
3.3 Getting attributesAPI：v2.global_product.get_attribute_tree (https://open.shopee.com/documents/v2/v2.global_product.get_attribute_tree?module=90&type=1)
 
Please note that:
- The function of need_region_mandatory request parameter and mandatory_region response  parameter: because for some attributes, such as NCC attribute, only products in the Taiwan market are compulsory, if the seller doesn't want to publish to Taiwan shops, we don’t want to block the process of global product creation, so this attribute will be optional for global products, but we will prompt by “mandatory_region” response parameter that the market code (https://open.shopee.com/developer-guide/217) that is required for these certain attributes.
- Except for the special attributes mentioned in the first point, all other attributes, as long as one of the markets requires mandatory, are returned as mandatory by v2.global_product.get_attribute_tree (https://open.shopee.com/documents/v2/v2.global_product.get_attribute_tree?module=90&type=1) API.
3.4 Getting recommendation attributeAPI: v2.global_product.get_recommend_attribute (https://open.shopee.com/documents/v2/v2.global_product.get_recommend_attribute?module=90&type=1)
3.5 Getting the available brand list API: v2.global_product.get_brand_list (https://open.shopee.com/documents/v2/v2.global_product.get_brand_list?module=90&type=1)
3.6 Getting days to shipAPI: v2.global_product.get_dts_limit (https://open.shopee.com/documents/v2/v2.global_product.get_dts_limit?module=90&type=1)
 
Please note that:
V2.global_product.get_dts_limit (https://open.shopee.com/documents/v2/v2.global_product.get_dts_limit?module=90&type=1) will return a concatenation of the number of shipping days that can be filled for all markets, i.e. can be
 "days_to_ship_range_list": [
            {
                  "min_limit": 7,
                 "max_limit": 8
            },
           {
                 "min_limit": 10,
                   "max_limit": 13
            } ]
In this case, the available shipping days for global products are 7, 8, 10, 11, 12, and 13.
You can also save the API data of v2.product.get_dts_limit (https://open.shopee.com/documents/v2/v2.product.get_dts_limit?module=89&type=1) to get more precise shipping days for each market.
3.7 Getting information about whether the category supports size chartAPI: v2.global_product.support_size_chart (https://open.shopee.com/documents/v2/v2.global_product.support_size_chart?module=90&type=1)
 
Please note that:
We are rolling out the table type size chart, Please review the announcement (https://open.shopee.com/announcements/548) for details
3.8 Getting  global product restrictionsAPI: v2.global_product.get_global_item_limit (https://open.shopee.com/documents/v2/v2.global_product.get_global_item_limit?module=90&type=1)
 
Please note that:
The function of text_length_multiplier field: For MTSKU product name/description/variation name and option name, we support seller input Chinese and English, but the Chinese translation with the same character length will have longer information than the English translation into the market language, so in order to Chinese and English have different character length limits, we added text_length_multiplier field to indicate the number of Chinese characters calculated multiplier. That is, when the API returns
 
 "text_length_multiplier": 2.44,
  "global_item_name_length_limit": {
            "min_limit": 1,
            "max_limit": 500
},
It means that if the seller fills in the product name in English, the maximum number of characters is 1 to 500; if the seller fills in the product name in Chinese, the maximum number of characters is 1 to 204 (because 500/2.44 =204.92), description/variation name and option name have the same logic.
4. Creating global product4.1 Completing CNSC/KRSC basic configurationSellers need to log in to CNSC/KRSC to complete the configuration of currency and exchange rate before creating global products, otherwise, v2.global_product.add_global_item (https://open.shopee.com/documents/v2/v2.global_product.add_global_item?module=90&type=1) API will report an error.
- CNSC sellers learn more about the operation guide- Set the currency: https://shopee.cn/edu/article/10614 (https://shopee.cn/edu/article/10614)
- Set the rate: https://shopee.cn/edu/article/3904 (https://shopee.cn/edu/article/3904)

- For KRSC sellers, please click here (https://shopee.kr/edu/article/10103) for more detail.
4.2 Completing the main account authorizationplease refer to "Authorization and Authentication (https://open.shopee.com/developer-guide/20)"
4.3 Getting the merchant id list and shop id list under the main accountThe following APIs can be called:
Step 1: Get the current authorized merchant id list and shop id list through v2.public.get_access_token (https://open.shopee.com/documents/v2/v2.public.get_access_token?module=104&type=1) API after authorization.
Step 2: Call v2.merchant.get_merchant_info (https://open.shopee.com/documents/v2/v2.merchant.get_merchant_info?module=93&type=1) API to get the merchant information of each authorized merchant.
Step 3: Call v2.merchant.get_shop_list_by_merchant (https://open.shopee.com/documents/v2/v2.merchant.get_shop_list_by_merchant?module=93&type=1) API to get the list of authorized shops of each merchant.
Step 4: Call v2.shop.get_shop_info (https://open.shopee.com/documents/v2/v2.shop.get_shop_info?module=92&type=1) API to get the information of each authorized shop, including the relationship between the SIP primary shop and affiliated shops.
- If it is a normal shop, is_sip= false and the sip_affi_shops field is not returned;
- If it is a SIP primary shop, is_sip=true and the sip_affi_shops field is returned;
- If it is a SIP affiliated shop, is_sip=true and the sip_affi_shops field is not returned.
4.4 Setting product information synchronizationSellers can set whether global product information updates are automatically synchronized to shop products through CNSC/KRSC or API
 
CNSC/KRSC screenshot.
*checked means sync, unchecked means no sync.
 
Set by v2.global_product.set_sync_field (https://open.shopee.com/documents/v2/v2.global_product.set_sync_field?module=90&type=1) API, “true” means sync, “false” means no sync.
4.5 Uploading global product 
4.5.1 Uploading media files
Images and videos of products need to be pre-stored in Shopee's media space, so you need to call media_space related API to upload first. For more details, please refer to the article "Uploading media files (https://open.shopee.com/developer-guide/211)" section.
After uploading images and videos, you can call v2.global_product.add_global_item (https://open.shopee.com/documents/v2/v2.global_product.add_global_item?module=90&type=1) API to create global products. 
 
4.5.2 Uploading category and category attributes
 
1) Uploading category
Category id is required for global products. You can only select the category id that returns “has_children”=false from v2.global_product.get_category (https://open.shopee.com/documents/v2/v2.global_product.get_category?module=90&type=1) API.
 
2）Uploading attributes
Global products must upload the required attributes. You can learn about the various attribute types through the article  "Product creation preparation (https://open.shopee.com/developer-guide/209)". For details on how to upload various attribute types for products, please refer to the article "Creating Products (https://open.shopee.com/developer-guide/211)".
 
4.5.3 Uploading global product name
 
The global_item_name can only be uploaded in plain Simplified Chinese or plain English and numbers. Please do not mix English and Chinese in the name, as this may result in some words not being translated into local language, then the item being banned.
 
4.5.4 Uploading global product description
Global product descriptions can only be filled in simplified Chinese, English, and numbers.
 
Please note that:
We currently support whitelisted sellers to insert the image to description, please refer to the FAQ (https://open.shopee.com/faq?top=162&sub=166&page=1&faq=218) for details on how to upload.
 
4.5.5 Uploading global product price
Chinese cross-border sellers can use RMB or USD for pricing, Korean cross-border sellers can use USD for pricing, you need to check the merchant_currency field in the v2.merchant.get_merchant_info (https://open.shopee.com/documents/v2/v2.merchant.get_merchant_info?module=93&type=1) API, then upload the price of the corresponding currency according to the currency selected by the seller.
 
4.5.6 Uploading global product stock
Please note that the stock logic:
For example, if MTSKU publishes 3 MPSKU, there are MPSKU1, MPSKU2, MPSKU3, then when MTSKU stock is set to 100, stock MPSKU1=MPSKU2=MPSKU3=100, when MPSKU1 sells one item, stock MTSKU=MPSKU1=MPSKU2= MPSKU3=99.
 
4.6 Creating variantsWhen you create a global product successfully, v2.global_product.add_global_item (https://open.shopee.com/documents/v2/v2.global_product.add_global_item?module=90&type=1) API will return the global_item_id, which is a unique identifier for the global product. If you also need to define specifications and create multiple variants, you can call the v2.global_product.init_tier_variation (https://open.shopee.com/documents/v2/v2.global_product.init_tier_variation?module=90&type=1) API then you will get the global_model_id from v2.global_product.get_global_model_list (https://open.shopee.com/documents/v2/v2.global_product.get_global_model_list?module=90&type=1) API for each variations as a unique identifier for the variations.
 
4.6.1 Creating 1-tier variation
Assuming that the product has a size specification, the size includes XS, S, and M. We call this a 1-tier variation product.
tier_indexsizepricestockskutier_index[0]XS10010sku1tier_index[1]S20020sku2tier_index[2]M30030sku3 
v2.global_product.init_tier_variation (https://open.shopee.com/documents/v2/v2.global_product.init_tier_variation?module=90&type=1) API request example:
{

    "global_item_id": 800188562,

    "tier_variation": [

        {

            "name": "size",

            "option_list": [

                {

                    "option": "XS",

                    "image": {"image_id":"82becb4830bd2ee90ad6acf8a9dc26d7"}

                },

                {

                    "option": "S",

        "image": {"image_id":"72becb4830bd2ee90ad6acf879dc26d7"}

                },

                {

                    "option": "M",

      "image": {"image_id":"92becb4830bd2ee90ad6acf8a9dc26d7"}

                }

            ]

        }

    ],

    "model": [

        {

            "tier_index": [0],

            "original_price": 100,

            "global_model_sku": "sku1",

            "normal_stock": 10

        },

        {

            "tier_index": [1],

            "original_price": 200,

            "global_model_sku": "sku1",

            "normal_stock": 20

        },

       {

            "tier_index": [2],

            "original_price": 300,

            "global_model_sku": "sku3",

            "normal_stock": 30

        }

    ]

} 
 
4.6.2 Creating 2-tier variants
Assuming that the product has color and size specifications, the color includes red and blue, and the size contains XL and L. We call this a 2-tier variations product, so there are at most 2*2=4 variants in this example.
tier_indexcolorsizepricestockskutier_index[0,0]RedXL10010sku1tier_index[0,1]RedL20020sku2tier_index[1,0]BlueXL30030sku3tier_index[1,1]BlueL40040sku4 
v2.global_product.init_tier_variation API request example: (https://open.shopee.com/documents/v2/v2.global_product.init_tier_variation?module=90&type=1)
 {

  "global_item_id": 100917481,

  "tier_variation": [

    {

      "name": "color",

      "option_list": [

        {

          "image": {"image_id": "82becb4830bd2ee90ad6acf8a9dc26d7"},

          "option": "Red"

        },

        {

          "image": {"image_id": "72becb4830bd2ee90ad6acf879dc26d7"},

          "option": "Blue"

        }

      ]

    },

    {

      "name": "size",

      "option_list": [

        {

          "option": "XL"

        },

        {

          "option": "L"

        }

      ]

    }

  ],

  "model": [

    { 

      "tier_index": [0,0],

      "original_price": 100,

      "normal_stock": 10,

      "global_model_sku": "sku1"

    },

    {

     "tier_index": [0,1],

      "original_price": 200,

      "normal_stock": 20,

      "global_model_sku": "sku2"

    },

    {

      "tier_index": [1,0],

      "original_price": 300,

      "normal_stock": 30,

      "global_model_sku": "sku3"

    },

    {

     "tier_index": [1,1],

      "original_price": 400,

      "normal_stock": 40,

      "global_model_sku": "sku4"

    }  ]

}

 
Please note that: 
- The options you define will be displayed on the Shopee mall side in order. Shopee currently only supports the definition of up to 2-tier variation.
- You can define an image for each variant. If it is a 2-tier variation product, you can only define the first layer of options, that is, in the example, you can define variant images based on color, but not based on size. Once you want to add variant images, all the options in the first layer need to define the image. The image needs to be uploaded by calling the v2.media_space.upload_image (https://open.shopee.com/documents/v2/v2.media_space.upload_image?module=91&type=1) API first.
- The tier_index must start from 0 and not overflow, otherwise an error will be reported.
- It is recommended that you create variants after an interval of 5 seconds after creating an item, because there may be a delay in creating item data.
 
Next, please review how to publish global product (https://open.shopee.com/developer-guide/215)

## Content (raw HTML)

```html
<p><span style="color:#EE4D2D;"><i>*This article applies to cross-border sellers who have upgraded CNSC/KRSC</i></span></p><h1>What is the global product?</h1><p>Global product is proposed for cross-border sellers, through which you can manage the product of multiple market shops in one stop. Its advantages are reflected in the following aspects.</p><ul><li>Language auto-translation: sellers can fill in the product name and description of a global product in Chinese or English, and set up to synchronize the update to the shop products, Shopee will automatically translate into the local language.</li><li>Stock unified management: sellers can unify the management of multi-shop products stock through global products.</li><li>Product information synchronization update: for some non-market differentiated product information, sellers can modify the global product, then Shopee will synchronize the update to the shop product information.</li><li>Multi-shop product one-click pricing: Shopee provides pricing formula and formula factor configuration, sellers can update the price of global products and set the synchronous update to shop products, Shopee will update shop products’ price according to the results of the formula calculation.</li></ul><p>&nbsp;</p><p>Currently, cross-border sellers who have upgraded CNSC or KRSC need to additionally integrate to Merchant API and Global Product API, because you need to manage product information with global products. For other APIs such as order related api, no changes are needed.</p><ul><li>Click <a target="_blank" rel="noopener noreferrer" href="https://shopee.cn/edu/article/7258"><u>here</u></a> to learn more about CNSC.</li><li>Click <a target="_blank" rel="noopener noreferrer" href="https://shopee.kr/edu/article/10732"><u>here</u></a> to learn more about KRSC.</li></ul><h1>CNSC/KRSC account system</h1><p>Below we will explain the concepts related to the upgraded CNSC or KRSC account system. (Only applicable to cross-border sellers)</p><figure class="image"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=Avz3j1sMh5GhzTKbRiBDRysrQunZgKawmjVaUGbqTbJlAtT4%2B37twQ%2FaYyKGynG0MKim0WMuWOP%2FoBWh4ffQiw%3D%3D&amp;image_type=png"></figure><p>&nbsp;</p><p>&nbsp;</p><p>Terminology Description:</p><ul><li>Main account : The seller account with highest authority, the account owner is usually a corporate entity, and this account can manage all shops and all sub-accounts of the seller. The login format of the main account is <strong>XXX: main</strong>, for example, maidehao:main.</li><li>Merchant: The company under the main account, multiple companies can be added to a main account after it is activated.</li><li>Shop: The shops under the main account. Shops in multiple markets can exist under one Merchant. The main account can authorize the shops to be managed by different sub-accounts.</li></ul><p>&nbsp;</p><p>&nbsp;</p><p>1) When you upgrade the shops to CNSC/KRSC accounts, You will get the main account for authorization, and only the main account can do the shop authorization. Please refer to the <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/developer-guide/20"><u>article</u></a> on how to authorize using the main account.</p><p>2) Under one main account, there can be multiple Merchants, and under each Merchant, there can be multiple market shops, including SIP's shop. Moreover, there may be multiple shops of the same market under Merchant.</p><h1>Global products and shop products</h1><p>In the following, we will explain the relationship with global products and shop products.</p><figure class="image"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=d3%2FTZNGva6KTVxvnERcswO9kruOT1dcy%2BYv5PlzmKN5q%2Fxf2u47IiWkiMcrWztU0dfT8iD0nLsQ6VAt%2BUFYFYQ%3D%3D&amp;image_type=png"></figure><figure class="table"><table><tbody><tr><td>Abbreviations</td><td>CNSC/KRSC name</td><td>Description</td></tr><tr><td>MTSKU</td><td>Global SKU</td><td>Sellers will manage some basic product information by MTSKU, including product categories, attributes, weights, etc. After publishing to diffremarkets, sellers only need to modify the global products, and Shopee will synchronize the changes to shop products.</td></tr><tr><td>MPSKU</td><td>Shop SKU</td><td>Real goods visible to buyers.</td></tr></tbody></table></figure><h1>Changes in product management process</h1><p>After the adoption of global product management, please note the following changes to the product management process:</p><h2>1. Product creation&nbsp;</h2><p>Now you must create global products through <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.global_product.add_global_item?module=90&amp;type=1"><u>v2.global_product.add_global_item</u></a> API, and then call <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.global_product.create_publish_task?module=90&amp;type=1"><u>v2.global_product.create_publish_task</u></a> API to publish global products to each market then shop products will be generated. For more detail about the publishing process can click <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/developer-guide/215"><u>here</u></a>.</p><h2>2. Field management restrictions</h2><p>We divide the product-related fields into three categories.</p><p>1. Fields can only be managed by MTSKU: These fields have no market differences, such as categories, attributes, etc.. When the seller updates these field values of MTSKU, Shopee will update the value to MPSKU as well.</p><p>2. MTSKU and MPSKU jointly managed fields: These fields have market differentiation, such as product names and product descriptions. If sellers choose to update the field values through the MTSKU, then Shopee will translate or update the value to the MPSKU. If sellers choose to update the values of MPSKU alone, but do not modify the MTSKU, the update will only be effective for that MPSKU.</p><p>3. Fields can only be managed by MPSKU: These fields are not managed through the global product, like logistics info.</p><figure class="table"><table><tbody><tr><td>API Field</td><td>Manage by MTSKU</td><td>Manage by MPSKU</td></tr><tr><td>category_id</td><td><p class="indent-1">✓</p></td><td><p class="indent-1">×</p></td></tr><tr><td>attribute</td><td><p class="indent-1">✓</p></td><td><p class="indent-1">×</p></td></tr><tr><td>brand</td><td><p class="indent-1">✓</p></td><td><p class="indent-1">×</p></td></tr><tr><td>item_name</td><td><p class="indent-1">✓</p></td><td><p class="indent-1">✓</p></td></tr><tr><td>description</td><td><p class="indent-1">✓</p></td><td><p class="indent-1">✓</p></td></tr><tr><td>weight</td><td><p class="indent-1">✓</p></td><td><p class="indent-1">×</p></td></tr><tr><td>dimension</td><td><p class="indent-1">✓</p></td><td><p class="indent-1">×</p></td></tr><tr><td>price</td><td><p class="indent-1">✓</p></td><td><p class="indent-1">✓</p></td></tr><tr><td><strong>stock</strong></td><td><p class="indent-1">✓</p></td><td><p class="indent-1">×</p></td></tr><tr><td>image/video</td><td><p class="indent-1">✓</p></td><td><p class="indent-1">✓</p></td></tr><tr><td>days_to_ship</td><td><p class="indent-1">✓</p></td><td><p class="indent-1">✓</p></td></tr><tr><td><strong>item_status</strong></td><td><p class="indent-1">✓</p></td><td><p class="indent-1">✓</p></td></tr><tr><td>condition</td><td><p class="indent-1">✓</p></td><td><p class="indent-1">×</p></td></tr><tr><td>item sku</td><td><p class="indent-1">✓</p></td><td><p class="indent-1">×</p></td></tr><tr><td>tier_variation structure</td><td><p class="indent-1">✓</p></td><td><p class="indent-1">×</p></td></tr><tr><td>tier_variation-name/option</td><td><p class="indent-1">✓</p></td><td><p class="indent-1">✓</p></td></tr><tr><td>logistics</td><td><p class="indent-1">×</p></td><td><p class="indent-1">✓</p></td></tr></tbody></table></figure><p>&nbsp;</p><p><strong>Please note that:</strong></p><ul><li>Stock Logic: Assuming the stock of MTSKU is 10 and MTSKU has published MPSKU1 and MPSKU2, then the stock of MPSKU1 = MPSKU2 = 10. When the buyer purchased one MPSKU1, that is, the stock of MPSKU1=9 , then the stock of MTSKU= MPSKU2=9.</li><li>Item Status Logic: If a global item is deleted, all shop products for which the global item has been published will also be deleted. However, shop products can be deleted and unlist individually without affecting global products.</li></ul><h2>3. Product basic data differences</h2><p>If you first connect to Shopee product management, it is recommended to read through the article "<a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/developer-guide/209"><u>Product creation preparation</u></a>" first, because the fields of global products and shop products are basically the same. Here we will explain the difference.</p><h3>3.1 Getting categories</h3><p>API: <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.global_product.get_category?module=90&amp;type=1"><u>v2.global_product.get_category</u></a></p><p>&nbsp;</p><p><strong>Please note that:</strong></p><ul><li>For different merchants, this API returns the same category tree data.</li><li><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.global_product.get_category?module=90&amp;type=1"><u>V2.global_product.get_category</u></a> API will return the available category for global product. But there may be a situation that category A is not available in Malaysia shop, but available in Brazil shop, we will prompt you not to publish the global product to Malaysia in the process of publishing global products, if you want to get the exactly available category for each market, you can call <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.get_category?module=89&amp;type=1"><u>v2.product.get_category</u></a> API.</li></ul><h3>3.2 Getting recommended categories</h3><p>API: <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.global_product.category_recommend?module=90&amp;type=1"><u>v2.global_product.category_recommend</u></a></p><h3>3.3 Getting attributes</h3><p>API：<a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.global_product.get_attribute_tree?module=90&amp;type=1"><u>v2.global_product.get_attribute_tree</u></a></p><p>&nbsp;</p><p><strong>Please note that:</strong></p><ul><li>The<strong> </strong>function of <strong>need_region_mandatory</strong> request parameter and <strong>mandatory_region </strong>response&nbsp; parameter: because for some attributes, such as NCC attribute, only products in the Taiwan market are compulsory, if the seller doesn't want to publish to Taiwan shops, we don’t want to block the process of global product creation, so this attribute will be optional for global products, but we will prompt by “mandatory_region” response parameter that the <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/developer-guide/217"><u>market code</u></a> that is required for these certain attributes.</li><li>Except for the special attributes mentioned in the first point, all other attributes, as long as one of the markets requires mandatory, are returned as mandatory by <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.global_product.get_attribute_tree?module=90&amp;type=1"><u>v2.global_product.get_attribute_tree</u></a><u> </u>API.</li></ul><h3>3.4 Getting recommendation attribute</h3><p>API: <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.global_product.get_recommend_attribute?module=90&amp;type=1"><u>v2.global_product.get_recommend_attribute</u></a></p><h3>3.5 Getting the available brand list&nbsp;</h3><p>API: <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.global_product.get_brand_list?module=90&amp;type=1"><u>v2.global_product.get_brand_list</u></a></p><h3>3.6 Getting days to ship</h3><p>API: <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.global_product.get_dts_limit?module=90&amp;type=1"><u>v2.global_product.get_dts_limit</u></a></p><p>&nbsp;</p><p><strong>Please note that:</strong></p><p><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.global_product.get_dts_limit?module=90&amp;type=1"><u>V2.global_product.get_dts_limit</u></a> will return a concatenation of the number of shipping days that can be filled for all markets, i.e. can be</p><p class="indent-1">&nbsp;"days_to_ship_range_list": [</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp; &nbsp; &nbsp;{</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;"min_limit": 7,</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;"max_limit": 8</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;},</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;{</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp; &nbsp;"min_limit": 10,</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp; &nbsp;"max_limit": 13</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;} ]</p><p>In this case, the available shipping days for global products are 7, 8, 10, 11, 12, and 13.</p><p>You can also save the API data of <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.get_dts_limit?module=89&amp;type=1"><u>v2.product.get_dts_limit</u></a> to get more precise shipping days for each market.</p><h3>3.7 Getting information about whether the category supports size chart</h3><p>API: <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.global_product.support_size_chart?module=90&amp;type=1"><u>v2.global_product.support_size_chart</u></a></p><p>&nbsp;</p><p><strong>Please note that:</strong></p><p>We are rolling out the table type size chart, Please review the <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/announcements/548"><u>announcement</u></a> for details</p><h3>3.8 Getting &nbsp;global product restrictions</h3><p>API: <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.global_product.get_global_item_limit?module=90&amp;type=1"><u>v2.global_product.get_global_item_limit</u></a></p><p>&nbsp;</p><p><strong>Please note that:</strong></p><p>The function of<strong> text_length_multiplier</strong> field: For MTSKU product name/description/variation name and option name, we support seller input Chinese and English, but the Chinese translation with the same character length will have longer information than the English translation into the market language, so in order to Chinese and English have different character length limits, we added <strong>text_length_multiplier</strong> field to indicate the number of Chinese characters calculated multiplier. That is, when the API returns</p><p>&nbsp;</p><p class="indent-1">&nbsp;"text_length_multiplier": 2.44,</p><p class="indent-1">&nbsp;&nbsp;"global_item_name_length_limit": {</p><p class="indent-1">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"min_limit": 1,</p><p class="indent-1">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"max_limit": 500</p><p class="indent-1">},</p><p>It means that if the seller fills in the product name in English, the maximum number of characters is 1 to 500; if the seller fills in the product name in Chinese, the maximum number of characters is 1 to 204 (because 500/2.44 =204.92), description/variation name and option name have the same logic.</p><h2>4. Creating global product</h2><h3>4.1 Completing CNSC/KRSC basic configuration</h3><p>Sellers need to log in to CNSC/KRSC to complete the configuration of currency and exchange rate before creating global products, otherwise, <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.global_product.add_global_item?module=90&amp;type=1"><u>v2.global_product.add_global_item</u></a> API will report an error.</p><ul><li>CNSC sellers learn more about the operation guide<ul><li>Set the currency: <a target="_blank" rel="noopener noreferrer" href="https://shopee.cn/edu/article/10614"><u>https://shopee.cn/edu/article/10614</u></a></li><li>Set the rate: <a target="_blank" rel="noopener noreferrer" href="https://shopee.cn/edu/article/3904"><u>https://shopee.cn/edu/article/3904</u></a></li></ul></li><li>For KRSC sellers, please click <a target="_blank" rel="noopener noreferrer" href="https://shopee.kr/edu/article/10103"><u>here</u></a> for more detail.</li></ul><h3>4.2 Completing the main account authorization</h3><p>please refer to "<a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/developer-guide/20"><u>Authorization and Authentication</u></a>"</p><h3>4.3 Getting the merchant id list and shop id list under the main account</h3><p>The following APIs can be called:</p><p>Step 1: Get the current authorized merchant id list and shop id list through <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.public.get_access_token?module=104&amp;type=1"><u>v2.public.get_access_token</u></a> API after authorization.</p><p>Step 2: Call <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.merchant.get_merchant_info?module=93&amp;type=1"><u>v2.merchant.get_merchant_info</u></a> API to get the merchant information of each authorized merchant.</p><p>Step 3: Call <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.merchant.get_shop_list_by_merchant?module=93&amp;type=1"><u>v2.merchant.get_shop_list_by_merchant</u></a> API to get the list of authorized shops of each merchant.</p><p>Step 4: Call <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.shop.get_shop_info?module=92&amp;type=1"><u>v2.shop.get_shop_info</u></a> API to get the information of each authorized shop, including the relationship between the SIP primary shop and affiliated shops.</p><ul><li>If it is a normal shop, is_sip= false and the sip_affi_shops field is not returned;</li><li>If it is a SIP primary shop, is_sip=true and the sip_affi_shops field is returned;</li><li>If it is a SIP affiliated shop, is_sip=true and the sip_affi_shops field is not returned.</li></ul><h3>4.4 Setting product information synchronization</h3><p>Sellers can set whether global product information updates are automatically synchronized to shop products through CNSC/KRSC or API</p><p>&nbsp;</p><p>CNSC/KRSC screenshot.</p><figure class="image"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=ngX41bo130cnIiZc6sYaTXsL5UjyuzNOC51KLNiuKXG3DDmgb0j%2By6SH0GOB4S2VHBxAKBj6RJttjh2g18%2BiMg%3D%3D&amp;image_type=png"></figure><figure class="image"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=T8o%2F6FHoNq%2FP3TF41ITfXeCnzbc7eUG0UbhCh9vaWMfmywrQn3qt0mCyjreuiiLbrGzXtiGPxUwi0h6NbnOGAw%3D%3D&amp;image_type=png"></figure><p>*checked means sync, unchecked means no sync.</p><p>&nbsp;</p><p>Set by <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.global_product.set_sync_field?module=90&amp;type=1"><u>v2.global_product.set_sync_field</u></a> API, “true” means sync, “false” means no sync.</p><h3>4.5 Uploading global product</h3><p>&nbsp;</p><p>4.5.1 Uploading media files</p><p>Images and videos of products need to be pre-stored in Shopee's media space, so you need to call media_space related API to upload first. For more details, please refer to the article "<a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/developer-guide/211"><u>Uploading media files</u></a>" section.</p><p>After uploading images and videos, you can call <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.global_product.add_global_item?module=90&amp;type=1"><u>v2.global_product.add_global_item</u></a> API to create global products.&nbsp;</p><p>&nbsp;</p><p>4.5.2 Uploading category and category attributes</p><p>&nbsp;</p><p>1) Uploading category</p><p>Category id is required for global products. You can only select the category id that returns “has_children”=false from <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.global_product.get_category?module=90&amp;type=1"><u>v2.global_product.get_category</u></a> API.</p><p>&nbsp;</p><p>2）Uploading attributes</p><p>Global products must upload the required attributes. You can learn about the various attribute types through the article &nbsp;"<a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/developer-guide/209"><u>Product creation preparation</u></a>". For details on how to upload various attribute types for products, please refer to the article "<a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/developer-guide/211"><u>Creating Products</u></a>".</p><p>&nbsp;</p><p>4.5.3 Uploading global product name</p><p>&nbsp;</p><p>The global_item_name can only be uploaded in plain Simplified Chinese or plain English and numbers. Please do not mix English and Chinese in the name, as this may result in some words not being translated into local language, then the item being banned.</p><p>&nbsp;</p><p>4.5.4 Uploading global product description</p><p>Global product descriptions can only be filled in simplified Chinese, English, and numbers.</p><p>&nbsp;</p><p><strong>Please note that:</strong></p><p>We currently support whitelisted sellers to insert the image to description, please refer to the <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/faq?top=162&amp;sub=166&amp;page=1&amp;faq=218"><u>FAQ</u></a> for details on how to upload.</p><p>&nbsp;</p><p>4.5.5 Uploading global product price</p><p>Chinese cross-border sellers can use RMB or USD for pricing, Korean cross-border sellers can use USD for pricing, you need to check the merchant_currency field in the <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.merchant.get_merchant_info?module=93&amp;type=1"><u>v2.merchant.get_merchant_info</u></a> API, then upload the price of the corresponding currency according to the currency selected by the seller.</p><p>&nbsp;</p><p>4.5.6 Uploading global product stock</p><p><strong>Please note that</strong> the stock logic:</p><p>For example, if MTSKU publishes 3 MPSKU, there are MPSKU1, MPSKU2, MPSKU3, then when MTSKU stock is set to 100, stock MPSKU1=MPSKU2=MPSKU3=100, when MPSKU1 sells one item, stock MTSKU=MPSKU1=MPSKU2= MPSKU3=99.</p><p>&nbsp;</p><h3>4.6 Creating variants</h3><p>When you create a global product successfully, <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.global_product.add_global_item?module=90&amp;type=1"><u>v2.global_product.add_global_item</u></a> API will return the global_item_id, which is a unique identifier for the global product. If you also need to define specifications and create multiple variants, you can call the <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.global_product.init_tier_variation?module=90&amp;type=1"><u>v2.global_product.init_tier_variation</u></a> API then you will get the global_model_id from <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.global_product.get_global_model_list?module=90&amp;type=1"><u>v2.global_product.get_global_model_list</u></a> API for each variations as a unique identifier for the variations.</p><p>&nbsp;</p><p>4.6.1 Creating 1-tier variation</p><p>Assuming that the product has a size specification, the size includes XS, S, and M. We call <span style="background-color:rgb(255,255,255);">this a 1-tier variation product</span>.</p><figure class="table"><table><tbody><tr><td><span style="background-color:rgb(255,255,255);">tier_index</span></td><td><span style="background-color:rgb(255,255,255);">size</span></td><td><span style="background-color:rgb(255,255,255);">price</span></td><td><span style="background-color:rgb(255,255,255);">stock</span></td><td><span style="background-color:rgb(255,255,255);">sku</span></td></tr><tr><td><span style="background-color:rgb(255,255,255);">tier_index[0]</span></td><td><span style="background-color:rgb(255,255,255);">XS</span></td><td><span style="background-color:rgb(255,255,255);">100</span></td><td><span style="background-color:rgb(255,255,255);">10</span></td><td><span style="background-color:rgb(255,255,255);">sku1</span></td></tr><tr><td><span style="background-color:rgb(255,255,255);">tier_index[1]</span></td><td><span style="background-color:rgb(255,255,255);">S</span></td><td><span style="background-color:rgb(255,255,255);">200</span></td><td><span style="background-color:rgb(255,255,255);">20</span></td><td><span style="background-color:rgb(255,255,255);">sku2</span></td></tr><tr><td><span style="background-color:rgb(255,255,255);">tier_index[2]</span></td><td><span style="background-color:rgb(255,255,255);">M</span></td><td><span style="background-color:rgb(255,255,255);">300</span></td><td><span style="background-color:rgb(255,255,255);">30</span></td><td><span style="background-color:rgb(255,255,255);">sku3</span></td></tr></tbody></table></figure><p>&nbsp;</p><p><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.global_product.init_tier_variation?module=90&amp;type=1"><u>v2.global_product.init_tier_variation</u></a> API request example:</p><pre><code class="json hljs">{

 &nbsp;&nbsp;&nbsp;"global_item_id": 800188562,

 &nbsp;&nbsp;&nbsp;"tier_variation": [

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"name": "size",

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"option_list": [

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"option": "XS",

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"image": {"image_id":"82becb4830bd2ee90ad6acf8a9dc26d7"}

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"option": "S",

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"image": {"image_id":"72becb4830bd2ee90ad6acf879dc26d7"}

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"option": "M",

      "image": {"image_id":"92becb4830bd2ee90ad6acf8a9dc26d7"}

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}

 &nbsp;&nbsp;&nbsp;],

 &nbsp;&nbsp;&nbsp;"model": [

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"tier_index": [0],

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"original_price": 100,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"global_model_sku": "sku1",

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"normal_stock": 10

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"tier_index": [1],

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"original_price": 200,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"global_model_sku": "sku1",

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"normal_stock": 20

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"tier_index": [2],

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"original_price": 300,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"global_model_sku": "sku3",

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"normal_stock": 30

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}

 &nbsp;&nbsp;&nbsp;]

}</code></pre><p>&nbsp;</p><p>&nbsp;</p><p>4.6.2 Creating 2-tier variants</p><p>Assuming<span style="background-color:rgb(255,255,255);"> that the product has color and size specifications, the color includes red and blue, and the size contains XL and L. We call this a 2-tier variations product, so there are at most 2*2=4 variants in this example.</span></p><figure class="table"><table><tbody><tr><td><span style="background-color:rgb(255,255,255);">tier_index</span></td><td><span style="background-color:rgb(255,255,255);">color</span></td><td><span style="background-color:rgb(255,255,255);">size</span></td><td><span style="background-color:rgb(255,255,255);">price</span></td><td><span style="background-color:rgb(255,255,255);">stock</span></td><td><span style="background-color:rgb(255,255,255);">sku</span></td></tr><tr><td><span style="background-color:rgb(255,255,255);">tier_index[0,0]</span></td><td><span style="background-color:rgb(255,255,255);">Red</span></td><td><span style="background-color:rgb(255,255,255);">XL</span></td><td><span style="background-color:rgb(255,255,255);">100</span></td><td><span style="background-color:rgb(255,255,255);">10</span></td><td><span style="background-color:rgb(255,255,255);">sku1</span></td></tr><tr><td><span style="background-color:rgb(255,255,255);">tier_index[0,1]</span></td><td><span style="background-color:rgb(255,255,255);">Red</span></td><td><span style="background-color:rgb(255,255,255);">L</span></td><td><span style="background-color:rgb(255,255,255);">200</span></td><td><span style="background-color:rgb(255,255,255);">20</span></td><td><span style="background-color:rgb(255,255,255);">sku2</span></td></tr><tr><td><span style="background-color:rgb(255,255,255);">tier_index[1,0]</span></td><td><span style="background-color:rgb(255,255,255);">Blue</span></td><td><span style="background-color:rgb(255,255,255);">XL</span></td><td><span style="background-color:rgb(255,255,255);">300</span></td><td><span style="background-color:rgb(255,255,255);">30</span></td><td><span style="background-color:rgb(255,255,255);">sku3</span></td></tr><tr><td><span style="background-color:rgb(255,255,255);">tier_index[1,1]</span></td><td><span style="background-color:rgb(255,255,255);">Blue</span></td><td><span style="background-color:rgb(255,255,255);">L</span></td><td><span style="background-color:rgb(255,255,255);">400</span></td><td><span style="background-color:rgb(255,255,255);">40</span></td><td><span style="background-color:rgb(255,255,255);">sku4</span></td></tr></tbody></table></figure><p>&nbsp;</p><p><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.global_product.init_tier_variation?module=90&amp;type=1"><u>v2.global_product.init_tier_variation </u><span style="color:#2B2C2D;">API request example:</span></a></p><pre><code class="json hljs"> {

 &nbsp;"global_item_id": 100917481,

 &nbsp;"tier_variation": [

 &nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"name": "color",

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"option_list": [

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"image": {"image_id": "82becb4830bd2ee90ad6acf8a9dc26d7"},

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"option": "Red"

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"image": {"image_id": "72becb4830bd2ee90ad6acf879dc26d7"},

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"option": "Blue"

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]

 &nbsp;&nbsp;&nbsp;},

 &nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"name": "size",

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"option_list": [

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"option": "XL"

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"option": "L"

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]

 &nbsp;&nbsp;&nbsp;}

 &nbsp;],

 &nbsp;"model": [

 &nbsp;&nbsp;&nbsp;{ 

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"tier_index": [0,0],

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"original_price": 100,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"normal_stock": 10,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"global_model_sku": "sku1"

 &nbsp;&nbsp;&nbsp;},

 &nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;"tier_index": [0,1],

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"original_price": 200,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"normal_stock": 20,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"global_model_sku": "sku2"

 &nbsp;&nbsp;&nbsp;},

 &nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"tier_index": [1,0],

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"original_price": 300,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"normal_stock": 30,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"global_model_sku": "sku3"

 &nbsp;&nbsp;&nbsp;},

 &nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;"tier_index": [1,1],

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"original_price": 400,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"normal_stock": 40,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"global_model_sku": "sku4"

 &nbsp;&nbsp;&nbsp;}&nbsp; ]

}

</code></pre><p>&nbsp;</p><p><strong>Please note that:&nbsp;</strong></p><ul><li>The options you define will be displayed on the Shopee mall side in order. Shopee currently only supports the definition of up to 2-tier variation.</li><li>You can define an image for each variant. If it is a 2-tier variation product, you can only define the first layer of options, that is, in the example, you can define variant images based on color, but not based on size. Once you want to add variant images, all the options in the first layer need to define the image. The image needs to be uploaded by calling the <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.media_space.upload_image?module=91&amp;type=1"><u>v2.media_space.upload_image</u></a> API first.</li><li>The tier_index must start from 0 and not overflow, otherwise an error will be reported.</li><li>It is recommended that you create variants after an interval of 5 seconds after creating an item, because there may be a delay in creating item data.</li></ul><p>&nbsp;</p><p><span style="background-color:rgb(255,255,255);">Next, please review </span><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/developer-guide/215"><span style="background-color:rgb(255,255,255);"><u>how to publish global product</u></span></a></p><p>&nbsp;</p><p>&nbsp;</p>
```
