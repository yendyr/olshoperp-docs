# Shopee Entrega Direta

> **Source:** [https://open.shopee.com/developer-guide/290](https://open.shopee.com/developer-guide/290)
> **Type:** Developer Guide / Overview
> **document_id:** `290`
> **Section:** API Guidelines and Flows / BRAZIL | Specific Local Guides

## Content

What is the Shopee Direct Delivery channel? 
- This channel allows (and requires) the seller to make faster deliveries, such as same day or the next day deliveries;
- The seller is able to deliver their orders on their own or with hired couriers;
- The delivery time is defined by the cut-off time (defined by the seller) at which the purchase is confirmed (e.g. orders paid before 3pm will be delivered on the same day, orders paid after 3pm will be delivered the next day);
- The seller will always have 2 channels available when Shopee Entrega Direta is active, as Shopee Entrega Direta currently only serves SP city.
 
Note: This channel will be made available to selected sellers, in accordance with the rules established by the Shopee commercial team. For more details follow the article (https://seller.shopee.com.br/edu/article/20782/Manual-Shopee-Entrega-Di).
OpenAPI changes 1 - Order identification (new logistics channel):
- v2.order.get_order_detail API, "shipping_carrier" parameter: “Shopee Entrega Direta”
 
2 - Identification of channels available to the seller and creation of items:
- v2.logistics.get_channel_list, parameter "logistic_channel_id": 90022
 
3 - Order deadline (ship_by_date):
- As the order delivery deadline is defined by the moment payment is confirmed, it is necessary to ensure that the seller has access to the deadline provided by the  v2.order.get_order_detail API, "ship_by_date" parameter.
 
4 - Item creation:
- This channel will never be the only one available to a seller, so whenever you create an item, when identifying the available channels, always mention all those available (Shopee Direct Delivery and Standard Delivery for example).
- Attempting to create an item with only one active logistics channel, namely Shopee Direct Delivery, will not be possible;
 
 
Logistic HUBsFor partners and logistics HUBs that help sellers manage orders with their logistics channels (e.g. Tracken, Log Manager), below are the main APIs and flows for your Integration:
 
1 - Create an account and APP on the Shopee Open Platform:
- To access sellers' APIs and order data, you will need to create an account on the Open Platform.
- Once the account is created, create an APP (preferably an ERP System type to have access to all OpenAPI functionalities) and connect sellers to their account before starting to call the API;
- These flows are further detailed in the following articles:- Developer account registration (https://open.shopee.com/developer-guide/12)
- App management (https://open.shopee.com/developer-guide/14)
- Authorization and Authentication (https://open.shopee.com/developer-guide/20)

 
2 - Recommended APIs and Webhooks (Pushs):
- v2.order.get_order_list - for identifying orders;
- v2.order.get_order_detail API - for order details and the only way to check the order's logistics channel (via the “shipping_channel” parameter where “Shopee Entrega Direta” will be returned);
- v2.logistics.get_tracking_number API - to identify order tracking number;
- v2.logistics.ceate_shipping_document - for creating labels (it is worth noting that the seller's ERP will already make this call and it may not be necessary);
- v2.logistics.get_shipping_document_result - to check if the label has already been created successfully and is available for download;
- v2.logistics.download_shipping_document API - to download the shipping label;
- order_status_push - to be notified when a new order and when there is any order status update;
- order_tracking_push - To be notified when the tracking_number has been created;
- shipping_document_status_push - to be notified when the label is ready for download;
 
Below is a link to more articles about order flow on Shopee:
- OpenAPI Logistics API Step by Step (https://seller.shopee.com.br/edu/article/15577/passo-a-passo-apis-de-logistica-open-api)
- API Call Flows (https://open.shopee.com/developer-guide/27)
 
FAQ:1 - Do all sellers have access to the Shopee Entrega Direta channel?
A: Only managed sellers have access to the channel, for more information contact your Account Manager.
 
2 - Is it mandatory to send an invoice to the Shopee Entrega Direta channel?
A: The channel requires sending an invoice, organizing shipping and generating a label normally.
 
3 - Masked data in the v2.order.get_order_detail API, why can this happen?
A: a) buyer data is sensitive data and is only made available when the order is in READY_TO_SHIP and TO_RETURN status.
b) If the IP Whitelist (from the Open Platform Console) is not filled in at the APP level, the data can be masked, once filled in, it should automatically be available (as long as it is in the correct status).
 
 
For further questions about OpenAPI, you can raise a ticket on the OP Ticketing Platform. (https://open.shopee.com/myconsole/ticket-system/raise-ticket/)

## Content (raw HTML)

```html
<h1>What is the Shopee Direct Delivery channel?</h1><p>&nbsp;</p><ul><li>This channel allows (and requires) the seller to make faster deliveries, such as same day or the next day deliveries;</li><li>The seller is able to deliver their orders on their own or with hired couriers;</li><li>The delivery time is defined by the cut-off time (defined by the seller) at which the purchase is confirmed (e.g. orders paid before 3pm will be delivered on the same day, orders paid after 3pm will be delivered the next day);</li><li>The seller will always have 2 channels available when Shopee Entrega Direta is active, as Shopee Entrega Direta currently only serves SP city.</li></ul><p>&nbsp;</p><p><i>Note: This channel will be made available to selected sellers, in accordance with the rules established by the Shopee commercial team. For more details follow the </i><a target="_blank" rel="noopener noreferrer" href="https://seller.shopee.com.br/edu/article/20782/Manual-Shopee-Entrega-Di"><i><u>article</u></i></a><i>.</i></p><h1><span style="color:rgb(43,44,45);">OpenAPI changes&nbsp;</span></h1><p>1 - Order identification (new logistics channel):</p><ul><li>v2.order.get_order_detail API, "shipping_carrier" parameter: “Shopee Entrega Direta”</li></ul><p>&nbsp;</p><p>2 - Identification of channels available to the seller and creation of items:</p><ul><li>v2.logistics.get_channel_list, parameter "logistic_channel_id": 90022</li></ul><p>&nbsp;</p><p>3 - Order deadline (ship_by_date):</p><ul><li>As the order delivery deadline is defined by the moment payment is confirmed, it is necessary to ensure that the seller has access to the deadline provided by the &nbsp;v2.order.get_order_detail API, "ship_by_date" parameter.</li></ul><p>&nbsp;</p><p>4 - Item creation:</p><ul><li>This channel will never be the only one available to a seller, so whenever you create an item, when identifying the available channels, always mention all those available (Shopee Direct Delivery and Standard Delivery for example).</li><li>Attempting to create an item with only one active logistics channel, namely Shopee Direct Delivery, will not be possible;</li></ul><p>&nbsp;</p><p>&nbsp;</p><h1><span style="color:rgb(43,44,45);">Logistic HUBs</span></h1><p>For partners and logistics HUBs that help sellers manage orders with their logistics channels (e.g. Tracken, Log Manager), below are the main APIs and flows for your Integration:</p><p>&nbsp;</p><p>1 - Create an account and APP on the Shopee Open Platform:</p><ul><li>To access sellers' APIs and order data, you will need to create an account on the Open Platform.</li><li>Once the account is created, create an APP (preferably an ERP System type to have access to all OpenAPI functionalities) and connect sellers to their account before starting to call the API;</li><li>These flows are further detailed in the following articles:<ul><li><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/developer-guide/12"><u>Developer account registration</u></a></li><li><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/developer-guide/14"><u>App management</u></a></li><li><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/developer-guide/20"><u>Authorization and Authentication</u></a></li></ul></li></ul><p>&nbsp;</p><p>2 - Recommended APIs and Webhooks (Pushs):</p><ul><li>v2.order.get_order_list - for identifying orders;</li><li>v2.order.get_order_detail API - for order details and the only way to check the order's logistics channel (via the “shipping_channel” parameter where “Shopee Entrega Direta” will be returned);</li><li>v2.logistics.get_tracking_number API - to identify order tracking number;</li><li>v2.logistics.ceate_shipping_document - for creating labels (it is worth noting that the seller's ERP will already make this call and it may not be necessary);</li><li>v2.logistics.get_shipping_document_result - to check if the label has already been created successfully and is available for download;</li><li>v2.logistics.download_shipping_document API - to download the shipping label;</li><li>order_status_push - to be notified when a new order and when there is any order status update;</li><li>order_tracking_push - To be notified when the tracking_number has been created;</li><li>shipping_document_status_push - to be notified when the label is ready for download;</li></ul><p>&nbsp;</p><p>Below is a link to more articles about order flow on Shopee:</p><ul><li><a target="_blank" rel="noopener noreferrer" href="https://seller.shopee.com.br/edu/article/15577/passo-a-passo-apis-de-logistica-open-api"><u>OpenAPI Logistics API Step by Step</u></a></li><li><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/developer-guide/27"><u>API Call Flows</u></a></li></ul><p>&nbsp;</p><h1><span style="color:rgb(43,44,45);">FAQ:</span></h1><p>1 - Do all sellers have access to the Shopee Entrega Direta channel?</p><p>A: Only managed sellers have access to the channel, for more information contact your Account Manager.</p><p>&nbsp;</p><p>2 - Is it mandatory to send an invoice to the Shopee Entrega Direta channel?</p><p>A: The channel requires sending an invoice, organizing shipping and generating a label normally.</p><p>&nbsp;</p><p>3 - Masked data in the v2.order.get_order_detail API, why can this happen?</p><p>A: a) buyer data is sensitive data and is only made available when the order is in READY_TO_SHIP and TO_RETURN status.</p><p>b) If the IP Whitelist (from the Open Platform Console) is not filled in at the APP level, the data can be masked, once filled in, it should automatically be available (as long as it is in the correct status).</p><p>&nbsp;</p><p>&nbsp;</p><p>For further questions about OpenAPI, you can raise a ticket on the <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/myconsole/ticket-system/raise-ticket/"><u>OP Ticketing Platform.</u></a></p>
```
