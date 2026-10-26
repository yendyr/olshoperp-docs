# Get Available Review Decisions

> **Source:** [https://partner.tiktokshop.com/docv2/page/get-available-review-decisions-202606](https://partner.tiktokshop.com/docv2/page/get-available-review-decisions-202606)
> **Category:** Return and refund
> **document_path:** `get-available-review-decisions-202606`

## Description

Description of [GET]/return_refund/:version/Get_Review_Decision

## Required scope

seller.return_refund.basic

## Path

`/return_refund/202606/review_decision`

## Method

`GET`

## Request Header

| Properties | Type | Required | Properties description |
| --- | --- | --- | --- |
| content-type | string | Y | Allowed type: application/json |
| x-tts-access-token | string | Y | The seller access_token value from [Get Access Token](https://partner.tiktokshop.com/docv2/page/678e3a3292b0f40314a92d75#Get%20Access%20Token%20API), when user_type = 0. Follow this [guide](https://partner.tiktokshop.com/docv2/page/678e3a344ddec3030b238fa0) to get seller access_token. |

## Query Header

| Properties | Type | Required | Properties description |
| --- | --- | --- | --- |
| seller_id | int | Y | The unique identifier of the seller/shop  |
| return_or_cancel_id | string | Y | The identifier of the aftersales request to evaluate. Pass a reverse main order ID, aftersales request ID, or return merchandise authorization (RMA) ID; the API detects which type was provided. Do not pass an order ID or order line ID. |
| locale | string | N | The BCP-47 locale codes for displaying the return reason, delimited by commas. Default: en-US<br>Refer to [Locale codes](678e3a47bae28f030a8c7523) for the list of supported locale codes. |
| check_decisions | []string | N | The seller decisions to evaluate for the specified aftersales request. Possible values:<br>- `APPROVE_REQUEST_CANCEL`<br>- `APPROVE_REFUND`<br>- `APPROVE_RETURN`<br>- `APPROVE_RECEIVED_PACKAGE`<br>- `APPROVE_REPLACEMENT`<br>- `ISSUE_REPLACEMENT_REFUND`<br>- `DIRECT_REFUND`<br>- `REJECT_REQUEST_CANCEL`<br>- `REJECT_REFUND`<br>- `REJECT_RETURN`<br>- `REJECT_RECEIVED_PACKAGE`<br>- `REJECT_REPLACEMENT`<br>- `ISSUE_EXCHANGE_REFUND`<br>- `OFFER_PARTIAL_REFUND`<br>- `OFFER_PARTIAL_REFUND_AFTER_RECEIVING_PKG`<br>**Note:** When omitted, the API evaluates all supported seller decisions for the request and returns one result per decision. |
| shop_cipher | string | Y | Use this property to pass shop information in requesting the API. Failure in passing the correct value when requesting the API for cross-border shops will return incorrect response. <br>Get by API [Get Authorization Shop](https://partner.tiktokshop.com/docv2/page/6507ead7b99d5302be949ba9?external_id=6507ead7b99d5302be949ba9) |

## Request Body

| Properties | Type | Required | Properties description |
| --- | --- | --- | --- |

## Code Example

### Curl

```shell
curl -X GET \
 'https://open-api.tiktokglobalshop.com/return_refund/202606/review_decision?timestamp=1623812664&shop_cipher=GCP_XF90igAAAABh00qsWgtvOiGFNqyubMt3&seller_id=7494781899660428507&return_or_cancel_id=4035319218955782461&locale=en-US&check_decisions=APPROVE_REFUND,REJECT_RETURN&app_key=29a39d&sign=bc721f0e0182914e3487b81df204de37a352fc3aa96947efda6dc1e5dd0d5290' \
-H 'content-type: application/json' \
-H 'x-tts-access-token: TTP_pwSm2AAAAABmmtFz1xlyKMnwg74T2GJ5s0uQbS8jPjb_GkdFVCxPqzQXSyuyfXdQa0AqyDsea2tYFNVf4XeqgZHFfPyv0Vs659QqyLYfsGzanZ5XZAin3_ZkcIxxS0_In6u6XDeU96k'

```

### Go

```go
// For more details about the SDK, refer to the documentation:
// https://partner.tiktokshop.com/docv2/page/67c83e0799a75104986ae498
func returnRefund202606GetAvailableReviewDecisionsGet() {
    configuration := apis.NewConfiguration()
    configuration.AddAppInfo(appKey, appSecret)
    apiClient := apis.NewAPIClient(configuration)
    request := apiClient.ReturnRefundV202606API.ReturnRefund202606ReviewDecisionGet(context.Background())
    request = request.XTtsAccessToken("your access token")
    request = request.ContentType("application/json")
    request = request.SellerId(7494781899660428507)
    request = request.ReturnOrCancelId("4035319218955782461")
    request = request.Locale("en-US")
    request = request.CheckDecisions([])
    request = request.ShopCipher("your shop cipher")
    resp, httpResp, err := request.Execute()
    if err != nil || httpResp.StatusCode != 200 {
        fmt.Printf("productsRequest err:%v resbody:%s", err, httpResp.Body)
        return
    }
    if resp == nil {
        fmt.Printf("response is nil")
        return
    }
    if resp.GetCode()!= 0 {
        fmt.Printf("response business is error, errorCode:%d errorMessage:%s", resp.GetCode(), resp.GetMessage())
        return
    }
    respDataJson, _ := json.MarshalIndent(resp.GetData(), "", "  ")
    fmt.Println("response data:", string(respDataJson))
    return
}

```

### Node.js

```typescript
// For more details about the SDK, refer to the documentation:
// https://partner.tiktokshop.com/docv2/page/67c83e0799a75104986ae498
async function returnRefund202606GetAvailableReviewDecisionsGet() {
    const result = await client.api.ReturnRefundV202606Api.ReviewDecisionGet(7494781899660428507, "4035319218955782461", "your access token", "application/json", "en-US", [], "your shop cipher");
    console.log('response: ', JSON.stringify(result, null, 2));
}

```

### Java

```java
// For more details about the SDK, refer to the documentation:
// https://partner.tiktokshop.com/docv2/page/67c83e0799a75104986ae498
public void returnRefund202606GetAvailableReviewDecisionsGet() throws Exception {
    ApiClient defaultClient = Configuration.getDefaultApiClient()
            .setAppkey("your appKey")
            .setSecret("your secret")
            .setBasePath("https://open-api.tiktokglobalshop.com");
    ReturnRefundV202606Api apiInstance = new ReturnRefundV202606Api(defaultClient);
    GetAvailableReviewDecisionsResponse result = apiInstance.returnRefund202606ReviewDecisionGet(7494781899660428507L, "4035319218955782461", "your access token", "application/json", "en-US", [], "your shop cipher");
    System.out.println(result);
}

```

## Response Parameters

| Properties | Type | Sample | Properties description |
| --- | --- | --- | --- |
| code | int | 0 | The success or failure status code returned in API response. |
| message | string | Success | The success or failure messages returned in API response. Reasons of failure will be described in the message. |
| request_id | string | 202203070749000101890810281E8C70B7 | Request log |
| data | object |  | Specific return information |
| ^line_items | []object |  | Line items to which the returned decisions apply. Decision details apply to each line item individually. For example, a partial refund amount of 1.00 for each of three line items results in a total of 3.00; use the `currency` returned with the amount range rather than assuming a currency. |
| ^^return_line_item_id | string | 4035319218955782461 | Unique identifier for this item in the return. In the case of virtual bundle, this corresponds to the id of the original parent item bundle. |
| ^^sub_return_line_item_id | string | 4035227657962164815 | Unique identifier for this item in the return. In the case of virtual bundle, this corresponds to the id of the current child item being returned. |
| ^^decisions | []object |  | The list of candidate review decisions for this line item. |
| ^^^decision | string | OFFER_PARTIAL_REFUND_AFTER_RECEIVING_PKG | Seller review decision evaluated for this line item.<br>Possible values:<br>- `APPROVE_REQUEST_CANCEL`<br>- `APPROVE_REFUND`<br>- `APPROVE_RETURN`<br>- `APPROVE_RECEIVED_PACKAGE`<br>- `APPROVE_REPLACEMENT`<br>- `ISSUE_REPLACEMENT_REFUND`<br>- `DIRECT_REFUND`<br>- `REJECT_REQUEST_CANCEL`<br>- `REJECT_REFUND`<br>- `REJECT_RETURN`<br>- `REJECT_RECEIVED_PACKAGE`<br>- `REJECT_REPLACEMENT`<br>- `ISSUE_EXCHANGE_REFUND`<br>- `OFFER_PARTIAL_REFUND`<br>- `OFFER_PARTIAL_REFUND_AFTER_RECEIVING_PKG` |
| ^^^eligible | bool | false | Whether this decision is currently eligible for the line item. When `false`, `ineligible_code` and `ineligible_reason` explain why the decision is ineligible; these fields are omitted when `true`. |
| ^^^ineligible_code | int | 25005020 | The reason code for an ineligible decision. |
| ^^^ineligible_reason | string | the return is already completed, you can't approve again. | The reason for an ineligible decision. |
| ^^^available_reject_reasons | []object |  | Rejection reasons, if available, for this eligible decision. Each item contains a machine-readable name and display text. |
| ^^^^name | string | seller_reject_apply_product_has_been_packed | The machine-readable name of the rejection reason to pass as the rejection-reason identifier in the applicable review or reject request. |
| ^^^^text | string | The display text for the reject reason. | The display text for the rejection reason. |
| ^^^partial_refund_amount_range | object |  | The allowed partial refund amount band. Returned for the `OFFER_PARTIAL_REFUND_AFTER_RECEIVING_PKG` decision when it is eligible; omitted for all other decisions. |
| ^^^^min_amount | string | 2.34 | The minimum partial refund amount the seller may offer. |
| ^^^^max_amount | string | 3.33 | The maximum partial refund amount the seller may offer. |
| ^^^^currency | string | USD | The currency of the partial refund amount range, matching the currency of the current return request. |
| ^request_log_id | string | 20260713225708FB… | The log id of this request, used for troubleshooting with TikTok Shop support. |
| ^errors | []object |  | Lists errors for partially failed requests. For example, if a request reviews multiple orders or items and only some fail, individual error details are returned here.<br>**IMPORTANT**: Partial failures still return a top-level success code (0), so clients must also check this field to detect partial errors. For complete failures (e.g. validation errors), the top-level response code and message will indicate a failure, but this field will remain empty. |
| ^^code | string | 98001004 | Error Code |
| ^^message | string | Invalid parameters. Please verify your input before retrying | Error Description |

## Example

```json
{
  "code": 0,
  "data": {
    "line_items": [
      {
        "return_line_item_id": "4035319218955782461",
        "sub_return_line_item_id": "4035227657962164815",
        "decisions": [
          {
            "decision": "OFFER_PARTIAL_REFUND_AFTER_RECEIVING_PKG",
            "eligible": false,
            "ineligible_code": 25005020,
            "ineligible_reason": "the return is already completed, you can't approve again.",
            "available_reject_reasons": [
              {
                "name": "seller_reject_apply_product_has_been_packed",
                "text": "The display text for the reject reason."
              }
            ],
            "partial_refund_amount_range": {
              "min_amount": "2.34",
              "max_amount": "3.33",
              "currency": "USD"
            }
          }
        ]
      }
    ],
    "request_log_id": "20260713225708FB…",
    "errors": [
      {
        "code": "98001004",
        "message": "Invalid parameters. Please verify your input before retrying"
      }
    ]
  },
  "message": "Success",
  "request_id": "202203070749000101890810281E8C70B7"
}
```

## Error Code

| Code | Message |
| --- | --- |
| 25001003 | Invalid order status. |
| 25005020 | reverse amount not support partial refund |
| 25005021 | partial refund only support single sku |
| 25011010 | request has been transferred to platform operator |
| 25011011 | reverse status cannot reject application |
| 25011012 | reverse status cannot approve application |
