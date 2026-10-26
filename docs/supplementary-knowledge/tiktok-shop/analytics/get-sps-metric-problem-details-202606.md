# Get SPS Metric Problem Details 

> **Source:** [https://partner.tiktokshop.com/docv2/page/get-sps-metric-problem-details-202606](https://partner.tiktokshop.com/docv2/page/get-sps-metric-problem-details-202606)
> **Category:** Analytics
> **document_path:** `get-sps-metric-problem-details-202606`

## Description

Returns problem order or chat details for a selected SPS metric. 
Shop Performance Score (SPS) reflects a shop’s performance across key operational and service metrics on TikTok Shop. By integrating the read-only SPS APIs, ISVs can retrieve a shop’s score, tier, benefits, and metric benchmarks, diagnose performance gaps, and drill down to the products, logistics providers, aftersales types, orders, or chats associated with specific issues. This enables ISVs to embed actionable performance insights into their solutions, helping merchants identify problem areas faster and take targeted actions to improve shop performance. Available only for US-region shops.
Use case guide: [Click here](https://partner.tiktokshop.com/docv2/page/ph0ccose)

## Required scope

data.shop_analytics.public.read

## Path

`/analytics/202606/shop_performances/metrics/{metric_code}/problem_details`

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
| locale | string | N | BCP 47 locale code used to localize response text. If omitted, the default locale is resolved from the request context. |
| page_token | string | N | For the first page, leave this parameter empty. For later pages, pass the opaque `next_page_token` returned by the previous response unchanged and use the same `page_size`. |
| page_size | int | N | The number of results to return per page. Minimum value is 1. Default value is 10. Maximum value is 50. |
| shop_cipher | string | Y | Use this property to pass shop information in requesting the API. Failure in passing the correct value when requesting the API for cross-border shops will return incorrect response. <br>Get by API [Get Authorization Shop](https://partner.tiktokshop.com/docv2/page/6507ead7b99d5302be949ba9?external_id=6507ead7b99d5302be949ba9) |

## Request Body

| Properties | Type | Required | Properties description |
| --- | --- | --- | --- |

## Code Example

### Curl

```shell
curl -X GET \
 'https://open-api.tiktokglobalshop.com/analytics/202606/shop_performances/metrics/NRR/problem_details?locale=en-US&page_token=2&page_size=10&app_key=29a39d&sign=bc721f0e0182914e3487b81df204de37a352fc3aa96947efda6dc1e5dd0d5290&timestamp=1623812664&shop_cipher=GCP_XF90igAAAABh00qsWgtvOiGFNqyubMt3' \
-H 'content-type: application/json' \
-H 'x-tts-access-token: TTP_pwSm2AAAAABmmtFz1xlyKMnwg74T2GJ5s0uQbS8jPjb_GkdFVCxPqzQXSyuyfXdQa0AqyDsea2tYFNVf4XeqgZHFfPyv0Vs659QqyLYfsGzanZ5XZAin3_ZkcIxxS0_In6u6XDeU96k'

```

### Go

```go
// For more details about the SDK, refer to the documentation:
// https://partner.tiktokshop.com/docv2/page/67c83e0799a75104986ae498
func analytics202606GetSPSMetricProblemDetailsGet() {
    configuration := apis.NewConfiguration()
    configuration.AddAppInfo(appKey, appSecret)
    apiClient := apis.NewAPIClient(configuration)
    request := apiClient.AnalyticsV202606API.Analytics202606ShopPerformancesMetricsMetricCodeProblemDetailsGet(context.Background(), "NRR")
    request = request.XTtsAccessToken("your access token")
    request = request.ContentType("application/json")
    request = request.Locale("en-US")
    request = request.PageToken("2")
    request = request.PageSize(10)
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
async function analytics202606GetSPSMetricProblemDetailsGet() {
    const result = await client.api.AnalyticsV202606Api.ShopPerformancesMetricsMetricCodeProblemDetailsGet("NRR", "your access token", "application/json", "en-US", "2", 10, "your shop cipher");
    console.log('response: ', JSON.stringify(result, null, 2));
}

```

### Java

```java
// For more details about the SDK, refer to the documentation:
// https://partner.tiktokshop.com/docv2/page/67c83e0799a75104986ae498
public void analytics202606GetSPSMetricProblemDetailsGet() throws Exception {
    ApiClient defaultClient = Configuration.getDefaultApiClient()
            .setAppkey("your appKey")
            .setSecret("your secret")
            .setBasePath("https://open-api.tiktokglobalshop.com");
    AnalyticsV202606Api apiInstance = new AnalyticsV202606Api(defaultClient);
    GetSPSMetricProblemDetailsResponse result = apiInstance.analytics202606ShopPerformancesMetricsMetricCodeProblemDetailsGet("NRR", "your access token", "application/json", "en-US", "2", 10, "your shop cipher");
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
| ^aht_problem_order_items | []object |  | AHT problem order items. |
| ^^aftersales_type_name | string | Only Return | Aftersales type returned by TikTok Shop aftersales classification. |
| ^^approve_duration_hours | string | 12.5 | Approval duration in hours. |
| ^^inspect_duration_hours | string | 30.0 | Inspection duration in hours. |
| ^^order_id | string | 576461413038785752 | Order ID. |
| ^^return_order_id | string | 576461413038785753 | Return order ID. |
| ^^review_count | int | 2 | Number of review rounds. |
| ^^total_handle_duration_hours | string | 42.5 | Total aftersales handle duration in hours. |
| ^im_dsat_chat_items | []object |  | IM_DSAT chat session items. |
| ^^chat_duration_hours | string | 1.5 | Chat duration in hours. |
| ^^chat_record_id | string | 745961413038785752 | Chat record ID. |
| ^^customer_name | string | J*** D*** | Masked customer name. |
| ^^customer_rating | int | 2 | Customer rating from 1 to 5. |
| ^^first_reply_time | int | 1761264060 | First reply time. Unix timestamp in seconds. |
| ^^rating_reasons | []string | ["other"] | Customer rating reasons. |
| ^^service_agent | string | Agent A | Service agent name. |
| ^metric_code | string | NRR | Stable metric code. Possible values: NRR, NBFR, SFCR, OTDR, AHT, and IM_DSAT. |
| ^nbfr_problem_order_items | []object |  | NBFR problem order items. |
| ^^deliver_time | int | 1761523200 | Delivery time. Unix timestamp in seconds. |
| ^^order_create_time | int | 1761264000 | Order creation time. Unix timestamp in seconds. |
| ^^order_id | string | 576461413038785752 | Order ID. |
| ^^product_id | string | 1729592969712207010 | Product ID, when available. |
| ^^product_name | string | Cotton T-Shirt | Product name. |
| ^^return_refund_reason | string | Wrong size | Return or refund reason. |
| ^^sku_id | string | 1729592969712207013 | SKU ID. |
| ^next_page_token | string | 2 | An opaque token used to retrieve the next page of a paginated result set. Returns an empty string when there are no more results. |
| ^nrr_problem_order_items | []object |  | NRR problem order items. |
| ^^deliver_time | int | 1761523200 | Delivery time. Unix timestamp in seconds. |
| ^^order_create_time | int | 1761264000 | Order creation time. Unix timestamp in seconds. |
| ^^order_id | string | 576461413038785752 | Order ID. |
| ^^product_id | string | 1729592969712207008 | Product ID, when available. |
| ^^product_name | string | Wireless Headphones | Product name. |
| ^^sku_id | string | 1729592969712207012 | SKU ID. |
| ^^user_review_rating | int | 2 | User review rating from 1 to 5. |
| ^otdr_problem_order_items | []object |  | OTDR problem order items. |
| ^^actual_deliver_time | int | 1761609600 | Actual deliver time. Unix timestamp in seconds. |
| ^^expect_deliver_time | int | 1761523200 | Expected deliver time. Unix timestamp in seconds. |
| ^^order_id | string | 576461413038785752 | Order ID. |
| ^^product_name | string | Wireless Headphones | Product name. |
| ^^sku_id | string | 1729592969712207014 | SKU ID. |
| ^sfcr_problem_order_items | []object |  | SFCR problem order items. |
| ^^cancellation_reasons | []string | ["Defective item"] | Cancellation reasons. |
| ^^order_create_time | int | 1761264000 | Order creation time. Unix timestamp in seconds. |
| ^^order_id | string | 576461413038785752 | Order ID. |
| ^^product_id | string | 1729592969712207011 | Product ID, when available. |
| ^^product_name | string | Smart Watch | Product name. |
| ^^sku_id | string | 1729592969712207014 | SKU ID. |
| ^total_count | int | 200 | Total number of available records. |

## Example

```json
{
  "code": 0,
  "data": {
    "aht_problem_order_items": [
      {
        "aftersales_type_name": "Only Return",
        "approve_duration_hours": "12.5",
        "inspect_duration_hours": "30.0",
        "order_id": "576461413038785752",
        "return_order_id": "576461413038785753",
        "review_count": 2,
        "total_handle_duration_hours": "42.5"
      }
    ],
    "im_dsat_chat_items": [
      {
        "chat_duration_hours": "1.5",
        "chat_record_id": "745961413038785752",
        "customer_name": "J*** D***",
        "customer_rating": 2,
        "first_reply_time": 1761264060,
        "rating_reasons": [
          "other"
        ],
        "service_agent": "Agent A"
      }
    ],
    "metric_code": "NRR",
    "nbfr_problem_order_items": [
      {
        "deliver_time": 1761523200,
        "order_create_time": 1761264000,
        "order_id": "576461413038785752",
        "product_id": "1729592969712207010",
        "product_name": "Cotton T-Shirt",
        "return_refund_reason": "Wrong size",
        "sku_id": "1729592969712207013"
      }
    ],
    "next_page_token": "2",
    "nrr_problem_order_items": [
      {
        "deliver_time": 1761523200,
        "order_create_time": 1761264000,
        "order_id": "576461413038785752",
        "product_id": "1729592969712207008",
        "product_name": "Wireless Headphones",
        "sku_id": "1729592969712207012",
        "user_review_rating": 2
      }
    ],
    "otdr_problem_order_items": [
      {
        "actual_deliver_time": 1761609600,
        "expect_deliver_time": 1761523200,
        "order_id": "576461413038785752",
        "product_name": "Wireless Headphones",
        "sku_id": "1729592969712207014"
      }
    ],
    "sfcr_problem_order_items": [
      {
        "cancellation_reasons": [
          "Defective item"
        ],
        "order_create_time": 1761264000,
        "order_id": "576461413038785752",
        "product_id": "1729592969712207011",
        "product_name": "Smart Watch",
        "sku_id": "1729592969712207014"
      }
    ],
    "total_count": 200
  },
  "message": "Success",
  "request_id": "202203070749000101890810281E8C70B7"
}
```

## Error Code

| Code | Message |
| --- | --- |
