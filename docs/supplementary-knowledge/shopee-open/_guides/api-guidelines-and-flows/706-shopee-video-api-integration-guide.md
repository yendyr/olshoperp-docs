# Shopee Video API Integration Guide

> **Source:** [https://open.shopee.com/developer-guide/706](https://open.shopee.com/developer-guide/706)
> **Type:** Developer Guide / Overview
> **document_id:** `706`
> **Section:** API Guidelines and Flows

## Content

1. Introduction to Shopee Video 
Shopee Video is a content creation and marketing tool that enables sellers and affiliates to showcase products through engaging short videos. It provides flexibility for both sellers and affiliates to produce and share content. By leveraging visual storytelling, creators can increase engagement and drive higher conversion rates.
 
Benefits:
- Gain Buyers and Followers: Attract attention and build a loyal customer base.
- Increase Awareness: Showcase products and brand dynamically.
- Drive Sales: Build trust, improve conversion, and encourage purchases.
 
Open Platform offers a set of Open APIs for video management and analytics, allowing developers to upload and manage videos, publish content, and track performance to optimize video-driven marketing strategies.
2. Integration Overview 
Integration with Shopee Video APIs consists of two main stages:
- Uploading Video via Public Video Upload APIs – Upload video files and obtain a video_upload_id.
- Managing and Publishing Video via Shopee Video APIs – Use v2.video.* APIs to select covers, edit video info, publish, delete, query, and analyze video performance.
3. Public Video Upload APIs 
Open Platform provides a set of public video upload APIs and push mechanism, designed for all future video upload scenarios. Currently, these APIs are supported only for Shopee Video.
 
API and Push List: 
 
- v2.media.init_video_upload (https://open.shopee.com/documents/v2/v2.media.init_video_upload?module=130&type=1): Initialize the video upload task.
- v2.media.upload_video_part (https://open.shopee.com/documents/v2/v2.media.upload_video_part?module=130&type=1): Upload video file in parts.
- v2.media.complete_video_upload (https://open.shopee.com/documents/v2/v2.media.complete_video_upload?module=130&type=1): Complete upload and notify the system for processing.
- v2.media.get_video_upload_result (https://open.shopee.com/documents/v2/v2.media.get_video_upload_result?module=130&type=1): Query the upload result.
- v2.media.cancel_video_upload (https://open.shopee.com/documents/v2/v2.media.cancel_video_upload?module=130&type=1): Cancel the upload task.
- video_upload_result_push (https://open.shopee.com/push-mechanism/43): Push notification when the upload reaches a final status: SUCCEEDED, FAILED, or CANCELLED. Intermediate statuses are not pushed.
 
Upload Workflow: 
 
- Call v2.media.init_video_upload (https://open.shopee.com/documents/v2/v2.media.init_video_upload?module=130&type=1) to initialize the upload task.
- Upload video parts via v2.media.upload_video_part (https://open.shopee.com/documents/v2/v2.media.upload_video_part?module=130&type=1).
- Call v2.media.complete_video_upload (https://open.shopee.com/documents/v2/v2.media.complete_video_upload?module=130&type=1) to finish the upload.
- System processes video asynchronously and pushes the final status via video_upload_result_push (https://open.shopee.com/push-mechanism/43).
- Optionally, call v2.media.get_video_upload_result (https://open.shopee.com/documents/v2/v2.media.get_video_upload_result?module=130&type=1) to check progress.
- After a successful upload, obtain the video_upload_id to call Shopee Video APIs.
 
Notes:
- Use push mechanism to receive upload completion notifications asynchronously to avoid polling.
- Each upload task corresponds to a unique video; avoid uploading the same video multiple times.
4. Shopee Video APIs 
Shopee Video APIs are divided into two modules: Video Management and Performance Analytics.
4.1 Video Management 
1) v2.video.get_cover_list (https://open.shopee.com/documents/v2/v2.video.get_cover_list?module=129&type=1): Get frame-by-frame screenshots of uploaded videos and select a specific frame as the video cover.
 
2) v2.video.edit_video_info (https://open.shopee.com/documents/v2/v2.video.edit_video_info?module=129&type=1): Set or edit video information before post, including the video caption, cover, linked products, post time, and whether allow stitch and duet.
 
Note: Draft videos can be edited multiple times; once published, they cannot be edited.
 
3) v2.video.post_video (https://open.shopee.com/documents/v2/v2.video.post_video?module=129&type=1): Publish a draft video to Shopee Video. Must upload the video and edit its info first.
 
4) v2.video.get_video_list (https://open.shopee.com/documents/v2/v2.video.get_video_list?module=129&type=1): Retrieve the list of videos for the account.
 
5) v2.video.get_video_detail (https://open.shopee.com/documents/v2/v2.video.get_video_detail?module=129&type=1): Retrieve detailed information for a video.
 
6) v2.video.delete_video (https://open.shopee.com/documents/v2/v2.video.delete_video?module=129&type=1): Delete draft or published videos.
4.2 Performance Analytics 
Overall performance of all videos:
 
1) v2.video.get_overview_performance (https://open.shopee.com/documents/v2/v2.video.get_overview_performance?module=129&type=1): Retrieve overall content interaction and transaction conversion performance for all post videos.
 
2) v2.video.get_metric_trend (https://open.shopee.com/documents/v2/v2.video.get_metric_trend?module=129&type=1): Retrieve trends of content interaction and transaction conversion for all post videos over time.
 
3) v2.video.get_user_demographics (https://open.shopee.com/documents/v2/v2.video.get_user_demographics?module=129&type=1): Retrieve audience distribution data (age, gender, location, active time, content and product preferences) for all post videos.
 
4) v2.video.get_product_performance_list (https://open.shopee.com/documents/v2/v2.video.get_prodcut_performance_list?module=129&type=1): Retrieve performance data for products linked with videos.
 
Performance of single video: 
 
1) v2.video.get_video_performance_list (https://open.shopee.com/documents/v2/v2.video.get_video_performance_list?module=129&type=1): Retrieve overview performance for a single video.
 
2) v2.video.get_video_detail_performance (https://open.shopee.com/documents/v2/v2.video.get_video_detail_performance?module=129&type=1): Retrieve content interaction and transaction conversion performance for a single video.
 
3) v2.video.get_video_detail_metric_trend (https://open.shopee.com/documents/v2/v2.video.get_video_detail_metric_trend?module=129&type=1): Retrieve trends of content interaction and transaction conversion for a single video, to analyze performance changes over time.
 
4) v2.video.get_video_detail_audience_distribution (https://open.shopee.com/documents/v2/v2.video.get_video_detail_audience_distribution?module=129&type=1): Retrieve audience distribution data (age, gender, location, active time, content and product preferences) for a single video, to analyze its audience profile.
 
5) v2.video.get_video_detail_product_performance (https://open.shopee.com/documents/v2/v2.video.get_video_detail_product_performance?module=129&type=1): Retrieve transaction conversion performance of products linked to a single video, to evaluate the video’s impact on sales and conversions.
 
Note: All performance data usually has at least a one-day delay.
5. Authorization & Authentication (User-type APIs) 
Shopee Video APIs are User-type APIs, requiring user_id and access_token. The authorization and authentication logic is same as Livestream APIs with the following points:
 
- Role-based Authorization- If the authorized role is Seller, set auth_type=seller when generating the authorization link. After successful authorization, calling v2.public.get_access_token will return both shop_id and user_id.
- If the authorized role is Affiliate, set auth_type=user when generating the authorization link. After successful authorization, calling v2.public.get_access_token will only return user_id.

- Common Request Parameter: user_id- All Shopee Video API calls must use user_id as common request parameter instead of shop_id.
- API signature (sign) must also be generated based on user_id.

- Access Token & Refresh Token Management- Tokens must be managed separately for each user_id.

 
For detailed authorization and authentication flow, refer to the Livestream API Integration Guide (https://open.shopee.com/developer-guide/669).
6. Developer Integration Notes 
- Only Shopee Video Management applications can access Video OpenAPI. Create the corresponding app type in the console before integration.
- Must agree to Shopee Video's Terms & Conditions in Seller Center before performing any Video-related API operations.

## Content (raw HTML)

```html
<h2>1. Introduction to Shopee Video</h2><p>&nbsp;</p><p>Shopee Video is a content creation and marketing tool that enables sellers and affiliates to showcase products through engaging short videos. It provides flexibility for both sellers and affiliates to produce and share content. By leveraging visual storytelling, creators can increase engagement and drive higher conversion rates.</p><p>&nbsp;</p><p><strong>Benefits:</strong></p><ul><li><strong>Gain Buyers and Followers: </strong>Attract attention and build a loyal customer base.</li><li><strong>Increase Awareness: </strong>Showcase products and brand dynamically.</li><li><strong>Drive Sales: </strong>Build trust, improve conversion, and encourage purchases.</li></ul><p>&nbsp;</p><p>Open Platform offers a set of Open APIs for video management and analytics, allowing developers to upload and manage videos, publish content, and track performance to optimize video-driven marketing strategies.</p><h2>2. Integration Overview</h2><p>&nbsp;</p><p>Integration with Shopee Video APIs consists of two main stages:</p><ul><li><strong>Uploading Video via Public Video Upload APIs</strong> – Upload video files and obtain a video_upload_id.</li><li><strong>Managing and Publishing Video via Shopee Video APIs</strong> – Use v2.video.* APIs to select covers, edit video info, publish, delete, query, and analyze video performance.</li></ul><h2>3. Public Video Upload APIs</h2><p>&nbsp;</p><p>Open Platform provides a set of public video upload APIs and push mechanism, designed for all future video upload scenarios. Currently, these APIs are supported only for Shopee Video.</p><p>&nbsp;</p><p><strong>API and Push List:&nbsp;</strong></p><p>&nbsp;</p><ul><li><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.media.init_video_upload?module=130&amp;type=1"><u>v2.media.init_video_upload</u></a>: Initialize the video upload task.</li><li><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.media.upload_video_part?module=130&amp;type=1"><u>v2.media.upload_video_part</u></a>: Upload video file in parts.</li><li><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.media.complete_video_upload?module=130&amp;type=1"><u>v2.media.complete_video_upload</u></a>: Complete upload and notify the system for processing.</li><li><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.media.get_video_upload_result?module=130&amp;type=1"><u>v2.media.get_video_upload_result</u></a>: Query the upload result.</li><li><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.media.cancel_video_upload?module=130&amp;type=1"><u>v2.media.cancel_video_upload</u></a>: Cancel the upload task.</li><li><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/push-mechanism/43"><u>video_upload_result_push</u></a>: Push notification when the upload reaches a final status: SUCCEEDED, FAILED, or CANCELLED. Intermediate statuses are not pushed.</li></ul><p>&nbsp;</p><p><strong>Upload Workflow:&nbsp;</strong></p><p>&nbsp;</p><ol><li>Call <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.media.init_video_upload?module=130&amp;type=1"><u>v2.media.init_video_upload</u></a> to initialize the upload task.</li><li>Upload video parts via <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.media.upload_video_part?module=130&amp;type=1"><u>v2.media.upload_video_part</u></a>.</li><li>Call <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.media.complete_video_upload?module=130&amp;type=1"><u>v2.media.complete_video_upload</u></a> to finish the upload.</li><li>System processes video asynchronously and pushes the final status via <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/push-mechanism/43"><u>video_upload_result_push</u></a>.</li><li>Optionally, call <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.media.get_video_upload_result?module=130&amp;type=1"><u>v2.media.get_video_upload_result</u></a> to check progress.</li><li>After a successful upload, obtain the video_upload_id to call Shopee Video APIs.</li></ol><p>&nbsp;</p><p>Notes:</p><ul><li>Use push mechanism to receive upload completion notifications asynchronously to avoid polling.</li><li>Each upload task corresponds to a unique video; avoid uploading the same video multiple times.</li></ul><h2>4. Shopee Video APIs</h2><p>&nbsp;</p><p>Shopee Video APIs are divided into two modules: <strong>Video Management</strong> and <strong>Performance Analytics.</strong></p><h3>4.1 Video Management</h3><p>&nbsp;</p><p>1) <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.video.get_cover_list?module=129&amp;type=1"><u>v2.video.get_cover_list</u></a>: Get frame-by-frame screenshots of uploaded videos and select a specific frame as the video cover.</p><p>&nbsp;</p><p>2) <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.video.edit_video_info?module=129&amp;type=1"><u>v2.video.edit_video_info</u></a>: Set or edit video information before post, including the video caption, cover, linked products, post time, and whether allow stitch and duet.</p><p>&nbsp;</p><p>Note: Draft videos can be edited multiple times; once published, they cannot be edited.</p><p>&nbsp;</p><p>3) <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.video.post_video?module=129&amp;type=1"><u>v2.video.post_video</u></a>: Publish a draft video to Shopee Video. Must upload the video and edit its info first.</p><p>&nbsp;</p><p>4) <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.video.get_video_list?module=129&amp;type=1"><u>v2.video.get_video_list</u></a>: Retrieve the list of videos for the account.</p><p>&nbsp;</p><p>5) <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.video.get_video_detail?module=129&amp;type=1"><u>v2.video.get_video_detail</u></a>: Retrieve detailed information for a video.</p><p>&nbsp;</p><p>6) <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.video.delete_video?module=129&amp;type=1"><u>v2.video.delete_video</u></a>: Delete draft or published videos.</p><h3>4.2 Performance Analytics</h3><p>&nbsp;</p><p><strong>Overall performance of all videos:</strong></p><p>&nbsp;</p><p>1) <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.video.get_overview_performance?module=129&amp;type=1"><u>v2.video.get_overview_performance</u></a>: Retrieve overall <span style="background-color:rgb(255,255,255);">content interaction and transaction conversion </span>performance for all post videos.</p><p>&nbsp;</p><p>2) <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.video.get_metric_trend?module=129&amp;type=1"><u>v2.video.get_metric_trend</u></a>: <span style="background-color:rgb(255,255,255);">Retrieve</span> trends <span style="background-color:rgb(255,255,255);">of content interaction and transaction conversion</span> for all post videos over time.</p><p>&nbsp;</p><p>3) <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.video.get_user_demographics?module=129&amp;type=1"><u>v2.video.get_user_demographics</u></a>: Retrieve audience <span style="background-color:rgb(255,255,255);">distribution data</span> (age, gender, location, active time<span style="background-color:rgb(255,255,255);">, content and product preferences</span>) for all post videos.</p><p>&nbsp;</p><p>4) <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.video.get_prodcut_performance_list?module=129&amp;type=1"><u>v2.video.get_product_performance_list</u></a>: Retrieve performance data for products linked with videos.</p><p>&nbsp;</p><p><strong>Performance of single video:&nbsp;</strong></p><p>&nbsp;</p><p>1) <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.video.get_video_performance_list?module=129&amp;type=1"><u>v2.video.get_video_performance_list</u></a>: <span style="background-color:rgb(255,255,255);">Retrieve</span> overview performance for a single video.</p><p>&nbsp;</p><p><span style="background-color:rgb(255,255,255);">2) </span><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.video.get_video_detail_performance?module=129&amp;type=1"><span style="background-color:rgb(255,255,255);"><u>v2.video.get_video_detail_performance</u></span></a><span style="background-color:rgb(255,255,255);">: Retrieve content interaction and transaction conversion performance for a single video.</span></p><p>&nbsp;</p><p><span style="background-color:rgb(255,255,255);">3) </span><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.video.get_video_detail_metric_trend?module=129&amp;type=1"><span style="background-color:rgb(255,255,255);"><u>v2.video.get_video_detail_metric_trend</u></span></a><span style="background-color:rgb(255,255,255);">: Retrieve trends of content interaction and transaction conversion for a single video, to analyze performance changes over time.</span></p><p>&nbsp;</p><p><span style="background-color:rgb(255,255,255);">4) </span><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.video.get_video_detail_audience_distribution?module=129&amp;type=1"><u>v2.video.get_video_detail_audience_distribution</u></a><span style="background-color:rgb(255,255,255);">: Retrieve audience distribution data (age, gender, location, active time, content and product preferences) for a single video, to analyze its audience profile.</span></p><p>&nbsp;</p><p><span style="background-color:rgb(255,255,255);">5) </span><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.video.get_video_detail_product_performance?module=129&amp;type=1"><span style="background-color:rgb(255,255,255);"><u>v2.video.get_video_detail_product_performance</u></span></a><span style="background-color:rgb(255,255,255);">: Retrieve transaction conversion performance of products linked to a single video, to evaluate the video’s impact on sales and conversions.</span></p><p>&nbsp;</p><p>Note: All performance data usually has at least a one-day delay.</p><h2>5. Authorization &amp; Authentication (User-type APIs)</h2><p>&nbsp;</p><p>Shopee Video APIs are User-type APIs, requiring user_id and access_token. The authorization and authentication logic is same as Livestream APIs with the following points:</p><p>&nbsp;</p><ul><li><strong>Role-based Authorization</strong><ul><li>If the authorized role is <strong>Seller</strong>, set <strong>auth_type=seller</strong> when generating the authorization link. After successful authorization, calling v2.public.get_access_token will <strong>return both shop_id and user_id</strong>.</li><li>If the authorized role is <strong>Affiliate</strong>, set <strong>auth_type=user</strong> when generating the authorization link. After successful authorization, calling v2.public.get_access_token will <strong>only return user_id</strong>.</li></ul></li><li><strong>Common Request Parameter: user_id</strong><ul><li>All Shopee Video API calls must <strong>use user_id as common request parameter</strong> instead of shop_id.</li><li>API signature (sign) must also be generated <strong>based on user_id</strong>.</li></ul></li><li><strong>Access Token &amp; Refresh Token Management</strong><ul><li>Tokens must be <strong>managed separately for each user_id</strong>.</li></ul></li></ul><p>&nbsp;</p><p>For detailed authorization and authentication flow, refer to the <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/developer-guide/669"><u>Livestream API Integration Guide</u></a>.</p><h2>6. Developer Integration Notes</h2><p>&nbsp;</p><ul><li>Only <strong>Shopee Video Management</strong> applications can access Video OpenAPI. Create the corresponding app type in the console before integration.</li><li><strong>Must agree to Shopee Video's Terms &amp; Conditions in Seller Center</strong> before performing any Video-related API operations.</li></ul>
```
