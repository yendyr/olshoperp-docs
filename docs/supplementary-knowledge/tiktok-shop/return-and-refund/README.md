# TikTok Shop API — Return and refund

Snapshot dari [API Reference](https://partner.tiktokshop.com/docv2/) · 18 endpoint + 4 overview/guide.

## Overview / guide

- [Refund reasons](./refund-reasons.md)
- [Return, refund, and cancel API overview](./return-refund-and-cancel-api-overview.md)
- [Return reasons](./return-reasons.md)
- [Cancel reasons](./cancel-reasons.md)

## Endpoints

| Method | Path | File |
| --- | --- | --- |
| `POST` | `/return_refund/202309/cancellations/{cancel_id}/approve` | [Approve Cancellation](./approve-cancellation-202309.md) |
| `POST` | `/return_refund/202309/returns/{return_id}/approve` | [Approve Return](./approve-return-202309.md) |
| `POST` | `/return_refund/202602/refunds/calculate` | [Calculate Refund](./calculate-refund-202602.md) |
| `POST` | `/return_refund/202602/cancellations` | [Cancel Order](./cancel-order-202602.md) |
| `POST` | `/return_refund/202602/returns` | [Create Return](./create-return-202602.md) |
| `GET` | `/return_refund/202602/orders/{order_id}/aftersale_eligibility` | [Get Aftersale Eligibility](./get-aftersale-eligibility-202602.md) |
| `GET` | `/return_refund/202606/review_decision` | [Get Available Review Decisions](./get-available-review-decisions-202606.md) |
| `GET` | `/return_refund/202601/decision_eligibility` | [Get Decision Eligibility](./get-decision-eligibility-202601.md) |
| `GET` | `/return_refund/202309/reject_reasons` | [Get Reject Reasons](./get-reject-reasons-202309.md) |
| `GET` | `/return_refund/202309/returns/{return_id}/records` | [Get Return Records](./get-return-records-202309.md) |
| `POST` | `/return_refund/202309/cancellations/{cancel_id}/reject` | [Reject Cancellation](./reject-cancellation-202309.md) |
| `POST` | `/return_refund/202606/returns/{return_id}/reject` | [Reject Return](./reject-return-202606.md) |
| `POST` | `/return_refund/202609/aftersales/review` | [Review Aftersales Requests](./review-aftersales-requests-202609.md) |
| `POST` | `/return_refund/202603/aftersales/search` | [Search Aftersales Requests](./search-aftersales-requests-202603.md) |
| `POST` | `/return_refund/202602/cancellations/search` | [Search Cancellations](./search-cancellations-202602.md) |
| `POST` | `/return_refund/202604/rma/search` | [Search Return Merchandise Authorizations](./search-return-merchandise-authorizations-202604.md) |
| `POST` | `/return_refund/202602/returns/search` | [Search Returns](./search-returns-202602.md) |
| `POST` | `/return_refund/202405/returns/shipping_documents` | [Upload Return Shipping Information](./upload-return-shipping-information-202405.md) |
