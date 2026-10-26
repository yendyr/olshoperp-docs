# TikTok Shop API — Finance

Snapshot dari [API Reference](https://partner.tiktokshop.com/docv2/) · 8 endpoint + 1 overview/guide.

## Overview / guide

- [Finance API overview](./finance-api-overview.md)

## Endpoints

| Method | Path | File |
| --- | --- | --- |
| `GET` | `/finance/202605/payments` | [Get Payments](./get-payments-202605.md) |
| `GET` | `/finance/202309/withdrawals` | [Get Seller Financial Transactions](./get-seller-financial-transactions-202309.md) |
| `GET` | `/finance/202309/statements` | [Get Statements](./get-statements-202309.md) |
| `GET` | `/finance/202609/account_transactions` | [Get TradeIn Account Transactions](./get-tradein-account-transactions-202609.md) |
| `GET` | `/finance/202609/account_balances` | [Get TradeIn Supplier Account Balance](./get-tradein-supplier-account-balance-202609.md) |
| `GET` | `/finance/202501/orders/{order_id}/statement_transactions` | [Get Transactions by Order](./get-transactions-by-order-202501.md) |
| `GET` | `/finance/202501/statements/{statement_id}/statement_transactions` | [Get Transactions by Statement](./get-transactions-by-statement-202501.md) |
| `GET` | `/finance/202507/orders/unsettled` | [Get Unsettled Transactions](./get-unsettled-transactions-202507.md) |
