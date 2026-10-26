# TikTok Shop API — Customer service

Snapshot dari [API Reference](https://partner.tiktokshop.com/docv2/) · 12 endpoint + 3 overview/guide.

## Overview / guide

- [Post-sales Solutions for Customer Services](./gx13i64p.md)
- [Message Types](./6y23rc6a.md)
- [Customer Service API overview](./customer-service-api-overview.md)

## Endpoints

| Method | Path | File |
| --- | --- | --- |
| `POST` | `/customer_service/202309/conversations` | [Create Conversation](./create-conversation-202309.md) |
| `POST` | `/customer_service/202605/conversations/{conversation_id}/sessions/{session_id}/end` | [End Session](./end-session-202605.md) |
| `GET` | `/customer_service/202309/agents/settings` | [Get Agent Settings](./get-agent-settings-202309.md) |
| `GET` | `/customer_service/202601/conversations/{conversation_id}` | [Get Conversation](./get-conversation-202601.md) |
| `GET` | `/customer_service/202309/conversations/{conversation_id}/messages` | [Get Conversation Messages](./get-conversation-messages-202309.md) |
| `GET` | `/customer_service/202309/conversations` | [Get Conversations](./get-conversations-202309.md) |
| `GET` | `/customer_service/202407/performance` | [Get Customer Service Performance](./get-customer-service-performance-202407.md) |
| `POST` | `/customer_service/202309/conversations/{conversation_id}/messages/read` | [Mark Buyer Messages as Read](./mark-buyer-messages-as-read-202309.md) |
| `POST` | `/customer_service/202602/sessions/search` | [Search Sessions](./search-sessions-202602.md) |
| `POST` | `/customer_service/202606/conversations/{conversation_id}/messages` | [Send Message](./send-message-202606.md) |
| `PUT` | `/customer_service/202309/agents/settings` | [Update Agent Settings ](./update-agent-settings-202309.md) |
| `POST` | `/customer_service/202309/images/upload` | [Upload Image for Buyer Messages](./upload-image-for-buyer-messages-202309.md) |
