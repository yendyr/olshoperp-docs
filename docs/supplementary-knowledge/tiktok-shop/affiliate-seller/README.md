# TikTok Shop API — Affiliate seller

Snapshot dari [API Reference](https://partner.tiktokshop.com/docv2/) · 44 endpoint + 1 overview/guide.

## Overview / guide

- [Affiliate Seller API overview](./affiliate-seller-api-overview.md)

## Endpoints

| Method | Path | File |
| --- | --- | --- |
| `POST` | `/affiliate_seller/202610/creator_outreach/eligibility/check` | [Check Creator Outreach Eligibility](./check-creator-outreach-eligibility-202610.md) |
| `POST` | `/affiliate_seller/202605/target_collaborations/conflicts/check` | [Check Target Collaboration Conflicts](./check-target-collaboration-conflicts-202605.md) |
| `POST` | `/affiliate_seller/202603/compass/offline_task` | [Create Compass Offline Export Task](./create-compass-offline-export-task-202603.md) |
| `POST` | `/affiliate_seller/202412/open_collaborations` | [Create Open Collaboration](./create-open-collaboration-202412.md) |
| `POST` | `/affiliate_seller/202508/target_collaborations` | [Create Target Collaboration](./create-target-collaboration-202508.md) |
| `GET` | `/affiliate_seller/202603/compass/offline_tasks/{task_id}/file` | [Download Compass Task File](./download-compass-task-file-202603.md) |
| `POST` | `/affiliate_seller/202410/open_collaborations/sample_rules` | [Edit Open Collaboration Sample Rule](./edit-open-collaboration-sample-rule-202410.md) |
| `POST` | `/affiliate_seller/202405/open_collaboration_settings` | [Edit Open Collaboration Settings](./edit-open-collaboration-settings-202405.md) |
| `POST` | `/affiliate_seller/202405/products/{product_id}/promotion_link/generate` | [Generate Affiliate Product Promotion Link](./generate-affiliate-product-promotion-link-202405.md) |
| `POST` | `/affiliate_seller/202509/target_collaboration/{target_collaboration_id}/link` | [Generate Target Collaboration Link](./generate-target-collaboration-link-202509.md) |
| `GET` | `/affiliate_seller/202603/compass/offline_tasks` | [Get Compass Task List](./get-compass-task-list-202603.md) |
| `GET` | `/affiliate_seller/202412/conversations` | [Get Conversation List](./get-conversation-list-202412.md) |
| `GET` | `/affiliate_seller/202412/conversation/{conversation_id}/messages` | [Get Creator Conversation Messages](./get-creator-conversation-messages-202412.md) |
| `POST` | `/affiliate_seller/202608/marketplace_creators/search/filter` | [Get Creator Marketplace Advanced Search Filters](./get-creator-marketplace-advanced-search-filters-202608.md) |
| `GET` | `/affiliate_seller/202608/conversations/group_counts` | [Get Inbox Category Counts](./get-inbox-category-counts-202608.md) |
| `GET` | `/affiliate_seller/202412/conversations/messages/list/newest` | [Get Latest Unread Messages](./get-latest-unread-messages-202412.md) |
| `GET` | `/affiliate_seller/202608/marketplace_creators/{creator_user_id}` | [Get Marketplace Creator Performance](./get-marketplace-creator-performance-202608.md) |
| `GET` | `/affiliate_seller/202508/open_collaborations/creator_content_details` | [Get Open Collaboration Creator Content Details](./get-open-collaboration-creator-content-details-202508.md) |
| `GET` | `/affiliate_seller/202410/open_collaborations/sample_rules` | [Get Open Collaboration Sample Rules](./get-open-collaboration-sample-rules-202410.md) |
| `GET` | `/affiliate_seller/202409/open_collaboration_settings` | [Get Open Collaboration Settings](./get-open-collaboration-settings-202409.md) |
| `GET` | `/affiliate_seller/202607/creator_outreach/quota` | [Get Weekly Creator Outreach Quota](./get-weekly-creator-outreach-quota-202607.md) |
| `POST` | `/affiliate_seller/202608/creator_outreach/records/query` | [Get Weekly Creator Outreach Records](./get-weekly-creator-outreach-records-202608.md) |
| `POST` | `/affiliate_seller/202508/conversations` | [Get or Create Creator Conversation](./get-or-create-creator-conversation-202508.md) |
| `POST` | `/affiliate_seller/202412/conversatons/read` | [Mark Conversations as Read](./mark-conversations-as-read-202412.md) |
| `POST` | `/affiliate_seller/202608/target_collaborations/creator_promotion_details/query` | [Query Creator Promotion Details in Target Collaboration](./query-creator-promotion-details-in-target-collaboration-202608.md) |
| `GET` | `/affiliate_seller/202508/target_collaborations/{target_collaboration_id}` | [Query Target Collaboration Detail](./query-target-collaboration-detail-202508.md) |
| `POST` | `/affiliate_seller/202508/open_collaborations/{open_collaboration_id}/remove_creator` | [Remove Creator From Open Collaboration Product](./remove-creator-from-open-collaboration-product-202508.md) |
| `DELETE` | `/affiliate_seller/202409/open_collaborations/products/{product_id}` | [Remove Open Collaboration](./remove-open-collaboration-202409.md) |
| `DELETE` | `/affiliate_seller/202409/target_collaborations/{target_collaboration_id}` | [Remove Target Collaboration](./remove-target-collaboration-202409.md) |
| `POST` | `/affiliate_seller/202605/target_collaborations/conflicts/resolve` | [Resolve Target Collaboration Conflicts](./resolve-target-collaboration-conflicts-202605.md) |
| `POST` | `/affiliate_seller/202507/sample_applications/{application_id}/review` | [Review a Sample Application](./review-a-sample-application-202507.md) |
| `POST` | `/affiliate_seller/202608/marketplace_creators/search` | [Search Creators in Creator Marketplace](./search-creators-in-creator-marketplace-202608.md) |
| `POST` | `/affiliate_seller/202412/open_collaborations/search` | [Search Open Collaborations](./search-open-collaborations-202412.md) |
| `POST` | `/affiliate_seller/202409/sample_applications/{application_id}/fulfillments/search` | [Search Sample Application Fulfillments](./search-sample-application-fulfillments-202409.md) |
| `POST` | `/affiliate_seller/202508/sample_applications/search` | [Search Sample Applications](./search-sample-applications-202508.md) |
| `POST` | `/affiliate_seller/202410/orders/search` | [Search Seller Affiliate Orders](./search-seller-affiliate-orders-202410.md) |
| `POST` | `/affiliate_seller/202508/target_collaborations/search` | [Search Target Collaborations](./search-target-collaborations-202508.md) |
| `GET` | `/affiliate_seller/202512/sample_applications/deeplink` | [Seller Get Sample Request Deeplink](./seller-get-sample-request-deeplink-202512.md) |
| `POST` | `/affiliate_seller/202405/open_collaborations/products/search` | [Seller Search Open Collaboration Products](./seller-search-open-collaboration-products-202405.md) |
| `POST` | `/affiliate_seller/202412/conversations/{conversation_id}/messages` | [Send IM Message](./send-im-message-202412.md) |
| `POST` | `/affiliate_seller/202608/conversations/{conversation_id}/status` | [Update Conversation Status](./update-conversation-status-202608.md) |
| `PUT` | `/affiliate_seller/202508/target_collaborations/{target_collaboration_id}` | [Update Target Collaboration](./update-target-collaboration-202508.md) |
| `POST` | `/affiliate_seller/202511/images/upload` | [Upload Message Image](./upload-message-image-202511.md) |
| `POST` | `/affiliate_seller/202608/media/upload` | [Upload Message Image V2](./upload-message-image-v2-202608.md) |
