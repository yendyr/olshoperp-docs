# Product creation preparation

> **Source:** [https://open.shopee.com/developer-guide/209](https://open.shopee.com/developer-guide/209)
> **Type:** Developer Guide / Overview
> **document_id:** `209`
> **Section:** API Guidelines and Flows

## Content

Before creating a product, you need to get the category, attributes, brand,days to ship, whether the category supports size chart and other information through API to get prepared for creating products.
1. CategoryEach product must have a unique category, please get Shopee category data by v2.product.get_category (https://open.shopee.com/documents/v2/v2.product.get_category?module=89&type=1) API. Each node's category has a unique category_id.
1.1 Global category dataShopee's category tree data applies to all markets, but according to the local policies of the market, some of the categories we set to market prohibited. That is, when you call  v2.product.get_category (https://open.shopee.com/documents/v2/v2.product.get_category?module=89&type=1) API with a Malaysian shop, you can get category A, but through a Singapore shop, you can not get it.Policies for cross-border and domestic sales are also different, so category data will also vary. For different types of sellers, there are also small differences in the supported category data.
 
So, in order for you to get the most accurate category data, it is recommended to obtain it according to shop_id.
1.2 Category treev2.product.get_category (https://open.shopee.com/documents/v2/v2.product.get_category?module=89&type=1) API returns all available categories for the shop. 
parent_category_id=0, it means this is the first level category, otherwise, it will return the parent category id of this category.
has_children=false means the last level category, otherwise, it means that this category has children. Please note that only the category_id with has_children=false can be used to create or update products.
 
For example, if the category tree path is Level 1 category→Level 2 category→Level 3 category, the API return will be
 
 "category_list": [
      {
        "display_category_name": "Level 1 category",
        "has_children":true,
        "category_id": 105899,
        "original_category_name": "Level 1 category",
        "parent_category_id": 0
      },
      {
        "display_category_name": "Level 2 category",
        "has_children": true,
        "category_id":109889,
        "original_category_name": "Level 2 category",
        "parent_category_id":105899
      },
      {
        "display_category_name": "Level 3 category",
        "has_children":false,
        "category_id":107839,
        "original_category_name": "Level 3 category",
        "parent_category_id":109889
      }
 
]
​​
1.3 Recommend categoriesIn order to help sellers quickly find the category of the product, you can also call ​​​​​​​​v2.product.category_recommend (https://open.shopee.com/documents/v2/v2.product.category_recommend?module=89&type=1) API, API will return a list of recommended categories based on the product name and product image.
2. AttributeEach product category has different attribute data. The “v2.product.get_attribute_tree (https://open.shopee.com/documents/v2/v2.product.get_attribute_tree?module=89&type=1)” API will return the attribute data for the given “category_id”. However, please note that only last-level categories can retrieve attribute data. A last-level category is defined as one where the value of the “has_children” field under the “category_list” section returned via the “v2.product.get_category” API is false.
2.1 Required and optional AttributesWhen creating or updating products, all required attributes must be uploaded, while optional attributes can be provided based on your needs. In the “v2.product.get_attribute_tree (https://open.shopee.com/documents/v2/v2.product.get_attribute_tree?module=89&type=1)” API response, “is_mandatory”: true indicates a required attribute, and “is_mandatory”: false indicates an optional attribute.
2.2 Type of attributesWe classify attribute types based on factors such as whether the attribute value supports multiple selections, whether it allows custom input, and whether the attribute value is provided. You can check the “input_type” field in the “v2.product.get_attribute_tree (https://open.shopee.com/documents/v2/v2.product.get_attribute_tree?module=89&type=1)” API response for relevant information.
 
input_typeTypeDefinitionDescriptionCustom value is allowedAttribute values are provided1intSINGLE_DROP_DOWNSingle-select dropdown; Sellers can only choose one option from the list of attribute values (“attribute_value_list”) returned by the API to upload.NoYes2intSINGLE_COMBO_BOXSingle-select dropdown + text input field; Sellers can either choose one option from the list of attribute values (“attribute_value_list”) returned by the API to upload, or set a custom value.YesYes3intFREE_TEXT_FILEDText input field; Sellers can set a custom value.YesNo4intMULTI_DROP_DOWNMulti-select dropdown; Sellers can select multiple options from the list of attribute values (“attribute_value_list”) returned by the API to upload.NoYes5intMULTI_COMBO_BOXMulti-select dropdown + text input field; Sellers can select multiple options from the list of attribute values (“attribute_value_list”) returned by the API to upload, or set a custom value.YesYes 
*The following figure shows an example with “input_type”: 2 (SINGLE_COMBO_BOX). Sellers can select a value from the attribute list (Elliptical Trainers), or set a custom value by clicking the 'Add a new item' button and filling it in.
 
 
Please note:
- For product attributes that support multi-select dropdowns, you can get the maximum number of attribute values that can be uploaded through the “max_value_count” parameter.
- You can get the list of attribute values provided by Shopee for upload through the “attribute_value_list” parameter.
 
2.3 Data types of attribute valuesAttribute values have defined data types, and you need to upload the attribute values according to the required data type. You can obtain the data type of the attribute value through the “input_validation_type” field returned by the “v2.product.get_attribute_tree (https://open.shopee.com/documents/v2/v2.product.get_attribute_tree?module=89&type=1)” API.
 
input_validation_typeTypeDescriptionRemarks0intVALIDATOR_NO_VALIDATE_TYPE 1intVALIDATOR_INT_TYPE 2intVALIDATOR_STRING_TYPE 3intVALIDATOR_FLOAT_TYPE 4intVALIDATOR_DATE_TYPE, including two formats：
- DD/MM/YYYYY, e.g. 31/06/2021
- MM/YYYYY, e.g. 06/2021
When adding or editing a product, for attributes with a date data type, please enter the timestamp in Unix timestamp format. However, when retrieving detailed product attribute values, the “original_value_name” will return the value in a readable date format. 
Please note:
- For the date type attribute, there are two formats: one is MONTH/YEAR (06/2021) and the other is DAY/MONTH/YEAR (31/06/2021). You can check the “date_format_type” field in the “v2.product.get_attribute_tree (https://open.shopee.com/documents/v2/v2.product.get_attribute_tree?module=89&type=1)” API response for details.
- When creating or updating a product, you need to upload the attribute value as a Unix timestamp in the “original_value_name” field. However, when retrieving product information, the “original_value_name” field in the “v2.product.get_item_base_info” API response will return the date in a format such as 06/2021 or 31/06/2021.
2.4 Attribute value unitsFor example, for the length attribute, we provide sellers with options to choose units such as “cm” and “m”. Therefore, you need to first understand which attribute values require a unit and which units are available for these attribute values. You can call the ” v2.product.get_attribute_tree (https://open.shopee.com/documents/v2/v2.product.get_attribute_tree?module=89&type=1)” API to obtain this information.
 
When the returned parameter “format_type”: 2 (FORMAT_QUANTITATIVE_WITH_UNIT) is present, it means the attribute value requires a unit, and the” attribute_unit_list” parameter will return the available units for that attribute value. When the returned parameter “format_type”: 1 (FORMAT_NORMAL) is present, it means the attribute value does not require a unit.
 
*In the attribute value list provided by Shopee, we display the value and the unit separately. Specifically, the “name” field in the “attribute_value_list” will return the value of the attribute (i.e. 5kg), while the “value_unit” field will return the unit of the attribute value (i.e. kg).
 
 
2.5 Parent attribute and parent brand For example, for the “Weight Type” attribute, the available attribute values are “Body Weights” and “Barbells”. The “Body Weights Type” attribute is associated with the “Body Weights” value. Therefore, when the seller selects “Body Weights” for the “Weight Type” attribute, the “Body Weights Type” attribute will be displayed, and we recommend that the seller fill in the corresponding value.
 
*Selecting “Barbells” value does not show the Body Weights Type attribute
*Selecting “Body Weights” value displays the Body Weights Type attribute
”v2.product.get_attribute_tree” API partial response
{
    "attribute_id": 100643,
    "mandatory": false,
    "name": "Weight Type",
    "attribute_value_list": [
        {
            "value_id": 3300,
            "name": "Barbells",
            "multi_lang": [
                {
                    "language": "zh-Hant",
                    "value": "槓鈴"
                }
            ]
        },
        {
            "value_id": 3341,
            "name": "Body Weights",
            "child_attribute_list": [
                {
                    "attribute_id": 100602,
                    "mandatory": false,
                    "name": "Body Weights Type",
                    "attribute_value_list": [
                        {
                            "value_id": 3164,
                            "name": "Ankle",
                            "multi_lang": [
                                {
                                    "language": "zh-Hant",
                                    "value": "腳踝"
                                }
                            ]
                        }
                    ],
                    "attribute_info": {
                        "input_type": 5,
                        "input_validation_type": 2,
                        "format_type": 1,
                        "max_value_count": 5,
                        "is_oem": false,
                        "support_search_value": false
                    },
                    "multi_lang": [
                        {
                            "language": "zh-Hant",
                            "value": "重訓輔助配件類型"
                        }
                    ]
                }
            ],
            "multi_lang": [
                {
                    "language": "zh-Hant",
                    "value": "穿戴負重器材"
                }
            ]
        }
    ],
    "attribute_info": {
        "input_type": 2,
        "input_validation_type": 2,
        "format_type": 1,
        "is_oem": false,
        "support_search_value": false
    },
    "multi_lang": [
        {
            "language": "zh-Hant",
            "value": "重訓器材種類"
        }
    ]
} 
In this example, “Weight Type” is the parent attribute, and “Body Weights Type” is the child attribute. To upload the child attribute, you must also upload the associated parent attribute.
 
 
2.6 Recommend attributesTo help sellers quickly find the recommended attributes for the product, you can call ​​​​​​​​v2.product.get_recommend_attribute (https://open.shopee.com/documents/v2/v2.product.get_recommend_attribute?module=89&type=1) API, sellers can upload the product name and product image, the API will return a list of recommended attributes. Note that this API may not return the required attributes.
3. BrandYou can upload the brand information for the product, but we will require certain categories to fill in the brand information, and each category supports a different list of brands, so please call v2.product.get_brand_list (https://open.shopee.com/documents/v2/v2.product.get_brand_list?module=89&type=1) API to get the brand list data supported by a category (can only be requested with the last level category).
 
is_mandatory: true true means that this category must be filled with brand information.
 
* If the brand list provided by Shopee does not contain the brand you need, you can submit a registered brand application to Shopee, please call v2.product.register_brand (https://open.shopee.com/documents/v2/v2.product.register_brand?module=89&type=1) API and refer to FAQ (https://open.shopee.com/faq?top=162&sub=166&page=1&faq=211) for QC process.
 
*If your product does not have a registered brand, Shopee provides a list of brands, including No Brand option (brand_id: 0) , you can choose this option to upload. 
 
v2.product.get_brand_list (https://open.shopee.com/documents/v2/v2.product.get_brand_list?module=89&type=1) API 
status: 1 for the list of brands provided by Shopee, status: 2 the list of brands waiting for review after you submit your registration.
4. Days to ship We have shipping days requirements for different categories and different seller types, sellers need to fulfill orders within the shipping days, for specific categories, we support you to set the goods as pre-sale goods, shipping time will be longer. You can get the shipping days information through the v2.product.get_item_limit (https://open.shopee.com/documents/v2/v2.product.get_item_limit?module=89&type=1) API.
 
If days_to_ship_limit min_limit and max_limit return a value of -1, it means that the category does not support pre-sale, when the return value is greater than 0, this category can fill in the range of pre-sale days. If the category does not support pre-sales, The non_pre_order_days_to_ship parameter will return the shipping days set by Shopee for this category.
5. Size chartFor some categories,we support sellers uploading one size chart image for a product, you can use v2.product.support_size_chart (https://open.shopee.com/documents/v2/v2.product.support_size_chart?module=89&type=1) API to check whether the category (leaf category) supports size chart. 
 
*Please note that we are rolling out the size chart of table type, and now only some whitelisted sellers can add through the seller center, open api does not support returning the categories that support the table size chart and uploading. So whitelisted sellers please ignore the results from the v2.product.support_size_chart (https://open.shopee.com/documents/v2/v2.product.support_size_chart?module=89&type=1) API.
6. Product restrictionsWe have certain restrictions on product information, such as the length of characters that can be filled in the product name, the range of product price, etc. We have different restrictions for different markets and different types of sellers. You can get the limits we set through v2.product.get_item_limit (https://open.shopee.com/documents/v2/v2.product.get_item_limit?module=89&type=1) API.
7. Product logisticsYou can get the logistics_channel_id through v2.logistics.get_channel_list (https://open.shopee.com/documents/v2/v2.logistics.get_channel_list?module=95&type=1) API, you can only choose the channel with enabled=true and mask_channel_id=0 for product.

## Content (raw HTML)

```html
<p>Before creating a product, you need to get the category, attributes, brand,days to ship, whether the category supports size chart and other information through API to get prepared for creating products.</p><h1>1. Category</h1><p>Each product must have a unique category, please get Shopee category data by <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.get_category?module=89&amp;type=1"><u>v2.product.get_category</u></a> API. Each node's category has a unique category_id.</p><h2>1.1 Global category data</h2><p>Shopee's category tree data applies to all markets, but according to the local policies of the market, some of the categories we set to market prohibited. That is, when you call&nbsp; <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.get_category?module=89&amp;type=1"><u>v2.product.get_category</u></a> API with a Malaysian shop, you can get category A, but through a Singapore shop, you can not get it.Policies for cross-border and domestic sales are also different, so category data will also vary. For different types of sellers, there are also small differences in the supported category data.</p><p>&nbsp;</p><p>So, in order for you to get the most accurate category data, it is recommended to obtain it according to shop_id.</p><h2>1.2 Category tree</h2><p><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.get_category?module=89&amp;type=1"><u>v2.product.get_category</u></a> API returns all available categories for the shop.&nbsp;</p><p><strong>parent_category_id</strong>=0, it means this is the first level category, otherwise, it will return the parent category id of this category.</p><p><strong>has_children</strong>=false means the last level category, otherwise, it means that this category has children. Please note that only the category_id with <strong>has_children</strong>=false can be used to create or update products.</p><p>&nbsp;</p><p>For example, if the category tree path is Level 1 category→Level 2 category→Level 3 category, the API return will be</p><p>&nbsp;</p><p><span style="background-color:rgb(255,255,255);">&nbsp;"category_list": [</span></p><p><span style="background-color:rgb(255,255,255);">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{</span></p><p><span style="background-color:rgb(255,255,255);">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"display_category_name": "Level 1 category",</span></p><p><span style="background-color:rgb(255,255,255);">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"has_children":true,</span></p><p><span style="background-color:rgb(255,255,255);">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"category_id": 105899,</span></p><p><span style="background-color:rgb(255,255,255);">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"original_category_name": "Level 1 category",</span></p><p><span style="background-color:rgb(255,255,255);">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"parent_category_id": 0</span></p><p><span style="background-color:rgb(255,255,255);">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},</span></p><p><span style="background-color:rgb(255,255,255);">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{</span></p><p><span style="background-color:rgb(255,255,255);">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"display_category_name": "Level 2 category",</span></p><p><span style="background-color:rgb(255,255,255);">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"has_children": true,</span></p><p><span style="background-color:rgb(255,255,255);">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"category_id":109889,</span></p><p><span style="background-color:rgb(255,255,255);">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"original_category_name": "Level 2 category",</span></p><p><span style="background-color:rgb(255,255,255);">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"parent_category_id":105899</span></p><p><span style="background-color:rgb(255,255,255);">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},</span></p><p><span style="background-color:rgb(255,255,255);">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{</span></p><p><span style="background-color:rgb(255,255,255);">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"display_category_name": "Level 3 category",</span></p><p><span style="background-color:rgb(255,255,255);">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"has_children":false,</span></p><p><span style="background-color:rgb(255,255,255);">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"category_id":107839,</span></p><p><span style="background-color:rgb(255,255,255);">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"original_category_name": "Level 3 category",</span></p><p><span style="background-color:rgb(255,255,255);">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"parent_category_id":109889</span></p><p><span style="background-color:rgb(255,255,255);">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}</span></p><p>&nbsp;</p><p><span style="background-color:rgb(255,255,255);">]</span></p><p>​​</p><h2>1.3 Recommend categories</h2><p>In order to help sellers quickly find the category of the product, you can also call ​​​​​​​​<a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.category_recommend?module=89&amp;type=1"><u>v2.product.category_recommend</u></a> API, API will return a list of recommended categories based on the product name and product image.</p><h1>2. Attribute</h1><p><span style="color:rgb(43,44,45);">Each product category has different attribute data. The “</span><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.get_attribute_tree?module=89&amp;type=1"><u>v2.product.get_attribute_tree</u></a><span style="color:rgb(43,44,45);">” API will return the attribute data for the given “category_id”. However, please note that only last-level categories can retrieve attribute data. A last-level category is defined as one where the value of the “has_children” field under the “category_list” section returned via the “v2.product.get_category” API is false.</span></p><h2>2.1 Required and optional Attributes</h2><p><span style="color:rgb(43,44,45);">When creating or updating products, all required attributes must be uploaded, while optional attributes can be provided based on your needs. In the “</span><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.get_attribute_tree?module=89&amp;type=1"><u>v2.product.get_attribute_tree</u></a><span style="color:rgb(43,44,45);">” API response, “is_mandatory”: true indicates a required attribute, and “is_mandatory”: false indicates an optional attribute.</span></p><h2>2.2 Type of attributes</h2><p><span style="color:rgb(43,44,45);">We classify attribute types based on factors such as whether the attribute value supports multiple selections, whether it allows custom input, and whether the attribute value is provided. You can check the “input_type” field in the “</span><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.get_attribute_tree?module=89&amp;type=1"><u>v2.product.get_attribute_tree</u></a><span style="color:rgb(43,44,45);">” API response for relevant information.</span></p><p>&nbsp;</p><figure class="table"><table><tbody><tr><td>input_type</td><td>Type</td><td>Definition</td><td>Description</td><td>Custom value is allowed</td><td>Attribute values are provided</td></tr><tr><td>1</td><td>int</td><td>SINGLE_DROP_DOWN</td><td>Single-select dropdown; Sellers can only choose one option from the list of attribute values (“attribute_value_list”) returned by the API to upload.</td><td>No</td><td>Yes</td></tr><tr><td>2</td><td>int</td><td>SINGLE_COMBO_BOX</td><td>Single-select dropdown + text input field; Sellers can either choose one option from the list of attribute values (“attribute_value_list”) returned by the API to upload, or set a custom value.</td><td>Yes</td><td>Yes</td></tr><tr><td>3</td><td>int</td><td>FREE_TEXT_FILED</td><td>Text input field; Sellers can set a custom value.</td><td>Yes</td><td>No</td></tr><tr><td>4</td><td>int</td><td>MULTI_DROP_DOWN</td><td>Multi-select dropdown; Sellers can select multiple options from the list of attribute values (“attribute_value_list”) returned by the API to upload.</td><td>No</td><td>Yes</td></tr><tr><td>5</td><td>int</td><td>MULTI_COMBO_BOX</td><td>Multi-select dropdown + text input field; Sellers can select multiple options from the list of attribute values (“attribute_value_list”) returned by the API to upload, or set a custom value.</td><td>Yes</td><td>Yes</td></tr></tbody></table></figure><p>&nbsp;</p><p><span style="background-color:rgb(255,255,255);color:rgb(43,44,45);">*The following figure shows an example with “input_type”: 2 (SINGLE_COMBO_BOX). Sellers can select a value from the attribute list (Elliptical Trainers), or set a custom value by clicking the 'Add a new item' button and filling it in.</span></p><p>&nbsp;</p><figure class="image image_resized" style="width:624px;"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=fRwCwghzuvErysDyVPBF2ekbN12lbJrXL15qMKgrWbSiwZq6ZTGwaxbUJZI6QdU%2Fac%2Fc%2BpJxBDqZIJdo03fSeA%3D%3D&amp;image_type=png"></figure><p>&nbsp;</p><figure class="image image_resized" style="width:624px;"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=gHzROWZC734oayOGwYWIEEJ4aOfLKJ9Ot4vs2%2Fq7W6ebnpH8B%2B8l8ulTy0D%2BjHXcVys8w2r%2FiVecwMDBjG12Og%3D%3D&amp;image_type=png"></figure><p><span style="background-color:rgb(255,255,255);color:rgb(43,44,45);">Please note:</span></p><ul><li><span style="background-color:rgb(255,255,255);color:rgb(43,44,45);">For product attributes that support multi-select dropdowns, you can get the maximum number of attribute values that can be uploaded through the “max_value_count” parameter.</span></li><li><span style="background-color:rgb(255,255,255);color:rgb(43,44,45);">You can get the list of attribute values provided by Shopee for upload through the “attribute_value_list” parameter.</span></li></ul><p>&nbsp;</p><h2>2.3 Data types of attribute values</h2><p><span style="background-color:rgb(255,255,255);color:rgb(43,44,45);">Attribute values have defined data types, and you need to upload the attribute values according to the required data type. You can obtain the data type of the attribute value through the “input_validation_type” field returned by the “</span><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.get_attribute_tree?module=89&amp;type=1"><span style="background-color:rgb(255,255,255);"><u>v2.product.get_attribute_tree</u></span></a><span style="background-color:rgb(255,255,255);color:rgb(43,44,45);">” API.</span></p><p>&nbsp;</p><figure class="table"><table><tbody><tr><td><span style="color:rgb(43,44,45);">input_validation_type</span></td><td><span style="color:rgb(43,44,45);">Type</span></td><td><span style="color:rgb(43,44,45);">Description</span></td><td><span style="color:rgb(43,44,45);">Remarks</span></td></tr><tr><td><span style="color:rgb(43,44,45);">0</span></td><td><span style="color:rgb(43,44,45);">int</span></td><td><span style="color:rgb(43,44,45);">VALIDATOR_NO_VALIDATE_TYPE</span></td><td>&nbsp;</td></tr><tr><td><span style="color:rgb(43,44,45);">1</span></td><td><span style="color:rgb(43,44,45);">int</span></td><td><span style="color:rgb(43,44,45);">VALIDATOR_INT_TYPE</span></td><td>&nbsp;</td></tr><tr><td><span style="color:rgb(43,44,45);">2</span></td><td><span style="color:rgb(43,44,45);">int</span></td><td><span style="color:rgb(43,44,45);">VALIDATOR_STRING_TYPE</span></td><td>&nbsp;</td></tr><tr><td><span style="color:rgb(43,44,45);">3</span></td><td><span style="color:rgb(43,44,45);">int</span></td><td><span style="color:rgb(43,44,45);">VALIDATOR_FLOAT_TYPE</span></td><td>&nbsp;</td></tr><tr><td><span style="color:rgb(43,44,45);">4</span></td><td><span style="color:rgb(43,44,45);">int</span></td><td><p><span style="color:rgb(43,44,45);">VALIDATOR_DATE_TYPE, including two formats：</span></p><ul><li><span style="color:rgb(43,44,45);">DD/MM/YYYYY, e.g. 31/06/2021</span></li><li><span style="color:rgb(43,44,45);">MM/YYYYY, e.g. 06/2021</span></li></ul></td><td><span style="color:rgb(43,44,45);">When adding or editing a product, for attributes with a date data type, please enter the timestamp in Unix timestamp format. However, when retrieving detailed product attribute values, the “original_value_name” will return the value in a readable date format.</span></td></tr></tbody></table></figure><p>&nbsp;</p><p><span style="background-color:rgb(255,255,255);color:rgb(43,44,45);">Please note:</span></p><ul><li><span style="background-color:rgb(255,255,255);color:rgb(43,44,45);">For the date type attribute, there are two formats: one is MONTH/YEAR (06/2021) and the other is DAY/MONTH/YEAR (31/06/2021). You can check the “date_format_type” field in the “</span><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.get_attribute_tree?module=89&amp;type=1"><span style="background-color:rgb(255,255,255);"><u>v2.product.get_attribute_tree</u></span></a><span style="background-color:rgb(255,255,255);color:rgb(43,44,45);">” API response for details.</span></li><li><span style="background-color:rgb(255,255,255);color:rgb(43,44,45);">When creating or updating a product, you need to upload the attribute value as a Unix timestamp in the “original_value_name” field. However, when retrieving product information, the “original_value_name” field in the “v2.product.get_item_base_info” API response will return the date in a format such as 06/2021 or 31/06/2021.</span></li></ul><h2>2.4 Attribute value units</h2><p><span style="background-color:rgb(255,255,255);color:rgb(43,44,45);">For example, for the length attribute, we provide sellers with options to choose units such as “cm” and “m”. Therefore, you need to first understand which attribute values require a unit and which units are available for these attribute values. You can call the ” </span><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.get_attribute_tree?module=89&amp;type=1"><span style="background-color:rgb(255,255,255);"><u>v2.product.get_attribute_tree</u></span></a><span style="background-color:rgb(255,255,255);color:rgb(43,44,45);">” API to obtain this information.</span></p><p>&nbsp;</p><p><span style="background-color:rgb(255,255,255);color:rgb(43,44,45);">When the returned parameter “format_type”: 2 (FORMAT_QUANTITATIVE_WITH_UNIT) is present, it means the attribute value requires a unit, and the” attribute_unit_list” parameter will return the available units for that attribute value. When the returned parameter “format_type”: 1 (FORMAT_NORMAL) is present, it means the attribute value does not require a unit.</span></p><p>&nbsp;</p><p><span style="background-color:rgb(255,255,255);color:rgb(43,44,45);">*In the attribute value list provided by Shopee, we display the value and the unit separately. Specifically, the “name” field in the “attribute_value_list” will return the value of the attribute (i.e. 5kg), while the “value_unit” field will return the unit of the attribute value (i.e. kg).</span></p><p>&nbsp;</p><p>&nbsp;</p><h2>2.5 Parent attribute and parent brand&nbsp;</h2><p><span style="background-color:rgb(255,255,255);color:rgb(43,44,45);">For example, for the “Weight Type” attribute, the available attribute values are “Body Weights” and “Barbells”. The “Body Weights Type” attribute is associated with the “Body Weights” value. Therefore, when the seller selects “Body Weights” for the “Weight Type” attribute, the “Body Weights Type” attribute will be displayed, and we recommend that the seller fill in the corresponding value.</span></p><p>&nbsp;</p><p><i>*Selecting “Barbells” value does not show the Body Weights Type attribute</i></p><figure class="image image_resized" style="width:624px;"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=hmDs%2Fh2CSentvXEC9ZHnwxO9KKB1rT2MnXME5uEp68EnKwcypJjEmyTWTM1l%2B1F9yJU1ifPB%2FFMQI2fOqINacw%3D%3D&amp;image_type=png"></figure><p><i>*Selecting “Body Weights” value displays the Body Weights Type attribute</i></p><figure class="image image_resized" style="width:624px;"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=K4udxonCC%2FcKdl%2BCL2DocRZMT8HAdwWp%2BOLWTsvEYWDbwP8xl0uS2Hl2Y8ZnqYciisl%2B14pwZOXTgK6WM3v1UA%3D%3D&amp;image_type=png"></figure><p><span style="background-color:rgb(255,255,255);color:rgb(43,44,45);">”v2.product.get_attribute_tree”<i> API partial response</i></span></p><pre><code class="json hljs">{
 &nbsp;&nbsp; "attribute_id": 100643,
 &nbsp;&nbsp; "mandatory": false,
 &nbsp;&nbsp; "name": "Weight Type",
 &nbsp;&nbsp; "attribute_value_list": [
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "value_id": 3300,
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "name": "Barbells",
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "multi_lang": [
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "language": "zh-Hant",
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "value": "槓鈴"
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "value_id": 3341,
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "name": "Body Weights",
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "child_attribute_list": [
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "attribute_id": 100602,
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "mandatory": false,
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "name": "Body Weights Type",
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "attribute_value_list": [
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "value_id": 3164,
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "name": "Ankle",
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "multi_lang": [
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "language": "zh-Hant",
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "value": "腳踝"
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;],
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "attribute_info": {
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "input_type": 5,
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "input_validation_type": 2,
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "format_type": 1,
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "max_value_count": 5,
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "is_oem": false,
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "support_search_value": false
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "multi_lang": [
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "language": "zh-Hant",
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "value": "重訓輔助配件類型"
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;],
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "multi_lang": [
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "language": "zh-Hant",
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "value": "穿戴負重器材"
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}
 &nbsp;&nbsp;&nbsp;],
 &nbsp;&nbsp; "attribute_info": {
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "input_type": 2,
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "input_validation_type": 2,
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "format_type": 1,
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "is_oem": false,
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "support_search_value": false
 &nbsp;&nbsp;&nbsp;},
 &nbsp;&nbsp; "multi_lang": [
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "language": "zh-Hant",
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "value": "重訓器材種類"
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}
 &nbsp;&nbsp;&nbsp;]
}</code></pre><p>&nbsp;</p><p><span style="background-color:rgb(255,255,255);color:rgb(43,44,45);"><i>In this example, “Weight Type” is the parent attribute, and “Body Weights Type” is the child attribute. To upload the child attribute, you must also upload the associated parent attribute.</i></span></p><p>&nbsp;</p><p>&nbsp;</p><h2>2.6 Recommend attributes</h2><p>To help sellers quickly find the recommended attributes for the product, you can call ​​​​​​​​<a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.get_recommend_attribute?module=89&amp;type=1"><u>v2.product.get_recommend_attribute</u></a> API, sellers can upload the product name and product image, the API will return a list of recommended attributes. Note that this API may not return the required attributes.</p><h1>3. Brand</h1><p>You can upload the brand information for the product, but we will require certain categories to fill in the brand information, and each category supports a different list of brands, so please call <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.get_brand_list?module=89&amp;type=1"><u>v2.product.get_brand_list</u></a> API to get the brand list data supported by a category (can only be requested with the last level category).</p><p>&nbsp;</p><p><strong>is_mandatory</strong>: true true means that this category must be filled with brand information.</p><p>&nbsp;</p><p>* If the brand list provided by Shopee does not contain the brand you need, you can submit a registered brand application to Shopee, please call <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.register_brand?module=89&amp;type=1"><u>v2.product.register_brand</u></a> API and refer to <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/faq?top=162&amp;sub=166&amp;page=1&amp;faq=211"><u>FAQ</u></a> for QC process.</p><p>&nbsp;</p><p>*If your product does not have a registered brand, Shopee provides a list of brands, including No Brand option (brand_id: 0) , you can choose this option to upload.&nbsp;</p><p>&nbsp;</p><p><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.get_brand_list?module=89&amp;type=1"><u>v2.product.get_brand_list</u></a> API&nbsp;</p><p>status: 1 for the list of brands provided by Shopee, status: 2 the list of brands waiting for review after you submit your registration.</p><h1>4. Days to ship&nbsp;</h1><p>We have shipping days requirements for different categories and different seller types, sellers need to fulfill orders within the shipping days, for specific categories, we support you to set the goods as pre-sale goods, shipping time will be longer. You can get the shipping days information through the <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.get_item_limit?module=89&amp;type=1"><u>v2.product.get_item_limit</u></a> API.</p><p>&nbsp;</p><p>If days_to_ship_limit min_limit and max_limit return a value of -1, it means that the category does not support pre-sale, when the return value is greater than 0, this category can fill in the range of pre-sale days. If the category does not support pre-sales, The non_pre_order_days_to_ship parameter will return the shipping days set by Shopee for this category.</p><h1>5. Size chart</h1><p>For some categories,we support sellers uploading one size chart image for a product, you can use <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.support_size_chart?module=89&amp;type=1"><u>v2.product.support_size_chart</u></a> API to check whether the category (leaf category) supports size chart.&nbsp;</p><p>&nbsp;</p><p>*Please note that we are rolling out the size chart of table type, and now only some whitelisted sellers can add through the seller center, open api does not support returning the categories that support the table size chart and uploading. So whitelisted sellers please ignore the results from the <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.support_size_chart?module=89&amp;type=1"><u>v2.product.support_size_chart</u></a> API.</p><h1>6. Product restrictions</h1><p>We have certain restrictions on product information, such as the length of characters that can be filled in the product name, the range of product price, etc. We have different restrictions for different markets and different types of sellers. You can get the limits we set through <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.get_item_limit?module=89&amp;type=1"><u>v2.product.get_item_limit</u></a> API.</p><h1>7. Product logistics</h1><p>You can get the logistics_channel_id through <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.logistics.get_channel_list?module=95&amp;type=1"><u>v2.logistics.get_channel_list</u></a> API, you can only choose the channel with<strong> enabled=true and mask_channel_id=0 </strong>for product.</p><p>&nbsp;</p>
```
