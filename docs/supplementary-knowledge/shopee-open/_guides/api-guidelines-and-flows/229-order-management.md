# Order Management

> **Source:** [https://open.shopee.com/developer-guide/229](https://open.shopee.com/developer-guide/229)
> **Type:** Developer Guide / Overview
> **document_id:** `229`
> **Section:** API Guidelines and Flows

## Content

1. Entity 
Order: Created after checkout. 1 order can contain multiple items.
Package: Created after the order is generated. It represents the unit for shipment. 1 order can be split into multiple packages, and 1 package can contain multiple items.
Item: The individual products within an order, with quantity and other details. Items are included in packages for shipment.
2. Order Status Flow3. Package Fulfillment Status4. Getting order list and detailsv2.order.get_order_list (https://open.shopee.com/documents/v2/v2.order.get_order_list?module=94&type=1): Get the list of orders with different order status. 
v2.order.get_order_detail (https://open.shopee.com/documents/v2/v2.order.get_order_detail?module=94&type=1): View order details.
5. Canceling Orderv2.order.cancel_order (https://open.shopee.com/documents/v2/v2.order.cancel_order?module=94&type=1): Used for sellers to cancel orders.
v2.order.handle_buyer_cancellation (https://open.shopee.com/documents/v2/v2.order.handle_buyer_cancellation?module=94&type=1): Used to handle buyer’s cancellation requests.
6. Splitting Order6.1 Splitting  
v2.order.split_order (https://open.shopee.com/documents/v2/v2.order.split_order?module=94&type=1): When an order contains multiple items, the split order function can help you arrange shipping for each item separately according to its readiness or location. Orders can be split only when the order status is "READY_TO_SHIP"
 
API request example
In this example, the order contains 6 items and is divided into two packages

{

    "order_sn": "2204215JYEEFW0",

    "package_list": [

        {

            "item_list": [

                {

                    "item_id": 1220089094,

                    "model_id": 0,

                    "order_item_id": 1220089094,

                    "promotion_group_id": 1051400341536827267

                }

            ]

        },

        {

            "item_list": [

                {

                    "item_id": 2436030646,

                    "model_id": 5074620257,

                    "order_item_id": 2436030646,

                    "promotion_group_id": 0

                },

                {

                    "item_id": 7348262532,

                    "model_id": 0,

                    "order_item_id": 7348262532,

                    "promotion_group_id": 0

                },

                {

                    "item_id": 13772515222,

                    "model_id": 0,

                    "order_item_id": 13772515222,

                    "promotion_group_id": 0

                },

                {

                    "item_id": 1229323224,

                    "model_id": 1434025516,

                    "order_item_id": 1229323224,

                    "promotion_group_id": 0

                },

                {

                    "item_id": 1229323224,

                    "model_id": 1434025517,

                    "order_item_id": 1229323224,

                    "promotion_group_id": 0

                }

            ]

        }

    ]

}Tips
 
- Split order permission for the shop level, If you get the error "You don't have the permission to split order." when calling the v2.order.split_order (https://open.shopee.com/documents/v2/v2.order.split_order?module=94&type=1) api, please contact Shopee business manager to apply.
- Items under the same Bundle deal and add on deal promotion cannot be split into different packages. Only for selected sellers can support split bundle deal or add on deal promotions.- The order_item_id of the items in the V2.order.get_order_detail (https://open.shopee.com/documents/v2/v2.order.get_order_detail?module=94&type=1) API is the same, indicating that they are in the same Bundle deal, and the add_on_deal_id is the same, indicating that they are in the same add on deal.

- If buyers buy more than one items of the same item_id and model_id, the order can not be split. It means we only support item level and model level splitting.Only for selected sellers can support split the same items.
eg: For example, if a buyer buys a cell phone A (blue) and a cell phone A (red), the order can be split into two packages. If you buy two cell phones A (blue), you can not split them.
4.When splitting an order, there should be at least two parcels in an order, it means at least two item_list request. You can split the order into 30 parcels at most in TW and 5 parcels at most in other regions.
5.When splitting an order, the requested item must contain all the items in the order.
6.2 Cancel Splittingv2.order.unsplit_order (https://open.shopee.com/documents/v2/v2.order.unsplit_order?module=94&type=1): The order status is "READY_TO_SHIP" before the order can be canceled splitting, if any parcel has been shipped, the order can not be splitting anymore.
7. Getting package list and details for shipmentv2.order.search_package_list (https://open.shopee.com/documents/v2/v2.order.search_package_list?module=94&type=1): Search package list that have not been SHIPPED to arrange shipment, with various filters and sort fields. This api is preferred to fetch packages for shipment.
v2.order.get_package_detail (https://open.shopee.com/documents/v2/v2.order.get_package_detail?module=94&type=1): View package details.
8. Shipment API Call Flow8.1 Basic Shipping Logic1. Get the list of packages to be shipped with package_status of 2 (ToProcess) through v2.order.search_package_list (https://open.shopee.com/documents/v2/v2.order.search_package_list?module=94&type=1) API.
 
2.Call v2.logistics.get_shipping_parameter (https://open.shopee.com/documents/v2/v2.logistics.get_shipping_parameter?module=95&type=1) API to get the shipping parameters for single package (or call v2.logistics.get_mass_shipping_parameter (https://open.shopee.com/documents/v2/v2.logistics.get_mass_shipping_parameter?module=95&type=1) API to batch get the shipping parameters for multiple packages under same logistics channel and warehouse), seller choose any one of pickup/dropoff/non_integrated shipping method to ship. Call v2.logistics.ship_order (https://open.shopee.com/documents/v2/v2.logistics.ship_order?module=95&type=1) to ship single package (or call v2.logistics.mass_ship_order (https://open.shopee.com/documents/v2/v2.logistics.mass_ship_order?module=95&type=1) to batch ship multiple packages under same logistics channel and warehouse), for non_integrated channel orders, the developer should prepare the tracking number and upload it in the request body. After the API call is successful, the package fulfillment status of pickup / dropoff mode will automatically update from LOGISTICS_READY to LOGISTICS_REQUEST_CREATED, and for the non_integrated mode, package fulfillment status will be immediately updated to LOGISTICS_PICKUP_DONE.
 
3.After successful shipment using the Shopee integration channel, you can call v2.logistics.get_tracking_number (https://open.shopee.com/documents/v2/v2.logistics.get_tracking_number?module=95&type=1) API to get the tracking number for single package (or call v2.logistics.get_mass_tracking_number (https://open.shopee.com/documents/v2/v2.logistics.get_mass_tracking_number?module=95&type=1) API to batch get the tracking number for multiple packages.
 
4.After getting the tracking number, you can print the airway bill. You can choose two ways: self-print or Shopee generated. The airway bill can only be printed after the package is arranged shipment successfully and before the package fulfillment status is LOGISTICS_PICKUP_DONE.
 
5.To get the Shopee generated airway bill, you need to call these four APIs one by one. v2.logistics.get_shipping_document_parameter (https://open.shopee.com/documents/v2/v2.logistics.get_shipping_document_parameter?module=95&type=1)，v2.logistics.create_shipping_document (https://open.shopee.com/documents/v2/v2.logistics.create_shipping_document?module=95&type=1)，v2.logistics.get_shippping_document_result (https://open.shopee.com/documents/v2/v2.logistics.get_shipping_document_result?module=95&type=1)，v2.logistics.download_shipping_document (https://open.shopee.com/documents/v2/v2.logistics.download_shipping_document?module=95&type=1).
 
6.TW shipping special logic:
 
a.When calling the v2.logistics.get_shipping_parameter (https://open.shopee.com/documents/v2/v2.logistics.get_shipping_parameter?module=95&type=1) API to get the shipping parameters, the slug parameter is returned, and the slug parameter must be uploaded when calling the v2.logistics.ship_order (https://open.shopee.com/documents/v2/v2.logistics.ship_order?module=95&type=1) API, otherwise the shipment will fail.
b.For the channel 黑猫宅急便(30001), there is no need to print airway bill. 3PL will provide the airway bill and complete the pickup. Calling v2.logistics.create_shipping_document will report an error: "The package can not print now."
8.2 Related APIs for order shipmentAPI Descriptionv2.order.search_package_list (https://open.shopee.com/documents/v2/v2.order.search_package_list?module=94&type=1)Get a list of packages which not shipped yetv2.order.get_package_detail (https://open.shopee.com/documents/v2/v2.order.get_package_detail?module=94&type=1)Get package detailsv2.logistics.get_shipping_parameter (https://open.shopee.com/documents/v2/v2.logistics.get_shipping_parameter?module=95&type=1)
v2.logistics.get_mass_shipping_parameter (https://open.shopee.com/documents/v2/v2.logistics.get_mass_shipping_parameter?module=95&type=1)
Get shipping parametersv2.logistics.ship_order (https://open.shopee.com/documents/v2/v2.logistics.ship_order?module=95&type=1)
v2.logistics.mass_ship_order (https://open.shopee.com/documents/v2/v2.logistics.mass_ship_order?module=95&type=1)
Arrange shipmentv2.logistics.get_tracking_number (https://open.shopee.com/documents/v2/v2.logistics.get_tracking_number?module=95&type=1)
v2.logistics.get_mass_tracking_number (https://open.shopee.com/documents/v2/v2.logistics.get_mass_tracking_number?module=95&type=1)
Get tracking numberv2.logistics.get_shipping_document_data_info (https://open.shopee.com/documents/v2/v2.logistics.get_shipping_document_data_info?module=95&type=1)Get the information you need to self print airway billv2.logistics.get_shipping_document_parameter (https://open.shopee.com/documents/v2/v2.logistics.get_shipping_document_parameter?module=95&type=1)Access to selectable and recommended airway bill typesv2.logistics.create_shipping_document (https://open.shopee.com/documents/v2/v2.logistics.create_shipping_document?module=95&type=1)Create airway bill taskv2.logistics.get_shippping_document_result (https://open.shopee.com/documents/v2/v2.logistics.get_shipping_document_result?module=95&type=1)Get airway bill task resultv2.logistics.download_shipping_document (https://open.shopee.com/documents/v2/v2.logistics.download_shipping_document?module=95&type=1)Download Shopee generated airway bill8.3 API request example8.3.1 v2.logistics.get_shipping_parameter (https://open.shopee.com/documents/v2/v2.logistics.get_shipping_parameter?module=95&type=1)Response example:
{

    "error": "",

    "message": "",

    "response": {

        "info_needed": {

            "dropoff": [],

            "pickup": [

                "address_id",

                "pickup_time_id"

            ]

        },

        "dropoff": {

            "branch_list": null

        },

        "pickup": {

            "address_list": [

                {

                    "address_id": 2826,

                    "region": "TH",

                    "state": "จังหวัดบึงกาฬ",

                    "city": "อำเภอเมืองบึงกาฬ",

                    "district": "",

                    "town": "",

                    "address": "222/58",

                    "zipcode": "38000",

                    "address_flag": [

                        "default_address",

                        "pickup_address",

                        "return_address"

                    ],

                    "time_slot_list": [

                        {

                            "date": 1639472400,

                            "pickup_time_id": "1639472400"

                        },

                        {

                            "date": 1639558800,

                            "pickup_time_id": "1639558800"

                        }

                    ]

                },

                {

                    "address_id": 3019,

                    "region": "TH",

                    "state": "จังหวัดกระบี่",

                    "city": "อำเภอคลองท่อม",

                    "district": "",

                    "town": "",

                    "address": "home 1234",

                    "zipcode": "81120",

                    "address_flag": [],

                    "time_slot_list": [

                        {

                            "date": 1639472400,

                            "pickup_time_id": "1639472400"

                        },

                        {

                            "date": 1639558800,

                            "pickup_time_id": "1639558800"

                        }

                    ]

                }

            ]

        }

    },

    "request_id": "33d8460efcd7313ac5b8337b54ff4b07"

} 
Note: The info_needed field indicates the shipping method supported by the order and the parameters that need to be uploaded when you ship order. This example order supports dropoff or pickup method. If dropoff method is selected, there is no need to upload relevant parameters. If pickup is selected, you need to upload address_id and pickup_time_id parameters. If info_needed only returns dropoff, it means that the order only supports dropoff.
8.3.2. v2.logistics.ship_order (https://open.shopee.com/documents/v2/v2.logistics.ship_order?module=95&type=1)1) Selecting the pickup method:
When the pickup parameter returned by info_needed in v2.logistics.get_shipping_parameter contains address_id and pickup_time_id.
{

    "order_sn": "2112132KQ1MK9N",

    "pickup": {

        "address_id": 2826,

        "pickup_time_id": "1639472400"

    }

} 
2) Selecting the dropoff method
When the dropoff parameter returned by info_needed in v2.logistics.get_shipping_parameter is empty
{

    "order_sn": "220301QQY0WASP",

    "dropoff": {}

} 
Note: some channels for drop
off methods have a direct return of empty fields, you need to pass in the empty field, such as the example. If other parameters are returned, upload other parameters, for example:
{
    "order_sn": "220301QQY0WASP",
    "dropoff": {
          "sender_real_name": "ABC"
  }
} 
 
3) Selecting the non_integrated method
When the non_integrated parameter returned by info_needed in v2.logistics.get_shipping_parameter is tracking_number
{
    "order_sn": "220301QQY0WASP",
    "non_integrated": {
        "tracking_number": "AK224200239740W"
    }
}8.3.3 v2.logistics.update_shipping_order (https://open.shopee.com/documents/v2/v2.logistics.update_shipping_order?module=95&type=1){
    "order_sn": "2112132KQ1MK9N",
    "pickup": {
        "address_id": 11178,
        "pickup_time_id": "1658563200"
    }
} 
Used for pickup order to update address_id and pickup_time_id. Applicable to orders in RETRY_SHIP status.
9. FAQOrder relatedQ: Call v2.order.get_order_detail (https://open.shopee.com/documents/v2/v2.order.get_order_list?module=94&type=1) API and report error "Wrong parameters, detail: the order is not found.
A: Can check this FAQ (https://open.shopee.com/faq/192).
 
Q:Call v2.order.get_order_detail (https://open.shopee.com/documents/v2/v2.order.get_order_list?module=94&type=1) API, many response fields are missing, what should I do?
A Please check whether the response_optional_fields field is selected to upload the corresponding field, please refer to the API documentation (https://open.shopee.com/documents/v2/v2.order.get_order_detail?module=94&type=1) for details.
Shipping related 
Q: Why I can't get the time slot?
A: If you can't get it, the order may have been shipped or ship_by_day has passed. 
 
Q: I got the error "logistic status not ready to ship". How to check?
A:Please call v2.order.get_order_detail (https://open.shopee.com/documents/v2/v2.order.get_order_detail?module=94&type=1) API to get the order status. Only orders with READY_TO_SHIP status can be shipped. 
 
Q: Call v2.logistics.get_tracking_number (https://open.shopee.com/documents/v2/v2.logistics.get_tracking_number?module=95&type=1) API but no first_mile_tracking_number is returned, what do I need to do?
A: Please check whether the response_optional_fields field is selected to upload the corresponding field, please refer to the API documentation (https://open.shopee.com/documents/v2/v2.logistics.get_tracking_number?module=95&type=1) for details.
Airway Bill relatedQ: Call v2.logistics.create_shipping_document (https://open.shopee.com/documents/v2/v2.logistics.create_shipping_document?module=95&type=1) API, prompt error "Order status does not support awb printing".
A: Please call v2.order.get_order_detail (https://open.shopee.com/documents/v2/v2.order.get_order_detail?module=94&type=1) API to get order_status, only supports to get under order_status is PROCESSED.
 
Q: Call v2.logistics.get_shipping_document_result (https://open.shopee.com/documents/v2/v2.logistics.get_shipping_document_result?module=95&type=1) API and get the status of "PROCESSING" how to deal with it?
A: It is recommended to call the API cyclically until you get to the "READY" status.
 
Q: How many types of Airway bill files are there?
A: There are three formats：
- Most orders' airway bill are PDF file.
- TW C2C channels all return airway bills is html format, B2C channels except 7-ELEVEN (channel_id: 30005), Family Family (channel_id: 30006), Lai Erfu (channel_id: 30007), Family Family Frozen Super Pickup (not sent to outlying islands) ( channel_id: 30011), OK Mart (channel_id: 30014) are printed in pdf format, and others are returned html.
- If the printing method set in the seller center is thermal printing, the zip format folder is returned.
 
10. Data DefinitionOrder Status- UNPAID:Order is created, buyer has not paid yet.   
- READY_TO_SHIP:Seller can arrange shipment.
- PROCESSED:Seller has arranged shipment online and got tracking number from 3PL.
- SHIPPED:The parcel has been drop to 3PL or picked up by 3PL.
- TO_CONFIRM_RECEIVE:The order has been received by buyer.
- COMPLETED:The order has been completed.
- RETRY_SHIP:3PL pickup parcel fail. Need to re arrange shipment.
- IN_CANCEL:The order's cancelation is under processing.
- CANCELLED:The order has been canceled.
- TO_RETURN:The buyer requested to return the order and order's return is processing.
Package Status- All: Fetch all packages that are Pending, ToProcess, or Processed, value 0.
- Pending: Fetch packages that are not ready for shipment, value 1.
- ToProcess: Fetch packages that need to arrange shipment, value 2.
- Processed: Fetch packages that have been arranged shipment, value 3.
 
Note: 
Package Status takes the same effect as Order Status filter under To Ship tab in Seller Center, the mapping between Package Status, Package Fulfillment Status and Seller Center Order Status filter is as follows:
Package StatusPackage Fulfillment StatusOrder Status filter under To Ship tab in Seller CenterAll (0)LOGISTICS_NOT_START, LOGISTICS_READY, LOGISTICS_PICKUP_RETRY, or LOGISTICS_REQUEST_CREATEDAllPending (1)LOGISTICS_NOT_STARTPendingToProcess (2)LOGISTICS_READY or LOGISTICS_PICKUP_RETRYTo ProcessProcessed (3)LOGISTICS_REQUEST_CREATEDProcessedPackage Fulfillment Status / Logistics Status- LOGISTICS_NOT_START: Initial status, package not ready for fulfillment
- LOGISTICS_READY: Package ready for fulfillment from payment perspective. For non-COD:  paid; forCOD: passed COD screening
- LOGISTICS_REQUEST_CREATED: Package arranged shipment
- LOGISTICS_PICKUP_DONE: Package handed over to 3PL
- LOGISTICS_DELIVERY_DONE: Package successfully delivered
- LOGISTICS_INVALID: Order cancelled when package at LOGISTICS_READY
- LOGISTICS_REQUEST_CANCELED: Order cancelled when package at LOGISTICS_REQUEST_CREATED
- LOGISTICS_PICKUP_FAILED: Order cancelled by 3PL due to failed pickup or picked up but not able to proceed with delivery
- LOGISTICS_PICKUP_RETRY: Package pending 3PL retry pickup
- LOGISTICS_DELIVERY_FAILED: Order cancelled due to 3PL delivery failed
- LOGISTICS_LOST: Order cancelled due to 3PL lost the Package
 
Note: Due to legacy logic, the package logistics status in get_order_detail will return 2 additional values: 
- LOGISTICS_PENDING_ARRANGE:order logistics pending arrangement
- LOGISTICS_COD_REJECTED:Integrated logistics COD: Order rejected for COD
Order cancellation reason - OUT_OF_STOCK
- UNDELIVERABLE_AREA
Cancel reason 
- Out of Stock
- Buyer Request to Cancel
- Undeliverable Area
- COD Unsupported
- Parcel is Lost
- Game Completed
- Unpaid Order
- Underpaid Order
- Unsuccessful / Rejected Payment
- Logistics Request is Cancelled
- 3PL pickup Fail
- Failed Delivery
- COD Rejected
- Seller did not Ship
- Transit Warehouse Cancelled
- Other
- Inactive Seller
- Seller did not Ship
- Auto Cancel
- Logistic Issue
- Your approver did not approve order on time.
- You are unable to place order at the moment.
- TBC
Buyer cancel reason 
- Seller is not Responsive to buyer's Inquires
- Seller ask Buyer to Cancel
- Modify Existing Order
- Product has Bad Reviews
- Seller Takes too Long to Ship The Order
- Seller is Untrustworthy
- Others
- Forgot to Input Voucher Code
- Need to change delivery address
- Need to Change Delivery Address
- Need to input / Change Voucher Code
- Need to Modify Order
- Payment Procedure too Troublesome
- Found Cheaper Elsewhere
- Don't Want to Buy Anymore
- Your approver rejected the order.
- You are unable to place order at the moment.
- Need to change delivery address
- Too long delivery time
- Modify existing order (color, size, voucher, etc)
- Change of mind / others
Shipping document type 
- NORMAL_AIR_WAYBILL
- THERMAL_AIR_WAYBILL
- NORMAL_JOB_AIR_WAYBILL
- THERMAL_JOB_AIR_WAYBILL
Package logistics track status （for get_tracking_info (https://open.shopee.com/documents/v2/v2.logistics.get_tracking_info?module=95&type=1) api）
- INITIAL
- ORDER_INIT
- ORDER_SUBMITTED
- ORDER_FINALIZED
- ORDER_CREATED
- PICKUP_REQUESTED
- PICKUP_PENDING
- PICKED_UP
- DELIVERY_PENDING
- DELIVERED
- PICKUP_RETRY
- TIMEOUT
- LOST
- UPDATE
- UPDATE_SUBMITTED
- UPDATE_CREATED
- RETURN_STARTED
- RETURNED
- RETURN_PENDING
- RETURN_INITIATED
- EXPIRED
- CANCEL
- CANCEL_CREATED
- CANCELED
- FAILED_ORDER_INIT
- FAILED_ORDER_SUBMITTED
- FAILED_ORDER_CREATED
- FAILED_PICKUP_REQUESTED
- FAILED_PICKED_UP
- FAILED_DELIVERED
- FAILED_UPDATE_SUBMITTED
- FAILED_UPDATE_CREATED
- FAILED_RETURN_STARTED
- FAILED_RETURNED
- FAILED_CANCEL_CREATED
- FAILED_CANCELED

## Content (raw HTML)

```html
<h1>1. Entity</h1><p>&nbsp;</p><p><strong>Order:</strong> Created after checkout. 1 order can contain multiple items.</p><p><strong>Package:</strong> Created after the order is generated. It represents the unit for shipment. 1 order can be split into multiple packages, and 1 package can contain multiple items.</p><p><strong>Item:</strong> The individual products within an order, with quantity and other details. Items are included in packages for shipment.</p><h1>2. Order Status Flow</h1><figure class="image"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=1vR037Deon1TfHF8LuX3ANMIt4KzgNbuMlngwgb4Hbsd4B3O16%2B4M8jEwiydIxZz%2F%2FUVJEd20uF1NVXqSupddw%3D%3D&amp;image_type=png"></figure><h1>3. Package Fulfillment Status</h1><figure class="image"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=BCF6GSGHu0RUbI5NmVvWacXLYj5%2F4qcTQYj6Vetj5cCSxI1pptmSl0NqEpjRyfx1ECiNanWrOeuDzHWETnJuGg%3D%3D&amp;image_type=png"></figure><h1>4. Getting order list and details</h1><p><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.order.get_order_list?module=94&amp;type=1"><u>v2.order.get_order_list</u></a>: Get the list of orders with different order status.&nbsp;</p><p><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.order.get_order_detail?module=94&amp;type=1"><u>v2.order.get_order_detail</u></a>: View order details.</p><h1>5. Canceling Order</h1><p><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.order.cancel_order?module=94&amp;type=1"><u>v2.order.cancel_order</u></a>: Used for sellers to cancel orders.</p><p><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.order.handle_buyer_cancellation?module=94&amp;type=1"><u>v2.order.handle_buyer_cancellation</u></a>: Used to handle buyer’s cancellation requests.</p><h1>6. Splitting Order</h1><h3>6.1 Splitting&nbsp;</h3><p>&nbsp;</p><p><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.order.split_order?module=94&amp;type=1"><u>v2.order.split_order</u></a>: When an order contains multiple items, the split order function can help you arrange shipping for each item separately according to its readiness or location. Orders can be split only when the order status is "<strong>READY_TO_SHIP</strong>"</p><p>&nbsp;</p><p>API request example</p><p>In this example, the order contains 6 items and is divided into two packages</p><pre><code class="json hljs">
{

 &nbsp;&nbsp;&nbsp;"order_sn": "2204215JYEEFW0",

 &nbsp;&nbsp;&nbsp;"package_list": [

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"item_list": [

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"item_id": 1220089094,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"model_id": 0,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"order_item_id": 1220089094,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"promotion_group_id": 1051400341536827267

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"item_list": [

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"item_id": 2436030646,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"model_id": 5074620257,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"order_item_id": 2436030646,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"promotion_group_id": 0

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"item_id": 7348262532,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"model_id": 0,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"order_item_id": 7348262532,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"promotion_group_id": 0

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"item_id": 13772515222,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"model_id": 0,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"order_item_id": 13772515222,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"promotion_group_id": 0

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"item_id": 1229323224,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"model_id": 1434025516,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"order_item_id": 1229323224,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"promotion_group_id": 0

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"item_id": 1229323224,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"model_id": 1434025517,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"order_item_id": 1229323224,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"promotion_group_id": 0

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}

 &nbsp;&nbsp;&nbsp;]

}</code></pre><p>Tips</p><p>&nbsp;</p><ol><li>Split order permission for the shop level, If you get the error "You don't have the permission to split order." when calling the <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.order.split_order?module=94&amp;type=1"><u>v2.order.split_order</u></a> api, please contact Shopee business manager to apply.</li><li>Items under the same Bundle deal and add on deal promotion cannot be split into different packages. <strong>Only for selected sellers can support split bundle deal or add on deal promotions.</strong><ol><li>The <strong>order_item_id</strong> of the items in the <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.order.get_order_detail?module=94&amp;type=1"><u>V2.order.get_order_detail</u></a> API is the same, indicating that they are in the same Bundle deal, and the <strong>add_on_deal_id</strong> is the same, indicating that they are in the same add on deal.</li></ol></li><li>If buyers buy more than one items of the same item_id and model_id, the order can not be split. It means we only support item level and model level splitting.<strong>Only for selected sellers can support split the same items.</strong></li></ol><p class="indent-2">eg: For example, if a buyer buys a cell phone A (blue) and a cell phone A (red), the order can be split into two packages. If you buy two cell phones A (blue), you can not split them.</p><p class="indent-1">4.When splitting an order, there should be at least two parcels in an order, it means at least two item_list request. You can split the order into 30 parcels at most in TW and 5 parcels at most in other regions.</p><p class="indent-1">5.When splitting an order, the requested item must contain all the items in the order.</p><h3>6.2 Cancel Splitting</h3><p><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.order.unsplit_order?module=94&amp;type=1"><u>v2.order.unsplit_order</u></a>: The order status is "<strong>READY_TO_SHIP</strong>" before the order can be canceled splitting, if any parcel has been shipped, the order can not be splitting anymore.</p><h1>7. Getting package list and details for shipment</h1><p><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.order.search_package_list?module=94&amp;type=1">v2.order.search_package_list</a>: Search package list that have not been SHIPPED to arrange shipment, with various filters and sort fields. This api is preferred to fetch packages for shipment.</p><p><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.order.get_package_detail?module=94&amp;type=1"><u>v2.order.get_package_detail</u></a>: View package details.</p><h1>8. Shipment API Call Flow</h1><figure class="image"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=qEuKrZQkpbJEXzXUJzaJbMxhGxHJ0LkgC4OhH4V3DrtMIbUcKCvqjpcN54zLvrBBwHMZ2jUSL0ZeIigOb2Jd0Q%3D%3D&amp;image_type=png"></figure><h2>8.1 Basic Shipping Logic</h2><p>1. Get the list of packages to be shipped with package_status of 2 (ToProcess) through <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.order.search_package_list?module=94&amp;type=1"><u>v2.order.search_package_list</u></a> API.</p><p>&nbsp;</p><p>2.Call <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.logistics.get_shipping_parameter?module=95&amp;type=1"><u>v2.logistics.get_shipping_parameter</u></a> API to get the shipping parameters for single package (or call <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.logistics.get_mass_shipping_parameter?module=95&amp;type=1"><u>v2.logistics.get_mass_shipping_parameter</u></a> API to batch get the shipping parameters for multiple packages under same logistics channel and warehouse), seller choose any one of pickup/dropoff/non_integrated shipping method to ship. Call <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.logistics.ship_order?module=95&amp;type=1"><u>v2.logistics.ship_order</u></a> to ship single package (or call <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.logistics.mass_ship_order?module=95&amp;type=1"><u>v2.logistics.mass_ship_order</u></a> to batch ship multiple packages under same logistics channel and warehouse), for non_integrated channel orders, the developer should prepare the tracking number and upload it in the request body. After the API call is successful, the package fulfillment status of pickup / dropoff mode will automatically update from <strong>LOGISTICS_READY</strong> to <strong>LOGISTICS_REQUEST_CREATED</strong>, and for the non_integrated mode, package fulfillment status will be immediately updated to <strong>LOGISTICS_PICKUP_DONE</strong>.</p><p>&nbsp;</p><p>3.After successful shipment using the Shopee integration channel, you can call <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.logistics.get_tracking_number?module=95&amp;type=1"><u>v2.logistics.get_tracking_number</u></a> API to get the tracking number for single package (or call <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.logistics.get_mass_tracking_number?module=95&amp;type=1"><u>v2.logistics.get_mass_tracking_number</u></a> API to batch get the tracking number for multiple packages.</p><p>&nbsp;</p><p>4.After getting the tracking number, you can print the airway bill. You can choose two ways: self-print or Shopee generated. The airway bill can only be printed after the package is arranged shipment successfully and before the package fulfillment status is <strong>LOGISTICS_PICKUP_DONE</strong>.</p><p>&nbsp;</p><p>5.To get the Shopee generated airway bill, you need to call these four APIs one by one. <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.logistics.get_shipping_document_parameter?module=95&amp;type=1"><u>v2.logistics.get_shipping_document_parameter</u></a>，<a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.logistics.create_shipping_document?module=95&amp;type=1"><u>v2.logistics.create_shipping_document</u></a>，<a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.logistics.get_shipping_document_result?module=95&amp;type=1"><u>v2.logistics.get_shippping_document_result</u></a>，<a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.logistics.download_shipping_document?module=95&amp;type=1"><u>v2.logistics.download_shipping_document</u></a><u>.</u></p><p>&nbsp;</p><p>6.TW shipping special logic:</p><p>&nbsp;</p><p>a.When calling the <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.logistics.get_shipping_parameter?module=95&amp;type=1"><u>v2.logistics.get_shipping_parameter</u></a> API to get the shipping parameters, the slug parameter is returned, and the slug parameter must be uploaded when calling the <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.logistics.ship_order?module=95&amp;type=1"><u>v2.logistics.ship_order</u></a> API, otherwise the shipment will fail.</p><p>b.For the channel 黑猫宅急便(30001), there is no need to print airway bill. 3PL will provide the airway bill and complete the pickup. Calling v2.logistics.create_shipping_document will report an error: "The package can not print now."</p><h2>8.2 Related APIs for order shipment</h2><figure class="table"><table><thead><tr><th><strong>API&nbsp;</strong></th><th><strong>Description</strong></th></tr></thead><tbody><tr><td><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.order.search_package_list?module=94&amp;type=1"><u>v2.order.search_package_list</u></a></td><td>Get a list of packages which not shipped yet</td></tr><tr><td><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.order.get_package_detail?module=94&amp;type=1">v2.order.get_package_detail</a></td><td>Get package details</td></tr><tr><td><p><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.logistics.get_shipping_parameter?module=95&amp;type=1"><u>v2.logistics.get_shipping_parameter</u></a></p><p><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.logistics.get_mass_shipping_parameter?module=95&amp;type=1"><u>v2.logistics.get_mass_shipping_parameter</u></a></p></td><td>Get shipping parameters</td></tr><tr><td><p><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.logistics.ship_order?module=95&amp;type=1"><u>v2.logistics.ship_order</u></a></p><p><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.logistics.mass_ship_order?module=95&amp;type=1"><u>v2.logistics.mass_ship_order</u></a></p></td><td>Arrange shipment</td></tr><tr><td><p><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.logistics.get_tracking_number?module=95&amp;type=1"><u>v2.logistics.get_tracking_number</u></a></p><p><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.logistics.get_mass_tracking_number?module=95&amp;type=1"><u>v2.logistics.get_mass_tracking_number</u></a></p></td><td>Get tracking number</td></tr><tr><td><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.logistics.get_shipping_document_data_info?module=95&amp;type=1">v2.logistics.get_shipping_document_data_info</a></td><td>Get the information you need to self print airway bill</td></tr><tr><td><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.logistics.get_shipping_document_parameter?module=95&amp;type=1"><u>v2.logistics.get_shipping_document_parameter</u></a></td><td>Access to selectable and recommended airway bill types</td></tr><tr><td><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.logistics.create_shipping_document?module=95&amp;type=1"><u>v2.logistics.create_shipping_document</u></a></td><td>Create airway bill task</td></tr><tr><td><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.logistics.get_shipping_document_result?module=95&amp;type=1"><u>v2.logistics.get_shippping_document_result</u></a></td><td>Get airway bill task result</td></tr><tr><td><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.logistics.download_shipping_document?module=95&amp;type=1"><u>v2.logistics.download_shipping_document</u></a></td><td>Download Shopee generated airway bill</td></tr></tbody></table></figure><h2>8.3 API request example</h2><h3>8.3.1 <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.logistics.get_shipping_parameter?module=95&amp;type=1">v2.logistics.get_shipping_parameter&nbsp;</a></h3><p>Response example:</p><pre><code class="json hljs">{

 &nbsp;&nbsp;&nbsp;"error": "",

 &nbsp;&nbsp;&nbsp;"message": "",

 &nbsp;&nbsp;&nbsp;"response": {

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"info_needed": {

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"dropoff": [],

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"pickup": [

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"address_id",

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"pickup_time_id"

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"dropoff": {

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"branch_list": null

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"pickup": {

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"address_list": [

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"address_id": 2826,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"region": "TH",

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"state": "จังหวัดบึงกาฬ",

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"city": "อำเภอเมืองบึงกาฬ",

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"district": "",

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"town": "",

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"address": "222/58",

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"zipcode": "38000",

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"address_flag": [

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"default_address",

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"pickup_address",

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"return_address"

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;],

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"time_slot_list": [

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"date": 1639472400,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"pickup_time_id": "1639472400"

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"date": 1639558800,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"pickup_time_id": "1639558800"

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"address_id": 3019,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"region": "TH",

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"state": "จังหวัดกระบี่",

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"city": "อำเภอคลองท่อม",

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"district": "",

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"town": "",

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"address": "home 1234",

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"zipcode": "81120",

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"address_flag": [],

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"time_slot_list": [

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"date": 1639472400,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"pickup_time_id": "1639472400"

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"date": 1639558800,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"pickup_time_id": "1639558800"

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}

 &nbsp;&nbsp;&nbsp;},

 &nbsp;&nbsp;&nbsp;"request_id": "33d8460efcd7313ac5b8337b54ff4b07"

}</code></pre><p>&nbsp;</p><p><span style="color:#EE4D2D;"><strong>Note: The info_needed field indicates the shipping method supported by the order and the parameters that need to be uploaded when you ship order. This example order supports dropoff or pickup method. If dropoff method is selected, there is no need to upload relevant parameters. If pickup is selected, you need to upload address_id and pickup_time_id parameters. If info_needed only returns dropoff, it means that the order only supports dropoff.</strong></span></p><h3>8.3.2. <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.logistics.ship_order?module=95&amp;type=1">v2.logistics.ship_order</a></h3><p>1) Selecting the pickup method:</p><p>When the pickup parameter returned by info_needed in v2.logistics.get_shipping_parameter contains address_id and pickup_time_id.</p><pre><code class="json hljs">{

 &nbsp;&nbsp;&nbsp;"order_sn": "2112132KQ1MK9N",

 &nbsp;&nbsp;&nbsp;"pickup": {

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"address_id": 2826,

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"pickup_time_id": "1639472400"

 &nbsp;&nbsp;&nbsp;}

}</code></pre><p>&nbsp;</p><p>2) Selecting the dropoff method</p><p>When the dropoff parameter returned by info_needed in v2.logistics.get_shipping_parameter is empty</p><pre><code class="json hljs">{

 &nbsp;&nbsp;&nbsp;"order_sn": "220301QQY0WASP",

 &nbsp;&nbsp;&nbsp;"dropoff": {}

}</code></pre><p>&nbsp;</p><p><strong>Note: some channels for drop</strong></p><p><strong>off methods have a direct return of empty fields, you need to pass in the empty field, such as the example. If other parameters are returned, upload other parameters, for example:</strong></p><pre><code class="json hljs">{
 &nbsp;&nbsp;&nbsp;"order_sn": "220301QQY0WASP",
 &nbsp;&nbsp;&nbsp;"dropoff": {
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"sender_real_name": "ABC"
  }
}</code></pre><p>&nbsp;</p><p>&nbsp;</p><p>3) Selecting the non_integrated method</p><p>When the non_integrated parameter returned by info_needed in v2.logistics.get_shipping_parameter is tracking_number</p><pre><code class="json hljs">{
 &nbsp;&nbsp;&nbsp;"order_sn": "220301QQY0WASP",
 &nbsp;&nbsp;&nbsp;"non_integrated": {
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"tracking_number": "AK224200239740W"
 &nbsp;&nbsp;&nbsp;}
}</code></pre><h3>8.3.3 <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.logistics.update_shipping_order?module=95&amp;type=1">v2.logistics.update_shipping_order&nbsp;</a></h3><pre><code class="json hljs">{
 &nbsp;&nbsp;&nbsp;"order_sn": "2112132KQ1MK9N",
 &nbsp;&nbsp;&nbsp;"pickup": {
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"address_id": 11178,
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"pickup_time_id": "1658563200"
 &nbsp;&nbsp;&nbsp;}
}</code></pre><p>&nbsp;</p><p>Used for pickup order to update address_id and pickup_time_id. Applicable to orders in <strong>RETRY_SHIP</strong> status.</p><h1>9. FAQ</h1><h2>Order related</h2><p>Q: Call <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.order.get_order_list?module=94&amp;type=1"><u>v2.order.get_order_detail</u></a> API and report error "Wrong parameters, detail: the order is not found.</p><p>A: Can check this <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/faq/192">FAQ</a>.</p><p>&nbsp;</p><p>Q:Call <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.order.get_order_list?module=94&amp;type=1"><u>v2.order.get_order_detail</u></a> API, many response fields are missing, what should I do?</p><p>A Please check whether the response_optional_fields field is selected to upload the corresponding field, please refer to the <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.order.get_order_detail?module=94&amp;type=1"><u>API documentatio</u>n</a> for details.</p><h2>Shipping related</h2><p>&nbsp;</p><p>Q: Why I can't get the time slot?</p><p>A: If you can't get it, the order may have been shipped or ship_by_day has passed.&nbsp;</p><p>&nbsp;</p><p>Q: I got the error "logistic status not ready to ship". How to check?</p><p>A:Please call <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.order.get_order_detail?module=94&amp;type=1"><u>v2.order.get_order_detail</u></a><u> </u>API to get the order status. Only orders with <strong>READY_TO_SHIP</strong> status can be shipped.&nbsp;</p><p>&nbsp;</p><p>Q: Call <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.logistics.get_tracking_number?module=95&amp;type=1"><u>v2.logistics.get_tracking_number</u></a> API but no <strong>first_mile_tracking_number</strong> is returned, what do I need to do?</p><p>A: Please check whether the response_optional_fields field is selected to upload the corresponding field, please refer to the <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.logistics.get_tracking_number?module=95&amp;type=1"><u>API documentation</u></a> for details.</p><h2>Airway Bill related</h2><p>Q: Call <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.logistics.create_shipping_document?module=95&amp;type=1"><u>v2.logistics.create_shipping_document</u></a> API, prompt error "Order status does not support awb printing".</p><p>A: Please call <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.order.get_order_detail?module=94&amp;type=1"><u>v2.order.get_order_detail</u></a> API to get order_status, only supports to get under order_status is <strong>PROCESSED</strong>.</p><p>&nbsp;</p><p>Q: Call <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.logistics.get_shipping_document_result?module=95&amp;type=1"><u>v2.logistics.get_shipping_document_result</u></a> API and get the status of "<strong>PROCESSING</strong>" how to deal with it?</p><p>A: It is recommended to call the API cyclically until you get to the "READY" status.</p><p>&nbsp;</p><p>Q: How many types of Airway bill files are there?</p><p>A: There are three formats：</p><ul><li>Most orders' airway bill are PDF file.</li><li>TW C2C channels all return airway bills is html format, B2C channels except 7-ELEVEN (channel_id: 30005), Family Family (channel_id: 30006), Lai Erfu (channel_id: 30007), Family Family Frozen Super Pickup (not sent to outlying islands) ( channel_id: 30011), OK Mart (channel_id: 30014) are printed in pdf format, and others are returned html.</li><li>If the printing method set in the seller center is thermal printing, the zip format folder is returned.</li></ul><p>&nbsp;</p><h1>10. Data Definition</h1><h2>Order Status</h2><ul><li>UNPAID<span style="background-color:rgb(255,255,255);color:rgb(43,44,45);">:</span><span style="background-color:rgb(255,255,255);">Order is created, buyer has not paid yet.</span>&nbsp;&nbsp;&nbsp;</li><li>READY_TO_SHIP<span style="background-color:rgb(255,255,255);color:rgb(43,44,45);">:</span><span style="background-color:rgb(255,255,255);">Seller can arrange shipment.</span></li><li><span style="background-color:rgb(255,255,255);color:rgb(43,44,45);">PROCESSED:</span><span style="background-color:rgb(255,255,255);">Seller has arranged shipment online and got tracking number from 3PL.</span></li><li>SHIPPED<span style="background-color:rgb(255,255,255);color:rgb(43,44,45);">:</span><span style="background-color:rgb(255,255,255);">The parcel has been drop to 3PL or picked up by 3PL.</span></li><li>TO_CONFIRM_RECEIVE<span style="background-color:rgb(255,255,255);color:rgb(43,44,45);">:</span><span style="background-color:rgb(255,255,255);">The order has been received by buyer.</span></li><li>COMPLETED<span style="background-color:rgb(255,255,255);color:rgb(43,44,45);">:The order has been completed.</span></li><li>RETRY_SHIP<span style="background-color:rgb(255,255,255);color:rgb(43,44,45);">:</span><span style="background-color:rgb(255,255,255);">3PL pickup parcel fail. Need to re arrange shipment.</span></li><li>IN_CANCEL<span style="background-color:rgb(255,255,255);color:rgb(43,44,45);">:</span><span style="background-color:rgb(255,255,255);">The order's cancelation is under processing.</span></li><li>CANCELLED<span style="background-color:rgb(255,255,255);color:rgb(43,44,45);">:The order has been canceled.</span></li><li>TO_RETURN<span style="background-color:rgb(255,255,255);color:rgb(43,44,45);">:The buyer requested to return the order and order's return is processing.</span></li></ul><h2><span style="background-color:rgb(255,255,255);color:rgb(43,44,45);">Package Status</span></h2><ul><li>All: Fetch all packages that are Pending, ToProcess, or Processed, value 0.</li><li>Pending: Fetch packages that are not ready for shipment, value 1.</li><li>ToProcess: Fetch packages that need to arrange shipment, value 2.</li><li>Processed: Fetch packages that have been arranged shipment, value 3.</li></ul><p>&nbsp;</p><p>Note:&nbsp;</p><p>Package Status takes the same effect as Order Status filter under To Ship tab in Seller Center, the mapping between Package Status, Package Fulfillment Status and Seller Center Order Status filter is as follows:</p><figure class="table"><table><thead><tr><th>Package Status</th><th>Package Fulfillment Status</th><th>Order Status filter under To Ship tab in Seller Center</th></tr></thead><tbody><tr><td>All (0)</td><td>LOGISTICS_NOT_START, LOGISTICS_READY, LOGISTICS_PICKUP_RETRY, or LOGISTICS_REQUEST_CREATED</td><td>All</td></tr><tr><td>Pending (1)</td><td>LOGISTICS_NOT_START</td><td>Pending</td></tr><tr><td>ToProcess (2)</td><td>LOGISTICS_READY or LOGISTICS_PICKUP_RETRY</td><td>To Process</td></tr><tr><td>Processed (3)</td><td>LOGISTICS_REQUEST_CREATED</td><td>Processed</td></tr></tbody></table></figure><h2>Package Fulfillment Status / Logistics Status</h2><ul><li><span style="color:rgb(43,44,45);">LOGISTICS_NOT_START: Initial status, package not ready for fulfillment</span></li><li><span style="color:rgb(43,44,45);">LOGISTICS_READY: Package ready for fulfillment from payment perspective. For non-COD: &nbsp;paid; forCOD: passed COD screening</span></li><li><span style="color:rgb(43,44,45);">LOGISTICS_REQUEST_CREATED: Package arranged shipment</span></li><li><span style="color:rgb(43,44,45);">LOGISTICS_PICKUP_DONE: Package handed over to 3PL</span></li><li><span style="color:rgb(43,44,45);">LOGISTICS_DELIVERY_DONE: Package successfully delivered</span></li><li><span style="color:rgb(43,44,45);">LOGISTICS_INVALID: Order cancelled when package at LOGISTICS_READY</span></li><li><span style="color:rgb(43,44,45);">LOGISTICS_REQUEST_CANCELED: Order cancelled when package at LOGISTICS_REQUEST_CREATED</span></li><li><span style="color:rgb(43,44,45);">LOGISTICS_PICKUP_FAILED: Order cancelled by 3PL due to failed pickup or picked up but not able to proceed with delivery</span></li><li><span style="color:rgb(43,44,45);">LOGISTICS_PICKUP_RETRY: Package pending 3PL retry pickup</span></li><li><span style="color:rgb(43,44,45);">LOGISTICS_DELIVERY_FAILED: Order cancelled due to 3PL delivery failed</span></li><li><span style="color:rgb(43,44,45);">LOGISTICS_LOST: Order cancelled due to 3PL lost the Package</span></li></ul><p>&nbsp;</p><p><span style="color:rgb(43,44,45);">Note: Due to legacy logic, the package logistics status in get_order_detail will return 2 additional values:&nbsp;</span></p><ul><li><span style="color:rgb(43,44,45);">LOGISTICS_PENDING_ARRANGE:order logistics pending arrangement</span></li><li><span style="color:rgb(43,44,45);">LOGISTICS_COD_REJECTED:Integrated logistics COD: Order rejected for COD</span></li></ul><h2>Order cancellation reason&nbsp;</h2><ul><li>OUT_OF_STOCK</li><li>UNDELIVERABLE_AREA</li></ul><h2><span style="background-color:rgb(255,255,255);color:rgb(43,44,45);">Cancel reason</span></h2><p>&nbsp;</p><ul><li><span style="color:rgb(43,44,45);">Out of Stock</span></li><li><span style="color:rgb(43,44,45);">Buyer Request to Cancel</span></li><li><span style="color:rgb(43,44,45);">Undeliverable Area</span></li><li><span style="color:rgb(43,44,45);">COD Unsupported</span></li><li><span style="color:rgb(43,44,45);">Parcel is Lost</span></li><li><span style="color:rgb(43,44,45);">Game Completed</span></li><li><span style="color:rgb(43,44,45);">Unpaid Order</span></li><li><span style="color:rgb(43,44,45);">Underpaid Order</span></li><li><span style="color:rgb(43,44,45);">Unsuccessful / Rejected Payment</span></li><li><span style="color:rgb(43,44,45);">Logistics Request is Cancelled</span></li><li><span style="color:rgb(43,44,45);">3PL pickup Fail</span></li><li><span style="color:rgb(43,44,45);">Failed Delivery</span></li><li><span style="color:rgb(43,44,45);">COD Rejected</span></li><li><span style="color:rgb(43,44,45);">Seller did not Ship</span></li><li><span style="color:rgb(43,44,45);">Transit Warehouse Cancelled</span></li><li><span style="color:rgb(43,44,45);">Other</span></li><li><span style="color:rgb(43,44,45);">Inactive Seller</span></li><li><span style="color:rgb(43,44,45);">Seller did not Ship</span></li><li><span style="color:rgb(43,44,45);">Auto Cancel</span></li><li><span style="color:rgb(43,44,45);">Logistic Issue</span></li><li>Your approver did not approve order on time.</li><li>You are unable to place order at the moment.</li><li>TBC</li></ul><h2><span style="background-color:rgb(255,255,255);color:rgb(43,44,45);">Buyer cancel reason</span></h2><p>&nbsp;</p><ul><li><span style="color:rgb(43,44,45);">Seller is not Responsive to buyer's Inquires</span></li><li><span style="color:rgb(43,44,45);">Seller ask Buyer to Cancel</span></li><li><span style="color:rgb(43,44,45);">Modify Existing Order</span></li><li><span style="color:rgb(43,44,45);">Product has Bad Reviews</span></li><li><span style="color:rgb(43,44,45);">Seller Takes too Long to Ship T</span>he Order</li><li>Seller is Untrustworthy</li><li>Others</li><li>Forgot to Input Voucher Code</li><li>Need to change delivery address</li><li>Need to Change Delivery Address</li><li>Need to input / Change Voucher Code</li><li>Need to Modify Order</li><li>Payment Procedure too Troublesome</li><li>Found Cheaper Elsewhere</li><li>Don't Want to Buy Anymore</li><li>Your approver rejected the order.</li><li>You are unable to place order at the moment.</li><li>Need to change delivery address</li><li>Too long delivery time</li><li>Modify existing order (color, size, voucher, etc)</li><li>Change of mind / others</li></ul><h2><span style="background-color:rgb(255,255,255);color:rgb(43,44,45);">Shipping document type</span></h2><p>&nbsp;</p><ul><li>NORMAL_AIR_WAYBILL</li><li>THERMAL_AIR_WAYBILL</li><li>NORMAL_JOB_AIR_WAYBILL</li><li>THERMAL_JOB_AIR_WAYBILL</li></ul><h2>Package logistics track status&nbsp;</h2><p>（for <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.logistics.get_tracking_info?module=95&amp;type=1">get_tracking_info</a> api）</p><ul><li>INITIAL</li><li>ORDER_INIT</li><li>ORDER_SUBMITTED</li><li>ORDER_FINALIZED</li><li>ORDER_CREATED</li><li>PICKUP_REQUESTED</li><li>PICKUP_PENDING</li><li>PICKED_UP</li><li>DELIVERY_PENDING</li><li>DELIVERED</li><li>PICKUP_RETRY</li><li>TIMEOUT</li><li>LOST</li><li>UPDATE</li><li>UPDATE_SUBMITTED</li><li>UPDATE_CREATED</li><li>RETURN_STARTED</li><li>RETURNED</li><li>RETURN_PENDING</li><li>RETURN_INITIATED</li><li>EXPIRED</li><li>CANCEL</li><li>CANCEL_CREATED</li><li>CANCELED</li><li>FAILED_ORDER_INIT</li><li>FAILED_ORDER_SUBMITTED</li><li>FAILED_ORDER_CREATED</li><li>FAILED_PICKUP_REQUESTED</li><li>FAILED_PICKED_UP</li><li>FAILED_DELIVERED</li><li>FAILED_UPDATE_SUBMITTED</li><li>FAILED_UPDATE_CREATED</li><li>FAILED_RETURN_STARTED</li><li>FAILED_RETURNED</li><li>FAILED_CANCEL_CREATED</li><li>FAILED_CANCELED</li></ul>
```
