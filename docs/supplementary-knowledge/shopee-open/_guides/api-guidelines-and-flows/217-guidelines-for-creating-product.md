# Guidelines for Creating Product

> **Source:** [https://open.shopee.com/developer-guide/217](https://open.shopee.com/developer-guide/217)
> **Type:** Developer Guide / Overview
> **document_id:** `217`
> **Section:** API Guidelines and Flows

## Content

1) We recommend cross-border sellers who have upgraded CNSC/KRSC to read the following articles to create products:
- Product creation preparation (https://open.shopee.com/developer-guide/209)
- Creating global product (https://open.shopee.com/developer-guide/213)
- Publish global product (https://open.shopee.com/developer-guide/215)
2）For other types of sellers, we recommend reading the following articles:
- Product creation preparation (https://open.shopee.com/developer-guide/209)
- Create product (https://open.shopee.com/developer-guide/211)
API call flow overview*Solid line is required process, dashed line is not required process
1. Creating Product2. Creating global product3. Publishing global product 
 
 
 
Data DefinitionAttribute value data type (input_validation_type)
- INT_TYPE
- STRING_TYPE
- ENUM_TYPE
- FLOAT_TYPE
- TIMESTAMP_TYPE 
- DATE_TYPE 
Attribute input type (input_type)
- DROP_DOWN
- TEXT_FILED
- COMBO_BOX
- MULTIPLE_SELECT
- ﻿MULTIPLE_SELECT_COMBO_BOX
Logistics type (fee_type)
- SIZE_SELECTION
- SIZE_INPUT
- FIXED_DEFAULT_PRICE
- CUSTOM_PRICE
Item status type (item_status)
- NORMAL
- DELETED
- BANNED
- UNLIST
Translation language (language)
- zh-hans：Simplified Chinese
- zh-hant: Traditional Chinese
- ms-my：Malay
- en-my: English (Malaysia)
- en: English
- id: Indonesian
- vi: Vietnamese
- th: Thai
- pt-br: Portuguese
- es-mx: Spanish (Mexican)
- pl: Polish
- es-CO: Spanish (Colombia)
- es-CL: Spanish (Chile)
Stock type (stock_type)
- 1: Shopee Warehouse stock
- 2: Seller stock
Product promotion type (promotion_type)
- Campaign
- Discount Promotions
- Flash Sale
- Whole Sale
- Group Buy
- Bundle Deal
- Welcome Package
- Add-on Discount
- Brand Sale
- In ShopFlash Sale
- Gift with purchase
- ﻿Exclusive Price
Market Code- SG: Singapore
- MY: Malaysia
- TW: Taiwan
- ID: Indonesia
- VN: Vietnam
- TH: Thailand
- BR: Brazil
- PH: Philippines
- MX: Mexico
- CO: Colombia
- CL: Chile
- PL: Poland

## Content (raw HTML)

```html
<p>1) We recommend cross-border sellers who have upgraded CNSC/KRSC to read the following articles to create products:</p><ul><li><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/developer-guide/209"><u>Product creation preparation</u></a></li><li><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/developer-guide/213"><u>Creating global product</u></a></li><li><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/developer-guide/215"><u>Publish global product</u></a></li></ul><p>2）For other types of sellers, we recommend reading the following articles:</p><ul><li><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/developer-guide/209"><u>Product creation preparation</u></a></li><li><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/developer-guide/211"><u>Create product</u></a></li></ul><h1>API call flow overview</h1><p><i>*Solid line is required process, dashed line is not required process</i></p><h2>1. Creating Product</h2><figure class="image"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=h6oVTrljpWY5S0tzciqOnG9YqfQGBKY0kK2R7CZfSaYxi3MuWqsNzSN%2BPL50gXxhG1ImXimQ2aQtAhsB2uRKEA%3D%3D&amp;image_type=png"></figure><h2>2. Creating global product</h2><figure class="image"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=Gu3z%2FttxxOY0eNPh7vBiitjykBI5B9m4U%2FJjIQu1hZGBw%2FSLdo2rBIjGjIgRnHUYaizhVXpQd7iTSbqmKX6dIw%3D%3D&amp;image_type=png"></figure><h2>3. Publishing global product</h2><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><figure class="image"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=canaYd%2FLXy8qTVaTeWvYhivWE4ZMNJtKdBdYo0dtqMLMRjGozjA9Zb3KWiKAkWccuhYqnfzgxeLv1KWH2tPxHw%3D%3D&amp;image_type=png"></figure><h1>Data Definition</h1><h1>Attribute value data type&nbsp;</h1><p>(input_validation_type)</p><ul><li>INT_TYPE</li><li>STRING_TYPE</li><li>ENUM_TYPE</li><li>FLOAT_TYPE</li><li>TIMESTAMP_TYPE&nbsp;</li><li>DATE_TYPE&nbsp;</li></ul><h2>Attribute input type&nbsp;</h2><p>(input_type)</p><ul><li>DROP_DOWN</li><li>TEXT_FILED</li><li>COMBO_BOX</li><li>MULTIPLE_SELECT</li><li>﻿MULTIPLE_SELECT_COMBO_BOX</li></ul><h2>Logistics type&nbsp;</h2><p>(fee_type)</p><ul><li>SIZE_SELECTION</li><li>SIZE_INPUT</li><li>FIXED_DEFAULT_PRICE</li><li>CUSTOM_PRICE</li></ul><h2>Item status type</h2><p>&nbsp;(item_status)</p><ul><li>NORMAL</li><li>DELETED</li><li>BANNED</li><li>UNLIST</li></ul><h2>Translation language&nbsp;</h2><p>(language)</p><ul><li>zh-hans：Simplified Chinese</li><li>zh-hant: Traditional Chinese</li><li>ms-my：Malay</li><li>en-my: English (Malaysia)</li><li>en: English</li><li>id: Indonesian</li><li>vi: Vietnamese</li><li>th: Thai</li><li>pt-br: Portuguese</li><li>es-mx: Spanish (Mexican)</li><li>pl: Polish</li><li>es-CO: Spanish (Colombia)</li><li>es-CL: Spanish (Chile)</li></ul><h2>Stock type&nbsp;</h2><p>(stock_type)</p><ul><li>1: Shopee Warehouse stock</li><li>2: Seller stock</li></ul><h2>Product promotion type</h2><p>&nbsp;(promotion_type)</p><ul><li>Campaign</li><li>Discount Promotions</li><li>Flash Sale</li><li>Whole Sale</li><li>Group Buy</li><li>Bundle Deal</li><li>Welcome Package</li><li>Add-on Discount</li><li>Brand Sale</li><li>In ShopFlash Sale</li><li>Gift with purchase</li><li>﻿Exclusive Price</li></ul><h2>Market Code</h2><ul><li>SG: Singapore</li><li>MY: Malaysia</li><li>TW: Taiwan</li><li>ID: Indonesia</li><li>VN: Vietnam</li><li>TH: Thailand</li><li>BR: Brazil</li><li>PH: Philippines</li><li>MX: Mexico</li><li>CO: Colombia</li><li>CL: Chile</li><li>PL: Poland</li></ul>
```
