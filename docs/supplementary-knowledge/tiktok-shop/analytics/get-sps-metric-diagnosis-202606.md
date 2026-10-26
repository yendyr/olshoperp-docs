# Get SPS Metric Diagnosis

> **Source:** [https://partner.tiktokshop.com/docv2/page/get-sps-metric-diagnosis-202606](https://partner.tiktokshop.com/docv2/page/get-sps-metric-diagnosis-202606)
> **Category:** Analytics
> **document_path:** `get-sps-metric-diagnosis-202606`

## Description

Returns diagnosis details for a single SPS metric, including benchmark thresholds, trends, calculation details, and distribution details. 
Shop Performance Score (SPS) reflects a shop’s performance across key operational and service metrics on TikTok Shop. By integrating the read-only SPS APIs, ISVs can retrieve a shop’s score, tier, benefits, and metric benchmarks, diagnose performance gaps, and drill down to the products, logistics providers, aftersales types, orders, or chats associated with specific issues. This enables ISVs to embed actionable performance insights into their solutions, helping merchants identify problem areas faster and take targeted actions to improve shop performance. Available only for US-region shops.
Use case guide: [Click here](https://partner.tiktokshop.com/docv2/page/ph0ccose)

## Required scope

data.shop_analytics.public.read

## Path

`/analytics/202606/shop_performances/metrics/{metric_code}/diagnosis`

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
| trend_duration_days | int | N | Number of days to look back for metric trend data. The value must be from 1 to 90. Default: 30. |
| shop_cipher | string | Y | Use this property to pass shop information in requesting the API. Failure in passing the correct value when requesting the API for cross-border shops will return incorrect response. <br>Get by API [Get Authorization Shop](https://partner.tiktokshop.com/docv2/page/6507ead7b99d5302be949ba9?external_id=6507ead7b99d5302be949ba9) |

## Request Body

| Properties | Type | Required | Properties description |
| --- | --- | --- | --- |

## Code Example

### Curl

```shell
curl -X GET \
 'https://open-api.tiktokglobalshop.com/analytics/202606/shop_performances/metrics/OTDR/diagnosis?shop_cipher=GCP_XF90igAAAABh00qsWgtvOiGFNqyubMt3&locale=en-US&trend_duration_days=30&app_key=29a39d&sign=bc721f0e0182914e3487b81df204de37a352fc3aa96947efda6dc1e5dd0d5290&timestamp=1623812664' \
-H 'x-tts-access-token: TTP_pwSm2AAAAABmmtFz1xlyKMnwg74T2GJ5s0uQbS8jPjb_GkdFVCxPqzQXSyuyfXdQa0AqyDsea2tYFNVf4XeqgZHFfPyv0Vs659QqyLYfsGzanZ5XZAin3_ZkcIxxS0_In6u6XDeU96k' \
-H 'content-type: application/json'

```

### Go

```go
// For more details about the SDK, refer to the documentation:
// https://partner.tiktokshop.com/docv2/page/67c83e0799a75104986ae498
func analytics202606GetSPSMetricDiagnosisGet() {
    configuration := apis.NewConfiguration()
    configuration.AddAppInfo(appKey, appSecret)
    apiClient := apis.NewAPIClient(configuration)
    request := apiClient.AnalyticsV202606API.Analytics202606ShopPerformancesMetricsMetricCodeDiagnosisGet(context.Background(), "OTDR")
    request = request.XTtsAccessToken("your access token")
    request = request.ContentType("application/json")
    request = request.Locale("en-US")
    request = request.TrendDurationDays(30)
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
async function analytics202606GetSPSMetricDiagnosisGet() {
    const result = await client.api.AnalyticsV202606Api.ShopPerformancesMetricsMetricCodeDiagnosisGet("OTDR", "your access token", "application/json", "en-US", 30, "your shop cipher");
    console.log('response: ', JSON.stringify(result, null, 2));
}

```

### Java

```java
// For more details about the SDK, refer to the documentation:
// https://partner.tiktokshop.com/docv2/page/67c83e0799a75104986ae498
public void analytics202606GetSPSMetricDiagnosisGet() throws Exception {
    ApiClient defaultClient = Configuration.getDefaultApiClient()
            .setAppkey("your appKey")
            .setSecret("your secret")
            .setBasePath("https://open-api.tiktokglobalshop.com");
    AnalyticsV202606Api apiInstance = new AnalyticsV202606Api(defaultClient);
    GetSPSMetricDiagnosisResponse result = apiInstance.analytics202606ShopPerformancesMetricsMetricCodeDiagnosisGet("OTDR", "your access token", "application/json", "en-US", 30, "your shop cipher");
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
| ^benchmarks | object |  | Benchmark thresholds for this metric. |
| ^^excellent_threshold | string | 0.98 | Excellent tier threshold. |
| ^^poor_threshold | string | 0.80 | Poor tier threshold. |
| ^calculation_rule | object |  | Calculation details used to derive this metric. |
| ^^denominator_label | string | Delivered orders | Denominator label. |
| ^^denominator_value | string | 1000 | Denominator value. |
| ^^numerator_label | string | On-time delivered orders | Numerator label. |
| ^^numerator_value | string | 947 | Numerator value. |
| ^dimension | string | Product satisfaction | SPS dimension that the metric belongs to.  |
| ^distribution_details | []object |  | Additional distribution details for the metric. |
| ^^count | int | 820 | Number of items in the distribution bucket. |
| ^^name | string | Dispatch 24-48 Hours | Distribution detail name.  |
| ^^percent | string | 82.0 | Percentage of items in the distribution bucket, from 0 to 100. |
| ^evaluate_duration_days | int | 30 | Number of days included in the metric evaluation period. |
| ^end_evaluation_time | int | 1761264000 | Metric evaluation period end time. Unix timestamp in seconds. |
| ^start_evaluation_time | int | 1758672000 | Metric evaluation period start time. Unix timestamp in seconds. |
| ^metric_code | string | OTDR | Stable metric code. Possible values: NRR, NBFR, SFCR, OTDR, AHT, and IM_DSAT. |
| ^score | string | 4.3 | Metric score, from 0 to 5. |
| ^status | string | GOOD | Metric status. Possible values include EXCELLENT, GOOD, POOR, CRITICAL and NIL. |
| ^status_text | string | Excellent | Metric status text. Values like Excellent, Good, Normal, Attention. |
| ^trend | object |  | Metric trend over the requested lookback range. |
| ^^data_points | []object |  | Metric trend data points. |
| ^^^record_date | string | 20260601 | Trend date in yyyyMMdd format. |
| ^^^value | string | 0.947 | Metric value on the trend date, using the same unit as value_unit. |
| ^value | string | 0.947 | Metric value. Ratios are represented as values from 0 to 1; percentages are represented as values from 0 to 100. |
| ^value_unit | string | PERCENT | Unit of the metric value. Possible values include PERCENT and HOURS. |
| ^analyses | []object |  |  Diagnostic insights for the selected metric. |
| ^^summaries | []string | ["Stable performance. Top 3 issues to address."] | Summarized causes affecting the selected metric. |
| ^^details | []string | Your 30-day on-time delivery rate is only higher than **% of peers, which is hurting your SPS. | Detailed explanations for the selected metric diagnosis. |

## Example

```json
{
  "code": 0,
  "data": {
    "benchmarks": {
      "excellent_threshold": "0.98",
      "poor_threshold": "0.80"
    },
    "calculation_rule": {
      "denominator_label": "Delivered orders",
      "denominator_value": "1000",
      "numerator_label": "On-time delivered orders",
      "numerator_value": "947"
    },
    "dimension": "Product satisfaction",
    "distribution_details": [
      {
        "count": 820,
        "name": "Dispatch 24-48 Hours",
        "percent": "82.0"
      }
    ],
    "evaluate_duration_days": 30,
    "end_evaluation_time": 1761264000,
    "start_evaluation_time": 1758672000,
    "metric_code": "OTDR",
    "score": "4.3",
    "status": "GOOD",
    "status_text": "Excellent",
    "trend": {
      "data_points": [
        {
          "record_date": "20260601",
          "value": "0.947"
        }
      ]
    },
    "value": "0.947",
    "value_unit": "PERCENT",
    "analyses": [
      {
        "summaries": [
          "Stable performance. Top 3 issues to address."
        ],
        "details": "Your 30-day on-time delivery rate is only higher than **% of peers, which is hurting your SPS."
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
