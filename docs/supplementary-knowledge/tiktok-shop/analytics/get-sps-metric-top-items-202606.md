# Get SPS Metric Top Items 

> **Source:** [https://partner.tiktokshop.com/docv2/page/get-sps-metric-top-items-202606](https://partner.tiktokshop.com/docv2/page/get-sps-metric-top-items-202606)
> **Category:** Analytics
> **document_path:** `get-sps-metric-top-items-202606`

## Description

Returns the top products for NRR, NBFR, or AHT, or the top logistics providers for OTDR.
Shop Performance Score (SPS) reflects a shop’s performance across key operational and service metrics on TikTok Shop. By integrating the read-only SPS APIs, ISVs can retrieve a shop’s score, tier, benefits, and metric benchmarks, diagnose performance gaps, and drill down to the products, logistics providers, aftersales types, orders, or chats associated with specific issues. This enables ISVs to embed actionable performance insights into their solutions, helping merchants identify problem areas faster and take targeted actions to improve shop performance. Available only for US-region shops.
Use case guide: [Click here](https://partner.tiktokshop.com/docv2/page/ph0ccose)

## Required scope

data.shop_analytics.public.read

## Path

`/analytics/202606/shop_performances/metrics/{metric_code}/top_items`

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
| shop_cipher | string | Y | Use this property to pass shop information in requesting the API. Failure in passing the correct value when requesting the API for cross-border shops will return incorrect response. <br>Get by API [Get Authorization Shop](https://partner.tiktokshop.com/docv2/page/6507ead7b99d5302be949ba9?external_id=6507ead7b99d5302be949ba9) |

## Request Body

| Properties | Type | Required | Properties description |
| --- | --- | --- | --- |

## Code Example

### Curl

```shell
curl -X GET \
 'https://open-api.tiktokglobalshop.com/analytics/202606/shop_performances/metrics/NRR/top_items?shop_cipher=GCP_XF90igAAAABh00qsWgtvOiGFNqyubMt3&locale=en-US&app_key=29a39d&sign=bc721f0e0182914e3487b81df204de37a352fc3aa96947efda6dc1e5dd0d5290&timestamp=1623812664' \
-H 'content-type: application/json' \
-H 'x-tts-access-token: TTP_pwSm2AAAAABmmtFz1xlyKMnwg74T2GJ5s0uQbS8jPjb_GkdFVCxPqzQXSyuyfXdQa0AqyDsea2tYFNVf4XeqgZHFfPyv0Vs659QqyLYfsGzanZ5XZAin3_ZkcIxxS0_In6u6XDeU96k'

```

### Go

```go
// For more details about the SDK, refer to the documentation:
// https://partner.tiktokshop.com/docv2/page/67c83e0799a75104986ae498
func analytics202606GetSPSMetricTopItemsGet() {
    configuration := apis.NewConfiguration()
    configuration.AddAppInfo(appKey, appSecret)
    apiClient := apis.NewAPIClient(configuration)
    request := apiClient.AnalyticsV202606API.Analytics202606ShopPerformancesMetricsMetricCodeTopItemsGet(context.Background(), "NRR")
    request = request.XTtsAccessToken("your access token")
    request = request.ContentType("application/json")
    request = request.Locale("en-US")
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
async function analytics202606GetSPSMetricTopItemsGet() {
    const result = await client.api.AnalyticsV202606Api.ShopPerformancesMetricsMetricCodeTopItemsGet("NRR", "your access token", "application/json", "en-US", "your shop cipher");
    console.log('response: ', JSON.stringify(result, null, 2));
}

```

### Java

```java
// For more details about the SDK, refer to the documentation:
// https://partner.tiktokshop.com/docv2/page/67c83e0799a75104986ae498
public void analytics202606GetSPSMetricTopItemsGet() throws Exception {
    ApiClient defaultClient = Configuration.getDefaultApiClient()
            .setAppkey("your appKey")
            .setSecret("your secret")
            .setBasePath("https://open-api.tiktokglobalshop.com");
    AnalyticsV202606Api apiInstance = new AnalyticsV202606Api(defaultClient);
    GetSPSMetricTopItemsResponse result = apiInstance.analytics202606ShopPerformancesMetricsMetricCodeTopItemsGet("NRR", "your access token", "application/json", "en-US", "your shop cipher");
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
| ^aht_aftersales_type_items | []object |  | Top product items for AHT, with fields for average handle duration and the top aftersales type. |
| ^^handle_duration_hours | string | 18.5 | Average handle duration in hours. |
| ^^product_id | string | 1729592969712207011 | Product ID. |
| ^^product_name | string | Smart Watch | Product name. |
| ^^return_order_count | int | 30 | Total number of return orders. |
| ^^top_aftersales_type_name | string | Only Refund | Top aftersales type returned by TikTok Shop aftersales classification. |
| ^^top_type_order_count | int | 20 | Number of orders associated with the top aftersales type. |
| ^^image_url | string | https://example.com/product.jpg | Product image URL. |
| ^metric_code | string | NRR | Stable metric code selected in the request. One of: NRR, NBFR, OTDR, or AHT. |
| ^nbfr_top_product_items | []object |  | NBFR top product items. |
| ^^product_id | string | 1729592969712207010 | Product ID. |
| ^^product_name | string | Cotton T-Shirt | Product name. |
| ^^return_order_count | int | 8 | Number of return or refund orders. |
| ^^top_reason_order_count | int | 5 | Number of orders associated with the top return or refund reason. |
| ^^top_return_reasons | []string | ["Item doesn't match description"] | Top return or refund reasons. |
| ^^image_url | string | https://example.com/product.jpg | Product image URL. |
| ^nrr_top_product_items | []object |  | NRR top product items. |
| ^^delivered_order_count | int | 300 | Total number of delivered orders. |
| ^^image_url | string | https://example.com/product.jpg | Product image URL. |
| ^^negative_order_count | int | 12 | Number of orders with negative reviews. |
| ^^product_id | string | 1729592969712207008 | Product ID. |
| ^^product_name | string | Wireless Headphones | Product name. |
| ^^top_review_reasons | []string | ["Item doesn't match description"] | Top negative review reasons. |
| ^otdr_logistics_items | []object |  | OTDR logistics provider items. |
| ^^delivered_order_count | int | 1000 | Total number of delivered orders. |
| ^^logistics_provider | string | TikTok Shipping | Logistics provider name. |
| ^^on_time_deliver_order_count | int | 947 | Number of orders delivered on time. |
| ^^on_time_deliver_rate | string | 0.947 | On-time delivery rate as a ratio from 0 to 1. |
| ^total_count | int | 120 | Number of items in the metric-specific list returned by this response. |

## Example

```json
{
  "code": 0,
  "data": {
    "aht_aftersales_type_items": [
      {
        "handle_duration_hours": "18.5",
        "product_id": "1729592969712207011",
        "product_name": "Smart Watch",
        "return_order_count": 30,
        "top_aftersales_type_name": "Only Refund",
        "top_type_order_count": 20,
        "image_url": "https://example.com/product.jpg"
      }
    ],
    "metric_code": "NRR",
    "nbfr_top_product_items": [
      {
        "product_id": "1729592969712207010",
        "product_name": "Cotton T-Shirt",
        "return_order_count": 8,
        "top_reason_order_count": 5,
        "top_return_reasons": [
          "Item doesn't match description"
        ],
        "image_url": "https://example.com/product.jpg"
      }
    ],
    "nrr_top_product_items": [
      {
        "delivered_order_count": 300,
        "image_url": "https://example.com/product.jpg",
        "negative_order_count": 12,
        "product_id": "1729592969712207008",
        "product_name": "Wireless Headphones",
        "top_review_reasons": [
          "Item doesn't match description"
        ]
      }
    ],
    "otdr_logistics_items": [
      {
        "delivered_order_count": 1000,
        "logistics_provider": "TikTok Shipping",
        "on_time_deliver_order_count": 947,
        "on_time_deliver_rate": "0.947"
      }
    ],
    "total_count": 120
  },
  "message": "Success",
  "request_id": "202203070749000101890810281E8C70B7"
}
```

## Error Code

| Code | Message |
| --- | --- |
