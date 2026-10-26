# API calls

> **Source:** [https://open.shopee.com/developer-guide/16](https://open.shopee.com/developer-guide/16)
> **Type:** Developer Guide / Overview
> **document_id:** `16`
> **Section:** Getting Started

## Content

⚠️ Note: This guide only applies to making API calls for Shopee Open API v2.0.
API domains 
There are 3 domains available: 
- Production environment - https://openplatform.shopee.cn/ (https://openplatform.shopee.cn/)   — for developers who deployed their services near Chinese Mainland.
- https://openplatform.shopee.com.br/ (https://openplatform.shopee.com.br/) — for developer  who deployed their services near US.
- https://partner.shopeemobile.com/ (https://partner.shopeemobile.com/)  — for developer who deployed their services near SG.

- Sandbox environment- https://openplatform.sandbox.test-stable.shopee.sg/ (https://openplatform.sandbox.test-stable.shopee.sg) — for All developers
- https://openplatform.sandbox.test-stable.shopee.cn/ (https://openplatform.sandbox.test-stable.shopee.cn/)  —for Chinese Mainland developers

 
Select the correct domain name, based on the server location you’re accessing the Open API from.
API request methods 
Currently, Open API only provides two request methods: GET and POST.
 
API ProtocolHTTP/JSON for most APIs. HTTP/FORM for some certain APIs, for example, the API for uploading files.
 
API request parameters 
In the API document, you will see two types of request parameters:
- Common parameter
- Request parameter
 
For GET-type APIs, these two parameters may exist at the same time, or only the common parameter will exist. 
 
For POST-type APIs, these two parameters will exist at the same time.
 
 
The table below consists of descriptions for common parameters: 
Parameters                      Description                                                                                                                                                                                                                       partner_idAll API calls require a partner ID. You can obtain a partner ID by creating an App on the Shopee Open Platform Console App list page (https://open.shopee.com/myconsole/management/app?from=header). Test partner ID can only be used in the test environment, and Live partner ID can only be used in the production environment.timestampAll API calls require timestamps (https://www.computerhope.com/jargon/t/timestam.htm). 
Example of a timestamp: 1610000000. 
Each API request needs to be requested within 5 minutes of a timestamp.
signAll API calls require signatures that are generated using the SHA256 algorithm. Different API types have different signature generation methods. For more details, please refer to the Signature Calculation section in this article.access_token                        Access tokens are required to obtain and modify seller data-related APIs. Each access token is valid for 4 hours and can be reused within the validity period. The access token needs to be refreshed regularly. Refer to the Authorization and Authentication (https://open.shopee.com/developer-guide/20) article to learn more about obtaining and refreshing access tokens.shop_idThe unique identification ID of a Shopee shop can be obtained after the shop has granted authorization. Refer to the Authorization and Authentication (https://open.shopee.com/developer-guide/20) article on how to obtain your shop ID.merchant_idThe unique identification ID of a Shopee merchant, which can be obtained after a shop has granted authorization. Open API only supports cross-border sellers using a merchant ID. Refer to the Authorization and Authentication (https://open.shopee.com/developer-guide/20) article on how to acquire your merchant ID. Types of Open API 
In the API document, there are 3 API types due to the different common parameters. The public parameters contained in these 3 types are as follows:
- Shop API: partner_id, timestamp, sign, access_token, shop_id
- Merchant API: partner_id, timestamp, sign, access_token, merchant_id
- Public API: partner_id, timestamp, sign
 
⚠️ Note: Red items are highlighted to indicate that they are different from Public API.
 
The Public API does not require an access token, while both the Shop and Merchant APIs do. 
This means that Shop and Merchant APIs can be called only after the shop has granted authorization.
 
Currently, only Shopee cross-border merchants need to use Merchant API. Local sellers do not need to use it.
Signature calculation 
Step 1: Create a base string:
Different types of APIs contain different elements in its base string. Concatenate the API path (without host) and the following common parameters into a single string. You should strictly follow the sequence (base string) as shown below: 
 
*API path example：/api/v2/auth/token/get
 
Shop API: partner_id, api path, timestamp, access_token, shop_id
*Example：
partner_id: 2001887
API path: /api/v2/shop/get_shop_info
timestamp: 1655714431
access_token: 59777174636562737266615546704c6d
shop id: 14701711
 
Base string=2001887/api/v2/shop/get_shop_info165571443159777174636562737266615546704c6d14701711
 
Merchant API: partner_id, api path, timestamp, access_token, merchant_id
*Example:
partner_id: 2001887
API path: /api/v2/global_product/get_category
timestamp: 1655714431
access_token: 09777174636962737266615546704c6d
merchant_id: 1000000
 
Base string=2001887/api/v2/global_product/get_category165571443109777174636962737266615546704c6d1000000
 
Public API: partner_id, api path, timestamp
*Example:
partner_id:2001887
API path: /api/v2/public/get_shops_by_partner
timestamp:1655714431
 
Base string=2001887/api/v2/public/get_shops_by_partner1655714431
 
Step 2: Calculate the signature using the HMAC-SHA256 algorithm
Calculate the signature by using the HMAC-SHA256 hashing algorithm on the base string and partner Key (obtained through the Shopee Open Platform Console App detail page (https://open.shopee.com/myconsole/management/app?from=header)). The output of the hash function is a hex-encoded string.
 
*Example：
sign=56f31d01aeda9d08bf456b37f6f6640ef8614b4d6ad49baafe30b39a061f0e26
 
Find out why you may encounter the “Wrong sign” error (https://open.shopee.com/faq?top=162&sub=166&page=1&faq=188) and how you can resolve the issue.
 
Sample of Code:
#!/usr/bin/envpython

# encoding:utf-8

import hmac 

import time

import requests

import hashlib

timest=int(time.time())

host="https://partner.shopeemobile.com 

access_token = "random string"

partner id =80001

partner key = "test....."

#### call shop level api 

shop id =209920

base string ="%s%s%s%s%s"%(partner id, path timest access token, shop id) 

sign = hmac.new( partner key,base string,hashlib.sha256)hexdigest() 

path ="/api/v2/example/shop level/get"

url = host + path + "?partner_id=%s&shop_id=%s&timestamp=%s&access_token=%s&sign=%s"%(partner_id, shop_id, timest, access_token, sign) 

headers={"Content-Type":"application/ison"? 

resp=requests.post(urlheaders=headers)

#### call merchant level api 

merchant id =1234567

base string ="%s%s%s%s%s"%(partner id, path timest, access token, merchant id) 

sign =hmac.new( partner key,base string,hashlib.sha256).hexdigest() 

path ="/api/v2/example/merchant_level/get"

url = host+ path +"?partner id=%s&merchant id=%s&timestamp=%s&access token=%s&sign=%s"%(partnerid, merchant id, timest, access token, sign) 

headers ={"Content-Type":"application/ison"? resp =requests.eet(urlheaders=headers)

#### call public api

base string ="%s%s%5%s"%(partner idpathtimestaccess token)

sign= hmac.new( partner keybase stringhashlib.sha256)hexdigest() 

path ="/api/v2/auth merchant/access token/get"

url = host+path+"?partner id=%s&timestamp=%s&sign=%s%(partner idtimest, sign)

body ={"partner id":partner id, "merchant id": merchant id,"refresh token":"testingtoken") 

headers =["Content-Type":"application/ison"?

resp =requests.post(url,json=bodyheaders=headers)API request sample 
For GET-type API requests, you need to put both the common parameters and request parameters in the URL. 
 
For example: V2.product.get_category (https://open.shopee.com/documents/v2/v2.product.get_category?module=89&type=1) 
 
API request URL:
https://partner.shopeemobile.com/api/v2/product/get_category?partner_id=851249&timestamp=1654673582&shop_id=1001094&access_token=367a0a8eb9d1837cbf7c43b587a0faa4&sign=a40fc50a08c382eeee08e2eb00deb8464c6fdcbe4f1c271e033cdbca3ded4d5b&language=zh-hans
 
*For this API endpoint，partner_id、timestamp、access_token、shop_id and sign are common parameters. Meanwhile, language is a request parameter.
 
 
For POST-type API requests, you need to insert common parameters in the request URL and request parameters in the request body. 
 
For example:v2.shop.update_profile (https://open.shopee.com/documents/v2/v2.shop.update_profile?module=92&type=1) 
 
API request URL:
https://partner.shopeemobile.com/api/v2/shop/update_profile?partner_id=851249&timestamp=1654673582&shop_id=1001094&access_token=367a0a8eb9d1837cbf7c43b587a0faa4&sign=80cbce8da907d5a1237711409920fc16908a9f9e01b1254ff9cc44aaf0836122
 
Request body:
{
"shop_logo": "https://cf.shopee.sg/file/8424390be4677b0b3c37ce6499ce261a",
"description": "TTest",
"shop_name": "123"
}
 
*For this API endpoint，partner_id、timestamp、access_token、shop_id、and sign are common parameters. Meanwhile, shop_logo、description and shop_name are request parameters.
API response parametersParameters     Must return？Descriptionrequest idYesEach API request has a unique request ID. When you encounter an API issue, please provide this ID and the corresponding API information to get a faster response.errorYesError code. 
When the request is successful, the error parameter will return empty. 
If the request fails, the corresponding error code will be reflected in this field.
messageNoError message. 
When the request is successful, the message will return empty. 
If the request fails, this field will contain detailed information about the error.
warningNoIf the API call is successful, but some data is not returned or some batch requests fail, the information will be reflected in this field.responseNoWhen the request is successful, the corresponding data will be reflected in this field.API functionsAPI moduleFunction DescriptionProduct (https://open.shopee.com/documents/v2/v2.product.get_category?module=89&type=1)You can obtain the following information:
- Product-related category tree
- Attribute and brand information
- Shop product data
- Product promotion information
- Boost item and boost item list
- Product reviews and review list
- Product recommended categories and recommended attributes
- Registered product brands

 
Perform the following actions:
- Create, delete and update product information.
Shop (https://open.shopee.com/documents/v2/v2.shop.get_shop_info?module=92&type=1)You can obtain the following information:
- Shop name
- Market shop is based in
- Shop type

 
Perform the following actions:
- Update shop information
Merchant (https://open.shopee.com/documents/v2/v2.merchant.get_merchant_info?module=93&type=1)*This module is only required by cross-border sellers
Get merchant information (merchant name/market/currency) and a list of all shops under the merchant that have granted authorization.
GlobalProduct (https://open.shopee.com/documents/v2/v2.global_product.get_category?module=90&type=1)*This module is only required by cross-border sellers
Obtain the following information:
- Related category tree
- Attribute and brand information
- Global product data
- List of products that can be listed in certain markets only
- List of products with global product already published
- List of products already listed in specific markets
- Global product ID corresponding to the product in a specific market
- Recommended category and attribute of a global product

 
Perform the following actions:
- Create, delete and update global products.
- Enable/Disable syncing of global product information.
- Publish global product
MediaSpace (https://open.shopee.com/documents/v2/v2.media_space.init_video_upload?module=91&type=1)Upload videos and imagesOrder (https://open.shopee.com/documents/v2/v2.order.get_order_list?module=94&type=1)Obtain the following information:
- Shop order list
- Order list and order details
- List of invoice orders to be uploaded
- Invoice information

 
Perform the following actions:
- Manage orders by splitting and canceling them
- Undo split orders
- Process sellers’ order cancellation application
- Add order remarks
- Upload and download invoices to retrieve invoice information
Logistics (https://open.shopee.com/documents/v2/v2.logistics.get_shipping_parameter?module=95&type=1)Obtain the following information:
- List of shop channel
- Shipping parameters
- Order tracking number and tracking information
- Shipping document formats and shipping documents
- List of shop addresses

 
Perform the following actions:
- Ship orders/Ship orders in bulk
- Update shop address flag
- Enable/Disable shop channel 
- Delete shop addresses
FirstMile (https://open.shopee.com/documents/v2/v2.first_mile.get_unbind_order_list?module=96&type=1)*This module is only required by cross-border sellers
Obtain the following information:
- Unbound First Mile orders
- First Mile tracking numbers and details
- First Mile order details
- First Mile shipping documents
- FirstMile channel details
Returns (https://open.shopee.com/documents/v2/v2.returns.get_return_detail?module=102&type=1)Obtain the following information:
- List of return and refund requests
- Return and refund request details
- Get a return and refund plan

 
Perform the following actions:
- Confirm refunds
- Submit disputes
- Negotiate refunds
- Upload image evidence for disputes
Payment (https://open.shopee.com/documents/v2/v2.payment.get_escrow_detail?module=97&type=1)Obtain the following information:
- Order income
- Payout data
- Wallet data
- List of completed orders 
- Installment shop settings
- List of products that have been set up for installment payment
Discount (https://open.shopee.com/documents/v2/v2.discount.add_discount?module=99&type=1)Create, view, update, and delete Discount Promotions Bundle Deal (https://open.shopee.com/documents/v2/v2.bundle_deal.add_bundle_deal?module=110&type=1)Create, view, update, and delete Bundle Deals Add-On Deal (https://open.shopee.com/documents/v2/v2.add_on_deal.add_add_on_deal?module=111&type=1)Create, view, update, and delete Add-on Deals Voucher (https://open.shopee.com/documents/v2/v2.voucher.add_voucher?module=112&type=1)Create, view, update, and delete Vouchers Follow Prize (https://open.shopee.com/documents/v2/v2.follow_prize.add_follow_prize?module=113&type=1)Create, view, update, and delete Follow Prizes TopPicks (https://open.shopee.com/documents/v2/v2.top_picks.get_top_picks_list?module=100&type=1)Create, view, update, and delete Top Picks ShopCategory (https://open.shopee.com/documents/v2/v2.shop_category.add_shop_category?module=101&type=1)Create, view, update, and delete Shop Categories AccountHealth (https://open.shopee.com/documents/v2/v2.account_health.get_shop_performance?module=103&type=1)Obtain shop performance and any shop penalty points data Public (https://open.shopee.com/documents/v2/v2.public.get_shops_by_partner?module=104&type=1)Perform the following actions:
- Obtain list of shops that have granted authorization
- Obtain list of merchants that have granted authorization
- Resend code and upgrade codes to retrieve tokens
- Retrieve and refresh tokens
Push (https://open.shopee.com/documents/v2/v2.push.get_push_config?module=105&type=1)Retrieve and update Push Mechanism settingsChat (https://open.shopee.com/documents/v2/v2.sellerchat.get_message?module=109&type=1)*This module is only open to whitelisted users. To apply to join the whitelist, you may refer to this FAQ (https://open.shopee.com/faq?top=162&sub=166&page=1&faq=243).

 
Obtain the following information:
- Chat list
- Chat details
- Chat information
- Obtain Make Offer settings

 
Perform the following actions:
- Delete chats
- Mark chats as unread
- Pin and unpin chats
- Upload images to chats
- Send manual and automatic chat messages
- Enable/disable Make Offer settings
Problems with APIIf you encounter problems during the API integration process, you may refer to the FAQ (https://open.shopee.com/faq?top=162&sub=169&page=1&faq=) page for help. If your problem persists, you can raise a ticket (https://open.shopee.com/myconsole/ticket-system/raise-ticket).

## Content (raw HTML)

```html
<p><strong>⚠️</strong><i><strong> </strong>Note: This guide only applies to making API calls for Shopee Open API v2.0.</i></p><h1><span style="color:#2B2C2D;"><strong>API domains</strong></span></h1><p>&nbsp;</p><p>There are 3 domains available:&nbsp;</p><ul><li>Production environment&nbsp;<ul><li><a target="_blank" rel="noopener noreferrer" href="https://openplatform.shopee.cn/"><u>https://openplatform.shopee.cn/</u></a> &nbsp; — for developers who deployed their services near Chinese Mainland.</li><li><a target="_blank" rel="noopener noreferrer" href="https://openplatform.shopee.com.br/"><u>https://openplatform.shopee.com.br/</u></a> — for developer &nbsp;who deployed their services near US.</li><li><a target="_blank" rel="noopener noreferrer" href="https://partner.shopeemobile.com/"><u>https://partner.shopeemobile.com/</u></a>&nbsp; — for developer who deployed their services near SG.</li></ul></li><li>Sandbox environment<ul><li><a target="_blank" rel="noopener noreferrer" href="https://openplatform.sandbox.test-stable.shopee.sg"><u>https://openplatform.sandbox.test-stable.shopee.sg/</u></a> — for All developers</li><li><a target="_blank" rel="noopener noreferrer" href="https://openplatform.sandbox.test-stable.shopee.cn/"><u>https://openplatform.sandbox.test-stable.shopee.cn/</u></a>&nbsp;<span style="background-color:rgb(255,255,255);color:rgb(51,51,51);"> —for Chinese Mainland developers</span></li></ul></li></ul><p>&nbsp;</p><p>Select the correct domain name, based on the server location you’re accessing the Open API from.</p><h1><span style="color:#2B2C2D;"><strong>API request methods</strong></span></h1><p>&nbsp;</p><p>Currently, Open API only provides two request methods: <strong>GET </strong>and <strong>POST</strong>.</p><p>&nbsp;</p><h1>API Protocol</h1><p>HTTP/JSON for most APIs. HTTP/FORM for some certain APIs, for example, the API for uploading files.</p><p>&nbsp;</p><h1><span style="color:#2B2C2D;"><strong>API request parameters</strong></span></h1><p>&nbsp;</p><p>In the API document, you will see two types of request parameters:</p><ol><li>Common parameter</li><li>Request parameter</li></ol><p>&nbsp;</p><p>For <strong>GET</strong>-type APIs, these two parameters may exist at the same time, or only the common parameter will exist.&nbsp;</p><p>&nbsp;</p><p>For <strong>POST</strong>-type APIs, these two parameters will exist at the same time.</p><p>&nbsp;</p><figure class="image"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=sPZ86F%2FKQhIBn25dCIy5b3nU7xjEI9wxHYIbtVKfV5i2hclNI7gNZVnVE1%2FBfzEmL0ZPkUaVxRni%2BDzi%2FKEfdQ%3D%3D&amp;image_type=png"></figure><p>&nbsp;</p><p>The table below consists of descriptions for common parameters:&nbsp;</p><figure class="table"><table><thead><tr><th><strong>Parameters &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</strong></th><th><strong>Description &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;</strong></th></tr></thead><tbody><tr><td>partner_id</td><td>All API calls require a partner ID. You can obtain a partner ID by creating an App on the <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/myconsole/management/app?from=header"><u>Shopee Open Platform Console App list page</u></a>. Test partner ID can only be used in the test environment, and Live partner ID can only be used in the production environment.</td></tr><tr><td>timestamp</td><td><p>All API calls require <a target="_blank" rel="noopener noreferrer" href="https://www.computerhope.com/jargon/t/timestam.htm"><u>timestamps</u></a>.&nbsp;</p><p>Example of a timestamp: 1610000000.&nbsp;</p><p>Each API request needs to be requested within 5 minutes of a timestamp.</p></td></tr><tr><td>sign</td><td>All API calls require signatures that are generated using the SHA256 algorithm. Different API types have different signature generation methods. For more details, please refer to the <strong>Signature Calculation</strong> section in this article.</td></tr><tr><td>access_token &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</td><td>Access tokens are required to obtain and modify seller data-related APIs. Each access token is valid for 4 hours and can be reused within the validity period. The access token needs to be refreshed regularly. Refer to the <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/developer-guide/20"><u>Authorization and Authentication</u></a> article to learn more about obtaining and refreshing access tokens.</td></tr><tr><td>shop_id</td><td>The unique identification ID of a Shopee shop can be obtained after the shop has granted authorization. Refer to the <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/developer-guide/20"><u>Authorization and Authentication</u></a> article on how to obtain your shop ID.</td></tr><tr><td>merchant_id</td><td>The unique identification ID of a Shopee merchant, which can be obtained after a shop has granted authorization. Open API only supports cross-border sellers using a merchant ID. Refer to the <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/developer-guide/20"><u>Authorization and Authentication</u></a> article on how to acquire your merchant ID.&nbsp;</td></tr></tbody></table></figure><h1><span style="color:#2B2C2D;"><strong>Types of Open API</strong></span></h1><p>&nbsp;</p><p>In the API document, there are 3 API types due to the different common parameters. The public parameters contained in these 3 types are as follows:</p><ul><li><strong>Shop API</strong>: partner_id, timestamp, sign, <span style="color:#EE4D2D;">access_token, shop_id</span></li><li><strong>Merchant API</strong>: partner_id, timestamp, sign, <span style="color:#EE4D2D;">access_token, merchant_id</span></li><li><strong>Public API</strong>: partner_id, timestamp, sign</li></ul><p>&nbsp;</p><p><strong>⚠️</strong><i><strong> </strong>Note: Red items are highlighted to indicate that they are different from Public API.</i></p><p>&nbsp;</p><p>The Public API does not require an access token, while both the Shop and Merchant APIs do.&nbsp;</p><p>This means that Shop and Merchant APIs can be called only after the shop has granted authorization.</p><p>&nbsp;</p><p>Currently, only Shopee cross-border merchants need to use Merchant API. Local sellers do not need to use it.</p><h1><span style="color:#2B2C2D;"><strong>Signature calculation</strong></span></h1><p>&nbsp;</p><p><strong>Step 1: Create a base string:</strong></p><p>Different types of APIs contain different elements in its base string. Concatenate the API path (without host) and the following common parameters into a single string. You should strictly follow the sequence (base string) as shown below:&nbsp;</p><p>&nbsp;</p><p>*API path example：/api/v2/auth/token/get</p><p>&nbsp;</p><p><strong>Shop API:</strong> <span style="background-color:rgb(255,255,255);">partner_id, api path, timestamp, access_token, shop_id</span></p><p>*Example：</p><p class="indent-1">partner_id: 2001887</p><p class="indent-1">API path: /api/v2/shop/get_shop_info</p><p class="indent-1">timestamp: 1655714431</p><p class="indent-1">access_token: 59777174636562737266615546704c6d</p><p class="indent-1">shop id: 14701711</p><p>&nbsp;</p><p>Base string=2001887/api/v2/shop/get_shop_info165571443159777174636562737266615546704c6d14701711</p><p>&nbsp;</p><p><strong>Merchant API</strong>: <span style="background-color:rgb(255,255,255);">partner_id, api path, timestamp, access_token, merchant_id</span></p><p>*Example:</p><p class="indent-1">partner_id: 2001887</p><p class="indent-1">API path: /api/v2/global_product/get_category</p><p class="indent-1">timestamp: 1655714431</p><p class="indent-1">access_token: 09777174636962737266615546704c6d</p><p class="indent-1">merchant_id: 1000000</p><p>&nbsp;</p><p>Base string=<span style="background-color:rgb(255,255,255);">2001887/api/v2/global_product/get_category165571443109777174636962737266615546704c6d1000000</span></p><p>&nbsp;</p><p><strong>Public API: </strong><span style="background-color:rgb(255,255,255);">partner_id, api path, timestamp</span></p><p>*Example:</p><p class="indent-1">partner_id:2001887</p><p class="indent-1">API path: /api/v2/public/get_shops_by_partner</p><p class="indent-1">timestamp:1655714431</p><p>&nbsp;</p><p>Base string=<span style="background-color:rgb(255,255,255);">2001887/api/v2/public/get_shops_by_partner1655714431</span></p><p>&nbsp;</p><p><strong>Step 2: Calculate the signature using the HMAC-SHA256 algorithm</strong></p><p>Calculate the signature by using the HMAC-SHA256 hashing algorithm on the base string and partner Key (obtained through the <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/myconsole/management/app?from=header"><u>Shopee Open Platform Console App detail page</u></a>). The output of the hash function is a hex-encoded string.</p><p>&nbsp;</p><p>*Example：</p><p><span style="background-color:rgb(255,255,255);">sign=56f31d01aeda9d08bf456b37f6f6640ef8614b4d6ad49baafe30b39a061f0e26</span></p><p>&nbsp;</p><p><span style="background-color:rgb(255,255,255);">Find out why you may encounter the </span><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/faq?top=162&amp;sub=166&amp;page=1&amp;faq=188"><span style="background-color:rgb(255,255,255);"><u>“Wrong sign” error</u></span></a><span style="background-color:rgb(255,255,255);"> and how you can resolve the issue.</span></p><p>&nbsp;</p><p><span style="background-color:rgb(255,255,255);"><strong>Sample of Code:</strong></span></p><pre><code class="python hljs">#!/usr/bin/envpython

# encoding:utf-8



import hmac 

import time

import requests

import hashlib

timest=int(time.time())

host="https://partner.shopeemobile.com 

access_token = "random string"



partner id =80001

partner key = "test....."



#### call shop level api 

shop id =209920

base string ="%s%s%s%s%s"%(partner id, path timest access token, shop id) 

sign = hmac.new( partner key,base string,hashlib.sha256)hexdigest() 

path ="/api/v2/example/shop level/get"



url = host + path + "?partner_id=%s&amp;shop_id=%s&amp;timestamp=%s&amp;access_token=%s&amp;sign=%s"%(partner_id, shop_id, timest, access_token, sign) 

headers={"Content-Type":"application/ison"? 

resp=requests.post(urlheaders=headers)



#### call merchant level api 

merchant id =1234567

base string ="%s%s%s%s%s"%(partner id, path timest, access token, merchant id) 

sign =hmac.new( partner key,base string,hashlib.sha256).hexdigest() 

path ="/api/v2/example/merchant_level/get"



url = host+ path +"?partner id=%s&amp;merchant id=%s&amp;timestamp=%s&amp;access token=%s&amp;sign=%s"%(partnerid, merchant id, timest, access token, sign) 

headers ={"Content-Type":"application/ison"? resp =requests.eet(urlheaders=headers)



#### call public api

base string ="%s%s%5%s"%(partner idpathtimestaccess token)

sign= hmac.new( partner keybase stringhashlib.sha256)hexdigest() 

path ="/api/v2/auth merchant/access token/get"



url = host+path+"?partner id=%s&amp;timestamp=%s&amp;sign=%s%(partner idtimest, sign)

body ={"partner id":partner id, "merchant id": merchant id,"refresh token":"testingtoken") 

headers =["Content-Type":"application/ison"?

resp =requests.post(url,json=bodyheaders=headers)</code></pre><h1><span style="color:#2B2C2D;"><strong>API request sample</strong></span></h1><p>&nbsp;</p><p>For <strong>GET</strong>-type API requests, you need to put <strong>both the common parameters and request parameters in the URL</strong>.&nbsp;</p><p>&nbsp;</p><p>For example: <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.get_category?module=89&amp;type=1"><u>V2.product.get_category</u></a>&nbsp;</p><p>&nbsp;</p><p>API request URL:</p><p><span style="background-color:rgb(255,255,255);"><u>https://partner.shopeemobile.com/api/v2/product/get_category?partner_id=851249&amp;timestamp=1654673582&amp;shop_id=1001094&amp;access_token=367a0a8eb9d1837cbf7c43b587a0faa4&amp;sign=a40fc50a08c382eeee08e2eb00deb8464c6fdcbe4f1c271e033cdbca3ded4d5b&amp;language=zh-hans</u></span></p><p>&nbsp;</p><p><span style="background-color:rgb(255,255,255);"><i>*For this API endpoint，partner_id、timestamp、access_token、shop_id and sign are common parameters. Meanwhile, language is a request parameter.</i></span></p><p>&nbsp;</p><p>&nbsp;</p><p>For <strong>POST</strong>-type API requests, you need to insert common parameters in the request URL and request parameters in the request body.&nbsp;</p><p>&nbsp;</p><p>For example:<a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.shop.update_profile?module=92&amp;type=1"><u>v2.shop.update_profile</u></a>&nbsp;</p><p>&nbsp;</p><p>API request URL:</p><p><span style="background-color:rgb(255,255,255);"><u>https://partner.shopeemobile.com/api/v2/shop/update_profile?partner_id=851249&amp;timestamp=1654673582&amp;shop_id=1001094&amp;access_token=367a0a8eb9d1837cbf7c43b587a0faa4&amp;sign=80cbce8da907d5a1237711409920fc16908a9f9e01b1254ff9cc44aaf0836122</u></span></p><p>&nbsp;</p><p>Request body:</p><p><span style="background-color:rgb(255,255,255);">{</span></p><p><span style="background-color:rgb(255,255,255);">"shop_logo": "https://cf.shopee.sg/file/8424390be4677b0b3c37ce6499ce261a",</span></p><p><span style="background-color:rgb(255,255,255);">"description": "TTest",</span></p><p><span style="background-color:rgb(255,255,255);">"shop_name": "123"</span></p><p><span style="background-color:rgb(255,255,255);">}</span></p><p>&nbsp;</p><p><span style="background-color:rgb(255,255,255);"><i>*For this API endpoint，partner_id、timestamp、access_token、shop_id、and sign are common parameters. Meanwhile, shop_logo、description and shop_name are request parameters.</i></span></p><h1><span style="color:#2B2C2D;"><strong>API response parameters</strong></span></h1><figure class="table"><table><thead><tr><th><strong>Parameters &nbsp; &nbsp;&nbsp;</strong></th><th><strong>Must return？</strong></th><th><strong>Description</strong></th></tr></thead><tbody><tr><td><span style="background-color:rgb(255,255,255);">request id</span></td><td><span style="background-color:rgb(255,255,255);">Yes</span></td><td><span style="background-color:rgb(255,255,255);">Each API request has a unique request ID. When you encounter an API issue, please provide this ID and the corresponding API information to get a faster response.</span></td></tr><tr><td><span style="background-color:rgb(255,255,255);">error</span></td><td><span style="background-color:rgb(255,255,255);">Yes</span></td><td><p><span style="background-color:rgb(255,255,255);">Error code.&nbsp;</span></p><p><span style="background-color:rgb(255,255,255);">When the request is successful, the error parameter will return empty.&nbsp;</span></p><p><span style="background-color:rgb(255,255,255);">If the request fails, the corresponding error code will be reflected in this field.</span></p></td></tr><tr><td><span style="background-color:rgb(255,255,255);">message</span></td><td><span style="background-color:rgb(255,255,255);">No</span></td><td><p><span style="background-color:rgb(255,255,255);">Error message.&nbsp;</span></p><p><span style="background-color:rgb(255,255,255);">When the request is successful, the message will return empty.&nbsp;</span></p><p><span style="background-color:rgb(255,255,255);">If the request fails, this field will contain detailed information about the error.</span></p></td></tr><tr><td><span style="background-color:rgb(255,255,255);">warning</span></td><td><span style="background-color:rgb(255,255,255);">No</span></td><td><span style="background-color:rgb(255,255,255);">If the API call is successful, but some data is not returned or some batch requests fail, the information will be reflected in this field.</span></td></tr><tr><td><span style="background-color:rgb(255,255,255);">response</span></td><td><span style="background-color:rgb(255,255,255);">No</span></td><td><span style="background-color:rgb(255,255,255);">When the request is successful, the corresponding data will be reflected in this field.</span></td></tr></tbody></table></figure><h1><span style="color:#2B2C2D;"><strong>API functions</strong></span></h1><figure class="table"><table><thead><tr><th><strong>API module</strong></th><th><strong>Function Description</strong></th></tr></thead><tbody><tr><td><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.get_category?module=89&amp;type=1"><span style="background-color:rgb(255,255,255);"><u>Product</u></span></a></td><td><p><span style="background-color:rgb(255,255,255);">You can obtain the following information:</span></p><ul><li><span style="background-color:rgb(255,255,255);">Product-related category tree</span></li><li><span style="background-color:rgb(255,255,255);">Attribute and brand information</span></li><li><span style="background-color:rgb(255,255,255);">Shop product data</span></li><li><span style="background-color:rgb(255,255,255);">Product promotion information</span></li><li><span style="background-color:rgb(255,255,255);">Boost item and boost item list</span></li><li><span style="background-color:rgb(255,255,255);">Product reviews and review list</span></li><li><span style="background-color:rgb(255,255,255);">Product recommended categories and recommended attributes</span></li><li><span style="background-color:rgb(255,255,255);">Registered product brands</span></li></ul><p><br>&nbsp;</p><p><span style="background-color:rgb(255,255,255);">Perform the following actions:</span></p><ul><li><span style="background-color:rgb(255,255,255);">Create, delete and update product information.</span></li></ul></td></tr><tr><td><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.shop.get_shop_info?module=92&amp;type=1"><span style="background-color:rgb(255,255,255);"><u>Shop</u></span></a></td><td><p><span style="background-color:rgb(255,255,255);">You can obtain the following information:</span></p><ul><li><span style="background-color:rgb(255,255,255);">Shop name</span></li><li><span style="background-color:rgb(255,255,255);">Market shop is based in</span></li><li><span style="background-color:rgb(255,255,255);">Shop type</span></li></ul><p><br>&nbsp;</p><p><span style="background-color:rgb(255,255,255);">Perform the following actions:</span></p><ul><li><span style="background-color:rgb(255,255,255);">Update shop information</span></li></ul></td></tr><tr><td><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.merchant.get_merchant_info?module=93&amp;type=1"><span style="background-color:rgb(255,255,255);"><u>Merchant</u></span></a></td><td><p><span style="background-color:rgb(255,255,255);color:#EE4D2D;">*This module is only required by cross-border sellers</span></p><p><span style="background-color:rgb(255,255,255);">Get merchant information (merchant name/market/currency) and a list of all shops under the merchant that have granted authorization.</span></p></td></tr><tr><td><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.global_product.get_category?module=90&amp;type=1"><span style="background-color:rgb(255,255,255);"><u>GlobalProduct</u></span></a></td><td><p><span style="color:#EE4D2D;">*This module is only required by cross-border sellers</span></p><p>Obtain the following information:</p><ul><li>Related category tree</li><li>Attribute and brand information</li><li>Global product data</li><li>List of products that can be listed in certain markets only</li><li>List of products with global product already published</li><li>List of products already listed in specific markets</li><li>Global product ID corresponding to the product in a specific market</li><li>Recommended category and attribute of a global product</li></ul><p><br>&nbsp;</p><p>Perform the following actions:</p><ul><li>Create, delete and update global products.</li><li>Enable/Disable syncing of global product information.</li><li>Publish global product</li></ul></td></tr><tr><td><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.media_space.init_video_upload?module=91&amp;type=1"><span style="background-color:rgb(255,255,255);"><u>MediaSpace</u></span></a></td><td>Upload videos and images</td></tr><tr><td><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.order.get_order_list?module=94&amp;type=1"><span style="background-color:rgb(255,255,255);"><u>Order</u></span></a></td><td><p>Obtain the following information:</p><ul><li>Shop order list</li><li>Order list and order details</li><li>List of invoice orders to be uploaded</li><li>Invoice information</li></ul><p><br>&nbsp;</p><p>Perform the following actions:</p><ul><li>Manage orders by splitting and canceling them</li><li>Undo split orders</li><li>Process sellers’ order cancellation application</li><li>Add order remarks</li><li>Upload and download invoices to retrieve invoice information</li></ul></td></tr><tr><td><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.logistics.get_shipping_parameter?module=95&amp;type=1"><span style="background-color:rgb(255,255,255);"><u>Logistics</u></span></a></td><td><p>Obtain the following information:</p><ul><li>List of shop channel</li><li>Shipping parameters</li><li>Order tracking number and tracking information</li><li>Shipping document formats and shipping documents</li><li>List of shop addresses</li></ul><p><br>&nbsp;</p><p>Perform the following actions:</p><ul><li>Ship orders/Ship orders in bulk</li><li>Update shop address flag</li><li>Enable/Disable shop channel&nbsp;</li><li>Delete shop addresses</li></ul></td></tr><tr><td><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.first_mile.get_unbind_order_list?module=96&amp;type=1"><span style="background-color:rgb(255,255,255);"><u>FirstMile</u></span></a></td><td><p><span style="color:#EE4D2D;">*This module is only required by cross-border sellers</span></p><p>Obtain the following information:</p><ul><li>Unbound First Mile orders</li><li>First Mile tracking numbers and details</li><li>First Mile order details</li><li>First Mile shipping documents</li><li>FirstMile channel details</li></ul></td></tr><tr><td><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.returns.get_return_detail?module=102&amp;type=1"><span style="background-color:rgb(255,255,255);"><u>Returns</u></span></a></td><td><p>Obtain the following information:</p><ul><li>List of return and refund requests</li><li>Return and refund request details</li><li>Get a return and refund plan</li></ul><p><br>&nbsp;</p><p>Perform the following actions:</p><ul><li>Confirm refunds</li><li>Submit disputes</li><li>Negotiate refunds</li><li>Upload image evidence for disputes</li></ul></td></tr><tr><td><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.payment.get_escrow_detail?module=97&amp;type=1"><span style="background-color:rgb(255,255,255);"><u>Payment</u></span></a></td><td><p>Obtain the following information:</p><ul><li><span style="background-color:rgb(255,255,255);">Order income</span></li><li><span style="background-color:rgb(255,255,255);">Payout data</span></li><li><span style="background-color:rgb(255,255,255);">Wallet data</span></li><li><span style="background-color:rgb(255,255,255);">List of completed orders&nbsp;</span></li><li><span style="background-color:rgb(255,255,255);">Installment shop settings</span></li><li><span style="background-color:rgb(255,255,255);">List of products that have been set up for installment payment</span></li></ul></td></tr><tr><td><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.discount.add_discount?module=99&amp;type=1"><span style="background-color:rgb(255,255,255);"><u>Discount</u></span></a></td><td><span style="background-color:rgb(255,255,255);">Create, view, update, and delete Discount Promotions&nbsp;</span></td></tr><tr><td><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.bundle_deal.add_bundle_deal?module=110&amp;type=1"><span style="background-color:rgb(255,255,255);"><u>Bundle Deal</u></span></a></td><td><span style="background-color:rgb(255,255,255);">Create, view, update, and delete Bundle Deals&nbsp;</span></td></tr><tr><td><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.add_on_deal.add_add_on_deal?module=111&amp;type=1"><span style="background-color:rgb(255,255,255);"><u>Add-On Deal</u></span></a></td><td><span style="background-color:rgb(255,255,255);">Create, view, update, and delete Add-on Deals&nbsp;</span></td></tr><tr><td><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.voucher.add_voucher?module=112&amp;type=1"><span style="background-color:rgb(255,255,255);"><u>Voucher</u></span></a></td><td><span style="background-color:rgb(255,255,255);">Create, view, update, and delete Vouchers&nbsp;</span></td></tr><tr><td><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.follow_prize.add_follow_prize?module=113&amp;type=1"><span style="background-color:rgb(255,255,255);"><u>Follow Prize</u></span></a></td><td><span style="background-color:rgb(255,255,255);">Create, view, update, and delete Follow Prizes&nbsp;</span></td></tr><tr><td><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.top_picks.get_top_picks_list?module=100&amp;type=1"><span style="background-color:rgb(255,255,255);"><u>TopPicks</u></span></a></td><td><span style="background-color:rgb(255,255,255);">Create, view, update, and delete Top Picks&nbsp;</span></td></tr><tr><td><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.shop_category.add_shop_category?module=101&amp;type=1"><span style="background-color:rgb(255,255,255);"><u>ShopCategory</u></span></a></td><td><span style="background-color:rgb(255,255,255);">Create, view, update, and delete Shop Categories&nbsp;</span></td></tr><tr><td><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.account_health.get_shop_performance?module=103&amp;type=1"><span style="background-color:rgb(255,255,255);"><u>AccountHealth</u></span></a></td><td><span style="background-color:rgb(255,255,255);">Obtain shop performance and any shop penalty points data&nbsp;</span></td></tr><tr><td><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.public.get_shops_by_partner?module=104&amp;type=1"><span style="background-color:rgb(255,255,255);"><u>Public</u></span></a></td><td><p>Perform the following actions:</p><ul><li>Obtain list of shops that have granted authorization</li><li>Obtain list of merchants that have granted authorization</li><li>Resend code and upgrade codes to retrieve tokens</li><li>Retrieve and refresh tokens</li></ul></td></tr><tr><td><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.push.get_push_config?module=105&amp;type=1"><span style="background-color:rgb(255,255,255);"><u>Push</u></span></a></td><td><span style="background-color:rgb(255,255,255);">Retrieve and update Push Mechanism settings</span></td></tr><tr><td><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.sellerchat.get_message?module=109&amp;type=1"><span style="background-color:rgb(255,255,255);"><u>Chat</u></span></a></td><td><p><span style="background-color:rgb(255,255,255);">*This module is only open to whitelisted users. To apply to join the whitelist, you may refer to this </span><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/faq?top=162&amp;sub=166&amp;page=1&amp;faq=243"><span style="background-color:rgb(255,255,255);"><u>FAQ</u></span></a><span style="background-color:rgb(255,255,255);">.</span></p><p><br>&nbsp;</p><p>Obtain the following information:</p><ul><li>Chat list</li><li>Chat details</li><li>Chat information</li><li>Obtain <strong>Make Offer</strong> settings</li></ul><p><br>&nbsp;</p><p>Perform the following actions:</p><ul><li>Delete chats</li><li>Mark chats as unread</li><li>Pin and unpin chats</li><li>Upload images to chats</li><li>Send manual and automatic chat messages</li><li>Enable/disable <strong>Make Offer</strong> settings</li></ul></td></tr></tbody></table></figure><h1><span style="color:#2B2C2D;"><strong>Problems with API</strong></span></h1><p><span style="background-color:rgb(255,255,255);">If you encounter problems during the API integration process, you may refer to the </span><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/faq?top=162&amp;sub=169&amp;page=1&amp;faq="><span style="background-color:rgb(255,255,255);"><u>FAQ</u></span></a><span style="background-color:rgb(255,255,255);"> page for help. If your problem persists, you can </span><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/myconsole/ticket-system/raise-ticket"><span style="background-color:rgb(255,255,255);"><u>raise a ticket</u></span></a>.</p>
```
