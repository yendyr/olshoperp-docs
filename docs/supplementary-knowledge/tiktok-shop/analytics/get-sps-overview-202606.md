# Get SPS Overview

> **Source:** [https://partner.tiktokshop.com/docv2/page/get-sps-overview-202606](https://partner.tiktokshop.com/docv2/page/get-sps-overview-202606)
> **Category:** Analytics
> **document_path:** `get-sps-overview-202606`

## Description

Returns the SPS overview for the authorized shop, including the score, tier, dimensions, benefits, and top issues. 
Shop Performance Score (SPS) reflects a shop’s performance across key operational and service metrics on TikTok Shop. By integrating the read-only SPS APIs, ISVs can retrieve a shop’s score, tier, benefits, and metric benchmarks, diagnose performance gaps, and drill down to the products, logistics providers, aftersales types, orders, or chats associated with specific issues. This enables ISVs to embed actionable performance insights into their solutions, helping merchants identify problem areas faster and take targeted actions to improve shop performance. Available only for US-region shops.
Use case guide: [Click here](https://partner.tiktokshop.com/docv2/page/ph0ccose)

## Required scope

data.shop_analytics.public.read

## Path

`/analytics/202606/shop_performances/overview`

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
 'https://open-api.tiktokglobalshop.com/analytics/202606/shop_performances/overview?locale=en-US&app_key=29a39d&sign=bc721f0e0182914e3487b81df204de37a352fc3aa96947efda6dc1e5dd0d5290&timestamp=1623812664&shop_cipher=GCP_XF90igAAAABh00qsWgtvOiGFNqyubMt3' \
-H 'x-tts-access-token: TTP_pwSm2AAAAABmmtFz1xlyKMnwg74T2GJ5s0uQbS8jPjb_GkdFVCxPqzQXSyuyfXdQa0AqyDsea2tYFNVf4XeqgZHFfPyv0Vs659QqyLYfsGzanZ5XZAin3_ZkcIxxS0_In6u6XDeU96k' \
-H 'content-type: application/json'

```

### Go

```go
// For more details about the SDK, refer to the documentation:
// https://partner.tiktokshop.com/docv2/page/67c83e0799a75104986ae498
func analytics202606GetSPSOverviewGet() {
    configuration := apis.NewConfiguration()
    configuration.AddAppInfo(appKey, appSecret)
    apiClient := apis.NewAPIClient(configuration)
    request := apiClient.AnalyticsV202606API.Analytics202606ShopPerformancesOverviewGet(context.Background())
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
async function analytics202606GetSPSOverviewGet() {
    const result = await client.api.AnalyticsV202606Api.ShopPerformancesOverviewGet("your access token", "application/json", "en-US", "your shop cipher");
    console.log('response: ', JSON.stringify(result, null, 2));
}

```

### Java

```java
// For more details about the SDK, refer to the documentation:
// https://partner.tiktokshop.com/docv2/page/67c83e0799a75104986ae498
public void analytics202606GetSPSOverviewGet() throws Exception {
    ApiClient defaultClient = Configuration.getDefaultApiClient()
            .setAppkey("your appKey")
            .setSecret("your secret")
            .setBasePath("https://open-api.tiktokglobalshop.com");
    AnalyticsV202606Api apiInstance = new AnalyticsV202606Api(defaultClient);
    GetSPSOverviewResponse result = apiInstance.analytics202606ShopPerformancesOverviewGet("your access token", "application/json", "en-US", "your shop cipher");
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
| ^benefits | []object |  | Fixed complete set of benefits associated with the shop SPS score. |
| ^^benefit_name | string | LIVE giveaway | Benefit display name localized by the requested locale. |
| ^^is_unlocked | bool | true | Whether the shop has unlocked this benefit. |
| ^^unlock_score | string | 4.5 | Score required to unlock the benefit, from 0 to 5. |
| ^dimensions | []object |  | Score details by SPS dimension. |
| ^^name | string | Product satisfaction | Dimension name. |
| ^^score | string | 4.8 | Dimension score, from 0 to 5. |
| ^^status | string | EXCELLENT | Dimension status enum. Possible values include EXCELLENT, GOOD, POOR, CRITICAL and NIL. |
| ^^status_text | string | Excellent | Dimension status text. Values like Excellent, Good, Normal, Attention. |
| ^^weight | string | 70 | Dimension weight as a percent from 0 to 100. |
| ^evaluate_duration_days | int | 90 | The number of days included in the score evaluation period. |
| ^end_evaluation_time | int | 1782518400 | The evaluation period end time. Unix timestamp in seconds. |
| ^start_evaluation_time | int | 1774828800 | The evaluation period start time. Unix timestamp in seconds. |
| ^peer_percentile | string | 86.5 | The shop's percentile among peers, from 0 to 100. |
| ^primary_category | object |  | The shop's primary category. |
| ^^category_id | string | 601450 | The primary category ID. |
| ^^category_name | string | Home Supplies | The primary category name. |
| ^sps_score | string | 4.6 | The shop SPS score, from 0 to 5 with one decimal place. |
| ^sps_tier | string | GOOD | The SPS tier. Possible values include EXCELLENT, GOOD, POOR, CRITICAL and NIL. |
| ^sps_tier_text | string | Excellent | The SPS tier. Values like Excellent, Good, Normal, Attention. |
| ^top_issues | object |  | Top SPS issues that contributed to the current score. |
| ^^issues | []object |  | Ranked issue list. |
| ^^^description | string | Your on-time delivery performance is lower than peer shops. | Localized issue description. |
| ^^^evaluate_duration_days | int | 31 | Number of days included in this issue's evaluation period. |
| ^^^end_evaluation_time | int | 1761264000 | Issue evaluation period end time. Unix timestamp in seconds. |
| ^^^start_evaluation_time | int | 1758672000 | Issue evaluation period start time. Unix timestamp in seconds. |
| ^^^metric_code | string | OTDR | Related metric code. Possible values include NRR, NBFR, SFCR, OTDR, AHT, and IM_DSAT. |
| ^^^metric_name | string | On-time delivery rate | Localized metric display name. |
| ^^^percentile | string | 72.4 | Metric percentile among peer shops, from 0 to 100. |
| ^^^rank | int | 1 | Issue rank, where 1 is the top issue. |
| ^^summary | string | Improve late dispatch and negative reviews to increase your SPS score. | Localized summary of the top issues. |
| ^update_time | int | 1761264000 | The latest score refresh time. Unix timestamp in seconds. |

## Example

```json
{
  "code": 0,
  "data": {
    "benefits": [
      {
        "benefit_name": "LIVE giveaway",
        "is_unlocked": true,
        "unlock_score": "4.5"
      }
    ],
    "dimensions": [
      {
        "name": "Product satisfaction",
        "score": "4.8",
        "status": "EXCELLENT",
        "status_text": "Excellent",
        "weight": "70"
      }
    ],
    "evaluate_duration_days": 90,
    "end_evaluation_time": 1782518400,
    "start_evaluation_time": 1774828800,
    "peer_percentile": "86.5",
    "primary_category": {
      "category_id": "601450",
      "category_name": "Home Supplies"
    },
    "sps_score": "4.6",
    "sps_tier": "GOOD",
    "sps_tier_text": "Excellent",
    "top_issues": {
      "issues": [
        {
          "description": "Your on-time delivery performance is lower than peer shops.",
          "evaluate_duration_days": 31,
          "end_evaluation_time": 1761264000,
          "start_evaluation_time": 1758672000,
          "metric_code": "OTDR",
          "metric_name": "On-time delivery rate",
          "percentile": "72.4",
          "rank": 1
        }
      ],
      "summary": "Improve late dispatch and negative reviews to increase your SPS score."
    },
    "update_time": 1761264000
  },
  "message": "Success",
  "request_id": "202203070749000101890810281E8C70B7"
}
```

## Error Code

| Code | Message |
| --- | --- |
