# Push Mechanism notifications

> **Source:** [https://open.shopee.com/developer-guide/18](https://open.shopee.com/developer-guide/18)
> **Type:** Developer Guide / Overview
> **document_id:** `18`
> **Section:** Getting Started

## Content

Push Mechanism notifications 
Subscribing to Shopee Open Platform Push Mechanism helps you get immediate notifications when a specific event occurs. This lets you receive timely updates without having to periodically poll the API endpoint. 
 
⚠️ Note: Push Mechanism on the Shopee Open Platform Console is equivalent to what’s commonly known as webhooks. 
 
Here’s an overview of how Push Mechanism works on Shopee Open Platform:
- You subscribe to a specific push type for your App and define a callback URL.
- The specific event, such as an order status update, happens.
- Shopee sends an HTTP POST request to the defined callback URL.
- You receive a notification via your defined callback URL.
 
⚠️ Note: Push Mechanism (webhooks) on Shopee Open Platform only notifies you that data for the specific event has changed. To get more updated information, make a call to the corresponding API. You’re encouraged to use both to enhance your systems’ integration efficiency. 
Understanding Push Mechanism notifications  
There are 5 categories of webhooks (Push) available on Shopee Open Platform:
- Shopee - Webhooks for shop authorization and important Shopee updates.
- Order - Webhooks for order status and tracking number updates.
- Marketing - Webhooks for tracking products’ promotional activities.
- Product - Webhooks for product information, violations, and brand registration process updates.  
- Chat - Webhook for chat updates from buyers.
 
Read more about these Push notifications below, ordered by popularity.
Shopee Push 
- Shop Authorization Push (https://open.shopee.com/push-mechanism/15) (Code:1) 
Get notified with the applicable list of shop and merchant IDs when the seller authorizes your App to access their shop(s)’ data. 
 
- Shop Authorization Canceled Push (https://open.shopee.com/push-mechanism/16) (Code:2) 
Get notified with the applicable list of shop and merchant IDs when the seller revokes their authorization for your App to access their shop(s)’ data. 
 
⚠️Notes
- Sellers can revoke authorizations via your App or Seller Centre.
- The 2 above-mentioned authorization webhooks are important for acquiring the applicable list of shop and merchant IDs when authorizations for multiple shops are revoked via the main account. Without these 2 webhooks, the callback address only returns the main account ID. 
 
- Open API Authorization Expiry Push (https://open.shopee.com/push-mechanism/12) (Code:12)
Get notified 7 days in advance with a list of shop and merchant IDs with expiring authorizations. You can then contact the seller(s) to authorize your App again. This will help prevent disruptions in your service caused by expired authorizations. 
 
⚠️Note: The seller’s authorization for your App to access their shop’s data is only valid for 1 year. After the authorization expires, the seller needs to authorize again.
 
- Shopee Updates (https://open.shopee.com/push-mechanism/3) (Code:5)
Get the latest important Shopee updates promptly. 
Order Push 
- Order Status Update Push (https://open.shopee.com/push-mechanism/1) (Code:3)
Get notified immediately on all order status updates. This includes order cancellations that occur before shipping, so that you can take the necessary steps in time.
 
- Order TrackingNo Push (https://open.shopee.com/push-mechanism/2) (Code:4)
Get notified immediately when order tracking numbers are updated so that you can ship promptly, and avoid having to query the v2.logistics.get_tracking_number (https://open.shopee.com/documents/v2/v2.logistics.get_tracking_number?module=95&type=1) API repeatedly. 
This can be useful when logistics partners take some time to update tracking numbers which may be required on shipping documents.
 
- Shipping_document_status_push (https://open.shopee.cn/push-mechanism/17)(Code:15)
Get notified immediately when shipping document status is "READY" or "FAILED", so that you don't need to call the v2.logistics.get_shipping_document_result (https://open.shopee.com/documents/v2/v2.logistics.get_shipping_document_result?module=95&type=1) API repeatedly to get shipping document status. 
 
Marketing Push 
- Item Promotion Push (https://open.shopee.com/push-mechanism/6) (Code:7)
Get updates on a product’s stock when it is affected by participation in campaigns or promotional events. You’ll also be notified when the product’s stock is no longer affected because the campaign or promotional event has ended or the product is no longer participating. 
 
- Promotion Update Push (https://open.shopee.com/push-mechanism/7) (Code:9)
Get updates on promotional activities, including when products are added to/removed from the promotional event or when there is an update to the promotion’s start/end time. 
Product Push 
- Reserved Stock Change Push (https://open.shopee.com/push-mechanism/5) (Code:8)
Get updates on how much reserved product stock was used for each promotional event, helping sellers to manage changes to their inventory. 
 
⚠️Note: Reserved (product) stock refers to the amount of a product reserved specially for a promotional event such as flash sales.
 
- Video Upload Push (https://open.shopee.com/push-mechanism/11) (Code:11)
Get updates on product video uploads that have been successfully transcoded. This is a useful webhook if you want to add or update product listings that include a video as you can only do so with successfully transcoded video files. 
 
When you have made an API call for v2.media_space.complete_video_upload (https://open.shopee.com/documents/v2/v2.media_space.complete_video_upload?module=91&type=1), wait for this Video Upload Push which will inform you whether the transcoding was successful. If the transcoding is successful, you can continue to add or update product listings with the video_upload_id..
 
- Banned Item Push (https://open.shopee.com/push-mechanism/4) (Code:6)
Get prompt updates on products banned by Shopee to find out the violation reason. 
 
- Brand Register Result Push (https://open.shopee.com/push-mechanism/13)(Code:13)
Get updates on the results of brand registration applications, including approved, rejected, or merged with an existing brand.
 
⚠️Note: Sellers can either register their brand via (i) the v2.product.register_brand (https://open.shopee.com/documents/v2/v2.product.register_brand?module=89&type=1) API or (ii) Seller Center for Shopee’s review. When setting up a product listing, sellers can then select the officially recognized brand.
Chat Push 
- Webchat Push (https://open.shopee.com/push-mechanism/10) (Code:10)：Chat information notification
Get notified immediately when the shops you support receive messages from buyers. 
Subscribing to Push Mechanism  
1.  Log in to Shopee Open Platform Console and access the Push Mechanism (https://open.shopee.com/myconsole/management/push) page. Select the relevant App > select Set Push. 
 
2. Fill in your callback URL > select Verify.
 
⚠️ Note: To verify the validity of your defined callback URL, Shopee will send an HTTP POST request to the callback URL. If it fails, you can view the reason in a red banner that appears on the Set Push page.
 
3. Upon successful verification of your callback URL, select the relevant Push  (webhooks) that you want to receive notifications for. 
⚠️ Note: You can manage the settings for Push via Shopee Open Platform Console (https://open.shopee.com/myconsole/management/push) or via the v2.push.set_push_config (https://open.shopee.com/documents/v2/v2.push.set_push_config?module=105&type=1) API.
 
The availability of Push notifications (webhooks) depends on your App type; refer to the table below for details: 
App TypeAvailable Push notificationsOriginalAll Push notifications except Brand Register Result Push (Code:13)ERP SystemAll Push notifications except Webchat Push (Code:10)Seller In-house SystemAll Push notificationsProduct ManagementShopee Push
- Shop Authorization Push  (Code:1)
- Shop Authorization Canceled Push  (Code:2)
- Open API Authorization Expiry Push (Code:12)
- Shopee Updates (Code:5)
Product Push
- Reserved Stock Change Push (Code:8)
- Video Upload Push (Code:11)
- Banned Item Push (Code:6)
- Brand Register Result Push (Code:13)
Marketing Push
- Item Promotion Info Push (Code:7)
- Promotion Update Push (Code:9)
Order ManagementShopee Push
- Shop Authorization Push  (Code:1)
- Shop Authorization Canceled Push  (Code:2)
- Open API Authorization Expiry Push (Code:12)
- Shopee Updates (Code:5)
Order Push
- Order Status Push (Code:3)
- Order TrackingNo Push (Code:4)
- Shipping Document Status Push (Code:15)
Accounting and FinanceShopee Push
- Shop Authorization Push  (Code:1)
- Shop Authorization Canceled Push  (Code:2)
- Open API Authorization Expiry Push (Code:12)
- Shopee Updates (Code:5)
MarketingShopee Push
- Shop Authorization Push  (Code:1)
- Shop Authorization Canceled Push  (Code:2)
- Open API Authorization Expiry Push (Code:12)
- Shopee Updates (Code:5)
Product Push
- Reserved Stock Change Push (Code:8)
- Banned Item Push (Code:6)
Marketing Push
- Item Promotion Info Push (Code:7)
- Promotion Update Push (Code:9)
Customer ServiceShopee Push
- Shop Authorization Push  (Code:1)
- Shop Authorization Canceled Push  (Code:2)
- Open API Authorization Expiry Push (Code:12)
- Shopee Updates (Code:5)
Chat Push
- Webchat Push  (Code:10)
 
4. (Optional) For developers with systems that only allow access for whitelisted IP addresses, use v2.public.get_shopee_ip_ranges (https://open.shopee.com/documents/v2/v2.public.get_shopee_ip_ranges?module=104&type=1) API to get Shopee's Open API IP addresses.
- If you’re testing, make an API call within the sandbox environment.
- If you’re already using the production environment, make an API call within the production environment.
Push Authorization 
To prevent cyberattacks, we have provided an authorization signature for each Push request, which can be located in the Authorization field of the HTTP request header. With this, you can identify Shopee's authorization information. 
 
This step is technically optional, but we strongly recommend that developers use the following steps to validate the request to generate the authorization signature, ensuring that it matches the authorization signature generated from the Push request. Here's how you can generate the signature:
 
1. Use URL, |, response.content as the signature base string. E.g:
 
‘http://www.example.com/example/uri|{“shop_id”: 123, “code”: 1, “success”: 1, “extra”: “shop_id 123 is authorized successfully”, “data”: {“more_info”: “more info”}, “timestamp”: 1470198856}’
 
Note that the json.loads(response.content) method is not recommended
 
2. Retrieve your partner key from your App details on Shopee Open Platform Console
 
3. Use the signature base string and partner key to generate the signature with the HMAC-SHA256 hashing algorithm. The output of the HMAC signature function is a binary string. This requires hex encoding to generate the signature string.
 
Code demo
 
Python:

import hmac

def verify_push_msg(url, request_body, partner_key, authorization):

    base_string = url + '|' + request_body

    cal_auth = hmac.new(partner_key, base_string, hashlib.sha256).hexdigest()

    if cal_auth != authorization:

        return False

    else:

        return True

 
Go:
package verify

import (

    "crypto/hmac"

    "crypto/sha256"

    "encoding/hex"

    "fmt"

)

 

 

func VerifyPushMsg(url, requestBody, partnerKey, authorization string) (result bool) {

    baseStr := url + "|" + requestBody

    h := hmac.New(sha256.New, []byte(partnerKey))

    h.Write([]byte(baseStr))

    calAuth := fmt.Sprintf("%x", h.Sum(nil))

    if authorization != calAuth {

        return false

    }

    return true

} 
Java:
import javax.crypto.Mac;

import javax.crypto.spec.SecretKeySpec;

import org.apache.commons.codec.binary.Hex;

import java.io.UnsupportedEncodingException;

import java.security.NoSuchAlgorithmException;

 

 

public static Boolean verfiyPushMsg(String url, String requestBody, String partnerKey, String authorization)

        throws NoSuchAlgorithmException, UnsupportedEncodingException, java.security.InvalidKeyException {

 

    String baseStr = url + "|" + requestBody;

    Mac sha256_HMAC = Mac.getInstance("HmacSHA256");

    SecretKeySpec secret_key = new SecretKeySpec(partnerKey.getBytes("UTF-8"), "HmacSHA256");

    sha256_HMAC.init(secret_key);

    String result = Hex.encodeHexString(sha256_HMAC.doFinal(baseStr.getBytes("UTF-8")));

    return result.equals(authorization);

}

Triggering Push Mechanism notifications  
Note that after subscribing to Push Mechanism notifications, and generating the authorization signature, you also have to ensure that the App Partner ID set for each Push notification is already authorized by the shop(s). If not, do complete shop authorization (https://open.shopee.com/developer-guide/20) first. 
 
If shop authorization is complete, you will be notified via Push Mechanism when the relevant events occur. 
Learn more about events that may trigger a Push Mechanism notification. (https://open.shopee.com/push-mechanism/4) Do note to ensure that your callback URL provides a response to our requests.
 
Blocking notifications from specific shops
If you don’t want to receive notifications for certain shops, you can do so with these methods:
- Use the blocked_shop_id field of the v2.push.set_push_config (https://open.shopee.com/documents/v2/v2.push.set_push_config?module=105&type=1) API (Block up to 500 shops).
- Fill in the list of Shop IDs on the Push Mechanism (https://open.shopee.com/myconsole/management/push) page on Shopee Open Platform Console. (Block up to 500 shops).
Push Mechanism Retry LogicTo avoid receiving repeated notifications from Push Mechanism, set up your callback URL to respond according to these HTTP response requirements:
- Includes a status code of 2xx. 
- Includes an empty body. 
 
⚠️ Note: All Pushes (webhooks) support a different maximum number of notifications and intervals for any repeated notifications. See the next section Push Mechanism Warning/Disable Logic for Apps that have a poor success rate for responding to notifications. 
View the Push Mechanism documentation (https://open.shopee.com/push-mechanism/4) for specific details.
Push Mechanism Warning/Disable Logic Shopee Open Platform has a warning/disable logic in place for Apps that have a poor success rate for responding to Push Mechanism notifications. For such Apps, we will take action accordingly. Warning emails will be sent to you or we may also eventually disable your subscription to Push Mechanism notifications. 
 
⚠️ Note: Success rate is calculated by comparing successful Push items versus failed Push items. A failed Push is defined as Shopee Open Platform not receiving an HTTP response with a status code of 2xx and an empty body within the timeout period. 
View the Push Mechanism documentation (https://open.shopee.com/push-mechanism/4) for specific details.
 
Here are the details for Push Mechanism warning and disabling actions: 
 
- Warning emails 
- You will receive a warning email every 30 minutes if:
- There have been more than 600 Push Mechanism notifications sent to you in the past 6 hours AND
- Your overall Push success rate is less than 70%.
- Warning emails will not be sent once your success rate returns to more than 70%.
 
- Disabling of subscription to Push Mechanism notifications
- Your subscription to Push Mechanism notifications will be disabled and you will receive a notification email if:
- There have been more than 600 Push Mechanism notifications sent to you in the past 6 hours AND
- Your overall Push success rate is less than 30%.
- You should check your callback URL and ensure that you’re ready to receive Push Mechanism notifications normally before subscribing again. 
 
⚠️ Notes
- After subscribing again, here are some important points to note:- You will not receive Push Mechanism notifications missed during the period where your subscription was disabled. 

- Success rate calculation of Push Mechanism notifications will be restarted based on records from your new subscription.
 
You can view the current Push Mechanism success rate and status through the Shopee Open Platform Console page.

## Content (raw HTML)

```html
<h1><span style="color:#2B2C2D;">Push Mechanism notifications</span></h1><p>&nbsp;</p><p>Subscribing to Shopee Open Platform Push Mechanism helps you get immediate notifications when a specific event occurs. This lets you receive timely updates without having to periodically poll the API endpoint.&nbsp;</p><p>&nbsp;</p><p>⚠️ <i>Note: <strong>Push Mechanism</strong> on the Shopee Open Platform Console is equivalent to what’s commonly known as webhooks.&nbsp;</i></p><p>&nbsp;</p><p>Here’s an overview of how Push Mechanism works on Shopee Open Platform:</p><ol><li>You subscribe to a specific push type for your App and define a callback URL.</li><li>The specific event, such as an order status update, happens.</li><li>Shopee sends an HTTP POST request to the defined callback URL.</li><li>You receive a notification via your defined callback URL.</li></ol><p>&nbsp;</p><p>⚠️ <i>Note: Push Mechanism (webhooks) on Shopee Open Platform only notifies you that data for the specific event has changed. To get more updated information, make a call to the corresponding API. You’re encouraged to use both to enhance your systems’ integration efficiency.&nbsp;</i></p><h1><span style="color:#2B2C2D;">Understanding Push Mechanism notifications&nbsp;</span></h1><p>&nbsp;</p><p class="indent-1">There are 5 categories of webhooks (Push) available on Shopee Open Platform:</p><ol><li><strong>Shopee</strong> - Webhooks for shop authorization and important Shopee updates.</li><li><strong>Order</strong> - Webhooks for order status and tracking number updates.</li><li><strong>Marketing</strong> - Webhooks for tracking products’ promotional activities.</li><li><strong>Product</strong> - Webhooks for product information, violations, and brand registration process updates.&nbsp;&nbsp;</li><li><strong>Chat</strong> - Webhook for chat updates from buyers.</li></ol><p>&nbsp;</p><p class="indent-1">Read more about these Push notifications below, ordered by popularity.</p><h2 class="indent-1"><span style="color:#2B2C2D;">Shopee Push</span></h2><p>&nbsp;</p><ul><li><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/push-mechanism/15"><strong><u>Shop Authorization Push</u></strong></a><strong> (Code:1)&nbsp;</strong></li></ul><p class="indent-1">Get notified with the applicable list of shop and merchant IDs when the seller authorizes your App to access their shop(s)’ data.<strong>&nbsp;</strong></p><p>&nbsp;</p><ul><li><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/push-mechanism/16"><strong><u>Shop Authorization Canceled Push</u></strong></a><strong> (Code:2)&nbsp;</strong></li></ul><p class="indent-1">Get notified with the applicable list of shop and merchant IDs when the seller revokes their authorization for your App to access their shop(s)’ data.&nbsp;</p><p>&nbsp;</p><p class="indent-1"><strong>⚠️</strong><i><strong>Notes</strong></i></p><ul><li><i>Sellers can revoke authorizations via your App or Seller Centre.</i></li><li><i>The 2 above-mentioned authorization webhooks are important for acquiring the applicable list of shop and merchant IDs when authorizations for multiple shops are revoked via the main account. Without these 2 webhooks, the callback address only returns the main account ID.&nbsp;</i></li></ul><p>&nbsp;</p><ul><li><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/push-mechanism/12"><strong><u>Open API Authorization Expiry Push</u></strong></a><strong> (Code:12)</strong></li></ul><p class="indent-1">Get notified 7 days in advance with a list of shop and merchant IDs with expiring authorizations. You can then contact the seller(s) to authorize your App again. This will help prevent disruptions in your service caused by expired authorizations.&nbsp;</p><p>&nbsp;</p><p class="indent-1">⚠️<i>Note: The seller’s authorization for your App to access their shop’s data is only valid for 1 year. After the authorization expires, the seller needs to authorize again.</i></p><p>&nbsp;</p><ul><li><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/push-mechanism/3"><strong><u>Shopee Updates</u></strong></a><strong> (Code:5)</strong></li></ul><p class="indent-1">Get the latest important Shopee updates promptly.&nbsp;</p><h2 class="indent-1"><span style="color:#2B2C2D;">Order Push</span></h2><p>&nbsp;</p><ul><li><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/push-mechanism/1"><strong><u>Order Status Update Push</u></strong></a><strong> (Code:3)</strong></li></ul><p class="indent-1">Get notified immediately on <strong>all</strong> order status updates. This includes order cancellations that occur before shipping, so that you can take the necessary steps in time.</p><p>&nbsp;</p><ul><li><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/push-mechanism/2"><strong><u>Order TrackingNo Push</u></strong></a><strong> (Code:4)</strong></li></ul><p class="indent-1">Get notified immediately when order tracking numbers are updated so that you can ship promptly, and avoid having to query the <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.logistics.get_tracking_number?module=95&amp;type=1"><u>v2.logistics.get_tracking_number</u></a> API repeatedly.&nbsp;</p><p class="indent-1">This can be useful when logistics partners take some time to update tracking numbers which may be required on shipping documents.</p><p class="indent-1">&nbsp;</p><ul><li><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.cn/push-mechanism/17"><strong><u>Shipping_document_status_push</u></strong></a><strong>(Code:15)</strong></li></ul><p class="indent-1">Get notified immediately when shipping document status is "READY" or "FAILED", so that you don't need to call the <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.logistics.get_shipping_document_result?module=95&amp;type=1"><u>v2.logistics.get_shipping_document_result</u></a> API repeatedly to get shipping document status.&nbsp;</p><p class="indent-1">&nbsp;</p><h2 class="indent-1"><span style="color:#2B2C2D;">Marketing Push</span></h2><p>&nbsp;</p><ul><li><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/push-mechanism/6"><strong><u>Item Promotion Push</u></strong></a><strong> (Code:7)</strong></li></ul><p class="indent-1">Get updates on a product’s stock when it is affected by participation in campaigns or promotional events. You’ll also be notified when the product’s stock is no longer affected because the campaign or promotional event has ended or the product is no longer participating.&nbsp;</p><p>&nbsp;</p><ul><li><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/push-mechanism/7"><strong><u>Promotion Update Push</u></strong></a><strong> (Code:9)</strong></li></ul><p class="indent-1">Get updates on promotional activities, including when products are added to/removed from the promotional event or when there is an update to the promotion’s start/end time.&nbsp;</p><h2 class="indent-1"><span style="color:#2B2C2D;">Product Push</span></h2><p>&nbsp;</p><ul><li><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/push-mechanism/5"><strong><u>Reserved Stock Change Push</u></strong></a><strong> (Code:8)</strong></li></ul><p class="indent-1">Get updates on how much reserved product stock was used for each promotional event, helping sellers to manage changes to their inventory.&nbsp;</p><p>&nbsp;</p><p class="indent-1">⚠️<i>Note: Reserved (product) stock refers to the amount of a product reserved specially for a promotional event such as flash sales.</i></p><p>&nbsp;</p><ul><li><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/push-mechanism/11"><strong><u>Video Upload Push</u></strong></a><strong> (Code:11)</strong></li></ul><p class="indent-1">Get updates on product video uploads that have been successfully transcoded. This is a useful webhook if you want to add or update product listings that include a video as you can only do so with successfully transcoded video files.&nbsp;</p><p>&nbsp;</p><p class="indent-1">When you have made an API call for <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.media_space.complete_video_upload?module=91&amp;type=1"><u>v2.media_space.complete_video_upload</u></a>, wait for this Video Upload Push which will inform you whether the transcoding was successful. If the transcoding is successful, you can continue to add or update product listings with the video_upload_id..</p><p>&nbsp;</p><ul><li><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/push-mechanism/4"><strong><u>Banned Item Push</u></strong></a><strong> (Code:6)</strong></li></ul><p class="indent-1">Get prompt updates on products banned by Shopee to find out the violation reason.&nbsp;</p><p>&nbsp;</p><ul><li><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/push-mechanism/13"><strong><u>Brand Register Result Push</u> </strong></a><strong>(Code:13)</strong></li></ul><p class="indent-1">Get updates on the results of brand registration applications, including approved, rejected, or merged with an existing brand.</p><p>&nbsp;</p><p class="indent-1">⚠️<i>Note: Sellers can either register their brand via (i) </i>the <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.product.register_brand?module=89&amp;type=1"><u>v2.product.register_brand</u></a> API<i> or (ii) Seller Center for Shopee’s review. When setting up a product listing, sellers can then select the officially recognized brand.</i></p><h2 class="indent-1"><span style="color:#2B2C2D;">Chat Push</span></h2><p>&nbsp;</p><ul><li><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/push-mechanism/10"><strong><u>Webchat Push</u></strong></a><strong> (Code:10)：Chat information notification</strong></li></ul><p class="indent-1">Get notified immediately when the shops you support receive messages from buyers.&nbsp;</p><h1><span style="color:#2B2C2D;">Subscribing to Push Mechanism&nbsp;</span></h1><p>&nbsp;</p><p>1. &nbsp;Log in to Shopee Open Platform Console and access the <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/myconsole/management/push"><u>Push Mechanism</u></a> page. Select the relevant App &gt; select <strong>Set Push</strong>.&nbsp;</p><figure class="image"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=LByXVHZXq6SBUpy4tVGWgJT8wAP4mWmLpHYoSJlw4LoJCKQgdhYcK%2BE%2B%2FeyxBcH%2FM8CU0julRslzMrpQBNipqA%3D%3D&amp;image_type=png"></figure><p>&nbsp;</p><p>2. Fill in your callback URL &gt; select <strong>Verify</strong>.</p><figure class="image"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=O3a7tqVErfvkqgYRE2nG9u4A22JZj04CsixJ%2FcWESzl0kwwH52cGuVsSIxEFWCdv9TZMlbUVdctovsA1cn8Unw%3D%3D&amp;image_type=png"></figure><p>&nbsp;</p><p>⚠️ <i>Note: To verify the validity of your defined callback URL, Shopee will send an HTTP POST request to the callback URL. If it fails, you can view the reason in a red banner that appears on the <strong>Set Push </strong>page.</i></p><p>&nbsp;</p><p>3. Upon successful verification of your callback URL, select the relevant Push&nbsp; (webhooks) that you want to receive notifications for.&nbsp;</p><figure class="image"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=jNbXbcRqCRulFjTQns1Xwt2Am2GdAGD9XNTom5CnGQZXogs6Y9wEiwDAx2hM2CKNn0NogcfD8%2BgqxwFecQ1tIQ%3D%3D&amp;image_type=png"></figure><p>⚠️ <i>Note: You can manage the settings for Push via </i><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/myconsole/management/push"><i><u>Shopee Open Platform Console</u></i></a><i> or via the </i><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.push.set_push_config?module=105&amp;type=1"><i><u>v2.push.set_push_config</u></i></a><i> API</i>.</p><p>&nbsp;</p><p>The availability of Push notifications (webhooks) depends on your App type; refer to the table below for details:&nbsp;</p><figure class="table"><table><thead><tr><th><strong>App Type</strong></th><th><strong>Available Push notifications</strong></th></tr></thead><tbody><tr><th>Original</th><td>All Push notifications except Brand Register Result Push <strong>(Code:13)</strong></td></tr><tr><th>ERP System</th><td>All Push notifications except Webchat Push <strong>(Code:10)</strong></td></tr><tr><th>Seller In-house System</th><td>All Push notifications</td></tr><tr><th>Product Management</th><td><p>Shopee Push</p><ul><li>Shop Authorization Push&nbsp;<strong> (Code:1)</strong></li><li>Shop Authorization Canceled Push&nbsp;<strong> (Code:2)</strong></li><li>Open API Authorization Expiry Push <strong>(Code:12)</strong></li><li>Shopee Updates <strong>(Code:5)</strong></li></ul><p>Product Push</p><ul><li>Reserved Stock Change Push <strong>(Code:8)</strong></li><li>Video Upload Push<strong> (Code:11)</strong></li><li>Banned Item Push <strong>(Code:6)</strong></li><li>Brand Register Result Push <strong>(Code:13)</strong></li></ul><p>Marketing Push</p><ul><li>Item Promotion Info Push <strong>(Code:7)</strong></li><li>Promotion Update Push <strong>(Code:9)</strong></li></ul></td></tr><tr><th>Order Management</th><td><p>Shopee Push</p><ul><li>Shop Authorization Push&nbsp;<strong> (Code:1)</strong></li><li>Shop Authorization Canceled Push&nbsp;<strong> (Code:2)</strong></li><li>Open API Authorization Expiry Push <strong>(Code:12)</strong></li><li>Shopee Updates <strong>(Code:5)</strong></li></ul><p>Order Push</p><ul><li>Order Status Push <strong>(Code:3)</strong></li><li>Order TrackingNo Push <strong>(Code:4)</strong></li><li>Shipping Document Status Push <strong>(Code:15)</strong></li></ul></td></tr><tr><th>Accounting and Finance</th><td><p>Shopee Push</p><ul><li>Shop Authorization Push&nbsp;<strong> (Code:1)</strong></li><li>Shop Authorization Canceled Push&nbsp;<strong> (Code:2)</strong></li><li>Open API Authorization Expiry Push <strong>(Code:12)</strong></li><li>Shopee Updates <strong>(Code:5)</strong></li></ul></td></tr><tr><th>Marketing</th><td><p>Shopee Push</p><ul><li>Shop Authorization Push&nbsp;<strong> (Code:1)</strong></li><li>Shop Authorization Canceled Push&nbsp;<strong> (Code:2)</strong></li><li>Open API Authorization Expiry Push <strong>(Code:12)</strong></li><li>Shopee Updates <strong>(Code:5)</strong></li></ul><p>Product Push</p><ul><li>Reserved Stock Change Push <strong>(Code:8)</strong></li><li>Banned Item Push <strong>(Code:6)</strong></li></ul><p>Marketing Push</p><ul><li>Item Promotion Info Push <strong>(Code:7)</strong></li><li>Promotion Update Push <strong>(Code:9)</strong></li></ul></td></tr><tr><th>Customer Service</th><td><p>Shopee Push</p><ul><li>Shop Authorization Push&nbsp;<strong> (Code:1)</strong></li><li>Shop Authorization Canceled Push&nbsp;<strong> (Code:2)</strong></li><li>Open API Authorization Expiry Push <strong>(Code:12)</strong></li><li>Shopee Updates <strong>(Code:5)</strong></li></ul><p>Chat Push</p><ul><li>Webchat Push&nbsp;<strong> (Code:10)</strong></li></ul></td></tr></tbody></table></figure><p>&nbsp;</p><p>4. (Optional) <strong>For developers with systems that only allow access for whitelisted IP addresses</strong>, <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.public.get_shopee_ip_ranges?module=104&amp;type=1"><u>use v2.public.get_shopee_ip_ranges</u></a> API to get <span style="background-color:rgb(255,255,255);">Shopee's Open API IP addresses</span>.</p><ul><li>If you’re testing, make an API call within the <strong>sandbox environment</strong>.</li><li>If you’re already using the production environment, make an API call within the <strong>production environment</strong>.</li></ul><h1><span style="color:#2B2C2D;">Push Authorization</span></h1><p>&nbsp;</p><p>To prevent cyberattacks, we have provided an authorization signature for each Push request, which can be located in the <strong>Authorization</strong> field of the HTTP request header. With this, you can identify Shopee's authorization information.&nbsp;</p><p>&nbsp;</p><p>This step is technically optional, but we strongly recommend that developers use the following steps to validate the request to generate the authorization signature, ensuring that it matches the authorization signature generated from the Push request. Here's how you can generate the signature:</p><p>&nbsp;</p><p>1. Use URL, |, response.content as the signature base string. E.g:</p><p>&nbsp;</p><p>‘http://www.example.com/example/uri|{“shop_id”: 123, “code”: 1, “success”: 1, “extra”: “shop_id 123 is authorized successfully”, “data”: {“more_info”: “more info”}, “timestamp”: 1470198856}’</p><p>&nbsp;</p><p><i>Note that the json.loads(response.content) method is not recommended</i></p><p>&nbsp;</p><p>2. Retrieve your partner key from your App details on Shopee Open Platform Console</p><p>&nbsp;</p><p>3. Use the signature base string and partner key to generate the signature with the HMAC-SHA256 hashing algorithm. The output of the HMAC signature function is a binary string. This requires hex encoding to generate the signature string.</p><p>&nbsp;</p><p>Code demo</p><p>&nbsp;</p><p><strong>Python:</strong></p><pre><code class="python hljs">

import hmac

def verify_push_msg(url, request_body, partner_key, authorization):

 &nbsp;&nbsp;&nbsp;base_string = url + '|' + request_body

 &nbsp;&nbsp;&nbsp;cal_auth = hmac.new(partner_key, base_string, hashlib.sha256).hexdigest()

 &nbsp;&nbsp; if cal_auth != authorization:

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; return False

 &nbsp;&nbsp; else:

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; return True

</code></pre><p>&nbsp;</p><p><strong>Go:</strong></p><pre><code class="go hljs">package verify

import (

 &nbsp;&nbsp; "crypto/hmac"

 &nbsp;&nbsp; "crypto/sha256"

 &nbsp;&nbsp; "encoding/hex"

 &nbsp;&nbsp; "fmt"

)

 

 

func VerifyPushMsg(url, requestBody, partnerKey, authorization string) (result bool) {

 &nbsp;&nbsp;&nbsp;baseStr := url + "|" + requestBody

 &nbsp;&nbsp;&nbsp;h := hmac.New(sha256.New, []byte(partnerKey))

 &nbsp;&nbsp;&nbsp;h.Write([]byte(baseStr))

 &nbsp;&nbsp;&nbsp;calAuth := fmt.Sprintf("%x", h.Sum(nil))

 &nbsp;&nbsp; if authorization != calAuth {

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; return false

 &nbsp;&nbsp;&nbsp;}

 &nbsp;&nbsp; return true

}</code></pre><p>&nbsp;</p><p><strong>Java:</strong></p><pre><code class="java hljs">import javax.crypto.Mac;

import javax.crypto.spec.SecretKeySpec;

import org.apache.commons.codec.binary.Hex;

import java.io.UnsupportedEncodingException;

import java.security.NoSuchAlgorithmException;

 

 

public static Boolean verfiyPushMsg(String url, String requestBody, String partnerKey, String authorization)

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; throws NoSuchAlgorithmException, UnsupportedEncodingException, java.security.InvalidKeyException {

 

 &nbsp;&nbsp; String baseStr = url + "|" + requestBody;

 &nbsp;&nbsp;&nbsp;Mac sha256_HMAC = Mac.getInstance("HmacSHA256");

 &nbsp;&nbsp;&nbsp;SecretKeySpec secret_key = new SecretKeySpec(partnerKey.getBytes("UTF-8"), "HmacSHA256");

 &nbsp;&nbsp;&nbsp;sha256_HMAC.init(secret_key);

 &nbsp;&nbsp; String result = Hex.encodeHexString(sha256_HMAC.doFinal(baseStr.getBytes("UTF-8")));

 &nbsp;&nbsp; return result.equals(authorization);

}



</code></pre><h1><span style="color:#2B2C2D;">Triggering Push Mechanism notifications&nbsp;</span></h1><p>&nbsp;</p><p>Note that after subscribing to Push Mechanism notifications, and generating the authorization signature, you also have to ensure that the App Partner ID set for each Push notification is already authorized by the shop(s). If not, do complete <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/developer-guide/20"><u>shop authorization</u></a> first.&nbsp;</p><p>&nbsp;</p><p>If shop authorization is complete, you will be notified via Push Mechanism when the relevant events occur.&nbsp;</p><p>Learn more about <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/push-mechanism/4"><u>events that may trigger a Push Mechanism notification</u>.</a> Do note to ensure that your callback URL provides a response to our requests.</p><p>&nbsp;</p><p>Blocking notifications from specific shops</p><p>If you don’t want to receive notifications for certain shops, you can do so with these methods:</p><ol><li>Use the blocked_shop_id field of the <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/documents/v2/v2.push.set_push_config?module=105&amp;type=1"><u>v2.push.set_push_config</u></a> API (Block up to 500 shops).</li><li>Fill in the list of Shop IDs on the <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/myconsole/management/push"><u>Push Mechanism</u></a> page on Shopee Open Platform Console. (Block up to 500 shops).</li></ol><figure class="image"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=bD3W6G6YezBAQb2W94zMhIVWQOaWi4Iq3kNeO3NQMlf%2BAcVc9%2FIHFi68P2tEJRF6rxYn%2Bcb48975NVNWmQHtZw%3D%3D&amp;image_type=png"></figure><h1><span style="color:#2B2C2D;">Push Mechanism Retry Logic</span></h1><p>To avoid receiving repeated notifications from Push Mechanism, set up your callback URL to respond according to these HTTP response requirements:</p><ul><li>Includes a status code of 2xx.&nbsp;</li><li>Includes an empty body.&nbsp;</li></ul><p>&nbsp;</p><p>⚠️ <i>Note: All Pushes (webhooks) support a different maximum number of notifications and intervals for any repeated notifications. See the next section <strong>Push Mechanism Warning/Disable Logic </strong>for Apps that have a poor success rate for responding to notifications.&nbsp;</i></p><p><i>View the </i><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/push-mechanism/4"><i><u>Push Mechanism documentation</u></i></a><i> for specific details.</i></p><h1><span style="color:#2B2C2D;">Push Mechanism Warning/Disable Logic&nbsp;</span></h1><p>Shopee Open Platform has a warning/disable logic in place for Apps that have a poor success rate for responding to Push Mechanism notifications. For such Apps, we will take action accordingly. Warning emails will be sent to you or we may also eventually disable your subscription to Push Mechanism notifications.&nbsp;</p><p>&nbsp;</p><p>⚠️ <i>Note: Success rate is calculated by comparing successful Push items versus failed Push items. A failed Push is defined as Shopee Open Platform not receiving an HTTP response with a status code of 2xx and an empty body within the timeout period.&nbsp;</i></p><p><i>View the </i><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/push-mechanism/4"><i><u>Push Mechanism documentation</u></i></a><i> for specific details.</i></p><p>&nbsp;</p><p>Here are the details for Push Mechanism warning and disabling actions:&nbsp;</p><p>&nbsp;</p><ul><li><strong>Warning emails&nbsp;</strong></li></ul><p class="indent-1">- You will receive a warning email every 30 minutes if:</p><ul><li>There have been more than 600 Push Mechanism notifications sent to you in the past 6 hours AND</li><li>Your overall Push success rate is less than 70%.</li></ul><p class="indent-1">- Warning emails will not be sent once your success rate returns to more than 70%.</p><p>&nbsp;</p><ul><li><strong>Disabling of subscription to Push Mechanism notifications</strong></li></ul><p class="indent-1">- Your subscription to Push Mechanism notifications will be disabled and you will receive a notification email if:</p><ul><li>There have been more than 600 Push Mechanism notifications sent to you in the past 6 hours AND</li><li>Your overall Push success rate is less than 30%.</li></ul><p class="indent-1">- You should check your callback URL and ensure that you’re ready to receive Push Mechanism notifications normally before subscribing again.&nbsp;</p><p>&nbsp;</p><p class="indent-1">⚠️ <i>Notes</i></p><ul><li><i>After subscribing again, here are some important points to note:</i><ul><li><i>You will not receive Push Mechanism notifications missed during the period where your subscription was disabled.&nbsp;</i></li></ul></li><li><i><strong>Success rate calculation of Push Mechanism notifications will be restarted based on records from your new subscription.</strong></i></li></ul><p>&nbsp;</p><p>You can view the current Push Mechanism success rate and status through the Shopee Open Platform Console page.</p><figure class="image"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=NUkuOId7WSgE0Zv%2Ft4Hijiof3GmP4HCs4ICyUiw5BLYgkgPDxr6doXrlR9Mwk7e4pexEvB%2Ba32vtPXXJ6LryvA%3D%3D&amp;image_type=png"></figure>
```
